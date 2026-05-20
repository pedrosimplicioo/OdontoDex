const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
    }),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { uid, email, ...formData } = req.body;
    if (!uid) return res.status(400).json({ error: "UID obrigatório" });

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `${uid}-${Date.now()}`,
      },
      body: JSON.stringify({
        ...formData,
        metadata: { uid, email },
      }),
    });

    const payment = await mpRes.json();
    console.log("Payment status:", payment.status, payment.id);

    if (payment.status === "approved") {
      await db.collection("users").doc(uid).update({ premium: true });
    }

    return res.status(200).json({
      status: payment.status,
      paymentId: payment.id,
    });
  } catch (e) {
    console.error("Erro process-payment:", e);
    return res.status(500).json({ error: e.message });
  }
};
