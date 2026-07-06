/// <reference lib="WebWorker" />

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { StaleWhileRevalidate } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();

/*
 * This line is the magic.
 * Vite replaces __WB_MANIFEST with every hashed asset
 * (including React Router lazy chunks).
 */
precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
  ({ url }) => url.pathname.startsWith("/api"),
  new NetworkFirst({
    cacheName: "api-cache",
    networkTimeoutSeconds: 5
  })
);

registerRoute(
  ({ request }) => request.destination === "font",
  new CacheFirst({
    cacheName: "fonts"
  })
);


// Cache CSS/JS/images
registerRoute(
  ({ request }) => ["style", "script", "image"].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: "assets-cache"
  })
);