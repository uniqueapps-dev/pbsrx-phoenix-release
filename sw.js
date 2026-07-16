// PBSRx Phoenix v7.6.7-RC1b -- Service Worker
const CACHE = 'pbsrx-phoenix-rc1b-v1';
const BASE  = self.registration.scope;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled([BASE, BASE+'index.html', BASE+'manifest.json']
        .map(u => cache.add(u).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(BASE + 'index.html')
        .then(r => r || fetch(e.request).then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(BASE+'index.html', res.clone()));
          return res;
        })).catch(() => fetch(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && res.type !== 'opaque')
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    })).catch(() =>
      e.request.destination === 'document'
        ? caches.match(BASE + 'index.html')
        : undefined
    )
  );
});
