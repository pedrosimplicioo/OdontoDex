// ==================== INICIALIZAÇÃO ====================
function isEmailVerificationReturnPath(){
  return location.pathname === "/email-verificado" || location.pathname.endsWith("/email-verificado");
}

function applyPremiumStateFromUserData(userData){
  if(userData && userData.premium === true) {
    if(userData.premiumExpira) {
      let expira;
      try {
        expira = userData.premiumExpira.toDate
          ? userData.premiumExpira.toDate()
          : new Date(userData.premiumExpira);
      } catch(e) {
        expira = new Date(userData.premiumExpira);
      }
      const agora = new Date();
      if(agora > expira) {
        window.userIsPremium = false;
        localStorage.setItem('userIsPremium', 'false');
        window._premiumExpirou = true;
      } else {
        window.userIsPremium = true;
        localStorage.setItem('userIsPremium', 'true');
      }
    } else {
      window.userIsPremium = true;
      localStorage.setItem('userIsPremium', 'true');
    }
  } else {
    window.userIsPremium = false;
    localStorage.setItem('userIsPremium', 'false');
  }
}

async function loadAuthenticatedUserAndShowApp(user, options = {}) {
  if(!user) {
    showLoginScreen();
    return;
  }

  currentUser = user;
  const em = document.getElementById("user-email-display");
  if(em) em.textContent = user.email;

  try { await user.reload(); } catch(e) { console.log(e); }

  if(!auth.currentUser?.emailVerified) {
    window.userIsPremium = false;
    localStorage.setItem('userIsPremium', 'false');
    showEmailVerificationScreen(auth.currentUser?.email || user.email);
    return;
  }

  try { await registrarAcessoUsuario(user.uid); } catch(e) { console.log(e); }
  try { await vincularSessionIdUsuario(user.uid); } catch(e) { console.log(e); }

  try {
    let doc = await db.collection("users").doc(user.uid).get();
    let userData = doc.exists ? (doc.data() || {}) : {};

    if(typeof isGoogleAuthUser === "function" && isGoogleAuthUser(user) && (!doc.exists || !userData.perfil)) {
      showGoogleProfileCompletion(user);
      return;
    }

    if(doc.exists && userData.nome) localStorage.setItem('guiaNome', userData.nome);
    if(doc.exists && userData.perfil) localStorage.setItem('guiaPerfil', userData.perfil);
    if(doc.exists && userData.tratamento !== undefined) localStorage.setItem('guiaTratamento', userData.tratamento);
    if(doc.exists && userData.perfil === 'estudante') localStorage.setItem('guiaTratamento', '');

    if(doc.exists && userData.trialAtivado !== true && options.skipTrialActivation !== true) {
      try {
        const result = await activateTrialAfterEmailVerified({showSuccess:isEmailVerificationReturnPath()});
        if(result.ok) {
          doc = await db.collection("users").doc(user.uid).get();
          userData = doc.exists ? (doc.data() || {}) : {};
        }
      } catch(e) {
        showToast("Não foi possível liberar o trial agora. Tente novamente.", "error");
      }
    }

    applyPremiumStateFromUserData(userData);

    if(doc.exists && doc.data().mensagemPendente === 'trial_manual') {
      try {
        await db.collection('users').doc(user.uid).update({ mensagemPendente: firebase.firestore.FieldValue.delete() });
      } catch(e) { console.log('mensagemPendente skip', e); }
      window._mensagemPendente = 'trial_manual';
    }
  } catch(e) {
    console.log(e);
    const ultimoEstado = localStorage.getItem('userIsPremium');
    window.userIsPremium = ultimoEstado === 'true';
    if(!navigator.onLine) {
      showToast("Você está offline. Usando dados do último acesso.", "success");
    }
  }

  updatePremiumUI();
  showAppScreen();
}

document.addEventListener("DOMContentLoaded", () => {
  // Evento Meta Pixel: PageView do app ao carregar.
  if (typeof trackMetaPageViewOnce === "function") trackMetaPageViewOnce("app");
  initData();
  initDarkMode();

  auth.onAuthStateChanged(async(user) => {
    const il = document.getElementById('initial-loading');
    if(il) il.style.display = 'none';

    if(user) {
      await loadAuthenticatedUserAndShowApp(user);
      return;
    }

    if(isEmailVerificationReturnPath()) {
      showLoginScreen();
      const err = document.getElementById("login-error");
      if(err) {
        err.textContent = "Email verificado. Entre na sua conta para liberar o Premium.";
        err.style.display = "block";
      }
      return;
    }

    if(!navigator.onLine && localStorage.getItem('userIsPremium') !== null) {
      window.userIsPremium = localStorage.getItem('userIsPremium') === 'true';
      showAppScreen();
    } else {
      showLoginScreen();
    }
  });
});
// ============================================================
