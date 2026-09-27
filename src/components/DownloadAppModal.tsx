import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  CheckCircle, 
  Smartphone, 
  Share, 
  Sparkles, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jmeads.com';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallPwa = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setInstallPrompt(null);
    } else {
      // Direct Web Launcher Download
      handleDownloadAppFile();
    }
  };

  const handleDownloadAppFile = () => {
    // Generate an installable web shortcut file that mobile devices recognize
    const content = `[InternetShortcut]\nURL=${websiteUrl}\nIconIndex=0`;
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'JME-Ads-Official-App.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white mx-auto flex items-center justify-center shadow-xl shadow-emerald-600/30 mb-3">
            <Smartphone className="w-8 h-8" />
          </div>
          <h3 className="font-black text-xl text-emerald-950">JME Ads অফিসিয়াল অ্যাপ</h3>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">
            মোবাইলে অ্যাপ আকারে দ্রুত ও সহজে কাজ করুন
          </p>
        </div>

        {/* Website URL Box with Copy Button */}
        <div className="space-y-2 mb-4">
          <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            ওয়েবসাইট ইউআরএল (App Web URL)
          </label>
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-emerald-950 font-english font-medium truncate select-all">
              {websiteUrl}
            </span>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-xs"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Download / Install Action */}
        <div className="space-y-3 mb-5">
          <button
            onClick={handleInstallPwa}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>{isInstalled ? 'অ্যাপটি ইতিমধ্যেই ইনস্টল আছে' : 'সরাসরি অ্যাপ ডাউনলোড / ইনস্টল করুন'}</span>
          </button>

          <button
            onClick={handleDownloadAppFile}
            className="w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4" />
            <span>অ্যাপ ফাইল (.URL শর্টকাট) ডাউনলোড</span>
          </button>
        </div>

        {/* 3 Step Installation Guide */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2.5 text-xs">
          <span className="font-bold text-gray-800 block text-[11px]">
            📲 মোবাইলের স্ক্রিনে যেভাবে যোগ করবেন:
          </span>
          
          <div className="space-y-2 text-gray-600">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                ১
              </span>
              <span>মোবাইলের ক্রোম ব্রাউজারের উপরে ডানদিকের থ্রি-ডট (⋮) মেনুতে ট্যাপ করুন।</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                ২
              </span>
              <span>তালিকা থেকে <strong className="text-emerald-800 font-semibold">"Install app"</strong> অথবা <strong className="text-emerald-800 font-semibold">"Add to Home screen"</strong> চাপুন।</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                ৩
              </span>
              <span>আপনার মোবাইল ডিসপ্লেতে সরাসরি অ্যাপ আইকন চলে আসবে এবং সেখান থেকেই সহজে ব্যবহার করতে পারবেন!</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
