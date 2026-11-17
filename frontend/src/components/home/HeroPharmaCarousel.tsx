import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ShieldCheck, Sparkles, Activity, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Import local generated high-fidelity pharmaceutical imagery
import imgLab from '../../assets/images/pharma_microscope_lab_1794420573618.jpg';
import imgCapsules from '../../assets/images/pharma_capsules_tablets_1794420574939.jpg';
import imgVials from '../../assets/images/pharma_sterile_vials_1794420574478.jpg';
import imgScientist from '../../assets/images/pharma_scientist_research_1794420574894.jpg';
import imgSyrup from '../../assets/images/pharma_syrup_formulation_1794420612985.jpg';

interface Slide {
  id: string;
  image: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  badgeEn: string;
  badgeBn: string;
  statEn: string;
  statBn: string;
  statLabelEn: string;
  statLabelBn: string;
}

const SLIDES: Slide[] = [
  {
    id: 'lab-research',
    image: imgLab,
    titleEn: 'Advanced Research & Diagnostic Standards',
    titleBn: 'উন্নত বৈজ্ঞানিক গবেষণা ও আধুনিক রোগ নির্ণয়',
    subtitleEn: 'High-precision laboratory diagnostics for evidence-based care',
    subtitleBn: 'নির্ভুল ল্যাবরেটরি মানদণ্ড এবং বিজ্ঞানভিত্তিক স্বাস্থ্যসেবা',
    badgeEn: 'Laboratory Science',
    badgeBn: 'ল্যাবরেটরি সায়েন্স',
    statEn: '100%',
    statBn: '১০০%',
    statLabelEn: 'Verified Protocols',
    statLabelBn: 'যাচাইকৃত প্রোটোকল',
  },
  {
    id: 'capsules-tablets',
    image: imgCapsules,
    titleEn: 'Quality Pharmaceutical Formulations',
    titleBn: 'আন্তর্জাতিক মানের ঔষধ ও থেরাপিউটিক্স',
    subtitleEn: 'Safe, clinically approved medications with verified purity',
    subtitleBn: 'নিরাপদ, ক্লিনিক্যালি স্বীকৃত এবং সর্বোচ্চ বিশুদ্ধতার নিশ্চয়তা',
    badgeEn: 'Precision Medicine',
    badgeBn: 'নির্ভুল ফর্মুলেশন',
    statEn: 'WHO-GMP',
    statBn: 'WHO-GMP',
    statLabelEn: 'Standard Purity',
    statLabelBn: 'মানসম্পন্ন বিশুদ্ধতা',
  },
  {
    id: 'sterile-vials',
    image: imgVials,
    titleEn: 'Sterile Clinical Solutions & Vials',
    titleBn: 'জীবাণুমুক্ত ক্লিনিক্যাল দ্রবণ ও আধুনিক যত্ন',
    subtitleEn: 'Controlled cleanroom preparation ensuring utmost patient safety',
    subtitleBn: 'রোগীর সর্বোচ্চ সুরক্ষায় নিয়ন্ত্রিত জীবাণুমুক্ত পরিবেশ',
    badgeEn: 'Clinical Safety',
    badgeBn: 'ক্লিনিক্যাল সুরক্ষা',
    statEn: '24/7',
    statBn: '২৪/৭',
    statLabelEn: 'Doctor Network',
    statLabelBn: 'ডাক্তার নেটওয়ার্ক',
  },
  {
    id: 'scientist-care',
    image: imgScientist,
    titleEn: 'Dedicated Medical Specialists',
    titleBn: 'অভিজ্ঞ মনোরোগ ও স্বাস্থ্য বিশেষজ্ঞ দল',
    subtitleEn: 'Compassionate psychiatric professionals guiding every recovery milestone',
    subtitleBn: 'প্রতিটি পদক্ষেপে সহমর্মিতাপূর্ণ বিশেষজ্ঞ চিকিৎসকের দিকনির্দেশনা',
    badgeEn: 'R&D & Clinical Care',
    badgeBn: 'গবেষণা ও ক্লিনিক্যাল সেবা',
    statEn: '10+',
    statBn: '১০+',
    statLabelEn: 'Expert Psychiatrists',
    statLabelBn: 'বিশেষজ্ঞ চিকিৎসক',
  },
  {
    id: 'syrup-therapeutics',
    image: imgSyrup,
    titleEn: 'Targeted Therapeutic Healthcare',
    titleBn: 'পরিমিত ডোজ ও সামগ্রিক সুস্থতা',
    subtitleEn: 'Gentle recovery protocols tailored for sustainable well-being',
    subtitleBn: 'দীর্ঘমেয়াদী সুস্থতার লক্ষ্যে শান্ত ও সুনির্দিষ্ট পুনরুদ্ধার পরিকল্পনা',
    badgeEn: 'Therapeutic Balance',
    badgeBn: 'ভারসাম্যপূর্ণ যত্ন',
    statEn: '100%',
    statBn: '১০০%',
    statLabelEn: 'Confidential',
    statLabelBn: 'সম্পূর্ণ গোপনীয়',
  },
];

