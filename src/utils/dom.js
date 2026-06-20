// ==================== UTILS ====================
function showToast(msg,type){
  const t=document.getElementById("toast");
  if(!t)return;
  t.textContent=msg;
  t.style.backgroundColor=type==="success"?"#059669":"#DC2626";
  t.classList.add("active");
  setTimeout(()=>t.classList.remove("active"),2500);
}
function showLoading(){const el=document.getElementById("loading-overlay");if(el)el.classList.add("active");}
function hideLoading(){const el=document.getElementById("loading-overlay");if(el)el.classList.remove("active");}
// ── CONFIGURAÇÕES ──────────────────────────────────────────────────────────
let editTratSelected = '';

function atualizarSaudacao(){
  var nomeEl = document.getElementById('hdr-nome');
  if(!nomeEl) return;
  var nome = localStorage.getItem('guiaNome') || '';
  var trat = localStorage.getItem('guiaTratamento') ?? '';
  var perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  
  if(nome){
    if(perfil === 'estudante'){
      nomeEl.textContent = 'Olá, ' + nome + '!';
    } else {
      var t = trat ? trat + ' ' : '';
      nomeEl.textContent = 'Olá, ' + t + nome + '!';
    }
  } else {
    nomeEl.textContent = 'Olá!';
  }
  
  if (perfil === 'estudante' && localStorage.getItem('studentBannerDismissed') !== 'true') {
    const bannerExistente = document.getElementById('student-banner');
    const appAtivo = document.getElementById('screen-app')?.classList.contains('active');
    if (!bannerExistente && appAtivo && typeof adicionarBannerEstudante === 'function') {
      adicionarBannerEstudante();
    }
  }
}

function renderSettings(){
  // Esconde linha de tratamento se for estudante
  var perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  var tratRow = document.getElementById('cfg-trat-row');
  if(tratRow) tratRow.style.display = perfil==='estudante' ? 'none' : 'flex';

  if(!currentUser) return;
const rawDn = currentUser.displayName || currentUser.email.split('@')[0] || '';
const dn = perfil === 'estudante'
  ? rawDn.replace(/^(Dr\.|Dra\.)\s*/i, '').trim()
  : rawDn;
const dnFmt = dn.split(' ').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1);}).join(' ');
  const av = document.getElementById('cfg-avatar');
  if(av){
    av.className = window.userIsPremium ? 'cfg-plan-icon premium' : 'cfg-plan-icon';
    av.innerHTML = window.userIsPremium ? '<i class="ti ti-crown"></i>' : '<i class="ti ti-user"></i>';
  }
  const cn = document.getElementById('cfg-user-name');
  if(cn) cn.textContent = dnFmt;
  const ce = document.getElementById('cfg-user-email');
  if(ce) ce.textContent = currentUser.email;
  const cv = document.getElementById('cfg-nome-val');
  if(cv) cv.textContent = localStorage.getItem('guiaNome') || 'Nao definido';
  // Tratamento salvo
  const tratSalvo = localStorage.getItem('guiaTratamento') ?? '';
  const ctv = document.getElementById('cfg-trat-val');
  if(ctv) ctv.textContent = tratSalvo || 'Sem título';
  // Dark mode
  const isDark = document.body.classList.contains('dark');
  const darkIcon = document.getElementById('cfg-dark-icon');
  const darkLabel = document.getElementById('cfg-dark-label');
  const darkToggle = document.getElementById('cfg-dark-toggle');
  const darkKnob = document.getElementById('cfg-dark-knob');
  if(darkIcon) darkIcon.innerHTML = isDark ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon-stars"></i>';
  if(darkLabel) darkLabel.textContent = isDark ? 'Ativar modo claro' : 'Ativar modo escuro';
  if(darkToggle) darkToggle.style.background = isDark ? '#7C3FA0' : '#CBD5E1';
  if(darkKnob) darkKnob.style.left = isDark ? '21px' : '3px';
  renderSubscriptionSummary();
}

