const fs = require("fs");
const path = require("path");
const Module = require("module");

const root = path.resolve(__dirname, "../..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function loadCheckPixStatus({ payment, tokenUid = "user_a" }) {
  const endpointPath = path.join(root, "api", "create-pix.js");
  const originalLoad = Module._load;
  const updates = [];
  const sets = [];

  delete require.cache[endpointPath];

  Module._load = function patchedLoad(request, parent, isMain) {
    if (request === "./_auth" && parent?.filename === endpointPath) {
      return {
        admin: {
          firestore: {
            FieldValue: { serverTimestamp: () => "serverTimestamp" },
            Timestamp: { fromDate: date => ({ date }) },
          },
        },
        db: {
          collection() {
            return {
              doc(id) {
                return { id };
              },
            };
          },
          async runTransaction(callback) {
            return callback({
              async get() {
                return { exists: false };
              },
              set(ref, data) {
                sets.push({ ref, data });
              },
              update(ref, data) {
                updates.push({ ref, data });
              },
            });
          },
        },
        requireSameUser: async (req, uid) => {
          assert(uid === tokenUid, "uid do body precisa ser o usuario autenticado no teste");
          return { uid: tokenUid, email: `${tokenUid}@example.com` };
        },
        sendAuthError: (res, error) => res.status(error.status || 500).json({ error: error.message }),
      };
    }
    if (request === "./_payment-access" && parent?.filename === endpointPath) {
      return {
        fetchMercadoPagoPayment: async paymentId => {
          assert(String(paymentId) === String(payment.id), "deve consultar o paymentId no Mercado Pago");
          return payment;
        },
        paymentBelongsToUser: (mpPayment, uid) => (
          String(mpPayment?.metadata?.uid || "") === uid ||
          String(mpPayment?.external_reference || "") === uid
        ),
        activateApprovedPaymentAccess: async ({ uid, paymentId, premiumOrigem }) => {
          sets.push({
            ref: { id: `payment_${paymentId}` },
            data: { type: "pix_status_check", paymentId, uid },
          });
          updates.push({
            ref: { id: uid },
            data: { premium: true, premiumOrigem, ultimoPagamentoId: String(paymentId) },
          });
          return { processed: true, premiumOrigem };
        },
      };
    }
    return originalLoad(request, parent, isMain);
  };

  const handler = require(endpointPath);
  Module._load = originalLoad;
  return { handler, updates, sets };
}

async function callHandler(handler, body = { action: "check-status", uid: "user_a", paymentId: "pay_1" }) {
  const res = createResponse();
  await handler({ method: "POST", body, headers: {} }, res);
  return res;
}

(async () => {
  const createPixSource = read("api/create-pix.js");
  const checkStatusIndex = createPixSource.indexOf('req.body?.action === "check-status"');
  const premiumActivationIndex = createPixSource.indexOf("activateApprovedPaymentAccess");
  const createPaymentIndex = createPixSource.indexOf('fetch("https://api.mercadopago.com/v1/payments"');
  assert(checkStatusIndex > -1, "create-pix precisa ter ramo check-status");
  assert(premiumActivationIndex > -1, "check-status approved precisa ativar Premium");
  assert(createPaymentIndex > checkStatusIndex, "gerar Pix deve continuar no fluxo normal apos check-status");
  assert(premiumActivationIndex < createPaymentIndex, "gerar Pix nao pode ativar Premium no fluxo de criacao");

  const copiarPixCode = read("src/scripts/payments.js").match(/function copiarPixCode\(\) \{[\s\S]*?\n\}/)?.[0] || "";
  assert(!copiarPixCode.includes("onPaymentApproved"), "copiar Pix nao pode aprovar pagamento");
  assert(!copiarPixCode.includes("userIsPremium"), "copiar Pix nao pode alterar premium local");
  assert(!copiarPixCode.includes("check-status"), "copiar Pix nao pode consultar status");

  {
    const { handler, updates } = loadCheckPixStatus({
      payment: { id: "pay_1", status: "pending", metadata: { uid: "user_a" }, external_reference: "user_a" },
    });
    const res = await callHandler(handler);
    assert(res.statusCode === 200, "pending deve responder 200");
    assert(res.body.aguardando === true, "pending deve retornar aguardando");
    assert(updates.length === 0, "pending nao pode ativar Premium");
  }

  {
    const { handler, updates, sets } = loadCheckPixStatus({
      payment: { id: "pay_1", status: "approved", metadata: { uid: "user_a" }, external_reference: "user_a" },
    });
    const res = await callHandler(handler);
    assert(res.statusCode === 200, "approved deve responder 200");
    assert(res.body.approved === true, "approved deve retornar approved true");
    assert(updates.length === 1, "approved deve atualizar usuario");
    assert(updates[0].data.premium === true, "approved deve ativar Premium");
    assert(updates[0].data.premiumOrigem === "pix", "approved deve marcar origem Pix");
    assert(sets.length === 1, "approved deve criar evento idempotente");
  }

  {
    const { handler, updates } = loadCheckPixStatus({
      payment: { id: "pay_1", status: "approved", metadata: { uid: "user_b" }, external_reference: "user_b" },
    });
    const res = await callHandler(handler);
    assert(res.statusCode === 403, "paymentId de outro usuario deve ser bloqueado");
    assert(updates.length === 0, "paymentId de outro usuario nao pode ativar Premium");
  }

  console.log("OK: regressao Pix verificada.");
})().catch(error => {
  console.error(error);
  process.exit(1);
});
