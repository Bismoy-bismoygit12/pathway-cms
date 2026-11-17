import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, CheckCircle2, Calendar, MessageSquareHeart, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  const items = [
    { to: '/my-day', label: t('nav.myDay'), icon: Sun },
    { to: '/goals', label: t('nav.goals'), icon: CheckCircle2 },
    { to: '/visits', label: t('nav.appointments'), icon: Calendar },
    { to: '/chat', label: t('nav.chat'), icon: MessageSquareHeart },
    { to: '/me', label: t('nav.profile'), icon: User }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg transition-colors"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition text-[10px] font-medium ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
