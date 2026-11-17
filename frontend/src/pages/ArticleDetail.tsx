import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Bookmark,
  Share2,
  Headphones,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import articlesData from '../data/articles.json';
import { useLanguage } from '../context/LanguageContext';

export const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const article = articlesData.find((a) => a.id === articleId) || articlesData[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-semibold">
            {isBn ? article.categoryBn : article.category}
          </span>
          <span className="text-stone-400">&bull;</span>
          <span className="text-stone-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{isBn ? article.readTimeBn : article.readTime}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          {isBn ? article.titleBn : article.title}
        </h1>

        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
          {isBn ? article.summaryBn : article.summary}
        </p>
      </div>

      {/* Audio guide player simulation */}
      {article.audioPlaceholder && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 dark:text-blue-100 block">
                Listen to Calming Audio Narration
              </span>
              <span className="text-[11px] text-blue-700 dark:text-blue-300">
                Gentle pace &bull; 4 min audio
              </span>
            </div>
          </div>
          <button
            onClick={() => alert('Audio narration player playing gently...')}
            className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold shrink-0"
          >
            Play Audio
          </button>
        </div>
      )}

      {/* Content body */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-9 shadow-xs space-y-6 text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200">
        <div className="whitespace-pre-wrap font-sans space-y-4">
          {article.content}
        </div>

        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Next steps box */}
      <div className="p-6 rounded-3xl bg-stone-100 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
            Need to talk through this feeling?
          </h4>
          <p className="text-xs text-stone-500">
            Our AI companion or verified psychiatrists are ready to support you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/chat"
            className="px-4 py-2 rounded-xl bg-blue-700 text-white font-semibold text-xs"
          >
            Open Chat
          </Link>
          <Link
            to="/doctors"
            className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
          >
            Find Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};
