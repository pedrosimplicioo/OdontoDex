// ==================== LOGIN ====================
let resendVerificationAvailableAt = 0;
let resendVerificationTimer = null;
let emailVerificationAutoCheckTimer = null;
let emailVerificationAutoCheckBusy = false;

function showLoginScreen(){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("screen-login").classList.add("active");
  showLogin();
}

function showAppScreen(){
  navigationHistory = [];
  _activateScreen("home");
  // RAF duplo garante que display:flex foi aplicado antes de renderizar
 requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        if(DATA && typeof renderHome === "function") renderHome();
        const shouldShowTrialWelcome = window._trialRecemAtivado === true || localStorage.getItem("showTrialWelcomeOnce") === "1";
        window._suspenderBannerEstudante = shouldShowTrialWelcome;
        atualizarSaudacao();
        window._suspenderBannerEstudante = false;
        if (!shouldShowTrialWelcome) adicionarBannerEstudante();
        
        if(window._premiumExpirou) {
          window._premiumExpirou = false;
          setTimeout(() => mostrarModalExpirado(), 800);
        }

        if(shouldShowTrialWelcome) {
          window._trialRecemAtivado = false;
          localStorage.removeItem("showTrialWelcomeOnce");
          setTimeout(() => {
            mostrarModalTrialBoasVindas();
            setTimeout(() => adicionarBannerEstudante(), 500);
          }, 1000);
        }

        if(window._mensagemPendente === 'trial_manual') {
          window._mensagemPendente = null;
          setTimeout(() => mostrarModalTrialManual(), 1000);
        }

        const shouldShowTrialUsed = window._trialJaUtilizado === true || localStorage.getItem("showTrialUsedModalOnce") === "1";
        if(shouldShowTrialUsed) {
          window._trialJaUtilizado = false;
          localStorage.removeItem("showTrialUsedModalOnce");
          setTimeout(() => showTrialUsedModal(), 900);
        }
      });
    });
}
function showLogin(){
  stopEmailVerificationAutoCheck();
  document.getElementById("login-form").style.display="block";
  document.getElementById("register-form").style.display="none";
  document.getElementById("reset-form").style.display="none";
  const vf=document.getElementById("email-verification-form");if(vf)vf.style.display="none";
}
function showRegister(){
  stopEmailVerificationAutoCheck();
  document.getElementById("login-form").style.display="none";
  document.getElementById("register-form").style.display="block";
  document.getElementById("reset-form").style.display="none";
  const vf=document.getElementById("email-verification-form");if(vf)vf.style.display="none";
  validarCadastro();
}
function showReset(){
  stopEmailVerificationAutoCheck();
  document.getElementById("login-form").style.display="none";
  document.getElementById("register-form").style.display="none";
  document.getElementById("reset-form").style.display="block";
  const vf=document.getElementById("email-verification-form");if(vf)vf.style.display="none";
}

function showVerificationFeedback(message, type){
  const el=document.getElementById("verify-feedback");
  if(!el)return;
  el.textContent=message || "";
  el.className="verify-feedback " + (type || "info");
}

function showVerificationCodeFeedback(message){
  const el=document.getElementById("verify-code-feedback");
  const input=document.getElementById("verify-code-input");
  if(!el)return;
  el.textContent=message || "";
  el.className=message ? "verify-code-feedback error" : "verify-code-feedback";
  if(input) input.classList.toggle("has-error", !!message);
}

function setAuthButtonProcessing(buttonOrId, label){
  const btn=typeof buttonOrId==="string"?document.getElementById(buttonOrId):buttonOrId;
  if(!btn || btn.classList.contains("is-processing")) return btn;
  btn.dataset.originalHtml=btn.innerHTML;
  btn.dataset.originalDisabled=btn.disabled ? "true" : "false";
  btn.disabled=true;
  btn.setAttribute("disabled","disabled");
  btn.setAttribute("aria-busy","true");
  btn.classList.add("is-processing");
  document.body?.classList.add("auth-button-processing");
  btn.innerHTML=`<span class="btn-mini-spinner" aria-hidden="true"></span><span>${label}</span>`;
  return btn;
}

function clearAuthButtonProcessing(buttonOrId){
  const btn=typeof buttonOrId==="string"?document.getElementById(buttonOrId):buttonOrId;
  if(!btn || !btn.classList.contains("is-processing")) return;
  btn.innerHTML=btn.dataset.originalHtml || btn.textContent || "";
  btn.classList.remove("is-processing");
  btn.removeAttribute("aria-busy");
  if(btn.dataset.originalDisabled === "true") {
    btn.disabled=true;
    btn.setAttribute("disabled","disabled");
  } else {
    btn.disabled=false;
    btn.removeAttribute("disabled");
  }
  delete btn.dataset.originalHtml;
  delete btn.dataset.originalDisabled;
  if(!document.querySelector(".is-processing")) document.body?.classList.remove("auth-button-processing");
}

