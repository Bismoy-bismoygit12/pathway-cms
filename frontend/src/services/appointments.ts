import { Appointment, AppointmentStatus, Goal } from '../types';
import { markSlotAsBooked, markSlotAsFree } from './doctors';
import { api } from './api';

const APPOINTMENTS_KEY = 'pathway_user_appointments';

function getSeedAppointments(): Appointment[] {
  return [
    {
      id: 'apt-1',
      userId: 'user-shanto',
      doctorId: '1',
      doctorName: 'Prof. Dr. Tanvir Ahmed',
      doctorNameBn: 'অধ্যাপক ডাঃ তানভীর আহমেদ',
      doctorTitle: 'Consultant Psychiatrist',
      doctorHospital: 'National Institute of Mental Health',
      doctorPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
      date: 'Tomorrow',
      time: '04:30 PM',
      mode: 'online',
      status: 'confirmed',
      feeBDT: 2000,
      paymentMethod: 'bkash',
      paymentStatus: 'paid',
      reason: 'General check-in & review of sleep pattern',
      concernsList: ['Sleep problems', 'Cravings in evening'],
      sharedData: {
        profile: true,
        goals: true,
        moods: true,
        healthBasics: false,
        reports: true
      },
      createdAt: '2026-11-09T14:20:00Z'
    }
  ];
}

export function getAllStoredAppointments(): Appointment[] {
  const raw = localStorage.getItem(APPOINTMENTS_KEY);
  if (!raw) {
    const seeds = getSeedAppointments();
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(seeds));
    return seeds;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return getSeedAppointments();
  }
}

export function saveAllAppointments(list: Appointment[]) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list));
}

export async function fetchAppointmentsFromBackend(): Promise<Appointment[]> {
  try {
    const res = await api.get('/appointments/my');
    if (res.success && res.data?.appointments && Array.isArray(res.data.appointments)) {
      saveAllAppointments(res.data.appointments);
      return res.data.appointments;
    }
  } catch (e) {
    console.warn('Backend appointments fetch unreachable, using cache', e);
  }
  return getAllStoredAppointments();
}

export function getUserAppointments(userId: string): Appointment[] {
  const all = getAllStoredAppointments();
  return all.filter((a) => a.userId === userId || a.userId === String(userId) || String(a.userId).includes('shanto'));
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string; appointment?: Appointment }> {
  // Attempt Backend API first
  try {
    const rawDocId = String(data.doctorId).replace('dr-custom-', '').replace('dr-tanvir-ahmed', '1').replace('dr-nusrat-jahan', '2').replace('dr-kamrul-hasan', '3').replace('dr-', '');
    const res = await api.post('/appointments', {
      doctorId: rawDocId || '1',
      date: data.date,
      time: data.time,
      mode: data.mode,
      concerns: data.reason || data.concernsList?.join(', ') || 'Consultation',
      consentToShareData: data.sharedData?.profile ? 1 : 0,
      paymentMethod: data.paymentMethod || 'bkash',
      feeBDT: data.feeBDT || 1500
    });

    if (res.success && res.data?.appointment) {
      const apt = res.data.appointment;
      const all = getAllStoredAppointments();
      all.unshift(apt);
      saveAllAppointments(all);
      markSlotAsBooked(data.doctorId, data.date, data.time);
      return { success: true, appointment: apt };
    } else if (res.error) {
      return { success: false, error: res.error };
    }
  } catch (e) {
    console.warn('Backend create appointment unreachable, using local fallback', e);
  }

  // Local fallback
  const all = getAllStoredAppointments();
  const isDoctorSlotTaken = all.some(
    (a) =>
      a.doctorId === data.doctorId &&
      a.date === data.date &&
      a.time === data.time &&
      (a.status === 'requested' || a.status === 'confirmed')
  );

  if (isDoctorSlotTaken) {
    return {
      success: false,
      error: 'This doctor slot was just taken. Please choose another comfortable time.'
    };
  }

  const newAppointment: Appointment = {
    ...data,
    id: `apt-${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  all.unshift(newAppointment);
  saveAllAppointments(all);
  markSlotAsBooked(data.doctorId, data.date, data.time);

  return { success: true, appointment: newAppointment };
}

export async function cancelAppointment(appointmentId: string, reason?: string): Promise<{ success: boolean; appointment?: Appointment }> {
  try {
    const rawId = String(appointmentId).replace('apt-', '');
    await api.patch(`/appointments/${rawId}/status`, { status: 'cancelled' });
  } catch (e) {
    console.warn('Backend appointment cancel unreachable, updating locally', e);
  }

  const all = getAllStoredAppointments();
  const index = all.findIndex((a) => a.id === appointmentId || String(a.id) === String(appointmentId));
  if (index === -1) return { success: false };

  const apt = all[index];
  apt.status = 'cancelled';
  markSlotAsFree(apt.doctorId, apt.date, apt.time);

  all[index] = apt;
  saveAllAppointments(all);

  return { success: true, appointment: apt };
}

export function rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): { success: boolean; error?: string; appointment?: Appointment } {
  const all = getAllStoredAppointments();
  const index = all.findIndex((a) => a.id === appointmentId);
  if (index === -1) return { success: false, error: 'Appointment not found' };

  const apt = all[index];
  markSlotAsFree(apt.doctorId, apt.date, apt.time);

  apt.date = newDate;
  apt.time = newTime;
  apt.status = 'rescheduled';

  markSlotAsBooked(apt.doctorId, newDate, newTime);
  all[index] = apt;
  saveAllAppointments(all);

  return { success: true, appointment: apt };
}

export function getAppointmentById(id: string): Appointment | undefined {
  const all = getAllStoredAppointments();
  return all.find((a) => a.id === id || String(a.id) === String(id));
}

export function updateAppointment(appointmentId: string, updates: Partial<Appointment>): boolean {
  const all = getAllStoredAppointments();
  const index = all.findIndex((a) => a.id === appointmentId || String(a.id) === String(appointmentId));
  if (index === -1) return false;

  all[index] = { ...all[index], ...updates };
  saveAllAppointments(all);
  return true;
}

export function downloadAppointmentIcs(apt: Appointment): void {
  const cleanDate = apt.date.replace(/[^0-9]/g, '') || new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pathway Healthcare//EN',
    'BEGIN:VEVENT',
    `SUMMARY:Consultation with ${apt.doctorName}`,
    `DESCRIPTION:Pathway Healthcare Session - Mode: ${apt.mode}. Reason: ${apt.reason || 'Check-in'}`,
    `DTSTART:${cleanDate}T103000Z`,
    `DTEND:${cleanDate}T110000Z`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pathway-appointment-${apt.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function rateAndReviewAppointment(appointmentId: string, rating: number, feedback: string): boolean {
  const all = getAllStoredAppointments();
  const index = all.findIndex((a) => a.id === appointmentId);
  if (index === -1) return false;

  all[index].rating = rating;
  all[index].feedback = feedback;
  saveAllAppointments(all);
  return true;
}
