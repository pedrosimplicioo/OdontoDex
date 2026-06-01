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
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID obrigatório" });

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    const assinaturaId = userData?.assinaturaId;

    if (!assinaturaId) {
      return res.status(400).json({ error: "Nenhuma assinatura ativa encontrada" });
    }

    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${assinaturaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ status: "cancelled" }),
    });

    const resultado = await mpRes.json();
    console.log("Cancel response:", JSON.stringify(resultado));

    if (resultado.status !== "cancelled") {
      throw new Error("MP não confirmou cancelamento: " + JSON.stringify(resultado));
    }

    await db.collection("users").doc(uid).update({
      assinaturaStatus: "cancelled",
    });

    return res.status(200).json({ status: "cancelled" });

  } catch (e) {
    console.error("Erro cancel-subscription:", e);
    return res.status(500).json({ error: e.message });
  }
};
