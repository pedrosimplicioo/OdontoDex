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
  const endpointPath = path.join(root, "api", "check-pix-status.js");
  const originalLoad = Module._load;
  const updates = [];
  const sets = [];

  delete require.cache[endpointPath];
  global.fetch = async url => {
    assert(String(url).includes(`/v1/payments/${payment.id}`), "deve consultar o paymentId no Mercado Pago");
    return { ok: true, json: async () => payment };
  };

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
    return originalLoad(request, parent, isMain);
  };

  const handler = require(endpointPath);
  Module._load = originalLoad;
  return { handler, updates, sets };
}

async function callHandler(handler, body = { uid: "user_a", paymentId: "pay_1" }) {
  const res = createResponse();
  await handler({ method: "POST", body, headers: {} }, res);
  return res;
}

(async () => {
  assert(!/premium\s*:\s*true/.test(read("api/create-pix.js")), "gerar Pix nao pode ativar Premium");

  const copiarPixCode = read("src/scripts/payments.js").match(/function copiarPixCode\(\) \{[\s\S]*?\n\}/)?.[0] || "";
  assert(!copiarPixCode.includes("onPaymentApproved"), "copiar Pix nao pode aprovar pagamento");
  assert(!copiarPixCode.includes("userIsPremium"), "copiar Pix nao pode alterar premium local");
  assert(!copiarPixCode.includes("check-pix-status"), "copiar Pix nao pode consultar status");

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
