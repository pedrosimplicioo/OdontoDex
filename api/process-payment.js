const { admin, db, requireSameUser, sendAuthError } = require("./_auth");
const { activateApprovedPaymentAccess, getExpectedPremiumPrice } = require("./_payment-access");

function cleanPaymentMethod(value) {
  const method = String(value || "").trim();
  return /^[a-z0-9_-]{1,40}$/i.test(method) ? method : "";
}

function cleanIdentification(value) {
  const type = String(value?.type || "").trim().toUpperCase();
  const number = String(value?.number || "").replace(/\D/g, "");
  if (!/^[A-Z]{2,10}$/.test(type) || !/^\d{5,20}$/.test(number)) return null;
  return { type, number };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await requireSameUser(req, req.body?.uid);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const uid = decodedToken.uid;
    const userEmail = String(decodedToken.email || "").trim().toLowerCase();
    const token = String(req.body?.token || req.body?.card_token_id || req.body?.card_token || "").trim();
    const paymentMethodId = cleanPaymentMethod(req.body?.payment_method_id);
    const identification = cleanIdentification(req.body?.payer?.identification);

    if (!userEmail) return res.status(400).json({ error: "Email autenticado obrigatorio" });
    if (!token) return res.status(400).json({ error: "Token do cartao obrigatorio" });
    if (!paymentMethodId) return res.status(400).json({ error: "Meio de pagamento invalido" });

    const payer = { email: userEmail };
    if (identification) payer.identification = identification;
    const paymentPayload = {
      transaction_amount: getExpectedPremiumPrice(),
      token,
      description: "OdontoDex Premium - 30 dias",
      installments: 1,
      payment_method_id: paymentMethodId,
      payer,
      notification_url: "https://www.odontodex.com.br/api/webhook",
      external_reference: uid,
      metadata: { uid, email: userEmail },
    };
    const issuerId = String(req.body?.issuer_id || "").trim();
    if (/^\d{1,20}$/.test(issuerId)) paymentPayload.issuer_id = issuerId;

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `${uid}-${Date.now()}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const payment = await mpRes.json();
    if (!mpRes.ok) {
      console.error("Mercado Pago recusou a criacao do pagamento", {
        uid,
        statusCode: mpRes.status,
        status: payment?.status || null,
        causeCodes: Array.isArray(payment?.cause) ? payment.cause.map(cause => cause?.code).filter(Boolean) : [],
      });
      return res.status(502).json({ error: "Nao foi possivel processar o pagamento" });
    }
    console.log("Payment status:", { status: payment.status, paymentId: payment.id, uid });

    if (payment.status === "approved") {
      if (!payment.id) throw new Error("Pagamento aprovado sem ID retornado pelo Mercado Pago");
      const paymentId = String(payment.id);

      try {
        const activation = await activateApprovedPaymentAccess({
          uid,
          paymentId,
          payment,
          premiumOrigem: "pagamento",
          eventPrefix: "direct_payment",
          eventType: "direct_payment",
          source: "process_payment",
          emailFallback: userEmail,
        });

        if (activation.processed) {
          console.log("Premium ativado por pagamento direto", { uid, paymentId });
        } else {
          console.log("Pagamento direto duplicado ignorado", { uid, paymentId });
        }
      } catch (activationError) {
        console.error("Pagamento aprovado, mas acesso ficou pendente", {
          uid,
          paymentId,
          message: activationError.message,
        });
        return res.status(202).json({
          status: payment.status,
          paymentId,
          accessPending: true,
          retryable: true,
          error: "Pagamento aprovado, mas o acesso ainda nao foi gravado. Tente restaurar o acesso em alguns instantes.",
        });
      }
    }

    return res.status(200).json({
      status: payment.status,
      paymentId: payment.id,
    });
  } catch (e) {
    console.error("Erro process-payment:", e);
    return res.status(500).json({ error: "Nao foi possivel processar o pagamento" });
  }
};
