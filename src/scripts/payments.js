async function iniciarPagamento() {
  if (!currentUser) {
    showToast("Faça login primeiro", "error");
    return;
  }
  showLoading();
  try {
    const idToken = await currentUser.getIdToken();
    const res = await fetch("/api/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({
        uid: currentUser.uid,
        email: currentUser.email,
      }),
    });
    const data = await res.json();
    if (data.initPoint) {
      window.open(data.initPoint, "_blank");
    } else {
      throw new Error("Sem link de pagamento");
    }
  } catch (error) {
    showToast("Erro ao iniciar pagamento. Tente novamente.", "error");
    console.error(error);
  } finally {
    hideLoading();
  }
}

// ==================== CUPOM PARCEIRO ====================
let cupomValido = '';

function normalizarCupom(valor) {
  return String(valor || '').trim().toUpperCase();
}

function getCupomEls() {
  return {
    row: document.getElementById('cupom-row'),
    input: document.getElementById('cupom-input'),
    status: document.getElementById('cupom-status'),
    feedback: document.getElementById('cupom-feedback'),
    applyBtn: document.getElementById('cupom-apply-btn'),
    removeBtn: document.getElementById('cupom-remove-btn'),
  };
}

function setCupomEstado(tipo, mensagem = '') {
  const { row, status, feedback } = getCupomEls();
  if (!row || !status || !feedback) return;

  row.classList.remove('is-valid', 'is-invalid', 'is-pending');
  feedback.classList.remove('is-valid', 'is-invalid', 'is-muted');
  status.innerHTML = '';

  if (tipo) row.classList.add(`is-${tipo}`);
  if (tipo === 'valid') status.innerHTML = '<i class="ti ti-circle-check"></i>';
  if (tipo === 'invalid') status.innerHTML = '<i class="ti ti-circle-x"></i>';
  if (tipo === 'pending') {
    status.innerHTML = '<div class="spinner" style="width:18px;height:18px;border-width:2px;border-color:#7C3FA0;border-top-color:transparent;"></div>';
  }

  if (mensagem) {
    feedback.style.display = 'block';
    feedback.classList.add(tipo === 'valid' ? 'is-valid' : tipo === 'invalid' ? 'is-invalid' : 'is-muted');
    feedback.innerHTML = mensagem;
  } else {
    feedback.style.display = 'none';
    feedback.innerHTML = '';
  }
}

function editarCupom(valor) {
  const { input, applyBtn, removeBtn } = getCupomEls();
  if (!input || !applyBtn || !removeBtn) return;

  const codigo = normalizarCupom(valor);
  if (input.value !== codigo) input.value = codigo;

  cupomValido = '';
  input.disabled = false;
  applyBtn.style.display = 'inline-flex';
  removeBtn.style.display = 'none';
  applyBtn.disabled = codigo.length < 3;
  setCupomEstado('', '');
}

async function aplicarCupom() {
  const { input, applyBtn, removeBtn } = getCupomEls();
  if (!input || !applyBtn || !removeBtn) return;

  const codigo = normalizarCupom(input.value);
  if (codigo.length < 3) {
    cupomValido = '';
    applyBtn.disabled = true;
    setCupomEstado('invalid', 'Digite um código válido para aplicar.');
    return;
  }
  input.value = codigo;
  applyBtn.disabled = true;
  setCupomEstado('pending', 'Validando código de parceiro...');

  try {
    const doc = await db.collection('CUPONS').doc(codigo).get();
    if (doc.exists && doc.data().ativo === true) {
      const nome = doc.data().nome || 'parceiro';
      cupomValido = codigo;
      input.disabled = true;
      applyBtn.style.display = 'none';
      removeBtn.style.display = 'inline-flex';
      setCupomEstado('valid', '<i class="ti ti-circle-check"></i> Código aplicado: <strong>' + nome + '</strong>');
      return;
    }

    cupomValido = '';
    input.disabled = false;
    applyBtn.disabled = false;
    setCupomEstado('invalid', 'Código não encontrado ou inativo.');
  } catch (e) {
    cupomValido = '';
    input.disabled = false;
    applyBtn.disabled = false;
    setCupomEstado('invalid', 'Não foi possível validar agora. Tente novamente.');
  }
}

