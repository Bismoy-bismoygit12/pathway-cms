import React, { createContext, useContext, useState } from 'react';
import { AdminAccount, AdminRole, PermissionKey, RoleDefinition } from '@/types/admin';

export const ROLE_DEFINITIONS: Record<AdminRole, RoleDefinition> = {
  super_admin: {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full unrestricted access across platform management, sensitive recovery audit, RBAC, and website publishing.',
    permissions: [
      'dashboard:view',
      'users:view',
      'users:manage',
      'users:view_recovery',
      'doctors:view',
      'doctors:approve',
      'appointments:view',
      'appointments:manage',
      'analytics:view',
      'cms:view',
      'cms:edit',
      'cms:publish',
      'media:manage',
      'logs:view',
      'settings:manage',
    ],
  },
  admin: {
    role: 'admin',
    label: 'Admin',
    description: 'Application operations: users, doctors, appointments, analytics, and activity monitoring.',
    permissions: [
      'dashboard:view',
      'users:view',
      'users:manage',
      'users:view_recovery',
      'doctors:view',
      'doctors:approve',
      'appointments:view',
      'appointments:manage',
      'analytics:view',
      'cms:view',
      'logs:view',
    ],
  },
  content_manager: {
    role: 'content_manager',
    label: 'Content Manager',
    description: 'Full access to Website CMS editors, media library, SEO, previews, and publishing.',
    permissions: [
      'dashboard:view',
      'cms:view',
      'cms:edit',
      'cms:publish',
      'media:manage',
      'logs:view',
    ],
  },
  doctor_manager: {
    role: 'doctor_manager',
    label: 'Doctor Manager',
    description: 'Manage psychiatrist onboarding applications, doctor profiles, availability, and appointments.',
    permissions: [
      'dashboard:view',
      'doctors:view',
      'doctors:approve',
      'appointments:view',
      'appointments:manage',
      'analytics:view',
    ],
  },
};

export const DEMO_ADMIN_ACCOUNTS: Record<AdminRole, AdminAccount> = {
  super_admin: {
    id: 'adm-1',
    fullName: 'Dr. Farhan Sadik',
    email: 'superadmin@pathway.health',
    role: 'super_admin',
    department: 'Platform Governance & Clinical Ops',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  admin: {
    id: 'adm-2',
    fullName: 'Tasnim Tabassum',
    email: 'admin@pathway.health',
    role: 'admin',
    department: 'Operations & Support',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
  },
  content_manager: {
    id: 'adm-3',
    fullName: 'Rafiqul Islam',
    email: 'content@pathway.health',
    role: 'content_manager',
    department: 'Editorial & Public Website',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: false,
  },
  doctor_manager: {
    id: 'adm-4',
    fullName: 'Nusrat Chowdhury',
    email: 'doctors@pathway.health',
    role: 'doctor_manager',
    department: 'Clinical Credentialing',
    lastLoginAt: new Date().toISOString(),
    twoFactorEnabled: true,
  },
};

interface AdminAuthContextType {
  currentAdmin: AdminAccount | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rolePreset?: AdminRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: AdminRole) => void;
  updateAdminProfile: (updates: Partial<AdminAccount>) => void;
  hasPermission: (permission: PermissionKey) => boolean;
  roleDefinitions: Record<AdminRole, RoleDefinition>;
  updateRolePermissions: (role: AdminRole, permissions: PermissionKey[]) => void;
}

const STORAGE_KEY = 'pathway_admin_session';
const ROLES_STORAGE_KEY = 'pathway_admin_role_defs';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roleDefinitions, setRoleDefinitions] = useState<Record<AdminRole, RoleDefinition>>(() => {
    try {
      const raw = localStorage.getItem(ROLES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : ROLE_DEFINITIONS;
    } catch {
      return ROLE_DEFINITIONS;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminAccount | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEMO_ADMIN_ACCOUNTS.super_admin;
    } catch {
      return DEMO_ADMIN_ACCOUNTS.super_admin;
    }
  });

  const login = async (email: string, password: string, rolePreset?: AdminRole) => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Email and password are required.' };
    }
    const matchedRole =
      rolePreset ||
      (Object.values(DEMO_ADMIN_ACCOUNTS).find((a) => a.email.toLowerCase() === email.trim().toLowerCase())?.role ??
        'super_admin');

    const account: AdminAccount = {
      ...DEMO_ADMIN_ACCOUNTS[matchedRole],
      email: email.trim().toLowerCase(),
      lastLoginAt: new Date().toISOString(),
    };
    setCurrentAdmin(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    return { success: true };
  };

  const logout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchRole = (role: AdminRole) => {
    const account = { ...DEMO_ADMIN_ACCOUNTS[role], lastLoginAt: new Date().toISOString() };
    setCurrentAdmin(account);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  };

  const updateAdminProfile = (updates: Partial<AdminAccount>) => {
    if (!currentAdmin) return;
    const updated = { ...currentAdmin, ...updates };
    setCurrentAdmin(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const updateRolePermissions = (role: AdminRole, permissions: PermissionKey[]) => {
    setRoleDefinitions((prev) => {
      const next = {
        ...prev,
        [role]: {
          ...prev[role],
          permissions,
        },
      };
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const hasPermission = (permission: PermissionKey): boolean => {
    if (!currentAdmin) return false;
    return roleDefinitions[currentAdmin.role]?.permissions.includes(permission) ?? false;
  };

  return (
    <AdminAuthContext.Provider
      value={{
        currentAdmin,
        isAuthenticated: Boolean(currentAdmin),
        login,
        logout,
        switchRole,
        updateAdminProfile,
        hasPermission,
        roleDefinitions,
        updateRolePermissions,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};
