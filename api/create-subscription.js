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
    const { email, token, cupom } = req.body;
    const uid = decodedToken.uid;
    if (!token) return res.status(400).json({ error: "Token obrigatório" });

    const mpRes = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        preapproval_plan_id: null,
        reason: "OdontoDex Premium",
        external_reference: uid,
        payer_email: email || decodedToken.email,
        card_token_id: token,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 9.90,
          currency_id: "BRL",
        },
        back_url: "https://www.odontodex.com.br",
        status: "authorized",
      }),
    });
    const assinatura = await mpRes.json();
    console.log("Preapproval response:", { id: assinatura.id, status: assinatura.status, uid });
    if (!assinatura.id) {
      throw new Error("Falha ao criar assinatura: " + JSON.stringify(assinatura));
    }

    const agora = new Date();
    const expira = new Date(agora);
    expira.setDate(expira.getDate() + 30);

    await db.collection("users").doc(uid).update({
      premium: true,
      premiumExpira: admin.firestore.Timestamp.fromDate(expira),
      premiumAtivadoEm: admin.firestore.Timestamp.fromDate(agora),
      ultimoPagamentoId: assinatura.id,
      assinaturaId: assinatura.id,
      assinaturaStatus: "authorized",
      proximaCobranca: admin.firestore.Timestamp.fromDate(expira),
    });

    if (cupom) {
      await db.collection("conversoes_cupom").add({
        cupom,
        userId: uid,
        userEmail: email || decodedToken.email || "",
        valor: 3.00,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      await db.collection("CUPONS").doc(cupom).update({
        conversoes: admin.firestore.FieldValue.increment(1),
      });
    }

    return res.status(200).json({
      status: "authorized",
      assinaturaId: assinatura.id,
    });
  } catch (e) {
    console.error("Erro create-subscription:", e);
    return res.status(500).json({ error: e.message });
  }
};
