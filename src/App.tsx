import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TaskVerificationModal } from './components/TaskVerificationModal';
import { SupportModal } from './components/SupportModal';
import { AuthModal } from './components/AuthModal';
import { LivePayoutTicker } from './components/LivePayoutTicker';
import { ErrorBoundary } from './components/ErrorBoundary';

import { HomePage } from './pages/HomePage';
import { TasksPage } from './pages/TasksPage';
import { TeamPage } from './pages/TeamPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { AccountPage } from './pages/AccountPage';
import { SpinPage } from './pages/SpinPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { VideoAdsPage } from './pages/VideoAdsPage';
import { MicroJobsPage } from './pages/MicroJobsPage';
import { RemoteJobDetailsPage } from './pages/RemoteJobDetailsPage';
import { MicroJobModal } from './components/MicroJobModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { 
  PrivacyPolicyPage, 
  TermsPage, 
  AboutUsPage, 
  ContactUsPage,
  DisclaimerPage,
  CookiePolicyPage,
  PublisherGuidePage
} from './pages/PolicyPages';
import { AccountVerificationBanner } from './components/AccountVerificationBanner';

import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    toast, 
    closeToast, 
    notifications,
    showAdminModal,
    setShowAdminModal,
    selectedJobForDetails,
    setSelectedJobForDetails,
    settings
  } = useApp();
  const [showSupport, setShowSupport] = useState(false);

  // Request browser push notification permission a short while after entering the app
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const timer = setTimeout(() => {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              try {
                new Notification('JME Ads বিজ্ঞপ্তি চালু হয়েছে!', {
                  body: 'নতুন বিজ্ঞাপন ও পেমেন্ট আপডেট এখন সরাসরি আপনার ডিভাইসে পাবেন।',
                  icon: 'https://i.supaimg.com/88cac59e-85c9-44fa-970b-faf486de12c5/cfd4da92-da3f-4f1a-b3dd-bcb09a3ba09a.png'
                });
              } catch (e) {
                console.warn('Browser notification error:', e);
              }
            }
          });
        }
      }, 15000); // 15 seconds after entering
      return () => clearTimeout(timer);
    }
  }, []);

  // AdSense Integration - Inject verification script into head if enabled
  useEffect(() => {
    if (settings.enableAdSense && settings.googleAdSenseCode) {
      const existing = document.getElementById('adsense-custom-script');
      if (!existing) {
        const container = document.createElement('div');
        container.id = 'adsense-custom-script';
        container.innerHTML = settings.googleAdSenseCode;
        const script = container.querySelector('script');
        if (script) {
          const s = document.createElement('script');
          Array.from(script.attributes).forEach(attr => s.setAttribute(attr.name, attr.value));
          s.innerHTML = script.innerHTML;
          document.head.appendChild(s);
        }
      }
    }
  }, [settings.enableAdSense, settings.googleAdSenseCode]);

  return (
    <>
      {!user ? (
        <AuthModal />
      ) : (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-200">
          {/* Top Navbar */}
          <Header onOpenSupport={() => setShowSupport(true)} />

          {/* Main View Container */}
          <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 space-y-3">
            {/* Dedicated Remote Job Details Page when a job is clicked */}
            {selectedJobForDetails ? (
              <RemoteJobDetailsPage 
                job={selectedJobForDetails} 
                onBack={() => setSelectedJobForDetails(null)} 
              />
            ) : (
              <>
                {/* Account Verification & 2X Profit Alert (Admin Toggleable) */}
                {(activeTab === 'home' || activeTab === 'tasks') && <AccountVerificationBanner />}

                {activeTab === 'home' && <HomePage onOpenSupport={() => setShowSupport(true)} />}
                {activeTab === 'tasks' && <TasksPage />}
                {activeTab === 'team' && <TeamPage />}
                {activeTab === 'withdraw' && <WithdrawPage />}
                {activeTab === 'account' && <AccountPage onOpenSupport={() => setShowSupport(true)} />}
                {activeTab === 'spin' && <SpinPage />}
                {activeTab === 'leaderboard' && <LeaderboardPage />}
                {activeTab === 'history' && <HistoryPage />}
                {activeTab === 'notifications' && <NotificationsPage />}
                {activeTab === 'video-ads' && <VideoAdsPage />}
                {activeTab === 'microjobs' && <MicroJobsPage />}
                {activeTab === 'privacy' && <PrivacyPolicyPage />}
                {activeTab === 'terms' && <TermsPage />}
                {activeTab === 'disclaimer' && <DisclaimerPage />}
                {activeTab === 'cookies' && <CookiePolicyPage />}
                {activeTab === 'guide' && <PublisherGuidePage />}
                {activeTab === 'about' && <AboutUsPage />}
                {activeTab === 'contact' && <ContactUsPage />}
              </>
            )}

            {/* Google AdSense Compliant Footer */}
            <footer className="py-5 text-center border-t border-gray-200/60 text-[10px] text-gray-500 space-y-2 pb-24">
              <div className="flex items-center justify-center gap-2 font-bold flex-wrap text-emerald-800">
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('privacy'); }} className="hover:underline cursor-pointer">Privacy Policy</button>
                <span>•</span>
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('terms'); }} className="hover:underline cursor-pointer">Terms & Conditions</button>
                <span>•</span>
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('disclaimer'); }} className="hover:underline cursor-pointer">Disclaimer</button>
                <span>•</span>
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('cookies'); }} className="hover:underline cursor-pointer">Cookie Policy</button>
                <span>•</span>
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('guide'); }} className="hover:underline cursor-pointer text-emerald-600">Publisher Guide</button>
                <span>•</span>
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('about'); }} className="hover:underline cursor-pointer">About Us</button>
                <span>•</span>
                <button onClick={() => { setSelectedJobForDetails(null); setActiveTab('contact'); }} className="hover:underline cursor-pointer">Contact Us</button>
              </div>
              <p className="text-[10px] text-gray-400">© 2026 JME Ads Network. All Rights Reserved. Google AdSense & Publisher Policy Compliant.</p>
            </footer>
          </main>

          {/* Fixed Bottom Navigation */}
          <BottomNav onOpenSupport={() => setShowSupport(true)} />

          {/* Task 15s Countdown Overlay & Fraud Prevention Alert */}
          <TaskVerificationModal />

          {/* Micro Job Live Countdown Modal */}
          <MicroJobModal />

          {/* Customer Support Modal */}
          <SupportModal 
            isOpen={showSupport} 
            onClose={() => setShowSupport(false)} 
          />

          {/* Master Admin Panel Modal */}
          <AdminPanelModal 
            isOpen={showAdminModal} 
            onClose={() => setShowAdminModal(false)} 
          />

          {/* Live Payout Ticker (5 automatic withdrawal messages per minute with progress animation) */}
          {settings.showLivePayoutTicker !== false && <LivePayoutTicker />}
        </div>
      )}

      {/* Floating Global Toast Notification with Animated Shrinking Progress Line */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-in slide-in-from-top duration-300">
          <div className={`relative overflow-hidden p-3.5 pb-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 ${
            toast.type === 'success' ? 'bg-emerald-950 text-white border-emerald-700/80 shadow-emerald-950/40' :
            toast.type === 'error' ? 'bg-rose-950 text-white border-rose-700/80 shadow-rose-950/40' :
            toast.type === 'warning' ? 'bg-amber-950 text-white border-amber-700/80 shadow-amber-950/40' :
            'bg-slate-950 text-white border-slate-700/80 shadow-slate-950/40'
          }`}>
            <div className="flex items-center gap-2.5 text-xs font-semibold pr-2">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span className="leading-snug">{toast.message}</span>
            </div>

            <button 
              onClick={closeToast}
              className="p-1 text-white/70 hover:text-white rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Smooth animated line at the bottom that shrinks from 100% to 0% */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 overflow-hidden">
              <div 
                className={`h-full animate-toast-progress ${
                  toast.type === 'success' ? 'bg-emerald-400' :
                  toast.type === 'error' ? 'bg-rose-400' :
                  toast.type === 'warning' ? 'bg-amber-400' :
                  'bg-sky-400'
                }`}
                onAnimationEnd={closeToast}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
