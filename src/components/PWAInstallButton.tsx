import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'banner' | 'button' | 'compact' }> = ({ 
  variant = 'banner' 
}) => {
  const { canInstall, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    await triggerInstall();
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
          title="অ্যাপ ইনস্টল করুন"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ইনস্টল</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-5 max-w-xs text-center space-y-3 border border-emerald-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <Share className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">আইফোনে ইনস্টল করার নিয়ম</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Safari ব্রাউজারের নিচে <strong>Share বাটনে</strong> ট্যাপ করুন, তারপর স্ক্রোল করে <strong>'Add to Home Screen'</strong> সিলেক্ট করুন।
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                বুঝেছি
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-green-700 text-white p-2.5 px-3 shadow-sm flex items-center justify-between gap-2 border border-emerald-500/40">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-emerald-200" />
          </div>
          <div className="truncate">
            <span className="font-extrabold text-xs block truncate">JME Ads অ্যাপ</span>
            <span className="text-[10px] text-emerald-200">১ ক্লিকে ইনস্টল করুন</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-xs hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>ইনস্টল</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-xs text-center space-y-3 border border-emerald-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Share className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm text-gray-900">আইফোনে ইনস্টল করার নিয়ম</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Safari ব্রাউজারের নিচে <strong>Share বাটনে</strong> ট্যাপ করুন, তারপর স্ক্রোল করে <strong>'Add to Home Screen'</strong> সিলেক্ট করুন।
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </>
  );
};
