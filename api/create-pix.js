const { admin, db, requireSameUser, sendAuthError } = require("./_auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await requireSameUser(req, req.body?.uid);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const { email, nome, cupom } = req.body;
    const uid = decodedToken.uid;

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
          email: email || decodedToken.email,
          first_name: nome || "Usuario",
        },
        metadata: { uid, email: email || decodedToken.email || "" },
        external_reference: uid,
      }),
    });

    const payment = await mpRes.json();

    if (!payment.point_of_interaction?.transaction_data) {
      throw new Error("QR Code não gerado: " + JSON.stringify(payment));
    }

    await db.collection("pix_pendentes").doc(String(payment.id)).set({
      paymentId: String(payment.id),
      uid,
      email: email || decodedToken.email || "",
      premiumOrigem: "pix",
      cupom: cupom || null,
      criadoEm: admin.firestore.FieldValue.serverTimestamp(),
    });

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
