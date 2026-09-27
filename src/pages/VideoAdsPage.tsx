import React from 'react';
import { useApp } from '../context/AppContext';
import { Video, ArrowLeft, Play, Clock, Sparkles, AlertCircle } from 'lucide-react';

export const VideoAdsPage: React.FC = () => {
  const { tasks, startTask, setActiveTab } = useApp();

  // Video-targeted tasks
  const videoTasks = tasks.slice(0, 6);

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-lg text-emerald-950">ভিডিও বিজ্ঞাপন জোন</h2>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 text-white p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-white/15">
            <Video className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-extrabold text-base">রিওয়ার্ডেড ভিডিও অ্যাডস</h3>
        </div>
        <p className="text-xs text-rose-100 leading-relaxed">
          ভিডিও ও স্পন্সর বিজ্ঞাপন দেখুন। প্রতিটি বিজ্ঞাপনে পুরো ১৫ সেকেন্ড অবস্থান করতে হবে।
        </p>
      </div>

      <div className="space-y-2.5">
        {videoTasks.map((t, idx) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <Play className="w-5 h-5 fill-red-600 ml-0.5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900">ভিডিও স্পন্সর #{idx + 1}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>১৫ সেকেন্ড</span>
                  </span>
                  <span>•</span>
                  <span className="font-bold text-emerald-600 font-english">+৳৫.০০</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startTask(t)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold active:scale-95 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>দেখুন</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
