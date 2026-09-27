import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Copy, 
  LogOut, 
  Edit3, 
  ShieldCheck, 
  ChevronRight, 
  Wallet, 
  CheckSquare, 
  Users, 
  Trophy, 
  Gift, 
  Video, 
  Headphones, 
  History, 
  Sparkles,
  X,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

export const AccountPage: React.FC<{ onOpenSupport: () => void }> = ({ onOpenSupport }) => {
  const { user, logout, setActiveTab, showToast } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  const copyRefCode = () => {
    if (!user) return;
    navigator.clipboard.writeText(user.referralCode);
    showToast(`রেফারেল কোড "${user.referralCode}" কপি হয়েছে!`, 'success');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    user.name = editName.trim();
    user.phone = editPhone.trim();
    setShowEditModal(false);
    showToast('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!', 'success');
  };

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Profile Header Card (Matching reference Adosh ID card design) */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-xs text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-emerald-600/30 mb-2 border-2 border-white">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 className="text-lg font-black text-emerald-950">
            {user ? user.name : 'ব্যবহারকারী'}
          </h2>

          <div className="flex items-center justify-center gap-1.5 mt-0.5 text-xs text-gray-500">
            <span className="font-english text-[11px]">UID: {user?.uid.slice(0, 10)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Active Now
            </span>
          </div>

          {/* Referral Code Box with Copy */}
          <div className="my-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 font-bold uppercase">My Referral Code:</span>
            <span className="font-black font-english text-emerald-950 text-xs tracking-wider">
              {user?.referralCode || 'JME8X7K2'}
            </span>
            <button 
              onClick={copyRefCode}
              className="p-1 rounded-md hover:bg-emerald-200/60 text-emerald-800 transition-colors"
              title="কপি করুন"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <button
              onClick={() => {
                setEditName(user?.name || '');
                setEditPhone(user?.phone || '');
                setShowEditModal(true);
              }}
              className="px-4 py-1.5 rounded-xl border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50 active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>EDIT PROFILE INFO</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Account Summary (4 Cards) */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs">
        <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-2.5">
          Account Summary
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-semibold block">বর্তমান ব্যালেন্স</span>
            <span className="text-base font-black font-english text-emerald-950">
              ৳{user ? user.balance.toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-semibold block">মোট আয় (Total)</span>
            <span className="text-base font-black font-english text-emerald-950">
              ৳{user ? user.totalEarned.toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-semibold block">মোট উত্তোলন</span>
            <span className="text-base font-black font-english text-emerald-950">
              ৳{user ? user.totalWithdrawn.toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] text-emerald-700 font-semibold block">রেফারেল থেকে আয়</span>
            <span className="text-base font-black font-english text-emerald-950">
              ৳{user ? user.referralEarned.toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Account Services (8 Quick Cards matching reference) */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs">
        <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-2.5">
          Account Services
        </h3>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">টাস্ক</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">উত্তোলন</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">টিম</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">র‍্যাংক</span>
          </button>

          <button
            onClick={() => setActiveTab('spin')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-1">
              <Gift className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">স্পিন</span>
          </button>

          <button
            onClick={() => setActiveTab('video-ads')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-1">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">ভিডিও এড</span>
          </button>

          <button
            onClick={onOpenSupport}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-1">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">সাপোর্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center mb-1">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-gray-800">হোম</span>
          </button>
        </div>
      </div>

      {/* 4. History & Records Links (Matching reference) */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs space-y-1">
        <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-2">
          History & Records
        </h3>

        <button
          onClick={() => setActiveTab('history')}
          className="w-full p-3 rounded-2xl hover:bg-emerald-50/50 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">Income History</h4>
              <p className="text-[10px] text-gray-400">View daily task earnings</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('withdraw')}
          className="w-full p-3 rounded-2xl hover:bg-emerald-50/50 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">Withdraw History</h4>
              <p className="text-[10px] text-gray-400">View your payout records</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className="w-full p-3 rounded-2xl hover:bg-emerald-50/50 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">Referral History</h4>
              <p className="text-[10px] text-gray-400">View invited friends</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* 5. Logout Button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3.5 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-extrabold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট করুন</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-emerald-950 mb-3">
              প্রোফাইল তথ্য পরিবর্তন
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">মোবাইল নাম্বার</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
