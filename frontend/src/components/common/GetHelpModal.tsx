import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Copy, Check, AlertTriangle, ShieldCheck, Heart, X, ExternalLink } from 'lucide-react';
import emergencyData from '../../data/emergency.json';
import { useLanguage } from '../../context/LanguageContext';

interface GetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetHelpModal: React.FC<GetHelpModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isBn = language === 'bn';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Calm warm header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-800 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            aria-label={t('common.close')}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-medium mb-3 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-rose-300" />
            <span>{isBn ? 'আমরা আপনার সাথে আছি' : 'You are safe. We are right here.'}</span>
          </div>
          <h2 id="emergency-modal-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('app.getHelpNow')}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mt-1.5 leading-relaxed">
            {isBn
              ? '২৪ ঘণ্টা বিনামূল্যে জরুরি সেবা। কোনো লগইন, অ্যাকাউন্ট বা খরচের প্রয়োজন নেই।'
              : 'Available 24/7. Completely free. No login, account, or payment needed.'}
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Medical Danger Warning Card */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong className="font-semibold block mb-1 text-sm sm:text-base">
                {isBn ? emergencyData.medicalDangerWarning.titleBn : emergencyData.medicalDangerWarning.title}
              </strong>
              {isBn ? emergencyData.medicalDangerWarning.messageBn : emergencyData.medicalDangerWarning.message}
            </div>
          </div>

          {/* Key Helplines */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {isBn ? 'সরাসরি জরুরি হটলাইন' : 'Direct Emergency Helplines'}
            </h3>

            <div className="grid gap-3">
              {emergencyData.hotlines.map((hotline) => (
                <div
                  key={hotline.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    hotline.isPrimary
                      ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                      : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                        {isBn ? hotline.nameBn : hotline.name}
                      </h4>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                        {isBn ? hotline.hoursBn : hotline.hours}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                      {isBn ? hotline.descriptionBn : hotline.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(hotline.id, hotline.number)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition"
                      title={t('common.copyNumber')}
                    >
                      {copiedId === hotline.id ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === hotline.id ? t('common.copied') : t('common.copyNumber')}</span>
                    </button>

                    <a
                      href={`tel:${hotline.number}`}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{t('common.callNow')}: {hotline.number}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Link to Full Directory */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            <span>
              {isBn
                ? 'হাসপাতাল ও নিরাময় কেন্দ্রের বিস্তারিত তালিকা দেখতে চান?'
                : 'Need full hospital and rehab center addresses?'}
            </span>
            <button
              onClick={() => {
                onClose();
                navigate('/emergency');
              }}
              className="font-medium text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{isBn ? 'সম্পূর্ণ জরুরি নির্দেশিকা খুলুন' : 'Open Full Emergency Directory'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
