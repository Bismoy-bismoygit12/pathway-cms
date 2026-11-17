import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { unpauseAccount, cancelAccountDeletion } from '../services/user';
import { PauseCircle, Trash2, Lock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  status: 'paused' | 'pending_deletion' | 'locked';
}

export const AccountStatusNotice: React.FC<Props> = ({ status }) => {
  const { user, refreshUser, logout } = useAuth();
  const { language, toBanglaDigits, formatLocalizedDate } = useLanguage();
  const navigate = useNavigate();

  if (!user) return null;

  const handleResume = () => {
    unpauseAccount(user.id);
    refreshUser();
    navigate('/my-day');
  };

  const handleCancelDeletion = () => {
    cancelAccountDeletion(user.id);
    refreshUser();
    navigate('/my-day');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        {status === 'paused' && (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <PauseCircle className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {language === 'bn' ? 'অ্যাকাউন্ট সাময়িক বিরতিতে রয়েছে' : 'Your Account is Paused'}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {language === 'bn'
                  ? 'আপনি যখনই প্রস্তুত হবেন, এক ক্লিকেই পুনরায় শুরু করতে পারবেন। আপনার সমস্ত ডেটা নিরাপদে সংরক্ষিত আছে।'
                  : 'Take all the time you need. Your progress, journal, and visits are safely saved for when you are ready.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 text-xs text-stone-600 dark:text-stone-400 text-left space-y-1">
              <p className="font-semibold text-stone-800 dark:text-stone-200">
                {language === 'bn' ? 'বিরতি চলাকালীন:' : 'While paused:'}
              </p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>{language === 'bn' ? 'কোনো নোটিফিকেশন বা ইমেইল পাঠানো হয় না' : 'All reminders and emails are silenced'}</li>
                <li>{language === 'bn' ? 'আপনার স্ট্রিক এবং রিওয়ার্ড সংরক্ষিত থাকে' : 'Your streak and earned points are frozen in place'}</li>
                <li>{language === 'bn' ? 'জরুরি সেবা সবসময় উন্মুক্ত রয়েছে' : 'Emergency helplines remain 100% accessible'}</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleResume}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>{language === 'bn' ? 'অ্যাকাউন্ট পুনরায় চালু করুন' : 'Resume My Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="py-3 px-5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-sm rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                {language === 'bn' ? 'লগআউট' : 'Sign Out'}
              </button>
            </div>
          </>
        )}

        {status === 'pending_deletion' && (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {language === 'bn' ? 'অ্যাকাউন্ট মুছে ফেলার অনুরোধ প্রক্রিয়াধীন' : 'Account Scheduled for Deletion'}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {language === 'bn'
                  ? 'আপনার অনুরোধ অনুযায়ী ৭ দিনের গ্রেস পিরিয়ড চলছে। এই সময়ের মধ্যে আপনি চাইলে যেকোনো মুহূর্তে বাতিল করতে পারেন।'
                  : 'Your account is in a 7-day grace period. After this, all your data will be permanently wiped.'}
              </p>
            </div>

            {user.deletionRequestedAt && (
              <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300">
                {language === 'bn' ? 'অনুরোধের তারিখ:' : 'Requested on:'}{' '}
                <span className="font-bold">{formatLocalizedDate(user.deletionRequestedAt)}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCancelDeletion}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
              >
                {language === 'bn' ? 'মুছে ফেলা বাতিল করুন (রাখুন)' : 'Cancel Deletion & Keep Account'}
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="py-3 px-5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-sm rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                {language === 'bn' ? 'লগআউট' : 'Sign Out'}
              </button>
            </div>
          </>
        )}

        {status === 'locked' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                {language === 'bn' ? 'নিরাপত্তার স্বার্থে সাময়িক লক' : 'Account Temporarily Locked'}
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {language === 'bn'
                  ? 'একাধিক ভুল পাসওয়ার্ড বা নিরাপত্তা বিধির কারণে এটি লক করা হয়েছে।'
                  : 'This account was locked after repeated incorrect attempts to protect your private recovery logs.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
              >
                {language === 'bn' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Password'}
              </button>
              <button
                type="button"
                onClick={() => logout()}
                className="py-3 px-5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-sm rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                {language === 'bn' ? 'লগআউট' : 'Sign Out'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
