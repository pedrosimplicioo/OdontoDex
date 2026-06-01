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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, data } = req.body;
    console.log("Webhook recebido:", type, data);

    // ─── PAGAMENTO AVULSO (Pix ou cartão único) ───────────────────
    if (type === "payment") {
      const paymentId = data?.id;
      if (!paymentId) return res.status(400).json({ error: "Payment ID missing" });

      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
      );
      const payment = await mpResponse.json();
      console.log("Payment data:", JSON.stringify(payment));

      if (payment.status !== "approved") {
        return res.status(200).json({ ok: true, status: payment.status });
      }

      const uid = payment.metadata?.uid || payment.external_reference;
      if (!uid) {
        console.log("UID não encontrado. Metadata:", JSON.stringify(payment.metadata));
        return res.status(200).json({ ok: true, msg: "UID not found" });
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await db.collection("users").doc(uid).update({
        premium: true,
        premiumExpira: admin.firestore.Timestamp.fromDate(expiresAt),
        premiumAtivadoEm: admin.firestore.FieldValue.serverTimestamp(),
        ultimoPagamentoId: String(paymentId),
      });

      // Registra conversão do cupom se houver
      const pixDoc = await db.collection("pix_pendentes").doc(String(paymentId)).get();
      if (pixDoc.exists && pixDoc.data().cupom) {
        const cupom = pixDoc.data().cupom;
        await db.collection("conversoes_cupom").add({
          cupom,
          userId: uid,
          userEmail: payment.payer?.email || "",
          valor: 3.00,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        await db.collection("CUPONS").doc(cupom).update({
          conversoes: admin.firestore.FieldValue.increment(1),
        });
      }

      return res.status(200).json({ ok: true, uid, expiresAt });
    }

    // ─── COBRANÇA MENSAL DA ASSINATURA ────────────────────────────
    if (type === "subscription_authorized_payment") {
      const invoiceId = data?.id;
      if (!invoiceId) return res.status(200).json({ ok: true });

      const mpResponse = await fetch(
        `https://api.mercadopago.com/authorized_payments/${invoiceId}`,
        { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
      );
      const invoice = await mpResponse.json();
      console.log("Invoice data:", JSON.stringify(invoice));

      if (invoice.status !== "processed") {
        return res.status(200).json({ ok: true, status: invoice.status });
      }

      // Busca o usuário pelo assinaturaId
      const assinaturaId = invoice.preapproval_id;
      const snapshot = await db.collection("users")
        .where("assinaturaId", "==", assinaturaId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        console.log("Usuário não encontrado para assinaturaId:", assinaturaId);
        return res.status(200).json({ ok: true, msg: "User not found" });
      }

      const userDoc = snapshot.docs[0];
      const novaExpiracao = new Date();
      novaExpiracao.setDate(novaExpiracao.getDate() + 30);

      await userDoc.ref.update({
        premium: true,
        premiumExpira: admin.firestore.Timestamp.fromDate(novaExpiracao),
        ultimoPagamentoId: String(invoiceId),
        proximaCobranca: admin.firestore.Timestamp.fromDate(novaExpiracao),
      });

      console.log(`Assinatura renovada para ${userDoc.id} até ${novaExpiracao}`);
      return res.status(200).json({ ok: true });
    }

    // ─── MUDANÇA DE STATUS DA ASSINATURA ──────────────────────────
    if (type === "preapproval" || type === "subscription_preapproval") {
      const assinaturaId = data?.id;
      if (!assinaturaId) return res.status(200).json({ ok: true });

      const mpResponse = await fetch(
        `https://api.mercadopago.com/preapproval/${assinaturaId}`,
        { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
      );
      const assinatura = await mpResponse.json();
      console.log("Preapproval data:", JSON.stringify(assinatura));

      const snapshot = await db.collection("users")
        .where("assinaturaId", "==", assinaturaId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(200).json({ ok: true, msg: "User not found" });
      }

      const userDoc = snapshot.docs[0];

      // Se cancelada ou pausada → não corta o acesso, só atualiza o status
      await userDoc.ref.update({
        assinaturaStatus: assinatura.status,
      });

      console.log(`Status da assinatura atualizado para ${assinatura.status} — usuário ${userDoc.id}`);
      return res.status(200).json({ ok: true });
    }

    // Evento não tratado — retorna 200 para o MP não retentar
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return res.status(500).json({ error: error.message });
  }
};
