import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Pricing: React.FC = () => {
  const { language, t } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  const isBn = language === 'bn';

  const prices = {
    monthly: { amount: 50, period: isBn ? '/মাস' : '/month', label: 'Monthly' },
    quarterly: { amount: 135, period: isBn ? '/৩ মাস' : '/3 months', label: '3 Months (Save 10%)' },
    annual: { amount: 500, period: isBn ? '/বছর' : '/1 year', label: '12 Months (Save 17%)' }
  };

  const handleChoosePlan = (plan: 'free' | 'premium') => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    if (plan === 'premium') {
      navigate('/subscription');
    } else {
      navigate('/my-day');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          {isBn ? 'স্বচ্ছ ও সহজ মূল্য' : 'Simple, Accessible Care'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'সবার জন্য সুস্থতা নিশ্চিত করতে সাশ্রয়ী পরিকল্পনা' : 'Gentle Recovery Plans for Everyone'}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm sm:text-base max-w-xl mx-auto">
          {isBn
            ? 'জরুরি ক্রাইসিস হেল্পলাইন সর্বদা সবার জন্য সম্পূর্ণ ফ্রি। বাড়তি এআই মেমোরি ও আনলিমিটেড গাইডের জন্য মাত্র ৫০ টাকা।'
            : 'Emergency help is always 100% free. Upgrade for unlimited AI companionship and advanced report tools.'}
        </p>

        {/* Billing cycle pill */}
        <div className="pt-4 inline-flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-semibold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              billingCycle === 'monthly' ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs' : 'text-stone-500'
            }`}
          >
            {isBn ? 'মাসিক (৫০ টাকা)' : 'Monthly (BDT 50)'}
          </button>
          <button
            onClick={() => setBillingCycle('quarterly')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              billingCycle === 'quarterly' ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs' : 'text-stone-500'
            }`}
          >
            {isBn ? '৩ মাস (১৩৫ টাকা)' : '3 Months (BDT 135)'}
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              billingCycle === 'annual' ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs' : 'text-stone-500'
            }`}
          >
            {isBn ? '১ বছর (৫০০ টাকা)' : '1 Year (BDT 500)'}
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-7 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {t('common.freePlan')}
            </span>
            <div className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {isBn ? '৳০' : 'BDT 0'}
              <span className="text-xs font-normal text-stone-400"> / forever</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isBn
                ? 'দৈনন্দিন লক্ষ্য, শ্বাসের অনুশীলন এবং ডাক্তারের অ্যাপয়েন্টমেন্ট বুকিংয়ের প্রাথমিক সুবিধা।'
                : 'Essential daily recovery routines, breathing player, and complete doctor booking access.'}
            </p>

            <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Daily 2-minute micro-goals & progress ring</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Box breathing and 5-4-3-2-1 grounding tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Find and book Bangladeshi psychiatrists</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>10 daily messages with AI companion</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Store up to 2 medical reports</span>
              </li>
              <li className="flex items-center gap-2 font-semibold text-rose-600 dark:text-rose-400">
                <Check className="w-4 h-4 text-rose-600 shrink-0" />
                <span>24/7 National Emergency Helplines (Never gated)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleChoosePlan('free')}
            className="w-full py-3 rounded-2xl border border-stone-300 dark:border-stone-700 font-semibold text-xs text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
          >
            {currentUser?.plan === 'free' ? 'Your Current Plan' : 'Start with Free'}
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-stone-900 dark:to-stone-900 border-2 border-blue-600 dark:border-blue-500 rounded-3xl p-7 shadow-lg relative flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-blue-700 text-white text-[11px] font-bold shadow-sm">
            {isBn ? 'জনপ্রিয় সুস্থতা প্ল্যান' : 'Most Popular'}
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              {t('common.premiumPlan')}
            </span>
            <div className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              BDT {prices[billingCycle].amount}
              <span className="text-xs font-normal text-stone-400"> {prices[billingCycle].period}</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              {isBn
                ? 'সীমাহীন এআই চ্যাট সঙ্গী, ডাক্তার-পরামর্শকৃত লক্ষ্য এবং গভীর অগ্রগতি রিপোর্ট ডাউনলোড।'
                : 'Unlimited AI companion conversations, custom doctor goals, and complete report downloads.'}
            </p>

            <ul className="space-y-2.5 text-xs text-stone-700 dark:text-stone-300 pt-2 border-t border-blue-100 dark:border-stone-800">
              <li className="flex items-center gap-2 font-semibold text-blue-800 dark:text-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Everything in Free, plus:</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Unlimited AI companion messages with private memory</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Doctor-prescribed goals direct from consultation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Unlimited medical report uploads & lifestyle summaries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Download printable PDF progress & milestone summaries</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Pay seamlessly via bKash, Nagad, or Card</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleChoosePlan('premium')}
            className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 font-semibold text-xs text-white shadow-md shadow-blue-700/20 transition flex items-center justify-center gap-2"
          >
            <span>{currentUser?.plan === 'premium' ? 'Current Active Plan' : 'Get Pathway Premium'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trust reassurance */}
      <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-2 pt-4">
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        <span>Cancel anytime with 1-click &bull; 100% money-back guarantee within 7 days</span>
      </div>
    </div>
  );
};
