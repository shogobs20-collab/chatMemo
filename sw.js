// 下書きアプリ サービスワーカー
// キャッシュを更新したい時は下の "v1" の数字を上げる
const CACHE = "shitagaki-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

// インストール時：必要ファイルを先読みキャッシュ
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// 有効化時：古いバージョンのキャッシュを掃除
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 取得時：キャッシュ優先、無ければネット。ネットも駄目ならindexを返す
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request).catch(() => caches.match("./index.html"))
    )
  );
});