function showEmailVerificationScreen(email, message, type){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById("screen-login").classList.add("active");
  document.getElementById("login-form").style.display="none";
  document.getElementById("register-form").style.display="none";
  document.getElementById("reset-form").style.display="none";
  const vf=document.getElementById("email-verification-form");
  if(vf)vf.style.display="block";
  const emailEl=document.getElementById("verify-email-display");
  if(emailEl)emailEl.textContent=email || currentUser?.email || "seu email";
  if(message) showVerificationFeedback(message, type || "info");
  else {
    const feedback=document.getElementById("verify-feedback");
    if(feedback){feedback.textContent="";feedback.className="verify-feedback";}
  }
  showVerificationCodeFeedback("");
  updateVerificationResendButton();
  const codeInput=document.getElementById("verify-code-input");
  if(codeInput) setTimeout(()=>codeInput.focus(),120);
}

async function sendVerificationEmailForUser(user){
  if(!user) throw new Error("Usuario nao autenticado.");
  const idToken=await user.getIdToken(true);
  const response=await fetch("/api/email-code", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + idToken
    },
    body:JSON.stringify({action:"send"})
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok){
    const error=new Error(data.error || "Não foi possível enviar o código.");
    error.code=data.status || "email-code/send-failed";
    error.seconds=data.seconds;
    throw error;
  }
  return data;
}

function getEmailVerificationErrorMessage(error){
  const code=error?.code || "";
  const messages={
    "auth/unauthorized-continue-uri":"O Firebase recusou o link de retorno. Adicione www.odontodex.com.br nos dominios autorizados do Firebase Auth.",
    "auth/invalid-continue-uri":"O link de retorno do email de verificação está inválido.",
    "auth/missing-continue-uri":"O link de retorno do email de verificação não foi informado.",
    "auth/too-many-requests":"Muitos envios em pouco tempo. Aguarde alguns minutos e tente reenviar.",
    "auth/user-token-expired":"Sua sessao expirou. Entre novamente e reenvie o email.",
    "auth/network-request-failed":"Falha de conexao. Verifique a internet e tente reenviar.",
    "cooldown":"Aguarde a contagem terminar para reenviar o código."
  };
  return messages[code] || error?.message || "Não foi possível enviar o código agora. Confira o endereço e tente novamente.";
}

// Email verification: keeps the resend button blocked with a visible countdown.
function updateVerificationResendButton(){
  const btn=document.getElementById("resend-verification-btn");
  if(!btn)return;
  const seconds=Math.ceil((resendVerificationAvailableAt-Date.now())/1000);
  if(seconds > 0){
    btn.disabled=true;
    btn.setAttribute("disabled","disabled");
    btn.setAttribute("aria-disabled","true");
    btn.classList.add("is-counting");
    btn.textContent="Reenviar em " + seconds + "s";
  }else{
    btn.disabled=false;
    btn.removeAttribute("disabled");
    btn.setAttribute("aria-disabled","false");
    btn.classList.remove("is-counting");
    btn.textContent="Reenviar email";
  }
}

function startVerificationResendCooldown(durationMs){
  resendVerificationAvailableAt=Date.now()+(durationMs || 60000);
  updateVerificationResendButton();
  if(resendVerificationTimer) clearInterval(resendVerificationTimer);
  resendVerificationTimer=setInterval(()=>{
    updateVerificationResendButton();
    if(Date.now() >= resendVerificationAvailableAt){
      clearInterval(resendVerificationTimer);
      resendVerificationTimer=null;
      updateVerificationResendButton();
    }
  },1000);
}

function stopEmailVerificationAutoCheck(){
  if(emailVerificationAutoCheckTimer){
    clearInterval(emailVerificationAutoCheckTimer);
    emailVerificationAutoCheckTimer=null;
  }
  emailVerificationAutoCheckBusy=false;
}

// Email verification: auto-detects a verified email while this screen is open.
function startEmailVerificationAutoCheck(){
  if(emailVerificationAutoCheckTimer) return;
  emailVerificationAutoCheckTimer=setInterval(async ()=>{
    const form=document.getElementById("email-verification-form");
    if(!auth.currentUser || !form || form.style.display === "none") return;
    if(emailVerificationAutoCheckBusy) return;
    emailVerificationAutoCheckBusy=true;
    try{
      await auth.currentUser.reload();
      if(auth.currentUser.emailVerified){
        stopEmailVerificationAutoCheck();
        showLoading();
        const result=await activateTrialAfterEmailVerified({showSuccess:true});
        hideLoading();
        if(result.ok){
          await loadAuthenticatedUserAndShowApp(auth.currentUser, {skipTrialActivation:true});
        }
      }
    }catch(e){
      hideLoading();
    }finally{
      emailVerificationAutoCheckBusy=false;
    }
  },5000);
}

function formatVerificationCodeInput(input){
  if(!input)return;
  input.value=String(input.value || "").replace(/\D/g,"").slice(0,6);
  showVerificationCodeFeedback("");
}

