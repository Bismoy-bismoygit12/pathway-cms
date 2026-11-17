import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, ArrowRight, Heart, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      {/* Reference-Inspired Royal Blue Action Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <PhoneCall className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isBn ? 'একটি সুস্থ আগামীর জন্য আপনার পাশে' : 'Dedicated to Your Health & Well-Being'}
              </h3>
              <p className="text-xs text-blue-100 font-normal">
                {isBn
                  ? 'গোপনীয় ও নির্ভরযোগ্য সহযোগিতায় প্রতিটি পদক্ষেপ হোক আত্মবিশ্বাসী।'
                  : 'Accessible recovery tools and verified psychiatric consultations across Bangladesh.'}
              </p>
            </div>
          </div>

          <Link
            to="/emergency"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-900 font-bold text-xs shadow-md transition-all transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            <span>{isBn ? 'জরুরি সহায়তা নিন' : 'Get Help Now'}</span>
            <ArrowRight className="w-4 h-4 text-blue-700" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Main 4-Column Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-700 flex items-center justify-center p-1.5 shadow-sm shadow-blue-700/20">
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute w-full h-1.5 bg-cyan-400 rounded-full" />
                  <div className="absolute h-full w-1.5 bg-white rounded-full" />
                </div>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                {t('app.name')}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t('app.tagline')}
            </p>

            <div className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-900/40">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isBn ? '১০০% তথ্য গোপনীয়তার অঙ্গীকার' : 'Zero-tracking privacy pledge'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3">
              {isBn ? 'সেবাসমূহ' : 'Support & Care'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/doctors" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.doctors')}
                </Link>
              </li>
              <li>
                <Link to="/library" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.library')}
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="hover:text-rose-600 dark:hover:text-rose-400 transition font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" />
                  <span>{t('app.getHelpNow')}</span>
                </Link>
              </li>
              <li>
                <Link to="/relapse-support" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.relapse')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & FAQs */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3">
              {isBn ? 'তথ্য ও সহায়তা' : 'Company & Help'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Policies */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3">
              {isBn ? 'নীতিমালা ও নিরাপত্তা' : 'Privacy & Terms'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Required Medical Disclaimer Banner */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            {t('app.disclaimer')}
          </p>
          <div className="text-[11px] text-slate-400 shrink-0">
            &copy; {new Date().getFullYear()} Pathway. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
