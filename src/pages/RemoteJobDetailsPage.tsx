import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MicroJobItem, AIAnalyticsReport } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { analyzeJobProof } from '../utils/aiVerification';
import { 
  ArrowLeft, 
  Play, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  Upload, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  Bot,
  Zap,
  Activity,
  FileCheck
} from 'lucide-react';

export const RemoteJobDetailsPage: React.FC<{ 
  job: MicroJobItem; 
  onBack: () => void;
}> = ({ job, onBack }) => {
  const { user, showToast, submitJobProof, settings } = useApp();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [startScreenshot, setStartScreenshot] = useState<string | null>(null);
  const [startSizeKb, setStartSizeKb] = useState<number>(0);
  const [endScreenshot, setEndScreenshot] = useState<string | null>(null);
  const [endSizeKb, setEndSizeKb] = useState<number>(0);
  const [proofNote, setProofNote] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAiReport, setSubmittedAiReport] = useState<AIAnalyticsReport | null>(null);

  const isSubscribeJob = 
    job.category === 'subscribe' || 
    job.title.includes('সাবস্ক্রাইব') || 
    job.id.includes('subscribe') || 
    job.id.includes('telegram');

  const isVerified = user?.isVerifiedPublisher;
  const rewardAmount = isVerified ? (job.reward * 2) : job.reward;
  const requiredSeconds = isSubscribeJob ? 5 : (job.requiredDurationSeconds || 60);
  const isTimeComplete = isSubscribeJob ? true : (secondsSpent >= requiredSeconds);

  // Active Timer Tracker (Robot Engineering Simulation)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted && !isSubmitted) {
      interval = setInterval(() => {
        setSecondsSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted, isSubmitted]);

  // Handle Opening Job Video/Link
  const handleStartWork = () => {
    setSessionStarted(true);
    if (job.url && job.url.trim() !== '') {
      window.open(job.url, '_blank', 'noopener,noreferrer');
      showToast('ভিডিও/কাজের লিংক ওপেন হয়েছে। টাইমার কাউন্ট হচ্ছে...', 'info');
    }
  };

  // Convert & Compress File to under 100KB using HTML5 Canvas
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      showToast('ছবি ১০০ কেবির নিচে কম্প্রেস করা হচ্ছে...', 'info');
      const compressed = await compressImage(file, 100);

      if (type === 'start') {
        setStartScreenshot(compressed.dataUrl);
        setStartSizeKb(compressed.sizeKb);
        showToast(`✓ শুরুর স্ক্রিনশট রেডি (${compressed.sizeKb} KB - ১০০ কেবির নিচে)!`, 'success');
      } else {
        setEndScreenshot(compressed.dataUrl);
        setEndSizeKb(compressed.sizeKb);
        showToast(`✓ শেষের স্ক্রিনশট রেডি (${compressed.sizeKb} KB - ১০০ কেবির নিচে)!`, 'success');
      }
    } catch (err: any) {
      showToast('ছবি প্রসেস করতে ব্যর্থ হয়েছে: ' + err.message, 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  // Submit Proof with AI Analytics to Admin Panel
  const handleSubmitProof = async () => {
    if (!sessionStarted) {
      showToast('প্রথমে "কাজ শুরু করুন" বাটনে ক্লিক করুন', 'warning');
      return;
    }

    if (!isTimeComplete) {
      showToast(`ন্যূনতম ${requiredSeconds} সেকেন্ড পূরণ করতে হবে। এখনও বাকি আছে!`, 'warning');
      return;
    }

    if (isSubscribeJob) {
      if (!startScreenshot && !endScreenshot) {
        showToast('সাবস্ক্রাইব করার প্রমাণ হিসেবে ১টি স্ক্রিনশট আপলোড করা বাধ্যতামূলক!', 'error');
        return;
      }
    } else {
      if (!startScreenshot || !endScreenshot) {
        showToast('ভিডিওর শুরু এবং শেষের ২টি স্ক্রিনশটই আপলোড করা বাধ্যতামূলক!', 'error');
        return;
      }
    }

    const proofImg1 = startScreenshot || endScreenshot || '';
    const proofImg2 = isSubscribeJob ? proofImg1 : (endScreenshot || '');

    setIsSubmitting(true);
    try {
      // Run Automated AI Analytics Engine
      const aiReport = await analyzeJobProof({
        requiredSeconds: isSubscribeJob ? 5 : requiredSeconds,
        spentSeconds: Math.max(15, secondsSpent),
        startScreenshotUrl: proofImg1,
        endScreenshotUrl: proofImg2,
        startSizeKb: startSizeKb || endSizeKb,
        endSizeKb: endSizeKb || startSizeKb,
        proofText: proofNote.trim()
      });

      setSubmittedAiReport(aiReport);

      const res = await submitJobProof({
        jobId: job.id,
        jobTitle: job.title,
        startScreenshotUrl: proofImg1,
        endScreenshotUrl: proofImg2,
        requiredSeconds: isSubscribeJob ? 5 : requiredSeconds,
        spentSeconds: Math.max(15, secondsSpent),
        proofText: proofNote.trim(),
        reward: rewardAmount,
        aiAnalytics: aiReport
      });

      if (res.success) {
        setIsSubmitted(true);
        if (isSubscribeJob) {
          showToast(`🎉 এআই রোবট স্বয়ংক্রিয়ভাবে স্ক্রিনশট যাচাই করেছে! ৳${rewardAmount.toFixed(2)} সরাসরি মূল ব্যালেন্সে যোগ হয়েছে।`, 'success');
        } else {
          showToast(`🎉 এআই যাচাইকরণ সম্পন্ন (${aiReport.confidenceScore}% স্কোর)! প্রমাণ অ্যাডমিন প্যানেলে জমা হয়েছে।`, 'success');
        }
      } else {
        showToast(res.message || 'সাবমিশন ব্যর্থ হয়েছে', 'error');
      }
    } catch (e: any) {
      showToast('সাবমিট এরর: ' + e.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Top Header */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-700 text-white p-5 shadow-lg relative overflow-hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-emerald-100 font-bold mb-3 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সব অফারে ফিরে যান</span>
        </button>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full inline-block mb-1.5">
              {job.categoryLabel || 'রিমোট জব'}
            </span>
            <h1 className="font-extrabold text-base sm:text-lg leading-snug">{job.title}</h1>
          </div>
          
          <div className="text-right shrink-0 bg-white/10 p-2.5 rounded-2xl border border-white/20">
            <span className="text-[10px] text-emerald-100 block font-semibold">কাজের রিওয়ার্ড</span>
            <span className="text-xl font-black font-english text-emerald-300">
              ৳{rewardAmount.toFixed(2)}
            </span>
            {isVerified && (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full">
                <Zap className="w-2.5 h-2.5 fill-amber-950" /> 2X প্রফিট
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Robot Verification Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-emerald-400">রোবট ট্র্যাকিং ও প্রুফ ভেরিফিকেশন সিস্টেম</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          এই কাজে আপনাকে ভিডিওর শুরুর দিকের ১টি এবং শেষের দিকের ১টি স্ক্রিনশট আপলোড করতে হবে। রোবট ইঞ্জিন আপনার অবস্থান সময় ও স্ক্রিনশট টাইমস্ট্যাম্প যাচাই করবে।
        </p>
      </div>

      {/* Step Instructions */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3">
        <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>কাজের বিস্তারিত নিয়ম ও নির্দেশনা</span>
        </h3>

        <div className="space-y-2 text-xs text-gray-700">
          <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 leading-relaxed whitespace-pre-line font-medium">
            {job.description || 'ভিডিওটি মনোযোগ দিয়ে সম্পূর্ণ দেখুন এবং লাইক ও সাবস্ক্রাইব করুন।'}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">১</span>
              <p>নিচের <strong>"কাজ শুরু করুন"</strong> বাটনে ক্লিক করে ইউটিউব ভিডিও বা লিংক ওপেন করুন।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">২</span>
              <p>ভিডিওর প্রথম ৫ সেকেন্ডের মধ্যে একটি স্ক্রিনশট নিন (শুরুর প্রমাণ)।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">৩</span>
              <p>কমপক্ষে <strong>{requiredSeconds} সেকেন্ড</strong> অবস্থান করে ভিডিওতে লাইক দিন এবং শেষের স্ক্রিনশট নিন।</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">৪</span>
              <p>দুটি স্ক্রিনশট আপলোড করে সাবমিট করুন।</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Timer & Video Link Box */}
      <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>লাইভ কাজের সময় ট্র্যাকার:</span>
          </div>
          <span className={`text-sm font-black font-english ${isTimeComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
            {secondsSpent}s / {requiredSeconds}s {isTimeComplete && '✅ (সম্পন্ন)'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isTimeComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'}`}
            style={{ width: `${Math.min(100, (secondsSpent / requiredSeconds) * 100)}%` }}
          />
        </div>

        <button
          onClick={handleStartWork}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{sessionStarted ? 'ভিডিও পুনরায় ওপেন করুন' : 'কাজ শুরু করুন (ভিডিও ওপেন)'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Proof Submission & Dual Screenshot Upload */}
      {isSubmitted ? (
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-md text-center space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full inline-block mb-1.5 font-english">
              AI ANALYTICS VERIFIED ✓
            </span>
            <h3 className="font-extrabold text-base text-gray-950">কাজের প্রমাণ সফলভাবে গৃহীত হয়েছে!</h3>
          </div>

          {/* AI Analytics Verification Card */}
          {submittedAiReport && (
            <div className="p-3.5 rounded-2xl bg-slate-900 text-left text-white border border-slate-700 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">এআই অ্যানালিটিক্স রিপোর্ট</span>
                </div>
                <span className="text-xs font-black font-english text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  স্কোর: {submittedAiReport.confidenceScore}%
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                {submittedAiReport.summary}
              </p>

              <div className="space-y-1 pt-1 text-[10px] text-slate-400">
                {submittedAiReport.details.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">▪</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 leading-relaxed">
            আপনার সাবমিশন ও এআই রিপোর্ট সরাসরি <strong>অ্যাডমিন প্যানেলে</strong> পাঠানো হয়েছে। অ্যাডমিন ভেরিফাই করা মাত্রই আপনার একাউন্টে <strong>৳{rewardAmount.toFixed(2)}</strong> যুক্ত হয়ে যাবে।
          </p>

          <button
            onClick={onBack}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95 transition-all"
          >
            অন্যান্য অফারে ফিরে যান
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>কাজের স্ক্রিনশট প্রমাণ (১০০ কেবির নিচে অটো-কম্প্রেসড)</span>
            </h3>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              অটো-কম্প্রেসড &lt;100KB
            </span>
          </div>

          {isSubscribeJob ? (
            /* Single Screenshot for Channel Subscriptions */
            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-4 text-center bg-emerald-50/30 hover:bg-emerald-50/50 transition-all relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-800">
                  {job.title.includes('টেলিগ্রাম') ? 'টেলিগ্রাম চ্যানেলে জয়েন করার স্ক্রিনশট' : 'ইউটিউব সাবস্ক্রাইব ও বেল আইকনের স্ক্রিনশট'}
                </span>
                {startSizeKb > 0 && (
                  <span className="text-[10px] font-bold text-emerald-700 font-english bg-emerald-100 px-2 py-0.5 rounded-full">
                    {startSizeKb} KB (কম্প্রেসড)
                  </span>
                )}
              </div>

              {startScreenshot ? (
                <div className="relative max-w-xs mx-auto">
                  <img src={startScreenshot} alt="Subscribe proof" className="w-full h-36 object-cover rounded-xl border-2 border-emerald-400 shadow-xs" />
                  <span className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full text-xs shadow-xs flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <label className="inline-block text-xs text-emerald-700 font-extrabold mt-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-50 shadow-xs">
                    স্ক্রিনশট পরিবর্তন করুন
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'start')} 
                      className="hidden" 
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 shadow-xs">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-extrabold text-gray-800">সাবস্ক্রাইব করার স্ক্রিনশট সিলেক্ট করুন</span>
                  <span className="text-[10px] text-gray-500 mt-1">গ্যালারি বা ক্যামেরা থেকে ছবি দিন (স্বয়ংক্রিয়ভাবে &lt;১০০ কেবি হবে)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'start')} 
                    className="hidden" 
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Start Screenshot */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-2.5 text-center bg-gray-50/50 hover:bg-emerald-50/30 transition-all relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-gray-700">১. শুরুর স্ক্রিনশট</span>
                  {startSizeKb > 0 && (
                    <span className="text-[9px] font-bold text-emerald-600 font-english bg-emerald-100 px-1 rounded">
                      {startSizeKb} KB
                    </span>
                  )}
                </div>

                {startScreenshot ? (
                  <div className="relative">
                    <img src={startScreenshot} alt="Start proof" className="w-full h-24 object-cover rounded-xl border border-emerald-300" />
                    <span className="absolute top-1 right-1 bg-emerald-600 text-white p-1 rounded-full text-[9px] shadow-xs">
                      <Check className="w-3 h-3" />
                    </span>
                    <label className="block text-[10px] text-emerald-700 font-bold mt-1 cursor-pointer hover:underline">
                      পরিবর্তন করুন
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'start')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[10px] font-bold text-emerald-700">ছবি সিলেক্ট করুন</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">অটো কম্প্রেস হবে</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'start')} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {/* 2. End Screenshot */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-2.5 text-center bg-gray-50/50 hover:bg-emerald-50/30 transition-all relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-gray-700">২. শেষের স্ক্রিনশট</span>
                  {endSizeKb > 0 && (
                    <span className="text-[9px] font-bold text-emerald-600 font-english bg-emerald-100 px-1 rounded">
                      {endSizeKb} KB
                    </span>
                  )}
                </div>

                {endScreenshot ? (
                  <div className="relative">
                    <img src={endScreenshot} alt="End proof" className="w-full h-24 object-cover rounded-xl border border-emerald-300" />
                    <span className="absolute top-1 right-1 bg-emerald-600 text-white p-1 rounded-full text-[9px] shadow-xs">
                      <Check className="w-3 h-3" />
                    </span>
                    <label className="block text-[10px] text-emerald-700 font-bold mt-1 cursor-pointer hover:underline">
                      পরিবর্তন করুন
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'end')} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-[10px] font-bold text-emerald-700">ছবি সিলেক্ট করুন</span>
                    <span className="text-[9px] text-gray-400 mt-0.5">অটো কম্প্রেস হবে</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'end')} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Proof Note */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">অতিরিক্ত নোট / তথ্য (ঐচ্ছিক):</label>
            <input 
              type="text" 
              value={proofNote} 
              onChange={(e) => setProofNote(e.target.value)} 
              placeholder="ইউটিউব ইউজারনেম বা চ্যানেলের নাম লিখুন" 
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500" 
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitProof}
            disabled={isSubmitting || !isTimeComplete || isCompressing}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
              isTimeComplete && !isCompressing
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-600/30 cursor-pointer active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isCompressing 
                ? 'ছবি কম্প্রেশন চলছে...' 
                : isSubmitting 
                ? 'এআই অ্যানালিটিক্স যাচাই ও সাবমিট হচ্ছে...' 
                : isTimeComplete 
                ? `এআই ভেরিফিকেশন ও সাবমিট করুন (রিওয়ার্ড ৳${rewardAmount.toFixed(2)})` 
                : `টাইমার বাকি আছে (${requiredSeconds - secondsSpent}s)`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
