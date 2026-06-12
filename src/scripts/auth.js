// ==================== LOGIN ====================
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
      });
    });
}
function showLogin(){
  document.getElementById("login-form").style.display="block";
  document.getElementById("register-form").style.display="none";
  document.getElementById("reset-form").style.display="none";
}
function showRegister(){
  document.getElementById("login-form").style.display="none";
  document.getElementById("register-form").style.display="block";
  document.getElementById("reset-form").style.display="none";
}
function showReset(){
  document.getElementById("login-form").style.display="none";
  document.getElementById("register-form").style.display="none";
  document.getElementById("reset-form").style.display="block";
}
async function doLoginGoogle(){
  const provider = new firebase.auth.GoogleAuthProvider();
  const err=document.getElementById("login-error");
  if(location.protocol==="file:"){
    const msg="Para entrar com Google, abra o OdontoDex pelo domínio publicado ou por localhost.";
    if(err){err.textContent=msg;err.style.display="block";}
    showToast(msg, "error");
    console.warn("Google login bloqueado em file://. Use https://www.odontodex.com.br ou localhost autorizado no Firebase.");
    return;
  }
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
      document.getElementById('gw-btn-dentista').className = 'select-btn';
      document.getElementById('gw-btn-estudante').className = 'select-btn';
      document.getElementById('gw-bloco-trat').style.display = 'none';
      gwValidarBotao();
      document.getElementById('google-welcome-overlay').style.display = 'flex';
    } else {
      showAppScreen();
    }
  } catch(e) {
    hideLoading();
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
}
async function doLogin(){
  const email=document.getElementById("login-email")?.value?.trim();
  const pwd=document.getElementById("login-password")?.value;
  const err=document.getElementById("login-error");
  if(!email||!pwd){if(err){err.textContent="Preencha todos os campos";err.style.display="block";}return;}
  showLoading();
  try{
    const res=await auth.signInWithEmailAndPassword(email,pwd);
    currentUser=res.user;
    const em=document.getElementById("user-email-display");if(em)em.textContent=currentUser.email;
    const periodoEl=document.getElementById("hdr-periodo");
    if(periodoEl)periodoEl.textContent="Disponivel agora";
    atualizarSaudacao();
    hideLoading();
    showToast("Login realizado!","success");
    showAppScreen();
  }catch(e){
    hideLoading();
    if(err){
      const msgs={"auth/user-not-found":"Usuário não encontrado","auth/wrong-password":"Senha incorreta","auth/invalid-email":"Email inválido","auth/too-many-requests":"Muitas tentativas. Aguarde um momento."};
      err.textContent=msgs[e.code]||"Erro ao entrar. Verifique suas credenciais.";
      err.style.display="block";
    }
  }
}

// Variáveis de seleção do cadastro
let selectedTratamento = '';
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
  const tudo = nome.length > 0 && perfilOk && (gwPerfil === 'estudante' || gwTratSelecionado);
  const btn = document.getElementById('gw-btn-confirmar');
  btn.disabled = !tudo;
  btn.style.background = tudo ? '#7C3FA0' : '#cbd5e1';
  btn.style.cursor = tudo ? 'pointer' : 'not-allowed';
}

