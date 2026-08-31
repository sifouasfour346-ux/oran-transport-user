// Minimal service worker — just enough to make the app installable (PWA/TWA
// requirements) and cache the app shell so it opens instantly next time.
const CACHE_NAME = 'oran-transport-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything (so live Firestore data / map tiles always stay fresh),
  // falling back to cache only if the network is unavailable.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
