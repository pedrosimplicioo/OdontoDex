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

function assertNotContains(file, needle, message) {
  const source = read(file);
  if (source.includes(needle)) {
    throw new Error(`${file}: ${message}`);
  }
}

const adminEndpoints = [
  "api/admin-action.js",
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
assertContains("api/_auth.js", "process.env.ADMIN_EMAILS", "admins por email precisam vir de variavel de ambiente");
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
assertNotContains("src/styles/app.css", "#cancel-premium-section{display:none!important;}", "CSS nao pode esconder permanentemente o cancelamento");
assertContains("src/scripts/premium.js", "Acesso", "Pix/pagamento avulso precisa virar informacao de validade");
assertContains("src/scripts/premium.js", "Cancelar renova", "assinatura ativa precisa mostrar cancelamento de renovacao");
assertContains("src/scripts/premium.js", "Renova", "assinatura cancelada precisa mostrar status sem nova acao");
assertContains("api/activate-trial.js", "emailVerified", "trial so pode ser liberado apos email verificado no Firebase Auth");
assertContains("api/activate-trial.js", "premiumOrigem: \"trial\"", "trial verificado precisa registrar premiumOrigem");
assertContains("api/create-subscription.js", "premiumOrigem: \"assinatura\"", "assinatura precisa registrar premiumOrigem");
assertContains("api/process-payment.js", "premiumOrigem: \"pagamento\"", "pagamento direto precisa registrar premiumOrigem");
assertContains("api/create-pix.js", "premiumOrigem: \"pix\"", "Pix pendente precisa registrar premiumOrigem");
assertContains("api/create-pix.js", "notification_url: \"https://www.odontodex.com.br/api/webhook\"", "Pix precisa enviar notification_url oficial para o webhook");
assertContains("api/create-pix.js", "req.body?.action === \"check-status\"", "create-pix precisa reaproveitar endpoint para checar Pix");
assertContains("api/create-pix.js", "https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}", "checagem Pix precisa consultar Mercado Pago pelo paymentId");
assertContains("api/create-pix.js", "paymentBelongsToUser(payment, uid)", "checagem Pix precisa validar dono do pagamento");
assertContains("api/create-pix.js", "status === \"approved\"", "checagem Pix so pode ativar premium com approved");
assertContains("api/create-pix.js", "pix_check_events", "checagem Pix precisa ser idempotente");
assertContains("api/create-pix.js", "premiumOrigem: \"pix\"", "checagem Pix aprovada precisa marcar origem Pix");
assertContains("api/webhook.js", "premiumOrigem = pixDoc.exists ? \"pix\" : \"pagamento\"", "webhook precisa diferenciar Pix de pagamento avulso");
assertContains("api/admin-action.js", "premiumOrigem: \"manual\"", "liberacao manual precisa registrar premiumOrigem");

assertContains("api/create-preference.js", "https://www.odontodex.com.br", "checkout precisa usar dominio oficial");
assertNotContains("api/create-preference.js", "odontodex.vercel.app", "checkout nao pode usar URL antiga de app");
assertNotContains("api/create-preference.js", "guia-odonto1.vercel.app", "webhook nao pode usar URL antiga");
assertNotContains("api/create-preference.js", "sandbox_init_point", "backend nao deve expor link sandbox em producao");
assertContains("src/scripts/payments.js", "data.initPoint", "frontend deve abrir link de producao do checkout");
assertNotContains("src/scripts/payments.js", "sandboxInitPoint", "frontend nao deve priorizar checkout sandbox");

console.log("OK: seguranca de pagamentos/admin verificada.");
