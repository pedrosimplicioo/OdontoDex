// ========== CANCELAMENTO PREMIUM ============================
// ============================================================

let selectedCancelReason = null;

function cancelStep(step) {
  document.getElementById('cancel-step-1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('cancel-step-2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('cancel-step-3').style.display = step === 3 ? 'block' : 'none';
}

function openCancelModal() {
  if (!currentUser) {
    showToast("Faça login para cancelar a assinatura", "error");
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
    showToast("Erro: usuário não encontrado", "error");
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
    const res = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: currentUser.uid }),
    });
    const data = await res.json();

    if (data.status === 'cancelled') {
      // Busca a data real de expiração
      const userDoc = await db.collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data();
      let dataExpira = '—';
      if (userData?.premiumExpira) {
        const expira = userData.premiumExpira.toDate();
        dataExpira = expira.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      document.getElementById('cancel-expiry-date').textContent = dataExpira;
      cancelStep(3);
    } else {
      throw new Error(data.error || 'Erro ao cancelar');
    }

  } catch (e) {
    console.error('Erro cancelamento:', e);
    // Se não tem assinatura no MP (trial ou Pix) — cancela só localmente
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

function updatePremiumUI() {
  const cancelSection = document.getElementById('cancel-premium-section');
  if (cancelSection) {
    cancelSection.style.display = window.userIsPremium === true ? 'block' : 'none';
  }
}
