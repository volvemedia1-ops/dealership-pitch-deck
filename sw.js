const CACHE_NAME = 'cbf-pitch-deck-v4.1-1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './slides_img/slide_1.png',
  './slides_img/slide_2.png',
  './slides_img/slide_3.png',
  './slides_img/slide_4.png',
  './slides_img/slide_5.png',
  './slides_img/slide_11.png',
  './slides_img/slide_12.png',
  './slides_img/slide_13.png',
  './slides_img/slide_15.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
