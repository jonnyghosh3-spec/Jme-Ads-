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
  ShieldAlert,
  History,
  Users,
  X,
  Copy,
  Send,
  Lock
} from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const { user, withdrawals, referrals, settings, requestWithdrawal, requestPublisherUpgrade, showToast, setActiveTab } = useApp();

  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityTrxId, setSecurityTrxId] = useState('');
  const [securityMethod, setSecurityMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [isSubmittingSecurity, setIsSubmittingSecurity] = useState(false);

  // 10 preset amounts as mandated in PRD
  const presetAmounts = [1000, 1200, 1500, 2000, 2500, 3000, 5000, 7000, 10000];

  const currentAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const minAmount = settings.minWithdrawal || 1000;
  const fee = Math.round(currentAmount * (settings.withdrawalFee / 100));
  const netAmount = Math.max(0, currentAmount - fee);

  const minRequiredReferrals = settings.minReferralsRequiredForWithdrawal ?? 20;
  const userReferralsCount = referrals.filter(r => r.referrerUid === user?.uid).length;
  const hasMetReferralCondition = userReferralsCount >= minRequiredReferrals;

  const verificationThreshold = user?.verificationThreshold || settings.minBalanceForVerification || 500;
  const isSecurityRequired = Boolean(user && user.balance >= verificationThreshold && !user.isVerifiedPublisher && !user.isSecurityVerified);

  const upgradeFee = settings.publisherUpgradeFee || 50;
  const bkashNumber = settings.publisherUpgradeBkash || '01722169178';
  const isNagadActive = settings.isNagadActive === true;
  const nagadNumber = settings.publisherUpgradeNagad || 'আপাতত বন্ধ / পেন্ডিং';

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    showToast(`নম্বর "${num}" কপি হয়েছে!`, 'success');
  };

  const handlePresetSelect = (amt: number) => {
    setIsCustom(false);
    setSelectedAmount(amt);
  };

  const handleOpenConfirm = () => {
    if (!user) {
      showToast('উত্তোলন করতে প্রথমে লগইন করুন।', 'warning');
      return;
    }
    // 50 Tk Security Verification check when balance reaches 500-1000 Tk
    if (isSecurityRequired) {
      showToast('টাকা তোলার পূর্বে ৫০ টাকা দিয়ে অ্যাকাউন্ট সিকিউরিটি ভেরিফিকেশন সম্পন্ন করতে হবে!', 'error');
      setShowSecurityModal(true);
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

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityTrxId.trim()) {
      showToast('অনুগ্রহ করে লেনদেনের TrxID প্রদান করুন', 'warning');
      return;
    }
    setIsSubmittingSecurity(true);
    try {
      const res = await requestPublisherUpgrade(securityTrxId.trim(), securityMethod);
      if (res.success) {
        setShowSecurityModal(false);
        showToast('🎉 ৫০ টাকা ভেরিফিকেশন আবেদন জমা হয়েছে! এডমিন কনফার্ম করলেই উত্তোলন সক্রিয় হবে।', 'success');
      } else {
        showToast(res.message || 'ভেরিফিকেশন জমা দিতে সমস্যা হয়েছে', 'error');
      }
    } catch (e: any) {
      showToast('এরর: ' + e.message, 'error');
    } finally {
      setIsSubmittingSecurity(false);
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

      {/* Mandatory 50 Tk Security Verification Requirement Banner */}
      {isSecurityRequired && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 text-white shadow-xl border-2 border-amber-300/40 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 border border-white/30 shadow-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white text-orange-900 shadow-xs">
                  টাকা তোলার আবশ্যিক শর্ত
                </span>
                <span className="text-[11px] font-bold text-amber-100">৫০ টাকা ভেরিফিকেশন</span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white mt-1">
                উত্তোলন করতে ৫০ টাকা দিয়ে অ্যাকাউন্ট ভেরিফাই করুন
              </h3>
              <p className="text-xs text-amber-100 leading-relaxed mt-1">
                আপনার ব্যালেন্স ৫০০ টাকার বাজেট অতিক্রম করেছে। ভুয়া অ্যাকাউন্ট ও প্রতারণা রোধে উত্তোলন সক্রিয় করতে এককালীন ৫০ টাকা সিকিউরিটি ভেরিফিকেশন ফি প্রদান আবশ্যক, অন্যথায় টাকা তুলতে পারবেন না।
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/20">
            <span className="text-xs font-bold text-amber-100 flex items-center gap-1 font-english">
              <Lock className="w-3.5 h-3.5" />
              <span>ভেরিফিকেশন ফি: ৳{upgradeFee} (৫০ টাকা)</span>
            </span>

            <button
              onClick={() => setShowSecurityModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-amber-50 text-orange-950 font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              এখনই ৫০ টাকা ভেরিফাই করুন
            </button>
          </div>
        </div>
      )}

      {/* 20-Referral Requirement Milestone Card (Clean, Modern, Professional) */}
      <div className={`p-4 rounded-3xl border transition-all ${
        hasMetReferralCondition
          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
          : 'bg-slate-900 border-slate-800 text-white shadow-md'
      }`}>
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              hasMetReferralCondition ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm">
                রেফারেল ভেরিফিকেশন অগ্রগতি
              </h4>
              <span className={`text-[10px] block ${hasMetReferralCondition ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                উত্তোলনের নিয়ম: ২০ জন সক্রিয় মেম্বার
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full font-english ${
              hasMetReferralCondition 
                ? 'bg-emerald-600 text-white' 
                : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
            }`}>
              {hasMetReferralCondition ? '✓ শর্ত সম্পন্ন' : `${userReferralsCount}/${minRequiredReferrals} জন`}
            </span>
          </div>
        </div>

        {/* Progress Bar & Clean Action Strip */}
        <div className="pt-2.5 space-y-2">
          <div className={`w-full rounded-full h-2 overflow-hidden border ${hasMetReferralCondition ? 'bg-emerald-200 border-emerald-300' : 'bg-slate-800 border-slate-700/60'}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hasMetReferralCondition 
                  ? 'bg-emerald-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, (userReferralsCount / minRequiredReferrals) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className={`leading-tight ${hasMetReferralCondition ? 'text-emerald-800 font-medium' : 'text-slate-300'}`}>
              {hasMetReferralCondition 
                ? 'আপনার ২০ জন রেফারেল সম্পন্ন হয়েছে। এখন নির্দ্বিধায় উত্তোলন করতে পারবেন।' 
                : `আর মাত্র ${Math.max(0, minRequiredReferrals - userReferralsCount)} জন রেফারেল বাকি আছে`}
            </span>

            {!hasMetReferralCondition && (
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer active:scale-95 transition-all shadow-xs"
              >
                রেফার করুন
              </button>
            )}
          </div>
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

      {/* 50 Tk Security Verification Modal */}
      {showSecurityModal && (
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
                onClick={() => setShowSecurityModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why Verification Note */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1 text-[11px] text-amber-900">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>উত্তোলনের আবশ্যিক শর্ত:</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                আপনার ব্যালেন্স ৫০০ টাকার বাজেট অতিক্রম করায় প্রতারণা ও রোবট রোধে এককালীন ৫০ টাকা ফি প্রদান করে অ্যাকাউন্ট ভেরিফাই করতে হবে। অন্যথায় টাকা তুলতে পারবেন না।
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
            <form onSubmit={handleSecuritySubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">পেমেন্ট মেথড:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSecurityMethod('bKash')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      securityMethod === 'bKash' ? 'bg-pink-50 border-pink-500 text-pink-700 font-black shadow-xs' : 'border-gray-200 text-gray-600'
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
                      setSecurityMethod('Nagad');
                    }}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      !isNagadActive 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : securityMethod === 'Nagad' 
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
                  value={securityTrxId}
                  onChange={(e) => setSecurityTrxId(e.target.value.toUpperCase())}
                  placeholder="যেমন: 9J82KL09MN" 
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-english font-bold uppercase focus:border-amber-500 focus:outline-none" 
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingSecurity}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingSecurity ? 'যাচাই করা হচ্ছে...' : '৫০ টাকা ভেরিফিকেশন রিকোয়েস্ট পাঠান'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
