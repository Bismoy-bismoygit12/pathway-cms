import React from 'react';
import { Heart, ShieldCheck, Stethoscope, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const About: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>{isBn ? 'আমাদের দর্শন' : 'Our Mission'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'লজ্জা নয়, সহমর্মিতাই সুস্থতার শুরু' : 'Healing Begins with Kind Understanding'}
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          {isBn
            ? 'পাথওয়ে একটি নিরাপদ ও আধুনিক প্ল্যাটফর্ম যা যেকোনো মাদক বা ওষুধ নির্ভরতা থেকে ধীরে ধীরে সুস্থ জীবনে ফিরে আসতে সাহায্য করে।'
            : 'Pathway was created to remove shame, fear, and secrecy from recovery in Bangladesh. We believe enduring health is built one small, safe choice at a time.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {isBn ? 'গোপনীয়তার সর্বোচ্চ নিশ্চয়তা' : 'Guaranteed Privacy'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {isBn
              ? 'আমরা কখনো বিজ্ঞাপন ট্র্যাকার চালাই না। কোনো সংবেদনশীল শব্দ ব্রাউজার ট্যাবে প্রকাশ পায় না। আপনি ছদ্মনাম দিয়েই সম্পূর্ণ সাহায্য পেতে পারেন।'
              : 'Zero advertising trackers, zero invasive cookies, and neutral tab titles. You can navigate your entire journey under a private nickname.'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            {isBn ? 'চিকিৎসাভিত্তিক সহমর্মিতা' : 'Clinical Medical Grounding'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {isBn
              ? 'আমাদের সকল চিকিৎসক বাংলাদেশ মেডিকেল অ্যান্ড ডেন্টাল কাউন্সিল (BMDC) নিবন্ধিত ও অভিজ্ঞ সাইকিয়াট্রিস্ট।'
              : 'All doctors in our directory are verified, BMDC-registered psychiatrists with clinical experience in addiction medicine.'}
          </p>
        </div>
      </div>
    </div>
  );
};
