import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationItem, NotificationSettings } from '../types';
import { api } from '../services/api';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'visits',
    title: 'Upcoming visit tomorrow',
    titleBn: 'আগামীকাল আপনার নির্ধারিত ভিজিট',
    body: 'Your 4:30 PM appointment with Prof. Dr. Tanvir Ahmed is confirmed.',
    bodyBn: 'অধ্যাপক ডাঃ তানভীর আহমেদের সাথে বিকাল ৪:৩০-এর অনলাইন ভিজিট নিশ্চিত রয়েছে।',
    createdAt: '10 minutes ago',
    read: false,
    link: '/visits'
  },
  {
    id: 'notif-2',
    category: 'goals',
    title: 'Daily moment is ready',
    titleBn: 'আপনার ৫ মিনিটের রুটিন প্রস্তুত',
    body: 'Take a gentle breath and try your Box Breathing habit.',
    bodyBn: 'একটু শান্ত হয়ে আপনার বক্স ব্রিদিং অনুশীলনটি সম্পন্ন করুন।',
    createdAt: '2 hours ago',
    read: false,
    link: '/goals'
  },
  {
    id: 'notif-3',
    category: 'security',
    title: 'Login from active device',
    titleBn: 'নতুন ডিভাইস থেকে নিরাপদ লগইন',
    body: 'Pathway was accessed from Windows Chrome in Dhaka.',
    bodyBn: 'ঢাকা থেকে ক্রোম ব্রাউজারে সফলভাবে লগ ইন করা হয়েছে।',
    createdAt: 'Yesterday',
    read: true,
    link: '/me'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const raw = localStorage.getItem('pathway_notifications');
    return raw ? JSON.parse(raw) : SEED_NOTIFICATIONS;
  });

  useEffect(() => {
    api.get('/notifications').then((res) => {
      if (res.success && res.data?.notifications && Array.isArray(res.data.notifications) && res.data.notifications.length > 0) {
        setNotifications(res.data.notifications);
        localStorage.setItem('pathway_notifications', JSON.stringify(res.data.notifications));
      }
    }).catch(() => {});
  }, []);

  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const raw = localStorage.getItem('pathway_notification_settings');
    return raw
      ? JSON.parse(raw)
      : {
          emailAlerts: true,
          smsAlerts: true,
          browserAlerts: false,
          dailyGoalReminders: true,
          visitReminders: true,
          motivationalPings: true,
          rewardPings: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00'
        };
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem('pathway_notifications', JSON.stringify(updated));
    api.patch(`/notifications/${id}/read`).catch(() => {});
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('pathway_notifications', JSON.stringify(updated));
    api.patch('/notifications/read-all').catch(() => {});
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: 'Just now',
      read: false
    };
    const updated = [newItem, ...notifications];
    setNotifications(updated);
    localStorage.setItem('pathway_notifications', JSON.stringify(updated));
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('pathway_notification_settings', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('pathway_notifications');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        settings,
        updateSettings,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
