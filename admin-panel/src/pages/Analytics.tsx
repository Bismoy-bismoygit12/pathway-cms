import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Database, FlaskConical, TrendingUp, Languages, HeartPulse, Banknote } from 'lucide-react';
import { analyticsService, PlatformAnalyticsBundle } from '@/services/analyticsService';
import { GrowthTimeframe } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const TIMEFRAMES: { id: GrowthTimeframe; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

export const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<GrowthTimeframe>('monthly');
  const [data, setData] = useState<PlatformAnalyticsBundle | null>(null);

  useEffect(() => {
    analyticsService.getAnalytics(timeframe).then(setData);
  }, [timeframe]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Platform Analytics</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Distinguishes metrics backed by existing MySQL tables from extended telemetry mock data.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Source Legend Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs">
          <Database className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-blue-950">MySQL-Aligned Metrics</div>
            <div className="text-blue-800">
              Backed by existing <code className="font-mono">users</code>, <code className="font-mono">doctor_profiles</code>, <code className="font-mono">appointments</code>, and <code className="font-mono">payments</code> tables.
            </div>
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-3 text-xs">
          <FlaskConical className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-teal-950">Extended Demo / Mock Telemetry</div>
            <div className="text-teal-800">
              Habit completions, mood averages, and language traffic currently use local demo models until sync endpoints are added.
            </div>
          </div>
        </div>
      </div>

      {/* Top KPI highlights */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Paid Consultation Volume</span>
                <Banknote className="w-4 h-4 text-blue-700" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                ৳{data.backendMetrics.paidRevenueBDT.toLocaleString()}
              </div>
              <Badge variant="blue">MySQL payments table</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Weekly Active Retention</span>
                <TrendingUp className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {data.extendedMockMetrics.weeklyActiveRetentionPct}%
              </div>
              <Badge variant="teal">Mock Telemetry</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Avg Daily Goal Completion</span>
                <HeartPulse className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {data.extendedMockMetrics.avgDailyGoalCompletionPct}%
              </div>
              <Badge variant="teal">Mock Telemetry</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Language Split (BN / EN)</span>
                <Languages className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {data.extendedMockMetrics.bilingualTrafficSplit[0].sharePct}% /{' '}
                {data.extendedMockMetrics.bilingualTrafficSplit[1].sharePct}%
              </div>
              <Badge variant="teal">Mock Telemetry</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      {data && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Registrations, Active Users & Appointments</CardTitle>
                <p className="text-xs text-slate-500">Timeframe: {timeframe}</p>
              </div>
              <Badge variant="blue">MySQL-Aligned</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.growthSeries} margin={{ top: 10, right: 10, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="current" name="New Registrations" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="appointments" name="Appointments" fill="#0d9488" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Daily Micro-Habit Engagement Trend</CardTitle>
                <p className="text-xs text-slate-500">Completed self-care goals across categories</p>
              </div>
              <Badge variant="teal">Mock Telemetry</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.extendedMockMetrics.habitEngagementTrend}
                    margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="breathing" name="Box Breathing" stroke="#1d4ed8" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="hydration" name="Hydration Reset" stroke="#0d9488" strokeWidth={2.5} />
                    <Line type="monotone" dataKey="sleep" name="Sleep Hygiene" stroke="#6366f1" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approved Doctors by Specialty</CardTitle>
              <Badge variant="blue">MySQL-Aligned</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data.backendMetrics.specialtyDistribution}
                    margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={118}
                      tick={{ fontSize: 10, fill: '#334155' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                    <Bar dataKey="doctors" name="Verified Psychiatrists" fill="#1d4ed8" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Breakdown by Status & Mode</CardTitle>
              <Badge variant="blue">MySQL-Aligned</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {data.backendMetrics.appointmentModes.map((m) => (
                  <div key={m.mode} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-xs text-slate-500">{m.mode}</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">{m.count} bookings</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {data.backendMetrics.appointmentStatusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0">
                    <span className="font-medium text-slate-700">{s.status}</span>
                    <span className="font-bold text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
