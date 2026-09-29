export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  referredByUid?: string;
  referralCount: number; // Exact count of registered referrals
  balance: number;
  todayEarned: number;
  totalEarned: number;
  referralEarned: number;
  totalWithdrawn: number;
  accountStatus: 'active' | 'under_review' | 'suspended' | 'banned';
  role: 'user' | 'admin';
  createdAt: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailySpinCount: number;
  lastSpinDate: string;
  todayTaskCompletions: Record<string, number>; // taskId -> count today (max 3)
  completedMicroJobs?: Record<string, number>; // jobId -> completion timestamp
  isVerifiedPublisher?: boolean; // Verified badge & 2x profit
  verifiedAt?: number;
  verificationRequested?: boolean;
  verificationTrxId?: string;
  verificationMethod?: string;
}

export interface MicroJobItem {
  id: string;
  title: string;
  category: 'youtube' | 'website' | 'subscribe' | 'app' | 'special';
  categoryLabel?: string; // e.g. "ইউটিউব ভিডিও", "ওয়েবসাইট ভিজিট"
  description: string; // e.g. "ভিডিওটি সম্পূর্ণ ২ মিনিট দেখুন ও লাইক দিন"
  url: string; // e.g. https://www.youtube.com/watch?v=...
  requiredDurationSeconds: number; // e.g. 60 or 120 seconds
  reward: number; // e.g. 10
  priority: number; // Higher number appears at top! (এডমিন প্যানেলে অফার উপরে রাখার সিস্টেম)
  active: boolean;
  totalSubmissions?: number;
  dailyLimit?: number; // default 1 per user
  requiresScreenshots?: boolean; // Robot tracking: requires start & end screenshot
  instructions?: string[];
  requirements?: string[];
  createdAt: number;
}

export interface JobSubmissionItem {
  id: string;
  jobId: string;
  jobTitle: string;
  uid: string;
  userName: string;
  userPhone: string;
  startScreenshotUrl?: string;
  endScreenshotUrl?: string;
  requiredSeconds: number;
  spentSeconds: number;
  proofText?: string;
  reward: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  submittedAt: number;
  reviewedAt?: number;
}

export interface TaskItem {
  id: string;
  nameId: string; // e.g. Smartlink_1
  networkId: string; // e.g. 28283290
  title: string;
  banglaTitle: string;
  smartLink: string;
  reward: number; // ৳5
  dailyLimit: number; // 3
  cooldownSeconds: number; // 15
  active: boolean;
  category: 'smartlink' | 'video' | 'special';
  badge?: string;
}

export interface TransactionItem {
  id: string;
  uid: string;
  type: 'ad_reward' | 'referral_reward' | 'spin_reward' | 'withdrawal' | 'admin_adjustment' | 'bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: 'completed' | 'pending' | 'rejected';
  createdAt: number;
}

export interface WithdrawalItem {
  id: string;
  uid: string;
  userName: string;
  userPhone: string;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
  accountNumber: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'approved' | 'paid' | 'rejected';
  adminNote?: string;
  createdAt: number;
  processedAt?: number;
}

export interface ReferralItem {
  id: string;
  referrerUid: string;
  referrerCode: string;
  referredUid: string;
  referredName: string;
  referredPhoneMasked: string;
  rewardAmount: number;
  status: 'completed' | 'pending';
  createdAt: number;
}

export interface NotificationItem {
  id: string;
  uid: string; // user uid or 'all'
  title: string;
  message: string;
  type: 'system' | 'reward' | 'referral' | 'withdrawal' | 'security' | 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: number;
}

export interface AppSettings {
  appName: string;
  referralReward: number; // ৳50
  adReward: number; // ৳5
  minWithdrawal: number; // ৳1000
  withdrawalFee: number; // 0
  dailyAdLimitPerLink: number; // 3
  minimumAdSeconds: number; // 15
  minReferralsRequiredForWithdrawal?: number; // default 20
  spinEnabled: boolean;
  videoAdsEnabled: boolean;
  maintenanceMode: boolean;
  youtubeTutorialUrl: string; // default empty
  youtubeVideo1Url?: string; // YouTube Video 1
  youtubeVideo1Title?: string;
  youtubeVideo2Url?: string; // YouTube Video 2
  youtubeVideo2Title?: string;
  telegramUrl: string; // default empty
  supportWhatsapp: string;
  announcement: string;
  bannerAdHtml?: string; // HTML/Script code for Banner Ads
  nativeAdHtml?: string; // HTML/Script code for Native Ads
  popunderAdUrl?: string; // Popunder or Direct Ad URL
  apkDownloadUrl?: string; // Custom APK download link
  showPublisherUpgradeBanner?: boolean; // Admin toggle to show/hide upgrade banner
  publisherUpgradeFee?: number; // e.g. ৳100 or ৳200
  publisherUpgradeBkash?: string; // e.g. 017...
  publisherUpgradeNagad?: string; // e.g. 018...
  googleAdSenseCode?: string; // AdSense Verification HTML/script snippet
  enableAdSense?: boolean; // Enable AdSense toggle
  cpmSmartlinkUrl?: string; // Primary high CPM smartlink URL
  cpmRate?: number; // Primary CPM rate display e.g. 0.3
  showMicroJobsSection?: boolean; // Toggle micro jobs section
  showLivePayoutTicker?: boolean; // Toggle live payout ticker
}

export interface ContactMessageItem {
  id: string;
  name: string;
  contact: string; // phone or email
  subject?: string;
  message: string;
  read: boolean;
  createdAt: number;
}

