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
          onReady: () => console.log("Brick pronto"),
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
  window.userIsPremium = true;
  localStorage.setItem('userIsPremium', 'true');
  if (typeof updatePremiumUI === 'function') updatePremiumUI();
  showToast("Bem-vindo ao Premium!", "success");
  voltarParaHome();
  renderHome();
}
