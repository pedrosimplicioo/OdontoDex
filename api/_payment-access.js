const { admin, db } = require("./_auth");

const FAILED_PAYMENT_STATUSES = new Set(["rejected", "cancelled", "canceled", "refunded", "charged_back"]);
const PENDING_PAYMENT_STATUSES = new Set(["pending", "in_process"]);

function getExpectedPremiumPrice() {
  const configured = Number(process.env.PREMIUM_PRICE_BRL || 9.90);
  return Number.isFinite(configured) && configured > 0 ? configured : 9.90;
}

function isExpectedPremiumPayment(payment) {
  const amount = Number(payment?.transaction_amount);
  const currency = String(payment?.currency_id || "").toUpperCase();
  return currency === "BRL"
    && Number.isFinite(amount)
    && Math.abs(amount - getExpectedPremiumPrice()) < 0.01;
}

function paymentBelongsToUser(payment, uid) {
  const metadataUid = payment?.metadata?.uid ? String(payment.metadata.uid) : "";
  const externalReference = payment?.external_reference ? String(payment.external_reference) : "";
  return metadataUid === uid || externalReference === uid;
}

function getPaymentUid(payment) {
  return payment?.metadata?.uid ? String(payment.metadata.uid) : String(payment?.external_reference || "");
}

async function fetchMercadoPagoPayment(paymentId) {
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  const json = await response.json();
  if (!response.ok) {
    const error = new Error(`Mercado Pago API error ${response.status}: ${JSON.stringify(json)}`);
    error.statusCode = response.status === 404 ? 404 : 502;
    throw error;
  }
  return json;
}

function parseFirestoreDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getNextPremiumExpiry(userData, paymentId, days = 30) {
  const now = new Date();
  const currentExpiry = parseFirestoreDate(userData?.premiumExpira);
  const samePaymentAlreadyApplied = String(userData?.ultimoPagamentoId || "") === String(paymentId);

  if (samePaymentAlreadyApplied) {
    return currentExpiry && currentExpiry > now ? currentExpiry : now;
  }

  const base = userData?.premium === true && currentExpiry && currentExpiry > now ? currentExpiry : now;
  const expiresAt = new Date(base);
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt;
}

function isPaymentAlreadyActive(userData, paymentId) {
  const expiresAt = parseFirestoreDate(userData?.premiumExpira);
  return (
    String(userData?.ultimoPagamentoId || "") === String(paymentId) &&
    userData?.premium === true &&
    expiresAt &&
    expiresAt > new Date()
  );
}

function buildPremiumUserData({ userData, payment, uid, paymentId, premiumOrigem, expiresAt, emailFallback = "" }) {
  const email = userData.email || payment?.payer?.email || payment?.metadata?.email || emailFallback || "";
  return {
    email,
    emailNormalizado: userData.emailNormalizado || String(email).trim().toLowerCase(),
    nome: userData.nome || "",
    perfil: userData.perfil || "dentista",
    tratamento: userData.tratamento !== undefined ? userData.tratamento : "",
    criadoEm: userData.criadoEm || new Date().toISOString(),
    dataPrimeiroAcesso: userData.dataPrimeiroAcesso || admin.firestore.FieldValue.serverTimestamp(),
    acessosPorDia: userData.acessosPorDia || {},
    termosAceitos: userData.termosAceitos === true ? true : true,
    termosAceitosEm: userData.termosAceitosEm || admin.firestore.FieldValue.serverTimestamp(),
    termosVersao: userData.termosVersao || "1.0",
    privacidadeVersao: userData.privacidadeVersao || "1.1",
    origemCadastro: userData.origemCadastro || "pagamento",
    premium: true,
    premiumExpira: admin.firestore.Timestamp.fromDate(expiresAt),
    premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
    premiumOrigem,
    ultimoPagamentoId: String(paymentId),
    ultimoPagamentoUid: uid,
  };
}

