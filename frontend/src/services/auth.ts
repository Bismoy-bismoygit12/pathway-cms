import { User, UserStatus } from '../types';
import { api, setAuthToken, getAuthToken } from './api';

const USERS_STORAGE_KEY = 'pathway_users_db';
const CURRENT_USER_ID_KEY = 'pathway_current_user_id';
const PUBLIC_COMPUTER_KEY = 'pathway_is_public_computer';

// Mock password hash fallback
export function mockHashPassword(password: string): string {
  try {
    return btoa(`salt_pathway_${password}_2026`);
  } catch {
    return `hash_${password}`;
  }
}

// Initial seed accounts if none exist
function getSeedUsers(): Record<string, { user: User; passwordHash: string }> {
  const defaultUser: User = {
    id: 'user-shanto',
    nickname: 'Shanto',
    name: 'Shanto Chowdhury',
    email: 'shanto@example.com',
    phone: '01711223344',
    emailVerified: true,
    phoneVerified: true,
    dob: '1994-05-14',
    age: 32,
    gender: 'male',
    city: 'Dhaka',
    language: 'en',
    timezone: 'Asia/Dhaka (GMT+6)',
    avatar: 'avatar-sprout',
    status: 'active',
    plan: 'free',
    planRenewalDate: '2026-12-01',
    consents: {
      terms: true,
      aiHelp: true,
      chatbotMemory: true,
      shareWithDoctors: true
    },
    preferences: {
      helpWith: ['Substance & Alcohol Recovery', 'Sleep restoration', 'Stress management'],
      goals: ['Deep breathing', 'Evening walks', 'Hydration reminder'],
      triggers: ['Evening fatigue', 'Work pressure', 'Old peer groups'],
      favouriteActivities: ['Guided breathing', 'Calming stories', 'Relaxing sounds'],
      preferredTimeOfDay: 'evening'
    },
    healthBasics: {
      allergies: 'Penicillin',
      currentMedicines: 'Vitamin B-complex, Melatonin 3mg (when needed)',
      pastCareNotes: 'Outpatient consultation in 2024. Doing well.'
    },
    trustedContacts: [
      {
        id: 'tc-1',
        name: 'Tanvir Bhai',
        relationship: 'Elder Brother',
        phone: '01819998877',
        canNotifyOnRelapse: true
      }
    ],
    doctorAccessList: [
      {
        doctorId: '1',
        doctorName: 'Prof. Dr. Tanvir Ahmed',
        canViewProfile: true,
        canViewGoals: true,
        canViewMoods: true,
        canViewHealthBasics: false,
        canViewReports: true
      }
    ],
    accessLogs: [
      {
        id: 'log-1',
        doctorName: 'Prof. Dr. Tanvir Ahmed',
        date: 'Yesterday, 10:30 AM',
        itemsViewed: ['Basic profile', '7-day goal streak']
      }
    ],
    sessions: [
      {
        id: 'sess-1',
        device: 'Laptop (Windows, Chrome)',
        browser: 'Chrome 128',
        city: 'Dhaka, Bangladesh',
        lastActive: 'Active now',
        isCurrent: true
      }
    ],
    streakDays: 8,
    points: 340,
    quickLockPin: '',
    createdAt: '2026-10-15',
    failedLoginAttempts: 0
  };

  const premiumUser: User = {
    ...defaultUser,
    id: 'user-nabila',
    nickname: 'Nabila',
    name: 'Nabila Rahman',
    email: 'nabila@example.com',
    phone: '01812345678',
    avatar: 'avatar-sun',
    plan: 'premium',
    streakDays: 21,
    points: 820,
    createdAt: '2026-08-10'
  };

  return {
    'user-shanto': {
      user: defaultUser,
      passwordHash: mockHashPassword('Password123')
    },
    'user-nabila': {
      user: premiumUser,
      passwordHash: mockHashPassword('Password123')
    }
  };
}

export function getAllUsersData(): Record<string, { user: User; passwordHash: string }> {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    const seeds = getSeedUsers();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(seeds));
    return seeds;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return getSeedUsers();
  }
}

export function saveAllUsersData(data: Record<string, { user: User; passwordHash: string }>) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));
}

export function getCurrentUserId(): string | null {
  return localStorage.getItem(CURRENT_USER_ID_KEY);
}

export function setCurrentUserId(userId: string | null) {
  if (userId) {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  }
}

export function isPublicComputerSession(): boolean {
  return localStorage.getItem(PUBLIC_COMPUTER_KEY) === 'true';
}

export function setPublicComputerSession(isPublic: boolean) {
  if (isPublic) {
    localStorage.setItem(PUBLIC_COMPUTER_KEY, 'true');
  } else {
    localStorage.removeItem(PUBLIC_COMPUTER_KEY);
  }
}

