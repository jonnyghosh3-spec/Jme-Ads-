import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  FileText, 
  Mail, 
  Info, 
  ArrowLeft, 
  CheckCircle2, 
  Send,
  HelpCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Cookie,
  BookOpen,
  Award,
  Globe
} from 'lucide-react';

export const PolicyHeader: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => {
  const { setActiveTab } = useApp();
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-700 text-white p-5 shadow-md relative overflow-hidden mb-4">
      <button 
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-1.5 text-xs text-emerald-100 font-bold mb-3 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </button>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white font-english">{title}</h1>
          <p className="text-xs text-emerald-100">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

// 1. Privacy Policy Page (Google AdSense Compliant English)
export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4 font-english">
      <PolicyHeader 
        title="Privacy Policy" 
        subtitle="Our commitment to safeguarding your privacy and data security" 
        icon={<ShieldCheck className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <p className="text-[11px] text-gray-400">
          Last Updated: September 2026 | Effective Date: September 2026
        </p>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>1. Introduction & Overview</span>
          </h2>
          <p>
            Welcome to JME Ads ("we", "our", or "us"). At JME Ads, accessible from our web and progressive web application, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by JME Ads and how we use, protect, and handle it in strict compliance with international data standards and Google AdSense publisher policies.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>2. Information We Collect</span>
          </h2>
          <p>
            When you register for an account or interact with our platform, we may collect personal information including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>Personal Identification:</strong> Name, email address, mobile phone number, and optional profile avatar.</li>
            <li><strong>Activity & Task Data:</strong> Timestamps of viewed advertisements, completed micro-tasks, and proof screenshots submitted for verification.</li>
            <li><strong>Log Files:</strong> Standard internet log information including browser type, referring/exit pages, date/time stamps, Internet Protocol (IP) addresses, and device identifiers to prevent bot fraud.</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>3. How We Use Your Information</span>
          </h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Provide, operate, and maintain our earning dashboard and task delivery system.</li>
            <li>Process withdrawal requests through verified mobile financial channels (bKash, Nagad, Rocket).</li>
            <li>Detect, investigate, and prevent fraudulent clicks, artificial traffic manipulation, and terms violations.</li>
            <li>Send notifications regarding your withdrawal status, task approvals, or important administrative alerts.</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>4. Google DoubleClick DART Cookies & Third-Party Advertising</span>
          </h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at: <span className="text-emerald-700 font-semibold underline">https://policies.google.com/technologies/ads</span>.
          </p>
          <p>
            Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include Google AdSense and accredited digital ad networks. Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>5. CCPA Privacy Rights (Do Not Sell My Personal Information)</span>
          </h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), consumers have the right to request disclosure of personal data categories collected, request deletion of personal data, and request that a business not sell their personal data. If you make a request, we have one month to respond to you. Please contact our administrative office via the Contact page.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>6. GDPR Data Protection Rights</span>
          </h2>
          <p>
            Every user is entitled to data access, rectification, erasure, restriction of processing, objection to processing, and data portability. To exercise any of these statutory rights, please reach out via our official portal.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>7. Children's Information</span>
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. JME Ads does not knowingly collect any Personal Identifiable Information from children under the age of 13.
          </p>
        </section>
      </div>
    </div>
  );
};

// 2. Terms & Conditions Page (English)
export const TermsPage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4 font-english">
      <PolicyHeader 
        title="Terms & Conditions" 
        subtitle="User agreement, anti-fraud rules, and service guidelines" 
        icon={<FileText className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">1. Acceptance of Terms</h2>
          <p>
            By accessing and using JME Ads, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue using our services immediately.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">2. Account Eligibility & One-Account Policy</h2>
          <p>
            Users must provide authentic and verifiable contact information. Each individual user is permitted to maintain only legitimate accounts up to the system allowance. Automated registration, disposable phone numbers, or creating abusive clone accounts will result in immediate termination and forfeiture of all accumulated balances.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">3. Task Verification & Anti-Fraud Policy</h2>
          <p>
            To maintain high advertising quality for our brand partners:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Users must genuinely view advertisements for the full required duration (typically 15 to 60 seconds).</li>
            <li>The use of automated bots, autoclickers, proxy networks, VPNs, or headless browsers is strictly prohibited.</li>
            <li>Submitting falsified screenshots, duplicated images, or returning before timer expiration constitutes fraudulent activity and will lead to task rejection and potential account penalty.</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">4. Payouts and Withdrawals</h2>
          <p>
            Withdrawal requests are processed subject to account verification. Users must reach the minimum required threshold and maintain good standing. We reserve the right to audit suspicious withdrawal activity before releasing funds.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">5. Intellectual Property</h2>
          <p>
            All content, UI elements, brand assets, software scripts, and trademarks displayed on JME Ads are the proprietary property of JME Ads or licensed partners. Unauthorized reproduction or scraping is strictly prohibited.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">6. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, replace, or terminate any feature of the platform, reward values, or fee structures at our sole discretion with or without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
};

