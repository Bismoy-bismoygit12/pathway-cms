export type UserStatus = 'new' | 'active' | 'paused' | 'locked' | 'pending_deletion' | 'deleted';

export type UserPlan = 'free' | 'premium';

export interface UserConsents {
  terms: boolean;
  aiHelp: boolean;
  chatbotMemory: boolean;
  shareWithDoctors: boolean;
}

export interface UserPreferences {
  helpWith: string[];
  goals: string[];
  triggers: string[];
  favouriteActivities: string[];
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

export interface HealthBasics {
  allergies: string;
  currentMedicines: string;
  pastCareNotes: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  canNotifyOnRelapse: boolean;
}

export interface DoctorAccess {
  doctorId: string;
  doctorName: string;
  canViewProfile: boolean;
  canViewGoals: boolean;
  canViewMoods: boolean;
  canViewHealthBasics: boolean;
  canViewReports: boolean;
}

export interface AccessLog {
  id: string;
  doctorName: string;
  date: string;
  itemsViewed: string[];
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  city: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface User {
  id: string;
  nickname: string;
  name?: string;
  email?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  dob?: string;
  age?: number;
  gender?: 'female' | 'male' | 'other' | 'prefer_not_to_say';
  city?: string;
  language: 'en' | 'bn';
  timezone: string;
  avatar: string;
  customAvatarUrl?: string;
  status: UserStatus;
  plan: UserPlan;
  planRenewalDate?: string;
  consents: UserConsents;
  preferences: UserPreferences;
  healthBasics: HealthBasics;
  trustedContacts: TrustedContact[];
  doctorAccessList: DoctorAccess[];
  accessLogs: AccessLog[];
  sessions: Session[];
  streakDays: number;
  points: number;
  quickLockPin?: string;
  createdAt: string;
  deletionRequestedAt?: string;
  failedLoginAttempts?: number;
  lockedUntil?: string;
}

export type GoalCategory = 'breathing' | 'mindfulness' | 'walk' | 'journal' | 'reading' | 'hydration' | 'sleep' | 'doctor';

export interface Goal {
  id: string;
  title: string;
  titleBn: string;
  category: GoalCategory;
  durationMinutes: number;
  minDurationSeconds: number; // minimum time required before completion
  pointsReward: number;
  source: 'suggested' | 'choice' | 'doctor';
  doctorName?: string;
  completed: boolean;
  completedAt?: string;
  steps: { text: string; textBn: string }[];
  description: string;
  descriptionBn: string;
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  title: string;
  titleBn: string;
  qualifications: string;
  experienceYears: number;
  photo: string;
  gender: 'female' | 'male';
  languages: string[];
  languagesBn: string[];
  specialties: string[];
  specialtiesBn: string[];
  feeBDT: number;
  hospital: string;
  hospitalBn: string;
  clinicAddress: string;
  clinicAddressBn: string;
  city: string;
  cityBn: string;
  consultationModes: ('online' | 'in_person')[];
  nextFreeSlot: string;
  nextFreeSlotBn: string;
  about: string;
  aboutBn: string;
}

export interface DoctorSlot {
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // "04:30 PM"
  mode: 'online' | 'in_person';
  isBooked: boolean;
}

export type AppointmentStatus = 'requested' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'missed';

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  doctorNameBn: string;
  doctorTitle: string;
  doctorHospital: string;
  doctorPhoto: string;
  date: string;
  time: string;
  mode: 'online' | 'in_person';
  status: AppointmentStatus;
  feeBDT: number;
  paymentMethod: 'bkash' | 'nagad' | 'card' | 'pay_at_clinic';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  reason?: string;
  concernsList?: string[];
  sharedData: {
    profile: boolean;
    goals: boolean;
    moods: boolean;
    healthBasics: boolean;
    reports: boolean;
  };
  rating?: number;
  feedback?: string;
  doctorNote?: string;
  doctorSuggestedGoals?: Goal[];
  createdAt: string;
}

export interface ExtractedValue {
  label: string;
  labelBn: string;
  value: string;
  referenceRange: string;
  status: 'normal' | 'attention' | 'neutral';
  explanation: string;
  explanationBn: string;
}

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  extractedValues: ExtractedValue[];
  lifestyleTips: string[];
  lifestyleTipsBn: string[];
  doctorTypeToSee: string;
  doctorTypeToSeeBn: string;
  sharedWithDoctorIds: string[];
}

export interface Reward {
  id: string;
  type: 'badge' | 'perk' | 'voucher' | 'downloadable';
  name: string;
  nameBn: string;
  pointsCost: number;
  category: string;
  categoryBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  rarity: string;
}

export interface RedeemedReward {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardNameBn: string;
  redeemedAt: string;
  code?: string;
  pointsSpent: number;
}

export interface NotificationItem {
  id: string;
  category: 'goals' | 'visits' | 'subscription' | 'rewards' | 'motivation' | 'security';
  title: string;
  titleBn: string;
  body: string;
  bodyBn: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  browserAlerts: boolean;
  dailyGoalReminders: boolean;
  visitReminders: boolean;
  motivationalPings: boolean;
  rewardPings: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string;   // e.g. "08:00"
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  isReported?: boolean;
  hasCopingTools?: boolean;
}

export interface CheckInLog {
  id: string;
  date: string;
  mood: 'peaceful' | 'good' | 'neutral' | 'struggling' | 'heavy';
  cravingLevel: number; // 0 to 10
  triggers: string[];
  notes?: string;
}