// Convert Backend User record to Frontend User type
function mapBackendUserToFrontend(backendUser: any, fallbackNickname?: string): User {
  return {
    id: `user-${backendUser.id}`,
    nickname: fallbackNickname || backendUser.full_name?.split(' ')[0] || 'Friend',
    name: backendUser.full_name,
    email: backendUser.email,
    phone: backendUser.phone,
    emailVerified: true,
    phoneVerified: Boolean(backendUser.phone),
    language: 'en',
    timezone: 'Asia/Dhaka (GMT+6)',
    avatar: 'avatar-sprout',
    status: backendUser.is_active ? 'active' : 'paused',
    plan: 'free',
    consents: {
      terms: true,
      aiHelp: true,
      chatbotMemory: true,
      shareWithDoctors: true
    },
    preferences: {
      helpWith: ['Substance & Alcohol Recovery'],
      goals: ['Daily peaceful moment'],
      triggers: ['Evening fatigue'],
      favouriteActivities: ['Guided breathing'],
      preferredTimeOfDay: 'evening'
    },
    healthBasics: {
      allergies: '',
      currentMedicines: '',
      pastCareNotes: ''
    },
    trustedContacts: [],
    doctorAccessList: [],
    accessLogs: [],
    sessions: [
      {
        id: `sess-${Date.now()}`,
        device: 'Current Device',
        browser: 'Browser',
        city: 'Dhaka, Bangladesh',
        lastActive: 'Active now',
        isCurrent: true
      }
    ],
    streakDays: 1,
    points: 50,
    createdAt: backendUser.created_at ? new Date(backendUser.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

// Register new user (Calls Express backend, falls back to local storage)
export async function registerUser(params: {
  identifier: string;
  password: string;
  nickname?: string;
  language?: 'en' | 'bn';
  consents?: Partial<User['consents']>;
  preferences?: Partial<User['preferences']>;
}): Promise<{ success: boolean; error?: string; user?: User }> {
  const isEmail = params.identifier.includes('@');
  const normalizedId = params.identifier.trim().toLowerCase();

  // Attempt backend registration
  try {
    const res = await api.post('/auth/register/patient', {
      full_name: params.nickname?.trim() || (isEmail ? normalizedId.split('@')[0] : 'Patient Friend'),
      email: isEmail ? normalizedId : `${normalizedId}@pathway.local`,
      phone: !isEmail ? normalizedId : undefined,
      password: params.password
    });

    if (res.success && res.data?.user) {
      if (res.data.token) {
        setAuthToken(res.data.token);
      }
      const mapped = mapBackendUserToFrontend(res.data.user, params.nickname);
      const allUsers = getAllUsersData();
      allUsers[mapped.id] = { user: mapped, passwordHash: mockHashPassword(params.password) };
      saveAllUsersData(allUsers);
      return { success: true, user: mapped };
    } else if (res.status === 409) {
      return { success: false, error: res.error || 'An account with this email or phone already exists.' };
    }
  } catch (e) {
    console.warn('Backend API registration unreachable, falling back to local storage.', e);
  }

  // Local storage fallback
  const allUsers = getAllUsersData();
  const duplicate = Object.values(allUsers).find(({ user }) => {
    if (isEmail && user.email?.toLowerCase() === normalizedId) return true;
    if (!isEmail && user.phone?.replace(/[^0-9]/g, '') === normalizedId.replace(/[^0-9]/g, '')) return true;
    return false;
  });

  if (duplicate) {
    return {
      success: false,
      error: 'An account with this email or phone already exists. Please log in.'
    };
  }

  const newId = `user-${Date.now()}`;
  const newUser: User = {
    id: newId,
    nickname: params.nickname?.trim() || 'Friend',
    email: isEmail ? normalizedId : undefined,
    phone: !isEmail ? normalizedId : undefined,
    emailVerified: false,
    phoneVerified: false,
    language: params.language || 'en',
    timezone: 'Asia/Dhaka (GMT+6)',
    avatar: 'avatar-sprout',
    status: 'active',
    plan: 'free',
    consents: {
      terms: true,
      aiHelp: !!params.consents?.aiHelp,
      chatbotMemory: !!params.consents?.chatbotMemory,
      shareWithDoctors: !!params.consents?.shareWithDoctors
    },
    preferences: {
      helpWith: params.preferences?.helpWith || ['Substance & Alcohol Recovery'],
      goals: params.preferences?.goals || ['Daily peaceful moment'],
      triggers: params.preferences?.triggers || ['Fatigue'],
      favouriteActivities: params.preferences?.favouriteActivities || ['Breathing'],
      preferredTimeOfDay: 'evening'
    },
    healthBasics: {
      allergies: '',
      currentMedicines: '',
      pastCareNotes: ''
    },
    trustedContacts: [],
    doctorAccessList: [],
    accessLogs: [],
    sessions: [
      {
        id: `sess-${Date.now()}`,
        device: 'Current Device',
        browser: 'Browser',
        city: 'Bangladesh',
        lastActive: 'Active now',
        isCurrent: true
      }
    ],
    streakDays: 1,
    points: 50,
    createdAt: new Date().toISOString().split('T')[0],
    failedLoginAttempts: 0
  };

  allUsers[newId] = {
    user: newUser,
    passwordHash: mockHashPassword(params.password)
  };

  saveAllUsersData(allUsers);
  return { success: true, user: newUser };
}

// Login user (Calls Express backend, falls back to local storage)
export async function loginUser(
  identifier: string,
  password?: string,
  isOtpLogin: boolean = false
): Promise<{ success: boolean; error?: string; user?: User; isLocked?: boolean; lockMinutesRemaining?: number }> {
  const normalized = identifier.trim().toLowerCase();

  // If password provided, attempt real backend API login first
  if (password && !isOtpLogin) {
    try {
      const res = await api.post('/auth/login', {
        email: normalized,
        password
      });

      if (res.success && res.data?.token && res.data?.user) {
        setAuthToken(res.data.token);
        const mapped = mapBackendUserToFrontend(res.data.user);
        const allUsers = getAllUsersData();
        allUsers[mapped.id] = { user: mapped, passwordHash: mockHashPassword(password) };
        saveAllUsersData(allUsers);
        return { success: true, user: mapped };
      } else if (res.status === 401 || res.status === 403) {
        return { success: false, error: res.error || 'Invalid email or password.' };
      }
    } catch (e) {
      console.warn('Backend login unreachable, falling back to local storage cache.', e);
    }
  }

  // Local storage fallback & OTP Login
  const allUsers = getAllUsersData();
  const cleanPhone = identifier.replace(/[^0-9]/g, '');

  const entry = Object.values(allUsers).find(({ user }) => {
    if (user.email && user.email.toLowerCase() === normalized) return true;
    if (user.phone && user.phone.replace(/[^0-9]/g, '') === cleanPhone) return true;
    return false;
  });

  if (!entry) {
    return { success: false, error: 'No account found with this email or phone.' };
  }

  const { user, passwordHash } = entry;

  // Check account lock
  if (user.lockedUntil) {
    const lockExpiry = new Date(user.lockedUntil).getTime();
    const now = Date.now();
    if (now < lockExpiry) {
      const remainingMinutes = Math.ceil((lockExpiry - now) / 60000);
      return {
        success: false,
        isLocked: true,
        lockMinutesRemaining: remainingMinutes,
        error: `Account is temporarily paused. Please try again in ${remainingMinutes} minute(s).`
      };
    } else {
      user.lockedUntil = undefined;
      user.failedLoginAttempts = 0;
      saveAllUsersData(allUsers);
    }
  }

  // Password verification
  if (!isOtpLogin) {
    const expectedHash = mockHashPassword(password || '');
    if (expectedHash !== passwordHash) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      user.failedLoginAttempts = attempts;

      if (attempts >= 5) {
        const lockUntil = new Date(Date.now() + 5 * 60000).toISOString();
        user.lockedUntil = lockUntil;
        user.status = 'locked';
        saveAllUsersData(allUsers);
        return {
          success: false,
          isLocked: true,
          lockMinutesRemaining: 5,
          error: 'Too many wrong attempts. For your privacy and safety, access is paused for 5 minutes.'
        };
      }

      saveAllUsersData(allUsers);
      return {
        success: false,
        error: `Incorrect password. (${5 - attempts} attempts remaining before temporary pause)`
      };
    }
  }

  user.failedLoginAttempts = 0;
  user.lockedUntil = undefined;
  if (user.status === 'locked') {
    user.status = 'active';
  }
  saveAllUsersData(allUsers);

  return { success: true, user };
}

// Reset password
export function resetUserPassword(identifier: string, newPassword: string): boolean {
  const allUsers = getAllUsersData();
  const normalized = identifier.trim().toLowerCase();
  const cleanPhone = identifier.replace(/[^0-9]/g, '');

  const record = Object.entries(allUsers).find(([_, { user }]) => {
    if (user.email && user.email.toLowerCase() === normalized) return true;
    if (user.phone && user.phone.replace(/[^0-9]/g, '') === cleanPhone) return true;
    return false;
  });

  if (!record) return false;
  const [userId] = record;
  allUsers[userId].passwordHash = mockHashPassword(newPassword);
  allUsers[userId].user.failedLoginAttempts = 0;
  allUsers[userId].user.lockedUntil = undefined;
  if (allUsers[userId].user.status === 'locked') {
    allUsers[userId].user.status = 'active';
  }
  saveAllUsersData(allUsers);
  return true;
}
