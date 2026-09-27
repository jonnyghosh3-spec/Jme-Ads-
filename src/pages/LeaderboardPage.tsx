import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, ArrowLeft, Users, Crown, Flame } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { setActiveTab, user } = useApp();
  const [tab, setTab] = useState<'earners' | 'referrers'>('earners');

  const topEarners = [
    { rank: 1, name: 'আদনান হাবিব', phone: '017****4521', amount: 18450, tag: 'গোল্ড আর্নার' },
    { rank: 2, name: 'জনি ঘোষ', phone: '018****9988', amount: 15200, tag: 'সিলভার' },
    { rank: 3, name: 'রাকিব আহমেদ', phone: '019****1122', amount: 12850, tag: 'ব্রোঞ্জ' },
    { rank: 4, name: 'সাকিব হোসাইন', phone: '016****3344', amount: 9600 },
    { rank: 5, name: 'মিজানুর রহমান', phone: '017****7049', amount: 8400 },
    { rank: 6, name: 'নয়ন হোসেন', phone: '018****6527', amount: 7200 },
    { rank: 7, name: 'আকাশ আহমেদ', phone: '015****8899', amount: 6500 },
    { rank: 8, name: 'নাজমুল হাসান', phone: '017****4455', amount: 5900 },
    { rank: 9, name: 'ফাহিম রহমান', phone: '019****7788', amount: 5200 },
    { rank: 10, name: 'ইমরান খান', phone: '018****3322', amount: 4800 },
  ];

  const topReferrers = [
    { rank: 1, name: 'তানভীর ইসলাম', phone: '017****8899', count: 142, amount: 7100 },
    { rank: 2, name: 'রিফাত হোসেন', phone: '018****2211', count: 118, amount: 5900 },
    { rank: 3, name: 'শামীম রেজা', phone: '019****6677', count: 95, amount: 4750 },
    { rank: 4, name: 'মেহেদী হাসান', phone: '016****4433', count: 74, amount: 3700 },
    { rank: 5, name: 'সৈকত আলী', phone: '017****9900', count: 62, amount: 3100 },
  ];

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-lg text-emerald-950">সেরা ব্যবহারকারী (র‍্যাংকিং)</h2>
      </div>

      {/* Tab switch */}
      <div className="flex bg-white p-1 rounded-2xl border border-emerald-100 shadow-2xs text-xs font-semibold">
        <button
          onClick={() => setTab('earners')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'earners' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>টপ আর্নার</span>
        </button>
        <button
          onClick={() => setTab('referrers')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            tab === 'referrers' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>টপ রেফারার</span>
        </button>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 pt-4 items-end">
        {/* #2 Silver */}
        <div className="bg-white rounded-3xl p-3 border border-emerald-100 text-center shadow-xs flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm mb-1 border border-slate-300">
            🥈 #2
          </div>
          <span className="font-bold text-xs text-gray-900 truncate w-full">
            {tab === 'earners' ? topEarners[1].name : topReferrers[1].name}
          </span>
          <span className="text-[11px] font-black font-english text-emerald-700 mt-1">
            ৳{tab === 'earners' ? topEarners[1].amount : topReferrers[1].amount}
          </span>
        </div>

        {/* #1 Gold (Taller) */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-3.5 border-2 border-amber-300 text-center shadow-md flex flex-col items-center -mt-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-base mb-1 shadow-sm">
            👑 #1
          </div>
          <span className="font-black text-xs text-gray-900 truncate w-full">
            {tab === 'earners' ? topEarners[0].name : topReferrers[0].name}
          </span>
          <span className="text-xs font-black font-english text-amber-700 mt-1">
            ৳{tab === 'earners' ? topEarners[0].amount : topReferrers[0].amount}
          </span>
        </div>

        {/* #3 Bronze */}
        <div className="bg-white rounded-3xl p-3 border border-emerald-100 text-center shadow-xs flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm mb-1 border border-amber-300">
            🥉 #3
          </div>
          <span className="font-bold text-xs text-gray-900 truncate w-full">
            {tab === 'earners' ? topEarners[2].name : topReferrers[2].name}
          </span>
          <span className="text-[11px] font-black font-english text-emerald-700 mt-1">
            ৳{tab === 'earners' ? topEarners[2].amount : topReferrers[2].amount}
          </span>
        </div>
      </div>

      {/* Ranks list 4-10 */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs space-y-2">
        {(tab === 'earners' ? topEarners.slice(3) : topReferrers.slice(3)).map((item) => (
          <div
            key={item.rank}
            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/60 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-gray-200 text-gray-700 font-extrabold text-xs flex items-center justify-center font-english">
                #{item.rank}
              </span>
              <div>
                <h4 className="font-bold text-xs text-gray-900">{item.name}</h4>
                <p className="text-[10px] text-gray-400 font-english">{item.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-black text-xs font-english text-emerald-700 block">
                ৳{item.amount.toLocaleString()}
              </span>
              {tab === 'referrers' && 'count' in item && (
                <span className="text-[10px] text-gray-400 font-english">
                  {item.count} রেফার
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
