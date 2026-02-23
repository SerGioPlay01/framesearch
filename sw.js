/**
 * Framesearch - Service Worker
 * 
 * Автор: SerGioPlay
 * GitHub: https://github.com/SerGioPlay01
 * Проект: https://github.com/SerGioPlay01/framesearch
 * Сайт: https://sergioplay-dev.vercel.app/
 * 
 * © 2026 Framesearch.  
 */

const CACHE_VERSION = 'framesearch-v5.0.0';
const CACHE_NAME = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const EXTERNAL_CACHE = `${CACHE_VERSION}-external`;

// Files to cache immediately
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/app.html',
    '/landing.html',
    '/search_results.html',
    '/video_id.html',
    '/styles/main.css',
    '/styles/mobile-navbar.css',
    '/styles/modal.css',
    '/styles/search.css',
    '/styles/video.css',
    '/styles/preloader.css',
    '/styles/floating-actions.css',
    '/styles/view-modes.css',
    '/styles/app-lock.css',
    '/styles/landing.css',
    '/scripts/main.js',
    '/scripts/db.js',
    '/scripts/modal.js',
    '/scripts/search.js',
    '/scripts/video-player.js',
    '/scripts/share.js',
    '/scripts/import.js',
    '/scripts/collections.js',
    '/scripts/dialog.js',
    '/scripts/theme.js',
    '/scripts/cookie-consent.js',
    '/scripts/i18n.js',
    '/scripts/logger.js',
    '/scripts/preloader.js',
    '/scripts/floating-actions.js',
    '/scripts/view-modes.js',
    '/scripts/music-sources.js',
    '/scripts/app-lock.js',
    '/scripts/lucide.js',
    '/favicon/favicon.ico',
    '/favicon/favicon-32x32.png',
    '/manifest.json',
    '/fonts/Roboto/stylesheet.css',
    '/fonts/Roboto/Roboto-Regular.woff',
    '/fonts/Roboto/Roboto-Bold.woff',
    '/fonts/Roboto/Roboto-Medium.woff',
    '/fonts/Roboto/Roboto-Light.woff'
];

// External resources to cache (пусто, так как все локально)
const EXTERNAL_CACHE_URLS = [];


// Install event - cache static assets and external resources
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        // Кешируем только статические ресурсы при установке
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('[SW] Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Cache installation failed:', error);
                // Все равно пропускаем ожидание, чтобы SW активировался
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName.startsWith('framesearch-') && 
                                   cacheName !== CACHE_NAME && 
                                   cacheName !== RUNTIME_CACHE &&
                                   cacheName !== EXTERNAL_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip chrome-extension and other non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }

    // Skip landing page - let it handle its own routing
    if (url.pathname.includes('landing')) {
        return;
    }

    // Handle external resources (fonts, icons, CDN, images)
    if (url.origin !== location.origin) {
        event.respondWith(
            // For images, try network first for fresh content
            (request.destination === 'image' 
                ? fetch(request, { mode: 'cors', credentials: 'omit' })
                    .then((response) => {
                        if (response && response.ok) {
                            // Cache image for future use
                            const responseToCache = response.clone();
                            caches.open(EXTERNAL_CACHE)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        return response;
                    })
                    .catch(() => {
                        // Fallback to cache if network fails
                        return caches.match(request);
                    })
                : caches.match(request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // Try to fetch from network
                        return fetch(request, { mode: 'cors' })
                            .then((response) => {
                                if (response && response.ok) {
                                    // Cache external resource for future use
                                    const responseToCache = response.clone();
                                    caches.open(EXTERNAL_CACHE)
                                        .then((cache) => {
                                            cache.put(request, responseToCache);
                                        });
                                }
                                return response;
                            })
                            .catch((error) => {
                                console.warn('[SW] External resource fetch failed:', url.href);
                                
                                // For fonts and critical resources, return cached version if available
                                if (url.hostname.includes('fonts.googleapis.com') || 
                                    url.hostname.includes('fonts.gstatic.com') ||
                                    url.hostname.includes('unpkg.com')) {
                                    return caches.match(request)
                                        .then(cached => cached || new Response('', { status: 200 }));
                                }
                                
                                // Return empty response for other failed external resources
                                return new Response('', { status: 200 });
                            });
                    })
            )
        );
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version and update cache in background
                    updateCache(request);
                    return cachedResponse;
                }

                // Not in cache, fetch from network
                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the fetched response
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Fetch failed:', error);
                        
                        // For navigation requests, try to return cached index.html
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html')
                                .then((cachedIndex) => {
                                    if (cachedIndex) {
                                        return cachedIndex;
                                    }
                                    // If no cached index, let it fail naturally
                                    throw error;
                                });
                        }
                        
                        throw error;
                    });
            })
    );
});

// Update cache in background
function updateCache(request) {
    fetch(request)
        .then((response) => {
            if (response && response.status === 200) {
                caches.open(RUNTIME_CACHE)
                    .then((cache) => {
                        cache.put(request, response);
                    });
            }
        })
        .catch(() => {
            // Silently fail - we already have cached version
        });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // Placeholder for future sync functionality
    console.log('[SW] Syncing data...');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Новое уведомление',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Framesearch', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});
