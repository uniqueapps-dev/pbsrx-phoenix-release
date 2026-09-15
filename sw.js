'use strict';
var CACHE_NAME = 'pbsrx-phoenix-v7.6.7-RC3.9.4';
var SHELL_ASSETS = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_ASSETS);
    }).then(function() { return self.skipWaiting(); })
  );
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  var isExternal = url.origin !== self.location.origin;
  if (isExternal) { event.respondWith(fetch(event.request)); return; }
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') return networkResponse;
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, responseToCache); });
        return networkResponse;
      });
    }).catch(function() {
      if (event.request.mode === 'navigate') return caches.match('./index.html');
      return new Response('Offline', {status: 503, statusText: 'Service Unavailable'});
    })
  );
});
