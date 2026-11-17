import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sun,
  CheckCircle2,
  Calendar,
  MessageSquareHeart,
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  LifeBuoy,
  Users,
  User,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();

  const navItems = [
    { to: '/my-day', label: t('nav.myDay'), icon: Sun },
    { to: '/goals', label: t('nav.goals'), icon: CheckCircle2 },
    { to: '/visits', label: t('nav.appointments'), icon: Calendar },
    { to: '/chat', label: t('nav.chat'), icon: MessageSquareHeart },
    { to: '/library', label: t('nav.library'), icon: BookOpen },
    { to: '/reports', label: t('nav.reports'), icon: FileText },
    { to: '/progress', label: t('nav.progress'), icon: TrendingUp },
    { to: '/rewards', label: t('nav.rewards'), icon: Award },
    { to: '/relapse-support', label: t('nav.relapse'), icon: HeartHandshake },
    { to: '/community', label: t('nav.community'), icon: Users },
    { to: '/me', label: t('nav.profile'), icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 space-y-6 transition-colors">
      {/* User Progress Pill */}
      {currentUser && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
            <span>{currentUser.streakDays} Day Streak</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{currentUser.points} pts</span>
          </div>
          <div className="w-full bg-blue-200/60 dark:bg-blue-900/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((currentUser.points % 100) || 40, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Nav List */}
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-sm shadow-blue-700/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Crisis Help Link in Sidebar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-auto">
        <NavLink
          to="/emergency"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100/60 transition"
        >
          <LifeBuoy className="w-4 h-4 shrink-0" />
          <span>{t('app.getHelpNow')}</span>
        </NavLink>
      </div>
    </aside>
  );
};
