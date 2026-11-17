import React, { useState, useEffect } from 'react';
import { WifiOff, PhoneCall } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner: React.FC<{ onOpenEmergency: () => void }> = ({ onOpenEmergency }) => {
  const [isBrowserOffline, setIsBrowserOffline] = useState(!navigator.onLine);
  const { isSimulatedOffline } = useDemo();
  const { language } = useLanguage();

  useEffect(() => {
    const handleOnline = () => setIsBrowserOffline(false);
    const handleOffline = () => setIsBrowserOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOffline = isBrowserOffline || isSimulatedOffline;

  if (!isOffline) return null;

  const isBn = language === 'bn';

  return (
    <div
      role="alert"
      className="bg-amber-600 text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between shadow-inner"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
          <span>
            {isBn
              ? 'ইন্টারনেট সংযোগ বিচ্ছিন্ন রয়েছে। কিছু তথ্য সীমিত হতে পারে।'
              : 'You appear to be offline. Saved pages and emergency hotlines are still available.'}
          </span>
        </div>

        <button
          onClick={onOpenEmergency}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-amber-900 text-xs font-semibold hover:bg-amber-50 transition shrink-0 shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{isBn ? 'জরুরি হেল্পলাইন ৯৯৯' : 'Emergency 999'}</span>
        </button>
      </div>
    </div>
  );
};
