import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const TaskVerificationModal: React.FC = () => {
  const { 
    activeTaskSession, 
    tasks, 
    completeActiveTask, 
    cancelActiveTask,
    earlyReturnWarning,
    setEarlyReturnWarning
  } = useApp();

  const [timeLeft, setTimeLeft] = useState<number>(15);

  useEffect(() => {
    if (!activeTaskSession) {
      setTimeLeft(15);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - activeTaskSession.startTime) / 1000);
      const remaining = Math.max(0, activeTaskSession.requiredSeconds - elapsed);
      setTimeLeft(remaining);
    }, 200);

    return () => clearInterval(interval);
  }, [activeTaskSession]);

  const activeTask = activeTaskSession ? tasks.find(t => t.id === activeTaskSession.taskId) : null;
  const isReady = timeLeft <= 0;
  const progressPercent = activeTaskSession 
    ? Math.min(100, Math.round(((activeTaskSession.requiredSeconds - timeLeft) / activeTaskSession.requiredSeconds) * 100))
    : 0;

  return (
    <>
      {/* 1. Active Task Floating Overlay / Modal */}
      {activeTaskSession && activeTask && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-400 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-emerald-950 text-base">বিজ্ঞাপন যাচাইকরণ চলছে...</span>
              </div>
              <button 
                onClick={cancelActiveTask}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="বাতিল করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="py-5 text-center">
              <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                {/* Circular Progress SVG */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progressPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isReady ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-emerald-950 font-english">
                        {timeLeft}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase">
                        সেকেন্ড বাকি
                      </span>
                    </>
                  )}
                </div>
              </div>

              <h4 className="font-bold text-lg text-gray-900 mb-1">
                {activeTask.banglaTitle}
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                পুরস্কার: <span className="text-emerald-600 font-bold text-sm">৳{activeTask.reward.toFixed(2)}</span> | মোট সময়: ১৫ সেকেন্ড
              </p>

              {/* Notice */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left mb-4">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-900 leading-snug">
                    <strong className="font-bold">সতর্কবার্তা:</strong> বিজ্ঞাপন লিংকে ক্লিক করে নতুন ট্যাবে পুরো ১৫ সেকেন্ড থাকুন। ১৫ সেকেন্ডের আগে ট্যাবে ফিরে এলে টাস্ক বাতিল হবে।
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {isReady ? (
                <button
                  onClick={completeActiveTask}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 text-white font-bold text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>৳{activeTask.reward.toFixed(2)} সংগ্রহ করুন!</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>অনুগ্রহ করে অপেক্ষা করুন ({timeLeft}s)...</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 2. Early Return Warning Alert Modal */}
      {earlyReturnWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-red-300 text-center animate-shake">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-red-700 mb-1">
              কাজটি অসম্পূর্ণ! ❌
            </h3>

            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 mb-4 leading-relaxed text-left">
              <p className="font-semibold mb-1">
                ⚠️ আপনি নির্ধারিত ১৫ সেকেন্ড শেষ হওয়ার পূর্বেই ওয়েবসাইটে ফিরে এসেছেন!
              </p>
              <p>
                বিজ্ঞাপন কোম্পানির নিয়ম অনুযায়ী ন্যূনতম ১৫ সেকেন্ড বিজ্ঞাপন না দেখলে টাকা একাউন্টে যোগ হবে না। বারবার এমন করলে একাউন্ট সাময়িক স্থগিত হতে পারে।
              </p>
            </div>

            <button
              onClick={() => setEarlyReturnWarning(false)}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
            >
              আমি বুঝতে পেরেছি, পুনরায় চেষ্টা করব
            </button>
          </div>
        </div>
      )}
    </>
  );
};
