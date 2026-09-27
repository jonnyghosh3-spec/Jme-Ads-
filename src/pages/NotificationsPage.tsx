import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ArrowLeft, CheckCheck, Info, Gift, Wallet, ShieldAlert } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, setActiveTab, showToast } = useApp();

  const handleMarkAllRead = () => {
    notifications.forEach(n => markNotificationRead(n.id));
    showToast('সব নোটিফিকেশন পড়া হয়েছে হিসেবে চিহ্নিত করা হয়েছে।', 'success');
  };

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-extrabold text-lg text-emerald-950">নোটিফিকেশন</h2>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1"
          >
            <CheckCheck className="w-4 h-4" />
            <span>সব পড়া হয়েছে</span>
          </button>
        )}
      </div>

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
