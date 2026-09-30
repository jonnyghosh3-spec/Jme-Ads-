// Firebase Messaging Service Worker for Background Push Notifications
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBc73zTaVAPIPJpdradNkO02AhgTQt8GXU",
  authDomain: "jmeads-f981e.firebaseapp.com",
  projectId: "jmeads-f981e",
  storageBucket: "jmeads-f981e.firebasestorage.app",
  messagingSenderId: "301941552836",
  appId: "1:301941552836:web:619ba1ef237ccc38c3bb91"
});

try {
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background push received:', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || 'JME Ads বিজ্ঞপ্তি';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'নতুন আপডেট এসেছে!',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [300, 100, 300, 100, 300],
      tag: payload.data?.tag || 'jmeads-push-' + Date.now(),
      data: {
        url: payload.data?.url || '/'
      },
      actions: [
        { action: 'open', title: 'দেখুন' }
      ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('Firebase messaging sw compat notice:', e);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
