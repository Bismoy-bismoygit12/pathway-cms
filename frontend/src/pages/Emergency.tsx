import React, { useState } from 'react';
import { Phone, Copy, Check, AlertTriangle, ShieldCheck, MapPin, Building2, Search, Filter } from 'lucide-react';
import emergencyData from '../data/emergency.json';
import { useLanguage } from '../context/LanguageContext';

export const Emergency: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCenters = emergencyData.centers.filter((c) => {
    const matchesDistrict = selectedDistrict === 'all' || c.city.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameBn.includes(searchQuery) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Title & Warm Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5" />
          <span>{isBn ? 'জরুরি সেবা ও সহায়তা' : 'Immediate Crisis & Helplines'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {t('emergency.title')}
        </h1>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
          {t('emergency.subtitle')}
        </p>
      </div>

      {/* Medical Danger Warning Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 shadow-xs flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
          <h3 className="font-bold text-base">
            {isBn ? emergencyData.medicalDangerWarning.titleBn : emergencyData.medicalDangerWarning.title}
          </h3>
          <p>
            {isBn ? emergencyData.medicalDangerWarning.messageBn : emergencyData.medicalDangerWarning.message}
          </p>
        </div>
      </div>

      {/* 3 Risk Levels Guide */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          {isBn ? 'মানসিক অবস্থার মাত্রা ও করণীয়' : 'Assessment of Needs'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Low Concern */}
          <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2">
            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase">
              {isBn ? emergencyData.riskLevels.low.levelBn : emergencyData.riskLevels.low.level}
            </span>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {isBn ? emergencyData.riskLevels.low.titleBn : emergencyData.riskLevels.low.title}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {isBn ? emergencyData.riskLevels.low.descriptionBn : emergencyData.riskLevels.low.description}
            </p>
          </div>

          {/* Elevated Concern */}
          <div className="p-5 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase">
              {isBn ? emergencyData.riskLevels.elevated.levelBn : emergencyData.riskLevels.elevated.level}
            </span>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">
              {isBn ? emergencyData.riskLevels.elevated.titleBn : emergencyData.riskLevels.elevated.title}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              {isBn ? emergencyData.riskLevels.elevated.descriptionBn : emergencyData.riskLevels.elevated.description}
            </p>
          </div>

          {/* Imminent Concern */}
          <div className="p-5 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase">
              {isBn ? emergencyData.riskLevels.imminent.levelBn : emergencyData.riskLevels.imminent.level}
            </span>
            <h4 className="font-bold text-rose-900 dark:text-rose-100 text-sm">
              {isBn ? emergencyData.riskLevels.imminent.titleBn : emergencyData.riskLevels.imminent.title}
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
              {isBn ? emergencyData.riskLevels.imminent.descriptionBn : emergencyData.riskLevels.imminent.description}
            </p>
          </div>
        </div>
      </div>

      {/* Hotlines List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          {isBn ? 'সরাসরি জরুরি হটলাইন নম্বর' : 'Emergency Hotlines'}
        </h2>

        <div className="grid gap-3">
          {emergencyData.hotlines.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                    {isBn ? item.nameBn : item.name}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                    {isBn ? item.hoursBn : item.hours}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {isBn ? item.descriptionBn : item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(item.id, item.number)}
                  className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-blue-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === item.id ? t('common.copied') : t('common.copyNumber')}</span>
                </button>

                <a
                  href={`tel:${item.number}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('common.callNow')}: {item.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospitals and Rehabilitation Centers Directory */}
      <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t('emergency.findCenters')}
            </h2>
            <p className="text-xs text-stone-500">
              {isBn ? 'স্বীকৃত সরকারি ও বেসরকারি পুনর্বাসন ও মনোরোগ চিকিৎসা কেন্দ্র' : 'Accredited clinical institutions and recovery clinics'}
            </p>
          </div>

          {/* District filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-slate-900 text-stone-800 dark:text-stone-200"
            >
              <option value="all">{isBn ? 'সকল জেলা' : 'All Cities'}</option>
              <option value="dhaka">Dhaka (ঢাকা)</option>
              <option value="gazipur">Gazipur (গাজীপুর)</option>
              <option value="chattogram">Chattogram (চট্টগ্রাম)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    {isBn ? center.nameBn : center.name}
                  </h3>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0">
                  {isBn ? center.typeBn : center.type}
                </span>
              </div>

              <div className="text-xs text-stone-500 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <span>{isBn ? center.addressBn : center.address}</span>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {center.phone}
                </span>
                <a
                  href={`tel:${center.phone}`}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100 font-semibold text-xs transition inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Hospital</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
