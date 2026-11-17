import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Video,
  MapPin,
  Eye,
  CheckCircle2,
  XCircle,
  Lock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { appointmentService, AppointmentStats } from '@/services/appointmentService';
import { AppointmentStatus, ManagedAppointment } from '@/types/admin';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { AppointmentStatusBadge } from '@/components/common/StatusBadges';

export const Appointments: React.FC = () => {
  const { currentAdmin, hasPermission } = useAdminAuth();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'in_person'>('all');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<ManagedAppointment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    upcoming: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  });

  const [selectedAppointment, setSelectedAppointment] = useState<ManagedAppointment | null>(null);

  const loadAppointments = useCallback(async () => {
    const res = await appointmentService.list({
      search,
      status: statusFilter,
      mode: modeFilter,
      page,
      pageSize: 6,
    });
    setItems(res.items);
    setTotal(res.total);
    setTotalPages(res.totalPages);
    setStats(res.stats);
  }, [search, statusFilter, modeFilter, page]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const canManage = hasPermission('appointments:manage');
  const canViewSensitiveConcerns = hasPermission('users:view_recovery');

  const handleStatusUpdate = async (apt: ManagedAppointment, nextStatus: AppointmentStatus) => {
    if (!canManage) {
      showToast('Your role lacks permission to update appointments.', 'error');
      return;
    }
    const updated = await appointmentService.updateStatus(
      apt.id,
      nextStatus,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'admin'
    );
    showToast(`Appointment ${apt.id} marked as ${nextStatus}.`);
    if (selectedAppointment?.id === apt.id) setSelectedAppointment(updated);
    loadAppointments();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Appointment Management</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track scheduled video and in-person psychiatric consultations, payment statuses, and consent-gated notes.
        </p>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Total Appointments</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Upcoming / Active</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{stats.upcoming}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Completed</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Cancelled / Rejected</div>
            <div className="text-2xl font-bold text-rose-600 mt-1">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search appointment ID, patient name, doctor, or specialty..."
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <Select
              aria-label="Filter by appointment status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as AppointmentStatus | 'all');
                setPage(1);
              }}
              className="flex-1 sm:w-40"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            <Select
              aria-label="Filter by consultation mode"
              value={modeFilter}
              onChange={(e) => {
                setModeFilter(e.target.value as 'all' | 'online' | 'in_person');
                setPage(1);
              }}
              className="flex-1 sm:w-40"
            >
              <option value="all">All Modes</option>
              <option value="online">Online Video</option>
              <option value="in_person">In-Person</option>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Mode & Fee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {items.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-700 whitespace-nowrap">{apt.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500">{apt.patientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.doctorSpecialty}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div>{apt.scheduledDate}</div>
                      <div className="text-[11px] text-slate-400">{apt.scheduledTime}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 font-medium text-slate-700">
                        {apt.mode === 'online' ? (
                          <Video className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        <span>{apt.mode === 'online' ? 'Online' : 'In-Person'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ৳{apt.feeBDT} • {apt.paymentMethod.toUpperCase()} ({apt.paymentStatus})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <AppointmentStatusBadge status={apt.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage && apt.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="teal"
                            title="Confirm Appointment"
                            onClick={() => handleStatusUpdate(apt, 'confirmed')}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {canManage && apt.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            title="Mark Completed"
                            onClick={() => handleStatusUpdate(apt, 'completed')}
                          >
                            Done
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-slate-500">
                      No appointments match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (320px - 767px) */}
          <div className="md:hidden divide-y divide-slate-100">
            {items.map((apt) => (
              <div key={apt.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono font-semibold text-blue-700">{apt.id}</div>
                    <div className="font-semibold text-sm text-slate-900 truncate">{apt.patientName}</div>
                    <div className="text-xs text-slate-500 truncate">{apt.doctorName}</div>
                  </div>
                  <AppointmentStatusBadge status={apt.status} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                  <span>
                    {apt.scheduledDate} • {apt.scheduledTime}
                  </span>
                  <span className="font-semibold text-slate-900">
                    ৳{apt.feeBDT} ({apt.mode === 'online' ? 'Online' : 'In-Person'})
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  {canManage && apt.status === 'pending' && (
                    <Button size="sm" variant="teal" onClick={() => handleStatusUpdate(apt, 'confirmed')}>
                      Confirm
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setSelectedAppointment(apt)}>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="py-10 text-center text-xs text-slate-500">No appointments match your filters.</div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Detail Modal with Consent-Gated Patient Notes */}
      <Modal
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
        title={selectedAppointment ? `Appointment ${selectedAppointment.id}` : ''}
        subtitle={
          selectedAppointment
            ? `${selectedAppointment.patientName} with ${selectedAppointment.doctorName}`
            : ''
        }
        size="lg"
        footer={
          selectedAppointment && (
            <>
              {canManage && selectedAppointment.status !== 'cancelled' && selectedAppointment.status !== 'completed' && (
                <Button
                  variant="danger"
                  onClick={() => handleStatusUpdate(selectedAppointment, 'cancelled')}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Appointment</span>
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </>
          )
        }
      >
        {selectedAppointment && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <div className="text-slate-400">Status</div>
                <div className="mt-1">
                  <AppointmentStatusBadge status={selectedAppointment.status} />
                </div>
              </div>
              <div>
                <div className="text-slate-400">Date & Time</div>
                <div className="font-semibold text-slate-900 mt-1">
                  {selectedAppointment.scheduledDate} • {selectedAppointment.scheduledTime}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Payment</div>
                <div className="font-semibold text-slate-900 mt-1">
                  ৳{selectedAppointment.feeBDT} ({selectedAppointment.paymentMethod.toUpperCase()} —{' '}
                  {selectedAppointment.paymentStatus})
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Patient Pre-Visit Concerns</span>
                <Badge variant={selectedAppointment.consentToShareData ? 'teal' : 'slate'}>
                  {selectedAppointment.consentToShareData ? 'Consent Granted' : 'Restricted'}
                </Badge>
              </div>

              {!canViewSensitiveConcerns ? (
                <div className="flex items-center gap-2 text-rose-600 pt-1">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Hidden: requires users:view_recovery permission.</span>
                </div>
              ) : !selectedAppointment.consentToShareData ? (
                <div className="flex items-center gap-2 text-slate-500 pt-1">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Patient chose not to share pre-visit notes with administrative staff.</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-slate-700 pt-1">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{selectedAppointment.concerns || 'No additional concerns entered.'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
