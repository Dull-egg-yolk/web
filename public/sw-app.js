self.addEventListener('install', (e) => {
  e.waitUntil(caches.open('gomeet').then((cache) => cache.addAll([])),
  );
});

self.addEventListener('fetch', (e) => {});
