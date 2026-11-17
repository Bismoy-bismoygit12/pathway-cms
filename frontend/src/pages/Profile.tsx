import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Phone,
  Mail,
  Heart,
  Lock,
  Smartphone,
  Download,
  PauseCircle,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Flame,
  Globe,
  Settings,
  Share2,
  Clock,
  History,
  Key,
  LogOut,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  updateUser,
  changeUserPassword,
  addTrustedContact,
  removeTrustedContact,
  revokeSession,
  revokeAllOtherSessions,
  pauseAccount,
  unpauseAccount,
  requestAccountDeletion,
  cancelAccountDeletion,
  exportUserData
} from '../services/user';
import { AvatarPicker } from '../components/common/AvatarPicker';
import { ConsentSwitch } from '../components/common/ConsentSwitch';
import { OtpInput } from '../components/common/OtpInput';
import avatarList from '../data/avatars.json';

export const Profile: React.FC = () => {
  const { currentUser, updateCurrentUser, refreshUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme, textSize, setTextSize, reducedMotion, setReducedMotion, lowDataMode, setLowDataMode } = useTheme();
  const navigate = useNavigate();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<
    | 'about'
    | 'contact'
    | 'recovery'
    | 'health'
    | 'trusted'
    | 'privacy'
    | 'security'
    | 'control'
    | 'appearance'
  >('about');

  // Success Toast
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Section 1: About Me Form
  const [nickname, setNickname] = useState(currentUser?.nickname || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [dob, setDob] = useState(currentUser?.dob || '1994-05-14');
  const [gender, setGender] = useState(currentUser?.gender || 'male');
  const [city, setCity] = useState(currentUser?.city || 'Dhaka');

  // Section 2: Contact Masking & Edit
  const [showFullEmail, setShowFullEmail] = useState(false);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [newContactValue, setNewContactValue] = useState('');
  const [contactOtpStep, setContactOtpStep] = useState(false);

  // Section 3: Recovery Preferences
  const [helpAreas, setHelpAreas] = useState<string[]>(currentUser?.preferences.helpWith || []);
  const [goalsList, setGoalsList] = useState<string[]>(currentUser?.preferences.goals || []);
  const [triggersList, setTriggersList] = useState<string[]>(currentUser?.preferences.triggers || []);

  // Section 4: Health Basics
  const [allergies, setAllergies] = useState(currentUser?.healthBasics.allergies || '');
  const [medicines, setMedicines] = useState(currentUser?.healthBasics.currentMedicines || '');
  const [pastCare, setPastCare] = useState(currentUser?.healthBasics.pastCareNotes || '');

  // Section 5: Trusted Contact Form
  const [trustedName, setTrustedName] = useState('');
  const [trustedRelation, setTrustedRelation] = useState('');
  const [trustedPhone, setTrustedPhone] = useState('');

  // Section 6: Security - Password change
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [quickPin, setQuickPin] = useState(currentUser?.quickLockPin || '');

  // Section 7: Account deletion multi-step modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  // Avatar picker modal
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please log in to view your profile</h2>
        <Link to="/login" className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-semibold">
          Log In
        </Link>
      </div>
    );
  }

  // Completeness score
  let completeness = 60;
  if (currentUser.trustedContacts && currentUser.trustedContacts.length > 0) completeness += 20;
  if (currentUser.healthBasics.allergies || currentUser.healthBasics.currentMedicines) completeness += 10;
  if (currentUser.city) completeness += 10;

  const userAvatarObj = avatarList.find((a) => a.id === currentUser.avatar) || avatarList[0];

  const maskString = (val?: string) => {
    if (!val) return 'Not provided';
    if (val.includes('@')) {
      const [u, d] = val.split('@');
      return `${u.slice(0, 2)}***@${d}`;
    }
    return `${val.slice(0, 3)}****${val.slice(-3)}`;
  };

  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      nickname,
      name: fullName,
      dob,
      gender: gender as any,
      city
    });
    showSuccess(t('common.savedSuccess'));
  };

  const handleSaveRecovery = () => {
    updateCurrentUser({
      preferences: {
        ...currentUser.preferences,
        helpWith: helpAreas,
        goals: goalsList,
        triggers: triggersList
      }
    });
    showSuccess('Recovery preferences saved safely.');
  };

  const handleSaveHealth = () => {
    updateCurrentUser({
      healthBasics: {
        allergies,
        currentMedicines: medicines,
        pastCareNotes: pastCare
      }
    });
    showSuccess('Health basics updated.');
  };

  const handleAddTrusted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trustedName.trim() || !trustedPhone.trim()) return;
    addTrustedContact(currentUser.id, {
      name: trustedName.trim(),
      relationship: trustedRelation.trim() || 'Supporter',
      phone: trustedPhone.trim(),
      canNotifyOnRelapse: true
    });
    refreshUser();
    setTrustedName('');
    setTrustedRelation('');
    setTrustedPhone('');
    showSuccess('Trusted contact added safely.');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmNewPw) {
      setPwError('Passwords do not match.');
      return;
    }
    const res = changeUserPassword(currentUser.id, currentPw, newPw);
    if (res.success) {
      setCurrentPw('');
      setNewPw('');
      setConfirmNewPw('');
      showSuccess('Password updated successfully.');
    } else {
      setPwError(res.error || 'Failed to update password.');
    }
  };

  const handleExportData = () => {
    const { jsonString, printableHtml } = exportUserData(currentUser);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pathway-data-${currentUser.nickname}.json`;
    a.click();
    showSuccess('Data exported as JSON file.');
  };

  const handlePauseAccount = () => {
    if (window.confirm('Take a break and pause account reminders? Progress will remain 100% safe.')) {
      pauseAccount(currentUser.id);
      refreshUser();
      showSuccess('Account paused. You can unpause anytime.');
    }
  };

  const handleConfirmAccountDeletion = () => {
    requestAccountDeletion(currentUser.id, deleteReason);
    refreshUser();
    setIsDeleteModalOpen(false);
    showSuccess('7-day deletion request active. You can cancel this anytime within 7 days.');
  };

  const handleCancelDeletion = () => {
    cancelAccountDeletion(currentUser.id);
    refreshUser();
    showSuccess('Account deletion cancelled. Your account remains fully active.');
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl bg-blue-800 text-white shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-blue-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Pending Deletion Notice Banner */}
      {currentUser.status === 'pending_deletion' && (
        <div className="p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Account Scheduled for Deletion</h4>
            <p className="text-xs">
              Grace period active until {currentUser.deletionRequestedAt?.split('T')[0]}. All data will be permanently wiped afterwards.
            </p>
          </div>
          <button
            onClick={handleCancelDeletion}
            className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            Cancel Deletion & Stay Active
          </button>
        </div>
      )}

      {/* Paused Account Notice Banner */}
      {currentUser.status === 'paused' && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Account is Paused ("Taking a Break")</h4>
            <p className="text-xs">
              Reminders and community visibility are hidden. Your progress is safe and untouched.
            </p>
          </div>
          <button
            onClick={() => {
              unpauseAccount(currentUser.id);
              refreshUser();
              showSuccess('Account unpaused and active.');
            }}
            className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            Unpause Account Now
          </button>
        </div>
      )}

      {/* 1. Header Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar button */}
          <button
            type="button"
            onClick={() => setIsAvatarPickerOpen(true)}
            className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl flex items-center justify-center text-4xl border-2 transition transform hover:scale-105 relative ${userAvatarObj.color} shadow-xs`}
            title="Click to change avatar icon"
          >
            {currentUser.customAvatarUrl ? (
              <img
                src={currentUser.customAvatarUrl}
                alt="Avatar"
                className="w-full h-full rounded-3xl object-cover"
              />
            ) : (
              <span>{userAvatarObj.emoji}</span>
            )}
            <span className="absolute bottom-1 right-1 text-[9px] bg-stone-900/80 text-white px-1.5 py-0.5 rounded-md">
              Edit
            </span>
          </button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {currentUser.nickname}
              </h1>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  currentUser.plan === 'premium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {currentUser.plan} Plan
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Member since {currentUser.createdAt} &bull; {currentUser.city || 'Bangladesh'}
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs">
              <span className="font-semibold text-amber-600 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{currentUser.streakDays} Day Streak</span>
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                {currentUser.points} Points
              </span>
            </div>
          </div>
        </div>

        {/* Completeness Ring */}
        <div className="bg-stone-50 dark:bg-slate-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-4 shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90">
              <circle cx="28" cy="28" r="22" className="stroke-stone-200 dark:stroke-stone-700" strokeWidth="5" fill="transparent" />
              <circle
                cx="28"
                cy="28"
                r="22"
                className="stroke-blue-600"
                strokeWidth="5"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * completeness) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-bold text-xs text-stone-900 dark:text-stone-100">
              {completeness}%
            </span>
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-stone-800 dark:text-stone-200 block">
              {t('profile.completeness')}
            </span>
            <span className="text-stone-500 block text-[11px]">
              {completeness === 100 ? 'All details filled' : 'Add trusted contact to reach 90%'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-stone-100 dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-semibold">
        {[
          { key: 'about', label: t('profile.tabs.about') },
          { key: 'contact', label: t('profile.tabs.contact') },
          { key: 'recovery', label: t('profile.tabs.recovery') },
          { key: 'health', label: t('profile.tabs.health') },
          { key: 'trusted', label: t('profile.tabs.trusted') },
          { key: 'privacy', label: t('profile.tabs.privacy') },
          { key: 'security', label: t('profile.tabs.security') },
          { key: 'control', label: t('profile.tabs.account') },
          { key: 'appearance', label: t('profile.tabs.appearance') }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
              activeTab === tab.key
                ? 'bg-white dark:bg-stone-900 text-blue-800 dark:text-blue-200 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT SECTIONS */}

      {/* TAB 1: About Me */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">About Me</h3>
            <p className="text-xs text-stone-500">Every field is private unless explicitly shared.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Nickname <span className="text-blue-600 font-normal">(Required)</span></label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Full Name <span className="text-stone-400 font-normal">(Optional)</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Can remain private"
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Date of Birth <span className="text-blue-600 font-normal">(18+ check enforced)</span></label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Gender <span className="text-stone-400 font-normal">(Optional)</span></label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">City or Area <span className="text-stone-400 font-normal">(Optional)</span></label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dhaka, Dhanmondi"
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Timezone</label>
              <input
                type="text"
                disabled
                value="Asia/Dhaka (GMT+6)"
                className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-xs"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Contact Details */}
      {activeTab === 'contact' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Verified Contact Details
            </h3>
            <p className="text-xs text-stone-500">
              Used strictly for appointment reminders and security login verification.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email display */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    {showFullEmail ? currentUser.email : maskString(currentUser.email)}
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">
                    Verified Email
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullEmail(!showFullEmail)}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                {showFullEmail ? 'Mask' : 'Show'}
              </button>
            </div>

            {/* Phone display */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                    {showFullPhone ? currentUser.phone : maskString(currentUser.phone)}
                  </div>
                  <span className="text-[10px] text-blue-600 font-bold uppercase">
                    Verified Phone (SMS Reminders)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullPhone(!showFullPhone)}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                {showFullPhone ? 'Mask' : 'Show'}
              </button>
            </div>
          </div>

          {/* Change Contact Trigger */}
          <div className="pt-2">
            {!isEditingContact ? (
              <button
                onClick={() => setIsEditingContact(true)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Update Contact Information (Requires Mock OTP)
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 space-y-3">
                <div className="font-bold text-xs">Enter New Email or Phone</div>
                <input
                  type="text"
                  value={newContactValue}
                  onChange={(e) => setNewContactValue(e.target.value)}
                  placeholder="e.g. 018XXXXXXXX or new@example.com"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />

                {!contactOtpStep ? (
                  <button
                    onClick={() => {
                      if (newContactValue.trim()) setContactOtpStep(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold"
                  >
                    Send Verification Code
                  </button>
                ) : (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-stone-500">Enter mock 6-digit code sent to new contact:</p>
                    <OtpInput
                      onComplete={(code) => {
                        if (newContactValue.includes('@')) {
                          updateCurrentUser({ email: newContactValue, emailVerified: true });
                        } else {
                          updateCurrentUser({ phone: newContactValue, phoneVerified: true });
                        }
                        setIsEditingContact(false);
                        setContactOtpStep(false);
                        showSuccess('Contact updated successfully!');
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Recovery Preferences */}
      {activeTab === 'recovery' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Recovery Focus & Triggers
            </h3>
            <p className="text-xs text-stone-500">
              Only you can see this unless you explicitly choose to share during a doctor booking.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Focus Areas:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Substance & Alcohol Recovery', 'Sleep restoration', 'Stress management', 'Urge reduction'].map((item) => {
                  const sel = helpAreas.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setHelpAreas(sel ? helpAreas.filter((i) => i !== item) : [...helpAreas, item])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        sel ? 'bg-blue-700 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                Known Triggers:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Evening fatigue', 'Work pressure', 'Being alone', 'Old friends', 'Insomnia'].map((item) => {
                  const sel = triggersList.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTriggersList(sel ? triggersList.filter((i) => i !== item) : [...triggersList, item])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        sel ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={handleSaveRecovery}
              className="px-6 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Health Basics */}
      {activeTab === 'health' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">Health Notes</h3>
            <p className="text-xs text-stone-500">
              Optional. This is not medical advice and is never shared unless you say so.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Known Allergies (e.g. Penicillin, Aspirin)</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="None or list known allergies..."
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Current Medicines / Supplements</label>
              <textarea
                rows={2}
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                placeholder="Plain text list of vitamins, prescriptions, or sleep aids..."
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Past Care Notes</label>
              <textarea
                rows={2}
                value={pastCare}
                onChange={(e) => setPastCare(e.target.value)}
                placeholder="Any past outpatient programs or medical notes..."
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={handleSaveHealth}
              className="px-6 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs shadow-xs"
            >
              Save Health Notes
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: Trusted Contact */}
      {activeTab === 'trusted' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Trusted Person for Crisis & Relapse
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pathway will only message this person if you explicitly tap "Message my trusted person" on the Relapse or Crisis page. It is never automatic.
            </p>
          </div>

          {/* Current contacts list */}
          <div className="space-y-3">
            {currentUser.trustedContacts.length === 0 ? (
              <p className="text-xs text-stone-400 py-2">No trusted contacts added yet.</p>
            ) : (
              currentUser.trustedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100">
                      {contact.name} ({contact.relationship})
                    </h4>
                    <span className="text-stone-500">{contact.phone}</span>
                  </div>
                  <button
                    onClick={() => {
                      removeTrustedContact(currentUser.id, contact.id);
                      refreshUser();
                      showSuccess('Contact removed.');
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add form */}
          <form onSubmit={handleAddTrusted} className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
            <span className="font-bold block">Add a New Trusted Person</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={trustedName}
                onChange={(e) => setTrustedName(e.target.value)}
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-slate-900"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Brother, Friend)"
                value={trustedRelation}
                onChange={(e) => setTrustedRelation(e.target.value)}
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-slate-900"
              />
              <input
                type="text"
                required
                placeholder="Mobile (e.g. 018XXXXXXXX)"
                value={trustedPhone}
                onChange={(e) => setTrustedPhone(e.target.value)}
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-700 text-white font-semibold text-xs shadow-xs"
            >
              Add Trusted Person
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: Privacy & Sharing */}
      {activeTab === 'privacy' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Privacy Permissions & Access Log
            </h3>
            <p className="text-xs text-stone-500">
              Manage all granular switches and review access logs.
            </p>
          </div>

          <div className="space-y-3">
            <ConsentSwitch
              id="sw-ai"
              label="AI Helper Support"
              description="Allows AI companion to assist with urge surfing and relaxation."
              checked={currentUser.consents.aiHelp}
              onChange={(c) => updateCurrentUser({ consents: { ...currentUser.consents, aiHelp: c } })}
            />

            <ConsentSwitch
              id="sw-mem"
              label="Chatbot Memory"
              description="Retains your calming tool preferences across chat sessions."
              checked={currentUser.consents.chatbotMemory}
              onChange={(c) => updateCurrentUser({ consents: { ...currentUser.consents, chatbotMemory: c } })}
            />

            <ConsentSwitch
              id="sw-doc"
              label="Doctor Data Sharing"
              description="Master switch allowing doctors you book to view authorized records."
              checked={currentUser.consents.shareWithDoctors}
              onChange={(c) => updateCurrentUser({ consents: { ...currentUser.consents, shareWithDoctors: c } })}
            />
          </div>

          {/* Access Logs */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Recent Doctor Access History
            </h4>
            {currentUser.accessLogs.length === 0 ? (
              <p className="text-xs text-stone-400">No doctors have viewed your records yet.</p>
            ) : (
              currentUser.accessLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-stone-50 dark:bg-slate-900 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{log.doctorName}</span>
                    <span className="text-stone-400 block text-[11px]">{log.itemsViewed.join(', ')}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{log.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 7: Security & Sessions */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Security & Active Devices
            </h3>
            <p className="text-xs text-stone-500">
              Change password and revoke sessions from other phones or computers.
            </p>
          </div>

          {/* Password Change Form */}
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md text-xs">
            <span className="font-bold text-sm block">Change Password</span>
            {pwError && <p className="text-xs text-rose-600 font-medium">{pwError}</p>}
            <div>
              <label className="block mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmNewPw}
                onChange={(e) => setConfirmNewPw(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-xs shadow-xs"
            >
              Update Password
            </button>
          </form>

          {/* Active Devices & Sessions */}
          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Where I am logged in
              </h4>
              <button
                onClick={() => {
                  revokeAllOtherSessions(currentUser.id);
                  refreshUser();
                  showSuccess('Logged out of all other devices.');
                }}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Log out of all other devices
              </button>
            </div>

            <div className="space-y-2">
              {currentUser.sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span>{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            Current Device
                          </span>
                        )}
                      </div>
                      <span className="text-stone-400 text-[11px]">{sess.city} &bull; {sess.lastActive}</span>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => {
                        revokeSession(currentUser.id, sess.id);
                        refreshUser();
                        showSuccess('Device session revoked.');
                      }}
                      className="text-xs text-stone-500 hover:text-rose-600 font-medium"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: Account Control & Data Sovereignty */}
      {activeTab === 'control' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Account Control & Data Ownership
            </h3>
            <p className="text-xs text-stone-500">
              You own your recovery record. Download, take a break, or permanently delete.
            </p>
          </div>

          <div className="space-y-4">
            {/* Export data */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Export All My Data
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Downloads a complete JSON file and printable summary of all check-ins, habits, and preferences.
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Pause Account */}
            <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  Pause My Account ("Take a Break")
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Hides you from notification reminders. All streaks and data remain completely untouched.
                </p>
              </div>
              <button
                onClick={handlePauseAccount}
                className="px-4 py-2 rounded-xl border border-amber-300 text-amber-800 text-xs font-semibold hover:bg-amber-50 shrink-0"
              >
                Pause Account
              </button>
            </div>

            {/* Delete Account */}
            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-rose-900 dark:text-rose-200">
                  Permanently Delete My Account & Data
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                  Multi-step confirm with a 7-day grace period where you can cancel anytime.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 shadow-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: Appearance & Accessibility */}
      {activeTab === 'appearance' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Appearance & Accessibility
            </h3>
            <p className="text-xs text-stone-500">
              Customize contrast, motion, text size, and low-data modes for maximum comfort.
            </p>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                  Soft Dark Mode
                </span>
                <span className="text-xs text-stone-400">Gentle on tired eyes</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                {theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
              </button>
            </div>

            {/* Text Size */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                  Text Size
                </span>
                <span className="text-xs text-stone-400">Increase font scale for easier reading</span>
              </div>
              <div className="flex gap-2 text-xs font-semibold">
                <button
                  onClick={() => setTextSize('normal')}
                  className={`px-3 py-1.5 rounded-xl border ${textSize === 'normal' ? 'bg-blue-700 text-white' : 'border-stone-300'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setTextSize('large')}
                  className={`px-3 py-1.5 rounded-xl border ${textSize === 'large' ? 'bg-blue-700 text-white' : 'border-stone-300'}`}
                >
                  Large
                </button>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
              <div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100 block">
                  Reduce Motion
                </span>
                <span className="text-xs text-stone-400">Disables animations and transitions</span>
              </div>
              <button
                type="button"
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-4 py-1.5 rounded-xl border text-xs font-semibold ${
                  reducedMotion ? 'bg-blue-700 text-white' : 'border-stone-300'
                }`}
              >
                {reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {isAvatarPickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-xl border border-stone-200 dark:border-stone-800 animate-in zoom-in-95">
            <AvatarPicker
              selectedAvatar={currentUser.avatar}
              customAvatarUrl={currentUser.customAvatarUrl}
              onSelect={(avId, customUrl) => {
                updateCurrentUser({
                  avatar: avId,
                  customAvatarUrl: customUrl
                });
                setIsAvatarPickerOpen(false);
                showSuccess('Avatar updated!');
              }}
            />
            <button
              onClick={() => setIsAvatarPickerOpen(false)}
              className="w-full py-2.5 rounded-xl border border-stone-300 text-xs font-semibold mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Multi-Step Delete Modal */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl border border-rose-200 dark:border-rose-900 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Confirm Account Deletion
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed text-left">
              We respect your choice completely. If you confirm, your account will enter a <strong>7-day grace period</strong> during which you can cancel at any time. After 7 days, all journals, goals, and records are permanently deleted.
            </p>

            <div className="text-left space-y-2 text-xs pt-1">
              <label className="font-semibold block">Optional Reason for Leaving</label>
              <input
                type="text"
                placeholder="e.g. Taking a break, achieved my goal..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-slate-900"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAccountDeletion}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-sm"
              >
                Schedule Deletion (7 Days)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
