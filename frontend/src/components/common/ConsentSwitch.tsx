import React from 'react';

interface ConsentSwitchProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}

export const ConsentSwitch: React.FC<ConsentSwitchProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  required = false
}) => {
  return (
    <div className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 transition">
      <div className="space-y-0.5">
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2 cursor-pointer">
          <span>{label}</span>
          {required ? (
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded">
              Required
            </span>
          ) : (
            <span className="text-[10px] text-stone-400 font-normal">Optional</span>
          )}
        </label>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          {description}
        </p>
      </div>

      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? 'bg-blue-700' : 'bg-stone-300 dark:bg-stone-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