function removerCupom() {
  const { input, applyBtn, removeBtn } = getCupomEls();
  if (!input || !applyBtn || !removeBtn) return;

  cupomValido = '';
  input.disabled = false;
  input.value = '';
  applyBtn.style.display = 'inline-flex';
  applyBtn.disabled = true;
  removeBtn.style.display = 'none';
  setCupomEstado('', '');
  input.focus();
}

function cupomPodeContinuar() {
  const input = document.getElementById('cupom-input');
  const codigoDigitado = normalizarCupom(input?.value);
  if (!codigoDigitado || codigoDigitado === cupomValido) return true;

  setCupomEstado('invalid', 'Aplique ou remova o código de parceiro antes de continuar.');
  showToast('Aplique ou remova o código de parceiro antes de continuar.', 'error');
  return false;
}
// ==================== PIX ====================
let pixCode = '';
let pixPollingInterval = null;
let pixPollingTimeout = null;
let pixPaymentId = '';
const PENDING_PAYMENT_KEY = 'odontodexPendingPaymentId';
const PENDING_SUBSCRIPTION_KEY = 'odontodexPendingSubscriptionId';

function salvarPagamentoPendente(paymentId) {
  if (paymentId) localStorage.setItem(PENDING_PAYMENT_KEY, String(paymentId));
}

function salvarAssinaturaPendente(assinaturaId) {
  if (assinaturaId) localStorage.setItem(PENDING_SUBSCRIPTION_KEY, String(assinaturaId));
}

function limparPendenciasPagamento() {
  localStorage.removeItem(PENDING_PAYMENT_KEY);
  localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
}

