import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { compressImage } from '../utils/imageCompressor';
import { analyzeJobProof } from '../utils/aiVerification';
import { 
  X, 
  ExternalLink, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Camera, 
  Bot, 
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SubscribeTaskModalProps {
  type: 'youtube' | 'telegram' | null;
  onClose: () => void;
}

export const SubscribeTaskModal: React.FC<SubscribeTaskModalProps> = ({ type, onClose }) => {
  const { user, settings, submitJobProof, showToast } = useApp();

  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotSizeKb, setScreenshotSizeKb] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!type) return null;

  const isYouTube = type === 'youtube';
  const jobId = isYouTube ? 'mj_subscribe_2' : 'mj_telegram_4';
  const jobTitle = isYouTube 
    ? 'ইউটিউব চ্যানেল সাবস্ক্রাইব ও বেল আইকন' 
    : 'টেলিগ্রাম চ্যানেল সাবস্ক্রাইব ও জয়েন';

  const defaultUrl = isYouTube
    ? (settings.youtubeVideo1Url || settings.youtubeTutorialUrl || 'https://www.youtube.com')
    : (settings.telegramUrl && settings.telegramUrl.trim() !== '' ? settings.telegramUrl.trim() : 'https://t.me/JMEAds_Official');

  const rewardAmount = 20;
  const isAlreadyDone = Boolean(user?.completedMicroJobs?.[jobId]);

  const handleOpenLink = () => {
    setHasOpenedLink(true);
    window.open(defaultUrl, '_blank', 'noopener,noreferrer');
    showToast(`${isYouTube ? 'ইউটিউব' : 'টেলিগ্রাম'} ওপেন হয়েছে। সাবস্ক্রাইব করে স্ক্রিনশট নিন।`, 'info');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      showToast('ছবি ১০০ কেবির নিচে কম্প্রেস করা হচ্ছে...', 'info');
      const compressed = await compressImage(file, 100);
      setScreenshot(compressed.dataUrl);
      setScreenshotSizeKb(compressed.sizeKb);
      showToast(`✓ স্ক্রিনশট প্রস্তুত (${compressed.sizeKb} KB)! এখন ভেরিফাই বাটনে ক্লিক করুন।`, 'success');
    } catch (err: any) {
      showToast('ছবি প্রসেস করতে ব্যর্থ হয়েছে: ' + err.message, 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleVerifyAndClaim = async () => {
    if (!user) {
      showToast('পুরস্কার সংগ্রহ করতে প্রথমে লগইন করুন', 'warning');
      return;
    }

    if (!screenshot) {
      showToast('অনুগ্রহ করে সাবস্ক্রাইব করার প্রমাণস্বরূপ একটি স্ক্রিনশট আপলোড করুন!', 'error');
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Run Automated Engine / AI Image Analytics
      const aiReport = await analyzeJobProof({
        requiredSeconds: 15,
        spentSeconds: 20,
        startScreenshotUrl: screenshot,
        endScreenshotUrl: screenshot,
        startSizeKb: screenshotSizeKb,
        endSizeKb: screenshotSizeKb,
        proofText: `${isYouTube ? 'YouTube' : 'Telegram'} Subscribe Verification Screenshot`
      });

      // 2. Submit with AI Auto-Approval (ইঞ্জিন নিজে থেকেই অনুমোদন দেবে)
      const res = await submitJobProof({
        jobId,
        jobTitle,
        startScreenshotUrl: screenshot,
        endScreenshotUrl: screenshot,
        requiredSeconds: 15,
        spentSeconds: 20,
        proofText: `Verified Subscription via ${isYouTube ? 'YouTube' : 'Telegram'}`,
        reward: rewardAmount,
        aiAnalytics: aiReport
      });

      if (res.success) {
        setIsCompleted(true);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast(`🎉 অভিনন্দন! ইঞ্জিন সফলভাবে আপনার সাবস্ক্রিপশন যাচাই করেছে। ৳${rewardAmount}.০০ আপনার ব্যালেন্সে যোগ হয়েছে!`, 'success');
      } else {
        showToast(res.message || 'যাচাই ব্যর্থ হয়েছে', 'error');
      }
    } catch (err: any) {
      showToast('এরর: ' + err.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative border border-emerald-100 transform animate-in zoom-in-95 duration-200 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs ${
              isYouTube ? 'bg-red-600' : 'bg-sky-500'
            }`}>
              {isYouTube ? (
                <span className="text-sm font-black">YT</span>
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white ${
                  isYouTube ? 'bg-red-600' : 'bg-sky-500'
                }`}>
                  {isYouTube ? 'ইউটিউব টাস্ক' : 'টেলিগ্রাম টাস্ক'}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  অটো ইঞ্জিন ভেরিফাই
                </span>
              </div>
              <h3 className="font-extrabold text-sm text-gray-900 mt-0.5">
                {isYouTube ? 'ইউটিউব চ্যানেল সাবস্ক্রাইব' : 'টেলিগ্রাম চ্যানেল সাবস্ক্রাইব'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reward Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
              নিশ্চিত পুরস্কার
            </span>
            <span className="text-xl font-black text-emerald-700 font-english">
              ৳{rewardAmount}.০০
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-1 rounded-lg inline-flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-emerald-700" />
              <span>ইঞ্জিন অটো-পেমেন্ট</span>
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-1.5">
          <span className="font-bold text-gray-900 flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>কীভাবে কাজ সম্পন্ন করবেন:</span>
          </span>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600 font-medium">
            <li>নিচের বাটনে ক্লিক করে {isYouTube ? 'ইউটিউব চ্যানেলে গিয়ে সাবস্ক্রাইব' : 'টেলিগ্রাম চ্যানেলে জয়েন/সাবস্ক্রাইব'} করুন।</li>
            <li>সাবস্ক্রাইব করার পর একটি স্পষ্ট স্ক্রিনশট নিন।</li>
            <li>স্ক্রিনশটটি আপলোড করে ভেরিফাই বাটনে ক্লিক করুন।</li>
            <li>ইঞ্জিন নিজে থেকেই স্ক্রিনশট যাচাই করে সাথে সাথে <strong>৳২০.০০</strong> আপনার ব্যালেন্সে যোগ করবে!</li>
          </ol>
        </div>

        {/* Already Done Status */}
        {isAlreadyDone || isCompleted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-emerald-950">কাজটি সফলভাবে সম্পন্ন হয়েছে!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                আপনার অ্যাকাউন্টে ৳২০.০০ পুরস্কার যোগ করা হয়েছে।
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Step 1: Open Link Button */}
            <button
              onClick={handleOpenLink}
              className={`w-full py-3 px-4 rounded-2xl text-white font-extrabold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isYouTube 
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30' 
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-sky-600/30'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>১. {isYouTube ? 'ইউটিউব চ্যানেল ওপেন ও সাবস্ক্রাইব করুন' : 'টেলিগ্রাম চ্যানেলে জয়েন/সাবস্ক্রাইব করুন'}</span>
            </button>

            {/* Step 2: Upload Screenshot */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 block">
                ২. সাবস্ক্রাইব করার স্ক্রিনশট আপলোড করুন:
              </label>

              <label className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 cursor-pointer transition-colors relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isCompressing}
                  className="hidden"
                />

                {screenshot ? (
                  <div className="w-full flex items-center justify-between gap-2">
                    <img 
                      src={screenshot} 
                      alt="Screenshot Proof" 
                      className="w-14 h-14 object-cover rounded-xl border border-emerald-400"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>স্ক্রিনশট রেডি</span>
                      </span>
                      <span className="text-[10px] text-gray-500 font-english block">
                        সাইজ: {screenshotSizeKb} KB (১০০ কেবির নিচে)
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-1 rounded-md">
                      পরিবর্তন
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {isCompressing ? 'ছবি প্রসেস হচ্ছে...' : 'স্ক্রিনশট নির্বাচন করুন'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      ক্যামেরা বা গ্যালারি থেকে স্ক্রিনশট দিন (অটো কম্প্রেস)
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Step 3: Verify and Claim Button */}
            <button
              onClick={handleVerifyAndClaim}
              disabled={isVerifying || isCompressing || !screenshot}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                screenshot && !isVerifying
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-emerald-600/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>
                {isVerifying ? 'ইঞ্জিন স্ক্রিনশট যাচাই করছে...' : '৩. ইঞ্জিন দিয়ে ভেরিফাই ও ৳২০ সংগ্রহ করুন'}
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
