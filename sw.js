// Service worker for the Workout Tracker wrapper.
// It keeps a copy of the wrapper's own files so the app can open quickly, and
// always tries the internet first so edits you make on GitHub show up.
// (The workout screen itself comes straight from Google, not through here.)

var CACHE = "wt-wrapper-v1";
var FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (n) { return n !== CACHE; })
                              .map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") { return; }
  event.respondWith(
    fetch(event.request).catch(function () { return caches.match(event.request); })
  );
});
