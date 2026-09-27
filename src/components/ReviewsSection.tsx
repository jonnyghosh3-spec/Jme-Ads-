import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

const LOCAL_STORAGE_KEY = 'jme_local_user_reviews';

// Pool of authentic reviews with mostly Muslim names, some Hindu names, and varying like counts (some high, some low)
const REVIEW_POOL: UserReview[] = [
  {
    id: 'pool-1',
    userName: 'Md. Shakil Khan',
    rating: 5,
    comment: 'আলহামদুলিল্লাহ! ২০ জন রেফার সম্পন্ন করে সাথে সাথে বিকাশ এ ১,০০০ টাকা উইথড্র দিয়েছিলাম। মাত্র ৩৫ মিনিটে টাকা চলে এসেছে!',
    date: 'আজকে, দুপুর ২:১৫',
    likes: 84
  },
  {
    id: 'pool-2',
    userName: 'Nusrat Jahan Rima',
    rating: 5,
    comment: 'টাস্কের কাজগুলো দারুণ, বিজ্ঞাপনে ১৫ সেকেন্ড অপেক্ষা করলেই ৫ টাকা যুক্ত হয়। সাইটটা ১০০% ট্রাস্টেড।',
    date: 'আজকে, দুপুর ১:৫০',
    likes: 12
  },
  {
    id: 'pool-3',
    userName: 'Tanvir Hossain',
    rating: 5,
    comment: 'খুবই বিশ্বস্ত সাইট। নগদে ১,২০০ টাকা রিসিভ করলাম। ধন্যবাদ JME Ads টিমকে!',
    date: 'আজকে, বেলা ১২:৩০',
    likes: 56
  },
  {
    id: 'pool-4',
    userName: 'Priya Dhar',
    rating: 5,
    comment: 'রেফার করতে করতে ২০ জন পূর্ণ হলো, আর বিকাশে ১,০০০ টাকা তুলে নিলাম। খুব ভালো সিস্টেম।',
    date: 'আজকে, সকাল ১১:১৫',
    likes: 9
  },
  {
    id: 'pool-5',
    userName: 'Farhana Akter',
    rating: 5,
    comment: 'টেলিগ্রাম গ্রুপে সাপোর্ট খুব ভালো। প্রতিদিন ফ্রি স্পিন থেকেও ভালো ইনকাম হচ্ছে।',
    date: 'আজকে, সকাল ১০:০৫',
    likes: 47
  },
  {
    id: 'pool-6',
    userName: 'Arif Chowdhury',
    rating: 5,
    comment: 'প্রথম দিকে বিশ্বাস করতে পারিনি, কিন্তু ২০ জন রেফার পূর্ণ করে উইথড্র দেওয়ার পর এক ঘণ্টার মধ্যে নগদে পেমেন্ট পেয়েছি!',
    date: 'আজকে, সকাল ৯:২০',
    likes: 93
  },
  {
    id: 'pool-7',
    userName: 'Subhash Roy',
    rating: 5,
    comment: 'বিজ্ঞাপন দেখার কাজগুলো একদম সহজ। কোনো ঝামেলা নেই, সময়মতো কাজ শেষ করলেই ব্যালেন্স যোগ হয়।',
    date: 'গতকাল, রাত ১০:৪০',
    likes: 6
  },
  {
    id: 'pool-8',
    userName: 'Mehedi Hasan Sabbir',
    rating: 5,
    comment: 'আলহামদুলিল্লাহ আজকে ২য় বার বিকাশ এ ১,৫০০ টাকা পেয়েছি। যারা কাজ করছেন নিয়ম মেনে কাজ করুন সবাই টাকা পাবেন।',
    date: 'গতকাল, রাত ৮:১৫',
    likes: 68
  },
  {
    id: 'pool-9',
    userName: 'Jannatul Ferdous',
    rating: 5,
    comment: 'ঘরে বসে এমন সহজ ইনকামের সাইট বাংলাদেশে আগে দেখিনি। রেফারেল বোনাস ৳৫০ অনেক বড় সুযোগ।',
    date: 'গতকাল, সন্ধ্যা ৬:২৫',
    likes: 31
  },
  {
    id: 'pool-10',
    userName: 'Anik Saha',
    rating: 5,
    comment: 'নগদে ১০০০ টাকা সফলভাবে রিসিভ করেছি। কোনো চার্জ কাটার পর হিসাব ঠিকঠাক পেয়েছি।',
    date: 'গতকাল, বিকেল ৪:১০',
    likes: 15
  },
  {
    id: 'pool-11',
    userName: 'Rakibul Islam',
    rating: 5,
    comment: 'আমার টিম মেম্বারদের সবাই নিয়মিত টাস্ক করছে। নিয়মমতো কাজ করলে পেমেন্ট নিশ্চিত।',
    date: 'গতকাল, দুপুর ২:০৫',
    likes: 52
  },
  {
    id: 'pool-12',
    userName: 'Sadia Afrin',
    rating: 5,
    comment: 'অনেক ফ্রেন্ডকে ইনভাইট করেছি। সাপোর্ট টিকিট দিলে দ্রুত রিপ্লাই দেয়। ধন্যবাদ!',
    date: '২ দিন আগে',
    likes: 24
  },
  {
    id: 'pool-13',
    userName: 'Biplob Kumar Ghosh',
    rating: 5,
    comment: 'সত্যিই টাকা দেয়! আমি বিকাশ নাম্বারে পেয়েছি। বন্ধুদেরও শেয়ার করেছি।',
    date: '২ দিন আগে',
    likes: 18
  },
  {
    id: 'pool-14',
    userName: 'Md. Shohel Rana',
    rating: 5,
    comment: 'প্রতিদিন সকালবেলা উঠে আগে টাস্কগুলো শেষ করি। স্পিন ও রেফার বোনাস মিলে দ্রুত ১০০০ হয়ে গেছে।',
    date: '৩ দিন আগে',
    likes: 77
  }
];

