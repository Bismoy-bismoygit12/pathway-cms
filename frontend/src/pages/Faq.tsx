import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Faq: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: isBn ? 'পাথওয়ে ব্যবহার করতে কি আসল নাম বা ব্যক্তিগত তথ্য প্রয়োজন?' : 'Do I need to provide my real name or identity?',
      a: isBn
        ? 'না। আপনি সম্পূর্ণ গোপনীয়ভাবে যেকোনো ছদ্মনাম (Nickname) ব্যবহার করে অ্যাকাউন্ট খুলতে পারেন। কোনো জাতীয় পরিচয়পত্র বা ব্যক্তিগত পরিচয় প্রকাশের বাধ্যবাধকতা নেই।'
        : 'No. You can sign up with just a nickname. We never ask for national IDs or real names. Your privacy and dignity come first.'
    },
    {
      q: isBn ? 'ডাক্তাররা কি আমার অতীত রিপোর্ট বা তথ্য সরাসরি দেখতে পাবেন?' : 'Can doctors see all my reports and progress logs automatically?',
      a: isBn
        ? 'না, কখনো না। আপনি প্রতিটি অ্যাপয়েন্টমেন্ট বুকিংয়ের সময় অথবা প্রোফাইলের শেয়ারিং সেটিংসে নিজে নির্ধারণ করবেন ডাক্তার কী কী দেখতে পারবেন। যেকোনো মুহূর্তে অনুমতি প্রত্যাহার করতে পারেন।'
        : 'Never automatically. During booking and in your profile Privacy Settings, you choose exactly which check-ins, goals, or medical reports are shared with each individual doctor. You can revoke this at any time.'
    },
    {
      q: isBn ? 'হঠাৎ ঘুমের ওষুধ বা অ্যালকোহল বন্ধ করা কি বিপজ্জনক হতে পারে?' : 'Is stopping sleeping pills or alcohol abruptly dangerous?',
      a: isBn
        ? 'হ্যাঁ, চিকিৎসা বিজ্ঞানে এটি প্রমাণিত যে দীর্ঘদিনের ঘুমের ওষুধ বা অ্যালকোহল হঠাৎ নিজে নিজে বন্ধ করলে খিঁচুনি বা জটিল শারীরিক ঝুঁকি তৈরি হতে পারে। দয়া করে কোনো বিশেষজ্ঞ চিকিৎসকের পরামর্শ নিয়ে নিরাপদ ডোজে ধীরে ধীরে কমাবেন।'
        : 'Yes. Sudden withdrawal from alcohol, sleeping pills, or benzodiazepines can lead to severe seizures or cardiovascular distress. Please consult a doctor for a safe medical tapering plan before stopping abruptly.'
    },
    {
      q: isBn ? 'অ্যাপয়েন্টমেন্ট বাতিল করলে কি সম্পূর্ণ রিফান্ড পাওয়া যায়?' : 'What is your refund policy if I cancel a booked visit?',
      a: isBn
        ? 'নির্ধারিত সময়ের ১২ ঘণ্টা আগ পর্যন্ত বিনামূল্যে বাতিল বা সময় পরিবর্তন করতে পারবেন। অনলাইনে পেমেন্ট করা থাকলে সম্পূর্ণ টাকা আপনার বিকাশ/নগদ/কার্ডে ফেরত পাঠানো হয়।'
        : 'You can reschedule or cancel for free up to 12 hours before your visit. If you paid online via bKash, Nagad, or Card, a 100% full refund is credited back to your account.'
    },
    {
      q: isBn ? 'আমি কি আমার সমস্ত ডেটা ডাউনলোড বা চিরতরে মুছে ফেলতে পারি?' : 'Can I export or permanently erase all my data?',
      a: isBn
        ? 'হ্যাঁ। প্রোফাইল সেটিংস থেকে যেকোনো সময় আপনার সমস্ত জার্নাল ও রুটিন একটি ফাইলে ডাউনলোড করতে পারেন অথবা ৭ দিনের নিরাপদ বিবেচনা সময়সহ অ্যাকাউন্ট সম্পূর্ণ মুছে ফেলতে পারেন।'
        : 'Yes. In My Profile > Account Control, you can download a full JSON/printable archive or permanently delete your account with a 7-day grace window.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isBn ? 'সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'আপনার মনে থাকা প্রশ্নগুলোর উত্তর' : 'Clear, Kind Answers'}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm">
          {isBn
            ? 'গোপনীয়তা, ডাক্তার পরামর্শ ও আরোগ্য প্রক্রিয়া সম্পর্কে সহজ ব্যাখ্যা।'
            : 'Everything you need to know about privacy, doctor booking, and our gentle support tools.'}
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-stone-900 dark:text-stone-100 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
