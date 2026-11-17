import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Download,
  CreditCard,
  Heart
} from 'lucide-react';
import { getDoctorById, getDoctorSlots } from '../services/doctors';
import { createAppointment, downloadAppointmentIcs } from '../services/appointments';
import { recordPayment } from '../services/payments';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { ConsentSwitch } from '../components/common/ConsentSwitch';
import { Appointment } from '../types';

export const BookVisit: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const { addNotification } = useNotifications();
  const isBn = language === 'bn';

  const doctor = getDoctorById(doctorId || '');
  const slots = doctor ? getDoctorSlots(doctor.id) : [];

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Step 1: Date & Time
  const [selectedDate, setSelectedDate] = useState<string>(searchParams.get('date') || slots[0]?.date || '2026-11-12');
  const [selectedTime, setSelectedTime] = useState<string>(searchParams.get('time') || slots[0]?.time || '04:30 PM');

  // Step 2: Mode
  const [mode, setMode] = useState<'online' | 'in_person'>('online');

  // Step 3: Reason
  const [reason, setReason] = useState('');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  // Step 4: Data sharing switches (off by default)
  const [shareProfile, setShareProfile] = useState(false);
  const [shareGoals, setShareGoals] = useState(false);
  const [shareMoods, setShareMoods] = useState(false);
  const [shareHealth, setShareHealth] = useState(false);
  const [shareReports, setShareReports] = useState(false);

  // Step 5: Policy
  const [agreedPolicy, setAgreedPolicy] = useState(false);

  // Step 6: Payment choice
  const [paymentChoice, setPaymentChoice] = useState<'bkash' | 'nagad' | 'card' | 'pay_at_clinic'>('bkash');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Step 7: Completed booking result
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (!doctor) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Doctor not found</h2>
        <Link to="/doctors" className="text-blue-700 underline text-sm mt-2 block">
          Back to doctors
        </Link>
      </div>
    );
  }

  // Handle final confirmation
  const handleConfirmAndPay = () => {
    if (!currentUser) return;
    setBookingError(null);
    setIsProcessingPayment(true);

    setTimeout(async () => {
      setIsProcessingPayment(false);

      const res = await createAppointment({
        userId: currentUser.id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorNameBn: doctor.nameBn,
        doctorTitle: doctor.title,
        doctorHospital: doctor.hospital,
        doctorPhoto: doctor.photo,
        date: selectedDate,
        time: selectedTime,
        mode,
        status: 'requested', // starts as requested, confirmed via demo controls or doctor simulation
        feeBDT: doctor.feeBDT,
        paymentMethod: paymentChoice,
        paymentStatus: paymentChoice === 'pay_at_clinic' ? 'pending' : 'paid',
        reason,
        concernsList: selectedConcerns,
        sharedData: {
          profile: shareProfile,
          goals: shareGoals,
          moods: shareMoods,
          healthBasics: shareHealth,
          reports: shareReports
        }
      });

      if (!res.success) {
        setBookingError(res.error || 'Booking error. Please pick another slot.');
        setStep(1);
        return;
      }

      // Record payment if online
      if (paymentChoice !== 'pay_at_clinic') {
        recordPayment({
          userId: currentUser.id,
          type: 'consultation',
          title: `Consultation with ${doctor.name}`,
          titleBn: `${doctor.nameBn}-এর সাথে ভিজিট ফি`,
          amountBDT: doctor.feeBDT,
          method: paymentChoice,
          status: 'completed',
          referenceId: `TXN-MED-${Date.now().toString().slice(-6)}`
        });
      }

      // Add discrete notifications
      addNotification({
        category: 'visits',
        title: 'Visit scheduled',
        titleBn: 'আপনার ভিজিট বুক হয়েছে',
        body: `Your visit with ${doctor.name} is booked for ${selectedDate} at ${selectedTime}.`,
        bodyBn: `${doctor.nameBn}-এর সাথে ${selectedDate} তারিখের অ্যাপয়েন্টমেন্ট শিডিউল করা হয়েছে।`,
        link: '/visits'
      });

      setConfirmedBooking(res.appointment!);
      setStep(7);
    }, 900);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-9 shadow-lg space-y-6">
        {/* Progress Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-blue-700 dark:text-blue-400 font-bold">
              {step === 1 && t('doctors.step1')}
              {step === 2 && t('doctors.step2')}
              {step === 3 && t('doctors.step3')}
              {step === 4 && t('doctors.step4')}
              {step === 5 && t('doctors.step5')}
              {step === 6 && t('doctors.step6')}
              {step === 7 && t('doctors.step7')}
            </span>
          </div>

          <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Doctor Snippet Card */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3.5">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0"
          />
          <div>
            <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              {isBn ? doctor.nameBn : doctor.name}
            </h4>
            <span className="text-xs text-stone-500">
              {doctor.hospital} &bull; ৳{doctor.feeBDT}
            </span>
          </div>
        </div>

        {/* Booking Error Banner */}
        {bookingError && (
          <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Pick a Date & Time Slot
              </h2>
              <p className="text-xs text-stone-500">Bangladesh Local Time (GMT+6)</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-600 block">Available Dates</label>
              <div className="grid grid-cols-2 gap-2">
                {Array.from(new Set(slots.map((s) => s.date))).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                      selectedDate === d
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-600 block">Select Slot Time</label>
              <div className="grid grid-cols-2 gap-2">
                {slots
                  .filter((s) => s.date === selectedDate)
                  .map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={s.isBooked}
                      onClick={() => setSelectedTime(s.time)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition ${
                        s.isBooked
                          ? 'bg-stone-100 text-stone-400 line-through cursor-not-allowed'
                          : selectedTime === s.time
                          ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedTime}
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2 mt-4"
            >
              <span>{t('common.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Consultation Mode */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Choose Consultation Mode
              </h2>
              <p className="text-xs text-stone-500">Pick what feels most peaceful and safe for you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('online')}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                  mode === 'online'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Online Video / Audio
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Consult securely from the comfort of home. Private and unrecorded.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('in_person')}
                className={`p-5 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 ${
                  mode === 'in_person'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-600'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    In Person (Clinic)
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Visit doctor's chamber at {doctor.hospital}.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl border border-stone-300 text-xs font-medium"
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Tell Doctor Why Coming */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Tell the doctor why you are coming
              </h2>
              <p className="text-xs text-stone-500">
                Optional. You can skip this or leave it completely blank.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Cravings or Urges', 'Sleep problems / Insomnia', 'Stress & Worry', 'Had a setback', 'First consultation'].map(
                (c) => {
                  const sel = selectedConcerns.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setSelectedConcerns((prev) =>
                          sel ? prev.filter((i) => i !== c) : [...prev, c]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        sel
                          ? 'bg-blue-700 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {c}
                    </button>
                  );
                }
              )}
            </div>

            <div>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional short note for the doctor..."
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 p-3.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-2xl border border-stone-300 text-xs font-medium"
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: What would you like to share? */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                What would you like to share?
              </h2>
              <p className="text-xs text-stone-500">
                All switches are off by default. You control what the psychiatrist sees and can change this anytime.
              </p>
            </div>

            <div className="space-y-2.5">
              <ConsentSwitch
                id="share-profile"
                label="My basic profile (Nickname, Age, Gender)"
                description="Allows doctor to greet you appropriately."
                checked={shareProfile}
                onChange={setShareProfile}
              />

              <ConsentSwitch
                id="share-goals"
                label="My daily recovery goals & streaks"
                description="Helps doctor see your recent calming habits."
                checked={shareGoals}
                onChange={setShareGoals}
              />

              <ConsentSwitch
                id="share-moods"
                label="My recent mood check-ins"
                description="Provides context on emotional patterns."
                checked={shareMoods}
                onChange={setShareMoods}
              />

              <ConsentSwitch
                id="share-health"
                label="Health notes (Allergies & Current medicines)"
                description="Helps prevent conflicting medications."
                checked={shareHealth}
                onChange={setShareHealth}
              />

              <ConsentSwitch
                id="share-reports"
                label="My stored medical reports"
                description="Enables doctor to review previous lab tests."
                checked={shareReports}
                onChange={setShareReports}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-3 rounded-2xl border border-stone-300 text-xs font-medium"
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Policy Review */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Review Cancellation Policy
              </h2>
              <p className="text-xs text-stone-500">Clear and fair rules for peace of mind.</p>
            </div>

            <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Free cancellation or reschedule:</strong> Up to 12 hours before your visit without fee.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Instant full refund:</strong> If paid online, 100% of your fee is refunded to your bKash, Nagad, or Card within 2-3 business days.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Emergency support:</strong> If an unforeseen crisis arises, message support and we will happily assist without penalty.</span>
              </div>
            </div>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedPolicy}
                onChange={(e) => setAgreedPolicy(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                I understand and agree to the 12-hour cancellation policy.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(4)}
                className="px-4 py-3 rounded-2xl border border-stone-300 text-xs font-medium"
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => setStep(6)}
                disabled={!agreedPolicy}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Payment Choice */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Consultation Payment
              </h2>
              <p className="text-xs text-stone-500">
                Total Fee: <strong className="text-stone-900 dark:text-stone-100">BDT {doctor.feeBDT}</strong>. Choose secure online payment or pay at visit.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'bkash', name: 'bKash Mobile Payment', note: 'Fast automated refund guarantee' },
                { id: 'nagad', name: 'Nagad Digital Wallet', note: 'Instant confirmation' },
                { id: 'card', name: 'Visa / Mastercard / Bangladeshi Debit Card', note: 'Simulated 128-bit secure gateway' },
                { id: 'pay_at_clinic', name: 'Pay at Clinic / Doctor Chamber', note: 'Pay cash directly at appointment' }
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                    paymentChoice === opt.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentChoice"
                      value={opt.id}
                      checked={paymentChoice === opt.id}
                      onChange={() => setPaymentChoice(opt.id as any)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-semibold text-xs text-stone-900 dark:text-stone-100">
                        {opt.name}
                      </span>
                      <p className="text-[10px] text-stone-400">{opt.note}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setStep(5)}
                className="px-4 py-3 rounded-2xl border border-stone-300 text-xs font-medium"
              >
                {t('common.back')}
              </button>
              <button
                onClick={handleConfirmAndPay}
                disabled={isProcessingPayment}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? (
                  <span>Connecting to secure gateway...</span>
                ) : (
                  <>
                    <span>Confirm & Book for ৳{doctor.feeBDT}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Confirmation Screen */}
        {step === 7 && confirmedBooking && (
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {t('doctors.appointmentConfirmed')}
              </h2>
              <p className="text-xs text-stone-500">
                Booking ID: <strong className="font-mono text-stone-700 dark:text-stone-300">{confirmedBooking.id}</strong>
              </p>
            </div>

            {/* Visit Details Box */}
            <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-stone-400">Psychiatrist:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{confirmedBooking.date} at {confirmedBooking.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Consultation Mode:</span>
                <span className="font-semibold capitalize text-blue-700 dark:text-blue-400">{confirmedBooking.mode === 'online' ? 'Online Video/Audio' : 'In Person Clinic'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Payment:</span>
                <span className="font-semibold uppercase text-stone-800 dark:text-stone-200">{confirmedBooking.paymentMethod} (৳{confirmedBooking.feeBDT})</span>
              </div>
            </div>

            {/* Actions: Add to calendar (.ics) & Go to Visits */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => downloadAppointmentIcs(confirmedBooking)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('doctors.addToCalendar')}</span>
              </button>

              <button
                onClick={() => navigate('/visits')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm transition"
              >
                Go to My Appointments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
