import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  LifeBuoy,
  ArrowRight,
  Lock,
  ChevronRight,
  Stethoscope,
  Smile,
  BookOpen,
  Award,
  FlaskConical,
  Globe2,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getAllDoctors } from '../services/doctors';
import articlesData from '../data/articles.json';
import { GetHelpModal } from '../components/common/GetHelpModal';
import { HeroPharmaCarousel } from '../components/home/HeroPharmaCarousel';

export const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const isBn = language === 'bn';
  const featuredDoctors = getAllDoctors().slice(0, 3);
  const featuredArticles = articlesData.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section with Pharmaceutical Image Carousel */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-8 sm:pb-16 bg-gradient-to-b from-blue-50/60 via-slate-50/50 to-white dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-950 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Category Overline Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 text-xs font-semibold border border-blue-200/80 dark:border-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{isBn ? 'সহমর্মিতা ও ভরসার নতুন ঠিকানা' : 'Better Support. Brighter Lives.'}</span>
              </div>

              {/* High-Impact Main Heading Inspired by Reference */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {isBn ? (
                  <>
                    শান্ত পদক্ষেপে সুস্থতা। <br />
                    <span className="text-blue-600 dark:text-blue-400">উজ্জ্বল আগামী।</span>
                  </>
                ) : (
                  <>
                    Better Support. <br />
                    <span className="text-blue-600 dark:text-blue-400">Brighter Lives.</span>
                  </>
                )}
              </h1>

              {/* Subheading Description */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-normal max-w-xl">
                {isBn
                  ? 'মানসিক অস্থিরতা ও আসক্তি কাটিয়ে ওঠার প্রতিটি পদক্ষেপে আমরা আপনার পাশে আছি। বৈজ্ঞানিক অভ্যাস, শীর্ষস্থানীয় সাইকিয়াট্রিস্টদের পরামর্শ এবং সম্পূর্ণ তথ্য গোপনীয়তা।'
                  : 'Pathway is committed to providing compassionate recovery support, daily evidence-based habits, and verified psychiatric consultations across Bangladesh — strictly at your pace and privacy.'}
              </p>

              {/* Action Buttons matching Reference */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to={isAuthenticated ? '/my-day' : '/signup'}
                  className="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-700/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <span>{isAuthenticated ? t('nav.myDay') : (isBn ? 'শুরু করুন' : 'Get Started')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setIsHelpOpen(true)}
                  className="px-6 py-3.5 rounded-xl border border-blue-600 dark:border-blue-500 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold text-sm sm:text-base transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LifeBuoy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{t('app.getHelpNow')}</span>
                </button>
              </div>

              {/* Reference-Inspired Trust Highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{isBn ? '১০০% গোপনীয়' : '100% Confidential'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{isBn ? 'বিশেষজ্ঞ চিকিৎসক' : 'Verified Doctors'}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{isBn ? 'কোনো বিজ্ঞাপন বা ট্র্যাকার নেই' : 'Zero Ad Trackers'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Functional Pharmaceutical Image Carousel */}
            <div className="lg:col-span-6 w-full">
              <HeroPharmaCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars - Reference Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Quality First */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              {isBn ? 'গুণমান সবার আগে' : 'Quality First'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'আন্তর্জাতিক ও ক্লিনিক্যাল মানদণ্ড অনুসরণ করে প্রতিটি ধাপে নিরাপদ ও সর্বোচ্চ চিকিৎসা নিশ্চয়তা।'
                : 'We follow rigorous standards to ensure the highest quality and safety in every step.'}
            </p>
          </div>

          {/* Card 2: Innovation Driven */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              {isBn ? 'বিজ্ঞান ও উদ্ভাবন' : 'Innovation Driven'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'আধুনিক প্রমাণভিত্তিক থেরাপিউটিক্স, দৈনিক মাইক্রো-হ্যাবিট ও রিয়েল-টাইম সহায়তা।'
                : 'Continuous innovation in habit science and evidence-based self-care tools.'}
            </p>
          </div>

          {/* Card 3: Global Reach */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              {isBn ? 'দেশব্যাপী নেটওয়ার্ক' : 'Comprehensive Network'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'বাংলাদেশের শীর্ষ হাসপাতাল ও মানসিক স্বাস্থ্য বিশেষজ্ঞদের সাথে নিরবচ্ছিন্ন সংযোগ।'
                : 'Direct access to verified Bangladeshi specialists and accredited clinical centers.'}
            </p>
          </div>

          {/* Card 4: Patient Care */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow transition-all hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              {isBn ? 'সহমর্মিতাপূর্ণ যত্ন' : 'Patient-Centric Care'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'কোনো বিচার বা লজ্জা নয়; আত্মমর্যাদা ও সহমর্মিতার সাথে সুস্থতার নতুন প্রত্যয়।'
                : 'Empathetic care and confidential guidance tailored to your speed and comfort.'}
            </p>
          </div>
        </div>
      </section>

      {/* Solid Royal Blue Metrics Banner - Direct Reference Element */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white p-8 sm:p-10 shadow-xl shadow-blue-900/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-500/30">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                {isBn ? '১০+' : '10+'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">
                {isBn ? 'বিশেষজ্ঞ সাইকিয়াট্রিস্ট' : 'Verified Psychiatrists'}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                {isBn ? '১০০%' : '100%'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">
                {isBn ? 'সম্পূর্ণ তথ্য গোপনীয়তা' : 'Strict Confidentiality'}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                {isBn ? '২৪/৭' : '24/7'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">
                {isBn ? 'জরুরি ক্রাইসিস হেল্পলাইন' : 'Emergency Hotlines'}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-1">
                {isBn ? '৫+' : '5+'}
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-100">
                {isBn ? 'অনুমোদিত রিহ্যাব সেন্টার' : 'Accredited Centers'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Simple Steps Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {isBn ? 'সহজ চার ধাপ' : 'How It Works'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isBn ? 'সুস্থতার পথে সহজ ৪টি পদক্ষেপ' : 'Four Gentle Steps Forward'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {isBn
              ? 'কোনো জটিল প্রক্রিয়া বা বাড়তি চাপ নেই। সবকিছু আপনার পছন্দমতো।'
              : 'No overwhelming demands or medical jargon. Simple daily rhythm designed for comfort.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isBn ? 'ব্যক্তিগত অ্যাকাউন্ট' : 'Private Profile'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'আসল নাম ছাড়াই ছদ্মনামে অ্যাকাউন্ট খুলুন। আপনি কী শেয়ার করবেন তা কেবল আপনার নিয়ন্ত্রণে।'
                : 'Sign up with just a nickname. Keep real names and identity completely hidden.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isBn ? 'দৈনিক ২-১০ মিনিটের অভ্যাস' : 'Daily Micro-Habits'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'বক্স ব্রিদিং, হালকা হাঁটা, এক গ্লাস পানি ও ছোট কৃতজ্ঞতার নোট দিয়ে মন শান্ত রাখুন।'
                : 'Guided breathing, 10-minute fresh air walks, and cool water resets. Missing a day never resets progress.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isBn ? 'ডাক্তারের পরামর্শ ও বুকিং' : 'Doctor Consultations'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'বাংলাদেশের নির্ভরযোগ্য সাইকিয়াট্রিস্টদের সাথে সরাসরি অনলাইনে বা চেম্বারে ভিজিটের সুযোগ।'
                : 'Book verified Bangladeshi psychiatrists online or in person. Pay via bKash, Nagad, or card.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 pharma-card-shadow space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center">
              4
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {isBn ? 'আত্মমমতা ও ধারাবাহিকতা' : 'Shame-Free Growth'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isBn
                ? 'কখনো ভুল হলে দোষারোপ নয়; যেকোনো সময় আবার নতুন করে শুরুর সহমর্মী সঙ্গী।'
                : 'Earn points and badges. If a setback happens, we support you kindly without reset penalties.'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Doctors Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isBn ? 'বিশেষজ্ঞ চিকিৎসক' : 'Verified Care'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'আসক্তি ও মানসিক স্বাস্থ্য বিশেষজ্ঞবৃন্দ' : 'Meet Our Verified Psychiatrists'}
            </h2>
          </div>

          <Link
            to="/doctors"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            <span>{isBn ? 'সকল ডাক্তার দেখুন' : 'View all psychiatrists'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 pharma-card-shadow flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {isBn ? doc.nameBn : doc.name}
                    </h3>
                    <p className="text-xs text-slate-500">{doc.qualifications}</p>
                    <span className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                      {doc.experienceYears} {isBn ? 'বছরের অভিজ্ঞতা' : 'years experience'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {isBn ? doc.aboutBn : doc.about}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(isBn ? doc.specialtiesBn : doc.specialties).slice(0, 2).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">{isBn ? 'পরামর্শ ফি' : 'Consultation Fee'}</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    ৳{doc.feeBDT}
                  </span>
                </div>

                <Link
                  to={isAuthenticated ? `/book/${doc.id}` : '/login'}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition"
                >
                  {isAuthenticated ? t('doctors.bookVisit') : t('nav.login')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Library Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isBn ? 'জ্ঞানের আলো' : 'Educational Library'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isBn ? 'সহজ ভাষায় মন ও সুস্থতার পাঠ' : 'Articles & Soothing Guides'}
            </h2>
          </div>

          <Link
            to="/library"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            <span>{isBn ? 'সব আর্টিকেল পড়ুন' : 'Browse full library'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((art) => (
            <Link
              key={art.id}
              to={`/library/${art.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 pharma-card-shadow hover:border-blue-300 dark:hover:border-blue-700 transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 font-medium">
                    {isBn ? art.categoryBn : art.category}
                  </span>
                  <span>{isBn ? art.readTimeBn : art.readTime}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {isBn ? art.titleBn : art.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {isBn ? art.summaryBn : art.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-700 dark:text-blue-400 font-semibold">
                <span>{isBn ? 'পড়ুন' : 'Read guide'}</span>
                <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gentle Bottom CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-blue-900/20 space-y-4">
          <Smile className="w-10 h-10 mx-auto text-blue-200" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isBn ? 'আজই শুরু হোক আপনার নতুন সকাল' : 'Take Your First Gentle Step Today'}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {isBn
              ? 'কোনো টাকা বা ক্রেডিট কার্ডের প্রয়োজন নেই। যেকোনো সময় বিরতি নিতে পারেন।'
              : 'Free to join. No credit card required. Everything is confidential and at your own pace.'}
          </p>
          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/my-day' : '/signup'}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-sm shadow-md transition transform hover:scale-105"
            >
              <span>{isAuthenticated ? t('nav.myDay') : t('nav.signup')}</span>
              <ArrowRight className="w-4 h-4 text-blue-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Modal */}
      <GetHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
