import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { PasswordMeter } from '../components/common/PasswordMeter';
import { OtpInput } from '../components/common/OtpInput';
import { ConsentSwitch } from '../components/common/ConsentSwitch';
import { Celebration } from '../components/common/Celebration';

export const SignUp: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpTries, setOtpTries] = useState(0);
  const [isOtpLocked, setIsOtpLocked] = useState(false);

  const [nickname, setNickname] = useState('');
  const [isOver18, setIsOver18] = useState(false);
  const [preferredLang, setPreferredLang] = useState<'en' | 'bn'>(language);

  // Consents
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentAiHelp, setConsentAiHelp] = useState(false);
  const [consentChatbotMemory, setConsentChatbotMemory] = useState(false);
  const [consentShareWithDoctors, setConsentShareWithDoctors] = useState(false);

  // Onboarding
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Substance & Alcohol Recovery']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Daily quiet moment']);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Evening fatigue']);

  // Error & Status
  const [formError, setFormError] = useState('');
  const [showWelcomeCelebration, setShowWelcomeCelebration] = useState(false);

  // Validation helpers
  const isValidEmail = (str: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  const isValidBdPhone = (str: string) => /^(?:\+88|88)?(01[3-9]\d{8})$/.test(str.replace(/[\s-]/g, ''));

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const clean = identifier.trim();
    if (!clean) {
      setFormError(isBn ? 'দয়া করে একটি ইমেইল বা মোবাইল নম্বর দিন' : 'Please provide an email or phone number.');
      return;
    }
    if (!isValidEmail(clean) && !isValidBdPhone(clean)) {
      setFormError(
        isBn
          ? 'একটি সঠিক ইমেইল অথবা বাংলাদেশী মোবাইল নম্বর লিখুন (যেমনঃ ০১৭১২৩৪৫৬৭৮)'
          : 'Please enter a valid email or Bangladeshi phone number (e.g. 01712345678 or +8801712345678).'
      );
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (password.length < 8) {
      setFormError(isBn ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' : 'Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError(isBn ? 'পাসওয়ার্ড মেলেনি' : 'Passwords do not match. Please verify.');
      return;
    }
    setStep(3);
  };

  const handleOtpComplete = (code: string) => {
    setOtpError('');
    if (code.length === 6) {
      // Mock rule: any 6 digits accepted
      setStep(4);
    } else {
      const tries = otpTries + 1;
      setOtpTries(tries);
      if (tries >= 4) {
        setIsOtpLocked(true);
        setOtpError(
          isBn
            ? 'অনেকবার ভুল কোড দেওয়া হয়েছে। ২ মিনিট অপেক্ষা করুন।'
            : 'Too many incorrect attempts. Please wait 2 minutes.'
        );
      } else {
        setOtpError(isBn ? 'কোডটি মেলেনি। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Code did not match. Please try again.');
      }
    }
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!isOver18) {
      setFormError(t('auth.under18Notice'));
      return;
    }
    setStep(5);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!consentTerms) {
      setFormError(isBn ? 'এগিয়ে যেতে ব্যবহারের শর্তাবলীতে সম্মতি প্রয়োজন।' : 'Please agree to Terms and Privacy Policy to proceed.');
      return;
    }
    setStep(6);
  };

  const finalizeRegistration = async () => {
    const res = await register({
      identifier,
      password,
      nickname: nickname.trim() || 'Friend',
      language: preferredLang,
      consents: {
        terms: consentTerms,
        aiHelp: consentAiHelp,
        chatbotMemory: consentChatbotMemory,
        shareWithDoctors: consentShareWithDoctors
      },
      preferences: {
        helpWith: selectedNeeds,
        goals: selectedGoals,
        triggers: selectedTriggers,
        favouriteActivities: ['Guided breathing'],
        preferredTimeOfDay: 'evening'
      }
    });

    if (res.success) {
      setStep(7);
      setShowWelcomeCelebration(true);
    } else {
      setFormError(res.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-9 shadow-lg space-y-6">
        {/* Progress Bar & Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-blue-700 dark:text-blue-400">
              {step === 1 && (isBn ? 'যোগাযোগের মাধ্যম' : 'Contact Choice')}
              {step === 2 && (isBn ? 'পাসওয়ার্ড তৈরি' : 'Create Password')}
              {step === 3 && (isBn ? 'কোড যাচাই (ওটিপি)' : 'Verification')}
              {step === 4 && (isBn ? 'মৌলিক তথ্য ও বয়স' : 'Basic Info')}
              {step === 5 && (isBn ? 'গোপনীয়তার সম্মতি' : 'Privacy Consent')}
              {step === 6 && (isBn ? 'পছন্দসমূহ' : 'Personal Rhythms')}
              {step === 7 && (isBn ? 'স্বাগতম!' : 'Welcome!')}
            </span>
          </div>

          <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Error Toast */}
        {formError && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1 leading-relaxed">{formError}</div>
          </div>
        )}

        {/* STEP 1: Email or Phone */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {isBn ? 'কীভাবে শুরু করতে চান?' : 'How would you like to sign up?'}
              </h2>
              <p className="text-xs text-stone-500">
                {isBn
                  ? 'আপনার ইমেইল বা ফোন নম্বর দিন। কোনো স্প্যাম বা বিজ্ঞাপন পাঠানো হবে না।'
                  : 'Enter your email or mobile number. We will use it only for secure login codes.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {t('auth.emailOrPhone')}
              </label>
              <input
                type="text"
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={isBn ? '০১৭XXXXXXXX বা you@example.com' : 'e.g. 01712345678 or you@example.com'}
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl flex items-center gap-2.5 text-xs text-blue-800 dark:text-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{t('auth.stayPrivate')}</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-700/20 transition flex items-center justify-center gap-2"
            >
              <span>{t('common.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Password */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {isBn ? 'একটি সুরক্ষিত পাসওয়ার্ড দিন' : 'Create a password'}
              </h2>
              <p className="text-xs text-stone-500">
                {t('auth.passwordHint')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordMeter password={password} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {t('auth.confirmPassword')}
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                {t('common.back')}
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP Verification */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {t('auth.enterOtp')}
              </h2>
              <p className="text-xs text-stone-500">
                {isBn
                  ? `আমরা ${identifier} নম্বরে একটি ৬ সংখ্যার কোড পাঠিয়েছি। (যেকোনো ৬টি সংখ্যা লিখে পরীক্ষা করতে পারেন)`
                  : `We sent a mock 6-digit code to ${identifier}. (Any 6 digits will be accepted in demo).`}
              </p>
            </div>

            <OtpInput
              onComplete={handleOtpComplete}
              onResend={() => setFormError('')}
              error={otpError}
              isLocked={isOtpLocked}
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                {t('common.back')}
              </button>
              <button
                type="button"
                onClick={() => handleOtpComplete('123456')}
                className="text-xs text-blue-700 dark:text-blue-400 font-semibold hover:underline"
              >
                {isBn ? 'দ্রুত এগিয়ে যান (অটো-ফিল)' : 'Quick Auto-Verify (123456)'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Basic Info & 18+ Check */}
        {step === 4 && (
          <form onSubmit={handleStep4Submit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {isBn ? 'আপনার মৌলিক তথ্য' : 'A few basics'}
              </h2>
              <p className="text-xs text-stone-500">
                {isBn ? 'আপনার আসল নাম প্রয়োজন নেই। ছদ্মনামটিই যথেষ্ট।' : 'A real name is not needed. A nickname keeps you safe.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {isBn ? 'ছদ্মনাম বা ডাকনাম (ঐচ্ছিক)' : 'Nickname (Optional)'}
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Shanto, Nodi, বা নিজের পছন্দের নাম"
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Language Choice */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {isBn ? 'পছন্দের ভাষা' : 'Preferred Language'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredLang('en')}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                    preferredLang === 'en'
                      ? 'bg-blue-50 border-blue-600 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredLang('bn')}
                  className={`py-2.5 rounded-xl border text-xs font-semibold transition ${
                    preferredLang === 'bn'
                      ? 'bg-blue-50 border-blue-600 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                      : 'border-stone-200 dark:border-stone-700 text-stone-600'
                  }`}
                >
                  বাংলা (Bangla)
                </button>
              </div>
            </div>

            {/* 18+ Rule Checkbox (Required) */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOver18}
                  onChange={(e) => setIsOver18(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {t('auth.ageCheck')} <span className="text-rose-500">*</span>
                </span>
              </label>
              {!isOver18 && (
                <p className="text-[11px] text-stone-500 pl-7 leading-relaxed">
                  {isBn
                    ? 'পাথওয়ে প্রাপ্তবয়স্কদের (১৮+) সুস্থতার জন্য তৈরি। আপনি যদি ১৮ বছরের কম হন, তবে অনুগ্রহ করে আমাদের জরুরি হেল্পলাইনে যোগাযোগ করুন।'
                    : 'Pathway is designed for adults (18+). If you are under 18, please reach out to trusted national helplines.'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                {t('common.back')}
              </button>
              <button
                type="submit"
                disabled={!isOver18}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Consents Screen */}
        {step === 5 && (
          <form onSubmit={handleStep5Submit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {isBn ? 'গোপনীয়তা ও সম্মতির নিয়ন্ত্রণ' : 'Your Privacy Permissions'}
              </h2>
              <p className="text-xs text-stone-500">
                {isBn
                  ? 'প্রতিটি অনুমতি আপনার নিয়ন্ত্রণে। যেকোনো সময় প্রোফাইল থেকে পরিবর্তন করতে পারেন।'
                  : 'You choose what is enabled. Everything can be adjusted anytime in your profile.'}
              </p>
            </div>

            <div className="space-y-3">
              <ConsentSwitch
                id="consent-terms"
                required
                label={isBn ? 'ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতি' : 'Terms of Service & Privacy Policy'}
                description={
                  isBn
                    ? 'আমি পাথওয়ের ব্যবহারের শর্তাবলী ও নীতিমালায় সম্মতি জানাচ্ছি।'
                    : 'I agree to the Pathway Terms and acknowledge the zero-tracking privacy policy.'
                }
                checked={consentTerms}
                onChange={setConsentTerms}
              />

              <ConsentSwitch
                id="consent-ai"
                label={isBn ? 'এআই সহায়ক চ্যাট চালু রাখুন' : 'Enable AI Helper Companion'}
                description={
                  isBn
                    ? 'আকাঙ্ক্ষা ও মানসিক চাপ সামলাতে এআই সহায়কের সাহায্য নেওয়া (এটি কোনো ডাক্তার নয়)।'
                    : 'Allow the AI companion to offer calming exercises and coping prompts (not medical advice).'
                }
                checked={consentAiHelp}
                onChange={setConsentAiHelp}
              />

              <ConsentSwitch
                id="consent-memory"
                label={isBn ? 'এআই চ্যাট মেমোরি সংরক্ষণ' : 'Chatbot Private Memory'}
                description={
                  isBn
                    ? 'সহায়ক আপনার পছন্দের রিলাক্সেশন কৌশলগুলো মনে রাখবে যাতে পরে দ্রুত সাহায্য করতে পারে।'
                    : 'Allow the helper to remember your preferred coping tools across sessions. Can be cleared anytime.'
                }
                checked={consentChatbotMemory}
                onChange={setConsentChatbotMemory}
              />

              <ConsentSwitch
                id="consent-doctor-share"
                label={isBn ? 'ডাক্তারদের সাথে তথ্য শেয়ারের সুযোগ' : 'Allow Sharing with My Psychiatrist'}
                description={
                  isBn
                    ? 'বুকিংয়ের সময় চাইলে আপনার দৈনিক অগ্রগতি বা মেডিকেল রিপোর্ট ডাক্তারকে দেখাতে পারেন।'
                    : 'Enables you to select and share chosen check-ins or reports with doctors you book.'
                }
                checked={consentShareWithDoctors}
                onChange={setConsentShareWithDoctors}
              />
            </div>

            {/* Disclaimer Callout */}
            <div className="p-3.5 bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-[11px] text-stone-500 leading-relaxed">
              <strong>{isBn ? 'গুরুত্বপূর্ণ সতর্কবার্তা:' : 'Important Notice:'}</strong> {t('app.disclaimer')}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-3 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                {t('common.back')}
              </button>
              <button
                type="submit"
                disabled={!consentTerms}
                className="flex-1 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <span>{t('common.next')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 6: Short Skippable Onboarding */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {isBn ? 'আপনার সুস্থতার অগ্রাধিকার' : 'What would you like support with?'}
              </h2>
              <p className="text-xs text-stone-500">
                {isBn
                  ? 'এই তথ্যগুলো আপনার জন্য উপযোগী দৈনিক লক্ষ্য সাজাতে সাহায্য করবে। যেকোনো সময় পরিবর্তনযোগ্য।'
                  : 'This helps personalize your daily micro-habits. You can change this anytime.'}
              </p>
            </div>

            {/* Needs Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Substance & Alcohol Recovery',
                  'Sleep restoration',
                  'Stress management',
                  'Cravings & urge control',
                  'Building new daily habits'
                ].map((item) => {
                  const selected = selectedNeeds.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setSelectedNeeds((prev) =>
                          selected ? prev.filter((i) => i !== item) : [...prev, item]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        selected
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Triggers Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Common Times You Feel Urges
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Evening fatigue',
                  'Work pressure',
                  'Being alone',
                  'Peer pressure',
                  'Trouble falling asleep'
                ].map((item) => {
                  const selected = selectedTriggers.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setSelectedTriggers((prev) =>
                          selected ? prev.filter((i) => i !== item) : [...prev, item]
                        )
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        selected
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={finalizeRegistration}
                className="text-xs font-medium text-stone-500 hover:text-stone-800 underline"
              >
                {t('common.skip')}
              </button>
              <button
                type="button"
                onClick={finalizeRegistration}
                className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
              >
                <span>{isBn ? 'অ্যাকাউন্ট সম্পন্ন করুন' : 'Finish Setup'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Welcome Screen */}
        {step === 7 && (
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
                {isBn ? `স্বাগতম, ${nickname || 'সুধী'}!` : `Welcome to Pathway, ${nickname || 'Friend'}!`}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                {isBn
                  ? 'আপনার জন্য একটি নিরাপদ ও শান্ত স্থান প্রস্তুত হয়েছে। আসুন আপনার প্রথম ৪ মিনিটের প্রশান্তির অভ্যাস দিয়ে শুরু করি।'
                  : 'Your private recovery space is ready. You have earned 50 starting points and unlocked your First Step Anchor.'}
              </p>
            </div>

            {/* Suggested First Goal Card */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-left max-w-sm mx-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Suggested First Step
              </span>
              <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Box Breathing for Inner Peace
              </h4>
              <p className="text-xs text-stone-500">4 minutes &bull; +25 Points reward</p>
            </div>

            <button
              onClick={() => navigate('/my-day')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-700/20 transition flex items-center justify-center gap-2 mx-auto"
            >
              <span>{isBn ? 'আমার দিন (My Day) এ যান' : 'Go to My Day Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Duplicate Catch Notice & Login Link */}
        {step < 7 && (
          <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
            <span>{t('auth.hasAccount')} </span>
            <Link to="/login" className="font-semibold text-blue-700 dark:text-blue-400 hover:underline">
              {t('nav.login')}
            </Link>
          </div>
        )}
      </div>

      <Celebration
        show={showWelcomeCelebration}
        title="Welcome to Pathway!"
        subtitle="You earned 50 points and unlocked the First Step Anchor badge."
        points={50}
        onClose={() => setShowWelcomeCelebration(false)}
      />
    </div>
  );
};
