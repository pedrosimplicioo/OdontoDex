const { db, setCors, requireAdmin, sendAuthError } = require("./_auth");

module.exports = async (req, res) => {
  if (setCors(req, res)) return;
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    await requireAdmin(req);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "UID obrigatório" });

    await db.collection("users").doc(uid).update({ premium: false });

    console.log("Admin expire-premium executado", { targetUid: uid });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Erro expire-premium:", e);
    return res.status(500).json({ error: e.message });
  }
};
