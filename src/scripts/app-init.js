// ==================== INICIALIZAÇÃO ====================
document.addEventListener("DOMContentLoaded", () => {
  initData();
  initDarkMode();
auth.onAuthStateChanged(async(user) => {
    const il = document.getElementById('initial-loading');
  if(il) il.style.display = 'none';
  if(user) {
    currentUser = user;
    const em = document.getElementById("user-email-display");
    if(em) em.textContent = user.email;
    
    try { await registrarAcessoUsuario(user.uid); } catch(e) { console.log(e); }
    try { await vincularSessionIdUsuario(user.uid); } catch(e) { console.log(e); }
    
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      const userData = doc.data();
      // Sincroniza nome do Firestore para o localStorage
      if(doc.exists && userData.nome) localStorage.setItem('guiaNome', userData.nome);
      if(doc.exists && userData.perfil) localStorage.setItem('guiaPerfil', userData.perfil);
      if(doc.exists && userData.tratamento !== undefined) localStorage.setItem('guiaTratamento', userData.tratamento);
      // Se usuário sem trial, dar 7 dias automaticamente
      if(doc.exists && !userData.trialAtivado) {
        const premiumExpira = new Date();
        premiumExpira.setDate(premiumExpira.getDate() + 7);
        await db.collection('users').doc(user.uid).update({
          premium: true,
          premiumExpira: firebase.firestore.Timestamp.fromDate(premiumExpira),
          trialAtivado: true
        });
        window.userIsPremium = true;
        localStorage.setItem('userIsPremium', 'true');
        window._trialRecemAtivado = true;
      } else {
        // Usuário já tem trial — verifica se premium ainda é válido
        if(doc.exists && userData.premium === true) {
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
              // Atualiza o Firestore via backend
              fetch('/api/expire-premium', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid: user.uid }),
              }).catch(e => console.log(e));
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
      // Checar mensagem pendente
      if(doc.exists && doc.data().mensagemPendente === 'trial_manual') {
  try {
    await db.collection('users').doc(user.uid).update({ mensagemPendente: firebase.firestore.FieldValue.delete() });
  } catch(e) { console.log('mensagemPendente skip', e); }
  window._mensagemPendente = 'trial_manual';
}
    } catch(e) {
      console.log(e);
      // Sem internet ou Firestore fora — usa último estado conhecido
      const ultimoEstado = localStorage.getItem('userIsPremium');
      window.userIsPremium = ultimoEstado === 'true';
      if(!navigator.onLine) {
        showToast("Você está offline. Usando dados do último acesso.", "success");
      }
    }
    updatePremiumUI();
    showAppScreen();
  } else {
    if(!navigator.onLine && localStorage.getItem('userIsPremium') !== null) {
      window.userIsPremium = localStorage.getItem('userIsPremium') === 'true';
      
      showAppScreen();
    } else {
      showLoginScreen();
    }
  }
});
});
// ============================================================
