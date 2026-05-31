const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
    }),
  });
}
const db = admin.firestore();
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://adm.odontodex.com.br');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { uid, premium, dias } = req.body;
    if (!uid) return res.status(400).json({ error: "UID obrigatório" });
    if (premium === false) {
      const docRef = db.collection("users").doc(uid);
      await docRef.update({ premium: false });
      await docRef.update({ ultimoPagamentoId: admin.firestore.FieldValue.delete() });
    } else {
      const expira = new Date();
      expira.setDate(expira.getDate() + (dias || 30));
      const updates = {
        premium: true,
        premiumExpira: admin.firestore.Timestamp.fromDate(expira),
        premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
      };
      if ((dias || 30) <= 7) {
        updates.mensagemPendente = 'trial_manual';
      } else {
        updates.ultimoPagamentoId = `manual_${Date.now()}`;
      }
      await db.collection("users").doc(uid).update(updates);
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
