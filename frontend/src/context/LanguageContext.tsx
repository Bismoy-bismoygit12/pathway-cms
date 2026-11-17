import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translate, formatLocalizedNumber, formatLocalizedCurrency, toBanglaDigits } from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (val: number | string) => string;
  formatCurrency: (amount: number) => string;
  formatBDT: (amount: number) => string;
  toBanglaDigits: (val: number | string) => string;
  formatLocalizedDate: (dateStr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pathway_language');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pathway_language', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>) => {
    return translate(key, language, params);
  };

  const formatNumber = (val: number | string) => {
    return formatLocalizedNumber(val, language);
  };

  const formatCurrency = (amount: number) => {
    return formatLocalizedCurrency(amount, language);
  };

  const formatBDT = (amount: number) => {
    return formatLocalizedCurrency(amount, language);
  };

  const toDigits = (val: number | string) => {
    return language === 'bn' ? toBanglaDigits(val) : String(val);
  };

  const formatLocalizedDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      if (language === 'bn') {
        const banglaMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
        return `${toBanglaDigits(d.getDate())} ${banglaMonths[d.getMonth()]}, ${toBanglaDigits(d.getFullYear())}`;
      }
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      formatNumber,
      formatCurrency,
      formatBDT,
      toBanglaDigits: toDigits,
      formatLocalizedDate
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
