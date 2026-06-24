const crypto = require("crypto");
const { admin, db, setCors, verifyFirebaseToken, sendAuthError } = require("./_auth");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function trialClaimIdForEmail(email) {
  return "sha256_" + crypto.createHash("sha256").update(email).digest("hex");
}

function toDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function hasActivePaidPremium(userData) {
  const paidOrigins = new Set(["pagamento", "assinatura", "pix", "manual"]);
  const origin = userData?.premiumOrigem;
  if (userData?.premium !== true || !paidOrigins.has(origin)) return false;
  const expiresAt = toDate(userData?.premiumExpira);
  return !expiresAt || expiresAt > new Date();
}

function getRequestBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch (_) { return {}; }
  }
  return req.body;
}

function cleanText(value, maxLength = 120) {
  return String(value || "").trim().slice(0, maxLength);
}

function buildProfileRepairData({ authUser, decodedToken, email, fallback = {}, current = {} }) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const displayName = cleanText(authUser.displayName || decodedToken.name || "");
  const name = cleanText(fallback.nome || current.nome || displayName || email.split("@")[0]);
  const perfil = fallback.perfil === "estudante" ? "estudante" : "dentista";
  const tratamento = perfil === "estudante" ? "" : cleanText(fallback.tratamento || current.tratamento || "");

  const data = {
    email,
    emailNormalizado: email,
    nome: name,
    perfil,
    tratamento,
    ultimoAcesso: now,
  };

  if (!current.criadoEm) data.criadoEm = new Date().toISOString();
  if (!current.dataPrimeiroAcesso) data.dataPrimeiroAcesso = now;
  if (!current.acessosPorDia) data.acessosPorDia = {};
  if (current.premium !== true) data.premium = false;
  if (!current.premiumOrigem) data.premiumOrigem = "free";
  if (current.trialAtivado !== true) data.trialAtivado = false;
  if (current.emailVerificado !== true) data.emailVerificado = false;

  if (fallback.termosAceitos === true || current.termosAceitos === true) {
    data.termosAceitos = true;
    if (!current.termosAceitosEm) data.termosAceitosEm = now;
    data.termosVersao = current.termosVersao || "1.0";
    data.privacidadeVersao = current.privacidadeVersao || "1.1";
    data.origemCadastro = current.origemCadastro || fallback.origemCadastro || "google";
  }

  return data;
}

module.exports = async (req, res) => {
  if (setCors(req, res, "https://www.odontodex.com.br")) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await verifyFirebaseToken(req);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const body = getRequestBody(req);
    const profileFallback = body.profileFallback && typeof body.profileFallback === "object"
      ? body.profileFallback
      : null;
    const uid = decodedToken.uid;
    const authUser = await admin.auth().getUser(uid);
    if (authUser.emailVerified !== true) {
      return res.status(403).json({ ok: false, status: "email_not_verified", error: "Email não verificado" });
    }

    const email = normalizeEmail(authUser.email || decodedToken.email);
    if (!email) return res.status(400).json({ ok: false, error: "Email ausente" });

    const userRef = db.collection("users").doc(uid);
    const claimRef = db.collection("trialClaims").doc(trialClaimIdForEmail(email));
    const premiumExpiraDate = new Date();
    premiumExpiraDate.setDate(premiumExpiraDate.getDate() + 7);
    const premiumExpira = admin.firestore.Timestamp.fromDate(premiumExpiraDate);

    const existingProfile = await userRef.get();
    if (!existingProfile.exists) {
      if (!profileFallback?.termosAceitos) {
        return res.status(409).json({ ok: false, status: "profile_missing", error: "Perfil do usuÃ¡rio ainda nÃ£o foi criado" });
      }
      await userRef.set(buildProfileRepairData({ authUser, decodedToken, email, fallback: profileFallback }));
    } else if (profileFallback?.termosAceitos) {
      const currentProfile = existingProfile.data() || {};
      if (!currentProfile.perfil || !currentProfile.nome || !currentProfile.termosAceitos) {
        await userRef.set(buildProfileRepairData({
          authUser,
          decodedToken,
          email,
          fallback: profileFallback,
          current: currentProfile,
        }), { merge: true });
      }
    }

    const result = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        return { status: "profile_missing" };
      }

      const userData = userDoc.data() || {};
      const alreadyTrial = userData.trialAtivado === true || userData.premiumOrigem === "trial";
      const paidActive = hasActivePaidPremium(userData);

      if (paidActive) {
        transaction.update(userRef, {
          emailNormalizado: email,
          emailVerificado: true,
          emailVerificadoEm: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { status: "paid_active" };
      }

      if (alreadyTrial) {
        transaction.update(userRef, {
          trialAtivado: true,
          emailNormalizado: email,
          emailVerificado: true,
          emailVerificadoEm: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { status: "user_trial_used" };
      }

      const claimDoc = await transaction.get(claimRef);
      if (claimDoc.exists) {
        transaction.update(userRef, {
          emailVerificado: true,
          emailVerificadoEm: admin.firestore.FieldValue.serverTimestamp(),
          emailNormalizado: email,
          trialAtivado: false,
          premium: false,
          premiumOrigem: "free",
        });
        return { status: "email_trial_used" };
      }

      transaction.update(userRef, {
        premium: true,
        premiumOrigem: "trial",
        premiumExpira,
        trialAtivado: true,
        trialAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
        emailVerificado: true,
        emailVerificadoEm: admin.firestore.FieldValue.serverTimestamp(),
        emailNormalizado: email,
      });
      transaction.set(claimRef, {
        uid,
        email,
        trialAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
        premiumExpira,
        origem: "trial_email_verificado",
      });
      return { status: "activated", premiumExpira: premiumExpiraDate.toISOString() };
    });

    if (result.status === "profile_missing") {
      return res.status(409).json({ ok: false, status: result.status, error: "Perfil do usuário ainda não foi criado" });
    }

    return res.status(200).json({ ok: true, ...result });
  } catch (e) {
    console.error("activate-trial error", e);
    return res.status(500).json({ ok: false, error: e.message || "Erro ao ativar trial" });
  }
};
