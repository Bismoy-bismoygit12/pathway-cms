import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('pathway_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (type: 'necessary' | 'all') => {
    localStorage.setItem('pathway_cookie_consent', type);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isBn = language === 'bn';

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            <strong className="text-stone-900 dark:text-stone-100 font-medium mr-1">
              {isBn ? 'আপনার গোপনীয়তা সুরক্ষিত:' : 'Your Privacy is Respected:'}
            </strong>
            {isBn
              ? 'আমরা শুধুমাত্র আপনার ভাষা ও থিম সেটিংস মনে রাখার জন্য প্রয়োজনীয় কুকি ব্যবহার করি। কোনো বাণিজ্যিক বিজ্ঞাপন ট্র্যাকার নেই।'
              : 'Pathway only uses strictly necessary local storage to remember your language and secure session. We have zero advertising or third-party behavioral trackers.'}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => handleChoice('necessary')}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {isBn ? 'শুধুমাত্র প্রয়োজনীয়' : 'Only Necessary'}
          </button>
          <button
            onClick={() => handleChoice('all')}
            className="flex-1 md:flex-initial px-5 py-2 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition"
          >
            {isBn ? 'সম্মত আছি' : 'Accept All'}
          </button>
        </div>
      </div>
    </div>
  );
};