function settingsDate(value) {
  if (!value) return '—';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function settingsShortDate(value) {
  if (!value) return 'Sem validade ativa';
  const date = value.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sem validade ativa';
  return 'Válido até ' + date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
}

function inferSettingsPremiumOrigin(userData) {
  if (userData && userData.premiumOrigem) return userData.premiumOrigem;
  if (userData && userData.assinaturaId) return 'assinatura';
  if (userData && userData.ultimoPagamentoId) return 'pagamento';
  if (userData && userData.trialAtivado) return 'trial';
  return 'free';
}

function setSubscriptionCardState(state) {
  const icon = document.getElementById('cfg-subscription-icon');
  const kicker = document.getElementById('cfg-subscription-kicker');
  const title = document.getElementById('cfg-subscription-title');
  const short = document.getElementById('cfg-subscription-short');
  const text = document.getElementById('cfg-subscription-text');
  const validity = document.getElementById('cfg-subscription-validity');
  const renewal = document.getElementById('cfg-subscription-renewal');
  const action = document.getElementById('cfg-subscription-action');
  const note = document.getElementById('cfg-subscription-note');
  if (!title) return;

  if (icon) icon.innerHTML = state.icon || '<i class="ti ti-credit-card"></i>';
  if (kicker) kicker.textContent = state.kicker;
  if (title) title.textContent = state.title;
  if (short) short.textContent = state.short;
  if (text) text.textContent = state.text;
  if (validity) validity.textContent = state.validity;
  if (renewal) renewal.textContent = state.renewal;
  if (note) note.textContent = state.note;
  if (action) {
    action.textContent = state.actionText;
    action.disabled = state.action === 'none';
    action.dataset.action = state.action;
  }
}

async function renderSubscriptionSummary() {
  const card = document.getElementById('cfg-subscription-card');
  if (!card) return;

  if (!currentUser) {
    setSubscriptionCardState({
      icon: '<i class="ti ti-credit-card"></i>',
      kicker: 'Minha assinatura',
      title: 'Entre para gerenciar',
      short: 'Login necessário',
      text: 'Faça login para ver seu plano e pagamentos.',
      validity: '—',
      renewal: '—',
      action: 'none',
      actionText: 'Indisponível',
      note: 'O pagamento usa o fluxo seguro do OdontoDex.'
    });
    return;
  }

  setSubscriptionCardState({
    icon: '<i class="ti ti-loader-2"></i>',
    kicker: 'Minha assinatura',
    title: 'Verificando acesso...',
    short: 'Aguarde um instante',
    text: 'Carregando as informações do seu plano.',
    validity: '—',
    renewal: '—',
    action: 'none',
    actionText: 'Carregando',
    note: 'O pagamento usa o fluxo seguro do OdontoDex.'
  });

  try {
    const doc = await db.collection('users').doc(currentUser.uid).get();
    const userData = doc.exists ? (doc.data() || {}) : {};
    const expira = userData.premiumExpira ? (userData.premiumExpira.toDate ? userData.premiumExpira.toDate() : new Date(userData.premiumExpira)) : null;
    const isValid = expira && !Number.isNaN(expira.getTime()) && expira > new Date();
    const isPremium = userData.premium === true && isValid;
    const origin = isPremium ? inferSettingsPremiumOrigin(userData) : 'free';
    const validity = isPremium ? settingsDate(expira) : 'Sem Premium ativo';
    const short = isPremium ? settingsShortDate(expira) : 'Premium disponível';

    if (origin === 'assinatura' && userData.assinaturaStatus !== 'cancelled') {
      setSubscriptionCardState({
        icon: '<i class="ti ti-refresh"></i>',
        kicker: 'Assinatura mensal ativa',
        title: 'Premium mensal no cartão',
        short,
        text: 'Sua assinatura mensal no cartão está ativa.',
        validity,
        renewal: 'Renovação automática',
        action: 'cancel',
        actionText: 'Cancelar renovação',
        note: 'O cancelamento interrompe a renovação, mantendo o acesso já pago.'
      });
      return;
    }

    if (origin === 'assinatura' && userData.assinaturaStatus === 'cancelled') {
      setSubscriptionCardState({
        icon: '<i class="ti ti-circle-check"></i>',
        kicker: 'Renovação cancelada',
        title: 'Premium ativo até o fim do período',
        short,
        text: 'Você mantém o acesso até a validade atual e pode ativar a renovação mensal novamente.',
        validity,
        renewal: 'Cancelada',
        action: 'payment',
        actionText: 'Ver opções de pagamento',
        note: 'Seu acesso atual será preservado.'
      });
      return;
    }

    if (origin === 'pix' || origin === 'pagamento') {
      setSubscriptionCardState({
        icon: '<i class="ti ti-circle-check"></i>',
        kicker: 'Acesso já pago',
        title: 'Premium por pagamento avulso',
        short,
        text: 'Seu acesso atual não possui renovação automática. Você pode ver as opções de pagamento para manter o Premium sem interrupção.',
        validity,
        renewal: 'Sem recorrência',
        action: 'payment',
        actionText: 'Ver opções de pagamento',
        note: 'Seu período já pago será preservado.'
      });
      return;
    }

    if (origin === 'trial') {
      setSubscriptionCardState({
        icon: '<i class="ti ti-clock"></i>',
        kicker: 'Período de teste',
        title: 'Trial Premium',
        short,
        text: 'Você pode ativar o Premium antes do fim do trial para manter o acesso sem interrupção.',
        validity,
        renewal: 'Não renova automaticamente',
        action: 'payment',
        actionText: 'Ver opções de pagamento',
        note: 'Pix libera 30 dias sem renovação; cartão ativa assinatura mensal.'
      });
      return;
    }

    if (origin === 'manual' && isPremium) {
      setSubscriptionCardState({
        icon: '<i class="ti ti-sparkles"></i>',
        kicker: 'Acesso Premium',
        title: 'Premium liberado',
        short,
        text: 'Seu acesso Premium está ativo. Você pode ver as opções de pagamento para manter o acesso sem interrupção.',
        validity,
        renewal: 'Manual',
        action: 'payment',
        actionText: 'Ver opções de pagamento',
        note: 'Pix libera 30 dias sem renovação; cartão ativa assinatura mensal.'
      });
      return;
    }

    setSubscriptionCardState({
      icon: '<i class="ti ti-credit-card"></i>',
      kicker: 'Plano gratuito',
      title: 'Sem assinatura ativa',
      short: 'Premium disponível',
      text: 'Escolha Pix avulso ou assinatura mensal no cartão para liberar os recursos Premium.',
      validity: 'Sem Premium ativo',
      renewal: 'Inativa',
      action: 'payment',
      actionText: 'Ver opções de pagamento',
      note: 'O pagamento só libera Premium depois da confirmação segura.'
    });
  } catch (e) {
    console.log('Erro ao carregar assinatura', e);
    setSubscriptionCardState({
      icon: '<i class="ti ti-alert-circle"></i>',
      kicker: 'Minha assinatura',
      title: 'Não foi possível carregar',
      short: 'Tente novamente',
      text: 'Não conseguimos buscar o status da assinatura agora.',
      validity: '—',
      renewal: '—',
      action: 'none',
      actionText: 'Indisponível',
      note: 'Verifique sua conexão e tente novamente.'
    });
  }
}

function toggleSubscriptionDetails() {
  const card = document.getElementById('cfg-subscription-card');
  const btn = document.getElementById('cfg-subscription-toggle');
  if (!card) return;
  const expanded = !card.classList.contains('expanded');
  card.classList.toggle('expanded', expanded);
  if (btn) btn.setAttribute('aria-expanded', String(expanded));
}

function handleSubscriptionAction() {
  const action = document.getElementById('cfg-subscription-action')?.dataset.action;
  if (action === 'cancel') {
    openCancelModal();
    return;
  }
  if (action === 'payment') {
    if (typeof abrirTelaPayment === 'function') {
      abrirTelaPayment();
    } else {
      showOverlay('premium-overlay');
    }
  }
}

function openEditName(){
  const inp = document.getElementById('edit-name-input');
  if(inp && currentUser){
    const dn = currentUser.displayName || '';
    inp.value = localStorage.getItem('guiaNome') || '';
  }
  showOverlay('edit-name-overlay');
  setTimeout(function(){document.getElementById('edit-name-input').focus();}, 100);
}

async function saveEditName(){
  var val = document.getElementById('edit-name-input').value.trim();
  if(!val){showToast('Digite um nome','error');return;}
  var primeiro = val.split(' ').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1).toLowerCase();}).join(' ');
  localStorage.setItem('guiaNome', primeiro);
  if(currentUser){
    try{
      await db.collection('users').doc(currentUser.uid).update({nome: primeiro});
    }catch(e){console.log('Firestore indisponível',e);}
  }
  hideOverlay('edit-name-overlay');
  atualizarSaudacao();
  showToast('Nome atualizado!','success');
  renderSettings();
}

