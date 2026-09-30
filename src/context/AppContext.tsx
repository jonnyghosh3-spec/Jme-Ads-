import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  TaskItem, 
  TransactionItem, 
  WithdrawalItem, 
  ReferralItem, 
  NotificationItem, 
  AppSettings,
  MicroJobItem,
  JobSubmissionItem,
  ContactMessageItem,
  AIAnalyticsReport
} from '../types';
import { DEFAULT_TASKS, DEFAULT_APP_SETTINGS } from '../data/defaultTasks';
import { 
  auth, 
  googleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  FirebaseUser,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  handleFirestoreError,
  OperationType
} from '../firebase/config';

interface ActiveTaskSession {
  taskId: string;
  startTime: number;
  requiredSeconds: number;
  tabOpened: boolean;
  status: 'running' | 'completed' | 'failed_early';
}

interface AppContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: TaskItem[];
  transactions: TransactionItem[];
  withdrawals: WithdrawalItem[];
  referrals: ReferralItem[];
  notifications: NotificationItem[];
  settings: AppSettings;
  activeTaskSession: ActiveTaskSession | null;
  earlyReturnWarning: boolean;
  setEarlyReturnWarning: (show: boolean) => void;
  referralCodeInput: string;
  setReferralCodeInput: (code: string) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  closeToast: () => void;
  // Auth methods
  loginWithEmail: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  registerWithEmail: (name: string, email: string, pass: string, phone: string, refCode?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: (refCode?: string) => Promise<boolean>;
  loginAsDemoUser: () => void;
  logout: () => Promise<void>;
  // Task methods
  startTask: (task: TaskItem) => void;
  completeActiveTask: () => void;
  cancelActiveTask: () => void;
  // Withdrawal
  requestWithdrawal: (method: 'bKash' | 'Nagad' | 'Rocket' | 'Upay', accountNumber: string, amount: number) => Promise<{ success: boolean; error?: string }>;
  // Spin
  spinWheel: () => { reward: number; index: number; success: boolean; message?: string };
  // Welcome Bonus
  claimWelcomeBonus: (amount?: number) => void;
  // Micro Jobs & Special Offers
  microJobs: MicroJobItem[];
  activeMicroJob: MicroJobItem | null;
  microJobSecondsLeft: number;
  selectedJobForDetails: MicroJobItem | null;
  setSelectedJobForDetails: (job: MicroJobItem | null) => void;
  startMicroJob: (job: MicroJobItem) => void;
  completeMicroJob: () => void;
  cancelMicroJob: () => void;
  updateUserAvatar: (photoDataUrl: string) => Promise<boolean>;
  submitJobProof: (data: {
    jobId: string;
    jobTitle: string;
    startScreenshotUrl?: string;
    endScreenshotUrl?: string;
    requiredSeconds: number;
    spentSeconds: number;
    proofText?: string;
    reward: number;
    aiAnalytics?: AIAnalyticsReport;
  }) => Promise<{ success: boolean; message?: string }>;
  jobSubmissions: JobSubmissionItem[];
  requestPublisherUpgrade: (trxId: string, method: string) => Promise<{ success: boolean; message?: string }>;
  adminApproveJobSubmission: (submissionId: string) => Promise<void>;
  adminRejectJobSubmission: (submissionId: string, reason?: string) => Promise<void>;
  adminApprovePublisherUpgrade: (userId: string) => Promise<void>;
  adminRejectPublisherUpgrade: (userId: string, reason?: string) => Promise<void>;
  adminAddMicroJob: (job: Omit<MicroJobItem, 'id' | 'createdAt'>) => Promise<void>;
  adminUpdateMicroJob: (id: string, updates: Partial<MicroJobItem>) => Promise<void>;
  adminDeleteMicroJob: (id: string) => Promise<void>;
  // Admin methods
  adminUpdateUserBalance: (uid: string, delta: number, reason: string) => void;
  adminToggleUserStatus: (uid: string, status: 'active' | 'suspended') => void;
  adminUpdateWithdrawalStatus: (id: string, status: 'approved' | 'paid' | 'rejected' | 'processing', note?: string) => void;
  adminUpdateTask: (task: TaskItem) => void;
  adminAddTask: (task: Omit<TaskItem, 'id'>) => void;
  adminDeleteTask: (id: string) => void;
  adminUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  adminBroadcastNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning') => Promise<void>;
  allUsersList: UserProfile[];
  allWithdrawalsList: WithdrawalItem[];
  allTransactionsList: TransactionItem[];
  markNotificationRead: (id: string) => void;
  showAdminModal: boolean;
  setShowAdminModal: (show: boolean) => void;
  // Contact Messages Direct To Admin
  contactMessages: ContactMessageItem[];
  submitContactMessage: (msg: { name: string; contact: string; subject?: string; message: string }) => Promise<{ success: boolean; message?: string }>;
  adminDeleteMessage: (id: string) => Promise<void>;
  adminMarkMessageRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'jme_user_profile',
  TASKS: 'jme_tasks_list',
  TXNS: 'jme_transactions',
  WITHDRAWALS: 'jme_withdrawals',
  REFERRALS: 'jme_referrals',
  NOTIFICATIONS: 'jme_notifications',
  SETTINGS: 'jme_settings',
  ALL_USERS: 'jme_all_users',
  SAVED_REF: 'jme_pending_ref_code',
  MESSAGES: 'jme_contact_messages'
};