// 3. Disclaimer & Earnings Disclosure (AdSense & FTC Compliant)
export const DisclaimerPage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4 font-english">
      <PolicyHeader 
        title="Disclaimer & Earnings Disclosure" 
        subtitle="Transparent operational policies and reward disclosures" 
        icon={<AlertTriangle className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">1. No Earnings Guarantees</h2>
          <p>
            JME Ads is an online digital engagement and micro-task intermediation platform. Any references to potential earnings, task rewards, or referral bonuses represent potential reward credits for completed verified user actions. We do not make any guarantees regarding income, financial return, or regular employment. Individual earnings depend entirely on the availability of advertising campaigns, task quotas, user diligence, and strict compliance with our quality rules.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">2. Third-Party Advertisements & External Links</h2>
          <p>
            Our service contains links to third-party websites, video hosting platforms (such as YouTube), and advertiser landing pages. JME Ads does not endorse, guarantee, or assume responsibility for the accuracy, legality, or quality of products, services, or claims advertised on third-party sites. Users visit external links at their own discretion.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">3. Non-Affiliation Notice</h2>
          <p>
            All product names, logos, brands, and registered trademarks of third-party platforms (including YouTube, Google, bKash, and Nagad) are property of their respective owners. Their mention does not imply endorsement, affiliation, or sponsorship.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">4. User Discretion & Tax Obligations</h2>
          <p>
            Users are solely responsible for complying with local tax obligations or reporting requirements in their jurisdiction arising from any rewards or payments received through JME Ads.
          </p>
        </section>
      </div>
    </div>
  );
};

// 4. Cookie Policy Page (AdSense Compliant)
export const CookiePolicyPage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4 font-english">
      <PolicyHeader 
        title="Cookie Policy" 
        subtitle="How we use cookies and tracking technologies" 
        icon={<Cookie className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your computer or mobile device when you browse websites. They are widely used to make websites work properly, improve user efficiency, and provide analytical reporting information to website operators.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">2. Types of Cookies We Use</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li><strong>Essential & Functional Cookies:</strong> Necessary to keep you signed in, remember your user preferences, and securely track timer state during task completion.</li>
            <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with our pages, identify device compatibility issues, and enhance web application performance.</li>
            <li><strong>Advertising & Targeting Cookies:</strong> Used by third-party advertising partners including Google AdSense to serve relevant ads and measure ad campaign efficacy.</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">3. Managing and Opting Out of Cookies</h2>
          <p>
            Most modern web browsers allow you to control cookies through their browser settings. You can configure your browser to reject cookies or notify you when a cookie is placed. Additionally, to opt out of Google’s personalized ad cookies, visit Google Ad Settings (<span className="text-emerald-700 font-semibold underline">https://adssettings.google.com</span>) or the Digital Advertising Alliance Consumer Choice tool.
          </p>
        </section>
      </div>
    </div>
  );
};

// 5. About Us Page (English)
export const AboutUsPage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4 font-english">
      <PolicyHeader 
        title="About Us" 
        subtitle="Empowering digital publishers and remote earners" 
        icon={<Info className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">Who We Are</h2>
          <p>
            JME Ads is an innovative digital engagement and publisher advertising network designed to bridge content creators, advertisers, and active web users. We provide an intuitive, high-performance web platform where users can earn rewards for completing micro-tasks, engaging with digital media, exploring sponsored partner links, and sharing with their community.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">Our Core Mission</h2>
          <p>
            Our mission is to foster digital financial inclusion by creating legitimate, transparent earning opportunities for students, remote freelancers, and everyday smartphone users across South Asia. We leverage cloud verification technologies, automated anti-fraud validation, and secure instant payouts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm text-gray-900">Why Choose JME Ads?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-emerald-950">Transparent Tracking</h4>
              <p className="text-[11px] text-emerald-800">Real-time balance calculations with automated timer validation and proof review.</p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h4 className="font-bold text-xs text-emerald-950">Reliable Payouts</h4>
              <p className="text-[11px] text-emerald-800">Support for leading mobile banking providers with rapid processing workflows.</p>
            </div>
          </div>
        </section>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900 font-semibold">
          © 2026 JME Ads Network. All Rights Reserved. Built for high performance, compliance, and user security.
        </div>
      </div>
    </div>
  );
};

