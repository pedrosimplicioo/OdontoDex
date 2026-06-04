const { admin, db, setCors, requireAdmin, sendAuthError } = require("./_auth");

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await requireAdmin(req);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const { cupom, mes, status } = req.body;
    if (!cupom || !mes) return res.status(400).json({ error: "Cupom e mês obrigatórios" });
    await db.collection("repasses").doc(`${cupom}_${mes}`).set({
      cupom,
      mes,
      status: status || "pago",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    console.log("Admin set-repasse executado", { cupom, mes });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