async function solicitarReconciliacaoAcesso(tipo, codigo) {
  if (!currentUser || !codigo) return { ok: false, error: 'not_authenticated' };
  const idToken = await currentUser.getIdToken();
  const isSubscription = tipo === 'subscription';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(isSubscription ? '/api/reconcile-subscription' : '/api/reconcile-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(isSubscription
        ? { uid: currentUser.uid, assinaturaId: codigo }
        : { uid: currentUser.uid, paymentId: codigo }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    return { ...data, requestOk: res.ok, httpStatus: res.status };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function reconciliarPagamentoAprovado(paymentId) {
  if (!currentUser || !paymentId) return false;
  const data = await solicitarReconciliacaoAcesso('payment', String(paymentId));
  return data.requestOk && data.approved === true;
}

async function reconciliarAssinaturaAutorizada(assinaturaId) {
  if (!currentUser || !assinaturaId) return false;
  const data = await solicitarReconciliacaoAcesso('subscription', String(assinaturaId));
  return data.requestOk && data.approved === true;
}

async function tentarRestaurarPendenciasPagamento() {
  try {
    const pendingPaymentId = localStorage.getItem(PENDING_PAYMENT_KEY);
    if (pendingPaymentId && await reconciliarPagamentoAprovado(pendingPaymentId)) {
      await onPaymentApproved();
      return true;
    }

    const pendingSubscriptionId = localStorage.getItem(PENDING_SUBSCRIPTION_KEY);
    if (pendingSubscriptionId && await reconciliarAssinaturaAutorizada(pendingSubscriptionId)) {
      await onPaymentApproved();
      return true;
    }
  } catch (error) {
    console.warn('Não foi possível restaurar a pendência automaticamente', error);
  }

  return false;
}

let paymentRestoreInFlight = false;

function setPaymentRestoreStatus(kind, message) {
  const status = document.getElementById('payment-restore-progress');
  if (!status) return;
  status.className = 'payment-restore-progress' + (kind ? ` is-${kind}` : '');
  status.textContent = message || '';
}

function setPaymentRestoreBusy(busy) {
  paymentRestoreInFlight = busy;
  const button = document.getElementById('payment-restore-confirm');
  if (button) {
    button.disabled = busy;
    button.textContent = busy ? 'Procurando pagamento...' : 'Verificar novamente';
  }
}

async function concluirRestauracaoAprovada() {
  setPaymentRestoreStatus('success', 'Pagamento confirmado. Seu Premium foi restaurado.');
  hideOverlay('payment-restore-overlay');
  await onPaymentApproved();
  if (typeof renderSubscriptionSummary === 'function') renderSubscriptionSummary();
  return true;
}

function mensagemResultadoRestauracao(result) {
  if (result && result.aguardando) {
    return 'O pagamento ainda está em processamento. Tente novamente em alguns minutos e não faça outro pagamento.';
  }
  if (result && (result.httpStatus === 403 || result.httpStatus === 404)) {
    return 'Não foi possível confirmar esse código para a conta conectada. Confira o comprovante ou fale com o suporte.';
  }
  if (result && result.httpStatus === 400) {
    return 'O código informado não pôde ser consultado. Confira e tente novamente.';
  }
  if (result && result.httpStatus === 409) {
    return 'Esse código já foi aplicado anteriormente e não comprova uma nova cobrança. Fale com o suporte para conferirmos o pagamento.';
  }
  if (result && result.httpStatus === 422) {
    return 'A cobrança encontrada não corresponde ao plano Premium. Fale com o suporte antes de realizar outro pagamento.';
  }
  return 'Não foi possível concluir agora. Seu pagamento não será perdido. Tente novamente mais tarde e não pague novamente.';
}

async function verificarCodigoRestauracao(tipo, codigo) {
  try {
    const result = await solicitarReconciliacaoAcesso(tipo, codigo);
    if (result.requestOk && result.approved === true) return concluirRestauracaoAprovada();

    if (result.aguardando || result.httpStatus >= 500) {
      if (tipo === 'subscription') salvarAssinaturaPendente(codigo);
      else salvarPagamentoPendente(codigo);
    } else if (result.httpStatus === 400 || result.httpStatus === 403 || result.httpStatus === 404 || result.httpStatus === 409 || result.httpStatus === 422) {
      localStorage.removeItem(tipo === 'subscription' ? PENDING_SUBSCRIPTION_KEY : PENDING_PAYMENT_KEY);
    }
    setPaymentRestoreStatus(result.aguardando ? 'pending' : 'error', mensagemResultadoRestauracao(result));
    return false;
  } catch (error) {
    console.warn('Falha ao consultar pagamento para restauração', error);
    if (tipo === 'subscription') salvarAssinaturaPendente(codigo);
    else salvarPagamentoPendente(codigo);
    setPaymentRestoreStatus('error', mensagemResultadoRestauracao(null));
    return false;
  }
}

async function verificarPendenciasSalvas() {
  const paymentId = localStorage.getItem(PENDING_PAYMENT_KEY);
  const subscriptionId = localStorage.getItem(PENDING_SUBSCRIPTION_KEY);
  if (!paymentId && !subscriptionId) return false;

  setPaymentRestoreStatus('loading', 'Consultando o pagamento salvo neste aparelho...');
  if (paymentId && await verificarCodigoRestauracao('payment', paymentId)) return true;
  if (subscriptionId && await verificarCodigoRestauracao('subscription', subscriptionId)) return true;
  return false;
}

async function abrirRestaurarAcesso() {
  if (!currentUser) {
    showToast('Faça login para restaurar seu acesso', 'error');
    return;
  }
  hideOverlay('premium-overlay');
  setPaymentRestoreStatus('', '');
  setPaymentRestoreBusy(false);
  showOverlay('payment-restore-overlay');
  await restaurarAcessoAutomaticamente();
}

function fecharRestaurarAcesso() {
  if (paymentRestoreInFlight) return;
  hideOverlay('payment-restore-overlay');
}

async function buscarCandidatosRestauracao() {
  const idToken = await currentUser.getIdToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/find-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ uid: currentUser.uid }),
      signal: controller.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'payment_search_failed');
    return Array.isArray(data.candidates) ? data.candidates : [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function restaurarAcessoAutomaticamente() {
  if (paymentRestoreInFlight) return;
  setPaymentRestoreBusy(true);
  setPaymentRestoreStatus('loading', 'Procurando pagamentos aprovados vinculados à sua conta...');
  try {
    if (await verificarPendenciasSalvas()) return;

    const candidates = await buscarCandidatosRestauracao();
    for (const candidate of candidates) {
      const type = candidate?.type === 'subscription' ? 'subscription' : 'payment';
      const id = String(candidate?.id || '');
      if (!id) continue;
      if (await verificarCodigoRestauracao(type, id)) return;
    }

    const hasPending = localStorage.getItem(PENDING_PAYMENT_KEY) || localStorage.getItem(PENDING_SUBSCRIPTION_KEY);
    if (hasPending) {
      setPaymentRestoreStatus('pending', 'Ainda não há confirmação do pagamento. Tente novamente em alguns minutos e não faça outro pagamento.');
    } else if (candidates.length > 0) {
      setPaymentRestoreStatus('error', 'Encontramos uma cobrança, mas ela precisa ser conferida pelo suporte. Não faça outro pagamento.');
    } else {
      setPaymentRestoreStatus('error', 'Não encontramos pagamento aprovado nos últimos 14 dias. Se a cobrança já aparece no extrato, envie o comprovante ao suporte.');
    }
  } catch (error) {
    console.warn('Falha na busca automática de pagamento', error);
    setPaymentRestoreStatus('error', 'Não foi possível consultar o Mercado Pago agora. Tente novamente mais tarde e não faça outro pagamento.');
  } finally {
    setPaymentRestoreBusy(false);
  }
}

async function abrirPixModal() {
  if (!currentUser) {
    showToast("Faça login primeiro", "error");
    return;
  }
  if (!cupomPodeContinuar()) return;

  document.getElementById('pix-loading').style.display = 'block';
  document.getElementById('pix-content').style.display = 'none';
  document.getElementById('pix-error').style.display = 'none';
  document.getElementById('pix-aguardando').style.display = 'none';
  document.getElementById('pix-status-msg').textContent = 'Gerando QR Code...';
  pixCode = '';
  pixPaymentId = '';

  showOverlay('pix-overlay');

  try {
    const idToken = await currentUser.getIdToken();
    const res = await fetch('/api/create-pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        uid: currentUser.uid,
        email: currentUser.email,
        nome: localStorage.getItem('guiaNome') || '',
        cupom: cupomValido || null,
      }),
    });

    const data = await res.json();
    if (!data.qrCode) throw new Error('QR Code não gerado');

    pixCode = data.qrCode;
    pixPaymentId = data.paymentId ? String(data.paymentId) : '';
    salvarPagamentoPendente(pixPaymentId);

    document.getElementById('pix-qrcode-img').src = 'data:image/png;base64,' + data.qrCodeBase64;
    document.getElementById('pix-code-display').textContent = data.qrCode;
    document.getElementById('pix-status-msg').textContent = 'Escaneie o QR Code ou copie o código';
    document.getElementById('pix-loading').style.display = 'none';
    document.getElementById('pix-content').style.display = 'block';
    document.getElementById('pix-aguardando').style.display = 'block';

    iniciarPixPolling(pixPaymentId);

  } catch (e) {
    document.getElementById('pix-loading').style.display = 'none';
    document.getElementById('pix-error').style.display = 'block';
    document.getElementById('pix-error').textContent = 'Erro ao gerar QR Code. Tente novamente.';
    document.getElementById('pix-status-msg').textContent = '';
  }
}

