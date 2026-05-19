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
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    }),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, data } = req.body;

    if (type !== "payment") {
      return res.status(200).json({ ok: true });
    }

    const paymentId = data?.id;
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID missing" });
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await mpResponse.json();

    if (payment.status !== "approved") {
      return res.status(200).json({ ok: true, status: payment.status });
    }

    const uid = payment.metadata?.uid;
    if (!uid) {
      return res.status(400).json({ error: "UID not found in metadata" });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.collection("users").doc(uid).update({
      premium: true,
      subscriptionStatus: "active",
      subscriptionExpiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      lastPaymentId: String(paymentId),
      lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true, uid, expiresAt });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ error: error.message });
  }
};
