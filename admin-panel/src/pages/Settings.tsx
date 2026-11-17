import React, { useEffect, useState } from 'react';
import { Shield, UserCog, Bell, Globe, Save, Check } from 'lucide-react';
import { useAdminAuth, ROLE_DEFINITIONS } from '@/context/AdminAuthContext';
import { settingsService } from '@/services/settingsService';
import { AdminRole, PermissionKey, PlatformSettings } from '@/types/admin';
import { useToast } from '@/components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

const ALL_PERMISSIONS: { key: PermissionKey; label: string; group: string }[] = [
  { key: 'dashboard:view', label: 'View Dashboard', group: 'Platform' },
  { key: 'users:view', label: 'View Users', group: 'Users' },
  { key: 'users:manage', label: 'Manage User Status', group: 'Users' },
  { key: 'users:view_recovery', label: 'View Sensitive Recovery Records', group: 'Users' },
  { key: 'doctors:view', label: 'View Doctors', group: 'Doctors' },
  { key: 'doctors:approve', label: 'Approve / Reject Doctors', group: 'Doctors' },
  { key: 'appointments:view', label: 'View Appointments', group: 'Appointments' },
  { key: 'appointments:manage', label: 'Manage Appointments', group: 'Appointments' },
  { key: 'analytics:view', label: 'View Platform Analytics', group: 'Analytics' },
  { key: 'cms:view', label: 'View Website CMS', group: 'Website CMS' },
  { key: 'cms:edit', label: 'Edit Draft Content', group: 'Website CMS' },
  { key: 'cms:publish', label: 'Publish Website Changes', group: 'Website CMS' },
  { key: 'media:manage', label: 'Manage Media Library', group: 'Website CMS' },
  { key: 'logs:view', label: 'View Activity & Audit Logs', group: 'System' },
  { key: 'settings:manage', label: 'Manage Settings & RBAC', group: 'System' },
];

