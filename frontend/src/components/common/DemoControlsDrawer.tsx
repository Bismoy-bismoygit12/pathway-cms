import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  UserCheck,
  UserX,
  Crown,
  Lock,
  PauseCircle,
  Trash2,
  FastForward,
  WifiOff,
  AlertOctagon,
  CalendarCheck,
  CalendarX,
  Stethoscope,
  Sparkles,
  RotateCcw,
  Smartphone
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const DemoControlsDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    toggleDrawer,
    isSimulatedOffline,
    toggleSimulatedOffline,
    crisisTriggerActive,
    setCrisisTriggerActive,
    simulateDoctorConfirm,
    simulateDoctorDecline,
    simulateDoctorComplete,
    simulateDoctorSendNote,
    simulateDoctorSuggestGoal,
    simulateNewDeviceLogin,
    simulateFastForward7Days,
    resetAllDemoData
  } = useDemo();

  const { currentUser, switchDemoUser } = useAuth();
  const { language } = useLanguage();
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const isBn = language === 'bn';

  return (
    <>
      {/* Floating Demo Launcher Button (small, discreet in bottom corner) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={toggleDrawer}
          title="Open Demo Controls (Test personas, doctor actions, edge cases)"
          aria-label="Open Demo Controls"
          className="flex items-center gap-2 bg-stone-900/90 hover:bg-stone-900 text-stone-100 text-xs font-medium px-3 py-2 rounded-full shadow-lg border border-stone-700/80 backdrop-blur transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
          <span>Demo Controls</span>
          {currentUser && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-900/80 text-blue-200 border border-blue-700/50">
              {currentUser.plan}
            </span>
          )}
        </button>
      </div>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs flex justify-end"
        >
          <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-850">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">Demo Controls</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Switch personas & simulate doctor replies
                  </p>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                aria-label="Close drawer"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Toast inside drawer if triggered */}
            {feedbackToast && (
              <div className="mx-4 mt-3 p-3 bg-blue-700 text-white text-xs rounded-xl shadow-md transition animate-in fade-in">
                {feedbackToast}
              </div>
            )}

            {/* Scrollable controls list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
              {/* Persona Switcher */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  User Persona & Account State
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      switchDemoUser('guest');
                      showFeedback('Logged out as Guest visitor.');
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4 text-stone-500" />
                    <div>
                      <div className="font-medium text-xs">Guest</div>
                      <div className="text-[10px] text-stone-400">Logged out</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('free');
                      showFeedback('Switched to Shanto (Free Plan, 8-day streak).');
                    }}
                    className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-xs">Free User</div>
                      <div className="text-[10px] text-stone-400">Shanto (8 days)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('premium');
                      showFeedback('Switched to Nabila (Premium Plan, 21-day streak).');
                    }}
                    className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-left hover:bg-amber-50 dark:hover:bg-amber-900/30 transition flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-medium text-xs">Premium User</div>
                      <div className="text-[10px] text-stone-400">Nabila (21 days)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('paused');
                      showFeedback('Account set to Paused state ("Taking a break").');
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition flex items-center gap-2"
                  >
                    <PauseCircle className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-xs">Paused Account</div>
                      <div className="text-[10px] text-stone-400">Taking a break</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('locked');
                      showFeedback('Account set to Locked state (5 wrong attempts).');
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-rose-500" />
                    <div>
                      <div className="font-medium text-xs">Locked Account</div>
                      <div className="text-[10px] text-stone-400">5-min safety pause</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('pending_deletion');
                      showFeedback('Account set to Pending Deletion (7-day grace period).');
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-left hover:bg-stone-50 dark:hover:bg-stone-800 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <div>
                      <div className="font-medium text-xs">Pending Delete</div>
                      <div className="text-[10px] text-stone-400">7-day grace active</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Simulated Doctor Actions (FR-05) */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Simulated Doctor Actions</span>
                </div>
                <p className="text-xs text-stone-500">
                  Simulate what the doctor would do on their end (no doctor login needed).
                </p>

                <div className="grid gap-2">
                  <button
                    onClick={() => showFeedback(simulateDoctorConfirm())}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                      Doctor: Confirm next requested visit
                    </span>
                    <span className="text-[10px] text-stone-400">Status &rarr; Confirmed</span>
                  </button>

                  <button
                    onClick={() => showFeedback(simulateDoctorDecline())}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarX className="w-3.5 h-3.5 text-rose-500" />
                      Doctor: Schedule conflict / Decline visit
                    </span>
                    <span className="text-[10px] text-stone-400">Status &rarr; Cancelled</span>
                  </button>

                  <button
                    onClick={() => showFeedback(simulateDoctorComplete())}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      Doctor: Mark visit as completed
                    </span>
                    <span className="text-[10px] text-stone-400">Status &rarr; Completed</span>
                  </button>

                  <button
                    onClick={() => showFeedback(simulateDoctorSuggestGoal())}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Doctor: Suggest recovery goal
                    </span>
                    <span className="text-[10px] text-blue-600">Adds to "From Doctor"</span>
                  </button>

                  <button
                    onClick={() => showFeedback(simulateDoctorSendNote())}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />
                      Doctor: Send post-visit advice note
                    </span>
                    <span className="text-[10px] text-stone-400">Pushes note</span>
                  </button>
                </div>
              </div>

              {/* Edge Cases & Simulators */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Simulation & Edge Cases
                </span>

                <div className="grid gap-2">
                  <button
                    onClick={() => {
                      simulateFastForward7Days();
                      showFeedback('Fast-forwarded 7 days: +7 days streak, +140 points.');
                    }}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <FastForward className="w-3.5 h-3.5 text-amber-500" />
                      Fast-forward 7 days (+streak & points)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      simulateNewDeviceLogin();
                      showFeedback('Security alert notification dispatched.');
                    }}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5 text-stone-500" />
                      Simulate sign-in from new device
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      toggleSimulatedOffline();
                      showFeedback(
                        !isSimulatedOffline
                          ? 'Simulated offline: Connection dropped banner active.'
                          : 'Simulated online: Connection restored.'
                      );
                    }}
                    className={`w-full py-2 px-3 text-xs font-medium rounded-xl border flex items-center justify-between transition ${
                      isSimulatedOffline
                        ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                      Simulate connection drop / Offline
                    </span>
                    <span className="text-[10px] font-semibold">{isSimulatedOffline ? 'OFFLINE' : 'ONLINE'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCrisisTriggerActive(!crisisTriggerActive);
                      showFeedback('Crisis risk banner toggled.');
                    }}
                    className="w-full py-2 px-3 text-xs font-medium rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 hover:bg-rose-100/50 flex items-center justify-between transition"
                  >
                    <span className="flex items-center gap-2">
                      <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                      Trigger Crisis Support Banner
                    </span>
                    <span className="text-[10px] font-semibold">{crisisTriggerActive ? 'ACTIVE' : 'IDLE'}</span>
                  </button>
                </div>
              </div>

              {/* Reset Data */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <button
                  onClick={() => {
                    if (window.confirm('Reset all demo data and restore initial clean state?')) {
                      resetAllDemoData();
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 text-xs font-medium flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset all data to defaults</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
