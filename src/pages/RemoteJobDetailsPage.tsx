import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MicroJobItem } from '../types';
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
  Zap
} from 'lucide-react';

export const RemoteJobDetailsPage: React.FC<{ 
  job: MicroJobItem; 
  onBack: () => void;
}> = ({ job, onBack }) => {
  const { user, showToast, submitJobProof, settings } = useApp();

  const [sessionStarted, setSessionStarted] = useState(false);
  const [secondsSpent, setSecondsSpent] = useState(0);
  const [startScreenshot, setStartScreenshot] = useState<string | null>(null);
  const [endScreenshot, setEndScreenshot] = useState<string | null>(null);
  const [proofNote, setProofNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isVerified = user?.isVerifiedPublisher;
  const rewardAmount = isVerified ? (job.reward * 2) : job.reward;
  const requiredSeconds = job.requiredDurationSeconds || 60;
  const isTimeComplete = secondsSpent >= requiredSeconds;

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

  // Convert File to Base64 for Preview and Firestore Storage
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('স্ক্রিনশটের সাইজ সর্বোচ্চ ২ মেগাবাইট হতে হবে', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'start') {
        setStartScreenshot(result);
        showToast('শুরুর স্ক্রিনশট আপলোড সম্পন্ন!', 'success');
      } else {
        setEndScreenshot(result);
        showToast('শেষের স্ক্রিনশট আপলোড সম্পন্ন!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit Proof to Robot Engine & Admin Panel
  const handleSubmitProof = async () => {
    if (!sessionStarted) {
      showToast('প্রথমে "কাজ শুরু করুন" বাটনে ক্লিক করুন', 'warning');
      return;
    }

    if (!isTimeComplete) {
      showToast(`ন্যূনতম ${requiredSeconds} সেকেন্ড পূরণ করতে হবে। এখনও বাকি আছে!`, 'warning');
      return;
    }

    if (!startScreenshot || !endScreenshot) {
      showToast('ভিডিওর শুরু এবং শেষের ২টি স্ক্রিনশটই আপলোড করা বাধ্যতামূলক!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitJobProof({
        jobId: job.id,
        jobTitle: job.title,
        startScreenshotUrl: startScreenshot,
        endScreenshotUrl: endScreenshot,
        requiredSeconds,
        spentSeconds: secondsSpent,
        proofText: proofNote.trim(),
        reward: rewardAmount
      });

      if (res.success) {
        setIsSubmitted(true);
        showToast('🎉 প্রমাণ সফলভাবে জমা হয়েছে! অ্যাডমিন প্যানেল ভেরিফাই করে ব্যালেন্স যুক্ত করবে।', 'success');
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
        <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-md text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-base text-gray-900">কাজের প্রমাণ সফলভাবে গৃহীত হয়েছে!</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            আপনার সাবমিশন অ্যাডমিন প্যানেলে রিভিউ তালিকায় পাঠানো হয়েছে। অ্যাডমিন ভেরিফাই করা মাত্রই আপনার একাউন্টে <strong>৳{rewardAmount.toFixed(2)}</strong> যুক্ত হয়ে যাবে।
          </p>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
          >
            অন্যান্য অফারে ফিরে যান
          </button>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs space-y-3.5">
          <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>কাজের স্ক্রিনশট প্রমাণ আপলোড (বাধ্যতামূলক)</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Start Screenshot */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-2.5 text-center bg-gray-50/50 hover:bg-emerald-50/30 transition-all relative">
              <span className="text-[10px] font-bold text-gray-700 block mb-1.5">১. শুরুর স্ক্রিনশট</span>
              {startScreenshot ? (
                <div className="relative">
                  <img src={startScreenshot} alt="Start proof" className="w-full h-24 object-cover rounded-xl border border-emerald-300" />
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white p-1 rounded-full text-[9px]">
                    <Check className="w-3 h-3" />
                  </span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-700">ছবি সিলেক্ট করুন</span>
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
              <span className="text-[10px] font-bold text-gray-700 block mb-1.5">২. শেষের স্ক্রিনশট</span>
              {endScreenshot ? (
                <div className="relative">
                  <img src={endScreenshot} alt="End proof" className="w-full h-24 object-cover rounded-xl border border-emerald-300" />
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white p-1 rounded-full text-[9px]">
                    <Check className="w-3 h-3" />
                  </span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-[10px] font-bold text-emerald-700">ছবি সিলেক্ট করুন</span>
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

          {/* Proof Note */}
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">অতিরিক্ত নোট / তথ্য (ঐচ্ছিক):</label>
            <input 
              type="text" 
              value={proofNote} 
              onChange={(e) => setProofNote(e.target.value)} 
              placeholder="ইউটিউব ইউজারনেম বা চ্যানেলের নাম লিখুন" 
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs" 
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitProof}
            disabled={isSubmitting || !isTimeComplete}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
              isTimeComplete 
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-emerald-600/30 cursor-pointer active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting ? 'রোবট ভেরিফিকেশন ও সাবমিট হচ্ছে...' : (
                isTimeComplete ? `প্রমাণ সাবমিট করুন (রিওয়ার্ড ৳${rewardAmount.toFixed(2)})` : `টাইমার বাকি আছে (${requiredSeconds - secondsSpent}s)`
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
