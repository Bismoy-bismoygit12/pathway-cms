import en from './en.json';
import bn from './bn.json';

export type Language = 'en' | 'bn';

const translations: Record<Language, any> = { en, bn };

export function getNestedTranslation(obj: any, path: string): string | undefined {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function translate(key: string, lang: Language = 'en', params?: Record<string, string | number>): string {
  let val = getNestedTranslation(translations[lang], key) || getNestedTranslation(translations.en, key) || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      val = val.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return val;
}

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaDigits(input: number | string): string {
  return String(input).replace(/[0-9]/g, (w) => bnDigits[+w]);
}

export function formatLocalizedNumber(num: number | string, lang: Language): string {
  if (lang === 'bn') {
    return toBanglaDigits(num);
  }
  return String(num);
}

export function formatLocalizedCurrency(amount: number, lang: Language): string {
  if (lang === 'bn') {
    return `৳${toBanglaDigits(amount)}`;
  }
  return `BDT ${amount.toLocaleString()}`;
}
