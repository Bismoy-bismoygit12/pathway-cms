import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { resetUserPassword } from '../services/auth';
import { PasswordMeter } from '../components/common/PasswordMeter';
import { OtpInput } from '../components/common/OtpInput';

export const ForgotPassword: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [step, setStep] = useState<'identify' | 'verify' | 'newPassword' | 'done'>('identify');
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleIdentifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg(isBn ? 'দয়া করে ইমেইল বা ফোন নম্বর দিন' : 'Please enter your email or phone number.');
      return;
    }
    setErrorMsg('');
    setStep('verify');
  };

  const handleOtpComplete = (code: string) => {
    if (code.length === 6) {
      setStep('newPassword');
    }
  };

  const handlePasswordResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg(isBn ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' : 'Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(isBn ? 'পাসওয়ার্ড মেলেনি' : 'Passwords do not match.');
      return;
    }

    const success = resetUserPassword(identifier, newPassword);
    if (success) {
      addNotification({
        category: 'security',
        title: 'Password changed successfully',
        titleBn: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে',
        body: 'Your Pathway password was reset. If this was not you, tap Get Help Now.',
        bodyBn: 'আপনার পাসওয়ার্ড পরিবর্তিত হয়েছে। এটি আপনি না করে থাকলে জরুরি যোগাযোগ করুন।',
        link: '/me'
      });
      setStep('done');
    } else {
      setErrorMsg('No registered account was found with that identifier.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-9 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {isBn ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-stone-500">
            {isBn
              ? 'আমরা একটি নিরাপদ কোডের মাধ্যমে আপনার পাসওয়ার্ড পুনরায় নির্ধারণে সাহায্য করব।'
              : 'We will verify with a one-time code so you can set a safe new password.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Identify */}
        {step === 'identify' && (
          <form onSubmit={handleIdentifySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {t('auth.emailOrPhone')}
              </label>
              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 017XXXXXXXX"
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition"
            >
              Send Reset Code
            </button>
          </form>
        )}

        {/* STEP 2: Verify Code */}
        {step === 'verify' && (
          <div className="space-y-5 text-center">
            <p className="text-xs text-stone-500">
              {isBn ? 'আপনার প্রাপ্ত ৬ সংখ্যার কোডটি দিন' : `Enter the 6-digit code sent to ${identifier}`}
            </p>
            <OtpInput onComplete={handleOtpComplete} />
            <button
              onClick={() => setStep('newPassword')}
              className="text-xs text-blue-700 dark:text-blue-400 font-semibold hover:underline"
            >
              Demo: Skip code entry &rarr;
            </button>
          </div>
        )}

        {/* STEP 3: Set New Password */}
        {step === 'newPassword' && (
          <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <PasswordMeter password={newPassword} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md transition"
            >
              Save New Password
            </button>
          </form>
        )}

        {/* STEP 4: Done */}
        {step === 'done' && (
          <div className="text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100">
              Password Changed!
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your password has been updated safely. You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition"
            >
              Go to Log In
            </button>
          </div>
        )}

        <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <Link to="/login" className="text-stone-500 hover:underline">
            &larr; Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
