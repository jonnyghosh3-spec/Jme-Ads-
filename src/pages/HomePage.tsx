import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { WelcomeBonusModal } from '../components/WelcomeBonusModal';
import { RulesNoticeModal } from '../components/RulesNoticeModal';
import { ReviewsSection } from '../components/ReviewsSection';
import { AdDisplay } from '../components/AdDisplay';
import { ChannelSubscribeModal } from '../components/ChannelSubscribeModal';
import { 
  Wallet, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Users, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Gift, 
  Video, 
  Headphones, 
  Copy, 
  ChevronRight, 
  Flame, 
  Send, 
  CheckSquare, 
  TrendingUp,
  Briefcase
} from 'lucide-react';

export const HomePage: React.FC<{ onOpenSupport: () => void }> = ({ onOpenSupport }) => {
  const { user, tasks, settings, setActiveTab, startTask, showToast, claimWelcomeBonus } = useApp();

  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeChannelType, setSubscribeChannelType] = useState<'youtube' | 'telegram'>('youtube');

  const handleOpenSubscribe = (type: 'youtube' | 'telegram') => {
    setSubscribeChannelType(type);
    setShowSubscribeModal(true);
  };

  // Check on mount if user hasn't claimed welcome bonus or seen rules
  useEffect(() => {
    if (!user) return;
    const bonusKey = `jme_welcome_bonus_${user.uid}`;
    const rulesKey = `jme_welcome_rules_${user.uid}`;

    const hasClaimed = localStorage.getItem(bonusKey);
    const hasSeenRules = localStorage.getItem(rulesKey);

    if (!hasClaimed) {
      setShowBonusModal(true);
    } else if (!hasSeenRules) {
      setShowRulesModal(true);
    }
  }, [user]);

  const handleClaimBonus = () => {
    claimWelcomeBonus(120);
    setShowBonusModal(false);
    // Immediately show Rules & Guidelines modal as requested
    setTimeout(() => {
      setShowRulesModal(true);
    }, 300);
  };

  const handleCloseRules = () => {
    if (user) {
      localStorage.setItem(`jme_welcome_rules_${user.uid}`, 'true');
    }
    setShowRulesModal(false);
  };

  const handleCopyReferral = () => {
    if (!user) return;
    const url = `${window.location.origin}/?ref=${user.referralCode}`;
    navigator.clipboard.writeText(url);
    showToast('রেফারেল লিংক কপি হয়েছে!', 'success');
  };

  const handleOpenTelegram = () => {
    if (settings.telegramUrl && settings.telegramUrl.trim() !== '') {
      window.open(settings.telegramUrl, '_blank');
    } else {
      window.open('https://t.me/JMEAds_Official', '_blank');
    }
  };

  const handleOpenVideo1 = () => {
    const url = settings.youtubeVideo1Url || settings.youtubeTutorialUrl;
    window.open(url && url.trim() !== '' ? url : 'https://www.youtube.com', '_blank');
  };

  const handleOpenVideo2 = () => {
    const url = settings.youtubeVideo2Url;
    window.open(url && url.trim() !== '' ? url : 'https://www.youtube.com', '_blank');
  };

  // Top 4 smartlink tasks for the Premium Income section
  const premiumTasks = tasks.slice(0, 4);

  // Daily task completed count calculation
  const todayTasksCompleted = user?.todayTaskCompletions 
    ? Object.values(user.todayTaskCompletions).reduce((sum: number, c: number) => sum + c, 0)
    : 0;

  return (
    <div className="space-y-3.5 pb-28">
      
      {/* 1. PWA Native Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* 2. User Greeting */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-lg font-black text-emerald-950 truncate max-w-[220px]">
            {user ? user.name : 'স্বাগতম'}
          </h2>
          <p className="text-[11px] text-emerald-700 font-medium">
            JME Ads আর্নিং ড্যাশবোর্ড
          </p>
        </div>
        <button
          onClick={() => setShowRulesModal(true)}
          className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer"
        >
          নিয়মাবলী 📋
        </button>
      </div>

      {/* 3. Main Total Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white p-4 sm:p-5 shadow-xl shadow-emerald-700/20 border border-emerald-500/30">
        
        {/* Background glow */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-lg pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <div className="p-1 rounded-lg bg-white/15">
                <Wallet className="w-3.5 h-3.5 text-emerald-100" />
              </div>
              <span className="text-xs text-emerald-100 font-semibold">মোট ব্যালেন্স</span>
            </div>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/20 font-bold font-english">
              BDT ৳
            </span>
          </div>

          {/* Big Balance */}
          <div className="my-1.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-baseline gap-1 font-english">
              <span className="text-xl font-bold text-emerald-200">৳</span>
              <span>{user ? user.balance.toFixed(2) : '0.00'}</span>
            </h1>
          </div>

          {/* 4 Stats Grid - Compact for mobile */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-600/50 text-xs">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2">
              <span className="text-[10px] text-emerald-100 block">আজকের আয়</span>
              <span className="font-extrabold text-sm text-white font-english">
                ৳{user ? user.todayEarned.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2">
              <span className="text-[10px] text-emerald-100 block">রেফার আয়</span>
              <span className="font-extrabold text-sm text-white font-english">
                ৳{user ? user.referralEarned.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2">
              <span className="text-[10px] text-emerald-100 block">মোট ইনকাম</span>
              <span className="font-extrabold text-sm text-white font-english">
                ৳{user ? user.totalEarned.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2">
              <span className="text-[10px] text-emerald-100 block">মোট উত্তোলন</span>
              <span className="font-extrabold text-sm text-white font-english">
                ৳{user ? user.totalWithdrawn.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          {/* Quick Withdraw Action */}
          <button
            onClick={() => setActiveTab('withdraw')}
            className="w-full mt-3 py-2.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-700" />
            <span>টাকা উত্তোলন করুন</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
          </button>
        </div>
      </div>

      {/* 4. Compact Today's Status Bar (Clean, uncluttered, fits mobile) */}
      <div className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-gray-800 block">
              আজকের কাজ: <strong className="text-emerald-700 font-english">{todayTasksCompleted}টি</strong> সম্পন্ন
            </span>
            <span className="text-[10px] text-gray-500">প্রতি বিজ্ঞাপনে ৫ টাকা</span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('tasks')}
          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>কাজ করুন</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4.1. Sleek, Compact Channel Subscribe Strips (Like Telegram Banner) */}
      <div className="space-y-2">
        {/* YouTube Channel Strip */}
        {(() => {
          const isYtDone = Boolean(user?.completedMicroJobs?.['mj_subscribe_2']);
          return (
            <div 
              onClick={() => handleOpenSubscribe('youtube')}
              className="w-full p-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-xs hover:shadow-md active:scale-98 transition-all flex items-center justify-between gap-2.5 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
                <div className="truncate text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold block truncate">ইউটিউব চ্যানেল সাবস্ক্রাইব</span>
                    <span className="text-[9px] font-black bg-white text-red-700 px-1.5 py-0.2 rounded-full shrink-0">
                      +৳২০ রিওয়ার্ড
                    </span>
                  </div>
                  <span className="text-[10px] text-red-100 block truncate">
                    {isYtDone ? '✓ আজ সম্পন্ন হয়েছে (+৳২০ যোগ হয়েছে)' : 'সাবস্ক্রাইব করে স্ক্রিনশট দিন ও পান নগদ ২০ টাকা'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 ${
                  isYtDone ? 'bg-white/20 text-white' : 'bg-white text-red-700'
                }`}>
                  <span>{isYtDone ? 'সম্পন্ন' : 'সাবস্ক্রাইব'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })()}

        {/* Telegram Channel Strip */}
        {(() => {
          const isTgDone = Boolean(user?.completedMicroJobs?.['mj_telegram_4']);
          return (
            <div 
              onClick={() => handleOpenSubscribe('telegram')}
              className="w-full p-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-xs hover:shadow-md active:scale-98 transition-all flex items-center justify-between gap-2.5 cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold block truncate">টেলিগ্রাম চ্যানেল সাবস্ক্রাইব</span>
                    <span className="text-[9px] font-black bg-white text-sky-700 px-1.5 py-0.2 rounded-full shrink-0">
                      +৳২০ রিওয়ার্ড
                    </span>
                  </div>
                  <span className="text-[10px] text-sky-100 block truncate">
                    {isTgDone ? '✓ আজ সম্পন্ন হয়েছে (+৳২০ যোগ হয়েছে)' : 'জয়েন করে স্ক্রিনশট দিন ও পান নগদ ২০ টাকা'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xs flex items-center gap-1 ${
                  isTgDone ? 'bg-white/20 text-white' : 'bg-white text-sky-700'
                }`}>
                  <span>{isTgDone ? 'সম্পন্ন' : 'জয়েন করুন'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Featured Micro Jobs & Video Offers Banner (Admin Toggleable) */}
      {settings.showMicroJobsSection !== false && (
        <div 
          onClick={() => setActiveTab('microjobs')}
          className="p-3.5 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-green-900 text-white shadow-md border border-emerald-500/30 flex items-center justify-between gap-3 cursor-pointer hover:shadow-lg transition-all active:scale-98"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                  নতুন অফার
                </span>
                <span className="text-[10px] text-emerald-300 font-bold truncate">ভিডিও দেখে আয়</span>
              </div>
              <h4 className="font-extrabold text-xs sm:text-sm text-white truncate">
                মাইক্রো জব ও অফার লিস্ট
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 shrink-0">
            <span>দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}

      {/* 5. Short Notice Strip */}
      <div className="p-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center gap-2 text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="text-[11px] font-semibold leading-tight">
          প্রতি বিজ্ঞাপনে কমপক্ষে ১৫ সেকেন্ড অপেক্ষা করতে হবে, অন্যথায় টাকা যোগ হবে না।
        </span>
      </div>

      {/* 6. Clean Video Tutorial & Waz Guide Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>ভিডিও টিউটোরিয়াল ও গাইড</span>
          </span>
          <span className="text-[10px] text-gray-500 font-bold">ভিডিও দেখে কাজ শিখুন</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleOpenVideo1}
            className="p-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-red-100 font-bold uppercase block">টিউটোরিয়াল ১</span>
              <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight break-words block mt-0.5">
                {settings.youtubeVideo1Title || 'কাজের নিয়ম'}
              </span>
            </div>
          </button>

          <button
            onClick={handleOpenVideo2}
            className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-xs hover:from-rose-700 hover:to-red-800 active:scale-95 transition-all flex items-center gap-2.5 text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-rose-100 font-bold uppercase block">টিউটোরিয়াল ২</span>
              <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight break-words block mt-0.5">
                {settings.youtubeVideo2Title || 'উত্তোলন নিয়ম'}
              </span>
            </div>
          </button>
        </div>

        {/* Additional YouTube Videos & Waz Added from Admin */}
        {Array.isArray(settings.youtubeTutorialsList) && settings.youtubeTutorialsList.filter(v => v.active !== false).length > 0 && (
          <div className="space-y-1.5 pt-1">
            {settings.youtubeTutorialsList
              .filter(v => v.active !== false)
              .map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    if (vid.url && vid.url.trim()) {
                      window.open(vid.url, '_blank');
                    } else {
                      showToast('ভিডিও লিংক এখনো যুক্ত করা হয়নি', 'info');
                    }
                  }}
                  className="w-full p-2.5 px-3.5 rounded-2xl bg-white border border-red-100 shadow-2xs hover:border-red-300 flex items-center justify-between gap-3 text-left transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                      <Play className="w-4 h-4 fill-red-600 ml-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[11px] font-bold text-gray-900 line-clamp-2 leading-tight break-words">{vid.title}</h4>
                      <span className="text-[9px] text-red-600 font-semibold block mt-0.5">ভিডিও দেখুন ও শিখুন</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1">
                    <span>প্লে করুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Sponsored Banner Ad (Configurable from Admin Panel) */}
      <AdDisplay htmlSnippet={settings.bannerAdHtml} type="banner" />

      {/* 7. Quick Services Grid */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <h3 className="font-extrabold text-xs text-gray-600 uppercase tracking-wider flex items-center gap-1">
            <span>দ্রুত মেনু</span>
            <Sparkles className="w-3 h-3 text-emerald-600" />
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Micro Jobs */}
          <button
            onClick={() => setActiveTab('microjobs')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-200 shadow-2xs hover:border-emerald-400 active:scale-95 transition-all cursor-pointer relative"
          >
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full">
              নতুন
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-1">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">মাইক্রো জব</span>
            <span className="text-[9px] text-teal-600 font-semibold">ভিডিও অফার</span>
          </button>

          {/* Tasks */}
          <button
            onClick={() => setActiveTab('tasks')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">টাস্ক</span>
            <span className="text-[9px] text-emerald-600 font-semibold">বিজ্ঞাপন</span>
          </button>

          {/* Withdraw */}
          <button
            onClick={() => setActiveTab('withdraw')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">উত্তোলন</span>
            <span className="text-[9px] text-amber-600 font-semibold">বিকাশ/নগদ</span>
          </button>

          {/* My Team */}
          <button
            onClick={() => setActiveTab('team')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">টিম</span>
            <span className="text-[9px] text-blue-600 font-semibold">রেফারেল</span>
          </button>

          {/* Lucky Spin */}
          <button
            onClick={() => setActiveTab('spin')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">স্পিন</span>
            <span className="text-[9px] text-rose-600 font-semibold">ফ্রি ক্যাশ</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => setActiveTab('leaderboard')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">সেরা তালিকা</span>
            <span className="text-[9px] text-purple-600 font-semibold">টপ ইউজার</span>
          </button>

          {/* Video Ads */}
          <button
            onClick={() => setActiveTab('video-ads')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-1">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">ভিডিও জোন</span>
            <span className="text-[9px] text-red-600 font-semibold">বোনাস</span>
          </button>

          {/* Support */}
          <button
            onClick={onOpenSupport}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">সাপোর্ট</span>
            <span className="text-[9px] text-teal-600 font-semibold">সাহায্য</span>
          </button>

          {/* History */}
          <button
            onClick={() => setActiveTab('history')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white border border-emerald-100 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-1">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">হিস্ট্রি</span>
            <span className="text-[9px] text-gray-500 font-semibold">বিবরণ</span>
          </button>
        </div>
      </div>

      {/* 8. Refer & Earn Banner (Short & Punchy) */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-green-600 text-white p-3.5 shadow-md flex items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 mb-0.5">
            প্রতি রেফারে ৳৫০ নিশ্চিত
          </span>
          <h4 className="font-extrabold text-xs sm:text-sm">বন্ধুদের রেফার করে আয় করুন</h4>
        </div>

        <button
          onClick={handleCopyReferral}
          className="shrink-0 px-3 py-2 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-xs hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5 text-emerald-700" />
          <span>কপি লিংক</span>
        </button>
      </div>

      {/* Sponsored Native Ad (Configurable from Admin Panel) */}
      <AdDisplay htmlSnippet={settings.nativeAdHtml} type="native" />

      {/* 9. Premium Smartlink Tasks */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-extrabold text-xs sm:text-sm text-emerald-950 flex items-center gap-1">
              <span>বিজ্ঞাপন কাজ</span>
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              প্রতি কাজে ৳৫
            </span>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs text-emerald-700 font-bold flex items-center gap-0.5 hover:text-emerald-800 cursor-pointer"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {premiumTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-100">
                  <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 ml-0.5" />
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-xs text-gray-900 truncate">{task.banglaTitle || task.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className="text-emerald-700 font-semibold">১৫ সেকেন্ড</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-600 font-english">+৳৫.০০</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startTask(task)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all flex items-center gap-0.5 shrink-0 cursor-pointer"
              >
                <span>শুরু</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Official Telegram Channel with ৳20 Instant Reward Option */}
      <div className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <Send className="w-4 h-4" />
          </div>
          <div className="truncate text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold block truncate">অফিসিয়াল টেলিগ্রাম চ্যানেল</span>
              <span className="text-[9px] font-black bg-white text-sky-700 px-1.5 py-0.2 rounded-full shrink-0">
                +৳২০ রিওয়ার্ড
              </span>
            </div>
            <span className="text-[10px] text-sky-100 block truncate">জয়েন করে স্ক্রিনশট দিন ও পান নগদ ২০ টাকা</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenSubscribe('telegram')}
            className="px-3 py-1.5 rounded-xl bg-white text-sky-700 hover:bg-sky-50 font-black text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>৳২০ নিন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 11. User Reviews Section */}
      <ReviewsSection />

      {/* Welcome Bonus Modal (Screenshot 2) */}
      <WelcomeBonusModal
        isOpen={showBonusModal}
        onClaim={handleClaimBonus}
        bonusAmount={120}
      />

      {/* Rules Notice Modal (Screenshot 1) */}
      <RulesNoticeModal
        isOpen={showRulesModal}
        onClose={handleCloseRules}
        referralReward={settings.referralReward || 50}
        adReward={settings.adReward || 5}
      />

      {/* Dedicated Channel Subscribe & Instant ৳20 Reward Modal */}
      <ChannelSubscribeModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        defaultChannel={subscribeChannelType}
      />

    </div>
  );
};
