export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referredBy?: string;
  balance: number;
  todayEarned: number;
  totalEarned: number;
  referralEarned: number;
  totalWithdrawn: number;
  accountStatus: 'active' | 'under_review' | 'suspended' | 'banned';
  role: 'user';
  createdAt: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailySpinCount: number;
  lastSpinDate: string;
  todayTaskCompletions: Record<string, number>; // taskId -> count today (max 3)
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
}
