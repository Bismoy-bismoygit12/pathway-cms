import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Stethoscope,
  Plus,
  Play,
  RotateCcw,
  Heart,
  Smile
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getDailyGoals, completeDailyGoal, saveDailyGoals } from '../services/goals';
import { Goal } from '../types';
import { GoalPlayerModal } from '../components/goals/GoalPlayerModal';
import { Celebration } from '../components/common/Celebration';

export const DailyGoals: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [goals, setGoals] = useState<Goal[]>(getDailyGoals());
  const [activeTab, setActiveTab] = useState<'suggested' | 'choice' | 'doctor'>('suggested');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ show: boolean; title: string; subtitle: string; points: number }>({
    show: false,
    title: '',
    subtitle: '',
    points: 0
  });

  const filteredGoals = goals.filter((g) => g.source === activeTab);

  const handleStartGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsPlayerOpen(true);
  };

  const handleGoalDone = (goal: Goal) => {
    const res = completeDailyGoal(goal.id);
    if (res.success) {
      setGoals(getDailyGoals());
      if (currentUser) {
        updateCurrentUser({
          points: (currentUser.points || 0) + res.pointsEarned
        });
      }
      setCelebrationData({
        show: true,
        title: isBn ? 'লক্ষ্য সম্পন্ন হয়েছে!' : 'Habit Complete!',
        subtitle: isBn
          ? `আপনি +${res.pointsEarned} পয়েন্ট পেয়েছেন। নিজের প্রতি মমতা রাখুন।`
          : `You earned +${res.pointsEarned} points. Great job taking care of yourself today.`,
        points: res.pointsEarned
      });
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Title & Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          {t('goals.title')}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
          {t('goals.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('suggested')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeTab === 'suggested'
              ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {t('goals.tabs.suggested')}
        </button>

        <button
          onClick={() => setActiveTab('choice')}
          className={`flex-1 py-2.5 rounded-xl transition ${
            activeTab === 'choice'
              ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          {t('goals.tabs.choices')}
        </button>

        <button
          onClick={() => setActiveTab('doctor')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'doctor'
              ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t('goals.tabs.doctor')}</span>
        </button>
      </div>

      {/* Encouraging Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3 text-xs text-blue-800 dark:text-blue-200">
        <Heart className="w-4 h-4 text-rose-500 shrink-0" />
        <span>
          {isBn
            ? 'মনে রাখবেন: কোনো দিন মিস হলে তা কখনো আপনার অতীত অর্জন মুছে দেয় না। আজ এখান থেকেই শুরু করুন।'
            : 'Remember: Missing a day never erases your progress. Be proud of taking time for yourself today.'}
        </span>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center space-y-3">
            <Smile className="w-8 h-8 text-stone-400 mx-auto" />
            <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
              {isBn ? 'এই ক্যাটাগরিতে কোনো লক্ষ্য নেই' : 'No habits found in this section yet'}
            </h4>
            <p className="text-xs text-stone-500">
              {activeTab === 'doctor'
                ? 'Goals suggested by your psychiatrist after a visit will appear right here.'
                : 'Explore other tabs or complete your current daily habits.'}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                goal.completed
                  ? 'bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-stone-800 opacity-80'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    goal.completed
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  }`}
                >
                  {goal.completed ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      {isBn ? goal.titleBn : goal.title}
                    </h3>
                    {goal.doctorName && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                        {goal.doctorName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-xl">
                    {isBn ? goal.descriptionBn : goal.description}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                    <span>{goal.durationMinutes} minutes</span>
                    <span>&bull;</span>
                    <span className="text-blue-700 dark:text-blue-400 font-semibold">+{goal.pointsReward} Points</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 pt-2 sm:pt-0">
                {goal.completed ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleStartGoal(goal)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{t('goals.startGoal')}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Goal Player Modal */}
      <GoalPlayerModal
        goal={selectedGoal}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        onComplete={handleGoalDone}
      />

      {/* Celebration */}
      <Celebration
        show={celebrationData.show}
        title={celebrationData.title}
        subtitle={celebrationData.subtitle}
        points={celebrationData.points}
        onClose={() => setCelebrationData((c) => ({ ...c, show: false }))}
      />
    </div>
  );
};
