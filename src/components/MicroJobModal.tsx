import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Gift, 
  Sparkles,
  Play,
  Share2
} from 'lucide-react';

export const MicroJobModal: React.FC = () => {
  const { 
    activeMicroJob, 
    microJobSecondsLeft, 
    completeMicroJob, 
    cancelMicroJob,
    showToast 
  } = useApp();

  const [hasOpenedLink, setHasOpenedLink] = useState(false);

  useEffect(() => {
    if (activeMicroJob) {
      setHasOpenedLink(false);
    }
  }, [activeMicroJob]);

  if (!activeMicroJob) return null;

  const totalSeconds = activeMicroJob.requiredDurationSeconds || 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - microJobSecondsLeft) / totalSeconds) * 100));
  const isFinished = microJobSecondsLeft <= 0;

  const handleOpenLink = () => {
    setHasOpenedLink(true);
    if (activeMicroJob.url && activeMicroJob.url.trim() !== '') {
      window.open(activeMicroJob.url, '_blank', 'noopener,noreferrer');
    } else {
      showToast('কাজের লিংক পাওয়া যায়নি', 'warning');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative border border-emerald-100 transform animate-in zoom-in-95 duration-200 space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              <Gift className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {activeMicroJob.categoryLabel || 'মাইক্রো জব'}
              </span>
              <h3 className="font-extrabold text-sm text-gray-900 truncate max-w-[210px] mt-0.5">
                {activeMicroJob.title}
              </h3>
            </div>
          </div>

          <button
            onClick={cancelMicroJob}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="বাতিল করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward & Duration Banner */}
        <div className="grid grid-cols-2 gap-2 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100 text-center">
          <div>
            <span className="text-[10px] text-gray-500 font-semibold block">রিওয়ার্ড বোনাস</span>
            <span className="text-lg font-black text-emerald-700 font-english">
              ৳{activeMicroJob.reward.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-semibold block">অবস্থান সময়</span>
            <span className="text-lg font-black text-amber-700 font-english">
              {totalSeconds} সেকেন্ড
            </span>
          </div>
        </div>

        {/* Description & Rules Box */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed space-y-1.5">
          <div className="font-bold text-gray-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>কাজের নিয়মাবলী:</span>
          </div>
          <p className="whitespace-pre-line text-[11px] font-medium text-gray-600">
            {activeMicroJob.description || 'লিংক ওপেন করে প্রয়োজনীয় সময় পর্যন্ত অপেক্ষা করুন। টাইমার শেষ হলে বোনাস জমা হবে।'}
          </p>
        </div>

        {/* Live Timer Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1 text-gray-700">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>অবশিষ্ট সময়:</span>
            </span>
            <span className={`font-english text-sm font-black ${
              isFinished ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {isFinished ? 'সময় শেষ!' : `${microJobSecondsLeft}s`}
            </span>
          </div>

          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                isFinished ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Button: Open Link or Claim */}
        <div className="space-y-2 pt-1">
          {!hasOpenedLink ? (
            <button
              onClick={handleOpenLink}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>লিংক বা ভিডিও ওপেন করুন</span>
            </button>
          ) : (
            <button
              onClick={handleOpenLink}
              className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>লিংক পুনরায় ওপেন করুন</span>
            </button>
          )}

          {isFinished ? (
            <button
              onClick={completeMicroJob}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>৳{activeMicroJob.reward.toFixed(2)} বোনাস গ্রহণ করুন</span>
            </button>
          ) : (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-900 text-center flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>টাইমার শূন্য হওয়া পর্যন্ত ধৈর্য ধরুন</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
