const CACHE_NAME = 'odontodex-v1';

const ARQUIVOS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

// Instala e faz cache dos arquivos principais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARQUIVOS);
    })
  );
  self.skipWaiting();
});

// Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estratégia: tenta rede primeiro, cai para cache se offline
self.addEventListener('fetch', event => {
  // Ignora requisições do Firebase e Mercado Pago (precisam de internet)
  if (
    event.request.url.includes('firebaseio.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('mercadopago') ||
    event.request.url.includes('gstatic.com')
  ) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
