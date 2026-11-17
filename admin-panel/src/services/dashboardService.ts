import { apiClient, USE_MOCK_MODE } from './api';
import { GROWTH_SERIES } from '@/data/mockPlatformData';
import { mockStore } from '@/data/mockStore';
import {
  ActivityLogItem,
  DashboardStatCard,
  GrowthDataPoint,
  GrowthTimeframe,
} from '@/types/admin';

export interface DashboardSummary {
  stats: DashboardStatCard[];
  recentActivities: ActivityLogItem[];
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<DashboardSummary>('/admin/dashboard');
      return data;
    }

    const totalUsers = mockStore.users.length + 1410;
    const activeUsers = mockStore.users.filter((u) => u.status === 'active').length + 958;
    const pendingDoctors = mockStore.doctors.filter((d) => d.approvalStatus === 'pending').length;
    const totalAppointments = mockStore.appointments.length + 490;

    return {
      stats: [
        {
          id: 'total-users',
          label: 'Total Registered Users',
          value: totalUsers,
          previousValue: 1218,
          growthPercent: 16.6,
          trend: 'up',
          linkTo: '/users',
          periodLabel: 'vs. 1,218 last month',
        },
        {
          id: 'active-users',
          label: 'Currently Active Users',
          value: activeUsers,
          previousValue: 846,
          growthPercent: 13.9,
          trend: 'up',
          linkTo: '/users?status=active',
          periodLabel: 'vs. 846 last month',
        },
        {
          id: 'pending-doctors',
          label: 'Pending Doctor Approvals',
          value: pendingDoctors,
          previousValue: 4,
          growthPercent: pendingDoctors > 0 ? -50.0 : -100,
          trend: pendingDoctors > 0 ? 'neutral' : 'down',
          linkTo: '/doctors?status=pending',
          periodLabel: '4 reviewed last 7 days',
        },
        {
          id: 'total-appointments',
          label: 'Total Appointments',
          value: totalAppointments,
          previousValue: 412,
          growthPercent: 20.9,
          trend: 'up',
          linkTo: '/appointments',
          periodLabel: 'vs. 412 last month',
        },
      ],
      recentActivities: mockStore.activities.slice(0, 8),
    };
  },

  async getGrowthAnalytics(timeframe: GrowthTimeframe): Promise<GrowthDataPoint[]> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<GrowthDataPoint[]>('/admin/analytics/growth', {
        params: { timeframe },
      });
      return data;
    }
    return GROWTH_SERIES[timeframe];
  },
};
