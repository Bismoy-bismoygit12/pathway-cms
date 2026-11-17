import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  HelpCircle,
  ShieldCheck,
  PhoneCall,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { getAllStoredAppointments, updateAppointment } from '../services/appointments';
import { useLanguage } from '../context/LanguageContext';
import { GetHelpModal } from '../components/common/GetHelpModal';

export const VideoCall: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const allApts = getAllStoredAppointments();
  const apt = allApts.find((a) => a.id === appointmentId) || allApts[0];

  // Call controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isHelpTroubleOpen, setIsHelpTroubleOpen] = useState(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (apt) {
      updateAppointment(apt.id, {
        status: 'completed',
        doctorNote: 'Consultation conducted smoothly. Patient was advised to continue Box Breathing and stay hydrated.'
      });
      navigate(`/post-visit/${apt.id}`);
    } else {
      navigate('/visits');
    }
  };

  const handleLeaveQuietly = () => {
    navigate('/my-day');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-stone-950 text-stone-100 flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* Top Floating Bar: Call Timer, Encryption note, and Get Help Now */}
      <div className="flex items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-stone-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono font-semibold">{formatTimer(callDuration)}</span>
          <span className="text-stone-400">&bull;</span>
          <span className="text-stone-300 truncate max-w-[140px] sm:max-w-none">
            {apt ? apt.doctorName : 'Doctor Consultation'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Always accessible Get Help Now during calls */}
          <button
            onClick={() => setIsCrisisModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('app.getHelpNow')}</span>
          </button>

          <button
            onClick={() => setIsHelpTroubleOpen(true)}
            className="p-2 rounded-full bg-stone-900/80 border border-stone-800 text-stone-300 hover:text-white"
            title="Having trouble with audio or video?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video View: Simulated Doctor Feed */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl">
        {isAudioOnly ? (
          <div className="text-center space-y-4 p-8">
            <img
              src={apt?.doctorPhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face'}
              alt="Doctor"
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-500 shadow-lg"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{apt?.doctorName || 'Prof. Dr. Tanvir Ahmed'}</h3>
              <p className="text-xs text-stone-400">Audio-Only Consultation Active</p>
            </div>
            <div className="flex items-center justify-center gap-1 pt-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-10 bg-blue-400 rounded-full animate-bounce delay-75" />
              <span className="w-1.5 h-7 bg-blue-500 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Simulated Doctor Video Stream */}
            <img
              src={apt?.doctorPhoto || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face'}
              alt="Doctor video stream"
              className="w-full h-full object-cover opacity-90 filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Doctor Name Overlay */}
            <div className="absolute bottom-5 left-5 bg-stone-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-xs font-semibold text-white flex items-center gap-2 border border-stone-700/60">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{apt ? apt.doctorName : 'Prof. Dr. Tanvir Ahmed'}</span>
            </div>
          </div>
        )}

        {/* Self View (Picture-in-Picture) */}
        <div className="absolute bottom-5 right-5 w-32 h-44 sm:w-40 sm:h-52 rounded-2xl bg-slate-900 border-2 border-stone-700/80 shadow-2xl overflow-hidden flex items-center justify-center z-10">
          {isVideoOff ? (
            <div className="text-center p-2 text-stone-400 space-y-1">
              <VideoOff className="w-6 h-6 mx-auto text-stone-500" />
              <span className="text-[10px] block font-medium">Camera off</span>
            </div>
          ) : (
            <div className="w-full h-full bg-stone-800 flex items-center justify-center relative">
              <span className="text-3xl">🌱</span>
              <span className="absolute bottom-1.5 left-2 text-[10px] bg-stone-900/80 px-1.5 py-0.5 rounded text-stone-300">
                You
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 z-20">
        <div className="flex items-center gap-3 p-2 rounded-3xl bg-stone-900/90 backdrop-blur-md border border-stone-800 shadow-xl">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl transition ${
              isMuted ? 'bg-rose-600 text-white' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera On/Off */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-2xl transition ${
              isVideoOff ? 'bg-rose-600 text-white' : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
            title={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Audio Only Switch */}
          <button
            onClick={() => setIsAudioOnly(!isAudioOnly)}
            className={`p-3.5 rounded-2xl transition text-xs font-semibold ${
              isAudioOnly
                ? 'bg-blue-600 text-white'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title="Audio-only mode (saves data and reduces pressure)"
          >
            Audio Only
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>

        {/* Leave quietly shortcut */}
        <button
          onClick={handleLeaveQuietly}
          className="text-stone-400 hover:text-stone-200 text-xs underline py-1"
        >
          Leave quietly
        </button>
      </div>

      {/* Having Trouble Drawer */}
      {isHelpTroubleOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm"
        >
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full space-y-4 text-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Having Connection Trouble?</h3>
              <button
                onClick={() => setIsHelpTroubleOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              If your video is freezing or audio sounds choppy, tap "Audio Only" in the bottom control bar. This significantly reduces data bandwidth and keeps the voice clear.
            </p>
            <button
              onClick={() => {
                setIsAudioOnly(true);
                setIsHelpTroubleOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs"
            >
              Switch to Audio-Only Mode
            </button>
          </div>
        </div>
      )}

      {/* Crisis Help Modal */}
      <GetHelpModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />
    </div>
  );
};
