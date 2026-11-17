import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, X, AlertCircle, Sparkles } from 'lucide-react';
import { Goal } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface GoalPlayerModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (goal: Goal) => void;
}

export const GoalPlayerModal: React.FC<GoalPlayerModalProps> = ({ goal, isOpen, onClose, onComplete }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeStep, setActiveStep] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [minTimeWarning, setMinTimeWarning] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
      setElapsedSeconds(0);
      setIsRunning(true);
      setMinTimeWarning(null);
    }
  }, [isOpen, goal]);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isRunning]);

  if (!isOpen || !goal) return null;

  const totalTargetSeconds = (goal.durationMinutes || 3) * 60;
  const progressPercent = Math.min((elapsedSeconds / totalTargetSeconds) * 100, 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleFinish = () => {
    if (elapsedSeconds < goal.minDurationSeconds) {
      setMinTimeWarning(
        isBn
          ? `অনুগ্রহ করে মনকে শান্ত হতে আরও ${goal.minDurationSeconds - elapsedSeconds} সেকেন্ড সময় দিন। তাড়াহুড়ো করার প্রয়োজন নেই।`
          : `Please take at least ${goal.minDurationSeconds - elapsedSeconds} more seconds to absorb this habit mindfully. There is no rush.`
      );
      return;
    }
    onComplete(goal);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 to-blue-700 text-white relative">
          <button
            onClick={onClose}
            aria-label="Close habit player"
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>+{goal.pointsReward} Points</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isBn ? goal.titleBn : goal.title}
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">
            {isBn ? goal.descriptionBn : goal.description}
          </p>
        </div>

        {/* Timer & Progress */}
        <div className="p-6 space-y-6 flex-1">
          <div className="text-center space-y-2">
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-blue-800 dark:text-blue-300">
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-xs text-stone-400">
              Target: {goal.durationMinutes} min &bull; Min required: {goal.minDurationSeconds}s
            </div>

            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Prompt */}
          <div className="bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
              <span>Step {activeStep + 1} of {goal.steps.length}</span>
              <span className="text-blue-600 font-medium">Breathe deeply</span>
            </div>

            <p className="text-sm sm:text-base font-medium text-stone-900 dark:text-stone-100 leading-relaxed min-h-[50px] flex items-center">
              {isBn ? goal.steps[activeStep]?.textBn : goal.steps[activeStep]?.text}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-stone-700/60 mt-3 text-xs">
              <button
                type="button"
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                className="text-stone-500 hover:text-stone-900 disabled:opacity-40"
              >
                &larr; Previous Step
              </button>
              <button
                type="button"
                disabled={activeStep >= goal.steps.length - 1}
                onClick={() => setActiveStep((s) => Math.min(goal.steps.length - 1, s + 1))}
                className="font-semibold text-blue-700 dark:text-blue-400 hover:underline disabled:opacity-40"
              >
                Next Step &rarr;
              </button>
            </div>
          </div>

          {/* Min Time Warning Notice */}
          {minTimeWarning && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>{minTimeWarning}</span>
            </div>
          )}

          {/* Controls: Pause / Play / Complete */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-3 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title={isRunning ? 'Pause timer' : 'Resume timer'}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setElapsedSeconds(0);
                setIsRunning(true);
              }}
              className="p-3 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-700/20 flex items-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isBn ? 'সম্পন্ন হয়েছে' : 'Mark as Done'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
