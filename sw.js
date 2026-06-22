const CACHE_NAME = 'odontodex-v68-home-trending-searches';

const ARQUIVOS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Cacheia apenas a casca principal do app.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARQUIVOS);
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
    url.hostname.includes('mercadopago') ||
    url.hostname.includes('gstatic.com')
  );
}

function shouldStoreResponse(response) {
  return response && response.ok && (response.type === 'basic' || response.type === 'cors');
}

// Rede primeiro; cache apenas para assets/navegacao seguros.
self.addEventListener('fetch', event => {
  if (shouldBypassCache(event.request)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (shouldStoreResponse(response)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
