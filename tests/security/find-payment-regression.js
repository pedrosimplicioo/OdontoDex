const path = require("path");
const Module = require("module");

const endpointPath = path.resolve(__dirname, "../../api/find-payment.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
  };
}

function loadHandler() {
  const originalLoad = Module._load;
  delete require.cache[endpointPath];
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === "./_auth" && parent?.filename === endpointPath) {
      return {
        requireSameUser: async () => ({ uid: "user_a", email: "user@example.com" }),
        sendAuthError: (res, error) => res.status(error.status || 500).json({ error: error.message }),
      };
    }
    if (request === "./_payment-access" && parent?.filename === endpointPath) {
      return {
        getExpectedPremiumPrice: () => 9.90,
        isExpectedPremiumPayment: payment => payment.currency_id === "BRL" && Number(payment.transaction_amount) === 9.90,
        paymentBelongsToUser: (payment, uid) => String(payment.external_reference || payment.metadata?.uid || "") === uid,
      };
    }
    return originalLoad(request, parent, isMain);
  };
  const handler = require(endpointPath);
  Module._load = originalLoad;
  return handler;
}

(async () => {
  const now = new Date().toISOString();
  const old = new Date(Date.now() - 20 * 86400000).toISOString();
  const originalFetch = global.fetch;
  global.fetch = async url => {
    if (String(url).includes("/v1/payments/search")) {
      return {
        ok: true,
        async json() {
          return {
            results: [
              { id: 101, status: "approved", external_reference: "user_a", transaction_amount: 9.90, currency_id: "BRL", date_approved: now },
              { id: 102, status: "approved", external_reference: "user_b", transaction_amount: 9.90, currency_id: "BRL", date_approved: now },
              { id: 103, status: "approved", external_reference: "user_a", transaction_amount: 1.00, currency_id: "BRL", date_approved: now },
              { id: 104, status: "approved", external_reference: "user_a", transaction_amount: 9.90, currency_id: "BRL", date_approved: old },
            ],
          };
        },
      };
    }
    return {
      ok: true,
      async json() {
        return {
          results: [
            { id: "sub_valid", status: "authorized", external_reference: "user_a", date_created: now, auto_recurring: { transaction_amount: 9.90, currency_id: "BRL" } },
            { id: "sub_other", status: "authorized", external_reference: "user_b", date_created: now, auto_recurring: { transaction_amount: 9.90, currency_id: "BRL" } },
          ],
        };
      },
    };
  };

  try {
    const handler = loadHandler();
    const res = createResponse();
    await handler({ method: "POST", headers: {}, body: { uid: "user_a" } }, res);
    assert(res.statusCode === 200, "busca automatica deve responder 200");
    assert(res.body.candidates.length === 2, "deve retornar somente pagamento e assinatura validos");
    assert(res.body.candidates.some(item => item.type === "payment" && item.id === "101"), "deve encontrar pagamento correto");
    assert(res.body.candidates.some(item => item.type === "subscription" && item.id === "sub_valid"), "deve encontrar assinatura correta");
    assert(!res.body.candidates.some(item => ["102", "103", "104", "sub_other"].includes(item.id)), "nao pode retornar cobranca errada, antiga ou de outro usuario");
  } finally {
    global.fetch = originalFetch;
  }

  console.log("OK: busca automatica de pagamento verificada.");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
