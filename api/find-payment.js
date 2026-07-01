const { requireSameUser, sendAuthError } = require("./_auth");
const {
  getExpectedPremiumPrice,
  isExpectedPremiumPayment,
  paymentBelongsToUser,
} = require("./_payment-access");

const RECOVERY_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

function parseDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function isRecent(value) {
  const date = parseDate(value);
  return !!date && Date.now() - date.getTime() <= RECOVERY_WINDOW_MS;
}

async function mercadoPagoGet(path) {
  const response = await fetch(`https://api.mercadopago.com${path}`, {
    headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
  });
  const json = await response.json();
  if (!response.ok) {
    const error = new Error(`Mercado Pago search error ${response.status}`);
    error.statusCode = 502;
    throw error;
  }
  return json;
}

function validSubscription(subscription, uid) {
  const amount = Number(subscription?.auto_recurring?.transaction_amount);
  const currency = String(subscription?.auto_recurring?.currency_id || "").toUpperCase();
  return String(subscription?.external_reference || "") === uid
    && subscription?.status === "authorized"
    && currency === "BRL"
    && Number.isFinite(amount)
    && Math.abs(amount - getExpectedPremiumPrice()) < 0.01
    && isRecent(subscription?.date_created || subscription?.last_modified);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let decodedToken;
  try {
    decodedToken = await requireSameUser(req, req.body?.uid);
  } catch (error) {
    return sendAuthError(res, error);
  }

  try {
    const uid = decodedToken.uid;
    const candidates = [];
    const paymentParams = new URLSearchParams({
      sort: "date_approved",
      criteria: "desc",
      external_reference: uid,
      status: "approved",
      limit: "10",
    });
    const payments = await mercadoPagoGet(`/v1/payments/search?${paymentParams.toString()}`);
    const validPayments = Array.isArray(payments?.results) ? payments.results
      .filter(payment => paymentBelongsToUser(payment, uid)
        && payment.status === "approved"
        && isExpectedPremiumPayment(payment)
        && isRecent(payment.date_approved || payment.date_created))
      .sort((a, b) => (parseDate(b.date_approved || b.date_created)?.getTime() || 0)
        - (parseDate(a.date_approved || a.date_created)?.getTime() || 0))
      .slice(0, 3) : [];

    for (const payment of validPayments) {
      candidates.push({ type: "payment", id: String(payment.id) });
    }

    const email = String(decodedToken.email || "").trim().toLowerCase();
    if (email) {
      const subscriptionParams = new URLSearchParams({ payer_email: email });
      const subscriptions = await mercadoPagoGet(`/preapproval/search?${subscriptionParams.toString()}`);
      const validSubscriptions = Array.isArray(subscriptions?.results) ? subscriptions.results
        .filter(subscription => validSubscription(subscription, uid))
        .sort((a, b) => (parseDate(b.date_created || b.last_modified)?.getTime() || 0)
          - (parseDate(a.date_created || a.last_modified)?.getTime() || 0))
        .slice(0, 2) : [];

      for (const subscription of validSubscriptions) {
        candidates.push({ type: "subscription", id: String(subscription.id) });
      }
    }

    return res.status(200).json({ ok: true, candidates });
  } catch (error) {
    console.error("Erro find-payment:", error);
    return res.status(error.statusCode || 500).json({ error: "Nao foi possivel procurar pagamentos agora" });
  }
};
