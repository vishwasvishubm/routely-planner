// RouteX Service Worker for Offline Support
const CACHE_NAME = 'routex-v1';
const STATIC_CACHE = 'routex-static-v1';
const DYNAMIC_CACHE = 'routex-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('RouteX SW: Installing service worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('RouteX SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('RouteX SW: Failed to cache static assets:', error);
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('RouteX SW: Activating service worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('RouteX SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fetch from network and cache for future use
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response since it can only be consumed once
            const responseToCache = response.clone();
            
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If network fails, try to serve offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  console.log('RouteX SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-trips') {
    event.waitUntil(syncTripsWithServer());
  }
});

// Sync function (placeholder for future implementation)
async function syncTripsWithServer() {
  console.log('RouteX SW: Syncing trips with server...');
  // Future implementation will sync IndexedDB data with backend
  try {
    // This will be implemented when backend is available
    // const unsyncedTrips = await getUnsyncedTrips();
    // await syncToServer(unsyncedTrips);
    console.log('RouteX SW: Sync placeholder executed');
  } catch (error) {
    console.error('RouteX SW: Sync failed:', error);
    throw error; // Re-throw to retry sync later
  }
}

// Push notification handler (for future reminders feature)
self.addEventListener('push', (event) => {
  console.log('RouteX SW: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'You have a travel reminder!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Trip',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('RouteX Reminder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('RouteX SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the app to the relevant trip
    event.waitUntil(
      clients.openWindow('/')
    );
  }
  // Dismiss action just closes the notification (already handled above)
});

console.log('RouteX SW: Service worker script loaded');