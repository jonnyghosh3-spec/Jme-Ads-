import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Wallet,
  Users,
  CheckSquare,
  Gift,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MessageAction {
  label: string;
  tab: 'tasks' | 'team' | 'withdraw' | 'spin' | 'history' | 'video-ads';
  icon?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
  actions?: MessageAction[];
}

interface AIChatScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAILY_TOKEN_LIMIT = 10000;
const API_URL = 'https://api.xkiro.com/v1/chat/completions';
const MODEL_NAME = 'deepseek/deepseek-v4-pro';

export const AIChatScreen: React.FC<AIChatScreenProps> = ({ isOpen, onClose }) => {
  const { user, setActiveTab } = useApp();
  const [messages, setMessages] = useState<Message[]>(() => {
    return [
      {
        id: 'msg-init',
        sender: 'ai',
        text: `স্বাগতম ${user?.name || 'বন্ধুরা'}! আমি আপনার পার্সোনাল আর্নিং হেল্পার 🤖\n\nএখানে কীভাবে কাজ করবেন, কীভাবে রেফার করবেন এবং টাকা তুলবেন—যেকোনো প্রশ্ন করুন। আমি আপনাকে একদম বাচ্চাদের মতো সহজ করে শিখিয়ে দেব এবং কোন বাটনে চাপ দিয়ে যেতে হবে তাও নিচে দিয়ে দেব!`,
        timestamp: Date.now(),
        actions: [
          { label: 'বিজ্ঞাপন দেখে আয় শুরু করুন', tab: 'tasks' },
          { label: 'রেফার করে আয় করুন (৳৫০)', tab: 'team' },
          { label: 'টাকা উত্তোলন করুন', tab: 'withdraw' }
        ]
      }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usedTokensToday, setUsedTokensToday] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Daily token tracking per user in localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const key = `jme_ai_tokens_${today}_${user?.uid || 'guest'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setUsedTokensToday(Number(saved) || 0);
    } else {
      setUsedTokensToday(0);
    }
  }, [user]);

  const updateTokens = (addedTokens: number) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `jme_ai_tokens_${today}_${user?.uid || 'guest'}`;
    const newTotal = (usedTokensToday || 0) + addedTokens;
    setUsedTokensToday(newTotal);
    localStorage.setItem(key, newTotal.toString());
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Helper to detect action buttons from text or query
  const detectActions = (text: string, query: string): MessageAction[] => {
    const combined = (text + ' ' + query).toLowerCase();
    const actions: MessageAction[] = [];

    if (combined.includes('টাস্ক') || combined.includes('কাজ') || combined.includes('বিজ্ঞাপন') || combined.includes('task') || combined.includes('ad')) {
      actions.push({ label: '👉 টাস্ক সেকশনে যান', tab: 'tasks' });
    }
    if (combined.includes('রেফার') || combined.includes('টিম') || combined.includes('বন্ধু') || combined.includes('refer') || combined.includes('team')) {
      actions.push({ label: '👉 রেফার ও টিম সেকশন', tab: 'team' });
    }
    if (combined.includes('উত্তোলন') || combined.includes('টাকা') || combined.includes('বিকাশ') || combined.includes('নগদ') || combined.includes('withdraw') || combined.includes('payment')) {
      actions.push({ label: '👉 টাকা উত্তোলন পেজ', tab: 'withdraw' });
    }
    if (combined.includes('স্পিন') || combined.includes('spin')) {
      actions.push({ label: '👉 লাকি স্পিন খেলুন', tab: 'spin' });
    }
    if (combined.includes('হিস্ট্রি') || combined.includes('ইতিহাস') || combined.includes('history')) {
      actions.push({ label: '👉 আয় ও উইথড্র হিস্ট্রি', tab: 'history' });
    }

    return actions.slice(0, 2);
  };

  const handleSendMessage = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery || inputText).trim();
    if (!query || isLoading) return;

    // Check token budget
    if (usedTokensToday >= DAILY_TOKEN_LIMIT) {
      const limitMsg: Message = {
        id: 'limit-' + Date.now(),
        sender: 'ai',
        text: '⚠️ আপনি আজকের জন্য আপনার সর্বোচ্চ বার্তা সীমা স্পর্শ করেছেন। আগামীকাল নতুন বার্তা পাঠাতে পারবেন অথবা যেকোনো প্রয়োজনে নিচের সেকশনগুলো ব্যবহার করুন।',
        timestamp: Date.now(),
        actions: [
          { label: 'কাজ শুরু করুন', tab: 'tasks' },
          { label: 'রেফার লিংক দেখুন', tab: 'team' }
        ]
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const systemPrompt = `You are the friendly, patient, and highly expert AI Assistant for the platform "JME Ads BD" (website: JME Ads).
Your mission is to directly answer the user's EXACT question with tailored precision. DO NOT repeat the exact same canned message on every question.

CRITICAL INSTRUCTIONS:
1. Direct Specific Answers:
   - If user asks about Tasks (কাজ/বিজ্ঞাপন): Focus on how to open Tasks, click an ad, stay 15 seconds, earn ৳5 per ad.
   - If user asks about Referral (রেফার): Focus on going to Team page, copying referral link, getting ৳50 per friend, and emphasize that 20 referrals are needed to withdraw.
   - If user asks about Withdrawal (উত্তোলন/বিকাশ/নগদ): Focus on minimum ৳1,000, 20 referrals requirement, selecting bKash/Nagad, and 30-60 min auto approval.
   - If user asks about Account/Spin/History: Answer specifically about that section.
2. Teach clearly and warmly like a friend (বাচ্চাদের মতো সহজ ও সাবলীল বাংলায়)।
3. Multi-language: Respond in Bengali, English, or Banglish according to user input.
4. Boundaries: If asked about topics outside JME Ads (politics, sports, external coding, cinema), politely refuse and say you only help with JME Ads.`;

    const estimatedInputTokens = Math.ceil(query.length / 3) + 150;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-4).map(m => ({
              role: m.sender === 'ai' ? 'assistant' : 'user',
              content: m.text
            })),
            { role: 'user', content: query }
          ],
          temperature: 0.6,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const aiReply = data?.choices?.[0]?.message?.content;

      if (!aiReply || aiReply.trim() === '') {
        throw new Error('Empty response from AI');
      }

      const tokensConsumed = data?.usage?.total_tokens || (estimatedInputTokens + Math.ceil(aiReply.length / 3));
      updateTokens(tokensConsumed);

      const generatedActions = detectActions(aiReply, query);

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        timestamp: Date.now(),
        actions: generatedActions
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('AI endpoint fetch issue, answering with context-specific intelligence:', err);
      
      // Dynamic intelligent answers based on exact question (never repetition of identical boilerplate)
      const q = query.toLowerCase();
      let dynamicReply = '';
      let specificActions: MessageAction[] = [];

      if (q.includes('টাস্ক') || q.includes('কাজ') || q.includes('বিজ্ঞাপন') || q.includes('আয়') || q.includes('ইনকাম') || q.includes('task') || q.includes('earn')) {
        dynamicReply = `কাজ করার নিয়মটি খুব সহজ:\n\n১. নিচে দেওয়া বাটনে ক্লিক করে "টাস্ক" সেকশনে যান।\n২. যেকোনো একটি বিজ্ঞাপনের ওপর চাপ দিন।\n৩. নতুন পেজ খুললে পুরো ১৫ সেকেন্ড অপেক্ষা করুন (টাইমার চলবে)।\n৪. ১৫ সেকেন্ড পূর্ণ হলেই আপনার ব্যালেন্সে ৫ টাকা যোগ হবে!\n\n⚠️ ১৫ সেকেন্ডের আগে ফিরে আসলে কিন্তু টাকা পাবেন না।`;
        specificActions = [{ label: '👉 এখনই কাজ শুরু করতে টাস্কে যান', tab: 'tasks' }];
      } else if (q.includes('রেফার') || q.includes('টিম') || q.includes('বন্ধু') || q.includes('refer') || q.includes('team')) {
        dynamicReply = `রেফার করে দ্রুত আয় করার নিয়ম:\n\n১. নিচে বাটনে চাপ দিয়ে "টিম" সেকশনে যান।\n২. আপনার ব্যক্তিগত রেফার লিংকটি কপি করে নিন।\n৩. হোয়াটসঅ্যাপ, ফেসবুক বা টেলিগ্রামে বন্ধুদের সাথে শেয়ার করুন।\n৪. বন্ধু একাউন্ট খুললেই আপনি পেয়ে যাবেন ৫০ টাকা নিশ্চিত বোনাস!\n\n💡 মনে রাখবেন: টাকা তুলতে সর্বনিম্ন ২০ জনকে রেফার করতে হবে।`;
        specificActions = [{ label: '👉 আপনার রেফারেল লিংক নিতে যান', tab: 'team' }];
      } else if (q.includes('উত্তোলন') || q.includes('উইথড্র') || q.includes('টাকা') || q.includes('বিকাশ') || q.includes('নগদ') || q.includes('withdraw')) {
        dynamicReply = `বিকাশ বা নগদে টাকা তোলার নিয়ম:\n\n১. নিচের বাটনে চাপ দিয়ে সরাসরি "উত্তোলন" পেজে যান।\n২. বিকাশ বা নগদ সিলেক্ট করে আপনার মোবাইল নম্বর লিখুন।\n৩. টাকার পরিমাণ সিলেক্ট করুন (সর্বনিম্ন ১,০০০ টাকা)।\n৪. সাবমিট করুন। ৩০ মিনিট থেকে ১ ঘণ্টার মধ্যে টাকা আপনার নাম্বারে চলে যাবে।\n\n🚨 শর্ত: আপনার একাউন্টে সর্বনিম্ন ২০ জন রেফারেল থাকতে হবে।`;
        specificActions = [{ label: '👉 সরাসরি টাকা তোলার পেজে যান', tab: 'withdraw' }];
      } else if (q.includes('স্পিন') || q.includes('spin')) {
        dynamicReply = `লাকি স্পিন খেলে প্রতিদিন ফ্রি বোনাস টাকা জিতে নিতে পারেন!\n\nনিচের বাটনে চাপ দিয়ে এখনই আপনার স্পিন ঘুরিয়ে বোনাস সংগ্রহ করুন।`;
        specificActions = [{ label: '👉 স্পিন সেকশনে যান', tab: 'spin' }];
      } else if (q.includes('হাই') || q.includes('হ্যালো') || q.includes('hello') || q.includes('hi') || q.includes('কেমন')) {
        dynamicReply = `হ্যালো! আমি খুব ভালো আছি। আপনি JME Ads এর কোন কাজটি সম্পর্কে জানতে চান? কাজ করা, রেফার করা নাকি টাকা তোলার নিয়ম? আমাকে জানান, আমি শিখিয়ে দিচ্ছি!`;
        specificActions = [
          { label: 'বিজ্ঞাপন কাজ শিখুন', tab: 'tasks' },
          { label: 'টাকা তোলা শিখুন', tab: 'withdraw' }
        ];
      } else {
        dynamicReply = `আপনার প্রশ্নের উত্তর:\nJME Ads এ প্রতিদিন বিজ্ঞাপন দেখে এবং বন্ধুদের রেফার করে সরাসরি বিকাশ/নগদে টাকা উপার্জন করা যায়।\n\nআপনি কোন সেকশনে যেতে চান? নিচে দেওয়া বাটনে চাপ দিয়ে সরাসরি চলে যেতে পারেন:`;
        specificActions = detectActions('', query);
        if (specificActions.length === 0) {
          specificActions = [{ label: 'টাস্ক পেজ', tab: 'tasks' }, { label: 'টিম পেজ', tab: 'team' }];
        }
      }

      updateTokens(estimatedInputTokens + 100);
      const fallbackMsg: Message = {
        id: 'ai-dyn-' + Date.now(),
        sender: 'ai',
        text: dynamicReply,
        timestamp: Date.now(),
        actions: specificActions
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (tab: MessageAction['tab']) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center animate-in fade-in duration-200">
      <div className="w-full h-full max-w-md mx-auto bg-slate-50 flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header with Back button */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white p-3.5 px-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white"
              title="পিছনে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-emerald-400/40 flex items-center justify-center text-white">
                <Bot className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-900 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <span>২৪/৭ লাইভ এআই হেল্পলাইন</span>
              </h3>
              <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300" />
                <span>সক্রিয় আছে • যেকোনো সাহায্য চান</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'reset-' + Date.now(),
                  sender: 'ai',
                  text: 'নতুন চ্যাট শুরু হয়েছে। আপনি কী জানতে চান বলুন?',
                  timestamp: Date.now(),
                  actions: [
                    { label: 'টাস্ক সেকশন', tab: 'tasks' },
                    { label: 'উত্তোলন পেজ', tab: 'withdraw' }
                  ]
                }
              ]);
            }}
            className="p-2 rounded-xl text-emerald-100 hover:bg-white/10"
            title="চ্যাট রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
              >
                <div className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'} w-full`}>
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed whitespace-pre-line ${
                      isAi
                        ? 'bg-white text-gray-800 border border-emerald-100 rounded-tl-xs'
                        : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-tr-xs font-medium'
                    }`}
                  >
                    {m.text}
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Direct Action Buttons Inside Chat Bubble */}
                {isAi && m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-10.5">
                    {m.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.tab)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[11px] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <span>{act.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-white p-3 rounded-2xl border border-emerald-100 w-fit animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
              <span>সহকারী উত্তর তৈরি করছে...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Question Chips */}
        <div className="p-2 px-3 bg-white/90 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
          <button
            onClick={() => handleSendMessage(undefined, 'কীভাবে টাকা ইনকাম শুরু করব?')}
            className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 hover:bg-emerald-100 font-medium transition-colors"
          >
            💡 কীভাবে ইনকাম শুরু করব?
          </button>
          <button
            onClick={() => handleSendMessage(undefined, 'টাকা তুলতে কতজন রেফার লাগবে?')}
            className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 hover:bg-emerald-100 font-medium transition-colors"
          >
            👥 রেফার শর্ত কী?
          </button>
          <button
            onClick={() => handleSendMessage(undefined, 'বিকাশ বা নগদে টাকা তোলার নিয়ম কী?')}
            className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 hover:bg-emerald-100 font-medium transition-colors"
          >
            💰 টাকা তোলার নিয়ম
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-emerald-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="এখানে আপনার প্রশ্নটি লিখুন..."
            disabled={isLoading}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white shadow-md active:scale-95 transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
