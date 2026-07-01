const { requireSameUser, sendAuthError } = require("./_auth");
const {
  FAILED_PAYMENT_STATUSES,
  PENDING_PAYMENT_STATUSES,
  activateApprovedPaymentAccess,
  fetchMercadoPagoPayment,
  paymentBelongsToUser,
} = require("./_payment-access");

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
    const paymentId = req.body?.paymentId ? String(req.body.paymentId) : "";
    if (!paymentId) return res.status(400).json({ error: "paymentId obrigatorio" });
    if (!/^\d{4,30}$/.test(paymentId)) {
      return res.status(400).json({ error: "paymentId invalido" });
    }

    const payment = await fetchMercadoPagoPayment(paymentId);
    if (!paymentBelongsToUser(payment, uid)) {
      console.warn("Tentativa de reconciliar paymentId de outro usuario", {
        uid,
        paymentId,
        metadataUid: payment?.metadata?.uid || null,
        externalReference: payment?.external_reference || null,
      });
      return res.status(403).json({ error: "Pagamento nao pertence ao usuario autenticado" });
    }

    const status = String(payment.status || "");
    if (status === "approved") {
      const activation = await activateApprovedPaymentAccess({
        uid,
        paymentId,
        payment,
        eventPrefix: "payment",
        eventType: "payment_reconcile",
        source: "reconcile_payment",
        emailFallback: decodedToken.email || "",
      });

      if (activation.duplicate === true) {
        return res.status(409).json({
          ok: false,
          status,
          needsSupport: true,
          error: "Pagamento ja aplicado anteriormente",
        });
      }

      return res.status(200).json({
        ok: true,
        status,
        approved: true,
        processed: activation.processed === true,
        alreadyActive: activation.alreadyActive === true,
        premiumOrigem: activation.premiumOrigem,
      });
    }

    if (PENDING_PAYMENT_STATUSES.has(status)) {
      return res.status(200).json({ ok: true, status, aguardando: true });
    }

    if (FAILED_PAYMENT_STATUSES.has(status)) {
      return res.status(200).json({ ok: false, status, falha: true });
    }

    return res.status(200).json({ ok: true, status, aguardando: true });
  } catch (e) {
    console.error("Erro reconcile-payment:", e);
    return res.status(e.statusCode || 500).json({ error: "Nao foi possivel restaurar o pagamento agora" });
  }
};
