self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  // This empty fetch handler is required by Chrome to allow PWA installation
});