async function resendVerificationEmail(){
  const now=Date.now();
  if(now < resendVerificationAvailableAt){
    const seconds=Math.ceil((resendVerificationAvailableAt-now)/1000);
    showVerificationFeedback("Aguarde " + seconds + "s para reenviar o email.", "info");
    return;
  }
  if(!auth.currentUser){
    showLogin();
    const err=document.getElementById("login-error");
    if(err){err.textContent="Entre na sua conta para reenviar o email de verificação.";err.style.display="block";}
    return;
  }
  const resendBtn=setAuthButtonProcessing("resend-verification-btn","Enviando...");
  showLoading();
  try{
    const data=await sendVerificationEmailForUser(auth.currentUser);
    startVerificationResendCooldown((data.resendSeconds || 60) * 1000);
    showVerificationFeedback("Enviamos um novo código para seu email. Verifique também a caixa de spam.", "success");
  }catch(e){
    if(e.code === "cooldown" && e.seconds) startVerificationResendCooldown(e.seconds * 1000);
    showVerificationFeedback(getEmailVerificationErrorMessage(e), e.code === "cooldown" ? "info" : "error");
  }finally{
    hideLoading();
    clearAuthButtonProcessing(resendBtn);
    updateVerificationResendButton();
  }
}

async function activateTrialAfterEmailVerified(options){
  const showSuccess=options?.showSuccess !== false;
  const user=auth.currentUser;
  if(!user){
    showLogin();
    const err=document.getElementById("login-error");
    if(err){err.textContent="Email verificado. Entre na sua conta para liberar o Premium.";err.style.display="block";}
    return {ok:false, reason:"not_logged_in"};
  }
  await user.reload();
  if(!auth.currentUser.emailVerified){
    showEmailVerificationScreen(auth.currentUser.email, "Seu email ainda não foi verificado. Digite o código enviado para seu email.", "error");
    return {ok:false, reason:"not_verified"};
  }
  const idToken=await auth.currentUser.getIdToken(true);
  const response=await fetch("/api/activate-trial", {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer " + idToken
    }
  });
  const data=await response.json().catch(()=>({}));
  if(response.ok && data.status === "activated"){
    window.userIsPremium=true;
    localStorage.setItem("userIsPremium","true");
    window._trialRecemAtivado=true;
    localStorage.setItem("showTrialWelcomeOnce","1");
    if(showSuccess) showToast("Email verificado. Seus 7 dias de Premium foram liberados.","success");
    return {ok:true, status:data.status};
  }
  if(response.ok && data.status === "paid_active"){
    window.userIsPremium=true;
    localStorage.setItem("userIsPremium","true");
    return {ok:true, status:data.status};
  }
  if(response.ok && (data.status === "user_trial_used" || data.status === "email_trial_used")){
    window.userIsPremium=false;
    localStorage.setItem("userIsPremium","false");
    window._trialJaUtilizado=true;
    localStorage.setItem("showTrialUsedModalOnce","1");
    return {ok:true, status:data.status};
  }
  throw new Error(data.error || "Não foi possível liberar o trial.");
}

async function checkEmailVerificationAndActivate(){
  const code=String(document.getElementById("verify-code-input")?.value || "").replace(/\D/g,"");
  if(!/^\d{6}$/.test(code)){
    showVerificationCodeFeedback("Digite o código de 6 dígitos enviado para seu email.");
    return;
  }
  showVerificationCodeFeedback("");
  if(!auth.currentUser){
    showLogin();
    const err=document.getElementById("login-error");
    if(err){err.textContent="Entre na sua conta para confirmar o código.";err.style.display="block";}
    return;
  }
  const verifyBtn=setAuthButtonProcessing("verify-code-submit-btn","Verificando...");
  showLoading();
  try{
    const idToken=await auth.currentUser.getIdToken(true);
    const verifyResponse=await fetch("/api/email-code", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + idToken
      },
      body:JSON.stringify({action:"verify", code})
    });
    const verifyData=await verifyResponse.json().catch(()=>({}));
    if(!verifyResponse.ok){
      hideLoading();
      clearAuthButtonProcessing(verifyBtn);
      showVerificationCodeFeedback("Esse código não conferiu. Confira os 6 números enviados para seu email ou peça um novo código.");
      return;
    }
    await auth.currentUser.reload();
    const result=await activateTrialAfterEmailVerified({showSuccess:true});
    if(result.ok && result.reason !== "not_verified"){
      stopEmailVerificationAutoCheck();
      hideLoading();
      clearAuthButtonProcessing(verifyBtn);
      await loadAuthenticatedUserAndShowApp(auth.currentUser, {skipTrialActivation:true});
      return;
    }
    hideLoading();
    clearAuthButtonProcessing(verifyBtn);
  }catch(e){
    hideLoading();
    clearAuthButtonProcessing(verifyBtn);
    showVerificationFeedback("Não foi possível confirmar agora. Verifique sua conexão e tente novamente.", "error");
  }
}

async function logoutForAnotherEmail(){
  await auth.signOut();
  currentUser=null;
  localStorage.removeItem("userIsPremium");
  showLoginScreen();
}

function showTrialUsedModal(){
  const overlay=document.getElementById("trial-used-overlay");
  if(!overlay)return;
  clearTimeout(overlay.__modalCloseTimer);
  overlay.classList.remove("modal-closing");
  overlay.classList.add("active");
}

