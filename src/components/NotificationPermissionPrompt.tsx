import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Sparkles, Check, X, ShieldAlert } from 'lucide-react';

export const NotificationPermissionPrompt: React.FC = () => {
  const { user, handleRequestNotificationPermission } = useApp();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const checkPermissionAndPrompt = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission !== 'granted') {
      setShowPrompt(true);
      // Automatically attempt native browser prompt on user activity
      try {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            setShowPrompt(false);
          }
        }).catch(() => {});
      } catch (e) {}
    } else {
      setShowPrompt(false);
    }
  };

  useEffect(() => {
    // 1. Prompt immediately on landing
    const initialTimer = setTimeout(() => {
      checkPermissionAndPrompt();
    }, 1500);

    // 2. "যদি না দেয় প্রতি মিনিটে মিনিটে চাইবে" -> Check and prompt every 1 minute (60 seconds)
    const minuteInterval = setInterval(() => {
      checkPermissionAndPrompt();
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(minuteInterval);
    };
  }, []);

  const handleGrant = async () => {
    setIsRequesting(true);
    try {
      const granted = await handleRequestNotificationPermission();
      if (granted) {
        setShowPrompt(false);
      }
    } catch (e) {
      // ignore
    } finally {
      setIsRequesting(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-3 animate-in slide-in-from-top-4 duration-300">
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white border-2 border-emerald-500/50 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 animate-pulse">
            <Bell className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="truncate text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">নোটিফিকেশন অনুমতি প্রয়োজন</span>
              <span className="text-[9px] font-black bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded-full shrink-0">
                জরুরি
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/90 truncate">
              নতুন বিজ্ঞাপনের কাজ ও পেমেন্ট রিসিভ নোটিফিকেশন পেতে অনুমতি দিন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleGrant}
            disabled={isRequesting}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{isRequesting ? 'অনুমতি...' : 'অনুমতি দিন'}</span>
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowPrompt(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="পরে স্মরণ করিয়ে দিন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
