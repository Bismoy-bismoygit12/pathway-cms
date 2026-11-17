export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'doctor_manager';

export type PermissionKey =
  | 'dashboard:view'
  | 'users:view'
  | 'users:manage'
  | 'users:view_recovery'
  | 'doctors:view'
  | 'doctors:approve'
  | 'appointments:view'
  | 'appointments:manage'
  | 'analytics:view'
  | 'cms:view'
  | 'cms:edit'
  | 'cms:publish'
  | 'media:manage'
  | 'logs:view'
  | 'settings:manage';

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  department: string;
  lastLoginAt: string;
  twoFactorEnabled: boolean;
}

export interface RoleDefinition {
  role: AdminRole;
  label: string;
  description: string;
  permissions: PermissionKey[];
}

export type ManagedUserStatus = 'active' | 'paused' | 'locked' | 'pending_deletion' | 'inactive';

export interface UserRecoveryGoal {
  id: string;
  title: string;
  category: string;
  points: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserProgressSnapshot {
  date: string;
  mood: 'peaceful' | 'good' | 'neutral' | 'struggling' | 'heavy';
  cravingLevel: number; // 0-10
  goalsCompleted: number;
  notes?: string;
}

export interface ManagedUser {
  id: string;
  numericId: number;
  fullName: string;
  nickname: string;
  email: string;
  phone?: string;
  city?: string;
  plan: 'free' | 'premium';
  status: ManagedUserStatus;
  isActive: boolean;
  registeredAt: string;
  lastLoginAt: string;
  streakDays: number;
  points: number;
  shareRecoveryWithAdmin: boolean;
  activeGoals: UserRecoveryGoal[];
  recentActivities: { id: string; title: string; timestamp: string; type: 'goal' | 'visit' | 'report' | 'checkin' }[];
  progressHistory: UserProgressSnapshot[];
}

export type DoctorApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ManagedDoctor {
  id: string;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  photo: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  consultationFeeBDT: number;
  hospital: string;
  city: string;
  bio: string;
  specialties: string[];
  consultationModes: ('online' | 'in_person')[];
  approvalStatus: DoctorApprovalStatus;
  appliedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  availabilitySlots: { day: string; time: string; mode: 'online' | 'in_person'; booked: boolean }[];
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export interface ManagedAppointment {
  id: string;
  numericId: number;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  scheduledDate: string;
  scheduledTime: string;
  mode: 'online' | 'in_person';
  status: AppointmentStatus;
  feeBDT: number;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'cash' | 'other';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  consentToShareData: boolean;
  concerns?: string;
  createdAt: string;
}

export type ActivityCategory =
  | 'user_registration'
  | 'doctor_registration'
  | 'doctor_review'
  | 'appointment'
  | 'account_change'
  | 'website_content'
  | 'admin_action';

export interface ActivityLogItem {
  id: string;
  category: ActivityCategory;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
  source: 'mock' | 'live';
}

export interface DashboardStatCard {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  growthPercent: number;
  trend: 'up' | 'down' | 'neutral';
  linkTo: string;
  periodLabel: string;
}

export type GrowthTimeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface GrowthDataPoint {
  label: string;
  current: number;
  previous: number;
  activeUsers?: number;
  appointments?: number;
}

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  emergencyPhone: string;
  maintenanceMode: boolean;
  allowNewPatientRegistrations: boolean;
  allowDoctorApplications: boolean;
  requireEmailVerification: boolean;
  notifyOnDoctorApplication: boolean;
  notifyOnContentPublish: boolean;
  notifyOnFlaggedReport: boolean;
  defaultLanguage: 'en' | 'bn';
}
