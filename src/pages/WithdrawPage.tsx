import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BkashLogo, NagadLogo } from '../components/Icons';
import { 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  History,
  Users,
  X
} from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const { user, withdrawals, referrals, settings, requestWithdrawal, showToast, setActiveTab } = useApp();

  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 10 preset amounts as mandated in PRD
  const presetAmounts = [1000, 1200, 1500, 2000, 2500, 3000, 5000, 7000, 10000];

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const minAmount = settings.minWithdrawal || 1000;
  const fee = Math.round(currentAmount * (settings.withdrawalFee / 100));
  const netAmount = Math.max(0, currentAmount - fee);

  const minRequiredReferrals = settings.minReferralsRequiredForWithdrawal ?? 20;
  const userReferralsCount = referrals.filter(r => r.referrerUid === user?.uid).length;
  const hasMetReferralCondition = userReferralsCount >= minRequiredReferrals;

  const handlePresetSelect = (amt: number) => {
    setIsCustom(false);
    setSelectedAmount(amt);
  };

  const handleOpenConfirm = () => {
    if (!user) {
      showToast('উত্তোলন করতে প্রথমে লগইন করুন।', 'warning');
      return;
    }
    if (!hasMetReferralCondition) {
      showToast(`মূল শর্ত: টাকা তুলতে সর্বনিম্ন ${minRequiredReferrals} জন রেফার লাগবে! বর্তমানে আছে ${userReferralsCount} জন।`, 'error');
      return;
    }
    if (currentAmount < minAmount) {
      showToast(`সর্বনিম্ন উত্তোলনের পরিমাণ ৳${minAmount}`, 'error');
      return;
    }
    if (user.balance < currentAmount) {
      showToast('আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই।', 'error');
      return;
    }
    if (!accountNumber || accountNumber.trim().length < 11) {
      showToast('সঠিক ১১ ডিজিটের মোবাইল ব্যাংকিং নম্বর লিখুন।', 'error');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmWithdrawal = async () => {
    setIsSubmitting(true);
    const res = await requestWithdrawal(method, accountNumber.trim(), currentAmount);
    setIsSubmitting(false);
    setShowConfirmModal(false);

    if (res.success) {
      showToast('🎉 আপনার উত্তোলন আবেদন জমা হয়েছে! আধা ঘণ্টা থেকে ১ ঘণ্টার মধ্যে কনফার্ম হয়ে পেমেন্ট পৌঁছে যাবে।', 'success');
      setAccountNumber('');
    } else {
      showToast(res.error || 'উত্তোলন ব্যর্থ হয়েছে।', 'error');
    }
  };

  const userWithdrawals = withdrawals.filter(w => w.uid === user?.uid);

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Available Balance Card */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-green-700 text-white p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-emerald-100 font-medium">Available Balance (উত্তোলনযোগ্য ব্যালেন্স)</span>
            <span className="text-[10px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
              ন্যূনতম ৳{minAmount}
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white font-english my-1">
            ৳{user ? user.balance.toFixed(2) : '0.00'}
          </h2>

          <p className="text-[11px] text-emerald-100/90 leading-relaxed mt-2">
            উত্তোলনের আবেদন করার ৩০ মিনিট থেকে ১ ঘণ্টার মধ্যে যাচাই হয়ে বিকাশ বা নগদ নাম্বারে টাকা পাঠিয়ে দেওয়া হবে।
          </p>
        </div>
      </div>

      {/* Critical Referral Requirement Status Card */}
      <div className={`p-4 rounded-3xl border transition-all ${
        hasMetReferralCondition
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : 'bg-amber-50 border-amber-300 text-amber-950'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
              hasMetReferralCondition ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-amber-950'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-xs sm:text-sm">
                  উত্তোলনের মূল শর্ত: সর্বনিম্ন ২০ জন রেফারেল
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  hasMetReferralCondition ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                }`}>
                  {hasMetReferralCondition ? 'শর্ত পূরণ হয়েছে' : 'শর্ত বাকি'}
                </span>
              </div>
              <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                উত্তোলন সক্রিয় করতে আপনার একাউন্টে কমপক্ষে ২০ জন সক্রিয় রেফারেল থাকা আবশ্যক।
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 bg-white/80 rounded-full h-2.5 overflow-hidden border border-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hasMetReferralCondition ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (userReferralsCount / minRequiredReferrals) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold font-english shrink-0">
                  {userReferralsCount}/{minRequiredReferrals} জন
                </span>
              </div>
            </div>
          </div>
          {!hasMetReferralCondition && (
            <button
              onClick={() => setActiveTab('team')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shrink-0 active:scale-95 transition-all shadow-xs"
            >
              রেফার করুন
            </button>
          )}
        </div>
      </div>

      {/* 2. Withdrawal Form */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-xs space-y-4">
        
        {/* Step 1: Select Payment Method */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            ১. পেমেন্ট মেথড নির্বাচন করুন
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* bKash */}
            <button
              type="button"
              onClick={() => setMethod('bKash')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                method === 'bKash'
                  ? 'border-[#E2136E] bg-[#E2136E]/5 ring-2 ring-[#E2136E]/30 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            >
              <BkashLogo className="w-10 h-10 mb-1.5" />
              <span className="text-xs font-bold text-gray-900">বিকাশ (bKash)</span>
            </button>

            {/* Nagad */}
            <button
              type="button"
              onClick={() => setMethod('Nagad')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                method === 'Nagad'
                  ? 'border-[#F7941D] bg-[#F7941D]/5 ring-2 ring-[#F7941D]/30 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            >
              <NagadLogo className="w-10 h-10 mb-1.5" />
              <span className="text-xs font-bold text-gray-900">নগদ (Nagad)</span>
            </button>
          </div>
        </div>

        {/* Step 2: Account Number */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            ২. আপনার {method} একাউন্ট নাম্বার লিখুন
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="017XXXXXXXX বা 018XXXXXXXX"
              maxLength={12}
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-english font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">
            সঠিক ও সক্রিয় পার্সোনাল একাউন্ট নাম্বার প্রদান করুন।
          </span>
        </div>

        {/* Step 3: Preset Amount selection (10 buttons) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-700">
              ৩. উত্তোলনের পরিমাণ নির্বাচন করুন
            </label>
            <span className="text-[10px] text-emerald-700 font-semibold">
              মিনিমাম: ৳১,০০০
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {presetAmounts.map((amt) => {
              const isSelected = !isCustom && selectedAmount === amt;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePresetSelect(amt)}
                  className={`py-2 px-1 rounded-xl text-xs font-extrabold font-english transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs scale-102'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  ৳{amt}
                </button>
              );
            })}

            {/* 10th Button: Custom */}
            <button
              type="button"
              onClick={() => setIsCustom(true)}
              className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                isCustom
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              কাস্টম
            </button>
          </div>

          {/* Custom amount input if selected */}
          {isCustom && (
            <div className="mt-2.5">
              <input
                type="number"
                min={minAmount}
                placeholder={`পরিমাণ লিখুন (সর্বনিম্ন ৳${minAmount})`}
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 text-xs font-english font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Calculation summary */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-1.5">
          <div className="flex justify-between text-gray-600">
            <span>উত্তোলন পরিমাণ:</span>
            <span className="font-bold font-english text-gray-900">৳{currentAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>প্রসেসিং ফি:</span>
            <span className="font-bold font-english text-emerald-700">৳0.00 (ফ্রি)</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-emerald-950 pt-1 border-t border-emerald-200">
            <span>আপনি পাবেন:</span>
            <span className="font-english text-emerald-600">৳{netAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleOpenConfirm}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span>উত্তোলন আবেদন পাঠান</span>
        </button>

      </div>

      {/* 3. Withdrawal History Section */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-emerald-950">আমার উত্তোলন হিস্ট্রি</h3>
          </div>
          <span className="text-xs text-gray-400 font-english">
            {userWithdrawals.length}টি রেকর্ড
          </span>
        </div>

        {userWithdrawals.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            এখনও কোনো উত্তোলনের রেকর্ড নেই।
          </div>
        ) : (
          <div className="space-y-2.5">
            {userWithdrawals.map((item) => {
              const statusMap: Record<string, { label: string; color: string }> = {
                pending: { label: 'পেন্ডিং (অপেক্ষমান)', color: 'bg-amber-100 text-amber-800' },
                processing: { label: 'প্রক্রিয়াধীন', color: 'bg-blue-100 text-blue-800' },
                approved: { label: 'অনুমোদিত', color: 'bg-emerald-100 text-emerald-800' },
                paid: { label: 'সফলভাবে পেইড', color: 'bg-green-100 text-green-800' },
                rejected: { label: 'বাতিল (রিফান্ডেড)', color: 'bg-red-100 text-red-800' }
              };

              const currentStatus = statusMap[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800' };

              return (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      {item.method === 'bKash' ? (
                        <BkashLogo className="w-7 h-7" />
                      ) : (
                        <NagadLogo className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 font-english">
                        {item.method} ({item.accountNumber})
                      </h4>
                      <p className="text-[10px] text-gray-400 font-english">
                        {new Date(item.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-extrabold text-gray-900 font-english">
                      ৳{item.amount.toFixed(2)}
                    </div>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${currentStatus.color}`}>
                      {currentStatus.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">উত্তোলন নিশ্চিতকরণ</h3>
              <p className="text-xs text-gray-500">অনুগ্রহ করে নিচের তথ্যগুলো যাচাই করুন</p>
            </div>

            <div className="bg-emerald-50/70 rounded-2xl p-4 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-gray-500">পেমেন্ট মাধ্যম:</span>
                <span className="font-bold text-gray-900">{method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">একাউন্ট নাম্বার:</span>
                <span className="font-bold font-english text-gray-900">{accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">টাকার পরিমাণ:</span>
                <span className="font-extrabold font-english text-emerald-700 text-sm">৳{currentAmount}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdrawal}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
              >
                {isSubmitting ? 'প্রক্রিয়াধীন...' : 'নিশ্চিত করুন'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
