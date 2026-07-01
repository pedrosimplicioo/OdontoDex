const CACHE_NAME = 'odontodex-v86-auto-payment-restore';

const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/src/styles/app.css',
  '/src/data/clinical-data.js',
  '/src/data/search-intents.js',
  '/src/scripts/browser-warning.js',
  '/src/scripts/firebase-init.js',
  '/src/scripts/meta-pixel.js',
  '/src/scripts/analytics.js',
  '/src/scripts/app-init.js',
  '/src/scripts/auth.js',
  '/src/scripts/clinical-intent-engine.js',
  '/src/scripts/navigation.js',
  '/src/scripts/payments.js',
  '/src/scripts/premium.js',
  '/src/scripts/pwa.js',
  '/src/scripts/search.js',
  '/src/scripts/usage-analytics.js',
  '/src/components/crisis.js',
  '/src/components/prescriptions.js',
  '/src/components/protocols.js',
  '/src/components/pulpite.js',
  '/src/components/render.js',
  '/src/components/student-banner.js',
  '/src/components/widgets.js',
  '/src/utils/dom.js',
  '/src/utils/storage.js'
];

const OPTIONAL_EXTERNAL_FILES = [
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js',
  'https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.31.0/dist/tabler-icons.min.css'
];

// Cacheia a casca principal e os arquivos locais necessários para consulta offline.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES).then(() =>
        Promise.allSettled(OPTIONAL_EXTERNAL_FILES.map(url => cache.add(url)))
      );
    })
  );
  self.skipWaiting();
});

// Limpa caches antigos.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

function shouldBypassCache(request) {
  const url = new URL(request.url);
  return (
    request.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('mercadopago')
  );
}

function shouldStoreResponse(response) {
  return response && response.ok && (response.type === 'basic' || response.type === 'cors');
}

// Rede primeiro; cache apenas para assets/navegacao seguros.
self.addEventListener('fetch', event => {
  if (shouldBypassCache(event.request)) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (shouldStoreResponse(response)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (shouldStoreResponse(response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