function closeTrialUsedModal(options){
  const overlay=document.getElementById("trial-used-overlay");
  if(!overlay)return;
  clearTimeout(overlay.__modalCloseTimer);
  if(options&&options.immediate){
    overlay.classList.remove("modal-closing","active");
    return;
  }
  overlay.classList.add("modal-closing");
  overlay.__modalCloseTimer=setTimeout(()=>overlay.classList.remove("modal-closing","active"),260);
}

function activatePremiumFromTrialUsed(){
  closeTrialUsedModal({immediate:true});
  if(typeof showOverlay === "function") showOverlay("premium-overlay");
  else {
    const premium=document.getElementById("premium-overlay");
    if(premium) premium.classList.add("active");
  }
}

function showOfflineAuthMessage(elementId){
  const msg="Você está offline. Para entrar, criar conta ou recuperar senha, conecte-se à internet. Se você já estava logado, o app continua disponível para consulta.";
  const err=document.getElementById(elementId);
  if(err){err.textContent=msg;err.style.display="block";}
  if(typeof showToast === "function") showToast("Você está offline. Login precisa de internet.", "error");
  return false;
}

function canUseOnlineAuth(elementId){
  if(!navigator.onLine) return showOfflineAuthMessage(elementId);
  if(!window.firebase || !auth?.signInWithEmailAndPassword) return showOfflineAuthMessage(elementId);
  return true;
}