export const HeroPharmaCarousel: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<any>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-play timer with pause on hover
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Keyboard navigation when focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  const current = SLIDES[currentIndex];

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-blue-950/40 border border-blue-100/80 dark:border-blue-900/40 bg-white dark:bg-slate-900 select-none group focus:outline-none focus:ring-2 focus:ring-blue-500"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Pharmaceutical & Medical Quality Highlights"
    >
      {/* Aspect Ratio Container */}
      <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 w-full overflow-hidden bg-slate-950">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={isBn ? slide.titleBn : slide.titleEn}
                className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />

              {/* Gradient Overlay for Text Legibility inspired by Medivan reference */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-900/10 pointer-events-none" />

              {/* Blue Ambient Glow in top right */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
            </div>
          );
        })}

        {/* Top Floating Badge - Medivan style */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-blue-200/80 dark:border-blue-800/60 shadow-lg text-xs font-semibold text-blue-900 dark:text-blue-200 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span>{isBn ? current.badgeBn : current.badgeEn}</span>
        </div>

        {/* Top Right Floating Stat Box */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-blue-700/90 dark:bg-blue-800/90 text-white backdrop-blur-md shadow-lg border border-blue-400/30">
          <Award className="w-4 h-4 text-cyan-300" />
          <div className="text-left">
            <div className="text-xs font-black leading-tight tracking-tight">
              {isBn ? current.statBn : current.statEn}
            </div>
            <div className="text-[10px] text-blue-100 leading-tight">
              {isBn ? current.statLabelBn : current.statLabelEn}
            </div>
          </div>
        </div>

        {/* Slide Content Caption Overlaid at Bottom */}
        <div className="absolute bottom-16 sm:bottom-14 inset-x-0 px-5 sm:px-6 z-20 pointer-events-none text-left">
          <div className="max-w-xl space-y-1.5 drop-shadow-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider">
              {isBn ? 'গুণমান ও বৈজ্ঞানিক মানদণ্ড' : 'Pharmaceutical Grade'}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {isBn ? current.titleBn : current.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
              {isBn ? current.subtitleBn : current.subtitleEn}
            </p>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          aria-label="Previous pharmaceutical image"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          aria-label="Next pharmaceutical image"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Bar: Indicators & Controls */}
        <div className="absolute bottom-3 inset-x-0 z-20 px-4 sm:px-6 flex items-center justify-between">
          {/* Pagination Indicators */}
          <div className="flex items-center gap-1.5 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 h-2 bg-blue-500 shadow-sm shadow-blue-500/50'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter & Play/Pause Button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium text-slate-300 bg-slate-950/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              {String(currentIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>

            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? 'Resume auto-sliding' : 'Pause auto-sliding'}
              title={isPaused ? 'Resume auto-sliding' : 'Pause auto-sliding'}
              className="w-7 h-7 rounded-full bg-slate-950/50 hover:bg-slate-900 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition cursor-pointer"
            >
              {isPaused ? <Play className="w-3 h-3 fill-white" /> : <Pause className="w-3 h-3 fill-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
