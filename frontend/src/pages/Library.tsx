import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Bookmark,
  Sparkles,
  Wind,
  Smile,
  ArrowRight,
  Wifi,
  ChevronRight,
  Headphones
} from 'lucide-react';
import articlesData from '../data/articles.json';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { BreathingTool } from '../components/relaxation/BreathingTool';
import { GroundingTool } from '../components/relaxation/GroundingTool';

export const Library: React.FC = () => {
  const { language, t } = useLanguage();
  const { lowDataMode, setLowDataMode } = useTheme();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['understanding-craving-wave']);
  const [activeRelaxationTool, setActiveRelaxationTool] = useState<'none' | 'breathing' | 'grounding'>('none');

  const categories = ['all', 'Coping Tools', 'Sleep & Body', 'Emotional Health', 'Nutrition'];

  const filteredArticles = articlesData.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesQuery =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.titleBn.includes(searchQuery) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Title & Low-data Mode Toggle Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            {isBn ? 'সুস্থতার সহায়ক লাইব্রেরি' : 'Mind & Body Library'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            {t('nav.library')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl">
            Short, calm articles and interactive somatic tools for urge surfing, sleep restoration, and emotional grounding.
          </p>
        </div>

        {/* Low Data Mode Toggle */}
        <button
          onClick={() => setLowDataMode(!lowDataMode)}
          className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold transition flex items-center gap-1.5 shrink-0 ${
            lowDataMode
              ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              : 'border-stone-200 dark:border-stone-800 text-stone-600 hover:bg-stone-50'
          }`}
          title="Low data mode loads text-first and disables large images/video placeholders"
        >
          <Wifi className="w-3.5 h-3.5" />
          <span>{lowDataMode ? 'Low-Data Mode ON' : 'Low-Data Mode'}</span>
        </button>
      </div>

      {/* Built-in Interactive Relaxation Tools Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-stone-900 dark:to-slate-900 border border-blue-100 dark:border-blue-900/40 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
              Interactive Calming Tools
            </h2>
          </div>
          {activeRelaxationTool !== 'none' && (
            <button
              onClick={() => setActiveRelaxationTool('none')}
              className="text-xs text-stone-400 hover:underline"
            >
              Hide tool
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              setActiveRelaxationTool(activeRelaxationTool === 'breathing' ? 'none' : 'breathing')
            }
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition flex items-center gap-2 ${
              activeRelaxationTool === 'breathing'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
            }`}
          >
            <Wind className="w-4 h-4 text-blue-600" />
            <span>Guided Box Breathing Player</span>
          </button>

          <button
            onClick={() =>
              setActiveRelaxationTool(activeRelaxationTool === 'grounding' ? 'none' : 'grounding')
            }
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition flex items-center gap-2 ${
              activeRelaxationTool === 'grounding'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50'
            }`}
          >
            <Smile className="w-4 h-4 text-blue-600" />
            <span>5-4-3-2-1 Sensory Grounding Tool</span>
          </button>
        </div>

        {/* Dynamic Tool Renderer */}
        {activeRelaxationTool === 'breathing' && (
          <div className="pt-2 animate-in fade-in">
            <BreathingTool />
          </div>
        )}
        {activeRelaxationTool === 'grounding' && (
          <div className="pt-2 animate-in fade-in">
            <GroundingTool />
          </div>
        )}
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by title, urge, sleep, nutrition..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl capitalize font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => {
          const isBookmarked = bookmarkedIds.includes(art.id);
          return (
            <div
              key={art.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                    {isBn ? art.categoryBn : art.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-[11px]">{isBn ? art.readTimeBn : art.readTime}</span>
                    <button
                      onClick={() => toggleBookmark(art.id)}
                      className={`p-1 rounded-lg transition ${
                        isBookmarked ? 'text-blue-600' : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  {isBn ? art.titleBn : art.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                  {isBn ? art.summaryBn : art.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {art.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                {art.audioPlaceholder && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-400 font-semibold">
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Audio guide available</span>
                  </span>
                )}
                <Link
                  to={`/library/${art.id}`}
                  className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1 ml-auto"
                >
                  <span>{isBn ? 'পড়ুন' : 'Read Article'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
