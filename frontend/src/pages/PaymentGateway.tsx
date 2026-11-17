import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { recordPayment } from '../services/payments';
import { ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Lock } from 'lucide-react';

type PaymentMethodType = 'bkash' | 'nagad' | 'card';

export const PaymentGatewayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { language, formatBDT } = useLanguage();
  const { addNotification } = useNotifications();

  const txnId = searchParams.get('txnId') || 'TXN-' + Math.floor(100000 + Math.random() * 900000);
  const type = searchParams.get('type') || 'subscription'; // 'subscription' | 'appointment'
  const amountStr = searchParams.get('amount') || '50';
  const amount = parseInt(amountStr, 10) || 50;
  const months = parseInt(searchParams.get('months') || '1', 10);
  const appointmentId = searchParams.get('appointmentId');

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('bkash');
  const [phoneNumber, setPhoneNumber] = useState('01712345678');
  const [step, setStep] = useState<'method' | 'otp' | 'pin' | 'processing' | 'success'>('method');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  // Handle successful payment completion
  const completePayment = () => {
    setStep('processing');
    setTimeout(() => {
      if (user) {
        if (type === 'subscription') {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + months);

          updateUser({
            plan: 'premium',
            planRenewalDate: expiresAt.toISOString().split('T')[0],
          });

          recordPayment({
            userId: user.id,
            type: 'subscription',
            title: `Premium Membership (${months} month)`,
            titleBn: `প্রিমিয়াম মেম্বারশিপ (${months} মাস)`,
            amountBDT: amount,
            method: selectedMethod,
            status: 'completed',
            referenceId: txnId,
          });

          addNotification({
            category: 'subscription',
            title: 'Subscription Activated',
            titleBn: 'সাবস্ক্রিপশন সক্রিয় হয়েছে',
            body: `Your Premium plan is active for ${months} month(s). Thank you!`,
            bodyBn: `আপনার প্রিমিয়াম প্ল্যান ${months} মাসের জন্য সক্রিয় হয়েছে। ধন্যবাদ!`,
            link: '/subscription',
          });
        } else {
          recordPayment({
            userId: user.id,
            type: 'consultation',
            title: 'Doctor Consultation Fee',
            titleBn: 'মনোরোগ বিশেষজ্ঞ ভিজিট ফি',
            amountBDT: amount,
            method: selectedMethod,
            status: 'completed',
            referenceId: txnId,
          });

          addNotification({
            category: 'visits',
            title: 'Payment Confirmed',
            titleBn: 'পেমেন্ট নিশ্চিত করা হয়েছে',
            body: `Consultation fee of BDT ${amount} received for visit.`,
            bodyBn: `ভিজিট ফি ৳${amount} সফলভাবে গ্রহণ করা হয়েছে।`,
            link: '/visits',
          });
        }
      }

      setStep('success');
    }, 1500);
  };

  const handleNext = () => {
    setError('');
    if (step === 'method') {
      if (selectedMethod === 'card') {
        // Simple card flow
        setStep('processing');
        completePayment();
      } else {
        if (!phoneNumber || phoneNumber.length < 11) {
          setError(language === 'bn' ? 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন' : 'Please provide a valid 11-digit phone number');
          return;
        }
        setStep('otp');
      }
    } else if (step === 'otp') {
      if (!otp || otp.length < 4) {
        setError(language === 'bn' ? '৪ সংখ্যার ওটিপি দিন (যেকোনো ৪ সংখ্যা)' : 'Enter 4-digit OTP (e.g. 1234)');
        return;
      }
      setStep('pin');
    } else if (step === 'pin') {
      if (!pin || pin.length < 4) {
        setError(language === 'bn' ? 'আপনার গোপন পিন দিন (সিমুলেশন: যেকোনো সংখ্যা)' : 'Enter PIN (e.g. 1234)');
        return;
      }
      completePayment();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-xl overflow-hidden">
        {/* Gateway Header */}
        <div className="bg-stone-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Secure Checkout Gateway
              </span>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              {txnId.slice(-8)}
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-stone-400">
                {type === 'subscription' ? (language === 'bn' ? 'সদস্যপদ ফি' : 'Membership Plan') : (language === 'bn' ? 'পরামর্শ ফি' : 'Consultation Fee')}
              </p>
              <h1 className="text-2xl font-black text-white mt-0.5">
                {formatBDT(amount)}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/50">
                256-bit SSL
              </span>
            </div>
          </div>
        </div>

        {/* Gateway Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
                {language === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন' : 'Select Payment Method'}
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bkash', label: 'bKash' },
                  { id: 'nagad', label: 'Nagad' },
                  { id: 'card', label: 'Card' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMethod(item.id as PaymentMethodType)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedMethod === item.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-stone-900 dark:text-stone-100 font-bold shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                  </button>
                ))}
              </div>

              {selectedMethod !== 'card' ? (
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 uppercase">
                    {selectedMethod} {language === 'bn' ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    {language === 'bn' ? 'একটি সিমুলেটেড ওটিপি পাঠানো হবে।' : 'A simulated test OTP will be requested.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      {language === 'bn' ? 'কার্ড নম্বর' : 'Card Number'}
                    </label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      defaultValue="4111 2222 3333 4444"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-mono text-stone-900 dark:text-stone-100 outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-mono text-stone-900 dark:text-stone-100 outline-hidden"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      defaultValue="123"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-sm font-mono text-stone-900 dark:text-stone-100 outline-hidden"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
              >
                {language === 'bn' ? 'পরবর্তী ধাপে যান' : 'Proceed to Payment'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <p className="text-sm text-stone-700 dark:text-stone-300">
                  {language === 'bn'
                    ? `${phoneNumber} নম্বরে ৪ সংখ্যার যাচাইকরণ কোড পাঠানো হয়েছে`
                    : `Enter the 4-digit code sent to ${phoneNumber}`}
                </p>
                <span className="text-xs text-stone-500 font-mono">
                  {language === 'bn' ? '(পরীক্ষার জন্য যেকোনো ৪ সংখ্যা দিন)' : '(Demo mode: enter any 4 numbers)'}
                </span>
              </div>

              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full text-center tracking-widest text-2xl font-mono py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('method')}
                  className="w-1/3 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-xl"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
                >
                  {language === 'bn' ? 'কোড নিশ্চিত করুন' : 'Confirm Code'}
                </button>
              </div>
            </div>
          )}

          {step === 'pin' && (
            <div className="space-y-4">
              <div className="text-center py-2">
                <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-2 text-stone-700 dark:text-stone-300">
                  <Lock className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 uppercase">
                  {language === 'bn'
                    ? `আপনার ${selectedMethod} পিন নম্বর দিন`
                    : `Enter your ${selectedMethod} PIN`}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  {language === 'bn'
                    ? 'এটি একটি পরীক্ষামূলক পরিবেশ (যেকোনো ৪-৫ সংখ্যা টাইপ করুন)'
                    : 'Simulated environment: enter any digits to proceed'}
                </p>
              </div>

              <input
                type="password"
                maxLength={5}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="• • • • •"
                className="w-full text-center tracking-widest text-2xl font-mono py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 outline-hidden"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="w-1/3 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-xl"
                >
                  {language === 'bn' ? 'ফিরে যান' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
                >
                  {language === 'bn' ? 'পেমেন্ট সম্পন্ন করুন' : 'Confirm & Pay'}
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                {language === 'bn' ? 'পেমেন্ট প্রক্রিয়াধীন রয়েছে...' : 'Processing secure payment...'}
              </p>
              <p className="text-xs text-stone-500">
                {language === 'bn' ? 'দয়া করে অপেক্ষা করুন, পেজটি রিফ্রেশ করবেন না।' : 'Please wait a moment, do not refresh.'}
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'পেমেন্ট সফল হয়েছে!' : 'Payment Successful!'}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                  {language === 'bn'
                    ? 'আপনার লেনদেন সফলভাবে রেকর্ড করা হয়েছে।'
                    : 'Your transaction has been confirmed.'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl text-xs font-mono text-stone-600 dark:text-stone-400 space-y-1">
                <div>TrxID: {txnId}</div>
                <div>Amount: {formatBDT(amount)}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (type === 'appointment') {
                    navigate('/visits');
                  } else {
                    navigate('/subscription');
                  }
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
              >
                {type === 'appointment'
                  ? (language === 'bn' ? 'পরামর্শ তালিকায় যান' : 'Go to My Visits')
                  : (language === 'bn' ? 'সাবস্ক্রিপশন পেজে যান' : 'Return to Membership')}
              </button>
            </div>
          )}
        </div>

        {/* Footer cancel button */}
        {step !== 'success' && step !== 'processing' && (
          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 border-t border-stone-200 dark:border-stone-800 text-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 font-medium inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {language === 'bn' ? 'বাতিল করে ফিরে যান' : 'Cancel & go back'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
