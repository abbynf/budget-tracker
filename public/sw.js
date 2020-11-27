console.log("accessed SW file");

const fileCacheName = 'budget-file';
const dataCacheName = 'budget-data'

const filesToCache = [
    '/',
    'index.html',
    'manifest.webmanifest',
    '/assets/css/styles.css',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    '/assets/js/index.js'
];



self.addEventListener('install', (event) => {
    console.log('hit install');

    event.waitUntil(
        caches
            .open(fileCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
            .catch(error => console.log("error caching files on install", error))
    );

    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('hit activation');

    event.waitUntil(
        caches
            .keys()
            .then(keyList => {
                return Promise.all(
                    keyList.map(key => {

                        if (key !== fileCacheName && key !== dataCacheName) {
                            console.log("deleting cache: ", key);
                            return caches.delete(key)
                        }
                    })
                )
            })
            .catch(error => console.log('activation error', error))
    );


    self.clients.claim();
});


self.addEventListener('fetch', (event) => {
    console.log(event);

    if (event.request.url.includes('/api')) {
        return event.respondWith(
            caches
                .open(dataCacheName)
                .then(cache => {
                    return fetch(event.request)
                        .then(response => {
                            if (response.status === 200) {
                                cache.put(event.request.url, response.clone())
                            }

                            return response;
                        })
                        .catch(error => {
                            return cache.match(event.request)
                        })
                })
                .catch(error => console.log('error fetching api', error))
        );
    }


    event.respondWith(
        caches
            .match(event.request)
            .then(response => {
                return response || fetch(event.request)
            })
            .catch(error => console.log(error))
    )

});
