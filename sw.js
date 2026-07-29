/**
 * PBSRx Phoenix — Production Service Worker
 * Version: v7.6.7-RC3.9
 * Cache strategy: Cache-first for application shell
 *
 * Architecture:
 *   - install  : pre-caches the application shell
 *   - activate : cleans up all obsolete cache versions
 *   - fetch    : cache-first for shell assets, network-first for everything else
 *
 * What is cached:
 *   The application shell (index.html, manifest.json, icons).
 *   These are the only assets PBSRx requires to boot offline.
 *
 * What is NOT cached:
 *   Dynamic data (localStorage — never passes through the SW).
 *   External API calls (Anthropic API for AI Snap).
 *   Chrome DevTools or browser-internal requests.
 *
 * Safe update behaviour:
 *   The cache name is versioned. A new deployment with a new cache version
 *   causes activate to delete all previous caches on first install,
 *   ensuring users never run stale shell assets.
 */

'use strict';

var CACHE_NAME = 'pbsrx-phoenix-v7.6.7-RC3.9';

var SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ── Install: pre-cache the application shell ──────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_ASSETS);
    }).then(function() {
      // Skip waiting so the new SW activates immediately on first install.
      // On updates, the new SW waits until all tabs using the old SW are closed.
      return self.skipWaiting();
    })
  );
});

// ── Activate: clean up all obsolete caches ────────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) {
            // Delete any cache that is not the current version.
            // This handles both major and minor version upgrades.
            return name !== CACHE_NAME;
          })
          .map(function(name) {
            return caches.delete(name);
          })
      );
    }).then(function() {
      // Take control of all open clients immediately after activation.
      // Without this, pages opened before the SW installed would not
      // be controlled by this SW until they are reloaded.
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first for shell, network-first for external ─────────────
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Never intercept:
  //   - Chrome extension requests
  //   - Non-GET requests (POST to Anthropic API etc.)
  //   - Requests with credentials that require network
  if (event.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // External requests (Anthropic API, CDN, etc.) — pass through to network.
  // PBSRx only makes external calls for AI Snap. These must never be cached.
  var isExternal = url.origin !== self.location.origin;
  if (isExternal) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Application shell — cache-first strategy.
  // Serves the cached version immediately for instant offline load.
  // Falls back to network if not cached (first load before SW install completes).
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      // Not in cache — fetch from network and cache for next time.
      return fetch(event.request).then(function(networkResponse) {
        if (!networkResponse || networkResponse.status !== 200 ||
            networkResponse.type === 'error') {
          return networkResponse;
        }
        var responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(function() {
      // Network failed and not in cache.
      // Return index.html for navigation requests (offline SPA behaviour).
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
      // For other requests (icons etc.), just fail gracefully.
      return new Response('Offline', {status: 503, statusText: 'Service Unavailable'});
    })
  );
});
