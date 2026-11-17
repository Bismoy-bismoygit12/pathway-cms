import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { getAllStoredAppointments, saveAllAppointments, updateAppointment } from '../services/appointments';
import { addDoctorGoal } from '../services/goals';

interface DemoContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  crisisTriggerActive: boolean;
  setCrisisTriggerActive: (val: boolean) => void;
  simulateDoctorConfirm: () => string;
  simulateDoctorDecline: () => string;
  simulateDoctorComplete: () => string;
  simulateDoctorSendNote: () => string;
  simulateDoctorSuggestGoal: () => string;
  simulateNewDeviceLogin: () => void;
  simulateFastForward7Days: () => void;
  resetAllDemoData: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [crisisTriggerActive, setCrisisTriggerActive] = useState(false);

  const { currentUser, switchDemoUser, updateCurrentUser, refreshUser } = useAuth();
  const { addNotification } = useNotifications();

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  const toggleSimulatedOffline = () => {
    setIsSimulatedOffline((prev) => !prev);
  };

  const simulateDoctorConfirm = (): string => {
    const all = getAllStoredAppointments();
    const apt = all.find((a) => a.status === 'requested');
    if (!apt) {
      // Find the first upcoming one or create a toast
      return 'No appointment in "Requested" state. Please book a visit first to test confirmation!';
    }
    updateAppointment(apt.id, { status: 'confirmed' });
    addNotification({
      category: 'visits',
      title: 'Visit Confirmed by Doctor',
      titleBn: 'ডাক্তার অ্যাপয়েন্টমেন্ট নিশ্চিত করেছেন',
      body: `Your visit with ${apt.doctorName} on ${apt.date} at ${apt.time} is now confirmed.`,
      bodyBn: `${apt.doctorName}-এর সাথে আপনার ভিজিট নিশ্চিত করা হয়েছে।`,
      link: '/visits'
    });
    return `Appointment ${apt.id} confirmed!`;
  };

  const simulateDoctorDecline = (): string => {
    const all = getAllStoredAppointments();
    const apt = all.find((a) => a.status === 'requested' || a.status === 'confirmed');
    if (!apt) return 'No active appointment to decline.';
    updateAppointment(apt.id, { status: 'cancelled' });
    addNotification({
      category: 'visits',
      title: 'Doctor Schedule Conflict',
      titleBn: 'ডাক্তারের সময় পরিবর্তন প্রয়োজন',
      body: `Dr. was called into surgery. Your slot for ${apt.date} was cancelled. Full refund queued.`,
      bodyBn: `অনিবার্য কারণে অ্যাপয়েন্টমেন্ট বাতিল হয়েছে। রিফান্ড প্রক্রিয়া শুরু হয়েছে।`,
      link: '/visits'
    });
    return `Appointment ${apt.id} cancelled with refund notice.`;
  };

  const simulateDoctorComplete = (): string => {
    const all = getAllStoredAppointments();
    const apt = all.find((a) => a.status === 'confirmed');
    if (!apt) return 'No confirmed appointment to mark completed.';
    updateAppointment(apt.id, {
      status: 'completed',
      doctorNote: 'Patient showed great progress. Maintained calm breathing exercises.'
    });
    addNotification({
      category: 'visits',
      title: 'Consultation Complete',
      titleBn: 'পরামর্শ সম্পন্ন হয়েছে',
      body: `Your visit with ${apt.doctorName} is complete. Rate your visit and view notes.`,
      bodyBn: `ভিজিট সম্পন্ন হয়েছে। আপনার মতামত দিন।`,
      link: '/visits'
    });
    return `Appointment ${apt.id} marked as completed.`;
  };

  const simulateDoctorSendNote = (): string => {
    const all = getAllStoredAppointments();
    const apt = all[0];
    if (apt) {
      updateAppointment(apt.id, {
        doctorNote: 'Dr. Tanvir Ahmed: "Keep your evening tea habit. Remember 10-minute urge surfing whenever cravings peak."'
      });
    }
    addNotification({
      category: 'visits',
      title: 'New note from your psychiatrist',
      titleBn: 'আপনার ডাক্তারের নতুন পরামর্শ',
      body: 'Prof. Dr. Tanvir Ahmed added a comforting recovery note to your summary.',
      bodyBn: 'অধ্যাপক ডাঃ তানভীর আহমেদ আপনার সারসংক্ষেপে একটি নতুন পরামর্শ যোগ করেছেন।',
      link: '/visits'
    });
    return 'Doctor note sent to visits!';
  };

  const simulateDoctorSuggestGoal = (): string => {
    addDoctorGoal({
      title: '5-Minute Calm Guided Breath with Tea',
      titleBn: 'এক কাপ গরম চায়ের সাথে ৫ মিনিটের শান্ত শ্বাস',
      category: 'doctor',
      durationMinutes: 5,
      minDurationSeconds: 15,
      pointsReward: 35,
      doctorName: 'Prof. Dr. Tanvir Ahmed',
      description: 'Suggested by Dr. Tanvir: Sip warm tea and take 5 slow deep breaths.',
      descriptionBn: 'ডাঃ তানভীরের বিশেষ পরামর্শ: গরম চা উপভোগের সাথে ৫টি গভীর শ্বাস নিন।',
      steps: [
        { text: 'Brew a mild herbal or green tea.', textBn: 'এক কাপ হালকা গ্রিন টি বা আদা চা তৈরি করুন।' },
        { text: 'Inhale the aroma warmly before each sip.', textBn: 'চায়ে চুমুক দেওয়ার আগে ঘ্রাণ উপভোগ করুন।' },
        { text: 'Let your body relax deeply.', textBn: 'শরীরকে পুরোপুরি শিথিল করুন।' }
      ]
    });
    addNotification({
      category: 'goals',
      title: 'New goal suggested by doctor',
      titleBn: 'ডাক্তারের দেওয়া নতুন লক্ষ্য',
      body: 'Prof. Dr. Tanvir Ahmed suggested a custom 5-minute relaxation goal.',
      bodyBn: 'অধ্যাপক ডাঃ তানভীর আহমেদ একটি নতুন শান্ত অনুশীলনের পরামর্শ দিয়েছেন।',
      link: '/goals'
    });
    return 'Doctor suggested goal added to Daily Goals!';
  };

  const simulateNewDeviceLogin = () => {
    addNotification({
      category: 'security',
      title: 'New sign-in detected',
      titleBn: 'নতুন ডিভাইস থেকে সাইন ইন শনাক্ত হয়েছে',
      body: 'A new session was registered from Safari Mobile in Chittagong.',
      bodyBn: 'চট্টগ্রাম থেকে সাফারি মোবাইল ব্রাউজারে একটি নতুন লগ ইন শনাক্ত হয়েছে।',
      link: '/me'
    });
  };

  const simulateFastForward7Days = () => {
    if (currentUser) {
      updateCurrentUser({
        streakDays: (currentUser.streakDays || 1) + 7,
        points: (currentUser.points || 0) + 140
      });
      // If pending deletion, trigger deletion completed
      if (currentUser.status === 'pending_deletion') {
        updateCurrentUser({ status: 'deleted' });
      }
    }
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <DemoContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
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
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
