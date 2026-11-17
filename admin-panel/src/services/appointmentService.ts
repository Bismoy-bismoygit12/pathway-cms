import { apiClient, USE_MOCK_MODE } from './api';
import { mockStore } from '@/data/mockStore';
import { AppointmentStatus, ManagedAppointment } from '@/types/admin';

export interface AppointmentStats {
  total: number;
  upcoming: number;
  pending: number;
  completed: number;
  cancelled: number;
}

export interface AppointmentQueryParams {
  search?: string;
  status?: AppointmentStatus | 'all';
  mode?: 'all' | 'online' | 'in_person';
  page?: number;
  pageSize?: number;
}

export const appointmentService = {
  async list(params: AppointmentQueryParams = {}): Promise<{
    items: ManagedAppointment[];
    total: number;
    page: number;
    totalPages: number;
    stats: AppointmentStats;
  }> {
    const { search = '', status = 'all', mode = 'all', page = 1, pageSize = 6 } = params;

    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get('/admin/appointments', { params });
      return data;
    }

    const stats: AppointmentStats = {
      total: mockStore.appointments.length,
      upcoming: mockStore.appointments.filter((a) => a.status === 'confirmed' || a.status === 'pending').length,
      pending: mockStore.appointments.filter((a) => a.status === 'pending').length,
      completed: mockStore.appointments.filter((a) => a.status === 'completed').length,
      cancelled: mockStore.appointments.filter((a) => a.status === 'cancelled' || a.status === 'rejected').length,
    };

    const q = search.trim().toLowerCase();
    const filtered = mockStore.appointments.filter((a) => {
      const matchesStatus = status === 'all' || a.status === status;
      const matchesMode = mode === 'all' || a.mode === mode;
      const matchesSearch =
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.doctorSpecialty.toLowerCase().includes(q);
      return matchesStatus && matchesMode && matchesSearch;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const items = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    return { items, total, page: safePage, totalPages, stats };
  },

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    actorName: string,
    actorRole: string
  ): Promise<ManagedAppointment> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.patch<ManagedAppointment>(`/admin/appointments/${id}/status`, { status });
      return data;
    }

    const idx = mockStore.appointments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Appointment not found.');

    const updated: ManagedAppointment = {
      ...mockStore.appointments[idx],
      status,
      paymentStatus:
        status === 'cancelled' && mockStore.appointments[idx].paymentStatus === 'paid'
          ? 'refunded'
          : mockStore.appointments[idx].paymentStatus,
    };
    mockStore.appointments[idx] = updated;

    mockStore.addActivity({
      category: 'appointment',
      actorName,
      actorRole,
      action: `Updated Appointment to ${status}`,
      target: `${updated.id} (${updated.doctorName})`,
      details: `Patient: ${updated.patientName} • Scheduled: ${updated.scheduledDate} ${updated.scheduledTime}`,
    });

    return updated;
  },
};
