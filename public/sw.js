// JME Ads Service Worker (sw.js)
const CACHE_NAME = 'jmeads-pwa-cache-v3';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/data.json'
];

// Install event: cache core static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('PWA Precache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event: cleanup old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;
  if (event.request.url.includes('/api/')) return; // Never cache API calls

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('Offline content unavailable', { status: 503, statusText: 'Service Unavailable' });
        });
      })
  );
});

// Message listener from web client (triggers notifications even when tab is backgrounded)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title || 'JME Ads বিজ্ঞপ্তি';
    const options = {
      body: event.data.options?.body || 'নতুন নোটিফিকেশন এসেছে!',
      icon: event.data.options?.icon || '/pwa-192x192.png',
      badge: event.data.options?.badge || '/pwa-192x192.png',
      vibrate: event.data.options?.vibrate || [300, 100, 300, 100, 300],
      tag: event.data.options?.tag || 'jmeads-' + Date.now(),
      renotify: true,
      data: event.data.options?.data || { url: '/' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Web Push event listener (Delivered by Android Google Play Services / Apple Push / Mozilla Push even when browser is closed!)
self.addEventListener('push', (event) => {
  console.log('[sw.js] Push notification received in background!');
  let data = {
    title: '🔔 JME Ads নতুন নোটিফিকেশন',
    body: 'আপনার অ্যাকাউন্টে নতুন বিজ্ঞপ্তি বা আপডেট এসেছে।'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: '🔔 JME Ads বিজ্ঞপ্তি',
        body: event.data.text() || 'নতুন বিজ্ঞপ্তি চেক করুন।'
      };
    }
  }

  const options = {
    body: data.body || data.message || 'নতুন আপডেট চেক করুন',
    icon: data.icon || '/pwa-192x192.png',
    badge: data.badge || '/pwa-192x192.png',
    vibrate: [300, 100, 300, 100, 300],
    tag: data.tag || 'jmeads-push-' + (data.timestamp || Date.now()),
    renotify: true,
    requireInteraction: true, // Remains on mobile lockscreen / shade until dismissed
    data: {
      url: data.url || '/',
      timestamp: data.timestamp || Date.now()
    },
    actions: [
      { action: 'open', title: '📱 ওপেন করুন' },
      { action: 'dismiss', title: '✕ বন্ধ করুন' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 JME Ads বিজ্ঞপ্তি', options)
  );
});

// Notification click event: focuses or opens JME Ads app window on mobile
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open in this origin, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client && targetUrl !== '/') {
            client.navigate(targetUrl).catch(() => {});
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Resubscribe on push subscription change if refreshed by the browser
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription?.options || { userVisibleOnly: true })
      .then((newSubscription) => {
        // Broadcast new subscription to all clients to update Firestore
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'PUSH_SUBSCRIPTION_CHANGED',
              subscription: JSON.parse(JSON.stringify(newSubscription))
            });
          });
        });
      })
      .catch((err) => {
        console.warn('pushsubscriptionchange error:', err);
      })
  );
});
