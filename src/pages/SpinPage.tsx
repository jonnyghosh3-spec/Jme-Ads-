import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCw, 
  ArrowLeft
} from 'lucide-react';

export const SpinPage: React.FC = () => {
  const { user, spinWheel, setActiveTab, showToast } = useApp();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastWin, setLastWin] = useState<number | null>(null);

  // 8 segments with balanced colors
  const segments = [
    { label: '৳১', reward: 1, color: '#059669', textColor: '#FFFFFF' },
    { label: 'চেষ্টা', reward: 0, color: '#475569', textColor: '#F1F5F9' },
    { label: '৳২', reward: 2, color: '#10B981', textColor: '#FFFFFF' },
    { label: '৳৫', reward: 5, color: '#D97706', textColor: '#FFFFFF' },
    { label: 'মিস', reward: 0, color: '#64748B', textColor: '#F8FAFC' },
    { label: '৳১০', reward: 10, color: '#7C3AED', textColor: '#FFFFFF' },
    { label: '৳১', reward: 1, color: '#047857', textColor: '#FFFFFF' },
    { label: 'আবার', reward: 0, color: '#475569', textColor: '#F1F5F9' }
  ];

  const spinsLeft = Math.max(0, 3 - (user?.dailySpinCount || 0));

  const handleSpin = () => {
    if (spinning) return;
    if (spinsLeft <= 0) {
      showToast('আজকের ৩টি স্পিনের সীমা শেষ! কাল আবার চেষ্টা করুন।', 'warning');
      return;
    }

    setSpinning(true);
    setLastWin(null);

    const result = spinWheel();
    if (!result.success) {
      showToast(result.message || 'স্পিন করা সম্ভব নয়', 'error');
      setSpinning(false);
      return;
    }

    // Calculate rotation to land on result.index
    // Segment index 0 is at top (-90 deg offset in SVG, pointer is at top)
    const segmentAngle = 360 / segments.length; // 45 deg
    // The top pointer points to angle 0 (or 270 deg in canvas). In CSS rotate, top is 0 deg.
    // Segment i occupies [i * 45, (i + 1) * 45]. Its center is i * 45 + 22.5 deg.
    const targetAngle = 360 - (result.index * segmentAngle + segmentAngle / 2);
    const extraRounds = 6 * 360; // 6 full rotations
    const finalRotation = rotation + extraRounds + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setLastWin(result.reward);

      if (result.reward > 0) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#8B5CF6']
        });
        showToast(`🎉 অভিনন্দন! আপনি ৳${result.reward} জিতেছেন!`, 'success');
      } else {
        showToast('দুঃখিত, কোনো পুরষ্কার পাননি। আবার চেষ্টা করুন!', 'info');
      }
    }, 4200);
  };

  // Helper for generating SVG pie slice paths perfectly centered
  const getCoordinatesForPercent = (percent: number, radius: number = 100) => {
    const x = Math.cos(2 * Math.PI * percent) * radius;
    const y = Math.sin(2 * Math.PI * percent) * radius;
    return [x, y];
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-lg text-emerald-950">লাকি স্পিন হুইল</h2>
      </div>

      {/* Main Wheel Card */}
      <div className="rounded-3xl bg-white border border-emerald-100 p-6 shadow-xs text-center relative overflow-hidden">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 mx-auto w-fit mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>দৈনিক ফ্রি স্পিন: {spinsLeft} / ৩ বাকি</span>
        </div>

        {/* Wheel Container with Perfect Geometry */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
          
          {/* Pointer needle centered on top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-7 h-9 text-red-600 drop-shadow-lg">
            <svg viewBox="0 0 24 28" fill="currentColor" className="w-full h-full filter drop-shadow">
              <path d="M12 28L3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10L12 28Z" />
              <circle cx="12" cy="10" r="3.5" fill="#FFFFFF" />
            </svg>
          </div>

          {/* Rotating Wheel using SVG for 100% precision & centered text */}
          <div
            className="w-full h-full rounded-full border-[6px] border-emerald-800 shadow-2xl overflow-hidden transition-transform duration-[4200ms] ease-out bg-emerald-950"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="-100 -100 200 200" className="w-full h-full transform -rotate-90">
              {segments.map((seg, i) => {
                const startPercent = i / 8;
                const endPercent = (i + 1) / 8;
                const [startX, startY] = getCoordinatesForPercent(startPercent);
                const [endX, endY] = getCoordinatesForPercent(endPercent);
                
                // SVG arc path for sector
                const pathData = `M 0 0 L ${startX} ${startY} A 100 100 0 0 1 ${endX} ${endY} Z`;

                // Center angle for label placement (radial offset)
                const midAngle = (i + 0.5) * 45; // in degrees
                const labelRadius = 65;
                const rad = (midAngle * Math.PI) / 180;
                const labelX = Math.cos(rad) * labelRadius;
                const labelY = Math.sin(rad) * labelRadius;

                return (
                  <g key={i}>
                    <path
                      d={pathData}
                      fill={seg.color}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    {/* Centered label inside each sector */}
                    <text
                      x={labelX}
                      y={labelY}
                      fill={seg.textColor}
                      fontSize="11"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngle + 90}, ${labelX}, ${labelY})`}
                      className="font-english select-none"
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Golden / Emerald Center Hub */}
          <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-lg border-4 border-emerald-900 flex flex-col items-center justify-center text-emerald-950 font-black text-xs z-20 select-none">
            <span className="leading-none">JME</span>
            <span className="text-[8px] font-bold text-emerald-800 leading-none">SPIN</span>
          </div>
        </div>

        {/* Spin CTA button */}
        <button
          onClick={handleSpin}
          disabled={spinning || spinsLeft <= 0}
          className={`w-full max-w-xs mx-auto py-3.5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${
            spinning || spinsLeft <= 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-emerald-500/30'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
          <span>{spinning ? 'স্পিন ঘুরছে...' : spinsLeft > 0 ? 'স্পিন করুন!' : 'আজকের সীমা শেষ'}</span>
        </button>

        {/* Last win celebration text */}
        {lastWin !== null && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-xs animate-in fade-in">
            {lastWin > 0 
              ? `🎉 আপনি ৳${lastWin} টাকা জিতেছেন!` 
              : 'পরের স্পিনে আবার চেষ্টা করুন!'}
          </div>
        )}
      </div>
    </div>
  );
};
