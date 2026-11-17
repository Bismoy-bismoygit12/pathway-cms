import { apiClient, USE_MOCK_MODE } from './api';
import { mockStore } from '@/data/mockStore';
import { ManagedUser, ManagedUserStatus } from '@/types/admin';

export interface UserQueryParams {
  search?: string;
  status?: ManagedUserStatus | 'all';
  page?: number;
  pageSize?: number;
}

export interface PaginatedUsersResponse {
  items: ManagedUser[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const userService = {
  async list(params: UserQueryParams = {}): Promise<PaginatedUsersResponse> {
    const { search = '', status = 'all', page = 1, pageSize = 6 } = params;

    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<PaginatedUsersResponse>('/admin/users', { params });
      return data;
    }

    const q = search.trim().toLowerCase();
    const filtered = mockStore.users.filter((u) => {
      const matchesStatus = status === 'all' || u.status === status;
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.nickname.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        String(u.numericId).includes(q);
      return matchesStatus && matchesSearch;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    return { items, total, page: safePage, pageSize, totalPages };
  },

  async getById(id: string): Promise<ManagedUser | null> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<ManagedUser>(`/admin/users/${id}`);
      return data;
    }
    return mockStore.users.find((u) => u.id === id) || null;
  },

  async updateStatus(
    id: string,
    status: ManagedUserStatus,
    actorName: string,
    actorRole: string,
    reason?: string
  ): Promise<ManagedUser> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.patch<ManagedUser>(`/admin/users/${id}/status`, { status, reason });
      return data;
    }

    const idx = mockStore.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User not found.');

    const updated: ManagedUser = {
      ...mockStore.users[idx],
      status,
      isActive: status === 'active',
    };
    mockStore.users[idx] = updated;

    mockStore.addActivity({
      category: 'account_change',
      actorName,
      actorRole,
      action: `Changed User Status to ${status.replace('_', ' ')}`,
      target: `${updated.fullName} (${updated.id})`,
      details: reason || `Account status updated by administrator.`,
    });

    return updated;
  },

  async logSensitiveRecoveryView(
    userId: string,
    userName: string,
    actorName: string,
    actorRole: string,
    purpose: string
  ): Promise<void> {
    if (!USE_MOCK_MODE) {
      await apiClient.post(`/admin/users/${userId}/recovery-access-log`, { purpose });
      return;
    }
    mockStore.addActivity({
      category: 'admin_action',
      actorName,
      actorRole,
      action: 'Viewed Sensitive Recovery Records',
      target: `${userName} (${userId})`,
      details: `Authorized purpose: ${purpose}`,
    });
  },
};
