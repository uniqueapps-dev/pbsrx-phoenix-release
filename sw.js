// PBSRx Phoenix v7.6.7-RC1 — Service Worker (FIXED)
// FIX: All asset paths changed from absolute ('/index.html') to relative ('./index.html')
// FIX: Navigation fallback uses SW-scope-relative path
// FIX: Cache name versioned for clean updates

const CACHE = 'pbsrx-phoenix-rc1-v2';

// FIX: Derive base path from SW location — works on any subpath including GitHub Pages
// e.g. '/repo-name/' when deployed at https://user.github.io/repo-name/
const BASE = self.registration.scope;

// Assets to precache — relative URLs resolved against SW scope
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        // Cache each asset individually so a single failure doesn't abort all caching
        return Promise.allSettled(
          ASSETS.map(url => cache.add(url).catch(err => {
            console.warn('SW: could not cache', url, err);
          }))
        );
      })
      .then(() => self.skipWaiting())   // Activate immediately — don't wait for old SW to die
  );
});

self.addEventListener('activate', e => {
  // Remove old cache versions
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())  // Take control of all open tabs immediately
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // FIX: For navigation requests (page loads), always serve index.html from cache
  // This is the critical fix for "Open does nothing" — the PWA launch is a navigation request
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match(BASE + 'index.html')
        .then(cached => {
          if (cached) return cached;
          // Not in cache yet — fetch and cache for next time
          return fetch(e.request).then(res => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(CACHE).then(c => c.put(BASE + 'index.html', clone));
            }
            return res;
          });
        })
        .catch(() => fetch(e.request))
    );
    return;
  }

  // For all other GET requests: cache-first, network fallback
  e.respondWith(
    caches.match(e.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok && res.type !== 'opaque') {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        });
      })
      .catch(() => {
        // Final fallback for navigation: serve the app shell
        if (e.request.destination === 'document') {
          return caches.match(BASE + 'index.html');
        }
      })
  );
});
