const cacheName = "v1";

const cachedAssets = [
    "./",
    "./index.html",
    "./html/cart.html",
    "./html/checkout.html",
    "./html/courses.html",
    "./html/detail.html",
    "./html/mycourses.html",
    "./html/state.html",
    "./css/styles.css",
    "./js/cart.js",
    "./js/checkout.js",
    "./js/courses.js",
    "./js/detail.js",
    "./js/index.js",
    "./js/mycourses.js",
    "./js/state.js",
    "./json/courses.json",
    "./manifest.json",
    "./assets/jpg/banner-1.jpg",
    "./assets/png/about-us.png",
    "./assets/png/banner-2.png",
    "./assets/png/banner-3.png",
    "./assets/png/concepto-mobile-app.png",
    "./assets/png/course-accesibility.png",
    "./assets/png/course-css-bem.png",
    "./assets/png/course-data-python.png",
    "./assets/png/course-design-sprints.png",
    "./assets/png/course-design-systems-figma.png",
    "./assets/png/course-gsap.png",
    "./assets/png/course-machine-learning.png",
    "./assets/png/course-mvc.png",
    "./assets/png/course-net.png",
    "./assets/png/course-postman.png",
    "./assets/png/course-quantitative.png",
    "./assets/png/course-responsive-grid.png",
    "./assets/png/course-three.png",
    "./assets/png/hero-section.png",
    "./assets/png/icon-72x72.png",
    "./assets/png/icon-96x96.png",
    "./assets/png/icon-128x128.png",
    "./assets/png/icon-144x144.png",
    "./assets/png/icon-152x152.png",
    "./assets/png/icon-192x192.png",
    "./assets/png/icon-512x512.png",
    "./assets/png/teacher-alan.png",
    "./assets/png/teacher-eugenia.png",
    "./assets/png/teacher-julia.png",
    "./assets/png/teacher-lara.png",
    "./assets/png/teacher-ricardo.png",
    "./assets/png/teacher-sebastian.png",
    "./assets/svg/close.svg",
    "./assets/svg/dot.svg",
    "./assets/svg/favicon.svg",
    "./assets/svg/logo-palabra.svg",
    "./assets/svg/logo.svg",
    "./assets/svg/menu.svg",
];


self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                cache.addAll(cachedAssets);
            })
            .then(() => self.skipWaiting())
    );
});


self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

//Estrategia de caché (Cache first, falling back to network)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.open(cacheName).then((cache) => {
            // Go to the cache first
            return cache.match(event.request.url).then((cachedResponse) => {
                // Return a cached response if we have one
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, hit the network
                return fetch(event.request).then((fetchedResponse) => {
                    // Add the network response to the cache for later visits
                    cache.put(event.request, fetchedResponse.clone());

                    // Return the network response
                    return fetchedResponse;
                });
            });
        })
    );
});