async function gwConfirmar() {
  const nome = document.getElementById('gw-nome').value.trim();
  if(!nome || !gwPerfil) return;
  const primeiroNome = nome.split(' ').map(function(p){return p.charAt(0).toUpperCase()+p.slice(1).toLowerCase();}).join(' ');
  const displayName = gwPerfil === 'estudante' ? primeiroNome : (gwTrat ? gwTrat + ' ' + primeiroNome : primeiroNome);
  showLoading();
  try {
    await currentUser.updateProfile({ displayName: displayName });
    const premiumExpira = new Date();
    premiumExpira.setDate(premiumExpira.getDate() + 7);
    await db.collection('users').doc(currentUser.uid).set({
      nome: primeiroNome,
      perfil: gwPerfil,
      tratamento: gwTrat,
      email: currentUser.email,
      criadoEm: new Date().toISOString(),
      dataPrimeiroAcesso: firebase.firestore.FieldValue.serverTimestamp(),
      acessosPorDia: {},
      premium: true,
      premiumExpira: firebase.firestore.Timestamp.fromDate(premiumExpira),
      premiumOrigem: 'trial',
      trialAtivado: true
    });
    window.userIsPremium = true;
    localStorage.setItem('userIsPremium', 'true');
    window._trialRecemAtivado = true;
    localStorage.setItem("showTrialWelcomeOnce", "1");
    localStorage.setItem('guiaNome', primeiroNome);
    localStorage.setItem('guiaPerfil', gwPerfil);
    localStorage.setItem('guiaTratamento', gwTrat);
    if (gwPerfil === 'estudante') {
      localStorage.setItem('guiaTratamento', '');
      localStorage.removeItem('studentBannerLastDate');
      localStorage.removeItem('studentBannerDismissed');
    }
  } catch(e) { console.log(e); }
  hideLoading();
  document.getElementById('google-welcome-overlay').style.display = 'none';
  showAppScreen();
}
function selectTratamento(t){
  selectedTratamento=t;
  document.getElementById('btn-dr').className='select-btn'+(t==='Dr.'?' selected':'');
  document.getElementById('btn-dra').className='select-btn'+(t==='Dra.'?' selected':'');
  document.getElementById('btn-semtitulo').className='select-btn'+(t===''?' selected':'');
}
function selectPerfil(p){
  selectedPerfil=p;
  document.getElementById('btn-dentista').className='select-btn'+(p==='dentista'?' selected':'');
  document.getElementById('btn-estudante').className='select-btn'+(p==='estudante'?' selected':'');
  document.getElementById('bloco-tratamento').style.display=p==='dentista'?'block':'none';
  if(p==='estudante') selectedTratamento='';
}

async function doRegister(){
  const name=document.getElementById("register-name")?.value?.trim();
  const email=document.getElementById("register-email")?.value?.trim();
  const pwd=document.getElementById("register-password")?.value;
  const err=document.getElementById("register-error");
  if(!name||!email||!pwd){if(err){err.textContent="Preencha todos os campos";err.style.display="block";}return;}
  if(pwd.length<6){if(err){err.textContent="Mínimo 6 caracteres";err.style.display="block";}return;}
  showLoading();
  try{
    const res=await auth.createUserWithEmailAndPassword(email,pwd);
    // Salva nome com tratamento no displayName
    const primeiroNome=name.split(' ')[0];
    const displayName=(selectedPerfil==='estudante')?primeiroNome:selectedTratamento+' '+primeiroNome;
    await res.user.updateProfile({displayName});
    // Salva perfil no Firestore
    try{
      const premiumExpira = new Date();
      premiumExpira.setDate(premiumExpira.getDate() + 7);

      await db.collection('users').doc(res.user.uid).set({
        nome:name,
        tratamento:selectedTratamento,
        perfil:selectedPerfil,
        email:email,
        criadoEm:new Date().toISOString(),
        dataPrimeiroAcesso: firebase.firestore.FieldValue.serverTimestamp(),
        acessosPorDia: {},
        premium: true,
        premiumExpira: firebase.firestore.Timestamp.fromDate(premiumExpira),
        premiumOrigem: 'trial',
        trialAtivado: true
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
    hideLoading();
showToast('Conta criada com sucesso!','success');
    window.userIsPremium = true;                       
localStorage.setItem('userIsPremium', 'true');       
window._trialRecemAtivado = true;
localStorage.setItem("showTrialWelcomeOnce", "1");
showAppScreen();
  }catch(e){
    hideLoading();
    if(err){
      const msgs={"auth/email-already-in-use":"Este email já está cadastrado","auth/invalid-email":"Email inválido","auth/weak-password":"Senha muito fraca"};
      err.textContent=msgs[e.code]||"Erro ao criar conta. Tente novamente.";
      err.style.display="block";
    }
  }
}

async function doReset(){
  const email=document.getElementById("reset-email")?.value?.trim();
  const err=document.getElementById("reset-error");
  const suc=document.getElementById("reset-success");
  if(!email){if(err){err.textContent="Digite seu email";err.style.display="block";}return;}
  try{
    await auth.sendPasswordResetEmail(email);
    if(suc){suc.textContent="Email de recuperação enviado!";suc.style.display="block";}
    if(err)err.style.display="none";
  }catch(e){
    if(err){err.textContent="Erro ao enviar email. Verifique o endereço.";err.style.display="block";}
  }
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
