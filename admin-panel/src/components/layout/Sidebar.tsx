import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarClock,
  BarChart3,
  Activity,
  Settings,
  Globe,
  LayoutTemplate,
  Navigation,
  Info,
  Phone,
  HelpCircle,
  FileText,
  Image,
  PanelBottom,
  SearchCode,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { PermissionKey } from '@/types/admin';

interface NavEntry {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission: PermissionKey;
  badge?: string;
}

const PLATFORM_NAV: NavEntry[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard:view' },
  { to: '/users', label: 'Users', icon: Users, permission: 'users:view' },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope, permission: 'doctors:view', badge: '2 Pending' },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock, permission: 'appointments:view' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, permission: 'analytics:view' },
  { to: '/activity-logs', label: 'Activity Logs', icon: Activity, permission: 'logs:view' },
];

const WEBSITE_CMS_NAV: NavEntry[] = [
  { to: '/website/homepage', label: 'Homepage', icon: LayoutTemplate, permission: 'cms:view' },
  { to: '/website/navigation', label: 'Navigation', icon: Navigation, permission: 'cms:view' },
  { to: '/website/about', label: 'About Us', icon: Info, permission: 'cms:view' },
  { to: '/website/contact', label: 'Contact Page', icon: Phone, permission: 'cms:view' },
  { to: '/website/faqs', label: 'FAQs', icon: HelpCircle, permission: 'cms:view' },
  { to: '/website/articles', label: 'Blog & Articles', icon: FileText, permission: 'cms:view' },
  { to: '/website/media', label: 'Media Library', icon: Image, permission: 'media:manage' },
  { to: '/website/footer', label: 'Footer', icon: PanelBottom, permission: 'cms:view' },
  { to: '/website/seo', label: 'SEO & Metadata', icon: SearchCode, permission: 'cms:view' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { hasPermission } = useAdminAuth();

  const renderGroup = (title: string, items: NavEntry[]) => {
    const visible = items.filter((item) => hasPermission(item.permission));
    if (visible.length === 0) return null;

    return (
      <div className="space-y-1">
        {!collapsed && (
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </div>
        )}
        {visible.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs sm:text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  collapsed && 'justify-center px-2'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-500')} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-full text-[10px] font-semibold',
                        isActive ? 'bg-blue-600 text-white' : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    );
  };

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand header */}
      <div className={cn('h-16 px-4 border-b border-slate-200 flex items-center justify-between shrink-0', collapsed && 'px-2 justify-center')}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-teal-600 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-bold text-sm text-slate-900 truncate">Pathway CMS</div>
              <div className="text-[10px] text-teal-700 font-semibold uppercase tracking-wide">Admin Console</div>
            </div>
          )}
        </div>

        {/* Mobile close */}
        <button
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Desktop collapse button */}
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden lg:inline-flex p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {renderGroup('Platform Management', PLATFORM_NAV)}
        {renderGroup('Website Management', WEBSITE_CMS_NAV)}
        {hasPermission('settings:manage') && (
          <div className="pt-2 border-t border-slate-100">
            {renderGroup('Administration', [
              { to: '/settings', label: 'Settings & Roles', icon: Settings, permission: 'settings:manage' },
            ])}
          </div>
        )}
      </nav>

      {/* Public website link */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-900">
            <Globe className="w-4 h-4 text-teal-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold truncate">Demo Mock Mode</div>
              <div className="text-[10px] text-teal-700 truncate">Ready for Pathway API</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn('hidden lg:block shrink-0 transition-all duration-200', collapsed ? 'w-16' : 'w-64')}>
        <div className="sticky top-0 h-screen">{content}</div>
      </aside>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/50" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[85vw] h-full z-10">{content}</div>
        </div>
      )}
    </>
  );
};
