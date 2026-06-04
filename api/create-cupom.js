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
    const { codigo, nome, pixKey, valorRepasse, email } = req.body;
    if (!codigo || !nome) return res.status(400).json({ error: "Código e nome obrigatórios" });
    const codigoUpper = codigo.toUpperCase().trim();
    const existing = await db.collection("CUPONS").doc(codigoUpper).get();
    if (existing.exists) return res.status(400).json({ error: "Cupom já existe" });

    await db.collection("CUPONS").doc(codigoUpper).set({
      nome,
      email: email || null,
      ativo: true,
      conversoes: 0,
      pixKey: pixKey || null,
      valorRepasse: valorRepasse || 3.00,
      criadoem: new Date().toISOString().split("T")[0],
    });
    console.log("Admin create-cupom executado", { codigo: codigoUpper });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