async function doLoginGoogle(){
  const err=document.getElementById("login-error");
  if(!navigator.onLine || !window.firebase || !auth?.signInWithPopup) {
    showOfflineAuthMessage("login-error");
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  if(location.protocol==="file:"){
    const msg="Para entrar com Google, abra o OdontoDex pelo domínio publicado ou por localhost.";
    if(err){err.textContent=msg;err.style.display="block";}
    showToast(msg, "error");
    console.warn("Google login bloqueado em file://. Use https://www.odontodex.com.br ou localhost autorizado no Firebase.");
    return;
  }
  const googleBtn=setAuthButtonProcessing("google-login-btn","Entrando...");
  showLoading();
  try {
    const res = await auth.signInWithPopup(provider);
    currentUser = res.user;
    hideLoading();
    showToast("Login realizado!", "success");
    const docGoogle = await db.collection('users').doc(res.user.uid).get();
    if(!docGoogle.exists || !docGoogle.data().perfil) {
      const nomeGoogle = res.user.displayName || '';
      document.getElementById('gw-nome').value = nomeGoogle;
      gwPerfil = '';
      gwTrat = '';
      gwTratSelecionado = false;
      const gwTerms = document.getElementById('gw-terms-accepted');
      if (gwTerms) gwTerms.checked = false;
      const gwError = document.getElementById('gw-error');
      if (gwError) { gwError.textContent = ''; gwError.style.display = 'none'; }
      document.getElementById('gw-btn-dentista').className = 'select-btn';
      document.getElementById('gw-btn-estudante').className = 'select-btn';
      document.getElementById('gw-bloco-trat').style.display = 'none';
      gwValidarBotao();
      const googleWelcomeOverlay = document.getElementById('google-welcome-overlay');
      if (googleWelcomeOverlay) {
        googleWelcomeOverlay.style.display = 'flex';
        requestAnimationFrame(() => googleWelcomeOverlay.classList.add('active'));
      }
    } else {
      if(res.user.emailVerified && docGoogle.data().trialAtivado !== true) {
        try { await activateTrialAfterEmailVerified({showSuccess:true}); } catch(e) { console.log(e); }
      }
      await loadAuthenticatedUserAndShowApp(res.user);
    }
  } catch(e) {
    hideLoading();
    clearAuthButtonProcessing(googleBtn);
    console.error("Erro no login com Google:", e);
    const msgs={
      "auth/unauthorized-domain":"Este domínio não está autorizado no Firebase para login com Google.",
      "auth/popup-blocked":"O navegador bloqueou a janela do Google. Permita pop-ups ou abra no navegador.",
      "auth/popup-closed-by-user":"Login com Google cancelado antes de concluir.",
      "auth/cancelled-popup-request":"Já existe uma tentativa de login com Google em andamento.",
      "auth/operation-not-allowed":"Login com Google não está habilitado no Firebase.",
      "auth/network-request-failed":"Falha de conexão. Verifique sua internet e tente novamente."
    };
    const msg=msgs[e.code]||"Erro ao entrar com Google. Tente abrir pelo navegador ou usar email e senha.";
    if(err){err.textContent=msg;err.style.display="block";}
    showToast(msg, "error");
  }
  clearAuthButtonProcessing(googleBtn);
}
async function doLogin(){
  const email=document.getElementById("login-email")?.value?.trim();
  const pwd=document.getElementById("login-password")?.value;
  const err=document.getElementById("login-error");
  if(!email||!pwd){if(err){err.textContent="Preencha todos os campos";err.style.display="block";}return;}
  if(!canUseOnlineAuth("login-error")) return;
  const loginBtn=setAuthButtonProcessing("login-submit-btn","Entrando...");
  showLoading();
  try{
    const res=await auth.signInWithEmailAndPassword(email,pwd);
    currentUser=res.user;
    await currentUser.reload();
    const em=document.getElementById("user-email-display");if(em)em.textContent=currentUser.email;
    const periodoEl=document.getElementById("hdr-periodo");
    if(periodoEl)periodoEl.textContent="Disponivel agora";
    atualizarSaudacao();
    hideLoading();
    if(!currentUser.emailVerified){
      showEmailVerificationScreen(currentUser.email);
      try {
        await sendVerificationEmailForUser(currentUser);
        startVerificationResendCooldown(60000);
        showVerificationFeedback("Enviamos um código para seu email.", "success");
      } catch(e) {
        if(e.code === "cooldown" && e.seconds) startVerificationResendCooldown(e.seconds * 1000);
        showVerificationFeedback(getEmailVerificationErrorMessage(e), e.code === "cooldown" ? "info" : "error");
      }
      clearAuthButtonProcessing(loginBtn);
      return;
    }
    showToast("Login realizado!","success");
    await loadAuthenticatedUserAndShowApp(currentUser);
  }catch(e){
    hideLoading();
    clearAuthButtonProcessing(loginBtn);
    if(err){
      const msgs={"auth/user-not-found":"Usuário não encontrado","auth/wrong-password":"Senha incorreta","auth/invalid-email":"Email inválido","auth/too-many-requests":"Muitas tentativas. Aguarde um momento."};
      err.textContent=msgs[e.code]||"Erro ao entrar. Verifique suas credenciais.";
      err.style.display="block";
    }
  }
  clearAuthButtonProcessing(loginBtn);
}

// Variáveis de seleção do cadastro
let selectedTratamento = 'Dr.';
let selectedPerfil = 'dentista';
// ── MODAL BOAS-VINDAS GOOGLE ──────────────────────────────────────────────
let gwPerfil = '';
let gwTrat = '';
let gwTratSelecionado = false;

function gwSelecionarPerfil(p) {
  gwPerfil = p;
  document.getElementById('gw-btn-dentista').className = 'select-btn' + (p === 'dentista' ? ' selected' : '');
  document.getElementById('gw-btn-estudante').className = 'select-btn' + (p === 'estudante' ? ' selected' : '');
  document.getElementById('gw-bloco-trat').style.display = p === 'dentista' ? 'block' : 'none';
  if(p === 'estudante') gwTrat = '';
  gwValidarBotao();
}

function gwSelecionarTrat(t) {
  gwTrat = t;
  gwTratSelecionado = true;
  document.getElementById('gw-btn-dr').className = 'select-btn' + (t === 'Dr.' ? ' selected' : '');
  document.getElementById('gw-btn-dra').className = 'select-btn' + (t === 'Dra.' ? ' selected' : '');
  document.getElementById('gw-btn-semtitulo').className = 'select-btn' + (t === '' ? ' selected' : '');
  gwValidarBotao();
}

function gwValidarBotao() {
  const nome = document.getElementById('gw-nome').value.trim();
  const perfilOk = gwPerfil !== '';
  const tratOk = gwPerfil === 'estudante' || gwPerfil === 'dentista' && gwTrat !== undefined;
  const termosOk = document.getElementById('gw-terms-accepted')?.checked === true;
  const tudo = nome.length > 0 && perfilOk && (gwPerfil === 'estudante' || gwTratSelecionado) && termosOk;
  const btn = document.getElementById('gw-btn-confirmar');
  btn.disabled = !tudo;
  btn.style.background = tudo ? '#7C3FA0' : '#cbd5e1';
  btn.style.cursor = tudo ? 'pointer' : 'not-allowed';
}

async function gwConfirmar() {
  const nome = document.getElementById('gw-nome').value.trim();
  const gwError = document.getElementById('gw-error');
  if (gwError) { gwError.textContent = ''; gwError.style.display = 'none'; }
  if(!nome || !gwPerfil) return;
  if (document.getElementById('gw-terms-accepted')?.checked !== true) {
    if (gwError) {
      gwError.textContent = 'Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar sua conta.';
      gwError.style.display = 'block';
    }
    return;
  }
  const primeiroNome = nome.split(' ').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1).toLowerCase();}).join(' ');
  const displayName = gwPerfil === 'estudante' ? primeiroNome : (gwTrat ? gwTrat + ' ' + primeiroNome : primeiroNome);
  let metaGoogleRegistrationCompleted = false;
  const gwBtn=setAuthButtonProcessing("gw-btn-confirmar","Salvando...");
  showLoading();
  try {
    await currentUser.updateProfile({ displayName: displayName });
    await db.collection('users').doc(currentUser.uid).set({
      nome: primeiroNome,
      perfil: gwPerfil,
      tratamento: gwTrat,
      email: currentUser.email,
      emailNormalizado: String(currentUser.email || '').trim().toLowerCase(),
      criadoEm: new Date().toISOString(),
      dataPrimeiroAcesso: firebase.firestore.FieldValue.serverTimestamp(),
      acessosPorDia: {},
      premium: false,
      premiumOrigem: 'free',
      trialAtivado: false,
      emailVerificado: currentUser.emailVerified === true,
      termosAceitos: true,
      termosAceitosEm: firebase.firestore.FieldValue.serverTimestamp(),
      termosVersao: '1.0',
      privacidadeVersao: '1.1',
      origemCadastro: 'google'
    });
    window.userIsPremium = false;
    localStorage.setItem('userIsPremium', 'false');
    localStorage.setItem('guiaNome', primeiroNome);
    localStorage.setItem('guiaPerfil', gwPerfil);
    localStorage.setItem('guiaTratamento', gwTrat);
    if (gwPerfil === 'estudante') {
      localStorage.setItem('guiaTratamento', '');
      localStorage.removeItem('studentBannerLastDate');
      localStorage.removeItem('studentBannerDismissed');
    }
    metaGoogleRegistrationCompleted = true;
  } catch(e) { console.log(e); }
  hideLoading();
  clearAuthButtonProcessing(gwBtn);
  gwValidarBotao();
  const googleWelcomeOverlay = document.getElementById('google-welcome-overlay');
  if (googleWelcomeOverlay) {
    googleWelcomeOverlay.classList.remove('active');
    setTimeout(() => { googleWelcomeOverlay.style.display = 'none'; }, 260);
  }
  // Evento Meta Pixel: CompleteRegistration após finalizar cadastro Google.
  if (metaGoogleRegistrationCompleted && typeof trackMetaCompleteRegistrationOnce === "function") {
    trackMetaCompleteRegistrationOnce(currentUser?.uid, "google");
  }
  try {
    if (currentUser?.emailVerified) await activateTrialAfterEmailVerified({showSuccess:true});
  } catch(e) {
    showToast("Não foi possível liberar o trial agora. Tente novamente mais tarde.", "error");
  }
  await loadAuthenticatedUserAndShowApp(currentUser);
}
function selectTratamento(t){
  selectedTratamento=t;
  document.getElementById('btn-dr').className='select-btn'+(t==='Dr.'?' selected':'');
  document.getElementById('btn-dra').className='select-btn'+(t==='Dra.'?' selected':'');
  document.getElementById('btn-semtitulo').className='select-btn'+(t===''?' selected':'');
  validarCadastro();
}
function selectPerfil(p){
  selectedPerfil=p;
  document.getElementById('btn-dentista').className='select-btn'+(p==='dentista'?' selected':'');
  document.getElementById('btn-estudante').className='select-btn'+(p==='estudante'?' selected':'');
  document.getElementById('bloco-tratamento').style.display=p==='dentista'?'block':'none';
  if(p==='estudante') selectedTratamento='';
  if(p==='dentista' && selectedTratamento === '') selectedTratamento='Dr.';
  document.getElementById('btn-dr').className='select-btn'+(selectedTratamento==='Dr.'?' selected':'');
  document.getElementById('btn-dra').className='select-btn'+(selectedTratamento==='Dra.'?' selected':'');
  document.getElementById('btn-semtitulo').className='select-btn'+(selectedTratamento===''?' selected':'');
  validarCadastro();
}

