const CACHE_NAME = 'v1.00';
const ASSETS = [
   '/',
  '/index.html',
   '/richi_styles.css',
   '/Rave/CSS/KeyzaRichi-rave_core.css',
   '/script.js'
 ];

 self.addEventListener('install', (event) => {
   event.waitUntil(
     caches.open(CACHE_NAME)
       .then((cache) => cache.addAll(ASSETS))
       .then(() => self.skipWaiting()) // Force activation immediately
   );
 });

 self.addEventListener('activate', (event) => {
   event.waitUntil(
     caches.keys().then((keys) => {
       return Promise.all(
         keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
       );
     })
   );
 });

 self.addEventListener('fetch', (event) => {
   event.respondWith(
     caches.match(event.request).then((response) => {
    // return cached asset if found, otherwise fetch from network
       return response || fetch(event.request);
     })
   );
 });