function iniciarPixPolling(paymentId) {
  pararPixPolling();
  if (!paymentId) {
    document.getElementById('pix-error').style.display = 'block';
    document.getElementById('pix-error').textContent = 'Erro ao acompanhar pagamento. Tente novamente.';
    return;
  }

  pixPollingInterval = setInterval(async () => {
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch('/api/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          action: 'check-status',
          uid: currentUser.uid,
          paymentId,
        }),
      });
      const data = await res.json();

      if (res.ok && data.status === 'approved') {
        pararPixPolling();
        document.getElementById('pix-status-msg').textContent = 'Pagamento aprovado! Atualizando acesso...';
        document.getElementById('pix-aguardando').style.display = 'none';
        fecharPixModal();
        await onPaymentApproved();
        return;
      }

      if (data.falha) {
        pararPixPolling();
        document.getElementById('pix-aguardando').style.display = 'none';
        document.getElementById('pix-error').style.display = 'block';
        document.getElementById('pix-error').textContent = 'Pagamento Pix nao aprovado. Gere um novo Pix e tente novamente.';
        document.getElementById('pix-status-msg').textContent = '';
      } else {
        document.getElementById('pix-status-msg').textContent = 'Aguardando confirmacao do pagamento...';
      }
    } catch(e) {
      console.log(e);
    }
  }, 5000);

  pixPollingTimeout = setTimeout(() => {
    pararPixPolling();
    document.getElementById('pix-status-msg').textContent = 'Ainda aguardando confirmacao do pagamento.';
  }, 5 * 60 * 1000);
}

