// Service worker do VYRA 1.3.
// Guarda o app no aparelho para abrir sem internet. Ao publicar uma versão nova,
// troque o número em CACHE (vyra-v1.2, vyra-v1.3...) para os aparelhos atualizarem.
const CACHE = 'vyra-v1.3';
const SHELL = ['./', 'index.html', 'manifest.json', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(SHELL.map((u) => cache.add(new Request(u, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Responde do cache e atualiza em segundo plano. Inclui as fontes do Google depois da primeira visita.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const ok = url.origin === location.origin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!ok) return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request, { ignoreSearch: true }).then((hit) => {
        const net = fetch(e.request)
          .then((res) => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(e.request, res.clone());
            return res;
          })
          .catch(() => hit || (e.request.mode === 'navigate' ? cache.match('index.html') : Response.error()));
        return hit || net;
      })
    )
  );
});
