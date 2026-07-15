const CACHE_NAME = 'odontodex-v87-instant-launch';

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

// Cacheia a casca principal e os arquivos locais necessários para consulta offline.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // A tela inicial precisa existir para o app poder abrir instantaneamente.
      await cache.add('/index.html');
      await Promise.allSettled(
        CORE_FILES.filter(url => url !== '/index.html').map(url => cache.add(url))
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

async function updateCache(request, cacheKey = request) {
  const response = await fetch(request);
  if (shouldStoreResponse(response)) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(cacheKey, response.clone());
  }
  return response;
}

async function cachedFirst(request, fallbackKey) {
  const cached = await caches.match(request) ||
    await caches.match(request, { ignoreSearch: true }) ||
    (fallbackKey ? await caches.match(fallbackKey) : null);
  return cached || updateCache(request, fallbackKey || request);
}

function isStaticAsset(request) {
  return ['style', 'script', 'image', 'font', 'manifest'].includes(request.destination);
}

// Abertura local primeiro; a versao mais nova e buscada silenciosamente depois.
self.addEventListener('fetch', event => {
  if (shouldBypassCache(event.request)) return;

  if (event.request.mode === 'navigate') {
    const refresh = updateCache(event.request, '/index.html').catch(() => null);
    event.waitUntil(refresh);
    event.respondWith(
      cachedFirst('/index.html')
    );
    return;
  }

  if (isStaticAsset(event.request)) {
    const refresh = updateCache(event.request).catch(() => null);
    event.waitUntil(refresh);
    event.respondWith(cachedFirst(event.request));
    return;
  }

  event.respondWith(updateCache(event.request).catch(() => caches.match(event.request, { ignoreSearch: true })));
});
