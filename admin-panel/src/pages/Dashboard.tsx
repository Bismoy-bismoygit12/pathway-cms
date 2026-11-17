import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Stethoscope,
  CalendarClock,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { dashboardService, DashboardSummary } from '@/services/dashboardService';
import { GrowthDataPoint, GrowthTimeframe } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ActivityCategoryBadge } from '@/components/common/StatusBadges';
import { formatDateTime } from '@/lib/utils';

const STAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'total-users': Users,
  'active-users': UserCheck,
  'pending-doctors': Stethoscope,
  'total-appointments': CalendarClock,
};

const STAT_ACCENTS: Record<string, string> = {
  'total-users': 'bg-blue-50 text-blue-700',
  'active-users': 'bg-teal-50 text-teal-700',
  'pending-doctors': 'bg-amber-50 text-amber-700',
  'total-appointments': 'bg-indigo-50 text-indigo-700',
};

const TIMEFRAMES: { id: GrowthTimeframe; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [timeframe, setTimeframe] = useState<GrowthTimeframe>('monthly');
  const [growthData, setGrowthData] = useState<GrowthDataPoint[]>([]);

  useEffect(() => {
    dashboardService.getSummary().then(setSummary);
  }, []);

  useEffect(() => {
    dashboardService.getGrowthAnalytics(timeframe).then(setGrowthData);
  }, [timeframe]);

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Platform Overview</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor user growth, psychiatrist onboarding, appointments, and recent CMS & platform activity.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            to="/website/homepage"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <span>Website CMS</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
          <Link
            to="/doctors?status=pending"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-medium transition shadow-xs"
          >
            <span>Review Pending Doctors</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {(summary?.stats || []).map((stat) => {
          const Icon = STAT_ICONS[stat.id] || Users;
          const accent = STAT_ACCENTS[stat.id] || 'bg-blue-50 text-blue-700';

          return (
            <Card key={stat.id} className="hover:border-blue-300 transition-colors">
              <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-medium text-slate-500 truncate">{stat.label}</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                      {stat.value.toLocaleString()}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-semibold text-[11px] ${
                        stat.trend === 'up'
                          ? 'bg-emerald-50 text-emerald-700'
                          : stat.trend === 'down'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {stat.trend === 'neutral' && <Minus className="w-3 h-3" />}
                      {stat.growthPercent > 0 ? `+${stat.growthPercent}%` : `${stat.growthPercent}%`}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">{stat.periodLabel}</span>
                  </div>

                  <Link
                    to={stat.linkTo}
                    className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-0.5 shrink-0"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts + Recent Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* User Growth Analytics */}
        <Card className="xl:col-span-7">
          <CardHeader className="flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <CardTitle>User Growth Analytics</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                New registrations compared against previous period ({timeframe})
              </p>
            </div>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    timeframe === tf.id
                      ? 'bg-white text-blue-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-[300px] sm:h-[330px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} margin={{ top: 10, right: 12, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashCurrentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dashPrevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.14} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="current"
                    name="Current Period Registrations"
                    stroke="#1d4ed8"
                    strokeWidth={2.5}
                    fill="url(#dashCurrentGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    name="Previous Period"
                    stroke="#0d9488"
                    strokeWidth={2}
                    strokeDasharray="5 4"
                    fill="url(#dashPrevGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities Feed */}
        <Card className="xl:col-span-5 flex flex-col">
          <CardHeader>
            <div>
              <CardTitle>Recent Activities</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Live session & mock platform events</p>
            </div>
            <Link
              to="/activity-logs"
              className="text-xs font-semibold text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 flex-1 divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
            {(summary?.recentActivities || []).map((act) => (
              <div key={act.id} className="px-5 py-3.5 hover:bg-slate-50/70 transition-colors space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <ActivityCategoryBadge category={act.category} />
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(act.timestamp)}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-900">
                  {act.action} — <span className="text-blue-700">{act.target}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{act.details}</p>
                <div className="text-[10px] text-slate-400">
                  By {act.actorName} ({act.actorRole})
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
