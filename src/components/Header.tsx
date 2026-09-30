import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Bell, 
  ShieldAlert, 
  HelpCircle, 
  Send, 
  Video, 
  UserCircle,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Shield
} from 'lucide-react';

export const Header: React.FC<{ onOpenSupport: () => void }> = ({ onOpenSupport }) => {
  const { user, notifications, settings, activeTab, setActiveTab, showToast, setShowAdminModal } = useApp();
  const [showCommunityModal, setShowCommunityModal] = useState<'telegram' | 'youtube' | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleTelegramClick = () => {
    const url = settings.telegramUrl && settings.telegramUrl.trim() !== '' 
      ? settings.telegramUrl.trim() 
      : 'https://t.me/JMEAds_Official';
    window.open(url, '_blank');
  };

  const handleYoutubeClick = () => {
    const url = settings.youtubeVideo1Url || settings.youtubeTutorialUrl;
    if (url && url.trim() !== '') {
      window.open(url.trim(), '_blank');
    } else {
      window.open('https://www.youtube.com', '_blank');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Brand - Text Name Only as Requested (No separate logo icon) */}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-emerald-950 font-english">
                JME<span className="text-emerald-600">Ads</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                BD
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium -mt-0.5">
              বিশ্বস্ত আর্নিং প্ল্যাটফর্ম
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {/* Install PWA Button */}
            <PWAInstallButton variant="compact" />

            {/* Admin Panel Button - Small circular icon button for master admin */}
            {user?.email?.toLowerCase() === 'jonnykumar72iw@gmail.com' && (
              <button
                onClick={() => setShowAdminModal(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border border-emerald-400 text-emerald-400 hover:bg-slate-800 active:scale-90 transition-all flex items-center justify-center shadow-xs cursor-pointer shrink-0"
                title="মাস্টার অ্যাডমিন কন্ট্রোল"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {/* Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl text-emerald-900 hover:bg-emerald-50 active:scale-95 transition-all"
              title="বিজ্ঞপ্তি"
            >
              <Bell className="w-5 h-5 text-emerald-800" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Help / Support Icon */}
            <button
              onClick={onOpenSupport}
              className="p-2 rounded-xl text-emerald-900 hover:bg-emerald-50 active:scale-95 transition-all"
              title="কাস্টমার সাপোর্ট"
            >
              <HelpCircle className="w-5 h-5 text-emerald-800" />
            </button>
          </div>
        </div>
      </header>

      {/* Community Info Modal (when YouTube or Telegram link is empty) */}
      {showCommunityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              showCommunityModal === 'telegram' ? 'bg-sky-100 text-sky-600' : 'bg-red-100 text-red-600'
            }`}>
              {showCommunityModal === 'telegram' ? (
                <Send className="w-8 h-8" />
              ) : (
                <Video className="w-8 h-8" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {showCommunityModal === 'telegram' ? '🔵 টেলিগ্রাম কমিউনিটি' : '🔴 ইউটিউব টিউটোরিয়াল'}
            </h3>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {showCommunityModal === 'telegram' 
                ? 'আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেল খুব শীঘ্রই যুক্ত করা হবে।' 
                : 'টিউটোরিয়াল ভিডিও শীঘ্রই আপলোড করা হবে! আপনি কীভাবে সহজে প্রতিদিন আয় ও টাকা উত্তোলন করবেন তা দেখানো হবে।'}
            </p>

            <button
              onClick={() => setShowCommunityModal(null)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md active:scale-95 transition-all"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
