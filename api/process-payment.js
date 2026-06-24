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
      if (!payment.id) throw new Error("Pagamento aprovado sem ID retornado pelo Mercado Pago");
      const agora = new Date();
      const expira = new Date(agora);
      expira.setDate(expira.getDate() + 30);
      const paymentId = String(payment.id);
      const eventRef = db.collection("webhook_events").doc(`direct_payment_${paymentId}`);
      const userRef = db.collection("users").doc(uid);

      const processed = await db.runTransaction(async tx => {
        const eventDoc = await tx.get(eventRef);
        if (eventDoc.exists) return false;
        const userDoc = await tx.get(userRef);
        const userData = userDoc.exists ? (userDoc.data() || {}) : {};

        tx.set(eventRef, {
          type: "direct_payment",
          paymentId,
          uid,
          status: payment.status,
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        tx.set(userRef, {
          email: userData.email || email || decodedToken.email || "",
          emailNormalizado: userData.emailNormalizado || String(email || decodedToken.email || "").trim().toLowerCase(),
          nome: userData.nome || decodedToken.name || "",
          perfil: userData.perfil || "dentista",
          tratamento: userData.tratamento !== undefined ? userData.tratamento : "",
          criadoEm: userData.criadoEm || new Date().toISOString(),
          dataPrimeiroAcesso: userData.dataPrimeiroAcesso || admin.firestore.FieldValue.serverTimestamp(),
          acessosPorDia: userData.acessosPorDia || {},
          termosAceitos: userData.termosAceitos === true ? true : true,
          termosAceitosEm: userData.termosAceitosEm || admin.firestore.FieldValue.serverTimestamp(),
          termosVersao: userData.termosVersao || "1.0",
          privacidadeVersao: userData.privacidadeVersao || "1.1",
          origemCadastro: userData.origemCadastro || "pagamento",
          premium: true,
          premiumExpira: admin.firestore.Timestamp.fromDate(expira),
          premiumAtivadoEm: admin.firestore.Timestamp.fromDate(agora),
          premiumOrigem: "pagamento",
          ultimoPagamentoId: paymentId,
        }, { merge: true });

        return true;
      });

      if (processed) {
        console.log("Premium ativado por pagamento direto", { uid, paymentId });
      } else {
        console.log("Pagamento direto duplicado ignorado", { uid, paymentId });
      }
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
