import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageSquareHeart,
  Stethoscope,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Send,
  AlertCircle,
  ArrowRight,
  Smile,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { GetHelpModal } from '../components/common/GetHelpModal';

export const RelapseSupport: React.FC = () => {
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const { addNotification } = useNotifications();
  const isBn = language === 'bn';
  const navigate = useNavigate();

  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [notifyPsychiatristConsent, setNotifyPsychiatristConsent] = useState(false);
  const [trustedMessageSent, setTrustedMessageSent] = useState(false);

  const primaryTrusted = currentUser?.trustedContacts?.[0];

  const handleSendTrustedMessage = () => {
    if (!primaryTrusted) return;
    setTrustedMessageSent(true);
    addNotification({
      category: 'security',
      title: 'Discreet message sent to trusted contact',
      titleBn: 'আপনার বিশ্বস্ত স্বজনকে বার্তা পাঠানো হয়েছে',
      body: `A gentle check-in request was forwarded to ${primaryTrusted.name} (${primaryTrusted.phone}).`,
      bodyBn: `${primaryTrusted.name}-কে একটি সহমর্মী অনুরোধ পাঠানো হয়েছে।`,
      link: '/relapse-support'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Calm, Compassionate Header */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-700 text-white rounded-3xl p-6 sm:p-9 shadow-md text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-white/20 text-white mx-auto flex items-center justify-center">
          <Heart className="w-7 h-7 fill-white/20" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {isBn ? 'একটি ভুল আপনার সমস্ত অর্জনকে মুছে দেয় না' : 'A Setback Does Not Erase Your Progress'}
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          {isBn
            ? 'সুস্থতা কোনো সরলরেখা নয়। চড়াই-উতরাই স্বাভাবিক। আপনি আজ, এই মুহূর্ত থেকেই আবার নতুন করে শুরু করতে পারেন।'
            : 'You are safe here. We do not judge, count failures, or take away your earned badges. You can begin again today.'}
        </p>
      </div>

      {/* Immediate Gentle Coping Steps */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>4 Gentle Grounding Steps Right Now</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 dark:text-stone-300">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">1. Breathe slowly</span>
            <p className="text-stone-500">Inhale gently for 4s, hold for 4s, and exhale. Your nervous system will settle.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">2. Drink tall cool water</span>
            <p className="text-stone-500">Sip room-temperature or cool water to ground your sensory physical state.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">3. Step into fresh air</span>
            <p className="text-stone-500">Change your immediate physical environment. Look at the horizon or veranda.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 space-y-1">
            <span className="font-bold text-stone-900 dark:text-stone-100 block">4. Drop self-criticism</span>
            <p className="text-stone-500">Shame feeds cravings; compassion restores clarity and steady strength.</p>
          </div>
        </div>
      </div>

      {/* Action Paths: Chat, Doctor, Trusted Contact */}
      <div className="space-y-4">
        <h2 className="font-bold text-base text-stone-900 dark:text-stone-100">
          Support Pathways
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pathway 1: Chat with AI Companion */}
          <Link
            to="/chat"
            className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-blue-500 transition space-y-2 block"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Talk to Pathway AI Companion
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Express your feelings without shame. Explore 15-minute urge surfing tools.
            </p>
          </Link>

          {/* Pathway 2: Book an Earliest Doctor Slot */}
          <Link
            to="/doctors"
            className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-blue-500 transition space-y-2 block"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Book Earliest Doctor Consultation
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Find the nearest available online slot today to review your safety plan.
            </p>
          </Link>
        </div>

        {/* Pathway 3: Message My Trusted Person */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Message My Trusted Contact
            </h3>
            {primaryTrusted && (
              <span className="text-xs text-blue-700 font-semibold">
                {primaryTrusted.name} ({primaryTrusted.relationship})
              </span>
            )}
          </div>

          {primaryTrusted ? (
            <div className="space-y-3">
              <p className="text-xs text-stone-500 leading-relaxed">
                Send a discreet, non-stigmatizing check-in message: <em>"Hi, I could use a little friendly support today. Could you give me a call when you are free?"</em>
              </p>
              {trustedMessageSent ? (
                <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Message delivered discreetly to {primaryTrusted.name}.</span>
                </div>
              ) : (
                <button
                  onClick={handleSendTrustedMessage}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs shadow-sm hover:bg-blue-800 transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Message {primaryTrusted.name} Now</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-xs text-stone-500 space-y-2">
              <p>You have not designated a trusted contact yet.</p>
              <Link to="/me" className="text-blue-700 font-semibold underline block">
                Add a trusted person in your Profile &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Optional Let My Psychiatrist Know Toggle */}
        <div className="bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
              Let My Primary Psychiatrist Know
            </h4>
            <p className="text-xs text-stone-500">
              Sends an advance note to your doctor before your next visit to adjust your goal pace.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNotifyPsychiatristConsent(!notifyPsychiatristConsent)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              notifyPsychiatristConsent
                ? 'bg-blue-700 text-white border-blue-700'
                : 'border-stone-300 text-stone-600'
            }`}
          >
            {notifyPsychiatristConsent ? 'Consented' : 'Consent to Notify'}
          </button>
        </div>
      </div>

      {/* Immediate Emergency Trigger */}
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between gap-3 text-xs">
        <div className="text-rose-900 dark:text-rose-200 leading-relaxed">
          <strong>Need immediate clinical safety?</strong> Our verified 24/7 national helplines are available right now.
        </div>
        <button
          onClick={() => setIsCrisisModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold shadow-xs shrink-0"
        >
          {t('app.getHelpNow')}
        </button>
      </div>

      <GetHelpModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />
    </div>
  );
};
