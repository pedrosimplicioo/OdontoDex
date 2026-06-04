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
    const { codigo, nome, email, pixKey, valorRepasse, ativo } = req.body;
    if (!codigo) return res.status(400).json({ error: "Código obrigatório" });
    const updates = {};
    if (nome !== undefined) updates.nome = nome;
    if (email !== undefined) updates.email = email;
    if (pixKey !== undefined) updates.pixKey = pixKey;
    if (valorRepasse !== undefined) updates.valorRepasse = valorRepasse;
    if (ativo !== undefined) updates.ativo = ativo;
    await db.collection("CUPONS").doc(codigo.toUpperCase()).update(updates);
    console.log("Admin update-cupom executado", { codigo: codigo.toUpperCase() });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
