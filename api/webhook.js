const crypto = require("crypto");
const { admin, db } = require("./_auth");
const {
  activateApprovedPaymentAccess,
  fetchMercadoPagoPayment,
  getPaymentUid,
} = require("./_payment-access");

function getRequestDataId(req) {
  const url = new URL(req.url || "", "https://www.odontodex.com.br");
  return (
    url.searchParams.get("data.id") ||
    url.searchParams.get("id") ||
    req.query?.["data.id"] ||
    req.query?.id ||
    req.body?.data?.id ||
    ""
  );
}

function parseMercadoPagoSignature(signatureHeader) {
  return String(signatureHeader || "")
    .split(",")
    .map(part => part.trim().split("="))
    .reduce((acc, [key, value]) => {
      if (key && value) acc[key] = value;
      return acc;
    }, {});
}

function validateMercadoPagoSignature(req) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    const error = new Error("MP_WEBHOOK_SECRET não configurado");
    error.status = 500;
    throw error;
  }

  const signatureHeader = req.headers["x-signature"];
  const requestId = req.headers["x-request-id"];
  const dataId = getRequestDataId(req);
  const signature = parseMercadoPagoSignature(signatureHeader);

  if (!signatureHeader || !requestId || !signature.ts || !signature.v1 || !dataId) {
    const error = new Error("Assinatura do webhook ausente ou incompleta");
    error.status = 401;
    throw error;
  }

  if (!/^[a-f0-9]{64}$/i.test(signature.v1)) {
    const error = new Error("Assinatura do webhook inválida");
    error.status = 403;
    throw error;
  }

  const manifest = `id:${dataId};request-id:${requestId};ts:${signature.ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(signature.v1, "hex");

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    const error = new Error("Assinatura do webhook inválida");
    error.status = 403;
    throw error;
  }

  return { dataId, requestId };
}

async function fetchMercadoPago(path) {
  const response = await fetch(`https://api.mercadopago.com/${path}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(`Mercado Pago API error ${response.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

