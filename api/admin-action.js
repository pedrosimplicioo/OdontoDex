const { admin, db, setCors, requireAdmin, sendAuthError } = require("./_auth");

async function setPremium(body) {
  const { uid, premium, dias } = body;
  if (!uid) throw new Error("UID obrigatorio");

  if (premium === false) {
    const docRef = db.collection("users").doc(uid);
    await docRef.update({ premium: false });
    await docRef.update({ ultimoPagamentoId: admin.firestore.FieldValue.delete() });
    await docRef.update({ premiumOrigem: admin.firestore.FieldValue.delete() });
    return;
  }

  const expira = new Date();
  expira.setDate(expira.getDate() + (dias || 30));
  const updates = {
    premium: true,
    premiumExpira: admin.firestore.Timestamp.fromDate(expira),
    premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
    premiumOrigem: "manual",
  };
  if ((dias || 30) <= 7) {
    updates.mensagemPendente = "trial_manual";
  } else {
    updates.ultimoPagamentoId = `manual_${Date.now()}`;
  }
  await db.collection("users").doc(uid).update(updates);
}

async function expirePremium(body) {
  const { uid } = body;
  if (!uid) throw new Error("UID obrigatorio");
  await db.collection("users").doc(uid).update({
    premium: false,
    premiumOrigem: admin.firestore.FieldValue.delete(),
  });
}

async function setTestUser(body) {
  const { uid, isTest } = body;
  if (!uid) throw new Error("UID obrigatorio");
  await db.collection("users").doc(uid).update({ isTest: isTest === true });
}

async function setRepasse(body) {
  const { cupom, mes, status } = body;
  if (!cupom || !mes) throw new Error("Cupom e mes obrigatorios");
  await db.collection("repasses").doc(`${cupom}_${mes}`).set({
    cupom,
    mes,
    status: status || "pago",
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
}

async function createCupom(body) {
  const { codigo, nome, pixKey, valorRepasse, email } = body;
  if (!codigo || !nome) throw new Error("Codigo e nome obrigatorios");
  const codigoUpper = codigo.toUpperCase().trim();
  const existing = await db.collection("CUPONS").doc(codigoUpper).get();
  if (existing.exists) {
    const err = new Error("Cupom ja existe");
    err.statusCode = 400;
    throw err;
  }

  await db.collection("CUPONS").doc(codigoUpper).set({
    nome,
    email: email || null,
    ativo: true,
    conversoes: 0,
    pixKey: pixKey || null,
    valorRepasse: valorRepasse || 3.00,
    criadoem: new Date().toISOString().split("T")[0],
  });
}

async function updateCupom(body) {
  const { codigo, nome, email, pixKey, valorRepasse, ativo } = body;
  if (!codigo) throw new Error("Codigo obrigatorio");
  const updates = {};
  if (nome !== undefined) updates.nome = nome;
  if (email !== undefined) updates.email = email;
  if (pixKey !== undefined) updates.pixKey = pixKey;
  if (valorRepasse !== undefined) updates.valorRepasse = valorRepasse;
  if (ativo !== undefined) updates.ativo = ativo;
  await db.collection("CUPONS").doc(codigo.toUpperCase()).update(updates);
}

const actions = {
  "set-premium": setPremium,
  "expire-premium": expirePremium,
  "set-test-user": setTestUser,
  "set-repasse": setRepasse,
  "create-cupom": createCupom,
  "update-cupom": updateCupom,
};

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await requireAdmin(req);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const { action, ...body } = req.body || {};
    const handler = actions[action];
    if (!handler) return res.status(400).json({ error: "Acao administrativa invalida" });
    await handler(body);
    console.log("Admin action executada", { action });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(e.statusCode || 500).json({ error: e.message });
  }
};