function openEditTratamento(){
  const perfil = localStorage.getItem('guiaPerfil') || 'dentista';
  if(perfil === 'estudante') return;
  
  const trat = localStorage.getItem('guiaTratamento') ?? 'Dr.';
  editTratSelected = trat;
  document.getElementById('trat-dr').className = 'cfg-sel-btn'+(trat==='Dr.'?' selected':'');
  document.getElementById('trat-dra').className = 'cfg-sel-btn'+(trat==='Dra.'?' selected':'');
  document.getElementById('trat-none').className = 'cfg-sel-btn'+(trat===''?' selected':'');
  showOverlay('edit-trat-overlay');
}

function selectTratEdit(t){
  editTratSelected = t;
  document.getElementById('trat-dr').className = 'cfg-sel-btn'+(t==='Dr.'?' selected':'');
  document.getElementById('trat-dra').className = 'cfg-sel-btn'+(t==='Dra.'?' selected':'');
  document.getElementById('trat-none').className = 'cfg-sel-btn'+(t===''?' selected':'');
}

async function saveEditTratamento(){
  localStorage.setItem('guiaTratamento', editTratSelected);
  if(currentUser){
    try{
      const nome = localStorage.getItem('guiaNome') || (currentUser.displayName||'').split(' ').filter(function(p){return p!=='Dr.'&&p!=='Dra.';}).join(' ').split(' ')[0] || '';
      const novoDisplay = editTratSelected ? editTratSelected+' '+nome : nome;
      await currentUser.updateProfile({displayName: novoDisplay});
    }catch(e){console.log(e);}
  }
  hideOverlay('edit-trat-overlay');
  atualizarSaudacao();
  showToast('Tratamento atualizado!','success');
  renderSettings();
}

