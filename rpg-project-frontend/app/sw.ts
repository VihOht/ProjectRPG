/// <reference lib="WebWorker" />

import { clientsClaim } from "workbox-core";

declare let self: ServiceWorkerGlobalScope;

const LEGACY_CACHE_NAMES = new Set([
  "api",
  "api-cache",
  "assets-cache",
  "fonts",
  "scripts",
  "styles",
]);

self.skipWaiting();
clientsClaim();

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              LEGACY_CACHE_NAMES.has(cacheName) ||
              cacheName.startsWith("workbox-precache"),
          )
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
});
