import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  HelpCircle, 
  MessageSquare, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface LocalTicket {
  id: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'resolved';
}

const LOCAL_TICKETS_KEY = 'jme_local_support_tickets';

export const SupportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { settings, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'options' | 'faq' | 'ticket'>('options');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [localTickets, setLocalTickets] = useState<LocalTicket[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_TICKETS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'টাকা কীভাবে ইনকাম করব?',
      a: 'টাস্ক অপশন থেকে যেকোনো বিজ্ঞাপনে ক্লিক করে ১৫ সেকেন্ড নতুন ট্যাবে অপেক্ষা করুন। ১৫ সেকেন্ড পূর্ণ হলে আপনার একাউন্টে ৳৫ যোগ হবে। প্রতিটি লিংকে দিনে সর্বোচ্চ ৩ বার কাজ করা যাবে।'
    },
    {
      q: '১৫ সেকেন্ডের আগে ফিরে এলে কী হবে?',
      a: '১৫ সেকেন্ডের পূর্বে ওয়েবসাইটে ফিরে আসলে টাস্ক অসম্পূর্ণ বলে গণ্য হবে এবং কোনো টাকা যোগ হবে না। তাই সর্বদা সম্পূর্ণ ১৫ সেকেন্ড অপেক্ষা করুন।'
    },
    {
      q: 'সর্বনিম্ন কত টাকা উত্তোলন করা যায়?',
      a: 'সর্বনিম্ন উত্তোলন সীমা ৳১,০০০। আপনার ব্যালেন্স ৳১,০০০ বা তার বেশি হলে এবং ২০ জন রেফার পূর্ণ হলে বিকাশ বা নগদ এর মাধ্যমে উত্তোলন রিকোয়েস্ট পাঠাতে পারবেন।'
    },
    {
      q: 'রেফার করে কীভাবে আয় করব?',
      a: 'টিম পেইজ থেকে আপনার রেফারেল লিংক কপি করে বন্ধুদের সাথে শেয়ার করুন। আপনার রেফারেল কোড দিয়ে কেউ একাউন্ট তৈরি করলে আপনি সাথে সাথে ৳৫০ বোনাস পাবেন।'
    },
    {
      q: 'উত্তোলনের টাকা পেতে কত সময় লাগে?',
      a: 'উত্তোলন রিকোয়েস্ট পাঠানোর পর ৩০ মিনিট থেকে ১ ঘণ্টার মধ্যে স্বয়ংক্রিয়ভাবে বিকাশ বা নগদ নাম্বারে সরাসরি টাকা পৌঁছে যাবে।'
    }
  ];

  const handleTelegram = () => {
    if (settings.telegramUrl && settings.telegramUrl.trim() !== '') {
      window.open(settings.telegramUrl, '_blank');
    } else {
      window.open('https://t.me/JMEAds_Official', '_blank');
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('অনুগ্রহ করে বিষয় ও বিস্তারিত লিখুন।', 'warning');
      return;
    }

    // Save ONLY to LocalStorage (local disk), no database write
    const newTicket: LocalTicket = {
      id: 'tkt-' + Date.now(),
      subject: ticketSubject.trim(),
      message: ticketMessage.trim(),
      timestamp: new Date().toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'pending'
    };

    const updated = [newTicket, ...localTickets];
    setLocalTickets(updated);
    try {
      localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    setTicketSubmitted(true);
    showToast('আপনার সাপোর্ট টিকিট লোকাল স্টোরেজে সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketSubject('');
      setTicketMessage('');
      setActiveTab('options');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-100 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              🟢
            </div>
            <div>
              <h3 className="font-bold text-lg text-emerald-950">কাস্টমার সাপোর্ট</h3>
              <p className="text-xs text-emerald-700/80">আমরা আপনাকে সাহায্য করতে প্রস্তুত</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-emerald-50/70 p-1 rounded-2xl my-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('options')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'options' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-gray-600'
            }`}
          >
            সাপোর্ট মাধ্যম
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'faq' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-gray-600'
            }`}
          >
            সচরাচর জিজ্ঞাসা (FAQ)
          </button>
          <button
            onClick={() => setActiveTab('ticket')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'ticket' ? 'bg-white text-emerald-800 shadow-xs font-bold' : 'text-gray-600'
            }`}
          >
            টিকিট জমা দিন
          </button>
        </div>

        {/* 1. Support options */}
        {activeTab === 'options' && (
          <div className="space-y-3">
            <button
              onClick={handleTelegram}
              className="w-full p-4 rounded-2xl bg-sky-50 border border-sky-200 hover:bg-sky-100 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sky-950 text-sm">টেলিগ্রাম সাপোর্ট চ্যানেল</h4>
                  <p className="text-xs text-sky-700">অফিসিয়াল চ্যানেলে যুক্ত হয়ে আপডেট ও সাহায্য নিন</p>
                </div>
              </div>
              <div className="text-sky-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                যুক্ত হন →
              </div>
            </button>

            <button
              onClick={() => setActiveTab('ticket')}
              className="w-full p-4 rounded-2xl bg-purple-50 border border-purple-200 hover:bg-purple-100 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-950 text-sm">সাপোর্ট টিকিট পাঠান</h4>
                  <p className="text-xs text-purple-700">লোকাল স্টোরেজে সংরক্ষিত টিকিট তৈরি করুন</p>
                </div>
              </div>
              <div className="text-purple-600 font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                লিখুন →
              </div>
            </button>
          </div>
        )}

        {/* 2. FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-emerald-100 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-3.5 text-left font-semibold text-xs sm:text-sm text-gray-900 flex items-center justify-between bg-emerald-50/40 hover:bg-emerald-50"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="p-3.5 text-xs text-gray-600 bg-white border-t border-emerald-50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3. Ticket */}
        {activeTab === 'ticket' && (
          <div className="space-y-4">
            {ticketSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-2 animate-bounce" />
                <h4 className="font-bold text-emerald-950 text-base">টিকিট সফলভাবে সংরক্ষিত হয়েছে!</h4>
                <p className="text-xs text-gray-600 mt-1">এটি আপনার লোকাল স্টোরেজে নিরাপদে জমা আছে।</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">সমস্যার বিষয়</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: পেমেন্ট পেন্ডিং বা টাস্ক সমস্যা"
                    value={ticketSubject}
                    onChange={e => setTicketSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">বিস্তারিত বার্তা</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="আপনার সমস্যাটি বিস্তারিত লিখুন..."
                    value={ticketMessage}
                    onChange={e => setTicketMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  লোকাল ডিস্কে টিকিট জমা দিন
                </button>
              </form>
            )}

            {/* Previously saved local tickets */}
            {localTickets.length > 0 && (
              <div className="pt-3 border-t border-emerald-100">
                <h5 className="font-bold text-xs text-gray-800 mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পূর্বে জমা দেওয়া টিকিট ({localTickets.length})</span>
                </h5>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {localTickets.slice(0, 3).map(t => (
                    <div key={t.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[11px]">
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span className="truncate">{t.subject}</span>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-normal">জমা হয়েছে</span>
                      </div>
                      <p className="text-gray-600 mt-1 line-clamp-1">{t.message}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">{t.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
