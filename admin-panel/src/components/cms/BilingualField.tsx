import React from 'react';
import { Input, Textarea } from '@/components/ui/Input';

interface BilingualFieldProps {
  label: string;
  valueEn: string;
  valueBn: string;
  onChangeEn: (val: string) => void;
  onChangeBn: (val: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholderEn?: string;
  placeholderBn?: string;
  disabled?: boolean;
}

export const BilingualField: React.FC<BilingualFieldProps> = ({
  label,
  valueEn,
  valueBn,
  onChangeEn,
  onChangeBn,
  multiline = false,
  rows = 3,
  placeholderEn,
  placeholderBn,
  disabled = false,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            English (EN)
          </span>
          {multiline ? (
            <Textarea
              rows={rows}
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholderEn}
              disabled={disabled}
            />
          ) : (
            <Input
              value={valueEn}
              onChange={(e) => onChangeEn(e.target.value)}
              placeholder={placeholderEn}
              disabled={disabled}
            />
          )}
        </div>
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Bangla (বাংলা)
          </span>
          {multiline ? (
            <Textarea
              rows={rows}
              value={valueBn}
              onChange={(e) => onChangeBn(e.target.value)}
              placeholder={placeholderBn}
              disabled={disabled}
              className="font-bn"
            />
          ) : (
            <Input
              value={valueBn}
              onChange={(e) => onChangeBn(e.target.value)}
              placeholder={placeholderBn}
              disabled={disabled}
              className="font-bn"
            />
          )}
        </div>
      </div>
    </div>
  );
};
