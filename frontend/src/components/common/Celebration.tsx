import React, { useEffect } from 'react';
import { Sparkles, Trophy, Award, Heart, CheckCircle2 } from 'lucide-react';

interface CelebrationProps {
  show: boolean;
  title: string;
  subtitle: string;
  points?: number;
  onClose: () => void;
}

export const Celebration: React.FC<CelebrationProps> = ({ show, title, subtitle, points, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl border border-blue-200 dark:border-blue-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">{title}</h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          {subtitle}
        </p>

        {points !== undefined && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-sm mt-4 border border-amber-200 dark:border-amber-900/60">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>+{points} Points</span>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