function syncRootDarkMode(isDark){document.documentElement.classList.toggle("dark",!!isDark);}
function toggleDarkMode(){document.body.classList.toggle("dark");const isDark=document.body.classList.contains("dark");syncRootDarkMode(isDark);const btn=document.getElementById("dark-toggle");if(btn)btn.innerHTML=isDark?'<i class="ti ti-sun"></i>':'<i class="ti ti-moon-stars"></i>';localStorage.setItem("darkMode",isDark);}
function initDarkMode(){const btn=document.getElementById("dark-toggle");const isDark=localStorage.getItem("darkMode")==="true";document.body.classList.toggle("dark",isDark);syncRootDarkMode(isDark);if(btn)btn.innerHTML=isDark?'<i class="ti ti-sun"></i>':'<i class="ti ti-moon-stars"></i>';}
function playInternalExpand(el){
  if(!el) return;
  clearTimeout(el.__internalExpandTimer);
  el.style.removeProperty("max-height");
  el.classList.remove("internal-expand-out");
  el.classList.remove("internal-expand-in");
  void el.offsetWidth;
  el.classList.add("internal-expand-in");
}
function hideInternalExpand(el, onHidden){
  if(!el) {
    if(typeof onHidden === "function") onHidden();
    return;
  }
  clearTimeout(el.__internalExpandTimer);
  el.classList.remove("internal-expand-in");
  el.classList.add("internal-collapsing");
  el.style.maxHeight = el.scrollHeight + "px";
  requestAnimationFrame(() => {
    el.classList.add("internal-expand-out");
    el.style.maxHeight = "0px";
  });
  el.__internalExpandTimer = setTimeout(() => {
    el.classList.remove("internal-expand-out", "internal-collapsing");
    el.style.removeProperty("max-height");
    if(typeof onHidden === "function") onHidden();
  }, 920);
}
function hideInternalShow(el){
  if(!el) return;
  if(!el.classList.contains("show")) return;
  hideInternalExpand(el, () => el.classList.remove("show"));
}
function completeOverlayClose(el){
  if(!el) return;
  el.classList.remove("modal-closing","active");
}
function hideOverlay(id,options){
  const el=document.getElementById(id);
  if(!el)return;
  clearTimeout(el.__modalCloseTimer);
  if(options&&options.immediate){
    completeOverlayClose(el);
    return;
  }
  if(!el.classList.contains("active")){
    completeOverlayClose(el);
    return;
  }
  el.classList.add("modal-closing");
  el.__modalCloseTimer=setTimeout(()=>completeOverlayClose(el),260);
}
function showOverlay(id){
  const el=document.getElementById(id);
  if(!el) return;
  clearTimeout(el.__modalCloseTimer);
  el.classList.remove("modal-closing");
  el.classList.add("active");
  const scrollables=[el, ...el.querySelectorAll(".modal,.prem-modal,.trial-used-modal,.ios-install-modal")];
  scrollables.forEach(node=>{ if(node) node.scrollTop=0; });
  window.scrollTo(0,0);
}
function uid(){return Math.random().toString(36).slice(2,8);}
