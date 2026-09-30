import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Play, 
  Clock, 
  CheckCircle2, 
  Search,
  AlertCircle
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, user, startTask, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Sort tasks: Active tasks (limit not reached) at top, completed tasks at the bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    const doneA = user?.todayTaskCompletions?.[a.id] || 0;
    const doneB = user?.todayTaskCompletions?.[b.id] || 0;
    const limitA = doneA >= a.dailyLimit ? 1 : 0;
    const limitB = doneB >= b.dailyLimit ? 1 : 0;
    if (limitA !== limitB) {
      return limitA - limitB; // 0 (active) comes first, 1 (completed) moves to bottom
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter(task => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.banglaTitle.toLowerCase().includes(q) ||
        task.nameId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-3.5 pb-28">
      {/* 1. Page Header (Clean, without the 3 separate stat boxes) */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-green-700 text-white p-4 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-white/15">
              <CheckSquare className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">বিজ্ঞাপন টাস্ক সেন্টার</h2>
              <p className="text-[11px] text-emerald-100 font-medium">
                প্রতিটি বিজ্ঞাপনে আয় ৳{settings.adReward || 5} • ১৫ সেকেন্ড অবস্থান করুন
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 whitespace-nowrap">
            দৈনিক ৩ বার/লিংক
          </span>
        </div>
      </div>

      {/* 2. Critical Alert Notice */}
      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 shadow-2xs flex items-center gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <p className="leading-tight text-[11px]">
          <strong>সতর্কতা:</strong> লিংকে ক্লিক করে নতুন ট্যাবে ঠিক ১৫ সেকেন্ড থাকতে হবে। ১৫ সেকেন্ডের আগে ফিরে এলে আয় যোগ হবে না।
        </p>
      </div>

      {/* 3. Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="বিজ্ঞাপন খুঁজুন..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-3.5 py-2 pl-9 rounded-2xl bg-white border border-emerald-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* 4. Tasks Unified Single-Line List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-10 text-center bg-white rounded-3xl border border-emerald-100 p-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800 text-xs">কোনো বিজ্ঞাপন পাওয়া যায়নি</h4>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const completions = user?.todayTaskCompletions?.[task.id] || 0;
            const isLimitReached = completions >= task.dailyLimit;

            return (
              <div 
                key={task.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 ${
                  isLimitReached 
                    ? 'bg-gray-50/80 border-gray-200 opacity-60' 
                    : 'bg-white border-emerald-100 hover:border-emerald-300 shadow-2xs'
                }`}
              >
                {/* Left: Icon & Title on one line */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isLimitReached 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {isLimitReached ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Play className="w-4 h-4 fill-emerald-600 ml-0.5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 truncate">
                      <h4 className="font-bold text-xs text-gray-900 truncate">{task.banglaTitle}</h4>
                      {task.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold shrink-0">
                          {task.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-english mt-0.5">
                      <span>{task.nameId}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> 15s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center / Stats: Reward & Views */}
                <div className="text-right shrink-0 px-1">
                  <div className="text-xs font-black text-emerald-600 font-english">
                    +৳{task.reward.toFixed(2)}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 font-english">
                    ভিউ: {completions}/{task.dailyLimit}
                  </div>
                </div>

                {/* Right: Action Button or Completed Badge */}
                <div className="shrink-0">
                  {isLimitReached ? (
                    /* When limit reached: show completed indicator, NO view button! */
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-200/80 text-gray-600 text-[11px] font-extrabold border border-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>সীমা শেষ</span>
                    </span>
                  ) : (
                    /* Active button */
                    <button
                      onClick={() => startTask(task)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>দেখুন</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
