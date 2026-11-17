import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !contactInfo.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100">
          {isBn ? 'আমরা আপনার বার্তা শোনার অপেক্ষায় আছি' : 'We Are Here to Listen'}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm max-w-lg mx-auto">
          {isBn
            ? 'যেকোনো জিজ্ঞাসা, মতামত বা কারিগরি সহায়তার জন্য নিঃসংকোচে লিখুন।'
            : 'Have a question about Pathway, subscriptions, or feedback? Send us a kind note anytime.'}
        </p>
      </div>

      {submitted ? (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-3xl p-8 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white mx-auto flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {isBn ? 'আপনার বার্তা আমরা পেয়েছি' : 'Thank You for Reaching Out'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 max-w-md mx-auto leading-relaxed">
            {isBn
              ? 'আমাদের টিম খুব যত্নসহকারে আপনার বার্তাটি পড়বে এবং ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।'
              : 'Our support team will review your message gently and get back to you within 24 hours.'}
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage('');
              setName('');
              setContactInfo('');
            }}
            className="text-xs font-semibold text-blue-700 dark:text-blue-300 hover:underline pt-2"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              {isBn ? 'আপনার নাম বা ছদ্মনাম (ঐচ্ছিক)' : 'Nickname or Name (Optional)'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shanto"
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              {isBn ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile Number'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="you@example.com or 017XXXXXXXX"
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              {isBn ? 'আপনার বার্তা' : 'How can we help you?'} <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isBn ? 'আপনার কথা শান্তভাবে এখানে লিখুন...' : 'Write your thoughts or question kindly...'}
              className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{isBn ? 'বার্তা পাঠান' : 'Send Message'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
