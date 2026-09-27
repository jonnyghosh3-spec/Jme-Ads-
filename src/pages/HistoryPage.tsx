import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, History, ArrowDownRight, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { transactions, withdrawals, user, setActiveTab } = useApp();
  const [tab, setTab] = useState<'income' | 'withdraw'>('income');

  const userTxns = transactions.filter(t => t.uid === user?.uid);
  const userWithdrawals = withdrawals.filter(w => w.uid === user?.uid);

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-2xl bg-white border border-emerald-100 text-emerald-800 hover:bg-emerald-50 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-lg text-emerald-950">হিস্ট্রি ও লেনদেন বিবরণী</h2>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-emerald-100 shadow-2xs text-xs font-semibold">
        <button
          onClick={() => setTab('income')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            tab === 'income' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          আয় হিস্ট্রি ({userTxns.length})
        </button>
        <button
          onClick={() => setTab('withdraw')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            tab === 'withdraw' ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'text-gray-600'
          }`}
        >
          উত্তোলন হিস্ট্রি ({userWithdrawals.length})
        </button>
      </div>

      {/* Income Records */}
      {tab === 'income' && (
        <div className="space-y-2">
          {userTxns.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-emerald-100 p-6 text-xs text-gray-400">
              এখনও কোনো আয়ের লেনদেন নেই।
            </div>
          ) : (
            userTxns.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    t.amount >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {t.amount >= 0 ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{t.description}</h4>
                    <p className="text-[10px] text-gray-400 font-english">
                      {new Date(t.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-black font-english ${
                    t.amount >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {t.amount >= 0 ? '+' : ''}৳{t.amount.toFixed(2)}
                  </span>
                  <p className="text-[10px] text-gray-400 font-english">
                    ব্যালেন্স: ৳{t.balanceAfter.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Withdraw Records */}
      {tab === 'withdraw' && (
        <div className="space-y-2">
          {userWithdrawals.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-3xl border border-emerald-100 p-6 text-xs text-gray-400">
              এখনও কোনো উত্তোলনের রেকর্ড নেই।
            </div>
          ) : (
            userWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-gray-900 font-english">
                    {w.method} ({w.accountNumber})
                  </h4>
                  <p className="text-[10px] text-gray-400 font-english">
                    {new Date(w.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black font-english text-gray-900 block">
                    -৳{w.amount.toFixed(2)}
                  </span>
                  <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                    w.status === 'paid' ? 'bg-green-100 text-green-800' :
                    w.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    w.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {w.status === 'paid' ? 'পেইড' :
                     w.status === 'approved' ? 'অনুমোদিত' :
                     w.status === 'rejected' ? 'বাতিল' : 'অপেক্ষমান'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
