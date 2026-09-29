import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Zap, 
  ChevronRight, 
  X, 
  Copy, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

export const AccountVerificationBanner: React.FC = () => {
  const { user, settings, showToast, requestPublisherUpgrade } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If Admin hides the banner from Admin Panel, do not render!
  if (settings.showPublisherUpgradeBanner === false) {
    return null;
  }

  // If user is already verified
  if (user?.isVerifiedPublisher) {
    return (
      <div className="p-2.5 px-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
              <span>ভেরিফাইড পার্মানেন্ট পাবলিশার</span>
              <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full">ACTIVE</span>
            </span>
            <span className="text-[10px] text-emerald-700 block">আপনি সকল কাজে ২ গুণ (2X) ডাবল প্রফিট পাচ্ছেন!</span>
          </div>
        </div>
      </div>
    );
  }

  // If verification is already pending review
  if (user?.verificationRequested) {
    return (
      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
          <div>
            <span className="text-xs font-bold text-amber-950">পাবলিশার ভেরিফিকেশন প্রক্রিয়াধীন</span>
            <span className="text-[10px] text-amber-700 block">TrxID: {user.verificationTrxId} (এডমিন রিভিউ চলছে)</span>
          </div>
        </div>
      </div>
    );
  }

  const upgradeFee = settings.publisherUpgradeFee || 30;
  const bkashNumber = settings.publisherUpgradeBkash || '01700000000';
  const nagadNumber = settings.publisherUpgradeNagad || '01800000000';

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    showToast(`নম্বর "${num}" কপি হয়েছে!`, 'success');
  };

  const handleUpgradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      showToast('অনুগ্রহ করে লেনদেনের TrxID প্রদান করুন', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPublisherUpgrade(trxId.trim(), method);
      if (res.success) {
        setShowModal(false);
        showToast('🎉 আপগ্রেড আবেদন সফলভাবে জমা হয়েছে! কিছুক্ষণের মধ্যে ভেরিফাই সম্পন্ন হবে।', 'success');
      } else {
        showToast(res.message || 'আবেদন জমা দিতে সমস্যা হয়েছে', 'error');
      }
    } catch (e: any) {
      showToast('এরর: ' + e.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Alert Banner Above Content */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md border border-amber-400/40 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-100" />
            </div>
            <div className="truncate">
              <span className="text-xs font-extrabold text-white block truncate">
                অ্যাকাউন্ট পার্মানেন্ট পাবলিশার হয়নি!
              </span>
              <span className="text-[10px] text-amber-100 block truncate">
                ভেরিফাইড হলে প্রতিটি কাজে পাবেন <strong>ডাবল প্রফিট (2X)</strong>
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white text-amber-900 text-xs font-black shrink-0 hover:bg-amber-50 active:scale-95 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <span>আপগ্রেড</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Upgrade Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative border border-emerald-100 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-amber-500" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">পার্মানেন্ট পাবলিশার আপগ্রেড</h3>
                  <span className="text-[10px] text-amber-600 font-bold">ভেরিফাইড ব্যাজ ও দ্বিগুণ আয়ের সুযোগ</span>
                </div>
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Benefits List */}
            <div className="space-y-2 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-xs text-gray-700">
              <h4 className="font-extrabold text-[11px] text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>ভেরিফাইড পাবলিশারের প্রিমিয়াম সুবিধাসমূহ:</span>
              </h4>
              <ul className="space-y-1.5 text-[11px] font-semibold text-emerald-900">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>প্রতিটি বিজ্ঞাপনে ৫ টাকার বদলে <strong>১০ টাকা ইনকাম (2X)</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>রিমোট জব ও ভিডিও টাস্কে <strong>ডাবল রিওয়ার্ড</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>উত্তোলন রিকোয়েস্ট অগ্রাধিকার ভিত্তিতে <strong>ইনস্ট্যান্ট পেইড</strong></span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>প্রোফাইলে অফিসিয়াল ভেরিফাইড ব্লু-টিক ব্যাজ</span>
                </li>
              </ul>
            </div>

            {/* Payment Details */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">এককালীন ভেরিফিকেশন ফি:</span>
                <span className="font-black text-emerald-700 text-base font-english">৳{upgradeFee}</span>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-gray-200">
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-600">বিকাশ (Personal):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-english font-bold text-xs">{bkashNumber}</span>
                    <button 
                      onClick={() => copyNumber(bkashNumber)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      title="কপি করুন"
                    >
                      <Copy className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-600">নগদ (Personal):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-english font-bold text-xs">{nagadNumber}</span>
                    <button 
                      onClick={() => copyNumber(nagadNumber)}
                      className="p-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                      title="কপি করুন"
                    >
                      <Copy className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 leading-tight">
                * Send Money করার পর ফিরতি মেসেজের <strong>TrxID</strong> নিচে লিখে সাবমিট করুন।
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleUpgradeSubmit} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">পেমেন্ট মেথড:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bKash')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      method === 'bKash' ? 'bg-pink-50 border-pink-500 text-pink-700 font-black' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    বিকাশ (bKash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('Nagad')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      method === 'Nagad' ? 'bg-orange-50 border-orange-500 text-orange-700 font-black' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    নগদ (Nagad)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">ট্রানজেকশন আইডি (TrxID):</label>
                <input 
                  type="text" 
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                  placeholder="যেমন: 9J82KL09MN" 
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-english font-bold uppercase" 
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'আবেদন পাঠানো হচ্ছে...' : 'ভেরিফিকেশনের আবেদন সাবমিট করুন'}</span>
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
