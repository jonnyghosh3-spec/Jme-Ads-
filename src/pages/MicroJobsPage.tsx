import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RemoteJobDetailsPage } from './RemoteJobDetailsPage';
import { AccountVerificationBanner } from '../components/AccountVerificationBanner';
import { 
  Briefcase, 
  Play, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Flame,
  Globe,
  Bell,
  Send,
  Video,
  Bot
} from 'lucide-react';

export const MicroJobsPage: React.FC = () => {
  const { user, microJobs, selectedJobForDetails, setSelectedJobForDetails } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // If a job is selected, show the Dedicated Remote Job Details Page
  if (selectedJobForDetails) {
    return (
      <RemoteJobDetailsPage 
        job={selectedJobForDetails} 
        onBack={() => setSelectedJobForDetails(null)} 
      />
    );
  }

  const categories = [
    { id: 'all', label: 'সব অফার' },
    { id: 'youtube', label: '📺 ইউটিউব ভিডিও' },
    { id: 'subscribe', label: '🔔 সাবস্ক্রাইব' },
    { id: 'website', label: '🌐 ওয়েবসাইট' },
    { id: 'special', label: '⚡ স্পেশাল' }
  ];

  const filteredJobs = selectedCategory === 'all'
    ? microJobs.filter(j => j.active !== false)
    : microJobs.filter(j => j.active !== false && j.category === selectedCategory);

  return (
    <div className="space-y-3.5 pb-28">
      {/* Account Verification & 2X Profit Alert Banner (Admin Toggleable) */}
      <AccountVerificationBanner />

      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600 text-white p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="p-2 rounded-xl bg-white/15">
              <Briefcase className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">মাইক্রো জব ও অফার লিস্ট</h2>
              <span className="text-[10px] text-emerald-200 font-bold">ভিডিও দেখে ও কাজ করে বাড়তি ইনকাম</span>
            </div>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed mt-2">
            প্রতিটি কাজের নিয়ম পড়ে সঠিকভাবে ভিডিও বা লিংক ভিজিট করুন। রোবট ভেরিফিকেশন ইঞ্জিন দিয়ে আপনার কাজ ও স্ক্রিনশট যাচাই করে সরাসরি মূল ব্যালেন্সে টাকা দেওয়া হবে!
          </p>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-xs scale-102'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Jobs List */}
      <div className="space-y-2.5">
        {filteredJobs.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center border border-gray-100 shadow-xs space-y-2">
            <Briefcase className="w-10 h-10 text-emerald-300 mx-auto" />
            <h4 className="font-bold text-sm text-gray-800">কোনো কাজ পাওয়া যায়নি</h4>
            <p className="text-xs text-gray-500">শীঘ্রই নতুন নতুন অফার যোগ করা হবে। অনুগ্রহ করে সাথে থাকুন!</p>
          </div>
        ) : (
          filteredJobs.map((job, idx) => {
            const isCompletedToday = Boolean(user?.completedMicroJobs?.[job.id]);
            const isTopPriority = idx === 0 || (job.priority && job.priority >= 90);
            const isVerified = user?.isVerifiedPublisher;
            const reward = isVerified ? (job.reward * 2) : job.reward;

            return (
              <div
                key={job.id}
                onClick={() => setSelectedJobForDetails(job)}
                className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer hover:shadow-md ${
                  isTopPriority 
                    ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500/20' 
                    : 'border-gray-100 shadow-xs hover:border-emerald-200'
                }`}
              >
                {/* Top Badge Line */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {isTopPriority && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white shadow-xs">
                        <Flame className="w-2.5 h-2.5 fill-white" />
                        <span>টপ অফার</span>
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {job.categoryLabel || 'অফার'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
                      <Bot className="w-3 h-3 text-emerald-600" />
                      <span>রোবট ট্র্যাকিং</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-700 font-english block">
                      +৳{reward.toFixed(2)}
                    </span>
                    {isVerified && (
                      <span className="text-[9px] font-black text-amber-700 bg-amber-100 px-1.5 rounded-full">
                        2X ডাবল
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="font-extrabold text-sm text-gray-900 leading-snug">
                  {job.title}
                </h3>

                {/* Instructions / Description */}
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed line-clamp-2 bg-gray-50/80 p-2 rounded-xl border border-gray-100">
                  {job.description}
                </p>

                {/* Footer: Duration & Action Button */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>সময়: {job.requiredDurationSeconds} সেকেন্ড</span>
                  </div>

                  {isCompletedToday ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>আজ সম্পন্ন</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJobForDetails(job);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>বিস্তারিত ও কাজ শুরু</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
