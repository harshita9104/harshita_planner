/**
 * 🔄 Weekendly Service Worker - Offline Support & Performance
 * 
 * This service worker provides offline functionality and performance optimization
 * for the Weekendly app, ensuring users can access their weekend plans even
 * without an internet connection.
 */

const CACHE_NAME = 'weekendly-v1.2.0';
const DATA_CACHE_NAME = 'weekendly-data-v1.0.0';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.openweathermap\.org\//,
  /^https:\/\/api\.mapbox\.com\//,
  // Add other API patterns as needed
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Take control of all pages
        return self.clients.claim();
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  // Default: try network first, then cache
  event.respondWith(
    fetch(request)
      .catch(() => caches.match(request))
  );
});

// Check if request is for API data
function isApiRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Check if request is for static asset
function isStaticAsset(request) {
  return request.destination === 'script' ||
         request.destination === 'style' ||
         request.destination === 'image' ||
         request.destination === 'font';
}

// Handle API requests with network-first, cache fallback
async function handleApiRequest(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // If successful, update cache
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('📱 Network failed, using cached data for:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return offline response
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This content is not available offline'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle navigation requests
async function handleNavigation(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Network failed, serve cached index.html
    console.log('📱 Serving offline page');
    const cache = await caches.open(CACHE_NAME);
    return cache.match('/') || cache.match('/index.html');
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'weekendly-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Get pending sync data from IndexedDB
    const pendingData = await getPendingSyncData();
    
    for (const item of pendingData) {
      try {
        await syncDataItem(item);
        await markDataAsSynced(item.id);
      } catch (error) {
        console.error('Failed to sync item:', item.id, error);
      }
    }
    
    console.log('✅ Offline data sync completed');
  } catch (error) {
    console.error('❌ Offline data sync failed:', error);
  }
}

// Mock functions for data sync (implement based on your data structure)
async function getPendingSyncData() {
  // This would typically read from IndexedDB
  // Return array of items that need to be synced
  return [];
}

async function syncDataItem(item) {
  // This would typically make API calls to sync the item
  // Implementation depends on your backend API
  console.log('Syncing item:', item);
}

async function markDataAsSynced(itemId) {
  // Mark item as synced in IndexedDB
  console.log('Marked as synced:', itemId);
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    default:
      console.log('Unknown message type:', type);
  }
});

// Utility function to get cache size
async function getCacheSize() {
  let totalSize = 0;
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

// Utility function to clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
}

// Performance monitoring
self.addEventListener('fetch', (event) => {
  // Track performance metrics
  const startTime = performance.now();
  
  event.respondWith(
    handleRequest(event.request).then(response => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Log slow requests (>1000ms)
      if (duration > 1000) {
        console.warn(`Slow request: ${event.request.url} took ${duration}ms`);
      }
      
      return response;
    })
  );
});

// Default request handler
async function handleRequest(request) {
  // Use the appropriate strategy based on request type
  if (isApiRequest(request)) {
    return handleApiRequest(request);
  } else if (isStaticAsset(request)) {
    return handleStaticAsset(request);
  } else if (request.mode === 'navigate') {
    return handleNavigation(request);
  } else {
    return fetch(request).catch(() => caches.match(request));
  }
}

console.log('🚀 Weekendly Service Worker loaded successfully');
