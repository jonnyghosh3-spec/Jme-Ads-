import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Play, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Flame,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, user, startTask, settings } = useApp();
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate statistics
  const totalTasks = tasks.length;
  let totalCompletionsToday = 0;
  let availableCount = 0;
  let completedCount = 0;

  tasks.forEach(t => {
    const done = user?.todayTaskCompletions?.[t.id] || 0;
    totalCompletionsToday += done;
    if (done >= t.dailyLimit) {
      completedCount++;
    } else {
      availableCount++;
    }
  });

  const filteredTasks = tasks.filter(task => {
    const done = user?.todayTaskCompletions?.[task.id] || 0;
    const isCompleted = done >= task.dailyLimit;

    if (filter === 'available' && isCompleted) return false;
    if (filter === 'completed' && !isCompleted) return false;

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
    <div className="space-y-4 pb-28">
      {/* 1. Page Header with Stats */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-green-700 text-white p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/15">
                <CheckSquare className="w-5 h-5 text-emerald-100" />
              </div>
              <h2 className="font-extrabold text-lg">বিজ্ঞাপন টাস্ক সেন্টার</h2>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20">
              দৈনিক সীমা: ৩ বার/লিংক
            </span>
          </div>

          <p className="text-xs text-emerald-100 leading-relaxed">
            প্রতিটি বিজ্ঞাপন দেখে আয় করুন ৳৫.০০। লিংকে ক্লিক করে নতুন ট্যাবে ঠিক ১৫ সেকেন্ড অবস্থান করতে হবে।
          </p>

          {/* 3 Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-600/50 text-center">
            <div className="bg-white/10 rounded-2xl p-2">
              <span className="text-[10px] text-emerald-200 block">মোট বিজ্ঞাপন</span>
              <span className="font-extrabold text-base font-english">{totalTasks}টি</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-2">
              <span className="text-[10px] text-emerald-200 block">আজ সম্পন্ন</span>
              <span className="font-extrabold text-base font-english">{totalCompletionsToday} বার</span>
            </div>
            <div className="bg-white/10 rounded-2xl p-2">
              <span className="text-[10px] text-emerald-200 block">আজকের আয়</span>
              <span className="font-extrabold text-base font-english text-emerald-200">
                ৳{(totalCompletionsToday * (settings.adReward || 5)).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Critical Warning Banner (Requested by user & reference) */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
            <span>গুরুত্বপূর্ণ নোটিশ</span>
            <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold animate-pulse">
              সতর্কতা
            </span>
          </h4>
          <p className="text-[11px] text-amber-900 leading-relaxed mt-1">
            লিংকে ক্লিক করে কাজ সম্পূর্ণ না করে (১৫ সেকেন্ডের পূর্বেই) ফিরে আসলে আপনার একাউন্টে টাকা যোগ হবে না এবং একাউন্ট ব্যান হতে পারে!
            প্রতিটি বিজ্ঞাপনে দিনে সর্বোচ্চ ৩ বার কাজ করতে পারবেন।
          </p>
        </div>
      </div>

      {/* 3. Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Filter buttons */}
        <div className="flex bg-white p-1 rounded-2xl border border-emerald-100 shadow-2xs text-xs font-semibold flex-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              filter === 'all' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            সব ({totalTasks})
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              filter === 'available' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            বাকি আছে ({availableCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              filter === 'completed' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            সীমা শেষ ({completedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="বিজ্ঞাপন খুঁজুন..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-44 px-3.5 py-2 pl-8 rounded-2xl bg-white border border-emerald-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* 4. Tasks List (All 24 Smartlinks) */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border border-emerald-100 p-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">কোনো বিজ্ঞাপন পাওয়া যায়নি</h4>
            <p className="text-xs text-gray-500 mt-1">অন্য কোনো ফিল্টার নির্বাচন করুন</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const completions = user?.todayTaskCompletions?.[task.id] || 0;
            const isLimitReached = completions >= task.dailyLimit;
            const progress = (completions / task.dailyLimit) * 100;

            return (
              <div 
                key={task.id}
                className={`p-4 rounded-2xl bg-white border transition-all ${
                  isLimitReached 
                    ? 'border-gray-200 opacity-75' 
                    : 'border-emerald-100 hover:border-emerald-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Left info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                      isLimitReached 
                        ? 'bg-gray-100 text-gray-400' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {isLimitReached ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Play className="w-5 h-5 fill-emerald-600 ml-0.5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-gray-900">{task.banglaTitle}</h4>
                        {task.badge && (
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {task.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                        <span className="font-english text-[11px] text-gray-400">{task.nameId}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>১৫ সেকেন্ড</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right reward & count */}
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-emerald-600 font-english">
                      +৳{task.reward.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-semibold text-gray-400 font-english">
                      ভিউ: {completions}/{task.dailyLimit}
                    </div>
                  </div>

                </div>

                {/* Progress bar and CTA button */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="w-full sm:w-1/2">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-medium">
                      <span>দৈনিক সীমা অগ্রগতি:</span>
                      <span className="font-bold font-english text-emerald-700">
                        {completions} / {task.dailyLimit} বার
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isLimitReached ? 'bg-emerald-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => startTask(task)}
                    disabled={isLimitReached}
                    className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                      isLimitReached
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                    }`}
                  >
                    {isLimitReached ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>আজকের সীমা পূর্ণ (৩/৩)</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>কাজটি সম্পন্ন করুন</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
