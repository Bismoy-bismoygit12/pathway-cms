import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Heart,
  Calendar,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { getAllStoredAppointments, updateAppointment } from '../services/appointments';
import { addDoctorGoal } from '../services/goals';
import { useLanguage } from '../context/LanguageContext';

export const PostVisit: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';

  const allApts = getAllStoredAppointments();
  const apt = allApts.find((a) => a.id === appointmentId) || allApts[0];

  const [rating, setRating] = useState<number>(apt?.rating || 5);
  const [feedback, setFeedback] = useState<string>(apt?.feedback || '');
  const [saved, setSaved] = useState(false);

  const handleSaveFeedback = () => {
    if (apt) {
      updateAppointment(apt.id, {
        rating,
        feedback
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleAddDoctorGoal = () => {
    if (apt) {
      addDoctorGoal({
        title: `Evening Calm Tea & Reflection (${apt.doctorName})`,
        titleBn: `সন্ধ্যার শান্ত চা ও অনুভূতি (${apt.doctorName})`,
        category: 'doctor',
        durationMinutes: 5,
        minDurationSeconds: 15,
        pointsReward: 35,
        doctorName: apt.doctorName,
        description: 'Recommended following your visit: unwind with warm tea and practice 5 deep mindful breaths.',
        descriptionBn: 'আপনার ভিজিট পরবর্তী চিকিৎসকের পরামর্শ: হালকা গরম চা পান করে ৫টি গভীর শ্বাস নিন।',
        steps: [
          { text: 'Pour a cup of warm water or green tea.', textBn: 'এক কাপ গরম পানি বা লিকার চা নিন।' },
          { text: 'Take 5 mindful breaths, feeling the steam rise.', textBn: 'চায়ের বাষ্প অনুভব করে ৫টি শান্ত শ্বাস নিন।' },
          { text: 'Write down one comforting takeaway from your consultation.', textBn: 'ডাক্তারের সাথে আলোচনার একটি ইতিবাচক বিষয় মনে করুন।' }
        ]
      });
      alert('Doctor goal added to Daily Goals!');
    }
  };

  if (!apt) {
    return (
      <div className="py-20 text-center">
        <h2>Visit not found</h2>
        <Link to="/visits" className="text-blue-700 underline text-sm mt-2 block">
          Back to Visits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Warm Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 mx-auto flex items-center justify-center">
          <Heart className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          How did your visit go?
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Your feedback is completely confidential and helps us maintain a gentle, safe standard of care.
        </p>
      </div>

      {/* Rating & Feedback Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="text-center space-y-2">
          <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
            Rate your consultation with {apt.doctorName}
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1.5 transition transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-700'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1.5">
            Personal Reflection or Feedback (Optional)
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="How did you feel during the conversation? Did the doctor explain things clearly?"
            className="w-full rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900 p-3.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSaveFeedback}
          className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition"
        >
          {saved ? 'Saved kindly!' : 'Save Feedback'}
        </button>
      </div>

      {/* Doctor's Notes & Suggested Goal */}
      <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100 font-bold text-sm">
          <Stethoscope className="w-4 h-4 text-blue-600" />
          <span>Doctor's Tips & Suggested Habit</span>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-white/70 dark:bg-stone-900/60 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40">
          {apt.doctorNote ||
            'Continue daily Box Breathing exercises. When evening cravings peak, remember to wait 15 minutes with a tall glass of cool water.'}
        </p>

        <button
          onClick={handleAddDoctorGoal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold shadow-xs hover:bg-blue-800 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Add this habit to My Daily Goals</span>
        </button>
      </div>

      {/* Follow-up & Dashboard Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          to={`/book/${apt.doctorId}`}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 text-center hover:bg-stone-50"
        >
          Book a Follow-Up Visit
        </Link>

        <button
          onClick={() => navigate('/my-day')}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
        >
          <span>Back to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