const DEFAULT_MICRO_JOBS: MicroJobItem[] = [
  {
    id: 'mj_youtube_1',
    title: 'ইউটিউব ভিডিও দেখুন ও ইনকাম করুন (২ মিনিট)',
    category: 'youtube',
    categoryLabel: 'ইউটিউব ভিডিও',
    description: 'ভিডিওটি সম্পূর্ণ ১২০ সেকেন্ড (২ মিনিট) মনোযোগ সহকারে দেখুন। ভিডিও চলাকালীন পেজ বন্ধ করবেন না। টাইমার শেষ হলে স্বয়ংক্রিয়ভাবে ৳১০ টাকা আপনার ব্যালেন্সে যোগ হবে।',
    url: 'https://www.youtube.com',
    requiredDurationSeconds: 120,
    reward: 10,
    priority: 100,
    active: true,
    totalSubmissions: 42,
    dailyLimit: 1,
    createdAt: Date.now() - 86400000
  },
  {
    id: 'mj_subscribe_2',
    title: 'ইউটিউব চ্যানেল সাবস্ক্রাইব ও বেল আইকন',
    category: 'subscribe',
    categoryLabel: 'চ্যানেল সাবস্ক্রাইব',
    description: 'আমাদের ইউটিউব চ্যানেলে প্রবেশ করে সাবস্ক্রাইব করুন এবং বেল আইকনে ক্লিক করুন। কমপক্ষে ৬০ সেকেন্ড অবস্থান করুন।',
    url: 'https://www.youtube.com',
    requiredDurationSeconds: 60,
    reward: 8,
    priority: 90,
    active: true,
    totalSubmissions: 35,
    dailyLimit: 1,
    createdAt: Date.now() - 72000000
  },
  {
    id: 'mj_website_3',
    title: 'স্পনসর ওয়েবসাইট ভিজিট ও স্ক্রোল',
    category: 'website',
    categoryLabel: 'ওয়েবসাইট ভিজিট',
    description: 'স্পনসর ওয়েবসাইটে প্রবেশ করে বিভিন্ন আর্টিকেল মনোযোগ দিয়ে ৪৫ সেকেন্ড ধরে স্ক্রোল ও রিড করুন।',
    url: 'https://www.google.com',
    requiredDurationSeconds: 45,
    reward: 5,
    priority: 80,
    active: true,
    totalSubmissions: 58,
    dailyLimit: 1,
    createdAt: Date.now() - 50000000
  },
  {
    id: 'mj_telegram_4',
    title: 'টেলিগ্রাম গ্রুপ জয়েন ও পিন পোস্ট ভিউ',
    category: 'special',
    categoryLabel: 'টেলিগ্রাম টাস্ক',
    description: 'আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন করুন এবং পিন পোস্টটি ৩০ সেকেন্ড দেখে বোনাস গ্রহণ করুন।',
    url: 'https://t.me/JMEAds_Official',
    requiredDurationSeconds: 30,
    reward: 5,
    priority: 70,
    active: true,
    totalSubmissions: 89,
    dailyLimit: 1,
    createdAt: Date.now() - 30000000
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });
  const [microJobs, setMicroJobs] = useState<MicroJobItem[]>(() => {
    const saved = localStorage.getItem('jme_micro_jobs');
    return saved ? JSON.parse(saved) : DEFAULT_MICRO_JOBS;
  });
  const [activeMicroJob, setActiveMicroJob] = useState<MicroJobItem | null>(null);
  const [microJobSecondsLeft, setMicroJobSecondsLeft] = useState<number>(0);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<MicroJobItem | null>(null);
  const [jobSubmissions, setJobSubmissions] = useState<JobSubmissionItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessageItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : [];
  });
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_APP_SETTINGS;
  });
  const [transactions, setTransactions] = useState<TransactionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TXNS);
    return saved ? JSON.parse(saved) : [];
  });
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WITHDRAWALS);
    return saved ? JSON.parse(saved) : [];
  });
  const [referrals, setReferrals] = useState<ReferralItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        uid: 'all',
        title: 'স্বাগতম JME Ads-এ!',
        message: 'বিজ্ঞাপন দেখে ও রেফার করে আজই ইনকাম শুরু করুন। প্রতিটি কাজের জন্য ন্যূনতম ১৫ সেকেন্ড অপেক্ষা করতে হবে।',
        type: 'system',
        read: false,
        createdAt: Date.now() - 3600000
      }
    ];
  });
  const [allUsersList, setAllUsersList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [referralCodeInput, setReferralCodeInput] = useState<string>('');
  const [activeTaskSession, setActiveTaskSession] = useState<ActiveTaskSession | null>(null);
  const [earlyReturnWarning, setEarlyReturnWarning] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const closeToast = () => {
    setToast(null);
  };

  // Helper to generate referral code like JME8X7K2
  const generateReferralCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'JME';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const getTodayDateStr = () => new Date().toISOString().split('T')[0];

  // Sync state to local storage for instant offline / cache resilience
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TXNS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsersList));
  }, [allUsersList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(contactMessages));
  }, [contactMessages]);

  // Check URL for referral param or /ref/:code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    const path = window.location.pathname;
    let code = refParam;
    if (!code && path.startsWith('/ref/')) {
      code = path.replace('/ref/', '').trim();
    }
    if (code) {
      localStorage.setItem(STORAGE_KEYS.SAVED_REF, code.toUpperCase());
      setReferralCodeInput(code.toUpperCase());
      showToast(`রেফারেল কোড "${code.toUpperCase()}" সনাক্ত করা হয়েছে!`, 'info');
    } else {
      const savedRef = localStorage.getItem(STORAGE_KEYS.SAVED_REF);
      if (savedRef) {
        setReferralCodeInput(savedRef);
      }
    }
  }, []);

  // Dynamically load external data.json ONLY if local storage has no settings saved
  useEffect(() => {
    fetch('./data.json')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        // Never overwrite admin saved settings!
        const existingSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (data.settings && !existingSettings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
        if (Array.isArray(data.tasks) && data.tasks.length > 0) {
          setTasks((prev) => {
            const hasCustom = localStorage.getItem(STORAGE_KEYS.TASKS);
            return hasCustom ? prev : data.tasks;
          });
        }
      })
      .catch(() => {
        // Silently ignore if data.json is not present or offline
      });
  }, []);

  // Listen for contact messages for admin
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'contact_messages'), (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id })) as ContactMessageItem[];
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setContactMessages(list);
          localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Contact messages listener note:', err);
      });
      return () => unsub();
    } catch (e) {}
  }, []);

  // Listen for real-time broadcast notifications from Firestore and show browser push
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as NotificationItem;
            // If it's a recent notification (created in the last 2 minutes)
            if (Date.now() - (data.createdAt || 0) < 120000) {
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(data.title || 'JME Ads বিজ্ঞপ্তি', {
                    body: data.message,
                    icon: 'https://i.supaimg.com/88cac59e-85c9-44fa-970b-faf486de12c5/cfd4da92-da3f-4f1a-b3dd-bcb09a3ba09a.png'
                  });
                } catch (err) {
                  console.warn('Browser push display err:', err);
                }
              }
            }
          }
        });

        const fetchedNotifs = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id
        })) as NotificationItem[];
        if (fetchedNotifs.length > 0) {
          setNotifications(prev => {
            const map = new Map<string, NotificationItem>();
            [...fetchedNotifs, ...prev].forEach(n => map.set(n.id, n));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Notifications snapshot note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Notification listener setup warning:', e);
    }
  }, []);

  // Track Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Try fetching user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUser(data);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization of current user profile (balance, referrals, status) across all devices
  useEffect(() => {
    if (!user?.uid) return;
    try {
      const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const liveData = docSnap.data() as UserProfile;
          setUser((prev) => {
            if (!prev) return liveData;
            if (
              prev.balance !== liveData.balance ||
              prev.referralEarned !== liveData.referralEarned ||
              prev.referralCount !== liveData.referralCount ||
              prev.totalEarned !== liveData.totalEarned ||
              prev.accountStatus !== liveData.accountStatus
            ) {
              return { ...prev, ...liveData };
            }
            return prev;
          });
        }
      }, (err) => {
        console.warn('Live user listener note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live user listener err:', e);
    }
  }, [user?.uid]);

  // Real-time synchronization of user's referrals list from Firestore
  useEffect(() => {
    if (!user?.uid) return;
    try {
      const qRef = query(collection(db, 'referrals'), where('referrerUid', '==', user.uid));
      const unsub = onSnapshot(qRef, (snap) => {
        const liveReferrals = snap.docs.map(d => ({ ...d.data(), id: d.id })) as ReferralItem[];
        liveReferrals.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setReferrals(liveReferrals);
      }, (err) => {
        console.warn('Live referrals listener note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live referrals listener err:', e);
    }
  }, [user?.uid]);

  // Real-time synchronization of Micro Jobs / Offers from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'micro_jobs'), (snap) => {
        if (!snap.empty) {
          const liveJobs = snap.docs.map(d => ({ ...d.data(), id: d.id })) as MicroJobItem[];
          liveJobs.sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.createdAt || 0) - (a.createdAt || 0));
          setMicroJobs(liveJobs);
        } else {
          // Initialize default micro jobs in Firestore if collection is empty
          DEFAULT_MICRO_JOBS.forEach((job) => {
            setDoc(doc(db, 'micro_jobs', job.id), {
              ...job,
              createdAtServer: serverTimestamp()
            }).catch(() => {});
          });
        }
      }, (err) => {
        console.warn('Live micro jobs listener note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live micro jobs listener err:', e);
    }
  }, []);

  // Real-time synchronization of global settings from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(doc(db, 'settings', 'app_config'), (snap) => {
        if (snap.exists()) {
          const liveSettings = snap.data() as Partial<AppSettings>;
          setSettings((prev) => ({ ...prev, ...liveSettings }));
        }
      }, (err) => {
        console.warn('Live settings listener note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live settings listener err:', e);
    }
  }, []);

  // Real-time synchronization of tasks from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'tasks'), (snap) => {
        if (!snap.empty) {
          const liveTasks = snap.docs.map(d => ({ ...d.data(), id: d.id })) as TaskItem[];
          setTasks(liveTasks);
        }
      }, (err) => {
        console.warn('Live tasks listener note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live tasks listener err:', e);
    }
  }, []);

  // Real-time synchronization of job submissions for admin review
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'job_submissions'), (snap) => {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id })) as JobSubmissionItem[];
        list.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
        setJobSubmissions(list);
      }, (err) => {
        console.warn('Job submissions listener note:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup job submissions listener err:', e);
    }
  }, []);

  // Real-time synchronization of ALL users from Firestore (All 35+ users for Admin Panel)
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'users'), (snap) => {
        if (!snap.empty) {
          const liveUsers = snap.docs.map(d => ({
            ...d.data(),
            uid: d.id
          })) as UserProfile[];
          setAllUsersList(liveUsers);
          localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(liveUsers));
        }
      }, (err) => {
        console.warn('Live all users listener error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live all users listener err:', e);
    }
  }, []);

  // Real-time synchronization of ALL withdrawals from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'withdrawals'), (snap) => {
        const liveWithdrawals = snap.docs.map(d => ({
          ...d.data(),
          id: d.id
        })) as WithdrawalItem[];
        liveWithdrawals.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setWithdrawals(liveWithdrawals);
        localStorage.setItem(STORAGE_KEYS.WITHDRAWALS, JSON.stringify(liveWithdrawals));
      }, (err) => {
        console.warn('Live all withdrawals listener error:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Setup live all withdrawals listener err:', e);
    }
  }, []);

  // Google AdSense Dynamic Script Injector
  useEffect(() => {
    if (settings.enableAdSense && settings.googleAdSenseCode && settings.googleAdSenseCode.trim() !== '') {
      try {
        const existing = document.getElementById('jme-dynamic-adsense-script');
        if (!existing) {
          const scriptContainer = document.createElement('div');
          scriptContainer.id = 'jme-dynamic-adsense-script';
          scriptContainer.innerHTML = settings.googleAdSenseCode;
          document.head.appendChild(scriptContainer);
        }
      } catch (e) {
        console.warn('AdSense injection note:', e);
      }
    }
  }, [settings.enableAdSense, settings.googleAdSenseCode]);

  // Window Focus / Visibility detection for early return rule!
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && activeTaskSession) {
        const elapsed = (Date.now() - activeTaskSession.startTime) / 1000;
        if (elapsed < activeTaskSession.requiredSeconds) {
          // USER RETURNED EARLY BEFORE 15 SECONDS!
          setActiveTaskSession(null);
          setEarlyReturnWarning(true);
          showToast(`❌ কাজ বাতিল! আপনি ১৫ সেকেন্ডের আগেই ফিরে এসেছেন (${Math.floor(elapsed)} সেকেন্ডে)।`, 'error');
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [activeTaskSession]);

  // Register with Email
  const registerWithEmail = async (
    name: string, 
    email: string, 
    pass: string, 
    phone: string, 
    refCode?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();

      // 📱 Maximum 2 accounts per mobile/device limit
      const DEVICE_ACCOUNTS_KEY = 'jme_device_accounts';
      let deviceAccounts: string[] = [];
      try {
        const rawAccounts = localStorage.getItem(DEVICE_ACCOUNTS_KEY);
        if (rawAccounts) deviceAccounts = JSON.parse(rawAccounts);
      } catch (e) {}

      const isAlreadyOnDevice = deviceAccounts.includes(cleanEmail) || (cleanPhone && deviceAccounts.includes(cleanPhone));
      if (!isAlreadyOnDevice && deviceAccounts.length >= 2) {
        const msg = '❌ একই ডিভাইসে/মোবাইলে সর্বোচ্চ ২টি অ্যাকাউন্ট খোলা অনুমোদিত। এই ডিভাইসে ইতোমধ্যে ২টি অ্যাকাউন্ট নিবন্ধিত আছে।';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }

      // Check if user already exists in Firestore or local cache
      try {
        const qEmail = query(collection(db, 'users'), where('email', '==', cleanEmail), limit(1));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          const msg = '❌ এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা আছে! অনুগ্রহ করে লগইন করুন।';
          showToast(msg, 'warning');
          return { success: false, message: msg };
        }

        if (cleanPhone) {
          const qPhone = query(collection(db, 'users'), where('phone', '==', cleanPhone), limit(1));
          const snapPhone = await getDocs(qPhone);
          if (!snapPhone.empty) {
            const msg = '❌ এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা আছে! অনুগ্রহ করে লগইন করুন।';
            showToast(msg, 'warning');
            return { success: false, message: msg };
          }
        }
      } catch (checkErr) {
        console.warn('Firestore user duplicate check note:', checkErr);
      }

      const existingUser = allUsersList.find(
        u => u.email.toLowerCase() === cleanEmail || (cleanPhone && u.phone === cleanPhone)
      );
      if (existingUser) {
        const msg = '❌ এই ইমেইল বা মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা আছে! অনুগ্রহ করে লগইন করুন।';
        showToast(msg, 'warning');
        return { success: false, message: msg };
      }

      let uid = 'user_' + Date.now();
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        uid = cred.user.uid;
      } catch (fbErr: any) {
        console.warn('Firebase Auth email register warning:', fbErr.message);
      }

      const generatedCode = generateReferralCode();
      const today = getTodayDateStr();
      const effectiveRefCode = (
        refCode || 
        localStorage.getItem(STORAGE_KEYS.SAVED_REF) || 
        localStorage.getItem('jmeads_saved_ref') || 
        referralCodeInput || 
        ''
      ).trim().toUpperCase();

      // Look up referrer across Firestore and local cache
      let matchingReferrer: UserProfile | null = null;
      if (effectiveRefCode) {
        try {
          const qRef = query(collection(db, 'users'), where('referralCode', '==', effectiveRefCode), limit(1));
          const snapRef = await getDocs(qRef);
          if (!snapRef.empty) {
            matchingReferrer = snapRef.docs[0].data() as UserProfile;
          }
        } catch (fsRefQueryErr) {
          console.warn('Firestore referral lookup error:', fsRefQueryErr);
        }

        if (!matchingReferrer) {
          matchingReferrer = allUsersList.find(u => u.referralCode === effectiveRefCode) || null;
        }
      }

      const newUser: UserProfile = {
        uid,
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        referralCode: generatedCode,
        referredBy: effectiveRefCode || undefined,
        referredByUid: matchingReferrer ? matchingReferrer.uid : undefined,
        referralCount: 0,
        balance: 0,
        todayEarned: 0,
        totalEarned: 0,
        referralEarned: 0,
        totalWithdrawn: 0,
        accountStatus: 'active',
        role: 'user',
        createdAt: Date.now(),
        lastActiveDate: today,
        dailySpinCount: 0,
        lastSpinDate: today,
        todayTaskCompletions: {},
        completedMicroJobs: {}
      };

      // Save credentials for offline/local strict password checks
      try {
        const rawCreds = localStorage.getItem('jme_user_creds') || '{}';
        const credMap = JSON.parse(rawCreds);
        const credEntry = {
          uid,
          email: cleanEmail,
          phone: cleanPhone,
          password: pass
        };
        credMap[cleanEmail] = credEntry;
        if (cleanPhone) {
          credMap[cleanPhone] = credEntry;
        }
        localStorage.setItem('jme_user_creds', JSON.stringify(credMap));
      } catch (e) {
        console.warn('Failed to cache credentials:', e);
      }

      // Save to Firestore
      try {
        await setDoc(doc(db, 'users', uid), {
          ...newUser,
          createdAtServer: serverTimestamp()
        });
      } catch (fsErr) {
        console.warn('Firestore write user doc note:', fsErr);
      }

      // If registered with valid referral, award bonus and increment referral count
      if (matchingReferrer && matchingReferrer.uid !== newUser.uid) {
        const rewardAmount = settings.referralReward || 50;

        const refItem: ReferralItem = {
          id: 'ref_' + Date.now(),
          referrerUid: matchingReferrer.uid,
          referrerCode: matchingReferrer.referralCode,
          referredUid: newUser.uid,
          referredName: newUser.name,
          referredPhoneMasked: newUser.phone ? (newUser.phone.slice(0, 3) + '****' + newUser.phone.slice(-3)) : '017****',
          rewardAmount,
          status: 'completed',
          createdAt: Date.now()
        };

        const refTxn: TransactionItem = {
          id: 'txn_ref_' + Date.now(),
          uid: matchingReferrer.uid,
          type: 'referral_reward',
          amount: rewardAmount,
          balanceBefore: matchingReferrer.balance,
          balanceAfter: matchingReferrer.balance + rewardAmount,
          description: `রেফারেল বোনাস (${newUser.name})`,
          status: 'completed',
          createdAt: Date.now()
        };

        // Instantly credit referrer in Firestore database with increment(1) on referralCount!
        try {
          await updateDoc(doc(db, 'users', matchingReferrer.uid), {
            balance: increment(rewardAmount),
            referralEarned: increment(rewardAmount),
            totalEarned: increment(rewardAmount),
            referralCount: increment(1)
          });
          await setDoc(doc(db, 'referrals', refItem.id), {
            ...refItem,
            createdAtServer: serverTimestamp()
          });
          await setDoc(doc(db, 'transactions', refTxn.id), {
            ...refTxn,
            createdAtServer: serverTimestamp()
          });

          // Create notification for referrer
          const notifId = 'notif_ref_' + Date.now();
          await setDoc(doc(db, 'notifications', notifId), {
            id: notifId,
            uid: matchingReferrer.uid,
            title: '🎉 নতুন রেফারেল সফল হয়েছে!',
            message: `${newUser.name} আপনার রেফার কোড ব্যবহার করে যোগ দিয়েছেন। আপনার রেফার সংখ্যা বৃদ্ধি পেয়েছে এবং ৳${rewardAmount} জমা হয়েছে!`,
            type: 'referral',
            read: false,
            createdAt: Date.now(),
            createdAtServer: serverTimestamp()
          });
        } catch (refErr) {
          console.warn('Firestore referral sync note:', refErr);
        }

        setReferrals(prev => [refItem, ...prev]);
        setTransactions(prev => [refTxn, ...prev]);
      }

      setUser(newUser);
      setAllUsersList(prev => [newUser, ...prev.filter(u => u.uid !== uid)]);
      localStorage.removeItem(STORAGE_KEYS.SAVED_REF);

      // Save to device registered accounts list
      if (!deviceAccounts.includes(cleanEmail)) {
        deviceAccounts.push(cleanEmail);
        localStorage.setItem(DEVICE_ACCOUNTS_KEY, JSON.stringify(deviceAccounts));
      }

      const welcomeMsg = `🎉 স্বাগতম ${name}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`;
      showToast(welcomeMsg, 'success');
      setActiveTab('home');
      return { success: true, message: welcomeMsg };
    } catch (err: any) {
      const errMsg = err.message || 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login with Email or Phone - STRICT VALIDATION: Only registered users can log in
  const loginWithEmail = async (emailOrPhone: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const cleanInput = emailOrPhone.trim().toLowerCase();
      const cleanPhone = emailOrPhone.trim();

      if (!cleanInput || !pass) {
        const msg = '❌ অনুগ্রহ করে আপনার ইমেইল অথবা মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }

      // 👑 Dedicated Master Admin Login (jonnykumar72iw@gmail.com / 22558800)
      if (cleanInput === 'jonnykumar72iw@gmail.com') {
        if (pass !== '22558800') {
          const msg = '❌ এডমিন পাসওয়ার্ড সঠিক নয়!';
          showToast(msg, 'error');
          return { success: false, message: msg };
        }
        const existingAdmin = allUsersList.find(u => u.email.toLowerCase() === 'jonnykumar72iw@gmail.com');
        const resolvedAdminUser: UserProfile = existingAdmin ? {
          ...existingAdmin,
          role: 'admin',
          isVerifiedPublisher: true
        } : {
          uid: 'admin_jonnykumar_72',
          name: 'Jonny Kumar (Admin)',
          email: 'jonnykumar72iw@gmail.com',
          phone: '01700000000',
          balance: 5000,
          todayEarned: 0,
          totalEarned: 5000,
          referralEarned: 1500,
          referralCount: 30,
          totalWithdrawn: 0,
          referralCode: 'JMEADMIN',
          role: 'admin',
          accountStatus: 'active',
          isVerifiedPublisher: true,
          createdAt: Date.now() - 30 * 86400000,
          lastActiveDate: getTodayDateStr(),
          dailySpinCount: 0,
          lastSpinDate: getTodayDateStr(),
          todayTaskCompletions: {},
          completedMicroJobs: {}
        };
        if (!existingAdmin) {
          setAllUsersList(prev => [resolvedAdminUser, ...prev]);
        }
        setUser(resolvedAdminUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(resolvedAdminUser));
        localStorage.setItem('jme_admin_auth', 'true');
        showToast('🔑 স্বাগতম! সফলভাবে মাস্টার এডমিন হিসেবে লগইন হয়েছে।', 'success');
        setActiveTab('home');
        return { success: true, message: 'স্বাগতম মাস্টার এডমিন!' };
      }

      let authUid: string | null = null;
      let firebaseAuthSuccess = false;

      // Try Firebase Sign-In if input looks like an email
      if (cleanInput.includes('@')) {
        try {
          const cred = await signInWithEmailAndPassword(auth, cleanInput, pass);
          authUid = cred.user.uid;
          firebaseAuthSuccess = true;
        } catch (fbErr: any) {
          console.warn('Firebase Email Sign-In notice:', fbErr?.code);
          if (
            fbErr?.code === 'auth/wrong-password' ||
            fbErr?.code === 'auth/invalid-credential' ||
            fbErr?.code === 'auth/invalid-login-credentials'
          ) {
            const msg = '❌ ভুল পাসওয়ার্ড! আপনার দেওয়া পাসওয়ার্ডটি সঠিক নয়।';
            showToast(msg, 'error');
            return { success: false, message: msg };
          }
        }
      }

      // Check stored credentials map for strict password matching
      let credMap: Record<string, { uid: string; email: string; phone: string; password: string }> = {};
      try {
        const rawCreds = localStorage.getItem('jme_user_creds');
        if (rawCreds) credMap = JSON.parse(rawCreds);
      } catch (e) {}

      const matchedCred = credMap[cleanInput] || credMap[cleanPhone];

      // If credentials exist locally and password does not match
      if (matchedCred && matchedCred.password !== pass) {
        const msg = '❌ ভুল পাসওয়ার্ড! আপনার দেওয়া পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }

      // Look up user profile from Firestore or state
      let foundUser: UserProfile | null = null;
      if (authUid) {
        try {
          const userDoc = await getDoc(doc(db, 'users', authUid));
          if (userDoc.exists()) {
            foundUser = userDoc.data() as UserProfile;
          }
        } catch (e) {
          console.warn('Firestore fetch user error:', e);
        }
      }

      if (!foundUser) {
        try {
          // Query by email
          const qEmail = query(collection(db, 'users'), where('email', '==', cleanInput), limit(1));
          const snapEmail = await getDocs(qEmail);
          if (!snapEmail.empty) {
            foundUser = snapEmail.docs[0].data() as UserProfile;
          } else {
            // Query by phone
            const qPhone = query(collection(db, 'users'), where('phone', '==', cleanPhone), limit(1));
            const snapPhone = await getDocs(qPhone);
            if (!snapPhone.empty) {
              foundUser = snapPhone.docs[0].data() as UserProfile;
            }
          }
        } catch (e) {
          console.warn('Firestore query by email/phone error:', e);
        }
      }

      if (!foundUser) {
        const cached = allUsersList.find(
          u => u.email.toLowerCase() === cleanInput || u.phone === cleanPhone || (matchedCred && u.uid === matchedCred.uid)
        );
        if (cached) {
          foundUser = cached;
        }
      }

      // If user is NOT found in any database or cache
      if (!foundUser && !firebaseAuthSuccess) {
        const msg = '❌ কোনো অ্যাকাউন্ট পাওয়া যায়নি! আপনার দেওয়া তথ্যে কোনো অ্যাকাউন্ট নিবন্ধিত নেই। অনুগ্রহ করে "নতুন একাউন্ট খুলুন" ট্যাবে গিয়ে সাইন আপ করুন।';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }

      if (foundUser && (foundUser.accountStatus === 'suspended' || foundUser.accountStatus === 'banned')) {
        const msg = '❌ আপনার অ্যাকাউন্ট সাময়িকভাবে স্থগিত রয়েছে। বিস্তারিত জানতে সাপোর্টে যোগাযোগ করুন।';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }

      if (foundUser) {
        setUser(foundUser);
        const successMsg = `🎉 স্বাগতম ${foundUser.name}! লগইন সফল হয়েছে।`;
        showToast(successMsg, 'success');
        setActiveTab('home');
        return { success: true, message: successMsg };
      }

      const fallbackMsg = '❌ কোনো অ্যাকাউন্ট পাওয়া যায়নি! আগে রেজিস্টার করুন।';
      showToast(fallbackMsg, 'error');
      return { success: false, message: fallbackMsg };
    } catch (err: any) {
      const errorMsg = err.message || 'লগইন ব্যর্থ হয়েছে।';
      showToast(errorMsg, 'error');
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const loginWithGoogle = async (refCode?: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const gUser = res.user;

      let existingProfile: UserProfile | null = null;
      try {
        const snap = await getDoc(doc(db, 'users', gUser.uid));
        if (snap.exists()) {
          existingProfile = snap.data() as UserProfile;
        }
      } catch (e) {
        console.warn('Firestore read error in Google Login:', e);
      }

      if (!existingProfile) {
        const today = getTodayDateStr();
        existingProfile = {
          uid: gUser.uid,
          name: gUser.displayName || 'ব্যবহারকারী',
          email: gUser.email || '',
          phone: gUser.phoneNumber || '01XXXXXXXXX',
          referralCode: generateReferralCode(),
          referredBy: refCode?.trim().toUpperCase() || undefined,
          referralCount: 0,
          balance: 0, // Fresh account starts with 0
          todayEarned: 0,
          totalEarned: 0,
          referralEarned: 0,
          totalWithdrawn: 0,
          accountStatus: 'active',
          role: 'user',
          createdAt: Date.now(),
          lastActiveDate: today,
          dailySpinCount: 0,
          lastSpinDate: today,
          todayTaskCompletions: {},
          completedMicroJobs: {}
        };

        try {
          await setDoc(doc(db, 'users', gUser.uid), {
            ...existingProfile,
            createdAtServer: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${gUser.uid}`);
        }

        setAllUsersList(prev => [existingProfile!, ...prev.filter(u => u.uid !== gUser.uid)]);
      }

      if (existingProfile) {
        setUser(existingProfile);
        showToast(`স্বাগতম ${existingProfile.name}!`, 'success');
        setActiveTab('home');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('গুগল সাইন-ইন ব্যর্থ হয়েছে: ' + (err.message || 'Unknown error'), 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo User Login
  const loginAsDemoUser = () => {
    const demoUser: UserProfile = {
      uid: 'user_demo',
      name: 'টেস্ট ব্যবহারকারী',
      email: 'user@jmeads.com',
      phone: '01712345678',
      referralCode: 'JME8X7K2',
      referralCount: 0,
      balance: 0,
      todayEarned: 0,
      totalEarned: 0,
      referralEarned: 0,
      totalWithdrawn: 0,
      accountStatus: 'active',
      role: 'user',
      createdAt: Date.now() - 86400000,
      lastActiveDate: getTodayDateStr(),
      dailySpinCount: 0,
      lastSpinDate: getTodayDateStr(),
      todayTaskCompletions: {},
      completedMicroJobs: {}
    };
    setUser(demoUser);
    showToast('টেস্ট ইউজার হিসেবে প্রবেশ করা হয়েছে। ব্যালেন্স: ৳০', 'info');
    setActiveTab('home');
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    setUser(null);
    setFirebaseUser(null);
    setActiveTab('home');
    showToast('আপনি সফলভাবে লগআউট হয়েছেন।', 'info');
  };

  // Start Task session: opens ad link, begins 15-second timer
  const startTask = (task: TaskItem) => {
    if (!user) {
      showToast('টাস্ক শুরু করতে প্রথমে লগইন করুন।', 'warning');
      return;
    }
    if (user.accountStatus === 'suspended' || user.accountStatus === 'banned') {
      showToast('আপনার অ্যাকাউন্ট স্থগিত আছে। কাজ করতে পারবেন না।', 'error');
      return;
    }

    const todayCount = user.todayTaskCompletions?.[task.id] || 0;
    if (todayCount >= task.dailyLimit) {
      showToast(`আজকের জন্য এই বিজ্ঞাপনের কাজ সমাপ্ত (${task.dailyLimit}/${task.dailyLimit})। কাল আবার চেষ্টা করুন।`, 'warning');
      return;
    }

    // Open smartlink in new window/tab
    try {
      window.open(task.smartLink, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.error('Failed to open window:', e);
    }

    // Start 15-second active session
    setActiveTaskSession({
      taskId: task.id,
      startTime: Date.now(),
      requiredSeconds: settings.minimumAdSeconds || 15,
      tabOpened: true,
      status: 'running'
    });

    showToast(`বিজ্ঞাপন লোড হচ্ছে... কমপক্ষে ১৫ সেকেন্ড অপেক্ষা করুন!`, 'info');
  };

  // Complete active task when timer finishes
  const completeActiveTask = () => {
    if (!activeTaskSession || !user) return;
    const task = tasks.find(t => t.id === activeTaskSession.taskId);
    if (!task) {
      setActiveTaskSession(null);
      return;
    }

    const elapsed = (Date.now() - activeTaskSession.startTime) / 1000;
    if (elapsed < activeTaskSession.requiredSeconds - 0.5) {
      // Early return fraud check!
      setActiveTaskSession(null);
      setEarlyReturnWarning(true);
      showToast('❌ কাজ বাতিল! আপনি ১৫ সেকেন্ড শেষ হওয়ার পূর্বেই ফিরে এসেছেন।', 'error');
      return;
    }

    // Check daily limit again
    const currentCount = user.todayTaskCompletions?.[task.id] || 0;
    if (currentCount >= task.dailyLimit) {
      setActiveTaskSession(null);
      showToast('আজকের এই টাস্কের সীমা আগেই পূর্ণ হয়েছে।', 'warning');
      return;
    }

    const reward = task.reward || settings.adReward || 5;
    const newCount = currentCount + 1;
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + reward;

    const updatedUser: UserProfile = {
      ...user,
      balance: balanceAfter,
      todayEarned: user.todayEarned + reward,
      totalEarned: user.totalEarned + reward,
      todayTaskCompletions: {
        ...(user.todayTaskCompletions || {}),
        [task.id]: newCount
      }
    };

    const newTxn: TransactionItem = {
      id: 'txn_' + Date.now(),
      uid: user.uid,
      type: 'ad_reward',
      amount: reward,
      balanceBefore,
      balanceAfter,
      description: `${task.banglaTitle} রিওয়ার্ড (${newCount}/${task.dailyLimit})`,
      status: 'completed',
      createdAt: Date.now()
    };

    // Update in Firestore
    try {
      updateDoc(doc(db, 'users', user.uid), {
        balance: balanceAfter,
        todayEarned: updatedUser.todayEarned,
        totalEarned: updatedUser.totalEarned,
        [`todayTaskCompletions.${task.id}`]: newCount
      });
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }

    setUser(updatedUser);
    setTransactions(prev => [newTxn, ...prev]);
    setActiveTaskSession(null);

    // Confetti burst for reward delight
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#16A34A', '#86EFAC', '#F59E0B']
    });

    showToast(`🎉 অভিনন্দন! ৳${reward.toFixed(2)} আপনার অ্যাকাউন্টে যোগ হয়েছে!`, 'success');
  };

  const cancelActiveTask = () => {
    setActiveTaskSession(null);
    showToast('টাস্ক বাতিল করা হয়েছে।', 'info');
  };

  // Request Withdrawal
  const requestWithdrawal = async (
    method: 'bKash' | 'Nagad' | 'Rocket' | 'Upay',
    accountNumber: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'অনুগ্রহ করে প্রথমে লগইন করুন।' };
    if (user.accountStatus !== 'active') return { success: false, error: 'আপনার অ্যাকাউন্ট সক্রিয় নয়।' };

    if (amount < settings.minWithdrawal) {
      return { success: false, error: `সর্বনিম্ন উত্তোলনের পরিমাণ ৳${settings.minWithdrawal}` };
    }

    if (user.balance < amount) {
      return { success: false, error: 'আপনার একাউন্টে পর্যাপ্ত ব্যালেন্স নেই।' };
    }

    if (!accountNumber || accountNumber.length < 11) {
      return { success: false, error: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন।' };
    }

    // STRICT WITHDRAWAL RULE: Must refer at least 20 active people
    const minRefs = settings.minReferralsRequiredForWithdrawal ?? 20;
    const userReferralsCount = referrals.filter(r => r.referrerUid === user.uid).length;
    if (userReferralsCount < minRefs) {
      return { 
        success: false, 
        error: `উত্তোলনের জন্য শর্ত: আপনার একাউন্টে কমপক্ষে ${minRefs} জন রেফারেল থাকা বাধ্যতামূলক! বর্তমানে আপনার রেফার রয়েছে ${userReferralsCount} জন।` 
      };
    }

    const fee = Math.round(amount * (settings.withdrawalFee / 100));
    const netAmount = amount - fee;
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - amount;

    const withdrawalItem: WithdrawalItem = {
      id: 'WD_' + Date.now().toString().slice(-6),
      uid: user.uid,
      userName: user.name,
      userPhone: accountNumber,
      method,
      accountNumber,
      amount,
      fee,
      netAmount,
      status: 'pending',
      createdAt: Date.now()
    };

    const txnItem: TransactionItem = {
      id: 'txn_wd_' + Date.now(),
      uid: user.uid,
      type: 'withdrawal',
      amount: -amount,
      balanceBefore,
      balanceAfter,
      description: `${method} উত্তোলন আবেদন (#${withdrawalItem.id})`,
      status: 'pending',
      createdAt: Date.now()
    };

    const notifItem: NotificationItem = {
      id: 'notif_' + Date.now(),
      uid: user.uid,
      title: 'উত্তোলন আবেদন গৃহীত হয়েছে',
      message: `আপনার ৳${amount} (${method}) উত্তোলন আবেদন প্রক্রিয়াধীন আছে। শীঘ্রই পেমেন্ট সম্পন্ন হবে।`,
      type: 'withdrawal',
      read: false,
      createdAt: Date.now()
    };

    // Update user balance in Firestore
    try {
      updateDoc(doc(db, 'users', user.uid), {
        balance: balanceAfter,
        totalWithdrawn: user.totalWithdrawn + amount
      });
      setDoc(doc(db, 'withdrawals', withdrawalItem.id), {
        ...withdrawalItem,
        createdAtServer: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore withdrawal sync error:', e);
    }

    setUser(prev => prev ? {
      ...prev,
      balance: balanceAfter,
      totalWithdrawn: prev.totalWithdrawn + amount
    } : null);

    setWithdrawals(prev => [withdrawalItem, ...prev]);
    setTransactions(prev => [txnItem, ...prev]);
    setNotifications(prev => [notifItem, ...prev]);

    return { success: true };
  };

  // Claim Welcome / Sign-up Bonus
  const claimWelcomeBonus = (amount = 120) => {
    if (!user) return;
    const bonusAmount = amount;
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + bonusAmount;

    const updatedUser: UserProfile = {
      ...user,
      balance: balanceAfter,
      todayEarned: user.todayEarned + bonusAmount,
      totalEarned: user.totalEarned + bonusAmount
    };

    const newTxn: TransactionItem = {
      id: 'txn_welcome_' + Date.now(),
      uid: user.uid,
      type: 'bonus',
      amount: bonusAmount,
      balanceBefore,
      balanceAfter,
      description: 'সাইন-আপ ওয়েলকাম বোনাস',
      status: 'completed',
      createdAt: Date.now()
    };

    try {
      updateDoc(doc(db, 'users', user.uid), {
        balance: balanceAfter,
        todayEarned: updatedUser.todayEarned,
        totalEarned: updatedUser.totalEarned
      }).catch(() => {});
      setDoc(doc(db, 'transactions', newTxn.id), {
        ...newTxn,
        createdAtServer: serverTimestamp()
      }).catch(() => {});
    } catch (e) {
      console.warn('Firestore bonus sync note:', e);
    }

    setUser(updatedUser);
    setTransactions(prev => [newTxn, ...prev]);
    setAllUsersList(prev => prev.map(u => (u.uid === user.uid ? updatedUser : u)));
    localStorage.setItem(`jme_welcome_bonus_${user.uid}`, 'true');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#16A34A', '#86EFAC', '#F59E0B']
    });

    showToast(`🎉 অভিনন্দন! ৳${bonusAmount} বোনাস সফলভাবে গ্রহণ করা হয়েছে!`, 'success');
  };

  // Spin Wheel
  const spinWheel = () => {
    if (!user) return { reward: 0, index: 0, success: false, message: 'লগইন করুন' };
    if (user.dailySpinCount >= 3) {
      return { reward: 0, index: 0, success: false, message: 'আজকের ৩টি স্পিন সম্পন্ন হয়েছে! কাল আবার আসুন।' };
    }

    const segments = [
      { reward: 1, label: '৳১' },
      { reward: 0, label: 'চেষ্টা করুন' },
      { reward: 2, label: '৳২' },
      { reward: 5, label: '৳৫' },
      { reward: 0, label: 'মিস!' },
      { reward: 10, label: '৳১০' },
      { reward: 1, label: '৳১' },
      { reward: 0, label: 'আবার চেষ্টা' }
    ];

    const chosenIdx = Math.floor(Math.random() * segments.length);
    const winReward = segments[chosenIdx].reward;

    const newSpinCount = user.dailySpinCount + 1;
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + winReward;

    setUser(prev => prev ? {
      ...prev,
      balance: balanceAfter,
      todayEarned: prev.todayEarned + winReward,
      totalEarned: prev.totalEarned + winReward,
      dailySpinCount: newSpinCount,
      lastSpinDate: getTodayDateStr()
    } : null);

    if (winReward > 0) {
      const spinTxn: TransactionItem = {
        id: 'txn_spin_' + Date.now(),
        uid: user.uid,
        type: 'spin_reward',
        amount: winReward,
        balanceBefore,
        balanceAfter,
        description: `লাকি স্পিন পুরষ্কার (৳${winReward})`,
        status: 'completed',
        createdAt: Date.now()
      };
      setTransactions(prev => [spinTxn, ...prev]);
    }

    return { reward: winReward, index: chosenIdx, success: true };
  };

  // Micro Job Start
  const startMicroJob = (job: MicroJobItem) => {
    if (!user) {
      showToast('কাজ শুরু করতে প্রথমে লগইন করুন।', 'warning');
      return;
    }
    if (user.completedMicroJobs?.[job.id]) {
      showToast('আজকের জন্য আপনি এই অফারটি ইতোমধ্যে সম্পন্ন করেছেন!', 'info');
      return;
    }

    setActiveMicroJob(job);
    setMicroJobSecondsLeft(job.requiredDurationSeconds || 60);

    // Open video/offer URL in a new window/tab
    if (job.url && job.url.trim() !== '') {
      try {
        window.open(job.url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Could not open offer URL:', e);
      }
    }
    showToast(`কাজ শুরু হয়েছে! নিয়ম অনুযায়ী ভিডিও/অফার দেখুন (${job.requiredDurationSeconds} সেকেন্ড)`, 'info');
  };

  // Micro Job Complete
  const completeMicroJob = async () => {
    if (!activeMicroJob || !user) return;
    const job = activeMicroJob;
    const reward = job.reward || 10;
    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + reward;

    const updatedUser: UserProfile = {
      ...user,
      balance: balanceAfter,
      todayEarned: user.todayEarned + reward,
      totalEarned: user.totalEarned + reward,
      completedMicroJobs: {
        ...(user.completedMicroJobs || {}),
        [job.id]: Date.now()
      }
    };

    const newTxn: TransactionItem = {
      id: 'txn_mj_' + Date.now(),
      uid: user.uid,
      type: 'bonus',
      amount: reward,
      balanceBefore,
      balanceAfter,
      description: `মাইক্রো জব রিওয়ার্ড: ${job.title}`,
      status: 'completed',
      createdAt: Date.now()
    };

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        balance: increment(reward),
        todayEarned: increment(reward),
        totalEarned: increment(reward),
        [`completedMicroJobs.${job.id}`]: Date.now()
      });
      await setDoc(doc(db, 'transactions', newTxn.id), {
        ...newTxn,
        createdAtServer: serverTimestamp()
      });
      await updateDoc(doc(db, 'micro_jobs', job.id), {
        totalSubmissions: increment(1)
      }).catch(() => {});
    } catch (fsErr) {
      console.warn('Firestore microjob complete sync note:', fsErr);
    }

    setUser(updatedUser);
    setTransactions(prev => [newTxn, ...prev]);
    setActiveMicroJob(null);
    setMicroJobSecondsLeft(0);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899']
    });

    showToast(`🎉 অভিনন্দন! ৳${reward.toFixed(2)} সফলভাবে একাউন্টে জমা হয়েছে!`, 'success');
  };

  const cancelMicroJob = () => {
    setActiveMicroJob(null);
    setMicroJobSecondsLeft(0);
    showToast('কাজটি বাতিল করা হয়েছে।', 'info');
  };

  // Update User Profile Avatar / Logo (compressed under 100KB)
  const updateUserAvatar = async (photoDataUrl: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const updatedUser: UserProfile = { ...user, photoURL: photoDataUrl };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      // Also update in allUsersList in state & storage
      setAllUsersList(prev => prev.map(u => u.uid === user.uid ? { ...u, photoURL: photoDataUrl } : u));

      // Update in Firestore
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          photoURL: photoDataUrl
        });
      } catch (err) {
        console.warn('Firestore user avatar update note:', err);
      }
      return true;
    } catch (e) {
      console.error('Failed to update avatar:', e);
      return false;
    }
  };

  // Submit Remote Job Proof (with dual screenshots, AI analytics and time verification)
  const submitJobProof = async (data: {
    jobId: string;
    jobTitle: string;
    startScreenshotUrl?: string;
    endScreenshotUrl?: string;
    requiredSeconds: number;
    spentSeconds: number;
    proofText?: string;
    reward: number;
    aiAnalytics?: AIAnalyticsReport;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'প্রথমে লগইন করুন' };

    const newId = 'sub_' + Date.now();
    const submission: JobSubmissionItem = {
      id: newId,
      jobId: data.jobId,
      jobTitle: data.jobTitle,
      uid: user.uid,
      userName: user.name,
      userPhone: user.phone,
      startScreenshotUrl: data.startScreenshotUrl,
      endScreenshotUrl: data.endScreenshotUrl,
      requiredSeconds: data.requiredSeconds,
      spentSeconds: data.spentSeconds,
      proofText: data.proofText,
      reward: data.reward,
      status: 'pending',
      aiAnalytics: data.aiAnalytics,
      submittedAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'job_submissions', newId), {
        ...submission,
        createdAtServer: serverTimestamp()
      });

      // Update local submissions list state as well
      setJobSubmissions(prev => [submission, ...prev.filter(s => s.id !== newId)]);

      // Mark completed for today in user's profile
      await updateDoc(doc(db, 'users', user.uid), {
        [`completedMicroJobs.${data.jobId}`]: Date.now()
      });

      setUser(prev => prev ? {
        ...prev,
        completedMicroJobs: { ...(prev.completedMicroJobs || {}), [data.jobId]: Date.now() }
      } : null);

      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  // Request Publisher Upgrade
  const requestPublisherUpgrade = async (trxId: string, method: string): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: 'প্রথমে লগইন করুন' };

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        verificationRequested: true,
        verificationTrxId: trxId,
        verificationMethod: method
      });

      setUser(prev => prev ? {
        ...prev,
        verificationRequested: true,
        verificationTrxId: trxId,
        verificationMethod: method
      } : null);

      return { success: true };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  // Admin Approve Job Submission
  const adminApproveJobSubmission = async (submissionId: string) => {
    const sub = jobSubmissions.find(s => s.id === submissionId);
    if (!sub) return;

    try {
      await updateDoc(doc(db, 'job_submissions', submissionId), {
        status: 'approved',
        reviewedAt: Date.now()
      });

      await updateDoc(doc(db, 'users', sub.uid), {
        balance: increment(sub.reward),
        todayEarned: increment(sub.reward),
        totalEarned: increment(sub.reward)
      });

      const txnId = 'txn_sub_' + Date.now();
      await setDoc(doc(db, 'transactions', txnId), {
        id: txnId,
        uid: sub.uid,
        type: 'bonus',
        amount: sub.reward,
        description: `রিমোট জব অনুমোদিত: ${sub.jobTitle}`,
        status: 'completed',
        createdAt: Date.now(),
        createdAtServer: serverTimestamp()
      });

      // Send notification to user
      const notifId = 'notif_sub_' + Date.now();
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        uid: sub.uid,
        title: '🎉 রিমোট জব অনুমোদিত!',
        message: `আপনার "${sub.jobTitle}" কাজের প্রমাণ অনুমোদিত হয়েছে এবং ৳${sub.reward} ব্যালেন্সে যুক্ত করা হয়েছে!`,
        type: 'reward',
        read: false,
        createdAt: Date.now(),
        createdAtServer: serverTimestamp()
      });

      showToast(`সাবমিশন অনুমোদিত হয়েছে এবং ৳${sub.reward} ব্যালেন্সে যোগ হয়েছে!`, 'success');
    } catch (e: any) {
      showToast('অ্যাপ্রুভাল ব্যর্থ: ' + e.message, 'error');
    }
  };

  // Admin Reject Job Submission
  const adminRejectJobSubmission = async (submissionId: string, reason?: string) => {
    const sub = jobSubmissions.find(s => s.id === submissionId);
    try {
      await updateDoc(doc(db, 'job_submissions', submissionId), {
        status: 'rejected',
        adminNote: reason || 'প্রমাণ স্ক্রিনশট বা টাইমার নিয়ম মানা হয়নি',
        reviewedAt: Date.now()
      });

      if (sub) {
        const notifId = 'notif_sub_rej_' + Date.now();
        await setDoc(doc(db, 'notifications', notifId), {
          id: notifId,
          uid: sub.uid,
          title: '❌ রিমোট জব বাতিল হয়েছে',
          message: `আপনার "${sub.jobTitle}" কাজের প্রমাণ বাতিল করা হয়েছে। কারণ: ${reason || 'প্রমাণ সঠিক নয়'}।`,
          type: 'warning',
          read: false,
          createdAt: Date.now(),
          createdAtServer: serverTimestamp()
        });
      }

      showToast('সাবমিশন বাতিল করা হয়েছে', 'info');
    } catch (e: any) {
      showToast('রিজেক্ট ব্যর্থ: ' + e.message, 'error');
    }
  };

  // Admin Approve Publisher Upgrade
  const adminApprovePublisherUpgrade = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isVerifiedPublisher: true,
        verificationRequested: false,
        verifiedAt: Date.now()
      });

      const notifId = 'notif_pub_' + Date.now();
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        uid: userId,
        title: '🌟 অভিনন্দন! পার্মানেন্ট পাবলিশার ভেরিফাইড!',
        message: 'আপনার অ্যাকাউন্ট সফলভাবে ভেরিফাইড পার্মানেন্ট পাবলিশার হিসেবে আপগ্রেড হয়েছে। এখন থেকে সকল কাজে ২ গুণ (2X) ডাবল ইনকাম পাবেন!',
        type: 'success',
        read: false,
        createdAt: Date.now(),
        createdAtServer: serverTimestamp()
      });

      showToast('ইউজার সফলভাবে ভেরিফাইড পার্মানেন্ট পাবলিশার হিসেবে আপগ্রেড হয়েছেন!', 'success');
    } catch (e: any) {
      showToast('আপগ্রেড ব্যর্থ: ' + e.message, 'error');
    }
  };

  // Admin Reject Publisher Upgrade
  const adminRejectPublisherUpgrade = async (userId: string, reason?: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        verificationRequested: false,
        verificationTrxId: null,
        verificationMethod: null
      });

      const notifId = 'notif_pub_rej_' + Date.now();
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        uid: userId,
        title: '❌ পাবলিশার ভেরিফিকেশন বাতিল',
        message: `আপনার পার্মানেন্ট পাবলিশার ভেরিফিকেশন আবেদন বাতিল করা হয়েছে। কারণ: ${reason || 'ভুল বা অসত্য TrxID'}। অনুগ্রহ করে সঠিক TrxID দিয়ে আবার চেষ্টা করুন।`,
        type: 'warning',
        read: false,
        createdAt: Date.now(),
        createdAtServer: serverTimestamp()
      });

      showToast('ভেরিফিকেশন আবেদন বাতিল করা হয়েছে।', 'info');
    } catch (e: any) {
      showToast('রিজেক্ট ব্যর্থ: ' + e.message, 'error');
    }
  };

  const adminAddMicroJob = async (newJob: Omit<MicroJobItem, 'id' | 'createdAt'>) => {
    const newId = 'job_' + Date.now();
    const fullJob: MicroJobItem = {
      ...newJob,
      id: newId,
      createdAt: Date.now(),
      totalSubmissions: 0,
      active: true
    };
    try {
      await setDoc(doc(db, 'micro_jobs', newId), {
        ...fullJob,
        createdAtServer: serverTimestamp()
      });
      setMicroJobs(prev => [fullJob, ...prev].sort((a, b) => (b.priority || 0) - (a.priority || 0)));
      showToast('নতুন অফার সফলভাবে ক্লাউডে যোগ করা হয়েছে!', 'success');
    } catch (e: any) {
      showToast('অফার যোগ করতে সমস্যা হয়েছে: ' + e.message, 'error');
    }
  };

  const adminUpdateMicroJob = async (id: string, updates: Partial<MicroJobItem>) => {
    try {
      await updateDoc(doc(db, 'micro_jobs', id), updates);
      setMicroJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j).sort((a, b) => (b.priority || 0) - (a.priority || 0)));
      showToast('অফার আপডেট হয়েছে!', 'success');
    } catch (e: any) {
      showToast('আপডেট ব্যর্থ হয়েছে: ' + e.message, 'error');
    }
  };

  const adminDeleteMicroJob = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'micro_jobs', id));
      setMicroJobs(prev => prev.filter(j => j.id !== id));
      showToast('অফার ডিলিট করা হয়েছে!', 'info');
    } catch (e: any) {
      showToast('ডিলিট ব্যর্থ: ' + e.message, 'error');
    }
  };

  // Admin Actions
  const adminUpdateUserBalance = (uid: string, delta: number, reason: string) => {
    setAllUsersList(prev => prev.map(u => {
      if (u.uid === uid) {
        const balBefore = u.balance;
        const balAfter = Math.max(0, balBefore + delta);
        const adminTxn: TransactionItem = {
          id: 'txn_adm_' + Date.now(),
          uid: u.uid,
          type: 'admin_adjustment',
          amount: delta,
          balanceBefore: balBefore,
          balanceAfter: balAfter,
          description: `এডমিন সমন্বয়: ${reason}`,
          status: 'completed',
          createdAt: Date.now()
        };
        setTransactions(t => [adminTxn, ...t]);
        return {
          ...u,
          balance: balAfter,
          totalEarned: delta > 0 ? u.totalEarned + delta : u.totalEarned
        };
      }
      return u;
    }));

    if (user && user.uid === uid) {
      setUser(prev => prev ? {
        ...prev,
        balance: Math.max(0, prev.balance + delta)
      } : null);
    }

    try {
      updateDoc(doc(db, 'users', uid), {
        balance: increment(delta),
        ...(delta > 0 ? { totalEarned: increment(delta) } : {})
      }).catch(() => {});
    } catch (e) {
      console.warn('Firestore balance update note:', e);
    }

    showToast(`ইউজারের ব্যালেন্স সফলভাবে আপডেট করা হয়েছে (${delta >= 0 ? '+' : ''}${delta})`, 'success');
  };

  const adminToggleUserStatus = (uid: string, status: 'active' | 'suspended') => {
    setAllUsersList(prev => prev.map(u => u.uid === uid ? { ...u, accountStatus: status } : u));
    if (user && user.uid === uid) {
      setUser(prev => prev ? { ...prev, accountStatus: status } : null);
    }
    try {
      updateDoc(doc(db, 'users', uid), { accountStatus: status }).catch(() => {});
    } catch (e) {}
    showToast(`ইউজারের স্ট্যাটাস '${status === 'active' ? 'সক্রিয়' : 'স্থগিত'}' করা হয়েছে।`, 'info');
  };

  const adminUpdateWithdrawalStatus = async (
    id: string, 
    status: 'approved' | 'paid' | 'rejected' | 'processing', 
    note?: string
  ) => {
    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    // If rejected, automatically refund the user!
    if (status === 'rejected' && withdrawal.status !== 'rejected') {
      adminUpdateUserBalance(withdrawal.uid, withdrawal.amount, `উত্তোলন বাতিল রিফান্ড (#${withdrawal.id})`);
    }

    setWithdrawals(prev => prev.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status,
          adminNote: note || w.adminNote,
          processedAt: Date.now()
        };
      }
      return w;
    }));

    try {
      await updateDoc(doc(db, 'withdrawals', id), {
        status,
        adminNote: note || withdrawal.adminNote || '',
        processedAt: Date.now()
      });

      const notifId = 'notif_w_' + Date.now();
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        uid: withdrawal.uid,
        title: status === 'paid' ? '💰 পেমেন্ট সম্পন্ন হয়েছে!' : status === 'rejected' ? '❌ উত্তোলন বাতিল ও রিফান্ড' : 'উত্তোলন আপডেট',
        message: status === 'paid' 
          ? `আপনার ৳${withdrawal.netAmount} টাকার উত্তোলন (${withdrawal.method}) সফলভাবে পরিশোধ করা হয়েছে!` 
          : status === 'rejected'
          ? `আপনার উত্তোলন আবেদন বাতিল করা হয়েছে। কারণ: ${note || 'অসঠিক তথ্য'}। আপনার ৳${withdrawal.amount} টাকা অ্যাকাউন্টে রিফান্ড করা হয়েছে।`
          : `আপনার উত্তোলন আবেদনের স্ট্যাটাস এখন ${status}।`,
        type: status === 'paid' ? 'success' : status === 'rejected' ? 'warning' : 'info',
        read: false,
        createdAt: Date.now(),
        createdAtServer: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore withdrawal status update note:', e);
    }

    showToast(`উত্তোলন #${id} স্ট্যাটাস '${status}' করা হয়েছে।`, 'success');
  };

  const adminUpdateTask = async (updatedTask: TaskItem) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks.map(t => t.id === updatedTask.id ? updatedTask : t)));
    try {
      await setDoc(doc(db, 'tasks', updatedTask.id), updatedTask, { merge: true });
    } catch (e) {
      console.warn('Firestore task update note:', e);
    }
    showToast(`টাস্ক "${updatedTask.banglaTitle}" আপডেট করা হয়েছে।`, 'success');
  };

  const adminAddTask = async (newTask: Omit<TaskItem, 'id'>) => {
    const taskWithId: TaskItem = {
      ...newTask,
      id: 'task_' + Date.now()
    };
    setTasks(prev => [taskWithId, ...prev]);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([taskWithId, ...tasks]));
    try {
      await setDoc(doc(db, 'tasks', taskWithId.id), taskWithId);
    } catch (e) {
      console.warn('Firestore task add note:', e);
    }
    showToast(`নতুন টাস্ক/স্মার্টলিংক "${newTask.banglaTitle}" সফলভাবে যুক্ত হয়েছে!`, 'success');
  };

  const adminDeleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks.filter(t => t.id !== id)));
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (e) {
      console.warn('Firestore task delete note:', e);
    }
    showToast('টাস্কটি সফলভাবে মুছে ফেলা হয়েছে।', 'info');
  };

  const adminUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      return merged;
    });
    try {
      await setDoc(doc(db, 'settings', 'app_config'), newSettings, { merge: true });
    } catch (e) {
      console.warn('Firestore settings update note:', e);
    }
    showToast('সিস্টেম সেটিংস সফলভাবে সংরক্ষিত ও কার্যকর হয়েছে!', 'success');
  };

  const adminBroadcastNotification = async (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' = 'info'
  ) => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      uid: 'all',
      title,
      message,
      type,
      read: false,
      createdAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'notifications', newNotif.id), {
        ...newNotif,
        createdAtServer: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore notification broadcast error:', e);
    }

    setNotifications(prev => [newNotif, ...prev]);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: 'https://i.supaimg.com/88cac59e-85c9-44fa-970b-faf486de12c5/cfd4da92-da3f-4f1a-b3dd-bcb09a3ba09a.png'
        });
      } catch (e) {
        console.warn('Browser notification trigger warning:', e);
      }
    }

    showToast('ব্রডকাস্ট নোটিফিকেশন সকল ইউজারের কাছে পাঠানো হয়েছে!', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Direct Contact Messages To Admin Panel
  const submitContactMessage = async (msg: { name: string; contact: string; subject?: string; message: string }) => {
    const newMsg: ContactMessageItem = {
      id: 'msg_' + Date.now(),
      name: msg.name.trim(),
      contact: msg.contact.trim(),
      subject: msg.subject?.trim() || 'সাধারণ বার্তা / অভিযোগ',
      message: msg.message.trim(),
      read: false,
      createdAt: Date.now()
    };
    setContactMessages(prev => [newMsg, ...prev]);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([newMsg, ...contactMessages]));
    try {
      await setDoc(doc(db, 'contact_messages', newMsg.id), {
        ...newMsg,
        createdAtServer: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore write contact message err:', e);
    }
    showToast('আপনার বার্তা সফলভাবে এডমিন প্যানেলে পাঠানো হয়েছে!', 'success');
    return { success: true };
  };

  const adminDeleteMessage = async (id: string) => {
    setContactMessages(prev => prev.filter(m => m.id !== id));
    try {
      await deleteDoc(doc(db, 'contact_messages', id));
    } catch (e) {}
    showToast('বার্তাটি মুছে ফেলা হয়েছে।', 'info');
  };

  const adminMarkMessageRead = async (id: string) => {
    setContactMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    try {
      await updateDoc(doc(db, 'contact_messages', id), { read: true });
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        activeTab,
        setActiveTab,
        tasks,
        transactions,
        withdrawals,
        referrals,
        notifications,
        settings,
        activeTaskSession,
        earlyReturnWarning,
        setEarlyReturnWarning,
        referralCodeInput,
        setReferralCodeInput,
        toast,
        showToast,
        closeToast,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        startTask,
        completeActiveTask,
        cancelActiveTask,
        requestWithdrawal,
        spinWheel,
        claimWelcomeBonus,
        microJobs,
        activeMicroJob,
        microJobSecondsLeft,
        selectedJobForDetails,
        setSelectedJobForDetails,
        startMicroJob,
        completeMicroJob,
        cancelMicroJob,
        updateUserAvatar,
        submitJobProof,
        jobSubmissions,
        requestPublisherUpgrade,
        adminApproveJobSubmission,
        adminRejectJobSubmission,
        adminApprovePublisherUpgrade,
        adminRejectPublisherUpgrade,
        adminAddMicroJob,
        adminUpdateMicroJob,
        adminDeleteMicroJob,
        adminUpdateUserBalance,
        adminToggleUserStatus,
        adminUpdateWithdrawalStatus,
        adminUpdateTask,
        adminAddTask,
        adminDeleteTask,
        adminUpdateSettings,
        adminBroadcastNotification,
        allUsersList,
        allWithdrawalsList: withdrawals,
        allTransactionsList: transactions,
        markNotificationRead,
        showAdminModal,
        setShowAdminModal,
        contactMessages,
        submitContactMessage,
        adminDeleteMessage,
        adminMarkMessageRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
