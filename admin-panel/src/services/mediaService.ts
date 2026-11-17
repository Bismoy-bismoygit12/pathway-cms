import { apiClient, USE_MOCK_MODE } from './api';
import { INITIAL_MEDIA_LIBRARY } from '@/data/mockCmsData';
import { MediaCategory, MediaItem } from '@/types/cms';

const MEDIA_STORAGE_KEY = 'pathway_admin_media_library_v1';

function readMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : structuredClone(INITIAL_MEDIA_LIBRARY);
  } catch {
    return structuredClone(INITIAL_MEDIA_LIBRARY);
  }
}

function writeMedia(items: MediaItem[]) {
  localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
}

export const mediaService = {
  async list(params: { category?: MediaCategory | 'all'; search?: string } = {}): Promise<MediaItem[]> {
    const { category = 'all', search = '' } = params;
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<MediaItem[]>('/cms/admin/media', { params });
      return data;
    }

    const q = search.trim().toLowerCase();
    return readMedia().filter((item) => {
      const matchesCat = category === 'all' || item.category === category;
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.altTextEn.toLowerCase().includes(q) ||
        item.altTextBn.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  },

  async createAsset(input: Omit<MediaItem, 'id' | 'uploadedAt'>): Promise<MediaItem> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.post<MediaItem>('/cms/admin/media', input);
      return data;
    }

    const item: MediaItem = {
      ...input,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    const list = [item, ...readMedia()];
    writeMedia(list);
    return item;
  },

  async updateAsset(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.patch<MediaItem>(`/cms/admin/media/${id}`, updates);
      return data;
    }

    const list = readMedia();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Media asset not found.');
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    writeMedia(list);
    return updated;
  },

  async deleteAsset(id: string): Promise<void> {
    if (!USE_MOCK_MODE) {
      await apiClient.delete(`/cms/admin/media/${id}`);
      return;
    }
    const list = readMedia().filter((m) => m.id !== id);
    writeMedia(list);
  },
};
