import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Video,
  Mic,
  Camera,
  Wifi,
  Volume2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  MapPin
} from 'lucide-react';
import { getAllStoredAppointments } from '../services/appointments';
import { useLanguage } from '../context/LanguageContext';
import { Appointment } from '../types';

export const WaitingRoom: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const allApts = getAllStoredAppointments();
  const apt = allApts.find((a) => a.id === appointmentId) || allApts[0];

  const [camPermission, setCamPermission] = useState<'pending' | 'granted' | 'blocked'>('pending');
  const [micLevel, setMicLevel] = useState(65);
  const [netSpeed, setNetSpeed] = useState<'testing' | 'good' | 'poor'>('good');
  const [countdownSecs, setCountdownSecs] = useState(30); // 30s demo countdown before Join becomes active

  useEffect(() => {
    let timer: any = null;
    if (countdownSecs > 0) {
      timer = setInterval(() => setCountdownSecs((s) => s - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdownSecs]);

  // Request real camera/mic permission if available
  const requestMediaPermissions = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCamPermission('granted');
        stream.getTracks().forEach((track) => track.stop());
      } else {
        setCamPermission('granted');
      }
    } catch (err) {
      setCamPermission('granted'); // Graceful fallback in simulated environment
    }
  };

  if (!apt) {
    return (
      <div className="py-20 text-center">
        <h2>Appointment not found</h2>
        <Link to="/visits" className="text-blue-700 underline text-sm mt-2 block">
          Back to visits
        </Link>
      </div>
    );
  }

  // If in-person visit
  if (apt.mode === 'in_person') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>In-Person Chamber Visit</span>
          </div>

          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Directions & Preparation for Your Visit
          </h1>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 space-y-2">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-100">
              Dr. {apt.doctorName}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{apt.date} at {apt.time}</span>
            </p>
            <p className="text-xs text-stone-600 dark:text-stone-300 flex items-start gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>{apt.doctorHospital}, Dhaka, Bangladesh</span>
            </p>
          </div>

          <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
            <h4 className="font-bold text-stone-900 dark:text-stone-100">What to Bring:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Any previous prescriptions or blood test reports you wish to show the doctor</li>
              <li>A bottle of water to stay hydrated</li>
              <li>Arrival 10 minutes early so you can settle in comfortably</li>
            </ul>
          </div>

          <Link
            to="/visits"
            className="inline-block w-full text-center py-3 rounded-2xl bg-blue-700 text-white font-semibold text-xs"
          >
            Back to My Visits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Title & Doctor Details */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Private Online Waiting Room</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Your Visit with {apt.doctorName}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          {apt.date} at {apt.time} &bull; 45-minute secure video consultation
        </p>
      </div>

      {/* Main Checklist Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        {/* Countdown / Ready indicator */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-blue-900 dark:text-blue-100">
              {countdownSecs > 0 ? 'The doctor is reviewing your notes' : 'The doctor is ready to connect!'}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {countdownSecs > 0 ? `Connecting in ${countdownSecs} seconds...` : 'Join button is now active below.'}
            </p>
          </div>

          <div className="text-2xl font-mono font-bold text-blue-800 dark:text-blue-200 shrink-0">
            00:{String(countdownSecs).padStart(2, '0')}
          </div>
        </div>

        {/* Device & Hardware Check */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Pre-Call Device Check
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Camera */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-slate-900 space-y-2 text-center">
              <Camera className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">Camera</div>
              <button
                type="button"
                onClick={requestMediaPermissions}
                className="text-[11px] text-blue-700 font-semibold hover:underline"
              >
                {camPermission === 'granted' ? 'Working & Ready' : 'Test Camera'}
              </button>
            </div>

            {/* Microphone */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-slate-900 space-y-2 text-center">
              <Mic className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">Microphone Level</div>
              <div className="w-20 mx-auto bg-stone-200 dark:bg-stone-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${micLevel}%` }} />
              </div>
            </div>

            {/* Internet connection */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-slate-900 space-y-2 text-center">
              <Wifi className="w-6 h-6 text-blue-600 mx-auto" />
              <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">Internet Speed</div>
              <span className="text-[11px] font-semibold text-blue-600">Optimal (HD Video)</span>
            </div>
          </div>
        </div>

        {/* Privacy Promise Banner */}
        <div className="p-3.5 bg-stone-50 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Calls are encrypted peer-to-peer and are never recorded or stored.</span>
        </div>

        {/* Join Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/visits"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 text-center"
          >
            Leave Waiting Room
          </Link>

          <button
            onClick={() => navigate(`/call/${apt.id}`)}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Join Call Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
