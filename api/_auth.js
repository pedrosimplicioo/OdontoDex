const admin = require("firebase-admin");

function initFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
      }),
    });
  }
  return admin;
}

const firebaseAdmin = initFirebaseAdmin();
const db = firebaseAdmin.firestore();

function setCors(req, res, origin = "https://adm.odontodex.com.br") {
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}

function getBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || "";
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

async function verifyFirebaseToken(req) {
  const token = getBearerToken(req);
  if (!token) {
    const error = new Error("Authorization ausente");
    error.status = 401;
    throw error;
  }
  try {
    return await firebaseAdmin.auth().verifyIdToken(token);
  } catch (e) {
    const error = new Error("Token inválido");
    error.status = 401;
    throw error;
  }
}

async function requireAdmin(req) {
  const decodedToken = await verifyFirebaseToken(req);
  const adminUids = String(process.env.ADMIN_UIDS || "")
    .split(",")
    .map(uid => uid.trim())
    .filter(Boolean);
  const adminEmails = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  if (!adminUids.length && !adminEmails.length) {
    console.error("ADMIN_UIDS/ADMIN_EMAILS não configurado");
    const error = new Error("Admin não configurado");
    error.status = 500;
    throw error;
  }

  const tokenEmail = String(decodedToken.email || "").trim().toLowerCase();
  const isAdminUid = adminUids.includes(decodedToken.uid);
  const isAdminEmail = tokenEmail && adminEmails.includes(tokenEmail);

  if (!isAdminUid && !isAdminEmail) {
    console.warn("Acesso admin negado", { uid: decodedToken.uid, email: tokenEmail });
    const error = new Error("Acesso negado");
    error.status = 403;
    throw error;
  }

  return decodedToken;
}

async function requireSameUser(req, bodyUid) {
  const decodedToken = await verifyFirebaseToken(req);
  if (bodyUid && bodyUid !== decodedToken.uid) {
    console.warn("UID divergente em pagamento", { tokenUid: decodedToken.uid, bodyUid });
    const error = new Error("UID não corresponde ao usuário autenticado");
    error.status = 403;
    throw error;
  }
  return decodedToken;
}

function sendAuthError(res, error) {
  const status = error.status || 500;
  return res.status(status).json({ error: error.message || "Erro de autenticação" });
}

module.exports = {
  admin: firebaseAdmin,
  db,
  setCors,
  verifyFirebaseToken,
  requireAdmin,
  requireSameUser,
  sendAuthError,
};
