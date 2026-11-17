import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const CookiePolicy: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-stone-700 dark:text-stone-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'কুকি ব্যবহারের নীতিমালা' : 'Cookie Policy'}
        </h1>
        <p className="text-xs text-stone-400">November 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">What Cookies We Use</h2>
          <p>
            Pathway uses only strictly essential local storage and session cookies. These enable secure login authentication, preserve your language choice (English or Bangla), and remember your accessibility preferences (light or soft-dark mode).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Zero Advertising Cookies</h2>
          <p>
            We strictly forbid behavioral advertising, retargeting pixels, and tracking beacons. We will never track your internet browsing across other websites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Managing Your Preferences</h2>
          <p>
            You can clear your stored cookies or local browser data anytime using your browser settings or via the Cookie Consent banner in the footer.
          </p>
        </section>
      </div>
    </div>
  );
};
