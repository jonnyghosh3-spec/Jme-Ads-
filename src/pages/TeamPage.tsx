import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Copy, 
  Share2, 
  Gift, 
  CheckCircle, 
  ShieldCheck, 
  UserPlus, 
  DollarSign,
  Send,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { user, referrals, settings, showToast } = useApp();

  const refCode = user?.referralCode || 'JME8X7K2';
  const referralUrl = `${window.location.origin}/?ref=${refCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(refCode);
    showToast(`রেফারেল কোড "${refCode}" কপি হয়েছে!`, 'success');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    showToast('রেফারেল লিংক কপি হয়েছে!', 'success');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `🔥 JME Ads-এ বিজ্ঞাপন দেখে প্রতিদিন আয় করুন! প্রতি রেফারে ৳৫০ নিশ্চিত বোনাস। রেজিস্ট্রেশন লিংক: ${referralUrl}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${text}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'JME Ads - আয় করুন সহজে',
          text: `🔥 JME Ads-এ বিজ্ঞাপন দেখে প্রতিদিন আয় করুন! প্রতি রেফারে ৳৫০ নিশ্চিত বোনাস।`,
          url: referralUrl
        });
      } catch (e) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const userReferrals = referrals.filter(r => r.referrerUid === user?.uid);
  const totalReferralEarnings = userReferrals.reduce((sum, r) => sum + r.rewardAmount, 0) || (user?.referralEarned || 0);
  const totalCount = userReferrals.length;
  const displayReferralList = userReferrals;

  return (
    <div className="space-y-4 pb-28">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-white/15">
              <Users className="w-5 h-5 text-emerald-100" />
            </div>
            <h2 className="font-extrabold text-lg">রেফার করুন ও আনলিমিটেড আয় করুন</h2>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            আপনার রেফারেল লিংক দিয়ে বন্ধু যোগ দিলেই পাবেন <strong className="text-white font-bold font-english">৳{settings.referralReward}</strong> ইনস্ট্যান্ট বোনাস এবং তাদের কাজের উপর লাইফটাইম কমিশন!
          </p>

          {/* 4 Stats */}
          <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-emerald-600/50">
            <div className="bg-white/10 rounded-2xl p-3">
              <span className="text-[11px] text-emerald-200 block">মোট রেফারেল টিম</span>
              <span className="font-black text-xl font-english text-white">
                {totalCount} জন
              </span>
            </div>
            <div className="bg-white/10 rounded-2xl p-3">
              <span className="text-[11px] text-emerald-200 block">রেফার থেকে মোট আয়</span>
              <span className="font-black text-xl font-english text-emerald-200">
                ৳{totalReferralEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Referral Code & Link Box */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          আপনার রেফারেল কোড ও লিংক
        </h3>

        {/* Code Box */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div>
            <span className="text-[10px] text-emerald-700 font-semibold block">রেফার কোড:</span>
            <span className="text-lg font-black text-emerald-950 font-english tracking-wider">
              {refCode}
            </span>
          </div>
          <button
            onClick={copyCode}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-1 shadow-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>কপি কোড</span>
          </button>
        </div>

        {/* URL Box */}
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200">
          <span className="text-[10px] text-gray-500 font-semibold block mb-1">রেফারেল লিংক:</span>
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="bg-transparent text-xs text-gray-700 font-english font-medium w-full focus:outline-none truncate"
            />
            <button
              onClick={copyLink}
              className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>লিংক কপি</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={shareTelegram}
            className="py-2.5 px-3 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-sky-100 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>টেলিগ্রামে শেয়ার</span>
          </button>
          <button
            onClick={shareNative}
            className="py-2.5 px-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-100 active:scale-95 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>লিংক শেয়ার করুন</span>
          </button>
        </div>
      </div>

      {/* 3. How to earn from referral */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs">
        <h3 className="font-extrabold text-sm text-emerald-950 mb-3 flex items-center gap-2">
          <span>কীভাবে রেফার করে আয় করবেন?</span>
        </h3>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ১
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">লিংক শেয়ার করুন</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                আপনার রেফারেল লিংক কপি করে টেলিগ্রাম, মেসেঞ্জার বা বন্ধুদের সাথে শেয়ার করুন।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ২
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">বন্ধু একাউন্ট খুলবে</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                আপনার লিংকে ক্লিক করলে রেফারেল কোড স্বয়ংক্রিয়ভাবে বসে যাবে এবং বন্ধু একাউন্ট খুলবে।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ৩
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">বোনাস যোগ হবে</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                নতুন একাউন্ট সফলভাবে ভ্যালিড হলে আপনি সাথে সাথে পাবেন ৳৫০ বোনাস।
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              ৪
            </div>
            <div>
              <h4 className="font-bold text-xs text-gray-900">লাইফটাইম কমিশন</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed mt-0.5">
                আপনার রেফার করা বন্ধুরা যখনই কাজ করবে, তাদের আয়ের উপর নিয়মিত কমিশন পাবেন।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Referral Team Members List */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-emerald-950">আমার রেফারেল টিম</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {totalCount} জন যুক্ত হয়েছেন
          </span>
        </div>

        {displayReferralList.length === 0 ? (
          <div className="text-center py-6 px-4 bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-200">
            <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-xs font-bold text-gray-700">এখনও কোনো রেফারেল যোগ হয়নি</p>
            <p className="text-[11px] text-gray-500 mt-1">
              আপনার রেফারেল কোড বা লিংক বন্ধুদের সাথে শেয়ার করে টিম তৈরি করুন এবং বোনাস আয় করুন!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayReferralList.map((ref, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:border-emerald-200 bg-gray-50/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {ref.referredName ? ref.referredName[0] : 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{ref.referredName}</h4>
                    <p className="text-[10px] text-gray-400 font-english">{ref.referredPhoneMasked}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600 font-english block">
                    +৳{ref.rewardAmount.toFixed(2)}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    সক্রিয়
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