export const Settings: React.FC = () => {
  const { currentAdmin, updateAdminProfile, roleDefinitions, updateRolePermissions } = useAdminAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<PlatformSettings | null>(null);

  // Profile form state
  const [fullName, setFullName] = useState(currentAdmin?.fullName || '');
  const [department, setDepartment] = useState(currentAdmin?.department || '');
  const [twoFactor, setTwoFactor] = useState(currentAdmin?.twoFactorEnabled ?? true);

  useEffect(() => {
    settingsService.getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (currentAdmin) {
      setFullName(currentAdmin.fullName);
      setDepartment(currentAdmin.department);
      setTwoFactor(currentAdmin.twoFactorEnabled);
    }
  }, [currentAdmin]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({ fullName, department, twoFactorEnabled: twoFactor });
    showToast('Admin profile preferences updated.');
  };

  const handleTogglePermission = (role: AdminRole, perm: PermissionKey) => {
    if (role === 'super_admin' && perm === 'settings:manage') {
      showToast('Super Admin must retain Settings & RBAC management permission.', 'error');
      return;
    }
    const existing = roleDefinitions[role].permissions;
    const next = existing.includes(perm)
      ? existing.filter((p) => p !== perm)
      : [...existing, perm];
    updateRolePermissions(role, next);
    showToast(`Updated ${ROLE_DEFINITIONS[role].label} permissions.`);
  };

  const handleSaveSiteSettings = async () => {
    if (!settings) return;
    await settingsService.updateSettings(
      settings,
      currentAdmin?.fullName || 'Admin',
      currentAdmin?.role || 'super_admin'
    );
    showToast('Platform operational settings saved.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Admin Settings & Permissions</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your admin profile, RBAC permission matrix, alert preferences, and global operational controls.
        </p>
      </div>

      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'profile', label: 'Admin Profile' },
          { id: 'rbac', label: 'Role Permissions (RBAC)' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'platform', label: 'Platform Controls' },
        ]}
      />

      {activeTab === 'profile' && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-4 h-4 text-blue-700" />
              <span>Administrator Account</span>
            </CardTitle>
            {currentAdmin && <Badge variant="teal">{ROLE_DEFINITIONS[currentAdmin.role].label}</Badge>}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                <Input value={currentAdmin?.email || ''} disabled className="bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
              </div>
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Two-Factor Authentication (2FA)</div>
                  <div className="text-[11px] text-slate-500">Require OTP verification for sensitive actions</div>
                </div>
                <Switch checked={twoFactor} onChange={setTwoFactor} label="Toggle two factor authentication" />
              </div>
              <Button type="submit">
                <Save className="w-4 h-4" />
                <span>Save Admin Profile</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {activeTab === 'rbac' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Role-Based Access Control Matrix</span>
            </CardTitle>
            <span className="text-[11px] text-slate-500">Changes apply immediately across sidebar & routes</span>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-3 px-4 font-semibold text-slate-700">Permission</th>
                  {(Object.keys(roleDefinitions) as AdminRole[]).map((roleKey) => (
                    <th key={roleKey} className="py-3 px-4 text-center font-semibold text-slate-900 whitespace-nowrap">
                      {roleDefinitions[roleKey].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALL_PERMISSIONS.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{perm.label}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {perm.group} • {perm.key}
                      </div>
                    </td>
                    {(Object.keys(roleDefinitions) as AdminRole[]).map((roleKey) => {
                      const enabled = roleDefinitions[roleKey].permissions.includes(perm.key);
                      return (
                        <td key={roleKey} className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(roleKey, perm.key)}
                            aria-label={`${perm.label} for ${roleDefinitions[roleKey].label}`}
                            className={`w-6 h-6 rounded-md inline-flex items-center justify-center border transition cursor-pointer ${
                              enabled
                                ? 'bg-teal-600 border-teal-600 text-white'
                                : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'notifications' && settings && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-700" />
              <span>Admin Alert Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-900">New Doctor Applications</div>
                <div className="text-[11px] text-slate-500">Alert credentialing managers when a psychiatrist registers</div>
              </div>
              <Switch
                checked={settings.notifyOnDoctorApplication}
                onChange={(val) => setSettings({ ...settings, notifyOnDoctorApplication: val })}
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-900">Website Content Publishing</div>
                <div className="text-[11px] text-slate-500">Notify administrators when CMS sections are published live</div>
              </div>
              <Switch
                checked={settings.notifyOnContentPublish}
                onChange={(val) => setSettings({ ...settings, notifyOnContentPublish: val })}
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-semibold text-slate-900">Sensitive Access & Security Events</div>
                <div className="text-[11px] text-slate-500">Send digest when consented recovery records are audited</div>
              </div>
              <Switch
                checked={settings.notifyOnFlaggedReport}
                onChange={(val) => setSettings({ ...settings, notifyOnFlaggedReport: val })}
              />
            </div>

            <Button onClick={handleSaveSiteSettings}>
              <Save className="w-4 h-4" />
              <span>Save Notification Preferences</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'platform' && settings && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-700" />
              <span>Platform Operational Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Platform Name</label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Default Public Language</label>
                <Select
                  value={settings.defaultLanguage}
                  onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value as 'en' | 'bn' })}
                  className="w-full"
                >
                  <option value="en">English (EN)</option>
                  <option value="bn">Bangla (বাংলা)</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Support Email</label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Emergency Helpline</label>
                <Input
                  value={settings.emergencyPhone}
                  onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Allow New User Registrations</div>
                  <div className="text-[11px] text-slate-500">Enable public signup on Pathway website</div>
                </div>
                <Switch
                  checked={settings.allowNewPatientRegistrations}
                  onChange={(val) => setSettings({ ...settings, allowNewPatientRegistrations: val })}
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-semibold text-slate-900">Allow Doctor Applications</div>
                  <div className="text-[11px] text-slate-500">Accept new psychiatrist onboarding submissions</div>
                </div>
                <Switch
                  checked={settings.allowDoctorApplications}
                  onChange={(val) => setSettings({ ...settings, allowDoctorApplications: val })}
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
                <div>
                  <div className="text-xs font-semibold text-amber-950">Maintenance Mode</div>
                  <div className="text-[11px] text-amber-800">Temporarily show scheduled maintenance notice to public visitors</div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(val) => setSettings({ ...settings, maintenanceMode: val })}
                />
              </div>
            </div>

            <Button onClick={handleSaveSiteSettings}>
              <Save className="w-4 h-4" />
              <span>Save Platform Settings</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
