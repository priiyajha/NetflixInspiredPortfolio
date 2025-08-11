// Service Worker for Performance Optimization
const CACHE_NAME = 'farooq-portfolio-v1';
const CRITICAL_ASSETS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/attached_assets/farooq-logo.png',
  '/attached_assets/farooq-headshot.png',
  '/api/profile',
  '/api/projects/featured'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Skip caching for API requests (except critical ones)
  if (event.request.url.includes('/api/') && 
      !CRITICAL_ASSETS.some(asset => event.request.url.includes(asset))) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then((fetchResponse) => {
        // Don't cache non-successful responses
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse;
        }

        // Clone the response as it can only be read once
        const responseToCache = fetchResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Only cache critical assets and images
          if (CRITICAL_ASSETS.includes(event.request.url) || 
              event.request.url.includes('/attached_assets/')) {
            cache.put(event.request, responseToCache);
          }
        });

        return fetchResponse;
      });
    })
  );
});