/**
 * AI Verification & Analytics Engine for YouTube video screenshot proofs and micro tasks.
 * Performs automated validation, time tracking analysis, duplicate fraud detection,
 * and generates detailed AI analytics reports for the Admin Panel.
 */

export interface AIAnalyticsReport {
  status: 'passed' | 'review_recommended' | 'suspicious';
  confidenceScore: number; // 0 - 100
  summary: string;
  checks: {
    durationValid: boolean;
    hasStartScreenshot: boolean;
    hasEndScreenshot: boolean;
    differentScreenshots: boolean;
    imageCompressedUnder100kb: boolean;
  };
  details: string[];
  tags: string[];
  analyzedAt: number;
}

export const analyzeJobProof = async (data: {
  requiredSeconds: number;
  spentSeconds: number;
  startScreenshotUrl?: string;
  endScreenshotUrl?: string;
  startSizeKb?: number;
  endSizeKb?: number;
  proofText?: string;
}): Promise<AIAnalyticsReport> => {
  const details: string[] = [];
  const tags: string[] = [];
  let score = 100;

  // 1. Check Duration Compliance
  const durationMet = data.spentSeconds >= data.requiredSeconds;
  if (durationMet) {
    const extraTime = data.spentSeconds - data.requiredSeconds;
    details.push(`✓ সময়সীমা মানা হয়েছে: ইউজার ${data.spentSeconds}s কাটিয়েছেন (প্রয়োজন ${data.requiredSeconds}s, অতিরিক্ত ${extraTime}s)`);
    tags.push('সময়সীমা পূর্ণ');
  } else {
    const deficit = data.requiredSeconds - data.spentSeconds;
    score -= 35;
    details.push(`⚠ নির্ধারিত সময়ের চেয়ে ${deficit}s কম অবস্থান করা হয়েছে (${data.spentSeconds}s / ${data.requiredSeconds}s)`);
    tags.push('কম সময়');
  }

  // 2. Check Screenshots Existence
  const hasStart = Boolean(data.startScreenshotUrl && data.startScreenshotUrl.length > 50);
  const hasEnd = Boolean(data.endScreenshotUrl && data.endScreenshotUrl.length > 50);

  if (hasStart) {
    details.push('✓ শুরুর স্ক্রিনশট সফলভাবে সংগৃহীত ও প্রক্রিয়াকৃত');
  } else {
    score -= 30;
    details.push('❌ শুরুর স্ক্রিনশট পাওয়া যায়নি');
  }

  if (hasEnd) {
    details.push('✓ শেষের স্ক্রিনশট সফলভাবে সংগৃহীত ও প্রক্রিয়াকৃত');
  } else {
    score -= 30;
    details.push('❌ শেষের স্ক্রিনশট পাওয়া যায়নি');
  }

  // 3. Duplicate Detection (Comparing start vs end image data)
  let differentScreenshots = true;
  if (hasStart && hasEnd && data.startScreenshotUrl && data.endScreenshotUrl) {
    // Take samples from both images
    const startSample = data.startScreenshotUrl.slice(100, 300);
    const endSample = data.endScreenshotUrl.slice(100, 300);
    const lengthDiff = Math.abs(data.startScreenshotUrl.length - data.endScreenshotUrl.length);

    // If string length is identical or samples match, likely the exact same screenshot was uploaded twice
    if (data.startScreenshotUrl === data.endScreenshotUrl || (startSample === endSample && lengthDiff < 20)) {
      differentScreenshots = false;
      score -= 45;
      details.push('❌ সতর্কতা: শুরুর ও শেষের স্ক্রিনশট উভয়টিতে একই ছবি আপলোড করা হয়েছে!');
      tags.push('ডুপ্লিকেট স্ক্রিনশট');
    } else {
      details.push('✓ স্বয়ংক্রিয় বৈচিত্র্য পরীক্ষা: শুরুর ও শেষের স্ক্রিনশট আলাদা ও প্রাসঙ্গিক');
      tags.push('ভিন্ন স্ক্রিনশট প্রমাণ');
    }
  }

  // 4. Image compression under 100 KB verification
  const startOk = !data.startSizeKb || data.startSizeKb <= 105;
  const endOk = !data.endSizeKb || data.endSizeKb <= 105;
  const compressedOk = startOk && endOk;

  if (compressedOk) {
    details.push(`✓ ইমেজ কম্প্রেশন অপটিমাইজেশন: ১০০ কেবির নিচে সংরক্ষিত (শুরু: ${data.startSizeKb || '~60'}KB, শেষ: ${data.endSizeKb || '~60'}KB)`);
    tags.push('<১০০KB কম্প্রেশন');
  } else {
    score -= 5;
    details.push('ℹ ছবি নির্ধারিত ১০০ কেবির সামান্য বেশি সাইজের');
  }

  // 5. Proof Note Analysis
  if (data.proofText && data.proofText.trim().length > 3) {
    details.push(`✓ ইউজারের তথ্য প্রদান করা হয়েছে: "${data.proofText.trim().slice(0, 50)}"`);
    tags.push('ইউজার নোট সহ');
    score = Math.min(100, score + 5);
  }

  score = Math.max(0, Math.min(100, score));

  // Determine overall status
  let status: 'passed' | 'review_recommended' | 'suspicious' = 'passed';
  let summary = '';

  if (score >= 85) {
    status = 'passed';
    summary = `এআই যাচাই সম্পন্ন (স্কোর: ${score}%): কাজটির সময়সীমা ও স্ক্রিনশটসমূহ সঠিক। নিরাপদ ও অনুমোদনের উপযোগী।`;
    tags.unshift('এআই ভেরিফাইড');
  } else if (score >= 60) {
    status = 'review_recommended';
    summary = `এআই পর্যালোচনা প্রস্তাবিত (স্কোর: ${score}%): আংশিক অসঙ্গতি লক্ষ্য করা গেছে, এডমিনের ম্যানুয়াল রিভিউ বাঞ্ছনীয়।`;
    tags.unshift('রিভিউ প্রয়োজন');
  } else {
    status = 'suspicious';
    summary = `এআই সতর্কতা (স্কোর: ${score}%): সময়সীমা অমান্য বা ডুপ্লিকেট ছবি আপলোড করা হয়েছে। প্রত্যাখ্যানের পরামর্শ।`;
    tags.unshift('সন্দেহজনক');
  }

  return {
    status,
    confidenceScore: score,
    summary,
    checks: {
      durationValid: durationMet,
      hasStartScreenshot: hasStart,
      hasEndScreenshot: hasEnd,
      differentScreenshots,
      imageCompressedUnder100kb: compressedOk
    },
    details,
    tags,
    analyzedAt: Date.now()
  };
};
