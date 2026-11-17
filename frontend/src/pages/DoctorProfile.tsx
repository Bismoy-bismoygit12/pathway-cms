import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LifeBuoy
} from 'lucide-react';
import { getDoctorById, getDoctorSlots } from '../services/doctors';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  const doctor = getDoctorById(id || '');
  const slots = doctor ? getDoctorSlots(doctor.id) : [];

  const [selectedDate, setSelectedDate] = useState<string>(slots[0]?.date || '2026-11-12');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string | null>(null);

  if (!doctor) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Doctor not found</h2>
        <Link to="/doctors" className="text-sm text-blue-700 underline">
          Return to directory
        </Link>
      </div>
    );
  }

  // Group slots by date
  const uniqueDates = Array.from(new Set(slots.map((s) => s.date)));
  const slotsForSelectedDate = slots.filter((s) => s.date === selectedDate);

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/book/${doctor.id}?date=${selectedDate}&time=${encodeURIComponent(selectedSlotTime || '')}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Emergency Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {isBn
              ? 'অ্যাপয়েন্টমেন্ট বুকিং কোনো জরুরি চিকিৎসার জন্য নয়। এখনই তাৎক্ষণিক সাহায্য প্রয়োজন হলে "জরুরি সাহায্য নিন" বাটনে চাপুন।'
              : 'Booking is not for emergencies. If you are experiencing acute withdrawal or physical distress right now, tap Get Help Now.'}
          </span>
        </div>
        <Link
          to="/emergency"
          className="font-bold text-amber-800 dark:text-amber-300 underline shrink-0"
        >
          {t('app.getHelpNow')}
        </Link>
      </div>

      {/* Doctor Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover bg-stone-100 shrink-0 shadow-xs"
          />
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              {isBn ? doctor.nameBn : doctor.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              {isBn ? doctor.titleBn : doctor.title}
            </p>
            <p className="text-xs text-stone-400">{doctor.qualifications}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {doctor.experienceYears} {isBn ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-stone-600 dark:text-stone-300">{doctor.hospital}</span>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
          <div>
            <span className="text-[10px] text-stone-400 block">{t('doctors.fee')}</span>
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              ৳{doctor.feeBDT}
            </span>
            <span className="text-[10px] text-stone-400 block">per 45-min consultation</span>
          </div>
        </div>
      </div>

      {/* Main 2-Col Grid: Bio & Slot Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Bio & What to Expect */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Doctor */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              About the Doctor
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isBn ? doctor.aboutBn : doctor.about}
            </p>

            <div className="pt-3 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Specialties & Areas of Support
              </h3>
              <div className="flex flex-wrap gap-2">
                {(isBn ? doctor.specialtiesBn : doctor.specialties).map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* What to Expect in First Visit */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>What to Expect in Your First Visit</span>
            </h3>
            <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>A calm, non-judgmental space:</strong> The doctor will listen patiently without criticizing or shaming you.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>No forced decisions:</strong> You choose what you feel comfortable talking about. Everything remains private.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Practical next steps:</strong> You will leave with comforting routines, sleep advice, and optional doctor-suggested goals in your Pathway dashboard.</span>
              </li>
            </ul>
          </div>

          {/* Clinic Address & Map Placeholder */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>In-Person Chamber & Clinic</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {isBn ? doctor.clinicAddressBn : doctor.clinicAddress}
            </p>

            {/* Clean Map Placeholder */}
            <div className="w-full h-36 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center text-stone-400 gap-1.5 text-xs">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-stone-600 dark:text-stone-300">
                Chamber Location in {doctor.city}
              </span>
              <span className="text-[10px]">Easy access & private entrance</span>
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Slot Calendar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Choose Date & Time</span>
              </h3>
              <p className="text-xs text-stone-400">Times shown in Bangladesh Time (GMT+6)</p>
            </div>

            {/* Date Picker Pills */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Select Date
              </label>
              <div className="grid grid-cols-2 gap-2">
                {uniqueDates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d);
                      setSelectedSlotTime(null);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                      selectedDate === d
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Available Time Slots
              </label>

              {slotsForSelectedDate.length === 0 ? (
                <p className="text-xs text-stone-400 py-3 text-center">No available slots for this date.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {slotsForSelectedDate.map((s, idx) => {
                    const isSelected = selectedSlotTime === s.time;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={s.isBooked}
                        onClick={() => setSelectedSlotTime(s.time)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                          s.isBooked
                            ? 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-800 text-stone-400 line-through cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-800 dark:bg-blue-950/40 font-bold'
                            : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span>{s.time}</span>
                        {s.isBooked ? (
                          <span className="text-[9px] uppercase font-bold text-stone-400">Booked</span>
                        ) : (
                          <span className="text-[9px] text-blue-600 uppercase font-semibold">{s.mode}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Book CTA */}
            <button
              onClick={handleBook}
              disabled={!selectedSlotTime}
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>{t('doctors.bookVisit')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              Free rescheduling or cancellation up to 12 hours before appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