function togglePasswordVisibility(fieldId, button){
  const input = document.getElementById(fieldId);
  if(!input || !button) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  button.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  button.innerHTML = show ? '<i class="ti ti-eye-off"></i>' : '<i class="ti ti-eye"></i>';
}

function updatePasswordMatchFeedback(){
  const pwd = document.getElementById("register-password")?.value || '';
  const confirm = document.getElementById("register-password-confirm")?.value || '';
  const feedback = document.getElementById("password-match-feedback");
  if(!feedback) return;
  if(confirm.length < 5){
    feedback.textContent = '';
    feedback.className = 'password-feedback';
    return;
  }
  const matches = pwd === confirm;
  feedback.textContent = matches ? 'As senhas coincidem.' : 'As senhas não coincidem.';
  feedback.className = 'password-feedback ' + (matches ? 'success' : 'error');
}

function validarCadastro(){
  const name=document.getElementById("register-name")?.value?.trim();
  const email=document.getElementById("register-email")?.value?.trim();
  const pwd=document.getElementById("register-password")?.value || '';
  const confirm=document.getElementById("register-password-confirm")?.value || '';
  const termosOk=document.getElementById("register-terms-accepted")?.checked === true;
  const btn=document.getElementById("register-submit-btn");
  updatePasswordMatchFeedback();
  if(!btn) return;
  const podeCriar = !!name && !!email && pwd.length >= 6 && pwd === confirm && termosOk;
  btn.disabled = !podeCriar;
  btn.style.opacity = podeCriar ? '1' : '0.55';
  btn.style.cursor = podeCriar ? 'pointer' : 'not-allowed';
}