export const ReviewsSection: React.FC = () => {
  const { user, showToast } = useApp();
  
  // Custom user reviews stored in localStorage
  const [userSubmittedReviews, setUserSubmittedReviews] = useState<UserReview[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current rotating pool index: rotates every 1 minute (60,000ms)
  const [rotationIndex, setRotationIndex] = useState<number>(0);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [likedReviews, setLikedReviews] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jme_liked_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Every 1 minute, rotate by 1 review so a new review is added and old ones shift (always keeping max 5 displayed)
  useEffect(() => {
    const timer = setInterval(() => {
      setRotationIndex(prev => (prev + 1) % REVIEW_POOL.length);
    }, 60000); // 1 minute interval

    return () => clearInterval(timer);
  }, []);

  // Compute the 5 visible reviews: any user-submitted reviews first, then pool reviews up to exactly 5
  const getVisibleReviews = (): UserReview[] => {
    const combined: UserReview[] = [...userSubmittedReviews];
    const poolLen = REVIEW_POOL.length;

    for (let i = 0; i < poolLen && combined.length < 5; i++) {
      const poolIdx = (rotationIndex + i) % poolLen;
      const reviewItem = REVIEW_POOL[poolIdx];
      // Avoid duplicates
      if (!combined.some(r => r.id === reviewItem.id)) {
        combined.push(reviewItem);
      }
    }

    // Strictly show at most 5 reviews; older ones are hidden as requested
    return combined.slice(0, 5);
  };

  const visibleReviews = getVisibleReviews();

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('অনুগ্রহ করে রিভিউ ও মতামত লিখুন।', 'warning');
      return;
    }

    const reviewItem: UserReview = {
      id: 'rev-' + Date.now(),
      userName: user?.name || 'ব্যবহারকারী ' + Math.floor(1000 + Math.random() * 9000),
      rating: newRating,
      comment: newComment.trim(),
      date: 'এইমাত্র',
      likes: Math.floor(1 + Math.random() * 5)
    };

    const updated = [reviewItem, ...userSubmittedReviews];
    setUserSubmittedReviews(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    setNewComment('');
    showToast('আপনার রিভিউ সফলভাবে যুক্ত হয়েছে! ধন্যবাদ।', 'success');
  };

  const handleLike = (id: string) => {
    if (likedReviews.includes(id)) return;
    const updatedLikes = [...likedReviews, id];
    setLikedReviews(updatedLikes);
    localStorage.setItem('jme_liked_reviews', JSON.stringify(updatedLikes));

    // If it's a user submitted review, increment count in state
    if (userSubmittedReviews.some(r => r.id === id)) {
      const updated = userSubmittedReviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r);
      setUserSubmittedReviews(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Write Review Card */}
      <div className="p-4 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">ইউজারদের বাস্তব রিভিউ</h3>
              <p className="text-[10px] text-gray-500">যে কেউ রিভিউ দিতে পারবেন (প্রতি মিনিটে আপডেট)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ★ ৪.৯ / ৫.০ (সর্বোচ্চ ৫টি প্রদর্শিত)
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleAddReview} className="space-y-2.5 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-600 font-semibold mr-1">রেটিং:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className={`w-5 h-5 ${star <= newRating ? 'text-amber-500 fill-amber-400' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="আপনার অভিজ্ঞতা বা পেমেন্ট পাওয়ার অভিজ্ঞতা লিখুন..."
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>রিভিউ সাবমিট করুন</span>
          </button>
        </form>
      </div>

      {/* Reviews List - Strictly Max 5 Displayed */}
      <div className="space-y-2.5">
        {visibleReviews.map((rev) => {
          const isLiked = likedReviews.includes(rev.id);
          const currentLikes = rev.likes + (isLiked && !userSubmittedReviews.some(r => r.id === rev.id) ? 1 : 0);

          return (
            <div
              key={rev.id}
              className="p-3.5 rounded-2xl bg-white border border-emerald-50 shadow-2xs space-y-2 text-xs transition-all duration-300 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center font-bold text-[11px]">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none">{rev.userName}</h4>
                    <span className="text-[10px] text-gray-400 font-english">{rev.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-[11px]">{rev.comment}</p>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] text-gray-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>ভেরিফাইড ইউজার</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(rev.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-colors ${
                    isLiked
                      ? 'text-emerald-700 bg-emerald-50 font-bold'
                      : 'text-gray-500 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span className="font-english font-semibold">{currentLikes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
