// ==================== PWA INSTALL ====================
let deferredPrompt = null;

function isIOS(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}
function isInStandaloneMode(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function pwaAlreadyDismissed(){
  return localStorage.getItem('pwaDismissed') === '1';
}

function showPwaBanner(){
  if(isInStandaloneMode() || pwaAlreadyDismissed()) return;
  const banner = document.getElementById('pwa-banner');
  if(banner) setTimeout(()=>banner.classList.add('show'), 1200);
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  showPwaBanner();
});

window.addEventListener('appinstalled', () => {
  const banner = document.getElementById('pwa-banner');
  if(banner) banner.classList.remove('show');
  deferredPrompt = null;
});

document.addEventListener('DOMContentLoaded', () => {
  // Register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

  // iOS: show modal automatically if not standalone and not dismissed
  if(isIOS() && !isInStandaloneMode() && !pwaAlreadyDismissed()){
    setTimeout(()=>{
      document.getElementById('ios-install-overlay').classList.add('show');
    }, 1500);
  }

  // Install button (Android/Chrome)
  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    const {outcome} = await deferredPrompt.userChoice;
    if(outcome === 'accepted'){
      document.getElementById('pwa-banner').classList.remove('show');
    }
    deferredPrompt = null;
  });

  // Dismiss banner
  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('pwa-banner').classList.remove('show');
    localStorage.setItem('pwaDismissed','1');
  });

  // Close iOS modal
  document.getElementById('ios-close-btn')?.addEventListener('click', () => {
    document.getElementById('ios-install-overlay').classList.remove('show');
    localStorage.setItem('pwaDismissed','1');
  });
});
