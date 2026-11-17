import React from 'react';
import { Shield, Lock, Eye, Download, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-stone-700 dark:text-stone-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'গোপনীয়তা নীতিমালা' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-stone-400">Last updated: November 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">1. Our Core Privacy Promise</h2>
          <p>
            Pathway was built from the ground up to protect individuals recovering from substance dependence. We will never sell, lease, or monetize your personal recovery logs, journal entries, or doctor consultations. We maintain zero third-party advertising cookies or cross-site tracking pixels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">2. Minimal Data Collection & Anonymous Usage</h2>
          <p>
            You are invited to use Pathway with an anonymous nickname. We do not require national identification or full legal names to complete daily habits, chat with the AI helper, or explore educational materials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">3. Granular Doctor Access Control</h2>
          <p>
            When booking an appointment with a registered psychiatrist, you decide what is visible to that physician. By default, all check-in logs and medical reports are private. You can toggle access on or off at any moment in your profile.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">4. Export & Permanent Account Deletion</h2>
          <p>
            You own your information. Under My Profile &gt; Account Control, you can download an instant complete export of your notes or trigger permanent account deletion with a 7-day grace window.
          </p>
        </section>

        <section className="space-y-2 border-t border-stone-200 dark:border-stone-800 pt-4">
          <p className="text-xs text-stone-500">
            Pathway supports your recovery. It does not replace doctors or emergency services. If you have questions about privacy, contact us at privacy@pathway.support.
          </p>
        </section>
      </div>
    </div>
  );
};