function pararPixPolling() {
  if (pixPollingInterval) {
    clearInterval(pixPollingInterval);
    pixPollingInterval = null;
  }
  if (pixPollingTimeout) {
    clearTimeout(pixPollingTimeout);
    pixPollingTimeout = null;
  }
}

function fecharPixModal() {
  pararPixPolling();
  hideOverlay('pix-overlay');
}

function copiarPixCode() {
  if (!pixCode) return;
  navigator.clipboard.writeText(pixCode).catch(() => {});
  showToast('Código Pix copiado!', 'success');
}
  // ==================== MERCADO PAGO BRICKS ====================
const MP_PUBLIC_KEY = "APP_USR-f3596f78-d857-4650-b079-3021cad9c072";
let mpInstance = null;
let paymentBrickController = null;
let paymentBrickLabelObserver = null;

function ocultarSeloParcelamentoBrick(container) {
  if (!container) return;
  const esconder = () => {
    container.querySelectorAll("*").forEach(el => {
      if (el.children.length > 0) return;
      if ((el.textContent || "").trim().toLowerCase() === "parcelamento disponível") {
        el.style.display = "none";
      }
    });
  };

  esconder();
  if (paymentBrickLabelObserver) paymentBrickLabelObserver.disconnect();
  paymentBrickLabelObserver = new MutationObserver(esconder);
  paymentBrickLabelObserver.observe(container, { childList: true, subtree: true, characterData: true });
}

