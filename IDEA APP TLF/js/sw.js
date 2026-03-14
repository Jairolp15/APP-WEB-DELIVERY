// ═══════════════════════════════════════════
//  QuickBite Service Worker – Offline Support
// ═══════════════════════════════════════════
const CACHE = 'quickbite-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/styles.css',
    '/css/improvements.css',
    '/js/data.js',
    '/js/app.js',
    '/js/improvements.js',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).catch(() => { })
    );
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(cached => {
            const fresh = fetch(e.request).then(res => {
                if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
                return res;
            }).catch(() => cached);
            return cached || fresh;
        })
    );
});

self.addEventListener('push', e => {
    const data = e.data?.json() || { title: 'QuickBite', body: '¡Tu pedido está en camino!' };
    e.waitUntil(self.registration.showNotification(data.title, {
        body: data.body, icon: '/assets/icon-192.png', badge: '/assets/icon-192.png',
        vibrate: [200, 100, 200], data: { url: '/' }, actions: [{ action: 'track', title: '📍 Rastrear' }]
    }));
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.openWindow(e.notification.data?.url || '/'));
});
