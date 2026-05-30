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
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { codigo, nome, pixKey, valorRepasse, ativo } = req.body;
    if (!codigo) return res.status(400).json({ error: "Código obrigatório" });

    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (pixKey !== undefined) updates.pixKey = pixKey;
    if (valorRepasse !== undefined) updates.valorRepasse = valorRepasse;
    if (ativo !== undefined) updates.ativo = ativo;

    await db.collection("CUPONS").doc(codigo.toUpperCase()).update(updates);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
