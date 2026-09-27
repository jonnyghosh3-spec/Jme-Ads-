import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  Gift, 
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    loginWithEmail, 
    registerWithEmail, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone for login
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Check URL query param (?ref=CODE) or pathname (/ref/CODE) for dynamic referral code
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const queryRef = searchParams.get('ref');
    if (queryRef && queryRef.trim() !== '') {
      const cleanCode = queryRef.trim().toUpperCase();
      setReferralCode(cleanCode);
      setMode('register');
      localStorage.setItem('jmeads_saved_ref', cleanCode);
      return;
    }

    const path = window.location.pathname;
    if (path.includes('/ref/')) {
      const code = path.split('/ref/')[1]?.split('/')[0];
      if (code && code.trim() !== '') {
        const cleanCode = code.trim().toUpperCase();
        setReferralCode(cleanCode);
        setMode('register');
        localStorage.setItem('jmeads_saved_ref', cleanCode);
        return;
      }
    }

    const savedRef = localStorage.getItem('jmeads_saved_ref');
    if (savedRef) {
      setReferralCode(savedRef);
    }
  }, []);

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setAuthError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    if (mode === 'register') {
      if (!name.trim() || !registerEmail.trim() || !phone.trim() || !password) {
        const msg = 'অনুগ্রহ করে সবগুলো তথ্য সঠিকভাবে পূরণ করুন।';
        setAuthError(msg);
        showToast(msg, 'error');
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        const msg = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।';
        setAuthError(msg);
        showToast(msg, 'error');
        setIsLoading(false);
        return;
      }

      const res = await registerWithEmail(
        name.trim(), 
        registerEmail.trim(), 
        password, 
        phone.trim(), 
        referralCode.trim() || undefined
      );

      if (!res.success) {
        setAuthError(res.message || 'নিবন্ধন সম্পন্ন করা সম্ভব হয়নি।');
      }
    } else {
      if (!identifier.trim() || !password) {
        const msg = 'ইমেইল/মোবাইল নম্বর ও পাসওয়ার্ড প্রদান করুন।';
        setAuthError(msg);
        showToast(msg, 'error');
        setIsLoading(false);
        return;
      }

      const res = await loginWithEmail(identifier.trim(), password);
      if (!res.success) {
        setAuthError(res.message || 'ভুল ইমেইল/ফোন অথবা পাসওয়ার্ড দেওয়া হয়েছে!');
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-4">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-english">
                JME<span className="text-emerald-400">Ads</span>
              </h1>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-emerald-300 border border-emerald-500/30">
                BD
              </span>
            </div>
            <p className="text-xs text-emerald-200 font-medium">
              বাংলাদেশের বিশ্বস্ত ও নির্ভরযোগ্য আর্নিং প্ল্যাটফর্ম
            </p>
          </div>

          {/* Social Proof badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>৫০,০০০+ সক্রিয় ইউজার • বিকাশ ও নগদে পেমেন্ট</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-emerald-100 p-6 shadow-2xl space-y-4">
          
          {/* Mode Tabs */}
          <div className="flex bg-emerald-50/80 p-1 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-950 hover:text-emerald-700'
              }`}
            >
              লগইন করুন
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('register')}
              className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-emerald-950 hover:text-emerald-700'
              }`}
            >
              নতুন একাউন্ট খুলুন
            </button>
          </div>

          {/* High-Visibility Error Banner */}
          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold leading-relaxed">
                {authError}
              </div>
            </div>
          )}

          {referralCode && mode === 'register' && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  রেফারেল কোড: <strong className="font-english font-bold text-emerald-800">{referralCode}</strong> সক্রিয়!
                </span>
              </div>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                বোনাস নিশ্চিত
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">আপনার পূর্ণ নাম</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ সাকিব আহমেদ"
                      value={name}
                      onChange={e => { setName(e.target.value); setAuthError(null); }}
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">মোবাইল নম্বর (বিকাশ/নগদ)</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      maxLength={11}
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setAuthError(null); }}
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল ঠিকানা</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={registerEmail}
                      onChange={e => { setRegisterEmail(e.target.value); setAuthError(null); }}
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">ইমেইল অথবা মোবাইল নম্বর</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX অথবা yourname@gmail.com"
                    value={identifier}
                    onChange={e => { setIdentifier(e.target.value); setAuthError(null); }}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setAuthError(null); }}
                  className="w-full px-3.5 py-2.5 pl-9 pr-10 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer transition-colors"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">রেফারেল কোড (ঐচ্ছিক)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="JME8X7K2"
                    value={referralCode}
                    onChange={e => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-gray-200 text-xs font-english focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                  />
                  <Gift className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'অনুগ্রহ করে অপেক্ষা করুন...' : mode === 'login' ? 'লগইন করুন' : 'নিবন্ধন সম্পন্ন করুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Helper Text */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-[11px] text-gray-500">
                অ্যাকাউন্ট নেই?{' '}
                <button 
                  type="button" 
                  onClick={() => handleModeChange('register')} 
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  নতুন অ্যাকাউন্ট খুলুন
                </button>
              </p>
            ) : (
              <p className="text-[11px] text-gray-500">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button 
                  type="button" 
                  onClick={() => handleModeChange('login')} 
                  className="text-emerald-700 font-bold hover:underline cursor-pointer"
                >
                  এখানে লগইন করুন
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