// 6. Educational Guide & Learning Center (High Value Content for AdSense Approval)
export const PublisherGuidePage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4">
      <PolicyHeader 
        title="Publisher & Earning Guide" 
        subtitle="ডিজিটাল বিজ্ঞাপন, অনলাইন আর্নিং ও নিরাপত্তা নির্দেশিকা" 
        icon={<BookOpen className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
          <span className="font-extrabold text-xs flex items-center gap-1.5 text-emerald-800">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>এডুকেশনাল ও নলেজ সেন্টার</span>
          </span>
          <p className="text-[11px] leading-relaxed">
            গুগল অ্যাডসেন্স এবং বিশ্বমানের অ্যাড নেটওয়ার্কের নিয়মানুযায়ী এখানে জেনে নিন কীভাবে ডিজিটাল মিডিয়া কাজ করে এবং প্রতারণা এড়িয়ে নিরাপদে আয় করা যায়।
          </p>
        </div>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>১. ডিজিটাল বিজ্ঞাপন মডেল কী? (CPM, CPC, CPA)</span>
          </h2>
          <p>
            অনলাইন জগতে বিভিন্ন বিজ্ঞাপন মডেল রয়েছে:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li><strong>CPM (Cost Per Mille):</strong> প্রতি ১,০০০ বিজ্ঞাপনের প্রদর্শনী বা ভিউ এর উপর নির্ধারিত রেট।</li>
            <li><strong>CPC (Cost Per Click):</strong> বিজ্ঞাপনে জেনুইন ভিজিটরের ক্লিক প্রতি নির্ধারিত আয়।</li>
            <li><strong>CPA (Cost Per Action):</strong> বিজ্ঞাপন থেকে অ্যাপ ইনস্টল, সাইনআপ বা কোনো টাস্ক সম্পন্ন করার ভিত্তিতে আয়।</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>২. ইনভ্যালিড ক্লিক ও ট্র্যাফিক প্রতিরোধ কেন জরুরি?</span>
          </h2>
          <p>
            অ্যাডসেন্স এবং শীর্ষস্থানীয় অ্যাড কোম্পানিগুলো স্বয়ংক্রিয় রোবট বা ভুয়া ক্লিক কঠোরভাবে নিষিদ্ধ করে। বিজ্ঞাপনদাতারা প্রকৃত গ্রাহক চান। তাই ১৫ সেকেন্ড মনোযোগ দিয়ে বিজ্ঞাপন দেখা এবং কোনো অটো-ক্লিকার ব্যবহার না করাই প্ল্যাটফর্মের দীর্ঘমেয়াদি স্থায়িত্ব নিশ্চিত করে।
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>৩. সাইবার নিরাপত্তা ও নিরাপদ ইন্টারনেট ব্রাউজিং</span>
          </h2>
          <p>
            অনলাইনে কাজ করার সময় সবসময় ব্যক্তিগত পাসওয়ার্ড নিরাপদ রাখুন। কখনো কাউকে আপনার পিন বা ওটিপি দেবেন না। JME Ads কখনোই আপনার বিকাশ/নগদ পিন নম্বর চাইবে না।
          </p>
        </section>
      </div>
    </div>
  );
};

// 7. Contact Us Page (Direct Message To Admin Panel - No Phone or Email Displayed)
export const ContactUsPage: React.FC = () => {
  const { submitContactMessage, showToast } = useApp();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      showToast('অনুগ্রহ করে সবগুলো ঘর পূরণ করুন', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMessage({
        name: name.trim(),
        contact: contact.trim(),
        subject,
        message: message.trim()
      });
      setSent(true);
      setName('');
      setContact('');
      setMessage('');
    } catch (err: any) {
      showToast('বার্তা পাঠাতে সমস্যা হয়েছে: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-28 space-y-4">
      <PolicyHeader 
        title="Contact Support" 
        subtitle="Send your inquiries, feedback, or complaints directly to the Admin" 
        icon={<Mail className="w-6 h-6 text-emerald-200" />} 
      />

      {/* Direct Messaging Form (No phone numbers or emails shown) */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <div>
          <h2 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>সরাসরি এডমিন প্যানেলে বার্তা পাঠান</span>
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            আপনার জিজ্ঞাসা, একাউন্ট সংক্রান্ত কোনো সমস্যা বা পরামর্শ নিচে লিখে সাবমিট করুন। বার্তাটি সরাসরি এডমিন প্যানেলে পৌঁছে যাবে।
          </p>
        </div>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-50 text-center border border-emerald-200 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-950">আপনার বার্তা সফলভাবে এডমিন প্যানেলে জমা হয়েছে!</h4>
            <p className="text-xs text-emerald-700 leading-relaxed">
              ধন্যবাদ! এডমিন প্যানেল থেকে আপনার বার্তাটি দ্রুত পর্যালোচনা করা হবে।
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
            >
              আরেকটি বার্তা পাঠান
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">আপনার পূর্ণ নাম (Full Name):</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="যেমন: মো: আরিফুল ইসলাম" 
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500" 
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">আপনার ইমেইল অথবা মোবাইল নম্বর:</label>
              <input 
                type="text" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                placeholder="যেমন: example@gmail.com অথবা 017XXXXXXXX" 
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500 font-english" 
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">বিষয় (Category / Subject):</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="General Inquiry">সাধারণ জিজ্ঞাসা (General Inquiry)</option>
                <option value="Withdrawal Issue">উত্তোলন সমস্যা (Withdrawal Issue)</option>
                <option value="Task or Offer Verification">টাস্ক / কাজের ভেরিফিকেশন (Task Proof)</option>
                <option value="Publisher Verification">পাবলিশার ব্লু-টিক ভেরিফিকেশন (Publisher Upgrade)</option>
                <option value="Technical Support">অন্যান্য সহায়তা (Other Support)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">আপনার বার্তা বা অভিযোগের বিবরণ:</label>
              <textarea 
                rows={4} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="আপনার বার্তাটি বিস্তারিতভাবে এখানে লিখুন..." 
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'পাঠানো হচ্ছে...' : 'এডমিনকে বার্তা পাঠান'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
