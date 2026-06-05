// ========== CANCELAMENTO PREMIUM ============================
// ============================================================

let selectedCancelReason = null;

function cancelStep(step) {
  document.getElementById('cancel-step-1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('cancel-step-2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('cancel-step-3').style.display = step === 3 ? 'block' : 'none';
}

function formatCancelDate(value) {
  if (!value) return 'â€”';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'â€”';
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function setCancelResultCopy({ title, subtitle, note, expiry }) {
  const titleEl = document.getElementById('cancel-result-title');
  const subtitleEl = document.getElementById('cancel-result-subtitle');
  const noteEl = document.getElementById('cancel-result-note');
  const expiryEl = document.getElementById('cancel-expiry-date');
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (noteEl) noteEl.textContent = note;
  if (expiryEl) expiryEl.textContent = expiry || 'â€”';
}

function inferPremiumOrigin(userData) {
  if (userData?.premiumOrigem) return userData.premiumOrigem;
  if (userData?.assinaturaId) return 'assinatura';
  if (userData?.ultimoPagamentoId) return 'pagamento';
  if (userData?.trialAtivado) return 'trial';
  return 'manual';
}

function setCancelButtonState({ text, enabled }) {
  const btn = document.getElementById('cancel-premium-btn');
  if (!btn) return;
  btn.textContent = text;
  btn.disabled = enabled === false;
  btn.style.cursor = enabled === false ? 'default' : 'pointer';
  btn.style.opacity = enabled === false ? '0.72' : '0.6';
}

function openCancelModal() {
  if (!currentUser) {
    showToast("FaÃ§a login para cancelar a assinatura", "error");
    return;
  }
  selectedCancelReason = null;
  const otherInput = document.getElementById('cancel-other-text');
  if (otherInput) otherInput.value = '';
  const otherDiv = document.getElementById('other-reason-input');
  if (otherDiv) otherDiv.style.display = 'none';
  document.querySelectorAll('.cancel-reason-btn').forEach(b => b.classList.remove('selected'));
  const confirmBtn = document.getElementById('confirm-cancel-btn');
  if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.style.opacity = '0.4'; confirmBtn.textContent = 'Confirmar cancelamento'; }
  setCancelResultCopy({
    title: 'Assinatura cancelada',
        subtitle: 'Seu acesso premium continua até',
        note: 'Depois disso, você volta ao plano gratuito automaticamente. Se mudar de ideia, é só assinar novamente.',
    expiry: 'â€”'
  });
  cancelStep(1);
  showOverlay('cancel-overlay');
}

function hideCancelModal() {
  hideOverlay('cancel-overlay');
}

function selectCancelReason(btn) {
  document.querySelectorAll('.cancel-reason-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedCancelReason = btn.getAttribute('data-reason');
  const otherDiv = document.getElementById('other-reason-input');
  if (selectedCancelReason === 'Outro') {
    if (otherDiv) otherDiv.style.display = 'block';
    const otherText = document.getElementById('cancel-other-text');
    if (otherText) otherText.focus();
  } else {
    if (otherDiv) otherDiv.style.display = 'none';
  }
  const confirmBtn = document.getElementById('confirm-cancel-btn');
  if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.style.opacity = '1'; }
}

async function submitCancel() {
  if (!currentUser) {
    showToast("Erro: usuÃ¡rio nÃ£o encontrado", "error");
    return;
  }

  let finalReason = selectedCancelReason;
  if (selectedCancelReason === 'Outro') {
    const otherText = document.getElementById('cancel-other-text').value.trim();
    if (!otherText) {
      showToast("Por favor, digite o motivo", "error");
      return;
    }
    finalReason = `Outro: ${otherText}`;
  }
  if (!finalReason) {
    showToast("Por favor, selecione um motivo", "error");
    return;
  }

  const confirmBtn = document.getElementById('confirm-cancel-btn');
  if (confirmBtn) { confirmBtn.disabled = true; confirmBtn.style.opacity = '0.4'; confirmBtn.textContent = 'Cancelando...'; }

  try {
    // Registra o motivo no Firestore
    await db.collection('cancelamentos').add({
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || localStorage.getItem('guiaNome') || '',
      motivo: finalReason,
      dataCancelamento: new Date().toISOString(),
      plataforma: 'PWA'
    });

    // Cancela a assinatura no Mercado Pago
    const idToken = await currentUser.getIdToken();
    const res = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ uid: currentUser.uid }),
    });
    const data = await res.json();

    if (data.status === 'cancelled') {
      // Busca a data real de expiracao
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data();
      const dataExpira = formatCancelDate(userData?.premiumExpira);
      setCancelResultCopy({
        title: 'Assinatura cancelada',
        subtitle: 'Seu acesso premium continua até',
        note: 'Depois disso, você volta ao plano gratuito automaticamente. Se mudar de ideia, é só assinar novamente.',
        expiry: dataExpira
      });
      cancelStep(3);
    } else if (data.status === 'no_subscription_paid_access') {
      setCancelResultCopy({
        title: 'Nenhuma renovação ativa',
        subtitle: 'Seu acesso já pago continua até',
        note: 'Não há assinatura recorrente para cancelar. Seu Premium permanece ativo até a data acima.',
        expiry: formatCancelDate(data.accessUntil)
      });
      cancelStep(3);
    } else {
      throw new Error(data.error || 'Erro ao cancelar');
    }

  } catch (e) {
    console.error('Erro cancelamento:', e);
    // Se nÃ£o tem assinatura no MP (trial ou Pix) â€” cancela sÃ³ localmente
    if (e.message?.includes('Nenhuma assinatura')) {
      await db.collection('users').doc(currentUser.uid).update({ premium: false });
      window.userIsPremium = false;
      localStorage.setItem('userIsPremium', 'false');
      updatePremiumUI();
      hideCancelModal();
      showToast("Assinatura cancelada.", "success");
    } else {
      showToast("Erro ao cancelar. Tente novamente.", "error");
      if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.style.opacity = '1'; confirmBtn.textContent = 'Confirmar cancelamento'; }
    }
  }
}

async function updatePremiumUI() {
  const cancelSection = document.getElementById('cancel-premium-section');
  if (!cancelSection) return;

  cancelSection.style.display = window.userIsPremium === true ? 'block' : 'none';
  if (window.userIsPremium !== true) return;

  setCancelButtonState({ text: 'Gerenciando acesso...', enabled: false });

  try {
    if (!currentUser) {
      setCancelButtonState({ text: 'Cancelar assinatura', enabled: true });
      return;
    }

    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data() || {};
    const origin = inferPremiumOrigin(userData);
    const expiresText = formatCancelDate(userData.premiumExpira);

    if (origin === 'assinatura') {
      if (userData.assinaturaStatus === 'cancelled') {
        setCancelButtonState({ text: 'Renovação cancelada - acesso até ' + expiresText, enabled: false });
      } else {
        setCancelButtonState({ text: 'Cancelar renovação', enabled: true });
      }
      return;
    }

    if (origin === 'pix' || origin === 'pagamento') {
      setCancelButtonState({ text: 'Acesso vÃ¡lido atÃ© ' + expiresText, enabled: false });
      return;
    }

    if (origin === 'trial') {
      setCancelButtonState({ text: 'Encerrar trial', enabled: true });
      return;
    }

    setCancelButtonState({ text: 'Encerrar acesso Premium', enabled: true });
  } catch (e) {
    console.log('updatePremiumUI fallback', e);
    setCancelButtonState({ text: 'Cancelar assinatura', enabled: true });
  }
}
