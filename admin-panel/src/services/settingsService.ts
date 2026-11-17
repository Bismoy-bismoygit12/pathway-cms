import { apiClient, USE_MOCK_MODE } from './api';
import { mockStore } from '@/data/mockStore';
import { PlatformSettings } from '@/types/admin';

export const settingsService = {
  async getSettings(): Promise<PlatformSettings> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<PlatformSettings>('/admin/settings');
      return data;
    }
    return structuredClone(mockStore.settings);
  },

  async updateSettings(
    updates: Partial<PlatformSettings>,
    actorName: string,
    actorRole: string
  ): Promise<PlatformSettings> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.put<PlatformSettings>('/admin/settings', updates);
      return data;
    }

    mockStore.settings = { ...mockStore.settings, ...updates };
    mockStore.addActivity({
      category: 'admin_action',
      actorName,
      actorRole,
      action: 'Updated Platform Settings',
      target: 'Admin Console Configuration',
      details: `Updated settings fields: ${Object.keys(updates).join(', ')}`,
    });
    return structuredClone(mockStore.settings);
  },
};
