import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { BkashLogo, NagadLogo } from './Icons';
import { useApp } from '../context/AppContext';

export const LivePayoutTicker: React.FC = () => {
  const { withdrawals, settings } = useApp();
  const [currentPayout, setCurrentPayout] = useState<{
    phone: string;
    amount: number;
    method: string;
  } | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Filter only real approved or paid withdrawals from database
  const realApprovedWithdrawals = (withdrawals || []).filter(
    w => w.status === 'approved' || w.status === 'paid'
  );

  useEffect(() => {
    // If admin disabled ticker or there are no real approved withdrawals, do not display fake names
    if (settings.showLivePayoutTicker === false || realApprovedWithdrawals.length === 0) {
      setCurrentPayout(null);
      return;
    }

    let currentIndex = 0;
    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    const showNextRealPayout = () => {
      if (realApprovedWithdrawals.length === 0) return;
      const w = realApprovedWithdrawals[currentIndex % realApprovedWithdrawals.length];
      currentIndex++;

      const maskedPhone = w.accountNumber 
        ? (w.accountNumber.slice(0, 3) + '****' + w.accountNumber.slice(-3))
        : '017****';

      setCurrentPayout({
        phone: maskedPhone,
        amount: w.amount,
        method: w.method || 'bKash'
      });
      setIsAnimatingOut(false);

      hideTimer = setTimeout(() => {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setCurrentPayout(null);
          setIsAnimatingOut(false);
          nextTimer = setTimeout(showNextRealPayout, 8000);
        }, 400);
      }, 4500);
    };

    const initialTimer = setTimeout(showNextRealPayout, 4000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [realApprovedWithdrawals.length, settings.showLivePayoutTicker]);

  if (!currentPayout) return null;

  return (
    <div
      className={`fixed bottom-28 left-4 z-40 max-w-[280px] sm:max-w-[320px] pointer-events-auto transition-all duration-300 ${
        isAnimatingOut 
          ? 'animate-out fade-out slide-out-to-bottom-4 duration-300 pointer-events-none' 
          : 'animate-in fade-in slide-in-from-bottom-5 duration-300'
      }`}
    >
      <div className="relative overflow-hidden bg-slate-950/95 backdrop-blur-md text-white p-3 pr-8 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2.5">
        
        {/* Method Logo */}
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 p-1 border border-white/15">
          {currentPayout.method.toLowerCase().includes('bkash') ? (
            <BkashLogo className="w-7 h-7 object-contain" />
          ) : (
            <NagadLogo className="w-7 h-7 object-contain" />
          )}
        </div>

        {/* Details with Real Masked Mobile Number & Amount */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[11px] text-emerald-300 font-mono">
              {currentPayout.phone}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>

          <div className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
            <span>উত্তোলন অনুমোদিত:</span>
            <strong className="text-amber-400 font-english font-bold">
              ৳{currentPayout.amount.toLocaleString()}
            </strong>
            <span className="text-[9px] text-emerald-400 font-english font-semibold">• {currentPayout.method}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setCurrentPayout(null)}
          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
