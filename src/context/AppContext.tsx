import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  TaskItem, 
  TransactionItem, 
  WithdrawalItem, 
  ReferralItem, 
  NotificationItem, 
  AppSettings 
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
  SAVED_REF: 'jme_pending_ref_code'
};

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

  // Dynamically load external data.json if present on hosting/server
  useEffect(() => {
    fetch('./data.json')
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.settings) {
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
          } else {
            // Document might not exist yet if just registered, handled in registration/google login
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

      // Check if user already exists
      const existingUser = allUsersList.find(
        u => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
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
      const newUser: UserProfile = {
        uid,
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        referralCode: generatedCode,
        referredBy: refCode?.trim().toUpperCase() || undefined,
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
        todayTaskCompletions: {}
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
        handleFirestoreError(fsErr, OperationType.WRITE, `users/${uid}`);
      }

      // Check referral reward if registered with a valid referral code
      if (newUser.referredBy) {
        const matchingReferrer = allUsersList.find(u => u.referralCode === newUser.referredBy);
        if (matchingReferrer && matchingReferrer.uid !== newUser.uid) {
          const rewardAmount = settings.referralReward;
          matchingReferrer.balance += rewardAmount;
          matchingReferrer.referralEarned += rewardAmount;
          matchingReferrer.totalEarned += rewardAmount;

          const refItem: ReferralItem = {
            id: 'ref_' + Date.now(),
            referrerUid: matchingReferrer.uid,
            referrerCode: matchingReferrer.referralCode,
            referredUid: newUser.uid,
            referredName: newUser.name,
            referredPhoneMasked: newUser.phone.slice(0, 3) + '****' + newUser.phone.slice(-3),
            rewardAmount,
            status: 'completed',
            createdAt: Date.now()
          };

          const refTxn: TransactionItem = {
            id: 'txn_ref_' + Date.now(),
            uid: matchingReferrer.uid,
            type: 'referral_reward',
            amount: rewardAmount,
            balanceBefore: matchingReferrer.balance - rewardAmount,
            balanceAfter: matchingReferrer.balance,
            description: `রেফারেল বোনাস (${newUser.name})`,
            status: 'completed',
            createdAt: Date.now()
          };

          try {
            await updateDoc(doc(db, 'users', matchingReferrer.uid), {
              balance: increment(rewardAmount),
              referralEarned: increment(rewardAmount),
              totalEarned: increment(rewardAmount)
            });
            await setDoc(doc(db, 'referrals', refItem.id), {
              ...refItem,
              createdAtServer: serverTimestamp()
            });
            await setDoc(doc(db, 'transactions', refTxn.id), {
              ...refTxn,
              createdAtServer: serverTimestamp()
            });
          } catch (refErr) {
            console.warn('Firestore referral sync note:', refErr);
          }

          setReferrals(prev => [refItem, ...prev]);
          setTransactions(prev => [refTxn, ...prev]);
        }
      }

      setUser(newUser);
      setAllUsersList(prev => [newUser, ...prev.filter(u => u.uid !== uid)]);
      localStorage.removeItem(STORAGE_KEYS.SAVED_REF);
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
          todayTaskCompletions: {}
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

      setUser(existingProfile);
      showToast(`স্বাগতম ${existingProfile.name}!`, 'success');
      setActiveTab('home');
      return true;
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
      todayTaskCompletions: {}
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
    showToast(`ইউজারের ব্যালেন্স সফলভাবে আপডেট করা হয়েছে (${delta >= 0 ? '+' : ''}${delta})`, 'success');
  };

  const adminToggleUserStatus = (uid: string, status: 'active' | 'suspended') => {
    setAllUsersList(prev => prev.map(u => u.uid === uid ? { ...u, accountStatus: status } : u));
    if (user && user.uid === uid) {
      setUser(prev => prev ? { ...prev, accountStatus: status } : null);
    }
    showToast(`ইউজারের স্ট্যাটাস '${status === 'active' ? 'সক্রিয়' : 'স্থগিত'}' করা হয়েছে।`, 'info');
  };

  const adminUpdateWithdrawalStatus = (
    id: string, 
    status: 'approved' | 'paid' | 'rejected' | 'processing', 
    note?: string
  ) => {
    setWithdrawals(prev => prev.map(w => {
      if (w.id === id) {
        // If rejected, automatically refund the user!
        if (status === 'rejected' && w.status !== 'rejected') {
          adminUpdateUserBalance(w.uid, w.amount, `উত্তোলন বাতিল রিফান্ড (#${w.id})`);
        }
        return {
          ...w,
          status,
          adminNote: note || w.adminNote,
          processedAt: Date.now()
        };
      }
      return w;
    }));
    showToast(`উত্তোলন #${id} স্ট্যাটাস '${status}' করা হয়েছে।`, 'success');
  };

  const adminUpdateTask = (updatedTask: TaskItem) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    showToast(`টাস্ক "${updatedTask.banglaTitle}" আপডেট করা হয়েছে।`, 'success');
  };

  const adminAddTask = (newTask: Omit<TaskItem, 'id'>) => {
    const taskWithId: TaskItem = {
      ...newTask,
      id: 'task_' + Date.now()
    };
    setTasks(prev => [taskWithId, ...prev]);
    showToast(`নতুন টাস্ক/স্মার্টলিংক "${newTask.banglaTitle}" সফলভাবে যুক্ত হয়েছে!`, 'success');
  };

  const adminDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('টাস্কটি সফলভাবে মুছে ফেলা হয়েছে।', 'info');
  };

  const adminUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('সিস্টেম সেটিংস সংরক্ষিত হয়েছে।', 'success');
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
        markNotificationRead
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
