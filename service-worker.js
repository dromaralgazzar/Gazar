const CACHE_NAME = 'gazzar-dental-pwa-v3';
const OFFLINE_FALLBACK_URL = '/index.html';

const PRECACHE_ASSETS = [
  '/manifest.json',
  '/pwa-install.js',
  '/calendar-reminder.js',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)).catch(() => undefined)
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function isHTMLNavigation(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.ok) {
      cache.put(request, response.clone());
      if (isHTMLNavigation(request)) cache.put(OFFLINE_FALLBACK_URL, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (isHTMLNavigation(request)) {
      const fallback = await cache.match(OFFLINE_FALLBACK_URL);
      if (fallback) return fallback;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => undefined);
  return cached || fetchPromise;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isHTMLNavigation(request)) {
    event.respondWith(networkFirst(request));
    return;
  }

  const pathname = url.pathname;
  if (pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
