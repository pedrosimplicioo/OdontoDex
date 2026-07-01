const path = require("path");
const Module = require("module");

const root = path.resolve(__dirname, "../..");
const endpointPath = path.join(root, "api", "reconcile-subscription.js");

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

function loadHandler({ userData = null, eventExists = false }) {
  const originalLoad = Module._load;
  const writes = [];

  delete require.cache[endpointPath];
  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === "./_auth" && parent?.filename === endpointPath) {
      const db = {
        collection(collection) {
          return {
            doc(id) { return { collection, id }; },
          };
        },
        async runTransaction(callback) {
          return callback({
            async get(ref) {
              if (ref.collection === "users") {
                return { exists: !!userData, data: () => userData || {} };
              }
              return { exists: eventExists, data: () => ({}) };
            },
            set(ref, data, options) { writes.push({ ref, data, options }); },
          });
        },
      };
      return {
        admin: {
          firestore: {
            FieldValue: { serverTimestamp: () => "serverTimestamp" },
            Timestamp: { fromDate: date => ({ date }) },
          },
        },
        db,
        requireSameUser: async () => ({ uid: "user_a", email: "user@example.com", name: "User" }),
        sendAuthError: (res, error) => res.status(error.status || 500).json({ error: error.message }),
      };
    }
    if (request === "./_payment-access" && parent?.filename === endpointPath) {
      return { getExpectedPremiumPrice: () => 9.90 };
    }
    return originalLoad(request, parent, isMain);
  };

  const handler = require(endpointPath);
  Module._load = originalLoad;
  return { handler, writes };
}

async function call(handler, assinaturaId = "sub_1234") {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    async json() {
      return {
        id: assinaturaId,
        status: "authorized",
        external_reference: "user_a",
        payer_email: "user@example.com",
        auto_recurring: { transaction_amount: 9.90, currency_id: "BRL" },
      };
    },
  });
  try {
    const res = createResponse();
    await handler({ method: "POST", headers: {}, body: { uid: "user_a", assinaturaId } }, res);
    return res;
  } finally {
    global.fetch = originalFetch;
  }
}

(async () => {
  {
    const { handler, writes } = loadHandler({ userData: null });
    const res = await call(handler);
    assert(res.statusCode === 200 && res.body.approved === true, "assinatura nova deve restaurar acesso");
    assert(writes.filter(write => write.ref.collection === "users").length === 1, "assinatura nova deve atualizar usuario uma vez");
    assert(writes.filter(write => write.ref.collection === "webhook_events").length === 1, "assinatura nova deve registrar evento idempotente");
  }

  {
    const future = new Date(Date.now() + 10 * 86400000);
    const { handler, writes } = loadHandler({
      userData: { premium: true, premiumExpira: future, assinaturaId: "sub_1234", ultimoPagamentoId: "sub_1234" },
    });
    const res = await call(handler);
    assert(res.statusCode === 200 && res.body.alreadyActive === true, "mesma assinatura ativa deve ser reconhecida");
    assert(writes.filter(write => write.ref.collection === "users").length === 0, "novo clique nao pode somar mais 30 dias");
  }

  {
    const past = new Date(Date.now() - 86400000);
    const { handler, writes } = loadHandler({
      userData: { premium: true, premiumExpira: past, assinaturaId: "sub_1234", ultimoPagamentoId: "sub_1234" },
      eventExists: true,
    });
    const res = await call(handler);
    assert(res.statusCode === 409 && res.body.needsSupport === true, "assinatura antiga expirada deve exigir comprovacao de nova cobranca");
    assert(writes.length === 0, "assinatura expirada nao pode ser reativada pelo mesmo codigo");
  }

  console.log("OK: reconciliacao de assinatura idempotente verificada.");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
