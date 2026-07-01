const { requireSameUser, sendAuthError } = require("./_auth");

const { getExpectedPremiumPrice } = require("./_payment-access");

const APP_URL = "https://www.odontodex.com.br";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await requireSameUser(req, req.body?.uid);
  } catch (e) {
    return sendAuthError(res, e);
  }

  try {
    const { email } = req.body;
    const uid = decodedToken.uid;
    const userEmail = email || decodedToken.email;

    if (!userEmail) return res.status(400).json({ error: "Email obrigatório" });

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: "OdontoDex Premium",
            description: "Acesso premium por 30 dias",
            quantity: 1,
            currency_id: "BRL",
            unit_price: getExpectedPremiumPrice(),
          },
        ],
        payer: { email: userEmail },
        metadata: { uid },
        back_urls: {
          success: `${APP_URL}?payment=success`,
          failure: `${APP_URL}?payment=failure`,
          pending: `${APP_URL}?payment=pending`,
        },
        auto_return: "approved",
        notification_url: `${APP_URL}/api/webhook`,
        statement_descriptor: "ODONTODEX",
      }),
    });

    const preference = await mpResponse.json();

    if (!preference.id) {
      throw new Error("Falha ao criar preferência: " + JSON.stringify(preference));
    }

    return res.status(200).json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
    });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    return res.status(500).json({ error: error.message });
  }
};