async function doRegister(){
  const name=document.getElementById("register-name")?.value?.trim();
  const email=document.getElementById("register-email")?.value?.trim();
  const pwd=document.getElementById("register-password")?.value;
  const pwdConfirm=document.getElementById("register-password-confirm")?.value;
  const termosOk=document.getElementById("register-terms-accepted")?.checked === true;
  const err=document.getElementById("register-error");
  if(err){err.textContent='';err.style.display='none';}
  if(!canUseOnlineAuth("register-error")) return;
  if(!name||!email||!pwd){if(err){err.textContent="Preencha todos os campos";err.style.display="block";}return;}
  if(pwd.length<6){if(err){err.textContent="Use uma senha mais forte.";err.style.display="block";}return;}
  if(pwd !== pwdConfirm){if(err){err.textContent="As senhas não coincidem.";err.style.display="block";}return;}
  if(!termosOk){if(err){err.textContent="Você precisa aceitar os Termos de Uso e a Política de Privacidade para criar sua conta.";err.style.display="block";}return;}
  const registerBtn=setAuthButtonProcessing("register-submit-btn","Criando conta...");
  showLoading();
  try{
    const res=await auth.createUserWithEmailAndPassword(email,pwd);
    // Salva nome com tratamento no displayName
    const primeiroNome=name.split(' ')[0];
    const displayName=(selectedPerfil==='estudante' || !selectedTratamento)?primeiroNome:selectedTratamento+' '+primeiroNome;
    await res.user.updateProfile({displayName});
    // Salva perfil no Firestore
    try{
      await db.collection('users').doc(res.user.uid).set({
        nome:name,
        tratamento:selectedTratamento,
        perfil:selectedPerfil,
        email:email,
        emailNormalizado:String(email || '').trim().toLowerCase(),
        criadoEm:new Date().toISOString(),
        dataPrimeiroAcesso: firebase.firestore.FieldValue.serverTimestamp(),
        acessosPorDia: {},
        premium: false,
        premiumOrigem: 'free',
        trialAtivado: false,
        emailVerificado: false,
        termosAceitos: true,
        termosAceitosEm: firebase.firestore.FieldValue.serverTimestamp(),
        termosVersao: '1.0',
        privacidadeVersao: '1.1',
        origemCadastro: 'email'
      });
    }catch(e){console.log('Firestore indisponível',e);}
    // Salva perfil e tratamento no localStorage
    localStorage.setItem('guiaPerfil', selectedPerfil);
    if(selectedPerfil==='dentista') localStorage.setItem('guiaTratamento', selectedTratamento);
    if(selectedPerfil==='estudante') localStorage.setItem('guiaTratamento', '');
    localStorage.removeItem('studentBannerLastDate');
    localStorage.removeItem('studentBannerDismissed');
    currentUser=res.user;
    const em=document.getElementById('user-email-display');if(em)em.textContent=currentUser.email;
    let verificationMessage="Enviamos um código para seu email.";
    let verificationType="success";
    try {
      const codeData=await sendVerificationEmailForUser(currentUser);
      startVerificationResendCooldown((codeData.resendSeconds || 60) * 1000);
    } catch(sendError) {
      verificationMessage=getEmailVerificationErrorMessage(sendError);
      verificationType="error";
    }
    hideLoading();
    clearAuthButtonProcessing(registerBtn);
    validarCadastro();
    showToast('Conta criada. Enviamos um código para liberar o Premium.','success');
    window.userIsPremium = false;
    localStorage.setItem('userIsPremium', 'false');
// Evento Meta Pixel: CompleteRegistration após cadastro por email/senha concluído.
if (typeof trackMetaCompleteRegistrationOnce === "function") {
  trackMetaCompleteRegistrationOnce(currentUser?.uid, "email");
}
showEmailVerificationScreen(currentUser.email, verificationMessage, verificationType);
  }catch(e){
    hideLoading();
    clearAuthButtonProcessing(registerBtn);
    validarCadastro();
    if(err){
      const msgs={
        "auth/email-already-in-use":"Esse email já tem uma conta no OdontoDex. Entre com sua senha ou use a recuperação de acesso.",
        "auth/invalid-email":"Digite um email válido para criar sua conta.",
        "auth/weak-password":"Escolha uma senha com pelo menos 6 caracteres.",
        "auth/unauthorized-continue-uri":"Conta criada, mas o Firebase recusou o link de verificação. Adicione www.odontodex.com.br nos domínios autorizados do Firebase Auth.",
        "auth/invalid-continue-uri":"Conta criada, mas o link de verificação está inválido.",
        "auth/too-many-requests":"Conta criada, mas houve muitos envios de email em pouco tempo. Aguarde alguns minutos e tente reenviar."
      };
      err.textContent=msgs[e.code]||"Não foi possível criar sua conta agora. Confira os dados e tente novamente.";
      err.style.display="block";
    }
  }
}

