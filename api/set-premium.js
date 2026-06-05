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
    const { uid, premium, dias } = req.body;
    if (!uid) return res.status(400).json({ error: "UID obrigatório" });
    if (premium === false) {
      const docRef = db.collection("users").doc(uid);
      await docRef.update({ premium: false });
      await docRef.update({ ultimoPagamentoId: admin.firestore.FieldValue.delete() });
      await docRef.update({ premiumOrigem: admin.firestore.FieldValue.delete() });
    } else {
      const expira = new Date();
      expira.setDate(expira.getDate() + (dias || 30));
      const updates = {
        premium: true,
        premiumExpira: admin.firestore.Timestamp.fromDate(expira),
        premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
        premiumOrigem: "manual",
      };
      if ((dias || 30) <= 7) {
        updates.mensagemPendente = "trial_manual";
      } else {
        updates.ultimoPagamentoId = `manual_${Date.now()}`;
      }
      await db.collection("users").doc(uid).update(updates);
    }
    console.log("Admin set-premium executado", { targetUid: uid });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
