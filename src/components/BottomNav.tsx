import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  CheckSquare, 
  Users, 
  Wallet, 
  User,
  Headphones
} from 'lucide-react';

export const BottomNav: React.FC<{ onOpenSupport: () => void }> = ({ onOpenSupport }) => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <>
      {/* Floating Support Button (Bottom Right, above nav) */}
      <div className="fixed bottom-22 right-4 z-40">
        <button
          onClick={onOpenSupport}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-2 border-white hover:scale-105 active:scale-95 transition-all group relative"
          title="কাস্টমার সাপোর্ট"
        >
          <Headphones className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
          <span className="sr-only">সাপোর্ট</span>
        </button>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-100 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto px-4 h-18 flex items-center justify-between relative">
          
          {/* 1. TASKS */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
              activeTab === 'tasks' ? 'text-emerald-700 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'tasks' ? 'bg-emerald-50' : ''}`}>
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">টাস্ক</span>
          </button>

          {/* 2. TEAM */}
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
              activeTab === 'team' ? 'text-emerald-700 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'team' ? 'bg-emerald-50' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">টিম</span>
          </button>

          {/* 3. HOME (Center Elevated Floating Button) */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 text-white shadow-emerald-500/50 scale-105 ring-4 ring-white'
                  : 'bg-gradient-to-tr from-emerald-600 to-green-500 text-white shadow-emerald-600/30 hover:scale-105 ring-4 ring-white'
              }`}
            >
              <Home className="w-7 h-7" />
            </button>
            <span className={`text-[11px] mt-1 font-bold ${
              activeTab === 'home' ? 'text-emerald-700' : 'text-gray-500'
            }`}>
              হোম
            </span>
          </div>

          {/* 4. WITHDRAW */}
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
              activeTab === 'withdraw' ? 'text-emerald-700 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'withdraw' ? 'bg-emerald-50' : ''}`}>
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">উত্তোলন</span>
          </button>

          {/* 5. ACCOUNT */}
          <button
            onClick={() => setActiveTab('account')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 transition-all ${
              activeTab === 'account' ? 'text-emerald-700 font-bold scale-105' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'account' ? 'bg-emerald-50' : ''}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">একাউন্ট</span>
          </button>

        </div>
      </nav>
    </>
  );
};
