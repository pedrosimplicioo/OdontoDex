// ==================== PWA INSTALL ====================
let deferredPrompt = null;

function isIOS(){
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
}
function isIOSSafari(){
  return isIOS() && /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
}
function isInStandaloneMode(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function pwaAlreadyDismissed(){
  return localStorage.getItem('pwaDismissed') === '1';
}

function updateOfflineStatus(){
  const offline = !navigator.onLine;
  document.body?.classList.toggle('is-offline', offline);
  const banner = document.getElementById('offline-banner');
  if(banner) banner.classList.toggle('show', offline);
}

function hideIosInstallOverlay(){
  const overlay = document.getElementById('ios-install-overlay');
  if(!overlay) return;
  clearTimeout(overlay.__modalCloseTimer);
  if(!overlay.classList.contains('show')){
    overlay.classList.remove('modal-closing');
    return;
  }
  overlay.classList.add('modal-closing');
  overlay.__modalCloseTimer = setTimeout(() => {
    overlay.classList.remove('show','modal-closing');
  }, 260);
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
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.update?.();
    }).catch(()=>{});
  }

  updateOfflineStatus();
  window.addEventListener('online', updateOfflineStatus);
  window.addEventListener('offline', updateOfflineStatus);

  // iOS Safari: show install instructions only in Safari, when not standalone and not dismissed.
  if(isIOSSafari() && !isInStandaloneMode() && !pwaAlreadyDismissed()){
    setTimeout(()=>{
      const overlay = document.getElementById('ios-install-overlay');
      if(overlay){
        clearTimeout(overlay.__modalCloseTimer);
        overlay.classList.remove('modal-closing');
        overlay.classList.add('show');
      }
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
    hideIosInstallOverlay();
    localStorage.setItem('pwaDismissed','1');
  });
});
