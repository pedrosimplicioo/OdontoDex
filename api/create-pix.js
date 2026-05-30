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

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  try {
    const { uid, email, nome } = req.body;
    if (!uid) return res.status(400).json({ error: "UID obrigatório" });

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `pix-${uid}-${Date.now()}`,
      },
      body: JSON.stringify({
        transaction_amount: 9.90,
        description: "OdontoDex Premium - 1 mês",
        payment_method_id: "pix",
        payer: {
          email: email,
          first_name: nome || "Usuario",
        },
        metadata: { uid, email },
      }),
    });

    const payment = await mpRes.json();
    
    if (!payment.point_of_interaction?.transaction_data) {
      throw new Error("QR Code não gerado: " + JSON.stringify(payment));
    }

    return res.status(200).json({
      paymentId: payment.id,
      qrCode: payment.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
    });

  } catch (e) {
    console.error("Erro create-pix:", e);
    return res.status(500).json({ error: e.message });
  }
};
