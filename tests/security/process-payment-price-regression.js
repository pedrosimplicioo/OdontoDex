const path = require("path");
const Module = require("module");

const endpointPath = path.resolve(__dirname, "../../api/process-payment.js");

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
        admin: {},
        db: {},
        requireSameUser: async (req, uid) => {
          assert(uid === "user_a", "UID precisa ser validado contra o token");
          return { uid: "user_a", email: "verified@example.com" };
        },
        sendAuthError: (res, error) => res.status(error.status || 500).json({ error: error.message }),
      };
    }
    if (request === "./_payment-access" && parent?.filename === endpointPath) {
      return {
        activateApprovedPaymentAccess: async () => ({ processed: true }),
        getExpectedPremiumPrice: () => 9.90,
      };
    }
    return originalLoad(request, parent, isMain);
  };
  const handler = require(endpointPath);
  Module._load = originalLoad;
  return handler;
}

(async () => {
  const originalFetch = global.fetch;
  let sentPayload = null;
  let fetchCalls = 0;
  global.fetch = async (url, options) => {
    fetchCalls += 1;
    sentPayload = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      async json() { return { id: 12345, status: "rejected" }; },
    };
  };

  try {
    const handler = loadHandler();
    const res = createResponse();
    await handler({
      method: "POST",
      headers: {},
      body: {
        uid: "user_a",
        email: "attacker@example.com",
        token: "card_token_safe",
        payment_method_id: "visa",
        issuer_id: "123",
        transaction_amount: 0.01,
        installments: 12,
        description: "Produto adulterado",
        external_reference: "other_user",
        metadata: { uid: "other_user" },
        payer: { email: "attacker@example.com", identification: { type: "cpf", number: "123.456.789-00" } },
      },
    }, res);

    assert(fetchCalls === 1, "pagamento valido deve chamar Mercado Pago uma vez");
    assert(sentPayload.transaction_amount === 9.90, "valor adulterado precisa ser ignorado");
    assert(sentPayload.installments === 1, "parcelas precisam ser definidas no backend");
    assert(sentPayload.description === "OdontoDex Premium - 30 dias", "descricao precisa ser definida no backend");
    assert(sentPayload.external_reference === "user_a", "referencia externa precisa usar UID autenticado");
    assert(sentPayload.metadata.uid === "user_a", "metadata precisa usar UID autenticado");
    assert(sentPayload.payer.email === "verified@example.com", "email precisa vir do token autenticado");
    assert(sentPayload.payment_method_id === "visa", "meio de pagamento permitido precisa ser preservado");
    assert(sentPayload.issuer_id === "123", "issuer numerico permitido precisa ser preservado");
    assert(sentPayload.payer.identification.number === "12345678900", "documento precisa ser normalizado");

    const noTokenRes = createResponse();
    await handler({ method: "POST", headers: {}, body: { uid: "user_a", payment_method_id: "visa" } }, noTokenRes);
    assert(noTokenRes.statusCode === 400, "pagamento sem token precisa ser bloqueado");
    assert(fetchCalls === 1, "pagamento invalido nao pode chegar ao Mercado Pago");
  } finally {
    global.fetch = originalFetch;
  }

  console.log("OK: preco do pagamento fixado no backend.");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
