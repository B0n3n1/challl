const CACHE="pushups-v3";

const ASSETS=[
  "./",
  "./index.html",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS))
  );
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys
          .filter(k=>k!==CACHE)
          .map(k=>caches.delete(k))
      )
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  if(e.request.url.includes("firebasejs.com")) return;

  e.respondWith(
    caches.match(e.request)
      .then(c=>c||fetch(e.request)
        .then(r=>{
          const x=r.clone();
          caches.open(CACHE).then(k=>k.put(e.request,x));
          return r;
        })
        .catch(()=>c)
      )
  );
});
