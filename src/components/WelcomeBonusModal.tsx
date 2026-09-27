import React from 'react';
import { Gift, Wallet } from 'lucide-react';

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClaim: () => void;
  bonusAmount?: number;
}

export const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({
  isOpen,
  onClaim,
  bonusAmount = 120
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4 border border-emerald-100 transform animate-in zoom-in-95 duration-200">
        
        {/* Gift Icon Badge */}
        <div className="mx-auto w-18 h-18 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center shadow-inner">
          <div className="w-13 h-13 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
            <Gift className="w-7 h-7" />
          </div>
        </div>

        {/* Title & Amount */}
        <div className="space-y-1">
          <h3 className="text-xl font-black text-gray-900 flex items-center justify-center gap-1.5">
            <span>অভিনন্দন!</span>
            <span>🎉</span>
          </h3>
          <p className="text-sm text-gray-700 font-semibold">
            আপনি <strong className="text-emerald-700 font-extrabold font-english text-base">৳{bonusAmount}</strong> বোনাস পেয়েছেন! ৳
          </p>
        </div>

        {/* Claim Button */}
        <button
          onClick={onClaim}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Wallet className="w-4 h-4" />
          <span>বোনাস গ্রহণ করুন</span>
        </button>

      </div>
    </div>
  );
};
