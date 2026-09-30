/**
 * Comprehensive Mobile & Web Push Notification Engine
 * - Full Web Push Protocol (PushManager VAPID Subscription)
 * - Service Worker showNotification with action buttons and custom vibration
 * - Synthesized mobile audio chime using Web Audio API
 * - Firestore & Server synchronization for offline background delivery
 */

import { db, doc, setDoc, getDocs, collection, serverTimestamp } from '../firebase/config';

export const VAPID_PUBLIC_KEY = 'BJgLg3J8tZNkqIIBmezU5lIrAgk4AzDwJvvXQylS2ZrAXL2ppcr-HcXkb03xevD_Y96xReUxn3QPNTsJV57SDUo';

export interface DeviceNotificationOptions {
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
  silent?: boolean;
}

// Helper: Convert URL-safe base64 string to Uint8Array for PushManager applicationServerKey
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Play pleasant 2-tone mobile alert chime using Web Audio API
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First tone (587.33 Hz - D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Second tone (880 Hz - A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.22, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch (e) {
    // Audio autoplay might be restricted before user gesture
  }
};

// Check Notification Permission Status
export const getNotificationPermissionStatus = (): 'granted' | 'denied' | 'default' | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Register Push Subscription to backend and Firestore
async function registerSubscriptionWithDatabase(subscription: PushSubscription, userId?: string) {
  const subJson = subscription.toJSON();
  if (!subJson.endpoint) return;

  // 1. Generate clean document ID for Firestore
  const cleanId = btoa(subJson.endpoint.slice(-32)).replace(/[/+=]/g, '_');

  try {
    // Save to Firestore so it is persistently available across server restarts
    await setDoc(doc(db, 'push_subscriptions', cleanId), {
      endpoint: subJson.endpoint,
      keys: subJson.keys || null,
      userId: userId || 'anonymous',
      userAgent: navigator.userAgent || 'mobile-browser',
      updatedAt: serverTimestamp(),
      subscribedAt: Date.now()
    }, { merge: true });
    console.log('[Push] Subscription saved to Firestore push_subscriptions');
  } catch (err) {
    console.warn('[Push] Firestore subscription sync note:', err);
  }

  // 2. Also send to Express backend /api/push/subscribe
  try {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: subJson,
        userId: userId || 'anonymous',
        userAgent: navigator.userAgent
      })
    });
  } catch (serverErr) {
    console.warn('[Push] Local server subscribe note:', serverErr);
  }
}

// Request permission and setup full Web Push Subscription
export const requestDeviceNotificationPermission = async (userId?: string): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return false;
    }

    // Attempt to register with ServiceWorker & PushManager
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as any
          });
          console.log('[Push] New push subscription created successfully');
        }

        if (subscription) {
          await registerSubscriptionWithDatabase(subscription, userId);
        }
      } catch (pushErr) {
        console.warn('[Push] PushManager subscription warning (falling back to direct showNotification):', pushErr);
      }
    }

    // Fire welcome confirmation notification on device
    await triggerDeviceNotification('🔔 JME Ads নোটিফিকেশন চালু হয়েছে!', {
      body: 'অভিনন্দন! নতুন কাজ, বোনাস এবং পেমেন্টের আপডেট এখন অ্যাপের বাইরে থাকলেও আপনার মোবাইলের স্ক্রিনে সরাসরি আসবে।',
      url: '/'
    });

    return true;
  } catch (err) {
    console.warn('Failed to request notification permission:', err);
    return false;
  }
};

// Sync existing push subscription on startup
export const syncCurrentSubscription = async (userId?: string): Promise<void> => {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as any
      });
    }

    if (subscription) {
      await registerSubscriptionWithDatabase(subscription, userId);
    }
  } catch (err) {
    console.warn('Sync push subscription note:', err);
  }
};

// Trigger Device Notification locally (plays audio chime and displays through ServiceWorker)
export const triggerDeviceNotification = async (
  title: string,
  options: DeviceNotificationOptions
): Promise<boolean> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  // Play mobile alert sound
  if (!options.silent) {
    playNotificationChime();
  }

  const notificationOptions: any = {
    body: options.body,
    icon: options.icon || '/pwa-192x192.png',
    badge: options.badge || '/pwa-192x192.png',
    tag: options.tag || 'jmeads_alert_' + Date.now(),
    data: { url: options.url || '/' },
    // Mobile vibration pattern: 300ms on, 100ms pause, 300ms on
    vibrate: [300, 100, 300, 100, 300],
    renotify: true,
    requireInteraction: false,
    actions: [
      { action: 'open', title: '📱 দেখুন' }
    ]
  };

  let shown = false;

  // 1. Primary method: ServiceWorkerRegistration.showNotification (required on Android/Chrome)
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        shown = true;
      }
    } catch (swErr) {
      console.warn('Service worker showNotification note:', swErr);
    }
  }

  // 2. Also dispatch to active Service Worker controller for background handling
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        options: notificationOptions
      });
      shown = true;
    } catch (postErr) {
      console.warn('Controller postMessage note:', postErr);
    }
  }

  // 3. Fallback for Desktop Safari
  if (!shown) {
    try {
      new Notification(title, notificationOptions);
      shown = true;
    } catch (ctorErr) {
      // Expected to fail on Mobile Chrome
    }
  }

  return shown;
};

// Broadcast Web Push to all devices via server and Firestore subscriptions
export const broadcastPushNotificationToAll = async (
  title: string,
  message: string,
  url: string = '/'
): Promise<void> => {
  try {
    // 1. Fetch any registered subscriptions from Firestore to ensure zero missed devices
    const extraSubs: any[] = [];
    try {
      const snap = await getDocs(collection(db, 'push_subscriptions'));
      snap.forEach((d) => {
        const data = d.data();
        if (data.endpoint && data.keys) {
          extraSubs.push({
            endpoint: data.endpoint,
            keys: data.keys,
            userId: data.userId
          });
        }
      });
    } catch (dbErr) {
      console.warn('Error reading push_subscriptions from Firestore:', dbErr);
    }

    // 2. Dispatch push broadcast request to Express backend
    await fetch('/api/push/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        message,
        url,
        extraSubscriptions: extraSubs
      })
    });
  } catch (err) {
    console.warn('Broadcast push request note:', err);
  }
};
