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
  Sparkles
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
            <li><strong>Personal Identification:</strong> Name, email address, and mobile phone number for account identification and payout delivery.</li>
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
            Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">https://policies.google.com/technologies/ads</a>.
          </p>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on JME Ads. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="text-[11px] text-gray-500 italic">
            Note: JME Ads has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>5. CCPA & GDPR Privacy Rights</span>
          </h2>
          <p>
            We respect your privacy rights under GDPR and CCPA. Every user is entitled to the right to access, rectification, erasure, restrict processing, and data portability. If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please submit an inquiry via our Contact Us portal.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>6. Children's Information (COPPA)</span>
          </h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. JME Ads does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>7. Consent</span>
          </h2>
          <p>
            By using our website or registering an account, you hereby consent to our Privacy Policy and agree to its terms and conditions.
          </p>
        </section>
      </div>
    </div>
  );
};

// 2. Terms & Conditions Page (Google AdSense Compliant English)
export const TermsPage: React.FC = () => {
  return (
    <div className="pb-28 space-y-4 font-english">
      <PolicyHeader 
        title="Terms & Conditions" 
        subtitle="Rules and regulations for using JME Ads services" 
        icon={<FileText className="w-6 h-6 text-emerald-200" />} 
      />

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs text-gray-700 leading-relaxed">
        <p className="text-[11px] text-gray-400">
          Last Updated: September 2026
        </p>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using JME Ads ("the Service"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, you must discontinue using our services immediately.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">2. Account Registration & Single-Account Policy</h2>
          <p>
            To use our services, you must register a genuine user account with accurate and verifiable details. Each individual is strictly permitted to hold only <strong>one account</strong>. Creating multiple accounts, utilizing Virtual Private Networks (VPN), proxies, emulator software, or automated scripts/bots is strictly prohibited and will result in permanent account suspension without prior notice.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">3. Task Verification & Proof Submissions</h2>
          <p>
            Users earn rewards by completing genuine micro-tasks, viewing promotional content, and engaging with partner materials. For micro-jobs requiring proof:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>You must adhere to the mandatory duration timer (e.g. 15s for smartlinks, 60-180s for remote video jobs).</li>
            <li>Submitting falsified screenshots, duplicated images, or returning before timer expiration constitutes fraudulent activity and will lead to task rejection and potential account penalty.</li>
            <li>All submitted proofs are subject to administrative review.</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">4. Payouts and Withdrawals</h2>
          <p>
            Withdrawal requests are processed according to the minimum withdrawal threshold established by the platform (minimum ৳1,000). Users must ensure they provide accurate payment information (bKash, Nagad, Rocket). JME Ads is not liable for funds transferred to incorrectly provided account numbers.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-bold text-sm text-gray-900">5. Limitation of Liability</h2>
          <p>
            JME Ads and its team shall not be held liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, server maintenance, or network interruptions.
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

// 3. About Us Page (English)
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

// 4. Contact Us Page (Direct Message To Admin Panel - No Phone or Email Displayed)
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