async function processApprovedPayment(paymentId, payment) {
  const uid = getPaymentUid(payment);
  if (!uid) {
    console.log("UID não encontrado em payment aprovado", { paymentId });
    return { ok: true, msg: "UID not found" };
  }

  const activation = await activateApprovedPaymentAccess({
    uid,
    paymentId,
    payment,
    eventPrefix: "payment",
    eventType: "payment",
    source: "webhook",
  });

  if (!activation.processed) {
    console.log("Webhook payment duplicado ignorado", { paymentId });
    return { ok: true, duplicate: true, alreadyActive: activation.alreadyActive === true };
  }

  console.log("Webhook payment processado", { paymentId, uid });
  return { ok: true, uid, expiresAt: activation.expiresAt };

  const pixRef = db.collection("pix_pendentes").doc(String(paymentId));
  const eventRef = db.collection("webhook_events").doc(`payment_${paymentId}`);
  const userRef = db.collection("users").doc(uid);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const processed = await db.runTransaction(async tx => {
    const eventDoc = await tx.get(eventRef);
    if (eventDoc.exists) return false;

    const pixDoc = await tx.get(pixRef);
    const userDoc = await tx.get(userRef);
    const userData = userDoc.exists ? (userDoc.data() || {}) : {};
    const premiumOrigem = pixDoc.exists ? "pix" : "pagamento";
    tx.set(eventRef, {
      type: "payment",
      paymentId: String(paymentId),
      uid,
      status: payment.status,
      premiumOrigem,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.set(userRef, {
      email: userData.email || payment.payer?.email || "",
      emailNormalizado: userData.emailNormalizado || String(payment.payer?.email || "").trim().toLowerCase(),
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
    }, { merge: true });

    if (pixDoc.exists && pixDoc.data().cupom) {
      const cupom = pixDoc.data().cupom;
      const conversionRef = db.collection("conversoes_cupom").doc(`payment_${paymentId}`);
      tx.set(conversionRef, {
        cupom,
        userId: uid,
        userEmail: payment.payer?.email || "",
        valor: 3.00,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      tx.update(db.collection("CUPONS").doc(cupom), {
        conversoes: admin.firestore.FieldValue.increment(1),
      });
    }

    return true;
  });

  if (!processed) {
    console.log("Webhook payment duplicado ignorado", { paymentId });
    return { ok: true, duplicate: true };
  }

  console.log("Webhook payment processado", { paymentId, uid });
  return { ok: true, uid, expiresAt };
}

async function processAuthorizedSubscriptionPayment(invoiceId, invoice) {
  const assinaturaId = invoice.preapproval_id;
  const snapshot = await db.collection("users")
    .where("assinaturaId", "==", assinaturaId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log("Usuário não encontrado para assinaturaId", { assinaturaId });
    return { ok: true, msg: "User not found" };
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data() || {};
  const eventRef = db.collection("webhook_events").doc(`subscription_${invoiceId}`);
  const now = new Date();
  const atualExpira = userData?.premiumExpira?.toDate
    ? userData.premiumExpira.toDate()
    : (userData?.premiumExpira ? new Date(userData.premiumExpira) : null);
  const baseExpiracao = atualExpira && !Number.isNaN(atualExpira.getTime()) && atualExpira > now
    ? atualExpira
    : now;
  const novaExpiracao = new Date(baseExpiracao);
  novaExpiracao.setDate(novaExpiracao.getDate() + 30);

  const processed = await db.runTransaction(async tx => {
    const eventDoc = await tx.get(eventRef);
    if (eventDoc.exists) return false;

    tx.set(eventRef, {
      type: "subscription_authorized_payment",
      invoiceId: String(invoiceId),
      assinaturaId,
      uid: userDoc.id,
      status: invoice.status,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    tx.update(userDoc.ref, {
      premium: true,
      premiumExpira: admin.firestore.Timestamp.fromDate(novaExpiracao),
      premiumOrigem: "assinatura",
      ultimoPagamentoId: String(invoiceId),
      proximaCobranca: admin.firestore.Timestamp.fromDate(novaExpiracao),
    });

    return true;
  });

  if (!processed) {
    console.log("Webhook assinatura duplicado ignorado", { invoiceId });
    return { ok: true, duplicate: true };
  }

  console.log("Assinatura renovada", { uid: userDoc.id, invoiceId });
  return { ok: true };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    validateMercadoPagoSignature(req);

    const { type, data } = req.body;
    console.log("Webhook Mercado Pago validado", { type, dataId: data?.id });

    if (type === "payment") {
      const paymentId = data?.id;
      if (!paymentId) return res.status(400).json({ error: "Payment ID missing" });

      const payment = await fetchMercadoPagoPayment(paymentId);
      if (payment.status !== "approved") {
        return res.status(200).json({ ok: true, status: payment.status });
      }

      const result = await processApprovedPayment(paymentId, payment);
      return res.status(200).json(result);
    }

    if (type === "subscription_authorized_payment") {
      const invoiceId = data?.id;
      if (!invoiceId) return res.status(200).json({ ok: true });

      const invoice = await fetchMercadoPago(`authorized_payments/${invoiceId}`);
      if (invoice.status !== "processed") {
        return res.status(200).json({ ok: true, status: invoice.status });
      }

      const result = await processAuthorizedSubscriptionPayment(invoiceId, invoice);
      return res.status(200).json(result);
    }

    if (type === "preapproval" || type === "subscription_preapproval") {
      const assinaturaId = data?.id;
      if (!assinaturaId) return res.status(200).json({ ok: true });

      const assinatura = await fetchMercadoPago(`preapproval/${assinaturaId}`);
      const snapshot = await db.collection("users")
        .where("assinaturaId", "==", assinaturaId)
        .limit(1)
        .get();

      if (snapshot.empty) return res.status(200).json({ ok: true, msg: "User not found" });

      await snapshot.docs[0].ref.update({ assinaturaStatus: assinatura.status });
      console.log("Status da assinatura atualizado", { uid: snapshot.docs[0].id, status: assinatura.status });
      return res.status(200).json({ ok: true });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    const status = error.status || 500;
    console.error("Erro no webhook:", { status, message: error.message });
    return res.status(status).json({ error: error.message });
  }
};
