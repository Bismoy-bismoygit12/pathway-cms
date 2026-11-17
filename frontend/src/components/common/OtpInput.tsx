import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface OtpInputProps {
  onComplete: (code: string) => void;
  onResend?: () => void;
  error?: string;
  isLocked?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({ onComplete, onResend, error, isLocked }) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    let timer: any = null;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleChange = (index: number, val: string) => {
    if (isLocked) return;
    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...digits];

    if (clean.length > 1) {
      // Pasted full OTP
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setDigits(newDigits);
      if (pasted.length === 6) {
        onComplete(newDigits.join(''));
      }
      return;
    }

    newDigits[index] = clean;
    setDigits(newDigits);

    if (clean && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== '')) {
      onComplete(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendClick = () => {
    if (countdown === 0 && onResend) {
      setCountdown(30);
      setDigits(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
      onResend();
    }
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center items-center gap-2 sm:gap-3">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={isLocked}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        ))}
      </div>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

      <div className="text-xs text-stone-500 flex items-center justify-center gap-1.5 pt-1">
        {countdown > 0 ? (
          <span>{t('auth.resendWait', { sec: countdown })}</span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isLocked}
            className="font-semibold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('auth.resendOtp')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
