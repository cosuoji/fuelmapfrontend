if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise(s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()}).then(()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e}));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>i(e,t),l={module:{uri:t},exports:o,require:c};s[t]=Promise.all(n.map(e=>l[e]||c(e))).then(e=>(r(...e),o))}}define(["./workbox-74f2ef77"],function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BIEWKMDg.js",revision:null},{url:"assets/index-BSOFJADU.css",revision:null},{url:"index.html",revision:"586043f49b2daf2ff38449293381e602"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/icon-192.png",revision:"cb767709367139fdb03faeb7226b2cb5"},{url:"icons/icon-512.png",revision:"cb767709367139fdb03faeb7226b2cb5"},{url:"manifest.webmanifest",revision:"2de75e98cea882dc966531c7a0fafa10"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(({request:e})=>"document"===e.destination||"script"===e.destination||"style"===e.destination||"image"===e.destination,new e.CacheFirst({cacheName:"fuelwatch-assets",plugins:[new e.ExpirationPlugin({maxEntries:60,maxAgeSeconds:2592e3})]}),"GET")});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match("/offline.html");
      }
    })
  );
});
