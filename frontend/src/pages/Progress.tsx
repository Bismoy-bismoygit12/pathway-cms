import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Printer,
  Calendar,
  Flame,
  Sparkles,
  Heart,
  Smile,
  AlertCircle,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Progress: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Check-in form states
  const [checkInMood, setCheckInMood] = useState('good');
  const [cravingLevel, setCravingLevel] = useState(2);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [checkInSaved, setCheckInSaved] = useState(false);

  // Mock chart data for weekly and monthly trends
  const weeklyData = [
    { day: 'Mon', goalsCompleted: 3, moodScore: 8, cravingScore: 3 },
    { day: 'Tue', goalsCompleted: 4, moodScore: 7, cravingScore: 2 },
    { day: 'Wed', goalsCompleted: 3, moodScore: 6, cravingScore: 4 },
    { day: 'Thu', goalsCompleted: 5, moodScore: 8, cravingScore: 2 },
    { day: 'Fri', goalsCompleted: 4, moodScore: 9, cravingScore: 1 },
    { day: 'Sat', goalsCompleted: 4, moodScore: 8, cravingScore: 2 },
    { day: 'Sun', goalsCompleted: 5, moodScore: 9, cravingScore: 1 }
  ];

  const monthlyData = [
    { day: 'W1', goalsCompleted: 24, moodScore: 7.2, cravingScore: 3.5 },
    { day: 'W2', goalsCompleted: 28, moodScore: 7.8, cravingScore: 2.8 },
    { day: 'W3', goalsCompleted: 31, moodScore: 8.4, cravingScore: 2.0 },
    { day: 'W4', goalsCompleted: 34, moodScore: 8.9, cravingScore: 1.4 }
  ];

  const chartData = timeRange === 'weekly' ? weeklyData : monthlyData;

  const handlePrint = () => {
    window.print();
  };

  const handleSaveCheckIn = () => {
    setCheckInSaved(true);
    setTimeout(() => {
      setCheckInSaved(false);
      setShowCheckInModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto print:max-w-none print:p-0">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {t('nav.progress')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Gentle tracking of your daily consistency, mood patterns, and craving reduction.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print shrink-0">
          <button
            onClick={() => setShowCheckInModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100/60 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Daily Check-In</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 transition flex items-center gap-1.5"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Gentle Sobriety & Anchor Milestones Card */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-3xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
              Ongoing Anchored Days
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentUser?.streakDays || 8} Days of Self-Care
            </div>
            <p className="text-xs text-blue-100 max-w-md pt-1 leading-relaxed">
              Every day you honor your body and mind is a quiet victory. Milestones reflect your dedication to peace.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20">
              <span className="text-xs font-bold text-amber-300">Next Anchor</span>
              <div className="text-lg font-extrabold">14 Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range Toggle */}
      <div className="flex items-center gap-2 p-1 bg-stone-100 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-semibold w-fit no-print">
        <button
          onClick={() => setTimeRange('weekly')}
          className={`px-4 py-1.5 rounded-xl transition ${
            timeRange === 'weekly' ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs' : 'text-stone-500'
          }`}
        >
          Weekly View
        </button>
        <button
          onClick={() => setTimeRange('monthly')}
          className={`px-4 py-1.5 rounded-xl transition ${
            timeRange === 'monthly' ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs' : 'text-stone-500'
          }`}
        >
          Monthly View
        </button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
        {/* Chart 1: Daily Habits Completed */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4 print-card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Daily Habits Completed
            </h3>
            <span className="text-xs text-blue-600 font-semibold">+18% vs last week</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" stroke="#a8a29e" fontSize={11} tickLine={false} />
                <YAxis stroke="#a8a29e" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Bar dataKey="goalsCompleted" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Mood vs Cravings Correlation */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4 print-card">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Mood Stability & Craving Drops
            </h3>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Mood
              </span>
              <span className="flex items-center gap-1 text-rose-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Craving Intensity
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="day" stroke="#a8a29e" fontSize={11} tickLine={false} />
                <YAxis stroke="#a8a29e" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff' }}
                />
                <Area type="monotone" dataKey="moodScore" stroke="#2563eb" fill="#dbeafe" fillOpacity={0.6} />
                <Area type="monotone" dataKey="cravingScore" stroke="#f43f5e" fill="#ffe4e6" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-5 animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Daily Wellness & Craving Check-In
            </h3>

            {checkInSaved ? (
              <div className="p-6 text-center text-blue-700 font-bold space-y-2">
                <Smile className="w-10 h-10 mx-auto text-blue-600" />
                <p>Saved kindly to your private log!</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Craving intensity slider (0 to 10) */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>Urge / Craving Level (0 to 10):</span>
                    <span className="font-bold text-blue-700">{cravingLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={cravingLevel}
                    onChange={(e) => setCravingLevel(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>0 (Peaceful)</span>
                    <span>5 (Noticeable)</span>
                    <span>10 (Intense)</span>
                  </div>
                </div>

                {/* Triggers noticed today */}
                <div className="space-y-1.5">
                  <label className="font-semibold block">Triggers noticed today:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Fatigue', 'Stress at work', 'Loneliness', 'Old contacts', 'Difficulty sleeping'].map((trig) => {
                      const sel = selectedTriggers.includes(trig);
                      return (
                        <button
                          key={trig}
                          type="button"
                          onClick={() =>
                            setSelectedTriggers((prev) =>
                              sel ? prev.filter((i) => i !== trig) : [...prev, trig]
                            )
                          }
                          className={`px-2.5 py-1 rounded-full transition ${
                            sel ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {trig}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    onClick={() => setShowCheckInModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCheckIn}
                    className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white font-semibold"
                  >
                    Save Check-In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
