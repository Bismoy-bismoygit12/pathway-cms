import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { OtpInput } from '../components/common/OtpInput';

export const Login: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('shanto@example.com');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPublicComputer, setIsPublicComputer] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockMinutes, setLockMinutes] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg(isBn ? 'দয়া করে ইমেইল বা ফোন নম্বর দিন' : 'Please provide your email or phone number.');
      return;
    }

    if (isOtpMode && !otpStep) {
      setOtpStep(true);
      return;
    }

    setLoading(true);
    const res = await login(identifier, password, isOtpMode, isPublicComputer);
    setLoading(false);

    if (res.success) {
      const from = (location.state as any)?.from?.pathname || '/my-day';
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || t('auth.wrongPasswordError'));
      if (res.isLocked) {
        setIsLocked(true);
        setLockMinutes(res.lockMinutes || 5);
      }
    }
  };

  const handleOtpVerified = async (code: string) => {
    setLoading(true);
    const res = await login(identifier, undefined, true, isPublicComputer);
    setLoading(false);

    if (res.success) {
      navigate('/my-day');
    } else {
      setErrorMsg(res.error || 'Invalid verification code.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-9 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center">
            <Heart className="w-5 h-5 fill-blue-600/20" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            {t('auth.loginTitle')}
          </h1>
          <p className="text-xs text-stone-500">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="p-3 bg-stone-50 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-500">Demo Account:</span>
          <button
            type="button"
            onClick={() => {
              setIdentifier('shanto@example.com');
              setPassword('Password123');
              setErrorMsg('');
              setIsLocked(false);
            }}
            className="font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            Autofill (Shanto)
          </button>
        </div>

        {/* Friendly Error or Lock Notice */}
        {errorMsg && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
              isLocked
                ? 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-200'
            }`}
          >
            {isLocked ? (
              <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="leading-relaxed">{errorMsg}</div>
              {isLocked && (
                <Link to="/forgot-password" className="font-semibold underline block pt-0.5">
                  Reset my password now
                </Link>
              )}
            </div>
          </div>
        )}

        {/* OTP Entry View */}
        {isOtpMode && otpStep ? (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                {t('auth.enterOtp')}
              </h3>
              <p className="text-xs text-stone-500">
                {isBn ? `${identifier} নম্বরে পাঠানো কোড দিন` : `Sent mock code to ${identifier}`}
              </p>
            </div>

            <OtpInput
              onComplete={handleOtpVerified}
              onResend={() => setErrorMsg('')}
            />

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="text-xs text-stone-500 hover:underline"
              >
                &larr; Change email or phone
              </button>
            </div>
          </div>
        ) : (
          /* Standard Login Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
                {t('auth.emailOrPhone')}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@example.com or 017XXXXXXXX"
                className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-4 py-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {!isOtpMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    {t('auth.password')}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-700 dark:text-blue-400 hover:underline font-medium"
                  >
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
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
              </div>
            )}

            {/* Checkboxes: Remember Me & Public Computer */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={isPublicComputer}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{t('auth.rememberMe')}</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer text-stone-600 dark:text-stone-300">
                <input
                  type="checkbox"
                  checked={isPublicComputer}
                  onChange={(e) => {
                    setIsPublicComputer(e.target.checked);
                    if (e.target.checked) setRememberMe(false);
                  }}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <div>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {t('auth.publicComputer')}
                  </span>
                  {isPublicComputer && (
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                      {t('auth.publicComputerNote')}
                    </p>
                  )}
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-700/20 transition flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>{isOtpMode ? t('common.next') : t('nav.login')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch between Password and OTP Login */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsOtpMode(!isOtpMode);
                  setErrorMsg('');
                }}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
              >
                {isOtpMode ? t('auth.loginWithPassword') : t('auth.loginWithOtp')}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-3 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500">
          <span>{t('auth.noAccount')} </span>
          <Link to="/signup" className="font-semibold text-blue-700 dark:text-blue-400 hover:underline">
            {t('nav.signup')}
          </Link>
        </div>
      </div>
    </div>
  );
};
