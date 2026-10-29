// ══ Pit House — Service Worker ══
const CACHE_NAME = 'pit-house-v3';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/hero.jpg',
  '/apple-touch-icon.png',
  '/favicon-16.png',
  '/favicon-32.png',
  '/favicon-192-maskable.png',
  '/favicon-512-maskable.png'
];

// Install: pre-cache core shell files. Cache each one individually instead of
// cache.addAll(), which rejects the ENTIRE install if even one URL 404s.
// That was the actual bug: /favicon-192.png and /favicon-512.png didn't
// exist on the server, so addAll() failed on every single install attempt —
// the SW never activated, and the browser kept retrying that failing install
// on every page load, which is what produced the repeated crash.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => console.warn('Precache skipped:', url, err))
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for navigation/HTML, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (Firebase, WhatsApp, CDNs, etc.) — let them hit the network normally
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Network-first for page navigations, fallback to cached shell if offline
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Cache-first for static assets (icons, manifest, etc.)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
