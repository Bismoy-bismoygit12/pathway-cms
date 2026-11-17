import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickExitButton: React.FC<{ variant?: 'header' | 'floating' }> = ({ variant = 'header' }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const escapeCountRef = useRef(0);
  const escapeTimerRef = useRef<any>(null);

  const performQuickExit = () => {
    // Overwrite history entry and redirect to neutral simulated weather report
    sessionStorage.clear();
    window.location.replace('/weather-forecast');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        escapeCountRef.current += 1;
        if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);

        if (escapeCountRef.current >= 3) {
          performQuickExit();
        } else {
          escapeTimerRef.current = setTimeout(() => {
            escapeCountRef.current = 0;
          }, 1200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (escapeTimerRef.current) clearTimeout(escapeTimerRef.current);
    };
  }, []);

  if (variant === 'floating') {
    return (
      <button
        onClick={performQuickExit}
        title="Quick Exit (or press Escape 3 times)"
        aria-label="Quick Exit website"
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-stone-800/90 hover:bg-stone-900 text-stone-100 text-xs font-medium px-3 py-2 rounded-full shadow-lg backdrop-blur transition-all focus:outline-none focus:ring-2 focus:ring-stone-400"
      >
        <ShieldAlert className="w-4 h-4 text-amber-400" />
        <span>{t('app.quickExit')}</span>
        <span className="hidden sm:inline text-[10px] bg-stone-700 px-1.5 py-0.5 rounded text-stone-300">Esc × 3</span>
      </button>
    );
  }

  return (
    <button
      onClick={performQuickExit}
      title="Instantly switch to neutral weather page (or press Escape 3 times)"
      aria-label="Quick Exit"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
      <span>{t('app.quickExit')}</span>
    </button>
  );
};

export const QuickExit = QuickExitButton;
