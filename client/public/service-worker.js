const CACHE_NAME = "weather-cache-v1";

const FILES_TO_CACHE = ["/offline.html"];

window.self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");

  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  window.self.skipWaiting();
});

window.self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");

  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  window.self.clients.claim();
});

window.self.addEventListener("fetch", evt => {
  console.log("[ServiceWorker] Fetch", evt.request.url);

  if (evt.request.mode !== "navigate") {
    // Not a page navigation, bail.
    return;
  }
  evt.respondWith(
    fetch(evt.request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return cache.match("offline.html");
    })
  );
});
