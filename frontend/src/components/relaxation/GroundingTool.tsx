import React, { useState } from 'react';
import { Eye, Hand, Ear, Sparkles, Smile, Check, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const GroundingTool: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      num: 5,
      icon: Eye,
      title: isBn ? '৫টি জিনিস দেখুন' : '5 Things You Can See',
      desc: isBn
        ? 'আপনার চারপাশে তাকান। এমন ৫টি জিনিস লক্ষ্য করুন যা আপনি স্পষ্টভাবে দেখতে পাচ্ছেন (যেমন একটি ঘড়ি, দেয়ালের রং, জানালার আলো)।'
        : 'Look around you. Notice 5 objects in your immediate field of vision (e.g. a chair, light from the window, pattern on the floor).'
    },
    {
      num: 4,
      icon: Hand,
      title: isBn ? '৪টি জিনিস স্পর্শ করুন' : '4 Things You Can Touch',
      desc: isBn
        ? 'আপনার কাপড়ের অনুভূতি, টেবিলের কাঠের মসৃণতা, বা আপনার পায়ের নিচে মাটির শীতল স্পর্শ অনুভব করুন।'
        : 'Notice the physical sensation of 4 things (e.g. your clothes against your skin, the desk surface, cool air on your face).'
    },
    {
      num: 3,
      icon: Ear,
      title: isBn ? '৩টি শব্দ শুনুন' : '3 Things You Can Hear',
      desc: isBn
        ? 'দূর থেকে আসা মৃদু পাখির ডাক, পাখার বাতাস বা নিজের শান্ত নিঃশ্বাসের শব্দ শুনুন।'
        : 'Listen carefully for 3 subtle sounds (e.g. distant traffic, fan whirring, your own steady breathing).'
    },
    {
      num: 2,
      icon: Sparkles,
      title: isBn ? '২টি গন্ধ অনুভব করুন' : '2 Things You Can Smell',
      desc: isBn
        ? 'চা বা কফির সুবাস, সাবানের হালকা ঘ্রাণ বা খোলা বাতাসের সতেজতা অনুভব করুন।'
        : 'Notice 2 scents in the air (e.g. fresh soap, herbal tea, or simply the cool room air).'
    },
    {
      num: 1,
      icon: Smile,
      title: isBn ? '১টি ভালো বিষয় স্মরণ করুন' : '1 Good Thing About Yourself',
      desc: isBn
        ? 'একটি ইতিবাচক গুণ বা আজ আপনি নিজের যত্ন নেওয়ার যে চেষ্টাটি করেছেন তার জন্য নিজেকে ধন্যবাদ জানান।'
        : 'Name 1 positive affirmation or one kind choice you made for yourself today.'
    }
  ];

  const current = steps[stepIndex];
  const Icon = current.icon;

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
          5-4-3-2-1 Sensory Grounding
        </span>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
          Step {stepIndex + 1} of 5
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white mx-auto flex items-center justify-center font-bold text-lg shadow-sm">
          <Icon className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">{current.title}</h4>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
          {current.desc}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          className="px-4 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 disabled:opacity-40"
        >
          {isBn ? 'পূর্ববর্তী' : 'Previous'}
        </button>

        {stepIndex < 4 ? (
          <button
            onClick={() => setStepIndex((i) => i + 1)}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition"
          >
            {isBn ? 'পরবর্তী ধাপ' : 'Next Step'}
          </button>
        ) : (
          <button
            onClick={() => setStepIndex(0)}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition inline-flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isBn ? 'সম্পন্ন! পুনরায় শুরু' : 'Completed! Reset'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
