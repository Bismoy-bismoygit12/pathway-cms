import { apiClient, USE_MOCK_MODE } from './api';
import { mockStore } from '@/data/mockStore';
import { ActivityCategory, ActivityLogItem } from '@/types/admin';

export const activityService = {
  async list(params: {
    category?: ActivityCategory | 'all';
    source?: 'all' | 'mock' | 'live';
    search?: string;
  } = {}): Promise<ActivityLogItem[]> {
    const { category = 'all', source = 'all', search = '' } = params;

    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<ActivityLogItem[]>('/admin/activity-logs', { params });
      return data;
    }

    const q = search.trim().toLowerCase();
    return mockStore.activities.filter((item) => {
      const matchesCat = category === 'all' || item.category === category;
      const matchesSource = source === 'all' || item.source === source;
      const matchesSearch =
        !q ||
        item.actorName.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.target.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q);
      return matchesCat && matchesSource && matchesSearch;
    });
  },
};
