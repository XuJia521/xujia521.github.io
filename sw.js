// Service Worker - 离线缓存
const CACHE_NAME = 'xujia-legal-tools-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

// 安装：预缓存主页资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// 请求拦截：缓存优先，网络兜底
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 只处理 GET 请求
  if (req.method !== 'GET') return;

  // 只缓存同源资源（跳转到 /case-manager/ 等子站时走网络）
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 主页及其资源走缓存
  if (url.pathname === '/' || url.pathname === '/index.html' ||
      ASSETS.some(a => url.pathname.endsWith(a.replace('./', '/')))) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((resp) => {
          // 请求成功时顺便更新缓存
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return resp;
        }).catch(() => cached); // 网络失败返回缓存
      })
    );
  }
});