async function loadMPScript() {
  return new Promise((resolve, reject) => {
    if (window.MercadoPago) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function abrirTelaPayment() {
  if (!currentUser) {
    showToast("Faça login primeiro", "error");
    return;
  }
  if (await tentarRestaurarPendenciasPagamento()) return;
  // Fecha o modal premium se estiver aberto
  hideOverlay("premium-overlay");
  // Navega para a tela de pagamento
  goScreen("payment");
  // Inicializa o Brick
  await iniciarBrick();
}

async function iniciarBrick() {
  if (paymentBrickController) {
    try { await paymentBrickController.unmount(); } catch(e) {}
    paymentBrickController = null;
  }
  if (paymentBrickLabelObserver) {
    paymentBrickLabelObserver.disconnect();
    paymentBrickLabelObserver = null;
  }

  const container = document.getElementById("mp-brick-container");
  if (!container) return;
  container.innerHTML = `
    <div class="loading-brick">
      <div class="spinner" style="border-color:#7C3FA0;border-top-color:transparent;"></div>
      <span>Carregando assinatura mensal no cartão...</span>
    </div>`;

  try {
    await loadMPScript();

    mpInstance = new window.MercadoPago(MP_PUBLIC_KEY, { locale: "pt-BR" });
    const bricksBuilder = mpInstance.bricks();

    container.innerHTML = '<div id="paymentBrick_container"></div>';

    paymentBrickController = await bricksBuilder.create(
      "payment",
      "paymentBrick_container",
      {
        initialization: {
          amount: 9.90,
          payer: {
            email: currentUser.email,
          },
        },
        customization: {
          paymentMethods: {
            creditCard: "all",
            maxInstallments: 1,
          },
          visual: {
            style: {
              theme: document.body.classList.contains("dark") ? "dark" : "default",
              customVariables: {
                baseColor: "#7C3FA0",
              },
            },
          },
        },
        callbacks: {
          onReady: () => {
            ocultarSeloParcelamentoBrick(container);
            console.log("Brick pronto");
          },
          onSubmit: async ({ formData }) => {
            if (!cupomPodeContinuar()) return;
            showLoading();
            try {
             const cardToken = formData.token || formData.card_token_id || formData.card_token;
const isCartao = !!cardToken;

let payRes, payData;

if (isCartao) {
  const idToken = await currentUser.getIdToken();
  payRes = await fetch("/api/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({
      uid: currentUser.uid,
      email: currentUser.email,
      token: cardToken,
      cupom: cupomValido || null,
    }),
  });
                payData = await payRes.json();
                hideLoading();
                if (payData.status === "authorized") {
                  salvarAssinaturaPendente(payData.assinaturaId);
                  if (payData.accessPending) {
                    const restaurado = await reconciliarAssinaturaAutorizada(payData.assinaturaId);
                    if (!restaurado) {
                      showToast("Assinatura autorizada. O acesso sera restaurado automaticamente em instantes.", "success");
                      goBackToLastScreen();
                      return;
                    }
                  }
                  await onPaymentApproved();
                } else {
                  showToast("Assinatura não autorizada. Tente outro cartão.", "error");
                }
              } else {
                const idToken = await currentUser.getIdToken();
                payRes = await fetch("/api/process-payment", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`
                  },
                  body: JSON.stringify({
                    ...formData,
                    uid: currentUser.uid,
                    email: currentUser.email,
                  }),
                });
                payData = await payRes.json();
                hideLoading();
                if (payData.status === "approved") {
                  salvarPagamentoPendente(payData.paymentId);
                  if (payData.accessPending) {
                    const restaurado = await reconciliarPagamentoAprovado(payData.paymentId);
                    if (!restaurado) {
                      showToast("Pagamento aprovado. O acesso sera restaurado automaticamente em instantes.", "success");
                      goBackToLastScreen();
                      return;
                    }
                  }
                  await onPaymentApproved();
                } else if (payData.status === "in_process" || payData.status === "pending") {
                  showToast("Pagamento em processamento.", "success");
                  goBackToLastScreen();
                } else {
                  showToast("Pagamento não aprovado. Tente outro método.", "error");
                }
              }

            } catch (e) {
              hideLoading();
              showToast("Erro ao processar. Tente novamente.", "error");
            }
          },
          onError: (error) => console.error("Brick error:", error),
        },
      }
    );
  } catch (e) {
    console.error("Erro ao iniciar Brick:", e);
    container.innerHTML = `
      <div style="text-align:center;padding:30px 20px;">
        <div class="modal-icon" style="font-size:32px;margin-bottom:8px;color:#DC2626"><i class="ti ti-alert-triangle"></i></div>
        <div style="font-size:14px;font-weight:700;color:#DC2626;margin-bottom:16px">Erro ao carregar pagamento</div>
       <button onclick="iniciarBrick()" style="background:#7C3FA0;color:#fff;border:none;border-radius:20px;padding:10px 24px;font-size:14px;font-weight:700;cursor:pointer;">Tentar novamente</button>
      </div>`;
  }
}
async function onPaymentApproved() {
  limparPendenciasPagamento();
  window.userIsPremium = true;
  localStorage.setItem('userIsPremium', 'true');
  if (typeof updatePremiumUI === 'function') updatePremiumUI();
  showToast("Bem-vindo ao Premium!", "success");
  voltarParaHome();
  renderHome();
}
