import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  PhoneCall,
  Sun,
  Moon,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { QuickExitButton } from '../common/QuickExit';
import { GetHelpModal } from '../common/GetHelpModal';
import avatarList from '../../data/avatars.json';

export const Header: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isBn = language === 'bn';

  // Find avatar icon/color
  const userAvatarObj = avatarList.find((a) => a.id === currentUser?.avatar) || avatarList[0];

  return (
    <>
      {/* Top Professional Announcement Bar - Inspired by Medivan Reference */}
      <div className="bg-[#0f172a] text-slate-300 text-[11px] font-medium py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="truncate">
              {isBn
                ? 'শান্ত পদক্ষেপে সুস্থতার প্রতিশ্রুতি • নির্ভরযোগ্য স্বাস্থ্য সহায়তা'
                : 'Committed to Health & Recovery. Guided with Compassion.'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>{isBn ? 'নির্ভরযোগ্য সেবা' : 'Quality You Can Trust'}</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isBn ? 'যাচাইকৃত বিশেষজ্ঞ' : 'Verified Specialists'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand - Clinical Blue & Cyan Cross Quadrant */}
          <div className="flex items-center gap-6">
            <Link
              to={isAuthenticated ? '/my-day' : '/'}
              className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg group"
            >
              {/* Reference-inspired Cross Logo in Cobalt & Cyan */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-700 flex items-center justify-center p-1.5 shadow-sm shadow-blue-700/20 group-hover:scale-105 transition">
                <div className="w-full h-full relative flex items-center justify-center">
                  <div className="absolute w-full h-2 bg-cyan-400 rounded-full" />
                  <div className="absolute h-full w-2 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    {t('app.name')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
                  {isBn ? 'শান্ত পদক্ষেপে সুস্থতা' : 'Gentle Recovery Support'}
                </span>
              </div>
            </Link>

            {/* Desktop Public Nav (when logged out) */}
            {!isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1">
                {[
                  { to: '/how-it-works', label: t('nav.howItWorks') },
                  { to: '/doctors', label: t('nav.doctors') },
                  { to: '/library', label: t('nav.library') },
                  { to: '/pricing', label: t('nav.pricing') },
                  { to: '/faq', label: t('nav.faq') },
                ].map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40'
                          : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-1 inset-x-3.5 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Exit Button (Always visible) */}
            <QuickExitButton />

            {/* Dark / Light Mode Theme Toggle (Functional) */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={theme === 'dark' ? (isBn ? 'লাইট মোড চালু করুন' : 'Switch to Light Mode') : (isBn ? 'ডার্ক মোড চালু করুন' : 'Switch to Dark Mode')}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              aria-label="Switch language between English and Bangla"
              title="Switch language (English / বাংলা)"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Get Help Now (Prominent, Always visible) */}
            <button
              onClick={() => setIsHelpOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-rose-600/20 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('app.getHelpNow')}</span>
            </button>

            {/* Authenticated user items */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2 relative">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    aria-label="Notifications"
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                          {t('nav.notifications')}
                        </span>
                        <Link
                          to="/notifications"
                          onClick={() => setIsNotifOpen(false)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          View all
                        </Link>
                      </div>

                      <div className="mt-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                        {notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) {
                                navigate(n.link);
                                setIsNotifOpen(false);
                              }
                            }}
                            className={`py-2.5 px-2 rounded-xl text-left cursor-pointer transition ${
                              !n.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="font-medium text-xs text-slate-900 dark:text-slate-100">
                              {isBn ? n.titleBn : n.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {isBn ? n.bodyBn : n.body}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.createdAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar & Account Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="User Account Menu"
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[90px] truncate hidden sm:inline">
                      {currentUser.nickname}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold border ${userAvatarObj.color}`}
                    >
                      {userAvatarObj.emoji}
                    </div>
                  </button>

                  {/* Account Menu Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {currentUser.nickname}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              currentUser.plan === 'premium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {currentUser.plan === 'premium' ? t('common.premiumPlan') : t('common.freePlan')}
                          </span>
                          <span className="text-[10px] text-slate-400">&bull; {currentUser.streakDays} {t('common.streak')}</span>
                        </div>
                      </div>

                      <Link
                        to="/my-day"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>{t('nav.myDay')}</span>
                      </Link>

                      <Link
                        to="/me"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>{t('nav.profile')}</span>
                      </Link>

                      <Link
                        to="/subscription"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>{isBn ? 'সদস্যপদ' : 'Membership'}</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left mt-1 border-t border-slate-100 dark:border-slate-800 pt-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Guest CTA buttons styled with reference blue */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition hidden sm:inline-block"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm shadow-blue-700/20 transition-all transform hover:-translate-y-0.5"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger (for public links) */}
            {!isAuthenticated && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu for public pages */}
        {!isAuthenticated && isMobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <Link
              to="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.howItWorks')}
            </Link>
            <Link
              to="/doctors"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.doctors')}
            </Link>
            <Link
              to="/library"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.library')}
            </Link>
            <Link
              to="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.pricing')}
            </Link>
            <Link
              to="/faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t('nav.faq')}
            </Link>

            {/* Mobile Theme Toggle inside drawer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {isBn ? 'থিম পরিবর্তন' : 'Appearance'}
              </span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>

            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              {t('nav.login')}
            </Link>
          </div>
        )}
      </header>

      {/* Emergency Helpline Modal */}
      <GetHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};
