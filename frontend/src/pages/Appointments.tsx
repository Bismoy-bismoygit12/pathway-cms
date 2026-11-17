import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Download,
  RotateCcw,
  XCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Star,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getUserAppointments,
  fetchAppointmentsFromBackend,
  rescheduleAppointment,
  cancelAppointment,
  downloadAppointmentIcs,
  updateAppointment
} from '../services/appointments';
import { Appointment } from '../types';
import { ConsentSwitch } from '../components/common/ConsentSwitch';

export const Appointments: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(() =>
    currentUser ? getUserAppointments(currentUser.id) : []
  );

  useEffect(() => {
    fetchAppointmentsFromBackend().then((fresh) => {
      if (currentUser) {
        setAppointmentsList(fresh.filter((a) => a.userId === currentUser.id || String(a.userId).includes('shanto')));
      }
    });
  }, [currentUser]);

  // Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('2026-11-14');
  const [newTime, setNewTime] = useState('05:00 PM');

  // Cancel Modal
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Share Settings Modal
  const [shareTarget, setShareTarget] = useState<Appointment | null>(null);
  const [shareConfig, setShareConfig] = useState({
    profile: true,
    goals: true,
    moods: true,
    healthBasics: false,
    reports: true
  });

  const refresh = () => {
    if (currentUser) {
      setAppointmentsList(getUserAppointments(currentUser.id));
    }
  };

  const upcomingList = appointmentsList.filter(
    (a) => a.status === 'requested' || a.status === 'confirmed' || a.status === 'rescheduled'
  );
  const pastList = appointmentsList.filter((a) => a.status === 'completed' || a.status === 'missed');
  const cancelledList = appointmentsList.filter((a) => a.status === 'cancelled');

  const activeList =
    activeTab === 'upcoming' ? upcomingList : activeTab === 'past' ? pastList : cancelledList;

  const handleConfirmReschedule = () => {
    if (!rescheduleTarget) return;
    const res = rescheduleAppointment(rescheduleTarget.id, newDate, newTime);
    if (res.success) {
      refresh();
      setRescheduleTarget(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    const res = await cancelAppointment(cancelTarget.id, cancelReason);
    if (res.success) {
      refresh();
      setCancelTarget(null);
    }
  };

  const handleSaveShareSettings = () => {
    if (!shareTarget) return;
    updateAppointment(shareTarget.id, { sharedData: shareConfig });
    refresh();
    setShareTarget(null);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {t('nav.appointments')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Manage your psychiatric visits, reminders, and shared records in one peaceful place.
          </p>
        </div>

        <Link
          to="/doctors"
          className="px-4 py-2.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book a New Visit</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
              : 'text-stone-500'
          }`}
        >
          Upcoming ({upcomingList.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeTab === 'past'
              ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
              : 'text-stone-500'
          }`}
        >
          Past ({pastList.length})
        </button>

        <button
          onClick={() => setActiveTab('cancelled')}
          className={`flex-1 py-2 rounded-xl transition ${
            activeTab === 'cancelled'
              ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
              : 'text-stone-500'
          }`}
        >
          Cancelled ({cancelledList.length})
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {activeList.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-12 text-center space-y-3">
            <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
              No appointments in this tab
            </h3>
            <p className="text-xs text-stone-500">
              You can easily schedule a consultation with any of our verified doctors.
            </p>
            <Link
              to="/doctors"
              className="inline-block px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold mt-2"
            >
              Browse Doctor Directory
            </Link>
          </div>
        ) : (
          activeList.map((apt) => (
            <div
              key={apt.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4">
                <img
                  src={apt.doctorPhoto}
                  alt={apt.doctorName}
                  className="w-14 h-14 rounded-2xl object-cover bg-stone-100 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                      {isBn ? apt.doctorNameBn : apt.doctorName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : apt.status === 'requested'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500">{apt.doctorHospital}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-300 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <strong>{apt.date}</strong> at <strong>{apt.time}</strong>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 capitalize">
                      {apt.mode === 'online' ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <Building2 className="w-3.5 h-3.5 text-stone-500" />}
                      <span>{apt.mode === 'online' ? 'Online Consultation' : 'In Person Clinic'}</span>
                    </span>
                    <span>&bull;</span>
                    <span>৳{apt.feeBDT} ({apt.paymentStatus})</span>
                  </div>

                  {apt.doctorNote && (
                    <div className="mt-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200">
                      <strong>Doctor Note:</strong> {apt.doctorNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 shrink-0">
                {activeTab === 'upcoming' && (
                  <>
                    <Link
                      to={`/waiting-room/${apt.id}`}
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Room</span>
                    </Link>

                    <button
                      onClick={() => downloadAppointmentIcs(apt)}
                      className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 hover:bg-stone-100 transition"
                      title="Add to Calendar (.ics)"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setShareTarget(apt);
                        setShareConfig(apt.sharedData);
                      }}
                      className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 hover:bg-stone-100 transition"
                      title="Share Settings for this Doctor"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setRescheduleTarget(apt)}
                      className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => setCancelTarget(apt)}
                      className="px-3 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {activeTab === 'past' && (
                  <Link
                    to={`/post-visit/${apt.id}`}
                    className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 flex items-center gap-1"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>{apt.rating ? `Rated (${apt.rating}★)` : 'Rate & View Tips'}</span>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Reschedule Visit
            </h3>
            <p className="text-xs text-stone-500">
              Pick a new slot with {rescheduleTarget.doctorName}. Cancellation policy: free up to 12h before.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">New Time</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 dark:text-stone-100"
                >
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                  <option value="07:00 PM">07:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setRescheduleTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-medium"
              >
                Keep Current Slot
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs shadow-sm"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Cancel Appointment
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Are you sure? If you paid online via bKash/Nagad/Card, a 100% full refund is automatically queued.
            </p>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Reason (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Schedule conflict, feeling better..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-medium"
              >
                Keep Visit
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Settings Modal */}
      {shareTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4 animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Sharing Permissions with {shareTarget.doctorName}
            </h3>
            <p className="text-xs text-stone-500">
              Control what this specific doctor can review in your record.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <ConsentSwitch
                id="sh-prof"
                label="Basic Profile"
                description="Nickname and age"
                checked={shareConfig.profile}
                onChange={(c) => setShareConfig({ ...shareConfig, profile: c })}
              />
              <ConsentSwitch
                id="sh-goals"
                label="Recovery Goals"
                description="Daily habit completions"
                checked={shareConfig.goals}
                onChange={(c) => setShareConfig({ ...shareConfig, goals: c })}
              />
              <ConsentSwitch
                id="sh-moods"
                label="Mood Check-Ins"
                description="Recent feelings"
                checked={shareConfig.moods}
                onChange={(c) => setShareConfig({ ...shareConfig, moods: c })}
              />
              <ConsentSwitch
                id="sh-reports"
                label="Medical Reports"
                description="Lab results"
                checked={shareConfig.reports}
                onChange={(c) => setShareConfig({ ...shareConfig, reports: c })}
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setShareTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveShareSettings}
                className="flex-1 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
