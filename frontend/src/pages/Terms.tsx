import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const Terms: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-stone-700 dark:text-stone-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms of Service'}
        </h1>
        <p className="text-xs text-stone-400">Effective Date: November 2026</p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">1. Medical Disclaimer</h2>
          <p className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
            <strong>Pathway is a recovery-support companion, not an emergency medical service.</strong> It does not replace medical doctors, in-person hospitalization, or psychiatric diagnosis. If you are experiencing dangerous withdrawal, acute physical symptoms, or immediate thoughts of self-harm, tap Get Help Now or call 999 immediately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">2. Eligibility & Age (18+)</h2>
          <p>
            Pathway is designed for adults aged 18 and older. If you are under 18, please connect with trusted family members or designated national child/adolescent helplines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">3. Telehealth & Consultation Policy</h2>
          <p>
            Consultations booked through Pathway are independent medical services delivered by BMDC-licensed physicians. Pathway facilitates scheduling, communication, and secure payment processing. Cancellation is free up to 12 hours prior to scheduled visit times.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">4. Community Guidelines</h2>
          <p>
            Pathway is a respectful sanctuary. Harassment, sourcing or trading of illicit substances, or encouraging self-harm will result in immediate suspension.
          </p>
        </section>
      </div>
    </div>
  );
};
