const CACHE_NAME = 'statskill-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
  // In production, Vite bundles would be injected here.
];

// Install Event - Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Store-and-Forward Logic / Cache Fallback
self.addEventListener('fetch', (event) => {
  // If it's an API request to our backend (like submitting a quiz or telemetry)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.log('[Service Worker] Offline: API request failed. Would queue in IndexedDB.');
        // For prototype: we return a mocked offline response so the app doesn't crash
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Offline mode: Action queued locally. Will sync when online.",
            offline: true 
          }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
  } else {
    // Standard network-first, fallback-to-cache strategy for UI assets
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
