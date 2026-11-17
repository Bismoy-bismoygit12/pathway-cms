import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Stethoscope,
  Video,
  Building2,
  Calendar,
  Sparkles,
  HelpCircle,
  X,
  Star,
  Clock,
  ArrowRight,
  UserPlus,
  CheckCircle2,
  Trash2,
  MapPin,
  Check,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  getAllDoctors,
  fetchDoctorsFromBackend,
  filterAndSortDoctors,
  recommendDoctors,
  DoctorFilterOptions,
  addDoctor,
  deleteDoctor
} from '../services/doctors';
import { Doctor } from '../types';

const PRESET_AVATARS = [
  { label: 'Dr. Male 1', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face' },
  { label: 'Dr. Female 1', url: 'https://images.unsplash.com/photo-1594824813575-573516428e24?w=300&h=300&fit=crop&crop=face' },
  { label: 'Dr. Male 2', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face' },
  { label: 'Dr. Female 2', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face' },
  { label: 'Dr. Male 3', url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face' },
  { label: 'Dr. Female 3', url: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop&crop=face' },
];

const SPECIALTY_OPTIONS = [
  { en: 'Substance & Alcohol Recovery', bn: 'নেশা ও মাদকাসক্তি মুক্তি' },
  { en: 'Sleep & Insomnia', bn: 'ঘুম ও অনিদ্রা নিরাময়' },
  { en: 'Depression & Mood Care', bn: 'হতাশা ও মেজাজ ব্যবস্থাপনা' },
  { en: 'Anxiety & Panic', bn: 'উদ্বেগ ও প্যানিক প্রতিরোধ' },
  { en: 'Relapse Prevention', bn: 'পুনরায় আসক্তি প্রতিরোধ' },
  { en: "Women's Recovery Support", bn: 'নারীদের মানসিক সহায়তা' },
  { en: 'Family & Caregiver Support', bn: 'পারিবারিক ও পরিচর্যাকারী সহায়তা' },
];

export const FindPsychiatrist: React.FC = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'online' | 'in_person'>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'female' | 'male'>('all');
  const [sortBy, setSortBy] = useState<'earliest' | 'lowestFee' | 'experience'>('earliest');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDoctorsFromBackend().then(() => setRefreshKey((k) => k + 1));
  }, []);

  // Success Alert State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Help Me Choose Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizConcern, setQuizConcern] = useState('cravings');
  const [quizMode, setQuizMode] = useState<'online' | 'in_person' | 'any'>('online');
  const [quizGender, setQuizGender] = useState<'female' | 'male' | 'any'>('any');
  const [recommendedList, setRecommendedList] = useState<Doctor[] | null>(null);

  // Add Doctor Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const initialFormState = {
    name: '',
    nameBn: '',
    title: 'Consultant Psychiatrist',
    titleBn: 'কনসালটেন্ট সাইকিয়াট্রিস্ট',
    qualifications: '',
    experienceYears: 8,
    photo: PRESET_AVATARS[0].url,
    gender: 'male' as 'male' | 'female',
    languages: ['Bangla', 'English'],
    languagesBn: ['বাংলা', 'ইংরেজি'],
    specialties: ['Substance & Alcohol Recovery'],
    specialtiesBn: ['নেশা ও মাদকাসক্তি মুক্তি'],
    feeBDT: 1500,
    hospital: '',
    hospitalBn: '',
    clinicAddress: '',
    clinicAddressBn: '',
    city: 'Dhaka',
    cityBn: 'ঢাকা',
    consultationModes: ['online', 'in_person'] as ('online' | 'in_person')[],
    nextFreeSlot: 'Today, 5:00 PM',
    nextFreeSlotBn: 'আজ, বিকাল ৫:০০',
    about: '',
    aboutBn: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const filterOptions: DoctorFilterOptions = {
    searchQuery,
    specialty: selectedSpecialty,
    language: selectedLanguage,
    mode: selectedMode,
    gender: selectedGender,
    sortBy
  };

  const doctors = useMemo(() => {
    return filterAndSortDoctors(filterOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedSpecialty, selectedLanguage, selectedMode, selectedGender, sortBy, refreshKey]);

  const handleRunQuiz = () => {
    const recs = recommendDoctors({
      concern: quizConcern,
      mode: quizMode,
      genderPref: quizGender
    });
    setRecommendedList(recs);
  };

  const handleToggleSpecialty = (specEn: string, specBn: string) => {
    if (formData.specialties.includes(specEn)) {
      if (formData.specialties.length === 1) return; // Keep at least one
      setFormData({
        ...formData,
        specialties: formData.specialties.filter((s) => s !== specEn),
        specialtiesBn: formData.specialtiesBn.filter((s) => s !== specBn),
      });
    } else {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specEn],
        specialtiesBn: [...formData.specialtiesBn, specBn],
      });
    }
  };

  const handleToggleMode = (mode: 'online' | 'in_person') => {
    if (formData.consultationModes.includes(mode)) {
      if (formData.consultationModes.length === 1) return; // Keep at least one
      setFormData({
        ...formData,
        consultationModes: formData.consultationModes.filter((m) => m !== mode),
      });
    } else {
      setFormData({
        ...formData,
        consultationModes: [...formData.consultationModes, mode],
      });
    }
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError(isBn ? 'অনুগ্রহ করে ডাক্তারের পুরো নাম প্রদান করুন।' : 'Please enter the doctor\'s full name.');
      return;
    }
    if (!formData.qualifications.trim()) {
      setFormError(isBn ? 'অনুগ্রহ করে ডাক্তারের শিক্ষাগত যোগ্যতা প্রদান করুন (যেমন MBBS, FCPS)।' : 'Please specify medical qualifications (e.g. MBBS, FCPS).');
      return;
    }
    if (!formData.hospital.trim()) {
      setFormError(isBn ? 'অনুগ্রহ করে সংযুক্ত হাসপাতাল বা ক্লিনিকের নাম প্রদান করুন।' : 'Please enter the hospital or medical center affiliation.');
      return;
    }
    if (!formData.feeBDT || formData.feeBDT <= 0) {
      setFormError(isBn ? 'সঠিক পরামর্শ ফি (BDT) উল্লেখ করুন।' : 'Please enter a valid consultation fee in BDT.');
      return;
    }

    // Auto-fill Bangla counterparts if left empty
    const preparedDoctor: Omit<Doctor, 'id'> = {
      ...formData,
      nameBn: formData.nameBn.trim() || formData.name.trim(),
      titleBn: formData.titleBn.trim() || formData.title.trim(),
      hospitalBn: formData.hospitalBn.trim() || formData.hospital.trim(),
      clinicAddress: formData.clinicAddress.trim() || `${formData.hospital.trim()}, ${formData.city}`,
      clinicAddressBn: formData.clinicAddressBn.trim() || (formData.clinicAddress.trim() || `${formData.hospital.trim()}, ${formData.city}`),
      cityBn: formData.city === 'Dhaka' ? 'ঢাকা' : formData.city === 'Chittagong' ? 'চট্টগ্রাম' : formData.city === 'Sylhet' ? 'সিলেট' : formData.city,
      about: formData.about.trim() || `Dedicated psychiatrist with ${formData.experienceYears} years of medical experience at ${formData.hospital}, committed to evidence-based compassionate care.`,
      aboutBn: formData.aboutBn.trim() || (isBn ? `${formData.hospital}-এ কর্মরত অভিজ্ঞ বিশেষজ্ঞ চিকিৎসক, মানসিক স্বাস্থ্য ও আরোগ্যে নিবেদিতপ্রাণ।` : `Dedicated psychiatrist with ${formData.experienceYears} years of medical experience.`),
      nextFreeSlot: formData.nextFreeSlot || 'Today, 5:00 PM',
      nextFreeSlotBn: formData.nextFreeSlotBn || 'আজ, বিকাল ৫:০০',
    };

    const newDoc = addDoctor(preparedDoctor);
    setRefreshKey((k) => k + 1);
    setIsAddModalOpen(false);
    setFormData(initialFormState);
    setSuccessMessage(
      isBn
        ? `ডাঃ ${newDoc.nameBn} সফলভাবে যুক্ত হয়েছেন এবং পরামর্শের জন্য প্রস্তুত!`
        : `Dr. ${newDoc.name} has been added successfully and is now active in the directory!`
    );
    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const handleDeleteDoctor = (id: string, name: string) => {
    if (window.confirm(isBn ? `আপনি কি নিশ্চিতভাবে "${name}"-কে ডিরেক্টরি থেকে মুছে ফেলতে চান?` : `Are you sure you want to remove "${name}" from the directory?`)) {
      deleteDoctor(id);
      setRefreshKey((k) => k + 1);
      setSuccessMessage(isBn ? 'ডাক্তারের তথ্য মুছে ফেলা হয়েছে।' : 'Doctor profile has been removed.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Success Toast */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100 flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{successMessage}</p>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            {isBn ? 'বিশেষজ্ঞ সাইকিয়াট্রিস্ট ডিরেক্টরি' : 'Registered Psychiatrist Directory'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('doctors.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t('doctors.subtitle')}
          </p>
        </div>

        {/* Action Buttons: Add Doctor & Help Me Choose */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              setFormError(null);
              setIsAddModalOpen(true);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isBn ? '+ নতুন ডাক্তার যুক্ত করুন' : '+ Add Doctor'}</span>
          </button>

          <button
            onClick={() => {
              setIsQuizOpen(true);
              setRecommendedList(null);
            }}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-semibold text-xs sm:text-sm hover:bg-blue-100/60 transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{t('doctors.helpMeChoose')}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        {/* Search Input - Visually clear with high-contrast text */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'নাম, হাসপাতাল বা লক্ষণ দিয়ে খুঁজুন...' : 'Search doctor name, hospital, or specialty...'}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
          />
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {/* Specialty */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Specialties</option>
              <option value="Substance & Alcohol Recovery">Substance & Alcohol Recovery</option>
              <option value="Sleep & Insomnia">Sleep & Insomnia</option>
              <option value="Depression & Mood Care">Depression & Mood Care</option>
              <option value="Anxiety & Panic">Anxiety & Panic</option>
              <option value="Relapse Prevention">Relapse Prevention</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Consultation Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Modes</option>
              <option value="online">Online Video/Audio</option>
              <option value="in_person">In Person (Clinic)</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Doctor Gender
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">Any Gender</option>
              <option value="female">Female Doctors</option>
              <option value="male">Male Doctors</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Languages</option>
              <option value="Bangla">Bangla</option>
              <option value="English">English</option>
              <option value="Sylheti">Sylheti</option>
              <option value="Chittagonian">Chittagonian</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="earliest">Earliest Slot Available</option>
              <option value="lowestFee">Lowest Fee First</option>
              <option value="experience">Most Experience First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="space-y-4">
        {doctors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Stethoscope className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
              {isBn ? 'কোনো ডাক্তার পাওয়া যায়নি' : 'No doctors match your exact filter'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isBn
                ? 'ফিল্টার সমন্বয় করুন অথবা সম্পূর্ণ ডিরেক্টরি দেখতে ফিল্টার রিসেট করুন।'
                : 'Try adjusting your specialty or consultation mode filter, or reset filters to browse all verified specialists.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialty('all');
                setSelectedLanguage('all');
                setSelectedMode('all');
                setSelectedGender('all');
              }}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline pt-1 cursor-pointer"
            >
              {isBn ? 'সকল ফিল্টার রিসেট করুন' : 'Reset all filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doc) => {
              const isCustom = doc.id.startsWith('dr-custom');

              return (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-blue-400 dark:hover:border-blue-600 transition group relative"
                >
                  {/* Custom Doctor Badge & Delete button */}
                  {isCustom && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {isBn ? 'নতুন যোগকৃত' : 'Added by You'}
                      </span>
                      <button
                        onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                        title={isBn ? 'ডাক্তার মুছুন' : 'Delete doctor'}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Doctor Info Row */}
                    <div className="flex items-start gap-4 pr-12">
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                        onError={(e) => {
                          // Fallback to medical avatar placeholder if broken URL
                          (e.currentTarget as HTMLImageElement).src = PRESET_AVATARS[0].url;
                        }}
                      />
                      <div className="space-y-1">
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                          {isBn ? doc.nameBn : doc.name}
                        </h3>
                        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                          {isBn ? doc.titleBn : doc.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{doc.qualifications}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {doc.experienceYears} {isBn ? 'বছরের অভিজ্ঞতা' : 'yrs experience'}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {doc.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hospital / Clinic Affiliation */}
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{isBn ? doc.hospitalBn : doc.hospital}</span>
                    </div>

                    {/* About summary */}
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {isBn ? doc.aboutBn : doc.about}
                    </p>

                    {/* Specialties & Languages badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {(isBn ? doc.specialtiesBn : doc.specialties).map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                      {(isBn ? doc.languagesBn : doc.languages).map((l, idx) => (
                        <span
                          key={`lang-${idx}`}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900"
                        >
                          {l}
                        </span>
                      ))}
                    </div>

                    {/* Next slot badge & modes */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between text-xs border border-slate-200/80 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t('doctors.nextSlot')}:</span>
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {isBn ? doc.nextFreeSlotBn : doc.nextFreeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Bottom */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                        {t('doctors.fee')}
                      </span>
                      <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                        ৳{doc.feeBDT}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/doctor/${doc.id}`}
                        className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        {t('doctors.viewProfile')}
                      </Link>

                      <Link
                        to={isAuthenticated ? `/book/${doc.id}` : '/login'}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition"
                      >
                        {t('doctors.bookVisit')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          ADD DOCTOR MODAL FORM
         ========================================================================= */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-2xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                    {isBn ? 'নতুন ডাক্তার / সাইকিয়াট্রিস্টের তথ্য যুক্ত করুন' : 'Add Psychiatrist / Specialist'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isBn
                      ? 'ডাক্তারের প্রয়োজনীয় তথ্য প্রদান করে ডিরেক্টরিতে অন্তর্ভুক্ত করুন।'
                      : 'Provide doctor credentials, chamber details, and consultation modes.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddDoctorSubmit} className="space-y-5">
              {/* Row 1: Doctor Name (English & Bangla) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Doctor Full Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sabrina Chowdhury"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Doctor Name (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="যেমন: ডাঃ সাবরিনা চৌধুরী"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Row 2: Professional Title & Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Associate Professor & Addiction Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Qualifications <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    placeholder="e.g. MBBS, FCPS (Psychiatry), MD"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* Row 3: Hospital & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Hospital / Medical Center Affiliation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="e.g. National Institute of Mental Health (NIMH)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    City Location
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barisal">Barisal (বরিশাল)</option>
                    <option value="Rangpur">Rangpur (রংপুর)</option>
                    <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                    <option value="Comilla">Comilla (কুমিল্লা)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Experience, Fee, Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Consultation Fee (BDT ৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={200}
                    step={100}
                    required
                    value={formData.feeBDT}
                    onChange={(e) => setFormData({ ...formData, feeBDT: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    Doctor Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="male">Male Doctor</option>
                    <option value="female">Female Doctor</option>
                  </select>
                </div>
              </div>

              {/* Consultation Modes Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Available Consultation Modes
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleToggleMode('online')}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                      formData.consultationModes.includes('online')
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <Video className="w-4 h-4 text-blue-600" />
                    <span>Online Video / Audio Consultation</span>
                    {formData.consultationModes.includes('online') && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleMode('in_person')}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                      formData.consultationModes.includes('in_person')
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>In-Person Chamber Visit</span>
                    {formData.consultationModes.includes('in_person') && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Specialties Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Clinical Specialties (Select one or more)
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTY_OPTIONS.map((opt) => {
                    const isSelected = formData.specialties.includes(opt.en);
                    return (
                      <button
                        key={opt.en}
                        type="button"
                        onClick={() => handleToggleSpecialty(opt.en, opt.bn)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        <span>{isBn ? opt.bn : opt.en}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Doctor Avatar Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  Doctor Profile Picture (Choose preset or enter custom image URL)
                </label>
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, photo: av.url })}
                      className={`relative rounded-2xl overflow-hidden shrink-0 border-2 transition p-0.5 cursor-pointer ${
                        formData.photo === av.url
                          ? 'border-blue-600 ring-2 ring-blue-500/40 scale-105'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 opacity-80'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-12 h-12 rounded-xl object-cover" />
                    </button>
                  ))}
                </div>

                <div className="mt-2 relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="url"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    placeholder="Or paste external photo URL..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Doctor Bio / About */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  About the Doctor / Clinical Background
                </label>
                <textarea
                  rows={3}
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  placeholder="Summarize expertise, clinical background, counseling approach, and patient care philosophy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isBn ? 'সংরক্ষণ ও যুক্ত করুন' : 'Save & Add Doctor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          HELP ME CHOOSE QUIZ MODAL (3 simple questions)
         ========================================================================= */}
      {isQuizOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {t('doctors.helpMeChoose')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Answer 3 simple questions to find your match</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuizOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!recommendedList ? (
              <div className="space-y-4 text-xs">
                {/* Q1: Primary Concern */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    1. What is your primary area of focus right now?
                  </label>
                  <select
                    value={quizConcern}
                    onChange={(e) => setQuizConcern(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    <option value="cravings">Cravings, Urges & Substance Recovery</option>
                    <option value="sleep">Sleep Problems & Insomnia Restoration</option>
                    <option value="depression">Low Mood, Emptiness & Depression</option>
                    <option value="family">Family Relationship & Caregiver Support</option>
                  </select>
                </div>

                {/* Q2: Mode */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    2. Do you prefer online or in-person visits?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['online', 'in_person', 'any'].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setQuizMode(m as any)}
                        className={`p-2 rounded-xl border capitalize transition cursor-pointer ${
                          quizMode === m
                            ? 'bg-blue-50 border-blue-600 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {m === 'in_person' ? 'Clinic' : m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q3: Gender */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">
                    3. Do you have a doctor gender preference?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['female', 'male', 'any'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setQuizGender(g as any)}
                        className={`p-2 rounded-xl border capitalize transition cursor-pointer ${
                          quizGender === g
                            ? 'bg-blue-50 border-blue-600 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunQuiz}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs transition mt-2 cursor-pointer"
                >
                  Show Recommended Psychiatrists
                </button>
              </div>
            ) : (
              /* Recommended Doctors Results */
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  Recommended for your needs:
                </span>
                <div className="space-y-2">
                  {recommendedList.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.photo}
                          alt={doc.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {doc.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400">
                            {doc.experienceYears} yrs exp &bull; ৳{doc.feeBDT}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/book/${doc.id}`}
                        onClick={() => setIsQuizOpen(false)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs"
                      >
                        Book
                      </Link>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setRecommendedList(null)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline pt-2 block text-center w-full cursor-pointer"
                >
                  &larr; Try different answers
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
