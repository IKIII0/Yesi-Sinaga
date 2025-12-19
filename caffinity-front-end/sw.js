// public/sw.js - Service Worker minimal
const CACHE_NAME = 'caffinity-v1';

// Cache untuk halaman penting
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve dari cache jika ada
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response jika ada, atau fetch dari network
        return response || fetch(event.request);
      })
  );
});

// Aktifkan service worker
self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});