async function recordCouponConversion({ paymentId, cupom, uid, payment }) {
  if (!cupom) return;

  try {
    const conversionRef = db.collection("conversoes_cupom").doc(`payment_${paymentId}`);
    const couponRef = db.collection("CUPONS").doc(String(cupom));

    await db.runTransaction(async tx => {
      const conversionDoc = await tx.get(conversionRef);
      if (conversionDoc.exists) return;

      tx.set(conversionRef, {
        cupom,
        userId: uid,
        userEmail: payment?.payer?.email || payment?.metadata?.email || "",
        valor: 3.00,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      tx.update(couponRef, {
        conversoes: admin.firestore.FieldValue.increment(1),
      });
    });
  } catch (error) {
    console.error("Falha ao registrar conversao de cupom sem bloquear Premium", {
      paymentId: String(paymentId),
      cupom,
      message: error.message,
    });
  }
}

async function activateApprovedPaymentAccess({
  uid,
  paymentId,
  payment = {},
  premiumOrigem,
  eventPrefix = "payment",
  eventType = "payment",
  source = "reconcile",
  emailFallback = "",
}) {
  if (!uid) throw new Error("UID obrigatorio para ativar Premium");
  if (!paymentId) throw new Error("paymentId obrigatorio para ativar Premium");
  if (String(payment?.status || "") !== "approved" || !isExpectedPremiumPayment(payment)) {
    const error = new Error("Pagamento nao corresponde ao produto Premium");
    error.statusCode = 422;
    throw error;
  }

  const userRef = db.collection("users").doc(String(uid));
  const pixRef = db.collection("pix_pendentes").doc(String(paymentId));
  const eventRef = db.collection("webhook_events").doc(`${eventPrefix}_${paymentId}`);

  const result = await db.runTransaction(async tx => {
    const eventDoc = await tx.get(eventRef);
    const userDoc = await tx.get(userRef);
    const pixDoc = await tx.get(pixRef);
    const userData = userDoc.exists ? (userDoc.data() || {}) : {};

    if (isPaymentAlreadyActive(userData, paymentId)) {
      return {
        processed: false,
        alreadyActive: true,
        premiumOrigem: userData.premiumOrigem || premiumOrigem || "pagamento",
        expiresAt: parseFirestoreDate(userData.premiumExpira),
        cupom: pixDoc.exists ? pixDoc.data()?.cupom : null,
      };
    }

    if (String(userData?.ultimoPagamentoId || "") === String(paymentId)) {
      return {
        processed: false,
        duplicate: true,
        appliedButInactive: true,
        premiumOrigem: userData.premiumOrigem || premiumOrigem || "pagamento",
        expiresAt: parseFirestoreDate(userData.premiumExpira),
        cupom: pixDoc.exists ? pixDoc.data()?.cupom : null,
      };
    }

    if (eventDoc.exists) {
      return {
        processed: false,
        duplicate: true,
        premiumOrigem: userData.premiumOrigem || premiumOrigem || "pagamento",
        expiresAt: parseFirestoreDate(userData.premiumExpira),
        cupom: pixDoc.exists ? pixDoc.data()?.cupom : null,
      };
    }

    const resolvedOrigin = premiumOrigem || (pixDoc.exists ? "pix" : "pagamento");
    const expiresAt = getNextPremiumExpiry(userData, paymentId);

    tx.set(eventRef, {
      type: eventType,
      paymentId: String(paymentId),
      uid: String(uid),
      status: payment?.status || "approved",
      premiumOrigem: resolvedOrigin,
      source,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.set(userRef, buildPremiumUserData({
      userData,
      payment,
      uid: String(uid),
      paymentId,
      premiumOrigem: resolvedOrigin,
      expiresAt,
      emailFallback,
    }), { merge: true });

    return {
      processed: true,
      premiumOrigem: resolvedOrigin,
      expiresAt,
      cupom: pixDoc.exists ? pixDoc.data()?.cupom : null,
    };
  });

  if (result.processed && result.cupom) {
    await recordCouponConversion({ paymentId, cupom: result.cupom, uid, payment });
  }

  return result;
}

module.exports = {
  FAILED_PAYMENT_STATUSES,
  PENDING_PAYMENT_STATUSES,
  activateApprovedPaymentAccess,
  fetchMercadoPagoPayment,
  getExpectedPremiumPrice,
  getPaymentUid,
  isExpectedPremiumPayment,
  paymentBelongsToUser,
};
