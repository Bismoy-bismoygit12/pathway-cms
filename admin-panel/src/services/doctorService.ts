import { apiClient, USE_MOCK_MODE } from './api';
import { mockStore } from '@/data/mockStore';
import { DoctorApprovalStatus, ManagedAppointment, ManagedDoctor } from '@/types/admin';

export interface DoctorCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const doctorService = {
  async list(params: { status?: DoctorApprovalStatus | 'all'; search?: string } = {}): Promise<{
    items: ManagedDoctor[];
    counts: DoctorCounts;
  }> {
    const { status = 'all', search = '' } = params;

    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<{ items: ManagedDoctor[]; counts: DoctorCounts }>('/admin/doctors', {
        params,
      });
      return data;
    }

    const q = search.trim().toLowerCase();
    const counts: DoctorCounts = {
      all: mockStore.doctors.length,
      pending: mockStore.doctors.filter((d) => d.approvalStatus === 'pending').length,
      approved: mockStore.doctors.filter((d) => d.approvalStatus === 'approved').length,
      rejected: mockStore.doctors.filter((d) => d.approvalStatus === 'rejected').length,
    };

    const items = mockStore.doctors.filter((d) => {
      const matchesStatus = status === 'all' || d.approvalStatus === status;
      const matchesSearch =
        !q ||
        d.fullName.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.specialties.some((s) => s.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });

    return { items, counts };
  },

  async getById(id: string): Promise<{ doctor: ManagedDoctor | null; appointments: ManagedAppointment[] }> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.get<{ doctor: ManagedDoctor; appointments: ManagedAppointment[] }>(
        `/admin/doctors/${id}`
      );
      return data;
    }
    const doctor = mockStore.doctors.find((d) => d.id === id) || null;
    const appointments = doctor ? mockStore.appointments.filter((a) => a.doctorId === doctor.id) : [];
    return { doctor, appointments };
  },

  async reviewApplication(
    id: string,
    decision: 'approved' | 'rejected',
    notes: string,
    actorName: string,
    actorRole: string
  ): Promise<ManagedDoctor> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.patch<ManagedDoctor>(`/admin/doctors/${id}/approval`, {
        approvalStatus: decision,
        reviewNotes: notes,
      });
      return data;
    }

    const idx = mockStore.doctors.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Doctor record not found.');

    const updated: ManagedDoctor = {
      ...mockStore.doctors[idx],
      approvalStatus: decision,
      reviewedAt: new Date().toISOString(),
      reviewNotes: notes.trim() || (decision === 'approved' ? 'Verified and approved.' : 'Application declined.'),
    };
    mockStore.doctors[idx] = updated;

    mockStore.addActivity({
      category: 'doctor_review',
      actorName,
      actorRole,
      action: decision === 'approved' ? 'Approved Doctor Application' : 'Rejected Doctor Application',
      target: `${updated.fullName} (${updated.licenseNumber})`,
      details: updated.reviewNotes || '',
    });

    return updated;
  },

  async toggleAvailabilitySlot(doctorId: string, slotIndex: number): Promise<ManagedDoctor> {
    if (!USE_MOCK_MODE) {
      const { data } = await apiClient.patch<ManagedDoctor>(`/admin/doctors/${doctorId}/availability`, {
        slotIndex,
      });
      return data;
    }

    const idx = mockStore.doctors.findIndex((d) => d.id === doctorId);
    if (idx === -1) throw new Error('Doctor not found.');

    const nextSlots = mockStore.doctors[idx].availabilitySlots.map((slot, i) =>
      i === slotIndex ? { ...slot, booked: !slot.booked } : slot
    );
    const updated = { ...mockStore.doctors[idx], availabilitySlots: nextSlots };
    mockStore.doctors[idx] = updated;
    return updated;
  },
};