async function doReset(){
  const email=document.getElementById("reset-email")?.value?.trim();
  const err=document.getElementById("reset-error");
  const suc=document.getElementById("reset-success");
  if(!email){if(err){err.textContent="Digite seu email";err.style.display="block";}return;}
  if(!canUseOnlineAuth("reset-error")) return;
  const resetBtn=setAuthButtonProcessing("reset-submit-btn","Enviando...");
  try{
    await auth.sendPasswordResetEmail(email);
    if(suc){suc.textContent="Email de recuperação enviado!";suc.style.display="block";}
    if(err)err.style.display="none";
  }catch(e){
    if(err){err.textContent="Erro ao enviar email. Verifique o endereço.";err.style.display="block";}
  }
  clearAuthButtonProcessing(resetBtn);
}
async function logout(){
  showLoading();
  await auth.signOut();
  currentUser=null;
  hideLoading();
  showToast("Logout realizado","success");
  showLoginScreen();
}
  function mostrarModalExpirado() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay active';
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="text-align:center;">
      <div class="modal-icon" style="margin-bottom:4px;color:#DC2626;"><i class="ti ti-alert-triangle"></i></div>
      <h2 class="modal-title" style="font-size:20px;">Seu acesso Premium expirou</h2>
      <p class="modal-sub" style="margin:8px 0 16px;">Você perdeu o acesso a mais de 50 protocolos clínicos, S.O.S. completo e prescrições.</p>
      <div style="background:#F5EEFB;border-radius:16px;padding:14px 16px;margin-bottom:20px;text-align:left;width:100%;">
        <div style="font-size:13px;font-weight:700;color:#7C3FA0;margin-bottom:8px;">O que você perde sem o Premium:</div>
        <div style="font-size:13px;color:#1E293B;line-height:1.8;">
          <i class="ti ti-lock"></i> Prótese, Endodontia, Cirurgia, Periodontia<br>
          <i class="ti ti-lock"></i> S.O.S. Clínico completo<br>
          <i class="ti ti-lock"></i> Prescrições detalhadas<br>
          <i class="ti ti-lock"></i> Cards de conduta e decisao clinica
        </div>
      </div>
      <button class="btn-primary" onclick="localStorage.setItem('modalExpiradoMostrado','1');this.closest('.overlay').remove();abrirTelaPayment();" style="margin-bottom:10px;">
  <i class="ti ti-lock-open"></i> Renovar por R$9,90/mês
</button>
<button class="btn-ghost" onclick="localStorage.setItem('modalExpiradoMostrado','1');this.closest('.overlay').remove()">Continuar sem Premium</button>
    </div>
  `;
  document.body.appendChild(overlay);
}
function mostrarModalTrialManual() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay active';
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="text-align:center;">
      <div class="modal-icon" style="margin-bottom:4px;color:#7C3FA0;"><i class="ti ti-gift"></i></div>
      <h2 class="modal-title" style="font-size:20px;">Você ganhou acesso Premium!</h2>
      <p class="modal-sub" style="margin:8px 0 16px;">O time OdontoDex liberou <strong>7 dias de acesso completo</strong> especialmente para você. Aproveite!</p>
      <div style="background:#F5EEFB;border-radius:16px;padding:14px 16px;margin-bottom:20px;text-align:left;width:100%;">
        <div style="font-size:13px;font-weight:700;color:#7C3FA0;margin-bottom:8px;"><i class="ti ti-circle-check"></i> O que você tem acesso agora:</div>
        <div style="font-size:13px;color:#1E293B;line-height:1.9;">
          <i class="ti ti-lock-open"></i> Todos os protocolos clínicos<br>
          <i class="ti ti-lock-open"></i> Prescrições completas<br>
          <i class="ti ti-lock-open"></i> S.O.S. Clínico completo<br>
          <i class="ti ti-lock-open"></i> Pacientes especiais
        </div>
      </div>
      <button class="btn-primary" onclick="this.closest('.overlay').remove()" style="margin-bottom:10px;">
        <i class="ti ti-rocket"></i> Explorar agora
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}
function mostrarModalTrialBoasVindas() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay active';
  overlay.innerHTML = `
    <div class="modal" onclick="event.stopPropagation()" style="text-align:center;">
      <div class="modal-icon" style="margin-bottom:4px;color:#7C3FA0;"><i class="ti ti-confetti"></i></div>
      <h2 class="modal-title" style="font-size:20px;">Bem-vindo ao OdontoDex!</h2>
      <p class="modal-sub" style="margin:8px 0 16px;">Você ganhou <strong>7 dias de acesso completo</strong> a todos os protocolos, prescrições e ferramentas do app.</p>
      <div style="background:#F5EEFB;border-radius:16px;padding:14px 16px;margin-bottom:20px;text-align:left;width:100%;">
        <div style="font-size:13px;font-weight:700;color:#7C3FA0;margin-bottom:8px;"><i class="ti ti-circle-check"></i> O que você tem acesso agora:</div>
        <div style="font-size:13px;color:#1E293B;line-height:1.8;">
          <i class="ti ti-lock-open"></i> Todos os protocolos clínicos<br>
          <i class="ti ti-lock-open"></i> Prescrições completas<br>
          <i class="ti ti-lock-open"></i> S.O.S. Clínico completo<br>
          <i class="ti ti-lock-open"></i> Pacientes especiais
        </div>
      </div>
      <p class="modal-sub" style="margin-bottom:20px;font-size:12px;">Após os 7 dias, você migra automaticamente para o plano gratuito. Para continuar com acesso completo, assine o Premium por R$9,90/mês.</p>
      <button class="btn-primary" onclick="this.closest('.overlay').remove();">
        <i class="ti ti-rocket"></i> Começar a usar
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}
