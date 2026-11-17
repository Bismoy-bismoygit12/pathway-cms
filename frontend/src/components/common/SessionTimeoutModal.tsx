import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const SessionTimeoutModal: React.FC = () => {
  const { sessionTimeoutWarning, extendSession, logout } = useAuth();
  const { language } = useLanguage();
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: any = null;
    if (sessionTimeoutWarning) {
      setCountdown(60);
      timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            logout();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionTimeoutWarning, logout]);

  if (!sessionTimeoutWarning) return null;

  const isBn = language === 'bn';

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 text-center animate-in fade-in zoom-in-95">
        <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          {isBn ? 'আপনি কি এখনো আমাদের সাথে আছেন?' : 'Are you still with us?'}
        </h3>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          {isBn
            ? `আপনার গোপনীয়তার স্বার্থে আরও ${countdown} সেকেন্ডের মধ্যে স্বয়ংক্রিয়ভাবে লগ আউট হয়ে যাবে।`
            : `For your privacy and security, you will be automatically logged out in ${countdown} seconds.`}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            onClick={logout}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            {isBn ? 'এখনই লগ আউট' : 'Log out now'}
          </button>
          <button
            onClick={extendSession}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            {isBn ? 'লগ ইন থাকুন' : 'Stay logged in'}
          </button>
        </div>
      </div>
    </div>
  );
};
