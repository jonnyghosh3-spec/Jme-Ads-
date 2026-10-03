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
  Send,
  Lock,
  Wallet
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
      <div className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <span>ভেরিফাইড পার্মানেন্ট পাবলিশার</span>
              <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">ACTIVE</span>
            </span>
            <span className="text-[11px] text-emerald-700 block">উত্তোলন সক্রিয় রয়েছে ও প্রতিটি কাজে ২ গুণ (2X) ডাবল প্রফিট পাচ্ছেন!</span>
          </div>
        </div>
      </div>
    );
  }

  // If verification is already pending review
  if (user?.verificationRequested) {
    return (
      <div className="p-3.5 px-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 animate-spin" />
          <div>
            <span className="text-xs font-bold text-amber-950 block">৫০ টাকা সিকিউরিটি ভেরিফিকেশন প্রক্রিয়াধীন</span>
            <span className="text-[11px] text-amber-700 block font-english font-mono">
              TrxID: {user.verificationTrxId} (এডমিন রিভিউ চলছে)
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-1 rounded-lg shrink-0">
          পেন্ডিং
        </span>
      </div>
    );
  }

  // "সেটা আগে যেন না দেয় টাকা কমপ্লিট হওয়ার পর এতগুলো তারপর আসবে বড় করে"
  // Budget threshold between 500 and 1000 Tk (default 500 Tk)
  const verificationThreshold = user?.verificationThreshold || settings.minBalanceForVerification || 500;
  if (!user || user.balance < verificationThreshold) {
    // Hidden before balance reaches budget (500-1000 Tk)!
    return null;
  }

  const upgradeFee = settings.publisherUpgradeFee || 50;
  const bkashNumber = settings.publisherUpgradeBkash || '01722169178';
  const isNagadActive = settings.isNagadActive === true;
  const nagadNumber = settings.publisherUpgradeNagad || 'আপাতত বন্ধ / পেন্ডিং';

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
        showToast('🎉 ৫০ টাকা ভেরিফিকেশন আবেদন সফলভাবে জমা হয়েছে! কিছুক্ষণের মধ্যে কনফার্ম হয়ে উত্তোলন সক্রিয় হবে।', 'success');
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
      {/* Big, Prominent Security Verification Banner (Appears only after 500-1000 Tk completed) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white shadow-xl border-2 border-amber-300/40 relative overflow-hidden space-y-3 animate-in fade-in duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white text-orange-700 shadow-xs">
                  টাকা তোলার আবশ্যিক শর্ত
                </span>
                <span className="text-[11px] font-bold text-amber-100 font-english">
                  ব্যালেন্স: ৳{user.balance.toFixed(2)}
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white mt-1">
                উত্তোলন সক্রিয় করতে ৫০ টাকা দিয়ে অ্যাকাউন্ট ভেরিফাই করুন
              </h3>
              <p className="text-xs text-amber-100 leading-relaxed mt-1">
                আপনার ব্যালেন্স ৫০০-১০০০ টাকার বাজেট পূরণ করেছে। উত্তোলন সম্পন্ন করতে এককালীন ৫০ টাকা সিকিউরিটি ভেরিফিকেশন ফি প্রদান করা বাধ্যতামূলক, অন্যথায় টাকা পাবেন না।
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/20">
          <span className="text-xs font-bold text-amber-100 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>ফি: মাত্র ৳{upgradeFee} (এককালীন)</span>
          </span>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-orange-950 font-black text-xs shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>এখনই ৫০ টাকা ভেরিফাই করুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative border border-emerald-100 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">৫০ টাকা সিকিউরিটি ভেরিফিকেশন</h3>
                  <span className="text-[10px] text-amber-600 font-bold">উত্তোলন অনুমোদন ও পার্মানেন্ট আইডি অ্যাক্টিভেশন</span>
                </div>
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why Verification Note */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1 text-[11px] text-amber-900">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>কেন এই ৫০ টাকা ভেরিফিকেশন প্রয়োজন?</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                ভুয়া অ্যাকাউন্ট ও অটোমেশন বট রোধে ৫০০-১০০০ টাকা অর্জনের পর এককালীন ৫০ টাকা প্রদান করে অ্যাকাউন্ট ভেরিফাই করতে হবে। ভেরিফাই সম্পন্ন হওয়ার পর আপনি সরাসরি বিকাশ/নগদে টাকা তুলতে পারবেন।
              </p>
            </div>

            {/* Payment Details */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">ভেরিফিকেশন ফি:</span>
                <span className="font-black text-emerald-700 text-base font-english">৳{upgradeFee} (৫০ টাকা)</span>
              </div>

              <div className="space-y-2 pt-1 border-t border-gray-200">
                {/* bKash */}
                <div className="flex items-center justify-between bg-pink-50/60 p-2.5 rounded-xl border border-pink-200">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-600 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-gray-800">বিকাশ Personal:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-english font-black text-xs text-pink-700">{bkashNumber}</span>
                    <button 
                      onClick={() => copyNumber(bkashNumber)}
                      className="p-1 rounded bg-pink-100 hover:bg-pink-200 text-pink-800 cursor-pointer"
                      title="কপি করুন"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nagad */}
                <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="text-[11px] font-bold text-gray-500">নগদ Personal:</span>
                  <div className="flex items-center gap-1.5">
                    {isNagadActive ? (
                      <>
                        <span className="font-english font-bold text-xs">{nagadNumber}</span>
                        <button 
                          onClick={() => copyNumber(nagadNumber)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                          title="কপি করুন"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-md">
                        আপাতত বন্ধ / পেন্ডিং
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-500 leading-tight">
                * বিকাশ Personal নম্বরে ৫০ টাকা Send Money করে ফিরতি SMS থেকে <strong>TrxID</strong> নিচে লিখে সাবমিট করুন।
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleUpgradeSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">পেমেন্ট মেথড:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bKash')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      method === 'bKash' ? 'bg-pink-50 border-pink-500 text-pink-700 font-black shadow-xs' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    বিকাশ (bKash) • সক্রিয়
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isNagadActive) {
                        showToast('নগদ পেমেন্ট বর্তমানে সাময়িকভাবে বন্ধ আছে। বিকাশ নম্বর ব্যবহার করুন।', 'warning');
                        return;
                      }
                      setMethod('Nagad');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      !isNagadActive 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : method === 'Nagad' 
                        ? 'bg-orange-50 border-orange-500 text-orange-700 font-black shadow-xs cursor-pointer' 
                        : 'border-gray-200 text-gray-600 cursor-pointer'
                    }`}
                  >
                    নগদ {isNagadActive ? '(Nagad)' : '(পেন্ডিং)'}
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
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-english font-bold uppercase focus:border-amber-500 focus:outline-none" 
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : '৫০ টাকা ভেরিফিকেশন রিকোয়েস্ট পাঠান'}</span>
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
