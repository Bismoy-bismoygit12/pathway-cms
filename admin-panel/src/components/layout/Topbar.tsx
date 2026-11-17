import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Shield, ChevronDown, ExternalLink, Bell } from 'lucide-react';
import { useAdminAuth, ROLE_DEFINITIONS } from '@/context/AdminAuthContext';
import { AdminRole } from '@/types/admin';
import { Badge } from '@/components/ui/Badge';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard Overview',
  '/users': 'User Management',
  '/doctors': 'Doctor Management',
  '/appointments': 'Appointment Management',
  '/analytics': 'Platform Analytics',
  '/activity-logs': 'Activity & Audit Logs',
  '/settings': 'Admin Settings & Permissions',
  '/website/homepage': 'Website CMS — Homepage Editor',
  '/website/navigation': 'Website CMS — Navigation Menu',
  '/website/about': 'Website CMS — About Us Page',
  '/website/contact': 'Website CMS — Contact Page',
  '/website/faqs': 'Website CMS — FAQ Manager',
  '/website/articles': 'Website CMS — Blog & Articles',
  '/website/media': 'Website CMS — Media Library',
  '/website/footer': 'Website CMS — Footer Editor',
  '/website/seo': 'Website CMS — SEO & Metadata',
};

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileMenu }) => {
  const { currentAdmin, logout, switchRole } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const pageTitle =
    ROUTE_TITLES[location.pathname] ||
    (location.pathname.startsWith('/users/')
      ? 'User Profile & Recovery Details'
      : location.pathname.startsWith('/doctors/')
      ? 'Doctor Credential Profile'
      : 'Pathway Admin CMS');

  const publicSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-slate-900 truncate">{pageTitle}</h1>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate">
            Pathway Healthcare Administration & Public Website Control
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Role Switcher for QA / Demo Testing */}
        {currentAdmin && (
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Test Role:</span>
            <select
              aria-label="Switch admin role"
              value={currentAdmin.role}
              onChange={(e) => switchRole(e.target.value as AdminRole)}
              className="h-8 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
            >
              {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((roleKey) => (
                <option key={roleKey} value={roleKey}>
                  {ROLE_DEFINITIONS[roleKey].label}
                </option>
              ))}
            </select>
          </div>
        )}

        <a
          href={publicSiteUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          <span>Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        <button
          onClick={() => navigate('/activity-logs')}
          aria-label="Activity notifications"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1.5 right-1.5" />
        </button>

        {/* Admin Account Dropdown */}
        {currentAdmin && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
                {currentAdmin.fullName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight max-w-[120px] truncate">
                  {currentAdmin.fullName}
                </div>
                <div className="text-[10px] text-teal-700 font-medium leading-tight">
                  {ROLE_DEFINITIONS[currentAdmin.role].label}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <div className="text-xs font-semibold text-slate-900">{currentAdmin.fullName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentAdmin.email}</div>
                  <Badge variant="teal" className="mt-1.5">
                    <Shield className="w-3 h-3" />
                    {ROLE_DEFINITIONS[currentAdmin.role].label}
                  </Badge>
                </div>

                {/* Mobile Role Switcher */}
                <div className="md:hidden px-3 py-2 border-b border-slate-100 mb-1">
                  <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                    Switch Role
                  </label>
                  <select
                    value={currentAdmin.role}
                    onChange={(e) => {
                      switchRole(e.target.value as AdminRole);
                      setMenuOpen(false);
                    }}
                    className="w-full h-8 px-2 rounded-lg border border-slate-200 text-xs"
                  >
                    {(Object.keys(ROLE_DEFINITIONS) as AdminRole[]).map((r) => (
                      <option key={r} value={r}>
                        {ROLE_DEFINITIONS[r].label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Admin Settings & Permissions
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
