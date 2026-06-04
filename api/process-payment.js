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
    const { uid: bodyUid, email, ...formData } = req.body;
    const uid = decodedToken.uid;

    const mpRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": `${uid}-${Date.now()}`,
      },
      body: JSON.stringify({
        ...formData,
        metadata: { uid, email: email || decodedToken.email || "" },
      }),
    });

    const payment = await mpRes.json();
    console.log("Payment status:", { status: payment.status, paymentId: payment.id, uid });

    if (payment.status === "approved") {
      const agora = new Date();
      const expira = new Date(agora);
      expira.setDate(expira.getDate() + 30);

      await db.collection("users").doc(uid).update({
        premium: true,
        premiumExpira: admin.firestore.Timestamp.fromDate(expira),
        premiumAtivadoEm: admin.firestore.Timestamp.fromDate(agora),
        ultimoPagamentoId: payment.id,
      });

      console.log("Premium ativado por pagamento direto", { uid, paymentId: payment.id });
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
