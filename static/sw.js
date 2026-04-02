// Service Worker - 背景图片本地缓存
const CACHE_NAME = 'tiedstory-bg-v1';
const BG_IMAGE_PATTERN = /\/static\/images\/.+\.(png|jpg|jpeg|webp|gif)$/i;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (!BG_IMAGE_PATTERN.test(url.pathname)) return;

    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            const cached = await cache.match(event.request);
            if (cached) return cached;

            const resp = await fetch(event.request);
            if (resp.ok) cache.put(event.request, resp.clone());
            return resp;
        })
    );
});
