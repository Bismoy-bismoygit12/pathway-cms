import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BreathingTool: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPhase((curr) => {
              if (curr === 'inhale') return 'hold1';
              if (curr === 'hold1') return 'exhale';
              if (curr === 'exhale') return 'hold2';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive]);

  const getPhaseText = () => {
    if (phase === 'inhale') return isBn ? 'ধীরে ধীরে শ্বাস নিন...' : 'Inhale slowly...';
    if (phase === 'hold1') return isBn ? 'ধরে রাখুন...' : 'Hold gently...';
    if (phase === 'exhale') return isBn ? 'শান্তভাবে শ্বাস ছাড়ুন...' : 'Exhale smoothly...';
    return isBn ? 'শান্ত থাকুন...' : 'Rest empty...';
  };

  const getRingScale = () => {
    if (phase === 'inhale') return 'scale-125 bg-blue-500/20';
    if (phase === 'hold1') return 'scale-125 bg-blue-500/30';
    if (phase === 'exhale') return 'scale-90 bg-blue-500/10';
    return 'scale-90 bg-stone-300/20';
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 text-center shadow-xs">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
        <Wind className="w-3.5 h-3.5" />
        <span>Box Breathing (4-4-4-4)</span>
      </div>

      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto my-6 flex items-center justify-center">
        {/* Animated breathing circle */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-blue-500/40 transition-all duration-1000 ease-in-out ${getRingScale()}`}
        />
        <div className="relative z-10 space-y-1">
          <div className="text-3xl sm:text-4xl font-bold font-mono text-blue-800 dark:text-blue-200">
            {secondsLeft}s
          </div>
          <div className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
            {getPhaseText()}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="px-5 py-2.5 rounded-full bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-sm transition flex items-center gap-2"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isActive ? (isBn ? 'বিরতি' : 'Pause') : isBn ? 'শুরু করুন' : 'Start Breathing'}</span>
        </button>

        <button
          onClick={() => {
            setIsActive(false);
            setPhase('inhale');
            setSecondsLeft(4);
          }}
          className="p-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-600 hover:bg-stone-100 transition"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
