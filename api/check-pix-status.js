const { admin, db, requireSameUser, sendAuthError } = require("./_auth");

const PENDING_STATUSES = new Set(["pending", "in_process"]);
const FAILED_STATUSES = new Set(["rejected", "cancelled", "canceled", "refunded", "charged_back"]);

async function fetchMercadoPagoPayment(paymentId) {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`Mercado Pago API error ${response.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

function paymentBelongsToUser(payment, uid) {
  const metadataUid = payment?.metadata?.uid ? String(payment.metadata.uid) : "";
  const externalReference = payment?.external_reference ? String(payment.external_reference) : "";
  return metadataUid === uid || externalReference === uid;
}

async function activatePixPremium(uid, paymentId, status) {
  const agora = new Date();
  const expira = new Date(agora);
  expira.setDate(expira.getDate() + 30);

  const eventRef = db.collection("pix_check_events").doc(`payment_${paymentId}`);
  const userRef = db.collection("users").doc(uid);

  return db.runTransaction(async tx => {
    const eventDoc = await tx.get(eventRef);
    if (eventDoc.exists) return false;

    tx.set(eventRef, {
      type: "pix_status_check",
      paymentId: String(paymentId),
      uid,
      status,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.update(userRef, {
      premium: true,
      premiumOrigem: "pix",
      ultimoPagamentoId: String(paymentId),
      premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
      premiumExpira: admin.firestore.Timestamp.fromDate(expira),
    });

    return true;
  });
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
    const paymentId = req.body?.paymentId ? String(req.body.paymentId) : "";
    if (!paymentId) return res.status(400).json({ error: "paymentId obrigatorio" });

    const payment = await fetchMercadoPagoPayment(paymentId);
    if (!paymentBelongsToUser(payment, uid)) {
      console.warn("Pix paymentId nao pertence ao usuario autenticado", {
        uid,
        paymentId,
        metadataUid: payment?.metadata?.uid || null,
        externalReference: payment?.external_reference || null,
      });
      return res.status(403).json({ error: "Pagamento nao pertence ao usuario autenticado" });
    }

    const status = String(payment.status || "");

    if (status === "approved") {
      const processed = await activatePixPremium(uid, paymentId, status);
      return res.status(200).json({ ok: true, status, approved: true, processed });
    }

    if (PENDING_STATUSES.has(status)) {
      return res.status(200).json({ ok: true, status, aguardando: true });
    }

    if (FAILED_STATUSES.has(status)) {
      return res.status(200).json({ ok: false, status, falha: true });
    }

    return res.status(200).json({ ok: true, status, aguardando: true });
  } catch (e) {
    console.error("Erro check-pix-status:", e);
    return res.status(500).json({ error: e.message });
  }
};
