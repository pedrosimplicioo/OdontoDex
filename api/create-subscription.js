const { admin, db, requireSameUser, sendAuthError } = require("./_auth");

function normalizarCupom(cupom) {
  return String(cupom || "").trim().toUpperCase();
}

async function validarCupomAtivo(cupom) {
  const codigo = normalizarCupom(cupom);
  if (!codigo) return "";

  const doc = await db.collection("CUPONS").doc(codigo).get();
  if (!doc.exists || doc.data()?.ativo !== true) {
    const erro = new Error("Cupom invalido ou inativo");
    erro.statusCode = 400;
    throw erro;
  }

  return codigo;
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
    const { email, token, cupom } = req.body;
    const uid = decodedToken.uid;
    if (!token) return res.status(400).json({ error: "Token obrigatório" });
    const cupomAplicado = await validarCupomAtivo(cupom);

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();
    const userData = userDoc.exists ? userDoc.data() : {};
    const agora = new Date();
    const atualExpira = userData?.premiumExpira?.toDate
      ? userData.premiumExpira.toDate()
      : (userData?.premiumExpira ? new Date(userData.premiumExpira) : null);
    const hasFutureAccess = userData?.premium === true
      && atualExpira
      && !Number.isNaN(atualExpira.getTime())
      && atualExpira > agora;
    const subscriptionStartsAt = hasFutureAccess ? atualExpira : agora;
    const nextExpiry = new Date(subscriptionStartsAt);
    nextExpiry.setDate(nextExpiry.getDate() + 30);
    const autoRecurring = {
      frequency: 1,
      frequency_type: "months",
      transaction_amount: 9.90,
      currency_id: "BRL",
    };

    if (hasFutureAccess) {
      autoRecurring.start_date = subscriptionStartsAt.toISOString();
    }

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
        auto_recurring: autoRecurring,
        back_url: "https://www.odontodex.com.br",
        status: "authorized",
      }),
    });
    const assinatura = await mpRes.json();
    console.log("Preapproval response:", {
      id: assinatura.id,
      status: assinatura.status,
      uid,
      startsAt: subscriptionStartsAt.toISOString(),
      preservesFutureAccess: hasFutureAccess,
    });
    if (!assinatura.id) {
      throw new Error("Falha ao criar assinatura: " + JSON.stringify(assinatura));
    }

    const updates = {
      premium: true,
      premiumAtivadoEm: admin.firestore.Timestamp.fromDate(agora),
      premiumOrigem: "assinatura",
      ultimoPagamentoId: assinatura.id,
      assinaturaId: assinatura.id,
      assinaturaStatus: "authorized",
      proximaCobranca: admin.firestore.Timestamp.fromDate(subscriptionStartsAt),
    };

    if (!hasFutureAccess) {
      updates.premiumExpira = admin.firestore.Timestamp.fromDate(nextExpiry);
      updates.proximaCobranca = admin.firestore.Timestamp.fromDate(nextExpiry);
    }

    await userRef.set({
      email: email || decodedToken.email || "",
      emailNormalizado: String(email || decodedToken.email || "").trim().toLowerCase(),
      nome: userData?.nome || decodedToken.name || "",
      perfil: userData?.perfil || "dentista",
      tratamento: userData?.tratamento !== undefined ? userData.tratamento : "",
      criadoEm: userData?.criadoEm || new Date().toISOString(),
      dataPrimeiroAcesso: userData?.dataPrimeiroAcesso || admin.firestore.FieldValue.serverTimestamp(),
      acessosPorDia: userData?.acessosPorDia || {},
      termosAceitos: userData?.termosAceitos === true ? true : true,
      termosAceitosEm: userData?.termosAceitosEm || admin.firestore.FieldValue.serverTimestamp(),
      termosVersao: userData?.termosVersao || "1.0",
      privacidadeVersao: userData?.privacidadeVersao || "1.1",
      origemCadastro: userData?.origemCadastro || "pagamento",
      ...updates,
    }, { merge: true });

    if (cupomAplicado) {
      const conversionRef = db.collection("conversoes_cupom").doc(`subscription_${assinatura.id}`);
      await db.runTransaction(async tx => {
        const conversionDoc = await tx.get(conversionRef);
        if (conversionDoc.exists) return;

        tx.set(conversionRef, {
          cupom: cupomAplicado,
          userId: uid,
          userEmail: email || decodedToken.email || "",
          valor: 3.00,
          assinaturaId: assinatura.id,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        tx.update(db.collection("CUPONS").doc(cupomAplicado), {
          conversoes: admin.firestore.FieldValue.increment(1),
        });
      });
    }

    return res.status(200).json({
      status: "authorized",
      assinaturaId: assinatura.id,
      startsAt: subscriptionStartsAt.toISOString(),
      preservesFutureAccess: hasFutureAccess,
    });
  } catch (e) {
    console.error("Erro create-subscription:", e);
    return res.status(e.statusCode || 500).json({ error: e.message });
  }
};
