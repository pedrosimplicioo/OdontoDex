const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertContains(file, needle, message) {
  const source = read(file);
  if (!source.includes(needle)) {
    throw new Error(`${file}: ${message}`);
  }
}

function assertMatches(file, pattern, message) {
  const source = read(file);
  if (!pattern.test(source)) {
    throw new Error(`${file}: ${message}`);
  }
}

const adminEndpoints = [
  "api/set-premium.js",
  "api/set-test-user.js",
  "api/expire-premium.js",
  "api/create-cupom.js",
  "api/update-cupom.js",
  "api/set-repasse.js",
];

const userPaymentEndpoints = [
  "api/create-preference.js",
  "api/create-pix.js",
  "api/create-subscription.js",
  "api/process-payment.js",
  "api/cancel-subscription.js",
];

for (const file of adminEndpoints) {
  assertContains(file, "requireAdmin(req)", "endpoint administrativo precisa validar admin");
  assertContains(file, "sendAuthError(res, e)", "endpoint administrativo precisa retornar erro auth padronizado");
}

for (const file of userPaymentEndpoints) {
  assertContains(file, "requireSameUser(req, req.body?.uid)", "endpoint de pagamento precisa validar token e UID");
}

assertContains("api/_auth.js", "verifyIdToken(token)", "Firebase ID Token precisa ser validado no backend");
assertContains("api/_auth.js", "process.env.ADMIN_UIDS", "admins precisam vir de variavel de ambiente");
assertContains("api/_auth.js", "bodyUid !== decodedToken.uid", "UID do body precisa bater com UID do token");

assertContains("api/webhook.js", "MP_WEBHOOK_SECRET", "webhook precisa exigir secret");
assertContains("api/webhook.js", "x-signature", "webhook precisa ler x-signature");
assertContains("api/webhook.js", "x-request-id", "webhook precisa ler x-request-id");
assertContains("api/webhook.js", "crypto.createHmac(\"sha256\", secret)", "webhook precisa validar HMAC SHA256");
assertContains("api/webhook.js", "crypto.timingSafeEqual", "webhook precisa comparar assinatura com timingSafeEqual");
assertContains("api/webhook.js", "webhook_events", "webhook precisa registrar eventos processados");
assertContains("api/webhook.js", "runTransaction", "webhook precisa processar de forma atomica");
assertMatches("api/webhook.js", /payment_\$\{paymentId\}/, "webhook de pagamento precisa ser idempotente por paymentId");
assertMatches("api/webhook.js", /subscription_\$\{invoiceId\}/, "webhook de assinatura precisa ser idempotente por invoiceId");

assertMatches("api/process-payment.js", /direct_payment_\$\{paymentId\}/, "pagamento direto aprovado precisa ser idempotente por paymentId");
assertContains("api/process-payment.js", "runTransaction", "pagamento direto precisa atualizar premium dentro de transacao");
assertMatches("api/create-subscription.js", /subscription_\$\{assinatura\.id\}/, "conversao de cupom de assinatura precisa ser idempotente");
assertContains("api/create-subscription.js", "autoRecurring.start_date", "assinatura precisa respeitar acesso futuro ja pago");
assertContains("api/create-subscription.js", "hasFutureAccess", "assinatura futura nao deve sobrescrever premiumExpira antes da cobranca");
assertContains("api/cancel-subscription.js", "no_subscription_paid_access", "pagamento avulso/Pix sem assinatura deve preservar acesso pago");
assertContains("src/scripts/premium.js", "no_subscription_paid_access", "frontend deve tratar pagamento avulso/Pix sem cortar premium");
assertContains("index.html", "cancel-premium-btn", "botao de cancelamento precisa ter ID para texto dinamico");
assertContains("src/scripts/premium.js", "Acesso", "Pix/pagamento avulso precisa virar informacao de validade");
assertContains("src/scripts/premium.js", "Cancelar renova", "assinatura ativa precisa mostrar cancelamento de renovacao");
assertContains("src/scripts/premium.js", "Renova", "assinatura cancelada precisa mostrar status sem nova acao");
assertContains("src/scripts/app-init.js", "premiumOrigem: 'trial'", "trial automatico precisa registrar premiumOrigem");
assertContains("src/scripts/auth.js", "premiumOrigem: 'trial'", "cadastro precisa registrar premiumOrigem trial");
assertContains("api/create-subscription.js", "premiumOrigem: \"assinatura\"", "assinatura precisa registrar premiumOrigem");
assertContains("api/process-payment.js", "premiumOrigem: \"pagamento\"", "pagamento direto precisa registrar premiumOrigem");
assertContains("api/create-pix.js", "premiumOrigem: \"pix\"", "Pix pendente precisa registrar premiumOrigem");
assertContains("api/webhook.js", "premiumOrigem = pixDoc.exists ? \"pix\" : \"pagamento\"", "webhook precisa diferenciar Pix de pagamento avulso");
assertContains("api/set-premium.js", "premiumOrigem: \"manual\"", "liberacao manual precisa registrar premiumOrigem");

console.log("OK: seguranca de pagamentos/admin verificada.");
