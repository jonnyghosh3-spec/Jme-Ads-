import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MicroJobItem, TaskItem } from '../types';
import {
  Shield,
  X,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Flame,
  Clock,
  Sparkles,
  Zap,
  Users,
  Wallet,
  Eye,
  EyeOff,
  Briefcase,
  Play,
  ArrowUp,
  Settings,
  Send,
  Video,
  FileCode,
  DollarSign,
  Search,
  Lock,
  RefreshCw,
  Bell,
  Mail,
  ArrowLeft,
  Bot,
  Smartphone
} from 'lucide-react';

export const AdminPanelModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const {
    user,
    settings,
    adminUpdateSettings,
    tasks,
    adminAddTask,
    adminUpdateTask,
    adminDeleteTask,
    microJobs,
    adminAddMicroJob,
    adminUpdateMicroJob,
    adminDeleteMicroJob,
    jobSubmissions,
    adminApproveJobSubmission,
    adminRejectJobSubmission,
    allUsersList,
    adminUpdateUserBalance,
    adminAdjustUserBalance,
    adminToggleUserStatus,
    adminSetUserStatus,
    adminApproveSecurityVerification,
    adminAddYouTubeTutorial,
    adminUpdateYouTubeTutorial,
    adminDeleteYouTubeTutorial,
    adminToggleYouTubeTutorialActive,
    allWithdrawalsList,
    adminUpdateWithdrawalStatus,
    adminApprovePublisherUpgrade,
    adminRejectPublisherUpgrade,
    adminBroadcastNotification,
    contactMessages,
    adminDeleteMessage,
    adminMarkMessageRead,
    showToast
  } = useApp();

  // Admin Security PIN verification - Pre-authenticated for jonnykumar72iw@gmail.com
  const isMasterAdminEmail = user?.email?.toLowerCase() === 'jonnykumar72iw@gmail.com';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isMasterAdminEmail || localStorage.getItem('jme_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab inside Admin Panel
  const [adminTab, setAdminTab] = useState<
    'overview' | 'microjobs' | 'smartlinks' | 'submissions' | 'publishers' | 'withdrawals' | 'videos' | 'adsense' | 'users' | 'broadcast' | 'messages'
  >('overview');

  // Form states for YouTube Videos & Telegram
  const [ytVideo1Title, setYtVideo1Title] = useState(settings.youtubeVideo1Title || 'টিউটোরিয়াল ভিডিও ১: কীভাবে কাজ করবেন?');
  const [ytVideo1Url, setYtVideo1Url] = useState(settings.youtubeVideo1Url || '');
  const [ytVideo2Title, setYtVideo2Title] = useState(settings.youtubeVideo2Title || 'টিউটোরিয়াল ভিডিও ২: কীভাবে টাকা তুলবেন?');
  const [ytVideo2Url, setYtVideo2Url] = useState(settings.youtubeVideo2Url || '');
  const [tgUrl, setTgUrl] = useState(settings.telegramUrl || 'https://t.me/JMEAds_Official');

  // Form states for Payment Numbers (bKash & Nagad)
  const [localBkash, setLocalBkash] = useState(settings.publisherUpgradeBkash || '01722169178');
  const [localNagad, setLocalNagad] = useState(settings.publisherUpgradeNagad || '');
  const [localIsBkashActive, setLocalIsBkashActive] = useState(settings.isBkashActive !== false);
  const [localIsNagadActive, setLocalIsNagadActive] = useState(settings.isNagadActive === true);
  const [localUpgradeFee, setLocalUpgradeFee] = useState(settings.publisherUpgradeFee || 30);

  // Form states for Micro Jobs
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<MicroJobItem | null>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState<'youtube' | 'website' | 'subscribe' | 'special'>('youtube');
  const [jobCategoryLabel, setJobCategoryLabel] = useState('ইউটিউব ভিডিও');
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobSeconds, setJobSeconds] = useState(180);
  const [jobReward, setJobReward] = useState(15);
  const [jobPriority, setJobPriority] = useState(100);
  const [jobRequirements, setJobRequirements] = useState(
    'ভিডিওর শুরুর স্ক্রিনশট এবং শেষ পর্যন্ত দেখার একটি স্ক্রিনশট আপলোড করতে হবে'
  );

  // Form states for Tasks / Smartlinks
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskBanglaTitle, setTaskBanglaTitle] = useState('');
  const [taskSmartLink, setTaskSmartLink] = useState('');
  const [taskReward, setTaskReward] = useState(5);
  const [taskDailyLimit, setTaskDailyLimit] = useState(5);
  const [taskCooldown, setTaskCooldown] = useState(15);
  const [taskCategory, setTaskCategory] = useState<'smartlink' | 'video' | 'special'>('smartlink');
  const [taskBadge, setTaskBadge] = useState('');

  // Rejection modal states
  const [rejectingSubId, setRejectingSubId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('ভিডিওর শুরুর বা শেষের স্ক্রিনশট সঠিক নয়');

  // Screenshot viewer modal
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // User balance adjustment and filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSortOrder, setUserSortOrder] = useState<
    'highest_balance' | 'highest_earned' | 'highest_withdrawn' | 'most_referrals' | 'newest'
  >('highest_balance');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'under_review' | 'suspended' | 'banned'>('all');
  const [adjustingUser, setAdjustingUser] = useState<any | null>(null);
  const [balanceDelta, setBalanceDelta] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('অ্যাডমিন বোনাস');

  // Tutorial Video Modal State
  const [showAddTutorialModal, setShowAddTutorialModal] = useState(false);
  const [newTutorialTitle, setNewTutorialTitle] = useState('');
  const [newTutorialUrl, setNewTutorialUrl] = useState('');
  const [newTutorialReward, setNewTutorialReward] = useState(10);
  const [newTutorialActive, setNewTutorialActive] = useState(true);

  // Broadcast Notification state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState<'info' | 'success' | 'warning'>('info');

  if (!isOpen) return null;
  if (!isMasterAdminEmail) return null;

  // Handle PIN Submission
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '7788' || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('jme_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('ভুল এডমিন পিন! সঠিক পিন দিন (ডিফল্ট: 7788)');
    }
  };

  // Pre-fill form when editing a job
  const handleOpenEditJob = (job: MicroJobItem) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobCategory(job.category as any);
    setJobCategoryLabel(job.categoryLabel || 'ইউটিউব ভিডিও');
    setJobDescription(job.description);
    setJobUrl(job.url);
    setJobSeconds(job.requiredDurationSeconds);
    setJobReward(job.reward);
    setJobPriority(job.priority || 50);
    setJobRequirements(job.requirements?.join(', ') || '');
    setShowAddJobModal(true);
  };

  const handleSaveMicroJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) {
      showToast('কাজের শিরোনাম দিন', 'warning');
      return;
    }

    const reqArray = jobRequirements
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    if (editingJob) {
      await adminUpdateMicroJob(editingJob.id, {
        title: jobTitle.trim(),
        category: jobCategory,
        categoryLabel: jobCategoryLabel.trim(),
        description: jobDescription.trim(),
        url: jobUrl.trim(),
        requiredDurationSeconds: Number(jobSeconds),
        reward: Number(jobReward),
        priority: Number(jobPriority),
        requirements: reqArray.length > 0 ? reqArray : undefined
      });
    } else {
      await adminAddMicroJob({
        title: jobTitle.trim(),
        category: jobCategory,
        categoryLabel: jobCategoryLabel.trim(),
        description: jobDescription.trim(),
        url: jobUrl.trim(),
        requiredDurationSeconds: Number(jobSeconds),
        reward: Number(jobReward),
        priority: Number(jobPriority),
        requirements: reqArray.length > 0 ? reqArray : undefined,
        active: true,
        dailyLimit: 1
      });
    }

    setShowAddJobModal(false);
    setEditingJob(null);
  };

  // Pre-fill form when editing task
  const handleOpenEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskBanglaTitle(task.banglaTitle);
    setTaskSmartLink(task.smartLink);
    setTaskReward(task.reward);
    setTaskDailyLimit(task.dailyLimit);
    setTaskCooldown(task.cooldownSeconds);
    setTaskCategory(task.category);
    setTaskBadge(task.badge || '');
    setShowAddTaskModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskSmartLink.trim()) {
      showToast('স্মার্টলিংক URL দিন', 'warning');
      return;
    }

    if (editingTask) {
      await adminUpdateTask({
        ...editingTask,
        title: taskTitle.trim() || 'Smartlink',
        banglaTitle: taskBanglaTitle.trim() || taskTitle.trim(),
        smartLink: taskSmartLink.trim(),
        reward: Number(taskReward),
        dailyLimit: Number(taskDailyLimit),
        cooldownSeconds: Number(taskCooldown),
        category: taskCategory,
        badge: taskBadge.trim() || undefined
      });
    } else {
      await adminAddTask({
        nameId: 'Smartlink_' + (tasks.length + 1),
        networkId: 'cpm_' + Math.floor(Math.random() * 8999999 + 1000000),
        title: taskTitle.trim() || 'New Smartlink',
        banglaTitle: taskBanglaTitle.trim() || taskTitle.trim() || 'নতুন বিজ্ঞাপন',
        smartLink: taskSmartLink.trim(),
        reward: Number(taskReward),
        dailyLimit: Number(taskDailyLimit),
        cooldownSeconds: Number(taskCooldown),
        active: true,
        category: taskCategory,
        badge: taskBadge.trim() || undefined
      });
    }

    setShowAddTaskModal(false);
    setEditingTask(null);
  };

  // Handle rejecting job submission
  const handleConfirmRejectSubmission = async () => {
    if (!rejectingSubId) return;
    await adminRejectJobSubmission(rejectingSubId, rejectReason);
    setRejectingSubId(null);
  };

  // Handle Broadcast Notification
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('শিরোনাম ও মেসেজ উভয়ই প্রয়োজন', 'warning');
      return;
    }
    await adminBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim(), broadcastType);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  // Filtered submissions
  const pendingSubmissions = jobSubmissions.filter(s => s.status === 'pending');
  const pendingWithdrawals = allWithdrawalsList.filter(w => w.status === 'pending');
  const pendingPublishers = allUsersList.filter(u => u.verificationRequested && !u.isVerifiedPublisher);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen flex flex-col text-slate-100 overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <header className="p-3.5 px-4 sm:px-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back Button to return directly to User App */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white active:scale-95 transition-all text-xs font-bold border border-slate-700 cursor-pointer shadow-xs"
            title="ইউজার অ্যাপে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">অ্যাপে ফিরে যান</span>
            <span className="sm:hidden">ব্যাক</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xs sm:text-base text-white font-english">
                  JME Ads Master Admin Panel
                </h2>
                <span className="text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">
                বিকাশ/নগদ পেমেন্ট, বিজ্ঞাপন, অফার, ভিডিও ও ইউজার কন্ট্রোল
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold font-english">
              {allUsersList.length} <span className="hidden sm:inline">Users</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form onSubmit={handlePinSubmit} className="max-w-xs w-full bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">অ্যাডমিন প্রবেশ পিন</h3>
                <p className="text-xs text-slate-400 mt-1">প্যানেলটি নিরাপদ রাখতে আপনার পিন কোড দিন</p>
              </div>

              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="পিন দিন (ডিফল্ট: 7788)"
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-english tracking-widest text-lg focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                {pinError && <p className="text-xs text-rose-400 mt-1.5">{pinError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
              >
                প্রবেশ করুন
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Nav Bar (Tabs) */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/60 p-2 md:p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
              
              <button
                onClick={() => setAdminTab('overview')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>ড্যাশবোর্ড ও সুইচ</span>
              </button>

              <button
                onClick={() => setAdminTab('microjobs')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'microjobs'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>মাইক্রো জব অফার</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded-md">
                  {microJobs.length}
                </span>
              </button>

              <button
                onClick={() => setAdminTab('smartlinks')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'smartlinks'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 shrink-0" />
                  <span>সিপিএম ও বিজ্ঞাপন</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded-md">
                  {tasks.length}
                </span>
              </button>

              <button
                onClick={() => setAdminTab('submissions')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'submissions'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>অর্ডার রিভিউ (প্রমাণ)</span>
                </div>
                {pendingSubmissions.length > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {pendingSubmissions.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('publishers')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'publishers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>পাবলিশার ভেরিফাই</span>
                </div>
                {pendingPublishers.length > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                    {pendingPublishers.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('withdrawals')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'withdrawals'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 shrink-0" />
                  <span>উত্তোলন রিকোয়েস্ট</span>
                </div>
                {pendingWithdrawals.length > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                    {pendingWithdrawals.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('videos')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'videos'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>ইউটিউব টিউটোরিয়াল</span>
              </button>

              <button
                onClick={() => setAdminTab('adsense')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'adsense'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0" />
                <span>গুগল এডসেন্স কোড</span>
              </button>

              <button
                onClick={() => setAdminTab('users')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'users'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>ইউজার ব্যালেন্স কন্ট্রোল</span>
              </button>

              <button
                onClick={() => setAdminTab('broadcast')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'broadcast'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>ব্রডকাস্ট নোটিশ</span>
              </button>

              <button
                onClick={() => setAdminTab('messages')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                  adminTab === 'messages'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>কন্টাক্ট মেসেজ</span>
                </div>
                {contactMessages.filter(m => !m.read).length > 0 && (
                  <span className="text-[10px] bg-red-500 text-white font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {contactMessages.filter(m => !m.read).length}
                  </span>
                )}
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* TAB 1: OVERVIEW & SECTION TOGGLES */}
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">মোট ইউজার</span>
                      <span className="text-xl font-black text-white font-english">{allUsersList.length || 1}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold">পেন্ডিং অর্ডার (প্রমাণ)</span>
                      <span className="text-xl font-black text-amber-400 font-english">{pendingSubmissions.length}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">পেন্ডিং উত্তোলন</span>
                      <span className="text-xl font-black text-emerald-400 font-english">{pendingWithdrawals.length}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-sky-400 uppercase tracking-wider block font-bold">পাবলিশার আবেদন</span>
                      <span className="text-xl font-black text-sky-400 font-english">{pendingPublishers.length}</span>
                    </div>
                  </div>

                  {/* Section Visibility Controls (হাইড / রিলিজ কন্ট্রোল) */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>সেকশন হাইড ও রিলিজ কন্ট্রোল (অন/অফ সুইচ)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        যেকোনো সেকশন বা অফার কাজ না করলে এখান থেকে সরাসরি ইউজারদের জন্য হাইড অথবা দৃশ্যমান করতে পারবেন।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* 1. Permanent Publisher Alert Toggle */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">পার্মানেন্ট পাবলিশার অ্যালার্ট ব্যানার</span>
                          <span className="text-[10px] text-slate-400">হোম ও টাস্ক পেজের উপরের ২X প্রফিট অ্যালার্ট</span>
                        </div>
                        <button
                          onClick={() => adminUpdateSettings({ showPublisherUpgradeBanner: !settings.showPublisherUpgradeBanner })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            settings.showPublisherUpgradeBanner !== false
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {settings.showPublisherUpgradeBanner !== false ? 'দৃশ্যমান (ON)' : 'হাইড (OFF)'}
                        </button>
                      </div>

                      {/* 2. Micro Jobs Section Toggle */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">মাইক্রো জব ও অফার লিস্ট সেকশন</span>
                          <span className="text-[10px] text-slate-400">হোমপেজে মাইক্রো জবের কার্ড ও অফার পেজ</span>
                        </div>
                        <button
                          onClick={() => adminUpdateSettings({ showMicroJobsSection: !settings.showMicroJobsSection })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            settings.showMicroJobsSection !== false
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {settings.showMicroJobsSection !== false ? 'দৃশ্যমান (ON)' : 'হাইড (OFF)'}
                        </button>
                      </div>

                      {/* 3. Spin Wheel Toggle */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">লাকি স্পিন হুইল</span>
                          <span className="text-[10px] text-slate-400">দৈনিক স্পিন বোনাস সক্রিয় বা বন্ধ</span>
                        </div>
                        <button
                          onClick={() => adminUpdateSettings({ spinEnabled: !settings.spinEnabled })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            settings.spinEnabled
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {settings.spinEnabled ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                        </button>
                      </div>

                      {/* 4. Live Payout Ticker Toggle */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">লাইভ উইথড্র পেআউট পপআপ</span>
                          <span className="text-[10px] text-slate-400">স্ক্রিনে রিয়েল-টাইম সফল পেমেন্টের টিক্কার</span>
                        </div>
                        <button
                          onClick={() => adminUpdateSettings({ showLivePayoutTicker: !settings.showLivePayoutTicker })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            settings.showLivePayoutTicker !== false
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {settings.showLivePayoutTicker !== false ? 'সক্রিয় (ON)' : 'হাইড (OFF)'}
                        </button>
                      </div>

                      {/* 5. Google AdSense Toggle */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">গুগল এডসেন্স অটো-অ্যাডস</span>
                          <span className="text-[10px] text-slate-400">হেডারে এডসেন্স কোড ইনজেক্ট করা</span>
                        </div>
                        <button
                          onClick={() => adminUpdateSettings({ enableAdSense: !settings.enableAdSense })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            settings.enableAdSense
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {settings.enableAdSense ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                        </button>
                      </div>

                      {/* 6. Video Ads Zone Toggle */}
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white block">ভিডিও অ্যাডস জোন</span>
                          <span className="text-[10px] text-slate-400">ভিডিও বিজ্ঞাপন দেখা</span>
                        </div>
                        <button
                          onClick={() => adminUpdateSettings({ videoAdsEnabled: !settings.videoAdsEnabled })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            settings.videoAdsEnabled
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {settings.videoAdsEnabled ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick General Settings */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span>সাধারণ রিওয়ার্ড ও উত্তোলন সেটিংস</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">রেফারেল বোনাস (৳)</label>
                        <input
                          type="number"
                          value={settings.referralReward}
                          onChange={e => adminUpdateSettings({ referralReward: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">প্রতি বিজ্ঞাপনে আয় (৳)</label>
                        <input
                          type="number"
                          value={settings.adReward}
                          onChange={e => adminUpdateSettings({ adReward: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">ন্যূনতম উত্তোলন (৳)</label>
                        <input
                          type="number"
                          value={settings.minWithdrawal}
                          onChange={e => adminUpdateSettings({ minWithdrawal: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-sm"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: MICRO JOBS & OFFERS CONTROL */}
              {adminTab === 'microjobs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">মাইক্রো জব ও অফার লিস্ট কন্ট্রোল</h3>
                      <p className="text-xs text-slate-400">নতুন ভিডিও বা ওয়েবসাইট অফার যোগ, এডিট ও অগ্রাধিকার সেট করুন</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingJob(null);
                        setJobTitle('');
                        setJobCategory('youtube');
                        setJobCategoryLabel('ইউটিউব ভিডিও');
                        setJobDescription('');
                        setJobUrl('');
                        setJobSeconds(180);
                        setJobReward(15);
                        setJobPriority(100);
                        setJobRequirements('ভিডিওর শুরুর স্ক্রিনশট এবং শেষ পর্যন্ত দেখার একটি স্ক্রিনশট আপলোড করতে হবে');
                        setShowAddJobModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন জব লঞ্চ করুন</span>
                    </button>
                  </div>

                  {/* Micro Jobs List */}
                  <div className="space-y-2.5">
                    {microJobs.map((job) => (
                      <div
                        key={job.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          job.active !== false
                            ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-950/50 border-slate-800/50 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {job.categoryLabel || job.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-english">
                                সময়: {job.requiredDurationSeconds}s
                              </span>
                              <span className="text-[10px] font-bold text-amber-400 font-english">
                                প্রায়োরিটি: {job.priority || 0}
                              </span>
                              {job.active === false && (
                                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded-full">
                                  হাইড করা
                                </span>
                              )}
                            </div>

                            <h4 className="font-extrabold text-sm text-white truncate">{job.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1">{job.description}</p>
                            {job.url && (
                              <p className="text-[10px] text-slate-500 font-english truncate flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> {job.url}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <div className="text-right pr-2">
                              <span className="text-[10px] text-slate-400 block font-bold">রিওয়ার্ড</span>
                              <span className="text-base font-black text-emerald-400 font-english">
                                ৳{job.reward.toFixed(2)}
                              </span>
                            </div>

                            {/* Move to Top */}
                            <button
                              onClick={() => adminUpdateMicroJob(job.id, { priority: (job.priority || 50) + 100 })}
                              title="উপরে রাখুন (Top Priority)"
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4 text-amber-400" />
                            </button>

                            {/* Active Toggle */}
                            <button
                              onClick={() => adminUpdateMicroJob(job.id, { active: job.active === false ? true : false })}
                              title={job.active !== false ? 'হাইড করুন' : 'দৃশ্যমান করুন'}
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                            >
                              {job.active !== false ? (
                                <Eye className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-rose-400" />
                              )}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEditJob(job)}
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 text-sky-400" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`"${job.title}" জবটি ডিলিট করতে চান?`)) {
                                  adminDeleteMicroJob(job.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SMARTLINKS & CPM ADS */}
              {adminTab === 'smartlinks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">সিপিএম বিজ্ঞাপন ও স্মার্টলিংক কন্ট্রোল</h3>
                      <p className="text-xs text-slate-400">টপ সিপিএম লিংক ও স্মার্টলিংক বিজ্ঞাপন সমূহ পরিচালনা করুন</p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setTaskTitle('');
                        setTaskBanglaTitle('');
                        setTaskSmartLink('');
                        setTaskReward(5);
                        setTaskDailyLimit(5);
                        setTaskCooldown(15);
                        setTaskCategory('smartlink');
                        setTaskBadge('নতুন');
                        setShowAddTaskModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন স্মার্টলিংক যোগ করুন</span>
                    </button>
                  </div>

                  {/* Primary CPM Link Highlight */}
                  <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                        <h4 className="font-extrabold text-sm text-amber-200">প্রাইমারি হাই-সিপিএম স্মার্টলিংক (১ম স্থান)</h4>
                      </div>
                      <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                        ACTIVE CPM
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400">স্মার্টলিংক URL:</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={settings.cpmSmartlinkUrl || 'https://www.profitableratecpmnetwork.com/dtexun9wfc?key=96fef72f5b581d12399d905cebe39a75'}
                          onChange={e => adminUpdateSettings({ cpmSmartlinkUrl: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-english text-xs"
                        />
                        <button
                          onClick={() => {
                            adminUpdateSettings({
                              cpmSmartlinkUrl: settings.cpmSmartlinkUrl || 'https://www.profitableratecpmnetwork.com/dtexun9wfc?key=96fef72f5b581d12399d905cebe39a75'
                            });
                          }}
                          className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer hover:bg-amber-400"
                        >
                          সংরক্ষণ
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5">
                    {tasks.map((task, idx) => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          task.active
                            ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                            : 'bg-slate-950/50 border-slate-800/50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 font-english">
                                #{idx + 1}
                              </span>
                              <h4 className="font-extrabold text-sm text-white truncate">
                                {task.banglaTitle || task.title}
                              </h4>
                              {task.badge && (
                                <span className="text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-md">
                                  {task.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 font-english truncate">{task.smartLink}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span>রিওয়ার্ড: <strong className="text-emerald-400 font-english">৳{task.reward}</strong></span>
                              <span>•</span>
                              <span>দৈনিক লিমিট: <strong className="text-white font-english">{task.dailyLimit}</strong></span>
                              <span>•</span>
                              <span>কাউন্টডাউন: <strong className="text-white font-english">{task.cooldownSeconds}s</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Toggle Active */}
                            <button
                              onClick={() => adminUpdateTask({ ...task, active: !task.active })}
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            >
                              {task.active ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEditTask(task)}
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4 text-sky-400" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`"${task.banglaTitle}" ডিলিট করতে চান?`)) {
                                  adminDeleteTask(task.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: JOB SUBMISSIONS & ROBOT VERIFICATION REVIEW */}
              {adminTab === 'submissions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">রিমোট জব ও ভিডিও প্রুফ অর্ডার রিভিউ</h3>
                      <p className="text-xs text-slate-400">রোবট ট্র্যাকিং ডেটা এবং ইউজারদের জমাকৃত স্ক্রিনশট যাচাই করে অ্যাপ্রুভ বা রিজেক্ট করুন</p>
                    </div>
                  </div>

                  {jobSubmissions.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800">
                      <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">বর্তমানে কোনো জবের প্রমাণ সাবমিশন নেই</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {jobSubmissions.map((sub) => {
                        const isCompliant = sub.spentSeconds >= sub.requiredSeconds;
                        return (
                          <div
                            key={sub.id}
                            className={`p-4 rounded-3xl border transition-all ${
                              sub.status === 'pending'
                                ? 'bg-slate-950 border-amber-500/40 shadow-sm'
                                : sub.status === 'approved'
                                ? 'bg-slate-950/60 border-emerald-500/30'
                                : 'bg-slate-950/40 border-rose-500/20 opacity-70'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-sm text-white">{sub.jobTitle}</span>
                                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                    sub.status === 'pending'
                                      ? 'bg-amber-400 text-slate-950'
                                      : sub.status === 'approved'
                                      ? 'bg-emerald-500 text-slate-950'
                                      : 'bg-rose-500 text-white'
                                  }`}>
                                    {sub.status === 'pending' ? 'পেন্ডিং রিভিউ' : sub.status === 'approved' ? 'অনুমোদিত' : 'বাতিল'}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  ইউজার: <strong className="text-slate-200">{sub.userName}</strong> ({sub.userPhone})
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] text-slate-400 block font-bold">রিওয়ার্ড</span>
                                <span className="text-base font-black text-emerald-400 font-english">
                                  ৳{sub.reward.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* AI Analytics & Verification Report */}
                            {sub.aiAnalytics ? (
                              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs space-y-2 mb-3">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <div className="flex items-center gap-1.5">
                                    <Bot className="w-4 h-4 text-emerald-400" />
                                    <span className="font-extrabold text-white text-xs">এআই অ্যানালিটিক্স যাচাইকরণ রিপোর্ট</span>
                                  </div>
                                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full font-english ${
                                    sub.aiAnalytics.status === 'passed'
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : sub.aiAnalytics.status === 'review_recommended'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                  }`}>
                                    এআই স্কোর: {sub.aiAnalytics.confidenceScore}%
                                  </span>
                                </div>

                                <p className="text-[11px] text-slate-300 font-medium">
                                  {sub.aiAnalytics.summary}
                                </p>

                                {/* Tags */}
                                {sub.aiAnalytics.tags && sub.aiAnalytics.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 pt-0.5">
                                    {sub.aiAnalytics.tags.map((tag, tIdx) => (
                                      <span key={tIdx} className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded-md border border-slate-700 font-semibold">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Detailed checks */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px] text-slate-300 border-t border-slate-800/80">
                                  <div>প্রয়োজনীয় সময়: <strong className="text-white font-english">{sub.requiredSeconds}s</strong></div>
                                  <div>ইউজার কাটিয়েছেন: <strong className={`font-english ${isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>{sub.spentSeconds}s</strong></div>
                                </div>

                                <div className="space-y-1 text-[10px] text-slate-400 pt-1">
                                  {sub.aiAnalytics.details?.map((detail, dIdx) => (
                                    <div key={dIdx} className="flex items-start gap-1">
                                      <span className="text-emerald-400">▪</span>
                                      <span>{detail}</span>
                                    </div>
                                  ))}
                                </div>

                                {sub.proofText && (
                                  <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-1.5 mt-1">
                                    ইউজারের সাবমিট নোট: <span className="text-slate-200">{sub.proofText}</span>
                                  </p>
                                )}
                              </div>
                            ) : (
                              /* Fallback Robot Tracking Data Analysis if older submission without AI report */
                              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 mb-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-400 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                                    <span>রোবট ট্র্যাকিং সময় বিশ্লেষণ:</span>
                                  </span>
                                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                                    isCompliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                                  }`}>
                                    {isCompliant ? '✓ সময়সীমা মানা হয়েছে' : '⚠ কম সময় কাটানো হয়েছে'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                                  <div>প্রয়োজনীয় সময়: <strong className="text-white font-english">{sub.requiredSeconds}s</strong></div>
                                  <div>ইউজার কাটিয়েছেন: <strong className={`font-english ${isCompliant ? 'text-emerald-400' : 'text-rose-400'}`}>{sub.spentSeconds}s</strong></div>
                                </div>

                                {sub.proofText && (
                                  <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-1.5 mt-1.5">
                                    ইউজারের নোট: <span className="text-slate-200">{sub.proofText}</span>
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Screenshots View (Dual proof) */}
                            <div className="space-y-1.5 mb-4">
                              <span className="text-[11px] font-bold text-slate-400 block">জমা দেওয়া স্ক্রিনশটসমূহ:</span>
                              <div className="grid grid-cols-2 gap-3">
                                {sub.startScreenshotUrl ? (
                                  <div
                                    onClick={() => setViewingImage(sub.startScreenshotUrl!)}
                                    className="p-1 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-emerald-500 transition-colors group relative"
                                  >
                                    <span className="absolute top-2 left-2 bg-slate-950/80 text-[9px] font-bold text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                      শুরুর স্ক্রিনশট
                                    </span>
                                    <img
                                      src={sub.startScreenshotUrl}
                                      alt="Start Proof"
                                      className="w-full h-24 sm:h-32 object-cover rounded-xl"
                                    />
                                    <span className="text-[10px] text-slate-400 text-center block mt-1 group-hover:text-white">
                                      ক্লিক করে বড় দেখুন
                                    </span>
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-2xl bg-slate-900 text-center text-xs text-slate-500 flex items-center justify-center">
                                    কোনো শুরুর স্ক্রিনশট নেই
                                  </div>
                                )}

                                {sub.endScreenshotUrl ? (
                                  <div
                                    onClick={() => setViewingImage(sub.endScreenshotUrl!)}
                                    className="p-1 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-emerald-500 transition-colors group relative"
                                  >
                                    <span className="absolute top-2 left-2 bg-slate-950/80 text-[9px] font-bold text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/40">
                                      শেষের স্ক্রিনশট
                                    </span>
                                    <img
                                      src={sub.endScreenshotUrl}
                                      alt="End Proof"
                                      className="w-full h-24 sm:h-32 object-cover rounded-xl"
                                    />
                                    <span className="text-[10px] text-slate-400 text-center block mt-1 group-hover:text-white">
                                      ক্লিক করে বড় দেখুন
                                    </span>
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-2xl bg-slate-900 text-center text-xs text-slate-500 flex items-center justify-center">
                                    কোনো শেষের স্ক্রিনশট নেই
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            {sub.status === 'pending' && (
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  onClick={() => adminApproveJobSubmission(sub.id)}
                                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>অ্যাপ্রুভ ও টাকা প্রদান করুন</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setRejectingSubId(sub.id);
                                    setRejectReason('ভিডিওর পুরো সময় দেখা হয়নি অথবা স্ক্রিনশট সঠিক নয়');
                                  }}
                                  className="flex-1 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <XCircle className="w-4 h-4" />
                                  <span>রিজেক্ট / বাতিল করুন</span>
                                </button>
                              </div>
                            )}

                            {sub.status === 'rejected' && sub.adminNote && (
                              <p className="text-xs text-rose-400 mt-2">বাতিলের কারণ: {sub.adminNote}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PUBLISHER UPGRADES */}
              {adminTab === 'publishers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">পার্মানেন্ট পাবলিশার ভেরিফিকেশন আবেদন</h3>
                      <p className="text-xs text-slate-400">যেসব ইউজার পেমেন্ট করে ভেরিফাইড ২X ডাবল প্রফিটের জন্য আবেদন করেছেন</p>
                    </div>
                  </div>

                  {/* Upgrade Payment Settings */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-emerald-400" />
                          <span>বিকাশ ও নগদ পেমেন্ট নম্বর নিয়ন্ত্রণ (Send Money Gateway)</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          ইউজাররা পার্মানেন্ট পাবলিশার ভেরিফিকেশনের জন্য কোন নম্বরে টাকা পাঠাবে তা নির্ধারণ করুন
                        </p>
                      </div>

                      <span className="text-[11px] bg-slate-800 text-emerald-400 font-bold px-2.5 py-1 rounded-xl">
                        ফি: ৳{localUpgradeFee}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* bKash Control Card */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-pink-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                              Bk
                            </div>
                            <span className="text-xs font-bold text-white">বিকাশ পার্সোনাল নম্বর</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setLocalIsBkashActive(!localIsBkashActive)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              localIsBkashActive 
                                ? 'bg-emerald-600 text-slate-950' 
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {localIsBkashActive ? 'সক্রিয় (Active)' : 'বন্ধ (OFF)'}
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="01722169178"
                            value={localBkash}
                            onChange={e => setLocalBkash(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-pink-400 font-mono text-sm font-bold focus:border-pink-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            বর্তমান নম্বর: <strong className="text-white font-mono">{localBkash}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Nagad Control Card */}
                      <div className="p-4 rounded-2xl bg-slate-900 border border-orange-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                              Ng
                            </div>
                            <span className="text-xs font-bold text-white">নগদ পার্সোনাল নম্বর</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setLocalIsNagadActive(!localIsNagadActive)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              localIsNagadActive 
                                ? 'bg-emerald-600 text-slate-950' 
                                : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {localIsNagadActive ? 'সক্রিয় (Active)' : 'পেন্ডিং / বন্ধ'}
                          </button>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="আপাতত বন্ধ / পেন্ডিং (বা নম্বর লিখুন)"
                            value={localNagad}
                            onChange={e => setLocalNagad(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-orange-400 font-mono text-sm font-bold focus:border-orange-500 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            স্ট্যাটাস: <strong className={localIsNagadActive ? 'text-emerald-400' : 'text-amber-400'}>
                              {localIsNagadActive ? 'সক্রিয়' : 'আপাতত বন্ধ / পেন্ডিং'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 block mb-1">
                          ভেরিফিকেশন ফি (টাকা)
                        </label>
                        <input
                          type="number"
                          value={localUpgradeFee}
                          onChange={e => setLocalUpgradeFee(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={async () => {
                            await adminUpdateSettings({
                              publisherUpgradeBkash: localBkash.trim(),
                              publisherUpgradeNagad: localNagad.trim(),
                              isBkashActive: localIsBkashActive,
                              isNagadActive: localIsNagadActive,
                              publisherUpgradeFee: Number(localUpgradeFee) || 30
                            });
                            showToast('বিকাশ ও নগদ পেমেন্ট সেটিংস সফলভাবে ক্লাউডে সেভ হয়েছে!', 'success');
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-98"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>পেমেন্ট সেটিংস সংরক্ষণ করুন (Save)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pending Users List */}
                  {pendingPublishers.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800">
                      <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">বর্তমানে কোনো নতুন পাবলিশার আবেদন পেন্ডিং নেই</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingPublishers.map((u) => (
                        <div key={u.uid} className="p-4 rounded-3xl bg-slate-950 border border-amber-500/40 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-extrabold text-sm text-white">{u.name}</h4>
                              <p className="text-xs text-slate-400">{u.phone} • {u.email}</p>
                            </div>

                            <span className="text-xs font-bold text-emerald-400 font-english">
                              ব্যালেন্স: ৳{u.balance.toFixed(2)}
                            </span>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-900 text-xs space-y-1">
                            <div>পেমেন্ট মেথড: <strong className="text-amber-400">{u.verificationMethod || 'bKash'}</strong></div>
                            <div>ট্রানজেকশন TrxID: <strong className="text-white font-english font-mono">{u.verificationTrxId}</strong></div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => adminApprovePublisherUpgrade(u.uid)}
                              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                            >
                              অ্যাপ্রুভ ও ভেরিফাইড ব্লু-টিক প্রদান করুন
                            </button>

                            <button
                              onClick={() => adminRejectPublisherUpgrade(u.uid, 'ভুল বা অসত্য TrxID')}
                              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                            >
                              বাতিল করুন
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: WITHDRAWALS */}
              {adminTab === 'withdrawals' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">উত্তোলন রিকোয়েস্ট তালিকা</h3>
                      <p className="text-xs text-slate-400">ইউজারদের পেমেন্ট অনুমোদন করুন বা রিজেক্ট করে অ্যাকাউন্টে টাকা রিফান্ড দিন</p>
                    </div>
                  </div>

                  {allWithdrawalsList.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800">
                      <Wallet className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">কোনো উত্তোলন আবেদন পাওয়া যায়নি</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {allWithdrawalsList.map((w) => (
                        <div key={w.id} className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-white">{w.userName}</h4>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  w.status === 'paid'
                                    ? 'bg-emerald-500 text-slate-950'
                                    : w.status === 'rejected'
                                    ? 'bg-rose-500 text-white'
                                    : 'bg-amber-400 text-slate-950'
                                }`}>
                                  {w.status === 'paid' ? 'পরিশোধিত' : w.status === 'rejected' ? 'বাতিল ও রিফান্ড' : 'পেন্ডিং'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {w.method} নম্বর: <strong className="text-white font-mono">{w.accountNumber}</strong>
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-base font-black text-emerald-400 font-english">
                                ৳{w.netAmount.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-english">
                                পরিমাণ: ৳{w.amount}
                              </span>
                            </div>
                          </div>

                          {w.status === 'pending' && (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => adminUpdateWithdrawalStatus(w.id, 'paid')}
                                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                              >
                                পেইড / পরিশোধ সম্পন্ন
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt('বাতিল ও রিফান্ডের কারণ দিন:', 'অসঠিক বিকাশ/নগদ নম্বর');
                                  if (reason) {
                                    adminUpdateWithdrawalStatus(w.id, 'rejected', reason);
                                  }
                                }}
                                className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
                              >
                                রিজেক্ট ও রিফান্ড
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: YOUTUBE TUTORIALS & TELEGRAM */}
              {adminTab === 'videos' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">ইউটিউব ভিডিও ও টেলিগ্রাম ম্যানেজমেন্ট</h3>
                      <p className="text-xs text-slate-400">টিউটোরিয়াল ভিডিও, ওয়াজ এবং অফিসিয়াল টেলিগ্রাম চ্যানেল যোগ ও সক্রিয়/নিষ্ক্রিয় করুন</p>
                    </div>

                    <button
                      onClick={() => {
                        setNewTutorialTitle('');
                        setNewTutorialUrl('');
                        setNewTutorialReward(10);
                        setNewTutorialActive(true);
                        setShowAddTutorialModal(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ নতুন ভিডিও যোগ করুন</span>
                    </button>
                  </div>

                  {/* Primary Video 1 & 2 Settings */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-4 h-4" />
                      <span>হোমপেজ প্রধান ভিডিও ১ ও ২</span>
                    </h4>

                    {/* Video 1 */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white">টিউটোরিয়াল ভিডিও ১ (কাজের নিয়মাবলী)</label>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          হোমপেজ কার্ড ১
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="ভিডিওর শিরোনাম (যেমন: কাজের নিয়মাবলী)"
                        value={ytVideo1Title}
                        onChange={e => setYtVideo1Title(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="ইউটিউব ভিডিও URL (যেমন: https://www.youtube.com/watch?v=...)"
                        value={ytVideo1Url}
                        onChange={e => setYtVideo1Url(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-english text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Video 2 */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white">টিউটোরিয়াল ভিডিও ২ (উত্তোলন নিয়ম)</label>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          হোমপেজ কার্ড ২
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="ভিডিওর শিরোনাম (যেমন: উত্তোলন করার নিয়ম)"
                        value={ytVideo2Title}
                        onChange={e => setYtVideo2Title(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="ইউটিউব ভিডিও URL (যেমন: https://www.youtube.com/watch?v=...)"
                        value={ytVideo2Url}
                        onChange={e => setYtVideo2Url(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-english text-xs focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Telegram Channel */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-white">অফিসিয়াল টেলিগ্রাম চ্যানেল লিংক</label>
                        <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md">
                          Telegram Official
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="https://t.me/..."
                        value={tgUrl}
                        onChange={e => setTgUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-english text-xs focus:border-emerald-500 focus:outline-none"
                      />
                      <p className="text-[10px] text-slate-400">এই লিংকটি হেডার এবং হোমপেজের টেলিগ্রাম জয়েন বাটনে সরাসরি কাজ করবে।</p>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={async () => {
                        await adminUpdateSettings({
                          youtubeVideo1Title: ytVideo1Title.trim(),
                          youtubeVideo1Url: ytVideo1Url.trim(),
                          youtubeVideo2Title: ytVideo2Title.trim(),
                          youtubeVideo2Url: ytVideo2Url.trim(),
                          telegramUrl: tgUrl.trim()
                        });
                        showToast('ভিডিও ও টেলিগ্রাম সেটিংস সফলভাবে সেভ ও কার্যকর হয়েছে!', 'success');
                      }}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer mt-2 active:scale-98"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>পরিবর্তন সংরক্ষণ করুন (Save All Settings)</span>
                    </button>
                  </div>

                  {/* Unlimited YouTube Videos & Waz List */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Play className="w-4 h-4 text-red-500 fill-red-500" />
                        <span>ইউটিউব ভিডিও ও ওয়াজ লিস্ট (সীমাহীন ভিডিও যুক্ত করার সুবিধা)</span>
                      </h4>
                      <span className="text-[11px] text-slate-400 font-english font-bold">
                        {(settings.youtubeTutorialsList || []).length}টি ভিডিও
                      </span>
                    </div>

                    {(settings.youtubeTutorialsList || []).length === 0 ? (
                      <div className="p-6 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                        <Video className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">বর্তমানে কোনো অতিরিক্ত ভিডিও যুক্ত করা হয়নি।</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          উপরে "+ নতুন ভিডিও যোগ করুন" বাটনে ক্লিক করে যত খুশি ইউটিউব ভিডিও বা ওয়াজ যুক্ত করতে পারবেন।
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {(settings.youtubeTutorialsList || []).map((v) => (
                          <div key={v.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-extrabold text-xs text-white truncate">{v.title}</h5>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                  v.active !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                                }`}>
                                  {v.active !== false ? 'সক্রিয় (Active)' : 'ইন-অ্যাক্টিভ (বন্ধ)'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono font-english truncate max-w-xs">{v.url}</p>
                              {v.reward && (
                                <span className="text-[10px] font-bold text-emerald-400 font-english mt-0.5 block">
                                  রিওয়ার্ড: ৳{v.reward.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Active/Inactive Toggle Button */}
                              <button
                                onClick={() => adminToggleYouTubeTutorialActive(v.id)}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  v.active !== false 
                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30' 
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {v.active !== false ? 'সক্রিয়' : 'ইন-অ্যাক্টিভ'}
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  if (confirm(`আপনি কি নিশ্চিত "${v.title}" ভিডিওটি ডিলিট করতে চান?`)) {
                                    adminDeleteYouTubeTutorial(v.id);
                                  }
                                }}
                                className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 8: GOOGLE ADSENSE CODE SETUP */}
              {adminTab === 'adsense' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white">গুগল এডসেন্স ও বিজ্ঞাপন নেটওয়ার্ক কোড</h3>
                    <p className="text-xs text-slate-400">এডসেন্স ভেরিফিকেশন স্ক্রিপ্ট, ব্যানার কোড ও নেটিভ অ্যাড কোড ইনপুট দিন</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-xs font-bold text-white block">গুগল এডসেন্স চালু / বন্ধ</span>
                        <span className="text-[10px] text-slate-400">অ্যাপ্রুভালের জন্য কোড সক্রিয় করুন</span>
                      </div>
                      <button
                        onClick={() => adminUpdateSettings({ enableAdSense: !settings.enableAdSense })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          settings.enableAdSense ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {settings.enableAdSense ? 'সক্রিয় (ON)' : 'বন্ধ (OFF)'}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">
                        গুগল এডসেন্স সাইট ভেরিফিকেশন / অটো-অ্যাডস কোড (HTML/Script)
                      </label>
                      <textarea
                        rows={4}
                        placeholder='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-..." crossorigin="anonymous"></script>'
                        value={settings.googleAdSenseCode || ''}
                        onChange={e => adminUpdateSettings({ googleAdSenseCode: e.target.value })}
                        className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">
                        ব্যানার অ্যাড HTML / আইফ্রেম কোড (Banner Ad HTML)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="ব্যানার বিজ্ঞাপনের HTML কোড লিখুন..."
                        value={settings.bannerAdHtml || ''}
                        onChange={e => adminUpdateSettings({ bannerAdHtml: e.target.value })}
                        className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">
                        গুগল এডসেন্স পাবলিশার আইডি (Publisher ID)
                      </label>
                      <input
                        type="text"
                        placeholder="pub-1234567890123456"
                        value={settings.adSensePublisherId || ''}
                        onChange={e => adminUpdateSettings({ adSensePublisherId: e.target.value.trim() })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">
                        Ads.txt কন্টেন্ট (Custom Ads.txt)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
                        value={settings.adsTxtContent || 'google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0'}
                        onChange={e => adminUpdateSettings({ adsTxtContent: e.target.value })}
                        className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* AdSense Approval Readiness Checklist */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>অ্যাডসেন্স অ্যাপ্রুভাল রেডিনেস স্ট্যাটাস</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                        <div className="flex items-center gap-1 text-emerald-400">✓ প্রাইভেসি পলিসি (CCPA & GDPR)</div>
                        <div className="flex items-center gap-1 text-emerald-400">✓ টার্মস অ্যান্ড কন্ডিশনস</div>
                        <div className="flex items-center gap-1 text-emerald-400">✓ ডিসক্লেইমার ও আর্নিং পলিসি</div>
                        <div className="flex items-center gap-1 text-emerald-400">✓ কুকিজ পলিসি পেজ</div>
                        <div className="flex items-center gap-1 text-emerald-400">✓ এডুকেশনাল পাবলিশার গাইড</div>
                        <div className="flex items-center gap-1 text-emerald-400">✓ কন্টাক্ট আস মেসেজিং পোর্টাল</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: USER BALANCE & ACCOUNT CONTROL */}
              {adminTab === 'users' && (() => {
                const totalUsers = allUsersList.length;
                const activeCount = allUsersList.filter(u => u.accountStatus === 'active' || !u.accountStatus).length;
                const reviewCount = allUsersList.filter(u => u.accountStatus === 'under_review').length;
                const suspendedCount = allUsersList.filter(u => u.accountStatus === 'suspended').length;
                const bannedCount = allUsersList.filter(u => u.accountStatus === 'banned').length;

                const filteredUsers = allUsersList
                  .filter(u => {
                    // Status filter
                    if (userStatusFilter === 'active' && u.accountStatus !== 'active' && u.accountStatus) return false;
                    if (userStatusFilter === 'under_review' && u.accountStatus !== 'under_review') return false;
                    if (userStatusFilter === 'suspended' && u.accountStatus !== 'suspended') return false;
                    if (userStatusFilter === 'banned' && u.accountStatus !== 'banned') return false;

                    // Search filter
                    if (userSearchTerm.trim() === '') return true;
                    const term = userSearchTerm.toLowerCase();
                    return (
                      u.name?.toLowerCase().includes(term) ||
                      u.phone?.includes(term) ||
                      u.email?.toLowerCase().includes(term) ||
                      u.referralCode?.toLowerCase().includes(term)
                    );
                  })
                  .sort((a, b) => {
                    if (userSortOrder === 'highest_balance') return (b.balance || 0) - (a.balance || 0);
                    if (userSortOrder === 'highest_earned') return (b.totalEarned || 0) - (a.totalEarned || 0);
                    if (userSortOrder === 'highest_withdrawn') return (b.totalWithdrawn || 0) - (a.totalWithdrawn || 0);
                    if (userSortOrder === 'most_referrals') return (b.referralCount || 0) - (a.referralCount || 0);
                    if (userSortOrder === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
                    return 0;
                  });

                return (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-white">ইউজার ব্যালেন্স ও অ্যাকাউন্ট কন্ট্রোল</h3>
                        <p className="text-xs text-slate-400">ফিল্টার দিয়ে সর্বোচ্চ আয়ের ইউজার দেখুন, ১-ক্লিকে ব্যালেন্স বাড়ানো/কমানো এবং ব্যান করুন</p>
                      </div>

                      {/* Sort Dropdown: সব থেকে বেশি ইনকাম যেন উপর থেকে দেখায় */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">সাজান:</span>
                        <select
                          value={userSortOrder}
                          onChange={e => setUserSortOrder(e.target.value as any)}
                          className="px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
                        >
                          <option value="highest_balance">👑 সর্বোচ্চ ব্যালেন্স (উপর থেকে)</option>
                          <option value="highest_earned">💰 সর্বোচ্চ মোট আয় (Total Earned)</option>
                          <option value="highest_withdrawn">💳 সর্বোচ্চ উত্তোলন (Withdrawn)</option>
                          <option value="most_referrals">👥 সর্বোচ্চ রেফারেল সংখ্যা</option>
                          <option value="newest">⏱️ নতুন নিবন্ধিত ইউজার</option>
                        </select>
                      </div>
                    </div>

                    {/* Search & Status Filter Tabs */}
                    <div className="space-y-2.5">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="নাম, ফোন নম্বর, ইমেইল বা রেফারেল কোড দিয়ে খুঁজুন..."
                          value={userSearchTerm}
                          onChange={e => setUserSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                        <button
                          type="button"
                          onClick={() => setUserStatusFilter('all')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                            userStatusFilter === 'all'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          সকল ইউজার ({totalUsers})
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserStatusFilter('active')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                            userStatusFilter === 'active'
                              ? 'bg-emerald-500 text-slate-950 shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          সক্রিয় ({activeCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserStatusFilter('under_review')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                            userStatusFilter === 'under_review'
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          ওয়ার্নিং/তদন্তাধীন ({reviewCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserStatusFilter('suspended')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                            userStatusFilter === 'suspended'
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          স্থগিত ({suspendedCount})
                        </button>

                        <button
                          type="button"
                          onClick={() => setUserStatusFilter('banned')}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                            userStatusFilter === 'banned'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          ব্যানড ({bannedCount})
                        </button>
                      </div>
                    </div>

                    {/* Users List */}
                    <div className="space-y-3">
                      {filteredUsers.length === 0 ? (
                        <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800">
                          <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                          <p className="text-xs text-slate-400">কোনো ইউজার পাওয়া যায়নি</p>
                        </div>
                      ) : (
                        filteredUsers.slice(0, 50).map((u, idx) => (
                          <div
                            key={u.uid}
                            className={`p-4 rounded-3xl bg-slate-950 border transition-all space-y-3 ${
                              u.accountStatus === 'banned'
                                ? 'border-rose-900/60 bg-rose-950/10'
                                : u.accountStatus === 'suspended'
                                ? 'border-orange-900/60 bg-orange-950/10'
                                : u.accountStatus === 'under_review'
                                ? 'border-amber-900/60 bg-amber-950/10'
                                : 'border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0">
                                    #{idx + 1}
                                  </span>
                                  <h4 className="font-extrabold text-sm text-white truncate">{u.name}</h4>
                                  
                                  {/* Status badge */}
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                    u.accountStatus === 'banned'
                                      ? 'bg-rose-500 text-white'
                                      : u.accountStatus === 'suspended'
                                      ? 'bg-orange-500 text-white'
                                      : u.accountStatus === 'under_review'
                                      ? 'bg-amber-400 text-slate-950'
                                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  }`}>
                                    {u.accountStatus === 'banned'
                                      ? 'ব্যানড (Banned)'
                                      : u.accountStatus === 'suspended'
                                      ? 'স্থগিত (Suspended)'
                                      : u.accountStatus === 'under_review'
                                      ? 'ওয়ার্নিং/তদন্তাধীন'
                                      : 'সক্রিয় (Active)'}
                                  </span>

                                  {u.isVerifiedPublisher && (
                                    <span className="text-[9px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                      ভেরিফাইড
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] text-slate-400 mt-1">
                                  ফোন: <strong className="text-white font-mono">{u.phone}</strong> • ইমেইল: {u.email}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  রেফার কোড: <strong className="text-emerald-400 font-mono">{u.referralCode}</strong> • মোট রেফার: {u.referralCount || 0} জন • মোট উত্তোলন: ৳{(u.totalWithdrawn || 0).toFixed(2)}
                                </p>
                                {u.warningNote && (
                                  <p className="text-[11px] text-amber-400 bg-amber-500/10 p-1.5 rounded-lg border border-amber-500/20 mt-1">
                                    ⚠️ ওয়ার্নিং নোট: {u.warningNote}
                                  </p>
                                )}
                                {u.bannedReason && (
                                  <p className="text-[11px] text-rose-400 bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20 mt-1">
                                    🚫 ব্যান কারণ: {u.bannedReason}
                                  </p>
                                )}
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-lg font-black text-emerald-400 font-english block">
                                  ৳{u.balance.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-english">
                                  মোট আয়: ৳{(u.totalEarned || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* 1-Click Fast Balance Control Strip */}
                            <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-400 font-bold">ব্যালেন্স কুইক অ্যাড/মাইনাস:</span>
                                <button
                                  type="button"
                                  onClick={() => adminUpdateUserBalance(u.uid, 50, 'অ্যাডমিন বোনাস (+৫০)')}
                                  className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] cursor-pointer"
                                  title="১-ক্লিকে ৫০ টাকা বাড়ান"
                                >
                                  +৳৫০
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adminUpdateUserBalance(u.uid, 100, 'অ্যাডমিন বোনাস (+১০০)')}
                                  className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] cursor-pointer"
                                  title="১-ক্লিকে ১০০ টাকা বাড়ান"
                                >
                                  +৳১০০
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adminUpdateUserBalance(u.uid, -50, 'অ্যাডমিন কর্তন (-৫০)')}
                                  className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-[11px] cursor-pointer"
                                  title="১-ক্লিকে ৫০ টাকা কমান"
                                >
                                  -৳৫০
                                </button>
                                <button
                                  type="button"
                                  onClick={() => adminUpdateUserBalance(u.uid, -100, 'অ্যাডমিন কর্তন (-১০০)')}
                                  className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-[11px] cursor-pointer"
                                  title="১-ক্লিকে ১০০ টাকা কমান"
                                >
                                  -৳১০০
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdjustingUser(u);
                                    setBalanceDelta(50);
                                    setAdjustmentReason('অ্যাডমিন পুরষ্কার');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px] cursor-pointer"
                                >
                                  কাস্টম +/-
                                </button>
                              </div>

                              {/* 1-Click Account Status Controls */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {u.accountStatus !== 'active' && (
                                  <button
                                    type="button"
                                    onClick={() => adminSetUserStatus(u.uid, 'active')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] cursor-pointer"
                                  >
                                    সক্রিয় করুন
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const note = prompt('ইউজারকে ওয়ার্নিং মেসেজ দিন (যেমন: ফেক রেফারেল সন্দেহ):', 'অনুগ্রহ করে নিয়মানুযায়ী কাজ করুন');
                                    if (note) {
                                      adminSetUserStatus(u.uid, 'under_review', note);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold text-[11px] cursor-pointer"
                                >
                                  ওয়ার্নিং দিন
                                </button>

                                {u.accountStatus !== 'suspended' && (
                                  <button
                                    type="button"
                                    onClick={() => adminSetUserStatus(u.uid, 'suspended')}
                                    className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-bold text-[11px] cursor-pointer"
                                  >
                                    স্থগিত
                                  </button>
                                )}

                                {u.accountStatus !== 'banned' ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const reason = prompt('অ্যাকাউন্ট ব্যান করার কারণ লিখুন:', 'অটোমেশন বট ও স্প্যামিংয়ের কারণে ব্যান করা হলো');
                                      if (reason) {
                                        adminSetUserStatus(u.uid, 'banned', reason);
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] cursor-pointer"
                                  >
                                    ব্যান করুন
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => adminSetUserStatus(u.uid, 'active')}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[11px] cursor-pointer"
                                  >
                                    আন-ব্যান
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 10: BROADCAST PUSH */}
              {adminTab === 'broadcast' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-extrabold text-base text-white">ব্রডকাস্ট পুশ নোটিফিকেশন পাঠান</h3>
                    <p className="text-xs text-slate-400">সকল ইউজারের অ্যাপ এবং ডিভাইসে তাৎক্ষণিক নোটিফিকেশন পাঠাতে পারবেন</p>
                  </div>

                  {/* Device Push Live Status Banner */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>মোবাইল ব্যাকগ্রাউন্ড পুশ ইঞ্জিন সক্রিয়</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-[11px] text-emerald-300/80">
                          মেসেজটি ডাটাবেজে জমা হবে এবং সার্ভিস ওয়ার্কারের মাধ্যমে ফোনের লকস্ক্রিন ও নোটিফিকেশন বারে পৌঁছাবে।
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSendBroadcast} className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-white block mb-1">বিজ্ঞপ্তির শিরোনাম</label>
                      <input
                        type="text"
                        placeholder="যেমন: নতুন হাই-পেইং ভিডিও অফার যুক্ত হয়েছে!"
                        value={broadcastTitle}
                        onChange={e => setBroadcastTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">বিজ্ঞপ্তির বার্তা (Message)</label>
                      <textarea
                        rows={3}
                        placeholder="যেমন: দ্রুত কাজ সম্পন্ন করে আপনার দ্বিগুণ রিওয়ার্ড বুঝে নিন..."
                        value={broadcastMessage}
                        onChange={e => setBroadcastMessage(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-white block mb-1">ধরন (Type)</label>
                      <select
                        value={broadcastType}
                        onChange={e => setBroadcastType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        <option value="info">তথ্যমূলক (Info)</option>
                        <option value="success">সফলতা / বোনাস (Success)</option>
                        <option value="warning">জরুরী সতর্কতা (Warning)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>সকল ইউজারের কাছে পুশ পাঠান</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 11: CONTACT MESSAGES / INBOX */}
              {adminTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-base text-white">কন্টাক্ট মেসেজ ও ইনবক্স</h3>
                      <p className="text-xs text-slate-400">কন্টাক্ট আস ফর্ম থেকে ইউজারদের পাঠানো সরাসরি বার্তা</p>
                    </div>
                    <span className="text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-xl font-bold font-english">
                      মোট বার্তা: {contactMessages.length}
                    </span>
                  </div>

                  {contactMessages.length === 0 ? (
                    <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800">
                      <Mail className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">বর্তমানে কোনো বার্তা পেন্ডিং নেই</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contactMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-4 rounded-3xl bg-slate-950 border transition-all space-y-2.5 ${
                            msg.read ? 'border-slate-800 opacity-80' : 'border-emerald-500/60 shadow-lg'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                                {msg.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-extrabold text-xs text-white">{msg.name}</h4>
                                <span className="text-[10px] text-emerald-400 font-english font-mono">{msg.contact}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-english">
                                {new Date(msg.createdAt).toLocaleString()}
                              </span>
                              {!msg.read && (
                                <button
                                  onClick={() => adminMarkMessageRead(msg.id)}
                                  className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded-lg cursor-pointer"
                                >
                                  পঠিত চিহ্নিত করুন
                                </button>
                              )}
                              <button
                                onClick={() => adminDeleteMessage(msg.id)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                            <div className="text-[10px] text-amber-400 font-bold mb-1">
                              বিষয়: {msg.subject || 'সাধারণ বার্তা'}
                            </div>
                            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      {/* ADD / EDIT MICRO JOB MODAL */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white">
                {editingJob ? 'মাইক্রো জব অফার এডিট করুন' : 'নতুন মাইক্রো জব অফার লঞ্চ করুন'}
              </h3>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMicroJob} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">কাজের শিরোনাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ইউটিউব ভিডিও দেখুন ও ইনকাম করুন"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">ক্যাটাগরি</label>
                  <select
                    value={jobCategory}
                    onChange={e => {
                      const cat = e.target.value as any;
                      setJobCategory(cat);
                      if (cat === 'youtube') setJobCategoryLabel('ইউটিউব ভিডিও');
                      else if (cat === 'website') setJobCategoryLabel('ওয়েবসাইট ভিজিট');
                      else if (cat === 'subscribe') setJobCategoryLabel('সাবস্ক্রাইব');
                      else setJobCategoryLabel('স্পেশাল টাস্ক');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="youtube">📺 ইউটিউব ভিডিও</option>
                    <option value="website">🌐 ওয়েবসাইট</option>
                    <option value="subscribe">🔔 সাবস্ক্রাইব</option>
                    <option value="special">⚡ স্পেশাল</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">ক্যাটাগরি লেবেল</label>
                  <input
                    type="text"
                    value={jobCategoryLabel}
                    onChange={e => setJobCategoryLabel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">ভিডিও / অফার লিংক (URL)</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/... অথবা ওয়েবসাইট লিংক"
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">সময়সীমা (সেকেন্ড)</label>
                  <input
                    type="number"
                    required
                    value={jobSeconds}
                    onChange={e => setJobSeconds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">রিওয়ার্ড (৳)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={jobReward}
                    onChange={e => setJobReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">প্রায়োরিটি</label>
                  <input
                    type="number"
                    value={jobPriority}
                    onChange={e => setJobPriority(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">কাজের বর্ণনা</label>
                <textarea
                  rows={2}
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  placeholder="কাজের বিস্তারিত বিবরণ লিখুন..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">প্রয়োজনীয় প্রমাণ ও শর্তাবলী (কমা দিয়ে আলাদা করুন)</label>
                <input
                  type="text"
                  value={jobRequirements}
                  onChange={e => setJobRequirements(e.target.value)}
                  placeholder="ভিডিওর শুরুর স্ক্রিনশট, শেষের স্ক্রিনশট..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  {editingJob ? 'পরিবর্তন সংরক্ষণ করুন' : 'অফারটি রিলিজ / পাবলিশ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD / EDIT TASK SMARTLINK MODAL */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white">
                {editingTask ? 'স্মার্টলিংক বিজ্ঞাপন এডিট করুন' : 'নতুন স্মার্টলিংক বিজ্ঞাপন যোগ করুন'}
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-400 block mb-1">বিজ্ঞাপনের বাংলা নাম</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রিমিয়াম বিজ্ঞাপন ৫"
                  value={taskBanglaTitle}
                  onChange={e => setTaskBanglaTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">স্মার্টলিংক URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.profitableratecpmnetwork.com/..."
                  value={taskSmartLink}
                  onChange={e => setTaskSmartLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">রিওয়ার্ড (৳)</label>
                  <input
                    type="number"
                    required
                    value={taskReward}
                    onChange={e => setTaskReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">দৈনিক লিমিট</label>
                  <input
                    type="number"
                    required
                    value={taskDailyLimit}
                    onChange={e => setTaskDailyLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">কাউন্টডাউন (s)</label>
                  <input
                    type="number"
                    required
                    value={taskCooldown}
                    onChange={e => setTaskCooldown(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">ব্যাজ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: হট, সেরা, ৫X"
                  value={taskBadge}
                  onChange={e => setTaskBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition-colors cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT SUBMISSION REASON MODAL */}
      {rejectingSubId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-950 border border-rose-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 text-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="font-extrabold text-sm text-white">অর্ডার বাতিলের কারণ</h3>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">কারণ নির্বাচন করুন বা লিখুন:</label>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs mb-2"
              >
                <option value="ভিডিওর শুরুর বা শেষের স্ক্রিনশট সঠিক নয়">ভিডিওর শুরুর বা শেষের স্ক্রিনশট সঠিক নয়</option>
                <option value="প্রয়োজনীয় সময় পূর্ণ না করে আগেই জমা দেওয়া হয়েছে">প্রয়োজনীয় সময় পূর্ণ না করে আগেই জমা দেওয়া হয়েছে</option>
                <option value="অন্য ইউটিউব চ্যানেলের নকল বা ফেক স্ক্রিনশট">অন্য ইউটিউব চ্যানেলের নকল বা ফেক স্ক্রিনশট</option>
                <option value="বিজ্ঞাপন বা নির্দেশিত নিয়ম অনুযায়ী কাজ সম্পন্ন হয়নি">বিজ্ঞাপন বা নির্দেশিত নিয়ম অনুযায়ী কাজ সম্পন্ন হয়নি</option>
              </select>

              <input
                type="text"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectingSubId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                onClick={handleConfirmRejectSubmission}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black cursor-pointer"
              >
                নিশ্চিত বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SIZE SCREENSHOT VIEWER MODAL */}
      {viewingImage && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={viewingImage}
              alt="Fullscreen Proof"
              className="max-h-[85vh] w-auto rounded-2xl border border-slate-700 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}

      {/* USER BALANCE ADJUST MODAL */}
      {adjustingUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-5 max-w-sm w-full space-y-3 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-extrabold text-sm text-white">ব্যালেন্স সমন্বয়: {adjustingUser.name}</h3>
              <button onClick={() => setAdjustingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">বর্তমান ব্যালেন্স: ৳{adjustingUser.balance.toFixed(2)}</span>
              <label className="text-xs font-bold text-white block mb-1">টাকার পরিমাণ (যোগ করতে ধনাত্মক, কাটতে ঋণাত্মক)</label>
              <input
                type="number"
                value={balanceDelta}
                onChange={e => setBalanceDelta(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">সমন্বয়ের কারণ</label>
              <input
                type="text"
                value={adjustmentReason}
                onChange={e => setAdjustmentReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <button
              onClick={() => {
                adminUpdateUserBalance(adjustingUser.uid, balanceDelta, adjustmentReason);
                setAdjustingUser(null);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs cursor-pointer"
            >
              ব্যালেন্স আপডেট নিশ্চিত করুন
            </button>
          </div>
        </div>
      )}

      {/* ADD YOUTUBE TUTORIAL / WAZ VIDEO MODAL */}
      {showAddTutorialModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-slate-950 border border-red-500/40 rounded-3xl p-5 max-w-sm w-full space-y-3.5 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="font-extrabold text-sm text-white">নতুন ইউটিউব ভিডিও / ওয়াজ যোগ করুন</h3>
              </div>
              <button 
                onClick={() => setShowAddTutorialModal(false)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">ভিডিওর শিরোনাম (Title)</label>
              <input
                type="text"
                placeholder="যেমন: কাজের সহজ উপায় অথবা ইসলামিক ওয়াজ"
                value={newTutorialTitle}
                onChange={e => setNewTutorialTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">ইউটিউব ভিডিও লিঙ্ক (YouTube URL)</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={newTutorialUrl}
                onChange={e => setNewTutorialUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-white block mb-1">ভিডিও দেখার রিওয়ার্ড (টাকা)</label>
              <input
                type="number"
                value={newTutorialReward}
                onChange={e => setNewTutorialReward(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-english text-xs focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="tut_active"
                checked={newTutorialActive}
                onChange={e => setNewTutorialActive(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
              />
              <label htmlFor="tut_active" className="text-xs font-bold text-slate-300 cursor-pointer">
                এই ভিডিওটি এখনই সক্রিয় (Active) রাখুন
              </label>
            </div>

            <button
              type="button"
              onClick={async () => {
                if (!newTutorialTitle.trim() || !newTutorialUrl.trim()) {
                  showToast('ভিডিওর শিরোনাম এবং URL দুটিই আবশ্যক', 'warning');
                  return;
                }
                await adminAddYouTubeTutorial({
                  title: newTutorialTitle.trim(),
                  url: newTutorialUrl.trim(),
                  reward: Number(newTutorialReward) || 10,
                  active: newTutorialActive
                });
                setShowAddTutorialModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-md transition-all cursor-pointer active:scale-98"
            >
              ভিডিও সংরক্ষণ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
