import React, { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { BkashLogo, NagadLogo } from './Icons';

interface LivePayout {
  name: string;
  phone: string;
  amount: number;
  method: 'bKash' | 'Nagad';
}

// 100+ authentic Bangladeshi names (mostly Muslim with authentic Hindu names as well)
const BANGLA_NAMES = [
  'Md. Shakil Khan', 'Arif Hossain', 'Tanvir Ahmed', 'Nusrat Jahan', 'Farhana Akter',
  'Sabbir Rahman', 'Nahidul Islam', 'Rifat Hasan', 'Mehedi Hasan', 'Jannatul Ferdous',
  'Kamrul Hassan', 'Rakib Sheikh', 'Shoriful Islam', 'Sadia Afrin', 'Imran Hossain',
  'Rubel Mia', 'Shohel Rana', 'Fatema Tuz Zohra', 'Sharmin Sultana', 'Al-Amin Mia',
  'Ashiqur Rahman', 'Shahadat Hossain', 'Mahmudul Hasan', 'Sumon Mia', 'Mizanur Rahman',
  'Abdur Rahim', 'Hasibul Islam', 'Biplob Hossain', 'Rokibul Islam', 'Khadija Begum',
  'Fahim Montasir', 'Taslima Khatun', 'Saiful Islam', 'Nurul Amin', 'Jahidul Islam',
  'Asif Mahmud', 'Hasan Al Mamun', 'Shahinur Rahman', 'Mustafizur Rahman', 'Pori Moni',
  'Maruf Billah', 'Sajjad Hossain', 'Sonia Akter', 'Nazmul Huda', 'Zubair Ahmed',
  'Priya Dhar', 'Subhash Roy', 'Anik Saha', 'Biplob Kumar Ghosh', 'Polash Chandra',
  'Soumya Sarkar', 'Liton Das', 'Khokon Chandra', 'Dipu Moni', 'Shanto Islam',
  'Rasel Mia', 'Noman Ali', 'Sazzad Karim', 'Mitu Akter', 'Shafiqul Islam',
  'Golam Rabbani', 'Monir Hossain', 'Sharif Uddin', 'Sujan Ahmed', 'Shariful Raj',
  'Tamim Iqbal', 'Mustafiz Mia', 'Habibur Rahman', 'Rezaul Karim', 'Tariqul Islam',
  'Anwar Hossain', 'Masud Rana', 'Helal Uddin', 'Babul Mia', 'Delwar Hossain',
  'Abdul Mannan', 'Nasimul Gani', 'Faruk Ahmed', 'Shamim Reza', 'Shakib Al Hasan',
  'Mushfiqur Rahim', 'Mahmudullah Riyad', 'Nasir Hossain', 'Taskin Ahmed', 'Ebadot Hossain',
  'Shoriful Islam', 'Afif Hossain', 'Towhid Hridoy', 'Mehidy Hasan Miraz', 'Najmul Hossain',
  'Zakir Hasan', 'Nurul Hasan Sohan', 'Taijul Islam', 'Khaled Ahmed', 'Shamim Hossain',
  'Rishad Hossain', 'Tanzid Hasan', 'Tanzim Sakib', 'Jisan Mia', 'Mashrafe Mortaza'
];

const PAYOUT_AMOUNTS = [1000, 1200, 1500, 2000, 2500, 3000, 3500, 5000];
const OPERATORS = ['017', '018', '019', '016', '013', '014'];

export const LivePayoutTicker: React.FC = () => {
  const [currentPayout, setCurrentPayout] = useState<LivePayout | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    // Show a new payout message, keep it for 4.5 seconds with shrink progress line, then animate out
    const showNewPayout = () => {
      const randomName = BANGLA_NAMES[Math.floor(Math.random() * BANGLA_NAMES.length)];
      const randomAmount = PAYOUT_AMOUNTS[Math.floor(Math.random() * PAYOUT_AMOUNTS.length)];
      const randomMethod: 'bKash' | 'Nagad' = Math.random() > 0.45 ? 'bKash' : 'Nagad';
      const op = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
      const lastDigits = Math.floor(10 + Math.random() * 90);
      const maskedPhone = `${op}****${lastDigits}`;

      setCurrentPayout({
        name: randomName,
        phone: maskedPhone,
        amount: randomAmount,
        method: randomMethod
      });
      setIsAnimatingOut(false);

      // Duration visible: 4.5s
      hideTimer = setTimeout(() => {
        setIsAnimatingOut(true);
        // Wait for exit animation to complete, then clear message and pause before next one
        setTimeout(() => {
          setCurrentPayout(null);
          setIsAnimatingOut(false);

          // 5 messages per minute = 60s / 5 = ~12s cycle total
          // (4.5s display + 0.4s fade + ~7s idle pause between notifications)
          const pauseBetween = 6500 + Math.floor(Math.random() * 2000);
          nextTimer = setTimeout(showNewPayout, pauseBetween);
        }, 400);
      }, 4500);
    };

    // First trigger after 3 seconds on page
    const initialTimer = setTimeout(showNewPayout, 3000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setCurrentPayout(null);
      setIsAnimatingOut(false);
    }, 300);
  };

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
          {currentPayout.method === 'bKash' ? (
            <BkashLogo className="w-7 h-7 object-contain" />
          ) : (
            <NagadLogo className="w-7 h-7 object-contain" />
          )}
        </div>

        {/* Details with Name, Masked Mobile Number, Amount */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-[11px] text-emerald-300 truncate max-w-[140px]">
              {currentPayout.name}
            </span>
            <span className="text-[10px] text-gray-300 font-mono font-semibold tracking-wide">
              ({currentPayout.phone})
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>

          <div className="text-[10px] text-gray-300 flex items-center gap-1 mt-0.5">
            <span>উত্তোলন সফল:</span>
            <strong className="text-amber-400 font-english font-bold">
              ৳{currentPayout.amount.toLocaleString()}
            </strong>
            <span className="text-[9px] text-emerald-400 font-english font-semibold">• {currentPayout.method}</span>
          </div>
        </div>

        {/* Close / Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2.5 right-2 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title="বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Shrinking Animated Progress Line at the Top (from 100% to 0%) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-green-300 animate-toast-progress" />
        </div>
      </div>
    </div>
  );
};
