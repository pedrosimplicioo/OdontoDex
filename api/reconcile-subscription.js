const { admin, db, requireSameUser, sendAuthError } = require("./_auth");
const { getExpectedPremiumPrice } = require("./_payment-access");

async function fetchMercadoPagoPreapproval(assinaturaId) {
  const response = await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(assinaturaId)}`, {
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
    const assinaturaId = req.body?.assinaturaId ? String(req.body.assinaturaId) : "";
    if (!assinaturaId) return res.status(400).json({ error: "assinaturaId obrigatorio" });
    if (!/^[A-Za-z0-9_-]{4,120}$/.test(assinaturaId)) {
      return res.status(400).json({ error: "assinaturaId invalido" });
    }

    const assinatura = await fetchMercadoPagoPreapproval(assinaturaId);
    if (String(assinatura.external_reference || "") !== uid) {
      console.warn("Tentativa de reconciliar assinatura de outro usuario", {
        uid,
        assinaturaId,
        externalReference: assinatura.external_reference || null,
      });
      return res.status(403).json({ error: "Assinatura nao pertence ao usuario autenticado" });
    }

    if (assinatura.status !== "authorized") {
      return res.status(200).json({ ok: true, status: assinatura.status, aguardando: true });
    }
    const amount = Number(assinatura?.auto_recurring?.transaction_amount);
    const currency = String(assinatura?.auto_recurring?.currency_id || "").toUpperCase();
    if (currency !== "BRL" || !Number.isFinite(amount) || Math.abs(amount - getExpectedPremiumPrice()) >= 0.01) {
      return res.status(422).json({ error: "Assinatura nao corresponde ao produto Premium" });
    }

    const userRef = db.collection("users").doc(uid);
    const eventRef = db.collection("webhook_events").doc(`subscription_reconcile_${assinaturaId}`);
    const outcome = await db.runTransaction(async transaction => {
      const [userDoc, eventDoc] = await Promise.all([
        transaction.get(userRef),
        transaction.get(eventRef),
      ]);
      const userData = userDoc.exists ? (userDoc.data() || {}) : {};
      const now = new Date();
      const currentExpiry = parseFirestoreDate(userData.premiumExpira);
      const sameSubscription = String(userData.assinaturaId || "") === assinaturaId
        || String(userData.ultimoPagamentoId || "") === assinaturaId;
      const activeSameSubscription = sameSubscription
        && userData.premium === true
        && currentExpiry
        && currentExpiry > now;

      if (activeSameSubscription) {
        if (!eventDoc.exists) {
          transaction.set(eventRef, {
            type: "subscription_reconcile",
            assinaturaId,
            uid,
            status: "authorized",
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
            alreadyActive: true,
          });
        }
        return { approved: true, alreadyActive: true };
      }

      // Uma autorização já aplicada e expirada não comprova uma nova cobrança.
      if (eventDoc.exists || sameSubscription) return { approved: false, needsSupport: true };

      const base = userData.premium === true && currentExpiry && currentExpiry > now ? currentExpiry : now;
      const nextExpiry = new Date(base);
      nextExpiry.setDate(nextExpiry.getDate() + 30);

      transaction.set(userRef, {
        email: userData.email || decodedToken.email || assinatura.payer_email || "",
        emailNormalizado: userData.emailNormalizado || String(decodedToken.email || assinatura.payer_email || "").trim().toLowerCase(),
        nome: userData.nome || decodedToken.name || "",
        perfil: userData.perfil || "dentista",
        tratamento: userData.tratamento !== undefined ? userData.tratamento : "",
        criadoEm: userData.criadoEm || new Date().toISOString(),
        dataPrimeiroAcesso: userData.dataPrimeiroAcesso || admin.firestore.FieldValue.serverTimestamp(),
        acessosPorDia: userData.acessosPorDia || {},
        termosAceitos: true,
        termosAceitosEm: userData.termosAceitosEm || admin.firestore.FieldValue.serverTimestamp(),
        termosVersao: userData.termosVersao || "1.0",
        privacidadeVersao: userData.privacidadeVersao || "1.1",
        origemCadastro: userData.origemCadastro || "pagamento",
        premium: true,
        premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
        premiumOrigem: "assinatura",
        premiumExpira: admin.firestore.Timestamp.fromDate(nextExpiry),
        ultimoPagamentoId: assinaturaId,
        assinaturaId,
        assinaturaStatus: "authorized",
        proximaCobranca: admin.firestore.Timestamp.fromDate(nextExpiry),
      }, { merge: true });
      transaction.set(eventRef, {
        type: "subscription_reconcile",
        assinaturaId,
        uid,
        status: "authorized",
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { approved: true, alreadyActive: false };
    });

    if (outcome.needsSupport) {
      return res.status(409).json({
        ok: false,
        status: "authorized",
        needsSupport: true,
        error: "Assinatura ja aplicada; uma nova cobranca precisa ser confirmada pelo suporte",
      });
    }

    return res.status(200).json({
      ok: true,
      status: "authorized",
      approved: true,
      assinaturaId,
      alreadyActive: outcome.alreadyActive === true,
    });
  } catch (e) {
    console.error("Erro reconcile-subscription:", e);
    return res.status(e.statusCode || 500).json({ error: "Nao foi possivel restaurar a assinatura agora" });
  }
};
