import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { getUserPayments, downloadReceipt, PaymentRecord } from '../services/payments';
import { Check, ShieldCheck, Download, AlertCircle, Sparkles, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SubscriptionPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { language, formatBDT, formatLocalizedDate } = useLanguage();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [billingCycle, setBillingCycle] = useState<'monthly' | '3month' | 'yearly'>('monthly');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState('');

  if (!user) return null;

  const isPremium = user.plan === 'premium';
  const history: PaymentRecord[] = getUserPayments(user.id);

  const plans = {
    monthly: { bdt: 50, months: 1, discount: null, label: language === 'bn' ? '১ মাস' : '1 Month' },
    '3month': { bdt: 135, months: 3, discount: '10% OFF', label: language === 'bn' ? '৩ মাস' : '3 Months' },
    yearly: { bdt: 480, months: 12, discount: '20% OFF', label: language === 'bn' ? '১ বছর' : '1 Year' },
  };

  const handleUpgrade = (cycle: 'monthly' | '3month' | 'yearly') => {
    const chosen = plans[cycle];
    const txnId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);

    // Navigate to payment gateway to complete
    navigate(`/payment-gateway?txnId=${txnId}&type=subscription&amount=${chosen.bdt}&months=${chosen.months}&cycle=${cycle}`);
  };

  const handleCancelSubscription = () => {
    updateUser({
      plan: 'free',
      planRenewalDate: undefined,
    });
    addNotification({
      category: 'subscription',
      title: 'Plan Changed to Free',
      titleBn: 'আপনার প্ল্যান বিনামূল্যে রূপান্তরিত হয়েছে',
      body: 'You can continue using free self-care tools anytime.',
      bodyBn: 'আপনি যেকোনো সময় বিনামূল্যে আত্ম-যত্ন টুল ব্যবহার করতে পারেন।',
      link: '/subscription',
    });
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
          {language === 'bn' ? 'সদস্যপদ ও বিলিং' : 'Membership & Billing'}
        </h1>
        <p className="text-stone-600 dark:text-stone-400 mt-1">
          {language === 'bn'
            ? 'স্বচ্ছ ও সাশ্রয়ী মূল্য। কোনো গোপন ফি নেই। যেকোনো সময় বাতিল করতে পারেন।'
            : 'Transparent and affordable support. No hidden fees. Cancel anytime.'}
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {language === 'bn' ? 'বর্তমান প্ল্যান' : 'Current Plan'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isPremium
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {isPremium ? (language === 'bn' ? 'প্রিমিয়াম প্লাস' : 'Premium Plus') : (language === 'bn' ? 'ফ্রি' : 'Free Basic')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-2">
              {isPremium ? '৳৫০ / মাস' : '৳০ / চিরকাল'}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
              {isPremium ? (
                user.planRenewalDate ? (
                  <>
                    {language === 'bn' ? 'পরবর্তী নবায়ন:' : 'Renews on:'}{' '}
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {formatLocalizedDate(user.planRenewalDate)}
                    </span>
                  </>
                ) : (
                  language === 'bn' ? 'সক্রিয় সাবস্ক্রিপশন' : 'Active subscription'
                )
              ) : (
                language === 'bn'
                  ? 'আপনি মৌলিক পুনরুদ্ধার ট্র্যাকার এবং নিবন্ধগুলো ব্যবহার করছেন।'
                  : 'You are using core self-care tracking and reading guides.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isPremium ? (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-xl transition-colors"
              >
                {language === 'bn' ? 'প্ল্যান বাতিল করুন' : 'Cancel Plan'}
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade('monthly')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-xs flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {language === 'bn' ? 'প্রিমিয়ামে আপগ্রেড করুন' : 'Upgrade to Premium'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Available Plans Comparison */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {language === 'bn' ? 'প্ল্যানসমূহ' : 'Available Plans'}
          </h2>

          {/* Billing cycle pill selector */}
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            {(['monthly', '3month', 'yearly'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  billingCycle === cycle
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {plans[cycle].label}
                {plans[cycle].discount && (
                  <span className="ml-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                    {plans[cycle].discount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Tier */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6 bg-white dark:bg-stone-900 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'বেসিক ফ্রি' : 'Basic Free'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                  {language === 'bn' ? 'চিরকাল' : 'Forever'}
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">৳০</span>
                <span className="text-stone-500 text-sm">/ {language === 'bn' ? 'চিরকাল' : 'forever'}</span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
                {language === 'bn'
                  ? 'দৈনন্দিন স্ব-যত্ন ও মৌলিক অভ্যাসের জন্য উপযুক্ত।'
                  : 'Essential self-help tools and emergency contacts for everyone.'}
              </p>

              <ul className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'দৈনিক লক্ষ্য ও সোব্রিয়েটি কাউন্টার' : 'Daily goals & sobriety tracker'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'জরুরি হটলাইন ও ক্রাইসিস গাইড (২৪/৭)' : '24/7 National emergency helplines'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'মনোরোগ বিশেষজ্ঞ ডিরেক্টরি ব্রাউজিং' : 'Directory of 10+ psychiatrists'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'রিল্যাক্সেশন ও গ্রাউন্ডিং টুল' : 'Box breathing & 5-4-3-2-1 tools'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'এআই সহকারীর সাথে প্রতিদিন ৩টি বার্তা' : '3 daily messages with AI companion'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                disabled={!isPremium}
                onClick={handleCancelSubscription}
                className="w-full py-2.5 text-center text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-50 disabled:bg-stone-50 dark:disabled:bg-stone-900"
              >
                {!isPremium
                  ? (language === 'bn' ? 'বর্তমান সক্রিয়' : 'Current Active Plan')
                  : (language === 'bn' ? 'ফ্রি প্ল্যানে ফিরুন' : 'Downgrade to Free')}
              </button>
            </div>
          </div>

          {/* Premium Tier */}
          <div className="border-2 border-blue-500 dark:border-blue-600 rounded-2xl p-6 bg-blue-50/20 dark:bg-blue-950/10 flex flex-col justify-between relative shadow-sm">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              {language === 'bn' ? 'জনপ্রিয়' : 'Recommended'}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'প্রিমিয়াম প্লাস' : 'Premium Plus'}
                </h3>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
                  {formatBDT(plans[billingCycle].bdt)}
                </span>
                <span className="text-stone-500 text-sm">
                  / {plans[billingCycle].label}
                </span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-2">
                {language === 'bn'
                  ? 'সম্পূর্ণ পুনরুদ্ধার সহকারী, সীমাহীন এআই চ্যাট এবং বিস্তারিত রিপোর্ট।'
                  : 'Unlimited companion chat, extended lab analytics, and doctor integrations.'}
              </p>

              <ul className="mt-6 space-y-3 text-sm text-stone-700 dark:text-stone-300">
                <li className="flex items-start gap-2.5 font-medium text-blue-900 dark:text-blue-300">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'ফ্রি প্ল্যানের সমস্ত সুবিধা অন্তর্ভুক্ত' : 'Everything in Basic Free'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'সীমাহীন এআই সহচর কথোপকথন' : 'Unlimited empathetic AI chat'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'চিকিৎসক প্রস্তাবিত ব্যক্তিগত লক্ষ্য' : 'Doctor-prescribed micro-goals'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'ল্যাব রিপোর্ট স্বয়ংক্রিয় বিশ্লেষণ ও সংরক্ষণ' : 'AI lab extraction & trend charts'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'অগ্রগতি চার্ট মুদ্রণ ও পিডিএফ রপ্তানি' : 'Export recovery summaries to PDF'}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-blue-200 dark:border-blue-900/40">
              <button
                disabled={isPremium}
                onClick={() => handleUpgrade(billingCycle)}
                className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors shadow-xs"
              >
                {isPremium
                  ? (language === 'bn' ? 'বর্তমান সক্রিয়' : 'Current Active Plan')
                  : (language === 'bn' ? `আপগ্রেড করুন (${formatBDT(plans[billingCycle].bdt)})` : `Upgrade for ${formatBDT(plans[billingCycle].bdt)}`)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Security Promise */}
      <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-xs text-stone-600 dark:text-stone-400">
          {language === 'bn'
            ? 'আমরা বিকাশ, নগদ ও ভিসা/মাস্টারকার্ডের নিরাপদ গেটওয়ে ব্যবহার করি। ব্যাংক স্টেটমেন্টে নিরপেক্ষ বিবরণ "PW Healthcare Services" প্রদর্শিত হবে।'
            : 'Protected with 256-bit encryption. Discreet bank statement billing shows "PW Healthcare Services". Zero gambling/addiction terms.'}
        </p>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-stone-500" />
          {language === 'bn' ? 'লেনদেনের ইতিহাস' : 'Payment History'}
        </h2>

        {history.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 text-center text-stone-500 text-sm">
            {language === 'bn' ? 'এখনো কোনো লেনদেন হয়নি।' : 'No payment records yet.'}
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="py-3 px-4">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'বিবরণ' : 'Description'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'পদ্ধতি' : 'Method'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'পরিমাণ' : 'Amount'}</th>
                    <th className="py-3 px-4">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{language === 'bn' ? 'রশিদ' : 'Receipt'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {history.map((tx: PaymentRecord) => (
                    <tr key={tx.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                        {formatLocalizedDate(tx.date)}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-900 dark:text-stone-100">
                        {language === 'bn' ? tx.titleBn : tx.title}
                      </td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-400 uppercase">
                        {tx.method}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">
                        {formatBDT(tx.amountBDT)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => downloadReceipt(tx)}
                          className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                          title="Download receipt HTML"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'ডাউনলোড' : 'Download'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {language === 'bn' ? 'সাবস্ক্রিপশন বাতিল করতে চান?' : 'Cancel Subscription?'}
              </h3>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {language === 'bn'
                ? 'আপনার মেয়াদ শেষ হওয়া পর্যন্ত প্রিমিয়াম সুবিধা চালু থাকবে। এরপর আপনার অ্যাকাউন্টটি স্বয়ংক্রিয়ভাবে ফ্রি বেসিক প্ল্যানে পরিবর্তিত হবে। আপনার কোনো সংরক্ষিত ডেটা হারাবে না।'
                : 'You will retain premium access until your current billing period ends. After that, you will revert to Basic Free without losing any saved data.'}
            </p>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {language === 'bn' ? 'কোনো মতামত থাকলে জানাতে পারেন (ঐচ্ছিক):' : 'Optional feedback:'}
              </label>
              <textarea
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                rows={2}
                placeholder={language === 'bn' ? 'কীভাবে আমরা আরও ভালো করতে পারি?' : 'How could we improve?'}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl"
              >
                {language === 'bn' ? 'রাখুন' : 'Keep Subscription'}
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                {language === 'bn' ? 'বাতিল নিশ্চিত করুন' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
