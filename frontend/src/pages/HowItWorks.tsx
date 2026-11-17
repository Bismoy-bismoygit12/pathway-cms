import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart, ArrowRight, Shield, Clock, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'পাথওয়ে যেভাবে আপনার পাশে থাকে' : 'How Pathway Gently Supports You'}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-xl mx-auto">
          {isBn
            ? 'প্রতিদিনের ছোট মুহূর্তগুলো দিয়েই তৈরি হয় বড় পরিবর্তন।'
            : 'Explore the daily rhythms, clinical safety net, and calm tools available to you.'}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
            1
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {isBn ? 'ব্যক্তিগত পছন্দ নির্ধারণ' : 'Set Your Recovery Preferences'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Tell us what triggers you notice (like evening fatigue or work stress) and your favourite calm activities. We never share this with anyone unless you choose to toggle it on during a doctor visit.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
            2
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {isBn ? '২ থেকে ৫ মিনিটের ছোট অভ্যাস' : 'Practice 2-Minute Calming Habits'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Open My Day each morning or evening. Complete a box breathing exercise, drink a mindful glass of water, or step into fresh air. Missing a day does not delete your streak.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 sm:p-7 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
            3
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              {isBn ? 'বিশেষজ্ঞ চিকিৎসকের অনলাইন বা চেম্বার ভিজিট' : 'Connect with Compassionate Doctors'}
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              When you feel ready for deeper medical review or tapering advice, book an online video consultation or in-person visit with our verified psychiatrists.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition"
        >
          <span>{t('nav.signup')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
