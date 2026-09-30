import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import webpush from 'web-push';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// VAPID keys for Web Push Notifications
export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BJgLg3J8tZNkqIIBmezU5lIrAgk4AzDwJvvXQylS2ZrAXL2ppcr-HcXkb03xevD_Y96xReUxn3QPNTsJV57SDUo';
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'HwAG7Bgn-nUTt5cmtgQDVDWRziXwJ6TyvV_AWtQzHZ4';

try {
  webpush.setVapidDetails(
    'mailto:support@jmeads.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  console.log('✓ WebPush VAPID configured successfully');
} catch (err) {
  console.warn('WebPush VAPID setup warning:', err);
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Store in-memory push subscriptions (and synchronized with client)
interface StoredSubscription {
  subscription: webpush.PushSubscription;
  userId?: string;
  userAgent?: string;
  subscribedAt: number;
}

const subscriptionsMap = new Map<string, StoredSubscription>();

// API: Get VAPID Public Key
app.get('/api/push/vapid-public-key', (_req: Request, res: Response) => {
  res.json({
    success: true,
    publicKey: VAPID_PUBLIC_KEY
  });
});

// API: Save Device Push Subscription
app.post('/api/push/subscribe', (req: Request, res: Response) => {
  try {
    const { subscription, userId, userAgent } = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ success: false, error: 'Invalid subscription object' });
    }

    subscriptionsMap.set(subscription.endpoint, {
      subscription,
      userId: userId || 'anonymous',
      userAgent: userAgent || '',
      subscribedAt: Date.now()
    });

    console.log(`[Push] Device subscribed. Total active subscriptions: ${subscriptionsMap.size}`);

    return res.json({
      success: true,
      message: 'Mobile push subscription registered',
      totalSubscribers: subscriptionsMap.size
    });
  } catch (err: any) {
    console.error('Error saving push subscription:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// API: Unsubscribe Device
app.post('/api/push/unsubscribe', (req: Request, res: Response) => {
  const { endpoint } = req.body;
  if (endpoint && subscriptionsMap.has(endpoint)) {
    subscriptionsMap.delete(endpoint);
  }
  return res.json({ success: true });
});

// API: Broadcast Mobile Push Notification to all subscribed devices
app.post('/api/push/broadcast', async (req: Request, res: Response) => {
  try {
    const { title, message, url, icon, badge, extraSubscriptions } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, error: 'Title and message are required' });
    }

    // Merge any client-supplied subscriptions (e.g. from Firestore pushSubscriptions collection)
    if (Array.isArray(extraSubscriptions)) {
      for (const item of extraSubscriptions) {
        if (item && item.endpoint && !subscriptionsMap.has(item.endpoint)) {
          subscriptionsMap.set(item.endpoint, {
            subscription: item,
            userId: item.userId || 'synced',
            subscribedAt: Date.now()
          });
        }
      }
    }

    const payload = JSON.stringify({
      title: title || 'JME Ads বিজ্ঞপ্তি',
      body: message || 'নতুন বিজ্ঞপ্তি এসেছে!',
      icon: icon || '/pwa-192x192.png',
      badge: badge || '/pwa-192x192.png',
      url: url || '/',
      timestamp: Date.now()
    });

    const results = {
      total: subscriptionsMap.size,
      sent: 0,
      failed: 0
    };

    const sendPromises = Array.from(subscriptionsMap.entries()).map(async ([endpoint, subObj]) => {
      try {
        await webpush.sendNotification(subObj.subscription, payload, {
          TTL: 60 * 60 * 24 // Keep in Google/Apple push queue for 24 hours
        });
        results.sent++;
      } catch (pushErr: any) {
        results.failed++;
        console.warn(`[Push] Failed for endpoint: ${endpoint.slice(0, 35)}... status: ${pushErr.statusCode}`);
        // If expired or unsubscribed (404 / 410 Gone), remove from active map
        if (pushErr.statusCode === 404 || pushErr.statusCode === 410) {
          subscriptionsMap.delete(endpoint);
        }
      }
    });

    await Promise.all(sendPromises);

    console.log(`[Push] Broadcast completed. Sent: ${results.sent}, Failed: ${results.failed}, Total: ${results.total}`);

    return res.json({
      success: true,
      results
    });
  } catch (err: any) {
    console.error('Error during broadcast push:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 JME Ads App running on port ${PORT} [WebPush & Full-Stack Active]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
