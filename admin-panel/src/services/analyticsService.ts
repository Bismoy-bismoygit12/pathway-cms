import { apiClient, USE_MOCK_MODE } from './api';
import { GROWTH_SERIES } from '@/data/mockPlatformData';
import { mockStore } from '@/data/mockStore';
import { GrowthDataPoint, GrowthTimeframe } from '@/types/admin';

export interface PlatformAnalyticsBundle {
  growthSeries: GrowthDataPoint[];
  backendMetrics: {
    specialtyDistribution: { name: string; doctors: number }[];
    appointmentModes: { mode: string; count: number }[];
    appointmentStatusBreakdown: { status: string; count: number }[];
    paidRevenueBDT: number;
  };
  extendedMockMetrics: {
    weeklyActiveRetentionPct: number;
    avgDailyGoalCompletionPct: number;
    avgMoodScoreOutOf5: number;
    bilingualTrafficSplit: { language: string; sharePct: number }[];
    habitEngagementTrend: { day: string; breathing: number; hydration: number; sleep: number }[];
  };
}

export const analyticsService = {
  async getAnalytics(timeframe: GrowthTimeframe): Promise<PlatformAnalyticsBundle> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<PlatformAnalyticsBundle>('/admin/analytics', {
        params: { timeframe },
      });
      return data;
    }

    const specialtyMap = new Map<string, number>();
    mockStore.doctors
      .filter((d) => d.approvalStatus === 'approved')
      .forEach((d) => {
        d.specialties.forEach((s) => {
          specialtyMap.set(s, (specialtyMap.get(s) || 0) + 1);
        });
      });

    const onlineCount = mockStore.appointments.filter((a) => a.mode === 'online').length;
    const inPersonCount = mockStore.appointments.filter((a) => a.mode === 'in_person').length;
    const paidRevenueBDT = mockStore.appointments
      .filter((a) => a.paymentStatus === 'paid')
      .reduce((acc, cur) => acc + cur.feeBDT, 0);

    const statusCounts: Record<string, number> = {};
    mockStore.appointments.forEach((a) => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    return {
      growthSeries: GROWTH_SERIES[timeframe],
      backendMetrics: {
        specialtyDistribution: Array.from(specialtyMap.entries())
          .map(([name, doctors]) => ({ name, doctors }))
          .sort((a, b) => b.doctors - a.doctors)
          .slice(0, 6),
        appointmentModes: [
          { mode: 'Online Video', count: onlineCount },
          { mode: 'In-Person Clinic', count: inPersonCount },
        ],
        appointmentStatusBreakdown: Object.entries(statusCounts).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count,
        })),
        paidRevenueBDT,
      },
      extendedMockMetrics: {
        weeklyActiveRetentionPct: 74.8,
        avgDailyGoalCompletionPct: 68.4,
        avgMoodScoreOutOf5: 3.9,
        bilingualTrafficSplit: [
          { language: 'Bangla (বাংলা)', sharePct: 62 },
          { language: 'English', sharePct: 38 },
        ],
        habitEngagementTrend: [
          { day: 'Mon', breathing: 142, hydration: 198, sleep: 120 },
          { day: 'Tue', breathing: 158, hydration: 210, sleep: 135 },
          { day: 'Wed', breathing: 166, hydration: 205, sleep: 144 },
          { day: 'Thu', breathing: 179, hydration: 224, sleep: 152 },
          { day: 'Fri', breathing: 164, hydration: 215, sleep: 148 },
          { day: 'Sat', breathing: 195, hydration: 242, sleep: 171 },
          { day: 'Sun', breathing: 208, hydration: 256, sleep: 184 },
        ],
      },
    };
  },
};
