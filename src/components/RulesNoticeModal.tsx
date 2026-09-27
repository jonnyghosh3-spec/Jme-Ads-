import React from 'react';
import { X, Check } from 'lucide-react';

interface RulesNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralReward?: number;
  adReward?: number;
}

export const RulesNoticeModal: React.FC<RulesNoticeModalProps> = ({
  isOpen,
  onClose,
  referralReward = 50,
  adReward = 5
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[360px] bg-white rounded-3xl p-5 shadow-2xl relative border border-gray-100 transform animate-in zoom-in-95 duration-200 space-y-3.5 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title & Tagline */}
        <div className="text-center pt-1 space-y-1">
          <h3 className="text-lg font-black text-gray-900 flex items-center justify-center gap-1.5">
            <span>আসসালামু আলাইকুম</span>
            <span className="text-rose-500">❤️</span>
          </h3>
          <p className="text-xs font-bold text-amber-700">
            🔥 সততার সাথে কাজ করুন, ১০০% পেমেন্ট পাবেন ইনশাআল্লাহ!
          </p>
        </div>

        {/* Features / Earning List */}
        <div className="space-y-1.5 text-xs text-gray-800 font-medium px-1">
          <div className="flex items-center gap-2">
            <span>💸</span>
            <span>প্রতি রেফার: <strong className="font-english font-bold text-emerald-700">৳{referralReward}</strong> টাকা</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>প্রতি বিজ্ঞাপন: <strong className="font-english font-bold text-emerald-700">৳{adReward}</strong> টাকা</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎮</span>
            <span>Lucky Spin করে ইনকামের সুযোগ</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📺</span>
            <span>প্রতিদিন আনলিমিটেড বিজ্ঞাপন দেখার সুযোগ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✅</span>
            <span>সম্পূর্ণ ফ্রি — কোনো ইনভেস্টমেন্ট নেই</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💳</span>
            <span>পেমেন্ট: বিকাশ, নগদ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold">💯</span>
            <span>১০০% পেমেন্ট গ্যারান্টি</span>
          </div>
        </div>

        {/* Warning Alert Box */}
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 leading-relaxed font-semibold">
          <p>
            ⚠️ <strong>সতর্কতা:</strong> ফেক রেফার/এক ফোনে একাধিক অ্যাকাউন্ট করলে পেমেন্ট বাতিল হবে! নিয়ম মেনে কাজ করুন এবং আমাদের Telegram চ্যানেলে যুক্ত থাকুন! 🔥
          </p>
        </div>

        {/* Understood Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>বুঝতে পেরেছি</span>
        </button>

      </div>
    </div>
  );
};
