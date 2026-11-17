import React from 'react';
import { Badge } from '@/components/ui/Badge';
import {
  ActivityCategory,
  AppointmentStatus,
  DoctorApprovalStatus,
  ManagedUserStatus,
} from '@/types/admin';

export const UserStatusBadge: React.FC<{ status: ManagedUserStatus }> = ({ status }) => {
  const map: Record<ManagedUserStatus, { label: string; variant: 'emerald' | 'amber' | 'rose' | 'slate' }> = {
    active: { label: 'Active', variant: 'emerald' },
    paused: { label: 'Paused', variant: 'amber' },
    locked: { label: 'Locked', variant: 'rose' },
    pending_deletion: { label: 'Pending Deletion', variant: 'rose' },
    inactive: { label: 'Inactive', variant: 'slate' },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const DoctorStatusBadge: React.FC<{ status: DoctorApprovalStatus }> = ({ status }) => {
  const map: Record<DoctorApprovalStatus, { label: string; variant: 'amber' | 'emerald' | 'rose' }> = {
    pending: { label: 'Pending Approval', variant: 'amber' },
    approved: { label: 'Approved', variant: 'emerald' },
    rejected: { label: 'Rejected', variant: 'rose' },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const AppointmentStatusBadge: React.FC<{ status: AppointmentStatus }> = ({ status }) => {
  const map: Record<AppointmentStatus, { label: string; variant: 'amber' | 'blue' | 'emerald' | 'rose' }> = {
    pending: { label: 'Pending', variant: 'amber' },
    confirmed: { label: 'Confirmed', variant: 'blue' },
    completed: { label: 'Completed', variant: 'emerald' },
    cancelled: { label: 'Cancelled', variant: 'rose' },
    rejected: { label: 'Rejected', variant: 'rose' },
  };
  const cfg = map[status];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};

export const ActivityCategoryBadge: React.FC<{ category: ActivityCategory }> = ({ category }) => {
  const map: Record<ActivityCategory, { label: string; variant: 'blue' | 'teal' | 'amber' | 'rose' | 'emerald' | 'slate' }> = {
    user_registration: { label: 'User Signup', variant: 'blue' },
    doctor_registration: { label: 'Doctor Signup', variant: 'teal' },
    doctor_review: { label: 'Doctor Review', variant: 'emerald' },
    appointment: { label: 'Appointment', variant: 'blue' },
    account_change: { label: 'Account Change', variant: 'amber' },
    website_content: { label: 'Website CMS', variant: 'teal' },
    admin_action: { label: 'Admin Action', variant: 'slate' },
  };
  const cfg = map[category];
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
};
