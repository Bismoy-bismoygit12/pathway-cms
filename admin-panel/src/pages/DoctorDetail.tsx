import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarClock,
} from 'lucide-react';
import { doctorService } from '@/services/doctorService';
import { ManagedAppointment, ManagedDoctor } from '@/types/admin';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { AppointmentStatusBadge, DoctorStatusBadge } from '@/components/common/StatusBadges';
import { formatDate, formatDateTime } from '@/lib/utils';

export const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentAdmin, hasPermission } = useAdminAuth();
  const { showToast } = useToast();

  const [doctor, setDoctor] = useState<ManagedDoctor | null>(null);
  const [appointments, setAppointments] = useState<ManagedAppointment[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    doctorService.getById(id).then((res) => {
      setDoctor(res.doctor);
      setAppointments(res.appointments);
      setNotes(res.doctor?.reviewNotes || '');
      setLoading(false);
    });
  }, [id]);

  const canApprove = hasPermission('doctors:approve');

  const handleDecision = async (decision: 'approved' | 'rejected') => {
    if (!doctor || !canApprove) return;
    if (decision === 'rejected' && !notes.trim()) {
      showToast('Please enter rejection notes before declining.', 'error');
      return;
    }
    const updated = await doctorService.reviewApplication(
      doctor.id,
      decision,
      notes,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'doctor_manager'
    );
    setDoctor(updated);
    showToast(`Doctor application marked as ${decision}.`);
  };

  const handleToggleSlot = async (slotIndex: number) => {
    if (!doctor || !canApprove) return;
    const updated = await doctorService.toggleAvailabilitySlot(doctor.id, slotIndex);
    setDoctor(updated);
    showToast('Updated availability slot status.');
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading doctor profile...</div>;

  if (!doctor) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <div className="text-base font-semibold text-slate-900">Doctor Not Found</div>
          <Link to="/doctors" className="text-xs text-blue-700 font-semibold hover:underline">
            &larr; Return to Doctor Directory
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/doctors"
          className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">{doctor.fullName}</h2>
            <DoctorStatusBadge status={doctor.approvalStatus} />
          </div>
          <p className="text-xs text-slate-500">
            {doctor.qualifications} • {doctor.licenseNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Professional Credentials & Approval */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Professional Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={doctor.photo}
                alt={doctor.fullName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doctor.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doctor.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <div className="text-slate-400">Experience</div>
                <div className="font-semibold text-slate-900">{doctor.experienceYears} years</div>
              </div>
              <div>
                <div className="text-slate-400">Consultation Fee</div>
                <div className="font-semibold text-slate-900">৳{doctor.consultationFeeBDT}</div>
              </div>
              <div>
                <div className="text-slate-400">Applied Date</div>
                <div className="font-medium text-slate-900">{formatDate(doctor.appliedAt)}</div>
              </div>
              <div>
                <div className="text-slate-400">Reviewed At</div>
                <div className="font-medium text-slate-900">
                  {doctor.reviewedAt ? formatDateTime(doctor.reviewedAt) : 'Pending'}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700">Specialties</div>
              <div className="flex flex-wrap gap-1.5">
                {doctor.specialties.map((sp) => (
                  <Badge key={sp} variant="blue">
                    {sp}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700">Clinical Bio</div>
              <p className="text-xs text-slate-600 leading-relaxed">{doctor.bio}</p>
            </div>

            {canApprove && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-semibold text-slate-800">
                  Credential Review Notes
                </label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter verification notes or rejection reason..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    variant="teal"
                    disabled={doctor.approvalStatus === 'approved'}
                    onClick={() => handleDecision('approved')}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Doctor</span>
                  </Button>
                  <Button
                    variant="danger"
                    disabled={doctor.approvalStatus === 'rejected'}
                    onClick={() => handleDecision('rejected')}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Application</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Availability & Appointment History */}
        <div className="lg:col-span-7 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>Doctor Availability Schedule</span>
              </CardTitle>
              <span className="text-[11px] text-slate-500">Click status to toggle slot lock</span>
            </CardHeader>
            <CardContent>
              {doctor.availabilitySlots.length === 0 ? (
                <div className="text-xs text-slate-500 py-4 text-center">No consultation slots configured.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {doctor.availabilitySlots.map((slot, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">
                          {slot.day} • {slot.time}
                        </div>
                        <div className="text-[11px] text-slate-500 capitalize">
                          Mode: {slot.mode.replace('_', ' ')}
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={!canApprove}
                        onClick={() => handleToggleSlot(idx)}
                        className="cursor-pointer disabled:cursor-default"
                      >
                        <Badge variant={slot.booked ? 'amber' : 'emerald'}>
                          {slot.booked ? 'Booked / Reserved' : 'Available'}
                        </Badge>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-teal-600" />
                <span>Appointment History ({appointments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {appointments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No appointments recorded for this doctor yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500">
                      <tr>
                        <th className="py-2.5 px-4">Appointment</th>
                        <th className="py-2.5 px-4">Patient</th>
                        <th className="py-2.5 px-4">Schedule</th>
                        <th className="py-2.5 px-4">Mode</th>
                        <th className="py-2.5 px-4">Fee</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((apt) => (
                        <tr key={apt.id}>
                          <td className="py-3 px-4 font-mono text-[11px] font-semibold text-blue-700">{apt.id}</td>
                          <td className="py-3 px-4 font-medium text-slate-900">{apt.patientName}</td>
                          <td className="py-3 px-4 text-slate-600">
                            {apt.scheduledDate} • {apt.scheduledTime}
                          </td>
                          <td className="py-3 px-4 capitalize">{apt.mode.replace('_', ' ')}</td>
                          <td className="py-3 px-4 font-semibold">৳{apt.feeBDT}</td>
                          <td className="py-3 px-4">
                            <AppointmentStatusBadge status={apt.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
