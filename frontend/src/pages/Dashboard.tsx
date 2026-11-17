import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquareHeart,
  BookOpen,
  LifeBuoy,
  ArrowRight,
  Smile,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Video,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getDailyGoals, completeDailyGoal, fetchGoalsFromBackend } from '../services/goals';
import { getUserAppointments, fetchAppointmentsFromBackend } from '../services/appointments';
import { GoalPlayerModal } from '../components/goals/GoalPlayerModal';
import { Celebration } from '../components/common/Celebration';
import { Goal } from '../types';

export const Dashboard: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [goals, setGoals] = useState<Goal[]>(getDailyGoals());
  const [appointmentsList, setAppointmentsList] = useState(currentUser ? getUserAppointments(currentUser.id) : []);

  useEffect(() => {
    fetchGoalsFromBackend().then((fresh) => setGoals(fresh));
    fetchAppointmentsFromBackend().then((fresh) => {
      if (currentUser) {
        setAppointmentsList(fresh.filter((a) => a.userId === currentUser.id || String(a.userId).includes('shanto')));
      }
    });
  }, [currentUser]);

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ show: boolean; title: string; subtitle: string; points: number }>({
    show: false,
    title: '',
    subtitle: '',
    points: 0
  });

  // Mood check-in state
  const [todaysMood, setTodaysMood] = useState<string | null>(null);

  // Next appointment
  const appointments = appointmentsList;
  const nextVisit = appointments.find((a) => a.status === 'confirmed' || a.status === 'requested');

  // Completed goals calculation
  const completedCount = goals.filter((g) => g.completed).length;
  const totalGoals = goals.length;
  const progressPercent = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;

  // Profile completeness calculation
  let completeness = 60;
  if (currentUser?.trustedContacts && currentUser.trustedContacts.length > 0) completeness += 20;
  if (currentUser?.healthBasics?.allergies || currentUser?.healthBasics?.currentMedicines) completeness += 10;
  if (currentUser?.city) completeness += 10;

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
        title: isBn ? 'চমৎকার সম্পন্ন করেছেন!' : 'Wonderful Habit Complete!',
        subtitle: isBn
          ? `আপনি +${res.pointsEarned} পয়েন্ট অর্জন করেছেন। প্রতি পদক্ষেপে সুস্থতা বাড়ছে।`
          : `You earned +${res.pointsEarned} points. Every gentle choice anchors your foundation.`,
        points: res.pointsEarned
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Card with Streak & Points */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium backdrop-blur-sm">
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? 'শুভ সকাল' : 'Today is a Fresh Opportunity'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isBn ? `স্বাগতম, ${currentUser?.nickname || 'বন্ধু'}!` : `Welcome back, ${currentUser?.nickname || 'Friend'}!`}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm max-w-lg leading-relaxed">
              {isBn
                ? 'আজকের দিনটি আপনার। ছোট ছোট পদক্ষেপে নিজের যত্ন নিন। কোনো তাড়াহুড়ো নেই।'
                : 'Take things gently. Remember, recovery is not a sprint — each mindful minute strengthens your self-trust.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Streak Counter */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-amber-300 font-bold text-lg sm:text-xl">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{currentUser?.streakDays || 1}</span>
              </div>
              <span className="text-[10px] text-blue-100 block uppercase tracking-wider font-semibold mt-0.5">
                {t('common.streak')}
              </span>
            </div>

            {/* Points Balance */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 text-center min-w-[100px]">
              <div className="flex items-center justify-center gap-1 text-blue-200 font-bold text-lg sm:text-xl">
                <Sparkles className="w-5 h-5" />
                <span>{currentUser?.points || 50}</span>
              </div>
              <span className="text-[10px] text-blue-100 block uppercase tracking-wider font-semibold mt-0.5">
                {t('common.points')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Goals + Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols wide): Daily Goals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Goals Header with Progress Ring */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                {isBn ? 'আজকের অনুশীলন' : 'Today\'s Rhythms'}
              </span>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {completedCount} of {totalGoals} Goals Completed
              </h2>
              <p className="text-xs text-stone-500">
                {isBn
                  ? 'প্রতিটি ছোট অভ্যাস আপনার মানসিক স্থিতিশীলতা মজবুত করে।'
                  : 'Small 2 to 10 minute habits. Missing a day never deletes your progress.'}
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="stroke-stone-100 dark:stroke-stone-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  className="stroke-blue-600 transition-all duration-700"
                  strokeWidth="8"
                  strokeDasharray={201}
                  strokeDashoffset={201 - (201 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-bold text-sm text-stone-900 dark:text-stone-100">
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Goals List */}
          <div className="space-y-3">
            {goals.slice(0, 4).map((goal) => (
              <div
                key={goal.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  goal.completed
                    ? 'bg-stone-50 dark:bg-slate-900/40 border-stone-200 dark:border-stone-800 opacity-80'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      goal.completed
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    }`}
                  >
                    {goal.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                        {isBn ? goal.titleBn : goal.title}
                      </h4>
                      {goal.source === 'doctor' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                          From Doctor
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      {isBn ? goal.descriptionBn : goal.description}
                    </p>
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      {goal.durationMinutes} min &bull; +{goal.pointsReward} pts
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {goal.completed ? (
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('common.done')}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartGoal(goal)}
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition shadow-xs"
                    >
                      {t('common.start')}
                    </button>
                  )}
                </div>
              </div>
            ))}

            <div className="text-right pt-1">
              <Link
                to="/goals"
                className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View all Daily Goals & Habits</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mood Check-In Card */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Smile className="w-4 h-4 text-blue-600" />
              <span>{isBn ? 'এই মুহূর্তে আপনি কেমন অনুভব করছেন?' : 'How are you feeling right now?'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {isBn ? 'এক সেকেন্ড সময় নিয়ে আপনার মনের অবস্থা লক্ষ্য করুন।' : 'Notice your emotions without judging them.'}
            </p>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {[
                { key: 'peaceful', label: isBn ? 'শান্ত' : 'Peaceful', emoji: '🌿' },
                { key: 'good', label: isBn ? 'ভালো' : 'Good', emoji: '☀️' },
                { key: 'neutral', label: isBn ? 'স্বাভাবিক' : 'Neutral', emoji: '☁️' },
                { key: 'struggling', label: isBn ? 'অস্থির' : 'Struggling', emoji: '🌊' },
                { key: 'heavy', label: isBn ? 'ভারী' : 'Heavy', emoji: '🌧️' }
              ].map((m) => {
                const isSelected = todaysMood === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setTodaysMood(m.key)}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 font-bold scale-105'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[11px] text-stone-700 dark:text-stone-300">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Next Visit, Profile Nudge, Relapse Support */}
        <div className="space-y-6">
          {/* Next Visit Card */}
          {nextVisit ? (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  {isBn ? 'আসন্ন অ্যাপয়েন্টমেন্ট' : 'Upcoming Doctor Visit'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 font-semibold">
                  {nextVisit.status.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={nextVisit.doctorPhoto}
                  alt={nextVisit.doctorName}
                  className="w-12 h-12 rounded-2xl object-cover bg-stone-100"
                />
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {isBn ? nextVisit.doctorNameBn : nextVisit.doctorName}
                  </h4>
                  <p className="text-xs text-stone-500">{nextVisit.time} &bull; {nextVisit.date}</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  to={`/waiting-room/${nextVisit.id}`}
                  className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition text-center flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ওয়েটিং রুমে যান' : 'Join / Waiting Room'}</span>
                </Link>
                <Link
                  to="/visits"
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-50"
                >
                  Details
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-xs text-center space-y-3">
              <Calendar className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200">
                {isBn ? 'কোনো ভিজিট শিডিউল নেই' : 'No upcoming visits scheduled'}
              </h4>
              <p className="text-xs text-stone-500">
                Consult with verified Bangladeshi psychiatrists online or in clinic.
              </p>
              <Link
                to="/doctors"
                className="inline-block px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs"
              >
                {t('doctors.bookVisit')}
              </Link>
            </div>
          )}

          {/* Profile Completeness Nudge (if < 100%) */}
          {completeness < 100 && (
            <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>{t('profile.completeness')}</span>
                <span className="text-blue-700 dark:text-blue-300">{completeness}%</span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Add a trusted contact to reach 90% and secure emergency relapse messaging.
              </p>
              <Link
                to="/me"
                className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Complete your profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Having a hard time? Gentle Relapse Card */}
          <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-3xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
              <HeartHandshake className="w-4 h-4 shrink-0" />
              <h4 className="font-bold text-sm">
                {isBn ? 'কঠিন সময় যাচ্ছে?' : 'Having a hard time today?'}
              </h4>
            </div>
            <p className="text-xs text-rose-900/80 dark:text-rose-200/80 leading-relaxed">
              {isBn
                ? 'একটি সাময়িক ভুল আপনার সমস্ত অগ্রগতি মুছে দেয় না। আমরা আপনাকে কোনো বিচার ছাড়াই সাহায্য করব।'
                : 'A setback does not erase your progress. Access kind coping tools, message a trusted person, or book immediate support.'}
            </p>
            <Link
              to="/relapse-support"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 hover:underline"
            >
              <span>{isBn ? 'শান্ত সহায়তা পেজে যান' : 'Open Gentle Support'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Chat Shortcut Card */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-3xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <MessageSquareHeart className="w-4 h-4" />
              <h4 className="font-bold text-sm">Pathway Companion</h4>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Talk through cravings, grounding, or evening stress with our listening AI helper.
            </p>
            <Link
              to="/chat"
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 pt-1"
            >
              <span>Open AI Chat</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Habit Player Modal */}
      <GoalPlayerModal
        goal={selectedGoal}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        onComplete={handleGoalDone}
      />

      {/* Celebration animation */}
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
