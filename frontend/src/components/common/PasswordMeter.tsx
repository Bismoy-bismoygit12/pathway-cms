import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordMeterProps {
  password: string;
}

export const PasswordMeter: React.FC<PasswordMeterProps> = ({ password }) => {
  const hasLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const criteriaMet = [hasLength, hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = 'Too Short';
  let strengthColor = 'bg-stone-200';

  if (criteriaMet === 1) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-rose-500';
  } else if (criteriaMet === 2) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-amber-500';
  } else if (criteriaMet === 3) {
    strengthLabel = 'Good';
    strengthColor = 'bg-blue-500';
  } else if (criteriaMet >= 4) {
    strengthLabel = 'Strong & Safe';
    strengthColor = 'bg-blue-600';
  }

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-500">Strength:</span>
        <span className="font-semibold text-stone-700 dark:text-stone-300">{strengthLabel}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        <div className={`rounded-full ${criteriaMet >= 1 ? strengthColor : 'bg-stone-200 dark:bg-stone-800'}`} />
        <div className={`rounded-full ${criteriaMet >= 2 ? strengthColor : 'bg-stone-200 dark:bg-stone-800'}`} />
        <div className={`rounded-full ${criteriaMet >= 3 ? strengthColor : 'bg-stone-200 dark:bg-stone-800'}`} />
        <div className={`rounded-full ${criteriaMet >= 4 ? strengthColor : 'bg-stone-200 dark:bg-stone-800'}`} />
      </div>

      <div className="text-[11px] space-y-1 text-stone-500 pt-1">
        <div className="flex items-center gap-1.5">
          {hasLength ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-stone-400" />}
          <span>At least 8 characters</span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasLetter && hasNumber ? <Check className="w-3 h-3 text-blue-600" /> : <X className="w-3 h-3 text-stone-400" />}
          <span>Mix of letters and numbers</span>
        </div>
      </div>
    </div>
  );
};
