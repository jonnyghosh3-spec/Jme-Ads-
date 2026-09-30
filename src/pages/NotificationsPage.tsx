import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  ArrowLeft, 
  CheckCheck, 
  Info, 
  Gift, 
  Wallet, 
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Send
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    setActiveTab, 
    showToast,
    notificationPermission,
    requestDeviceNotificationPermission,
    triggerDeviceNotification
  } = useApp();

  const handleMarkAllRead = () => {
    notifications.forEach(n => markNotificationRead(n.id));
    showToast('সব নোটিফিকেশন পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে।', 'success');
  };

  const handleSendTestNotification = async () => {
    const success = await triggerDeviceNotification('🔔 JME Ads টেস্ট নোটিফিকেশন', {
      body: 'অভিনন্দন! আপনার ডিভাইসে পুশ নোটিফিকেশন শতভাগ সফলভাবে কাজ করছে।',
      url: '/'
    });
    if (success) {
      showToast('আপনার মোবাইলে টেস্ট নোটিফিকেশন পাঠানো হয়েছে!', 'success');
    } else {
      showToast('নোটিফিকেশন পাঠানো যায়নি, দয়া করে অনুমতি দিন।', 'warning');
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-extrabold text-lg text-emerald-950">নোটিফিকেশন সেন্টার</h2>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>সব পড়া হয়েছে</span>
          </button>
        )}
      </div>

      {/* Mobile Device Push Notification Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-md space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white">মোবাইলে ব্যাকগ্রাউন্ড পুশ নোটিফিকেশন</h3>
              <p className="text-[11px] text-emerald-200/80">অ্যাপের বাইরে ও স্ক্রিন লক থাকলেও মোবাইলে নোটিফিকেশন আসবে</p>
            </div>
          </div>

          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shrink-0 ${
            notificationPermission === 'granted'
              ? 'bg-emerald-500 text-slate-950'
              : notificationPermission === 'denied'
              ? 'bg-rose-500 text-white'
              : 'bg-amber-400 text-slate-950'
          }`}>
            {notificationPermission === 'granted' ? '✓ সক্রিয় (Active)' :
             notificationPermission === 'denied' ? 'ব্লক রয়েছে' :
             'অনুমতি প্রয়োজন'}
          </span>
        </div>

        {notificationPermission === 'granted' ? (
          <div className="space-y-2 pt-1 border-t border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>মোবাইল পুশ সার্ভিস, সাউন্ড ও ভাইব্রেশন সক্রিয়</span>
              </span>
              <button
                onClick={handleSendTestNotification}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>টেস্ট করুন</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              * অ্যাডমিন যেকোনো বিজ্ঞপ্তি পাঠালে বা পেমেন্ট আপডেট হলে সাথে সাথে আপনার ফোনের নোটিফিকেশন বারে চলে আসবে।
            </p>
          </div>
        ) : notificationPermission === 'denied' ? (
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs space-y-1.5">
            <div className="font-bold text-rose-300 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ব্রাউজার থেকে নোটিফিকেশন ব্লক করা রয়েছে</span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-relaxed">
              মোবাইলে নোটিফিকেশন পেতে: ব্রাউজারের উপরে <strong>তালা আইকন (Lock 🔒)</strong> বা সাইট সেটিংসে চাপ দিন &gt; <strong>Notifications</strong> অপশনে &quot;<strong>Allow (অনুমতি দিন)</strong>&quot; সিলেক্ট করুন।
            </p>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <button
              onClick={requestDeviceNotificationPermission}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Bell className="w-4 h-4" />
              <span>মোবাইলে নোটিফিকেশন চালু করুন (Allow Notifications)</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              বাটনে চাপ দিয়ে ব্রাউজারের পপ-আপে <strong>&apos;Allow&apos;</strong> বা <strong>&apos;অনুমতি দিন&apos;</strong> চাপুন
            </p>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-emerald-100 p-6 text-xs text-gray-400">
            নতুন কোনো নোটিফিকেশন নেই।
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                n.read 
                  ? 'bg-white border-emerald-50 text-gray-600' 
                  : 'bg-emerald-50/40 border-emerald-200 shadow-2xs text-gray-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${
                  n.type === 'reward' ? 'bg-emerald-100 text-emerald-700' :
                  n.type === 'withdrawal' ? 'bg-amber-100 text-amber-700' :
                  n.type === 'security' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {n.type === 'reward' ? <Gift className="w-4 h-4" /> :
                   n.type === 'withdrawal' ? <Wallet className="w-4 h-4" /> :
                   n.type === 'security' ? <ShieldAlert className="w-4 h-4" /> :
                   <Info className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs">{n.title}</h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-2 block font-english">
                    {new Date(n.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
