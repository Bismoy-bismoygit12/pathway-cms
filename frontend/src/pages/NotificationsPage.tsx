import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, CheckCheck, Trash2, Calendar, Award, ShieldAlert, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, settings, updateSettings } = useNotifications();
  const { language, formatLocalizedDate } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | NotificationItem['category']>('all');
  const [showSettings, setShowSettings] = useState(false);

  // Filtered notifications
  const filtered = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !item.read;
    return item.category === activeTab;
  });

  const getCategoryIcon = (cat: NotificationItem['category']) => {
    switch (cat) {
      case 'visits':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'goals':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'rewards':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'security':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    markAsRead(item.id);
    if (item.link) {
      navigate(item.link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600" />
            {language === 'bn' ? 'বিজ্ঞপ্তি কেন্দ্র' : 'Notification Center'}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            {language === 'bn'
              ? 'আপনার সুস্থতা ও অ্যাপয়েন্টমেন্ট সংক্রান্ত সব নোটিফিকেশন।'
              : 'Discreet updates about your goals, visits, and recovery milestones.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              {language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : 'Mark all read'}
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
              showSettings
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'bn' ? 'সেটিংস' : 'Preferences'}</span>
          </button>
        </div>
      </div>

      {/* Settings Panel Accordion */}
      {showSettings && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
            {language === 'bn' ? 'বিজ্ঞপ্তি পছন্দসমূহ' : 'Notification Preferences'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40">
              <input
                type="checkbox"
                checked={settings.visitReminders}
                onChange={(e) => updateSettings({ visitReminders: e.target.checked })}
                className="mt-1 accent-blue-600"
              />
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'পরামর্শ রিমাইন্ডার' : 'Visit Reminders'}
                </span>
                <p className="text-xs text-stone-500">
                  {language === 'bn' ? 'সেশনের ১ ঘণ্টা ও ১৫ মিনিট আগে মনে করিয়ে দিন' : '1 hour and 15 mins before video visit'}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40">
              <input
                type="checkbox"
                checked={settings.dailyGoalReminders}
                onChange={(e) => updateSettings({ dailyGoalReminders: e.target.checked })}
                className="mt-1 accent-blue-600"
              />
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'দৈনিক লক্ষ্য রিমাইন্ডার' : 'Daily Goal Reminders'}
                </span>
                <p className="text-xs text-stone-500">
                  {language === 'bn' ? 'শান্ত বার্তা যাতে কোনো আসক্তির শব্দ থাকে না' : 'Gentle nudge without addiction terms'}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40">
              <input
                type="checkbox"
                checked={settings.motivationalPings}
                onChange={(e) => updateSettings({ motivationalPings: e.target.checked })}
                className="mt-1 accent-blue-600"
              />
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'শান্ত বার্তা ও অনুপ্রেরণা' : 'Gentle Encouragement'}
                </span>
                <p className="text-xs text-stone-500">
                  {language === 'bn' ? 'মৃদু মোটিভেশন বার্তা' : 'Mindful recovery tips during the week'}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-stone-200 dark:border-stone-800 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) => updateSettings({ emailAlerts: e.target.checked })}
                className="mt-1 accent-blue-600"
              />
              <div>
                <span className="font-medium text-stone-900 dark:text-stone-100">
                  {language === 'bn' ? 'ইমেইল কপি' : 'Email Notifications'}
                </span>
                <p className="text-xs text-stone-500">
                  {language === 'bn' ? 'পেমেন্ট ও বুকিং কনফার্মেশন পাঠানো হবে' : 'Invoices & booking updates to your inbox'}
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-medium border-b border-stone-200 dark:border-stone-800">
        {[
          { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
          { id: 'unread', label: `${language === 'bn' ? 'অপঠিত' : 'Unread'} (${unreadCount})` },
          { id: 'visits', label: language === 'bn' ? 'পরামর্শ' : 'Visits' },
          { id: 'goals', label: language === 'bn' ? 'লক্ষ্যসমূহ' : 'Goals' },
          { id: 'rewards', label: language === 'bn' ? 'মাইলস্টোন' : 'Rewards' },
          { id: 'security', label: language === 'bn' ? 'নিরাপত্তা' : 'Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto text-xs text-stone-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 p-1"
            title="Clear all notifications"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'bn' ? 'সব মুছুন' : 'Clear all'}</span>
          </button>
        )}
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
            <Bell className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            {language === 'bn' ? 'কোনো নোটিফিকেশন নেই' : 'No notifications in this view'}
          </p>
          <p className="text-xs text-stone-500">
            {language === 'bn'
              ? 'নতুন কোনো আপডেট থাকলে আপনি এখানে দেখতে পাবেন।'
              : 'You are all caught up! New updates will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                !item.read
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60 shadow-xs'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40'
              }`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                {getCategoryIcon(item.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                    {language === 'bn' ? item.titleBn : item.title}
                  </h3>
                  <span className="text-[11px] text-stone-400 shrink-0">
                    {formatLocalizedDate(item.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                  {language === 'bn' ? item.bodyBn : item.body}
                </p>
              </div>

              {!item.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 self-center" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
