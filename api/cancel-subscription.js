const { db, requireSameUser, sendAuthError } = require("./_auth");

function toDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  return new Date(value);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await requireSameUser(req, req.body?.uid);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const uid = decodedToken.uid;

    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    const assinaturaId = userData?.assinaturaId;

    if (!assinaturaId) {
      const expira = toDate(userData?.premiumExpira);
      const hasPaidAccess = userData?.premium === true && !!userData?.ultimoPagamentoId && expira && expira > new Date();
      if (hasPaidAccess) {
        console.log("Cancelamento sem assinatura recorrente; acesso pago preservado", { uid });
        return res.status(200).json({
          status: "no_subscription_paid_access",
          accessUntil: expira.toISOString(),
        });
      }
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
    console.log("Cancel response:", { status: resultado.status, uid });

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
