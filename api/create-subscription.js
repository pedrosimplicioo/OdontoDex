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
    const { uid, email, token } = req.body;
    if (!uid || !token) return res.status(400).json({ error: "UID e token obrigatórios" });

    // Cria a assinatura recorrente no Mercado Pago
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
        payer_email: email,
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
    console.log("Preapproval response:", JSON.stringify(assinatura));

    if (!assinatura.id) {
      throw new Error("Falha ao criar assinatura: " + JSON.stringify(assinatura));
    }

    // Calcula expiração inicial (30 dias)
    const agora = new Date();
    const expira = new Date(agora);
    expira.setDate(expira.getDate() + 30);

    // Grava no Firestore
    await db.collection("users").doc(uid).update({
      premium: true,
      premiumExpira: admin.firestore.Timestamp.fromDate(expira),
      premiumAtivadoEm: admin.firestore.Timestamp.fromDate(agora),
      ultimoPagamentoId: assinatura.id,
      assinaturaId: assinatura.id,
      assinaturaStatus: "authorized",
      proximaCobranca: admin.firestore.Timestamp.fromDate(expira),
    });

    return res.status(200).json({
      status: "authorized",
      assinaturaId: assinatura.id,
    });

  } catch (e) {
    console.error("Erro create-subscription:", e);
    return res.status(500).json({ error: e.message });
  }
};
