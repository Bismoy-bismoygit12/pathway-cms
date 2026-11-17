import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserStatus } from '../types';
import {
  getCurrentUserId,
  setCurrentUserId,
  getAllUsersData,
  saveAllUsersData,
  isPublicComputerSession,
  setPublicComputerSession,
  loginUser,
  registerUser,
  resetUserPassword
} from '../services/auth';
import { setAuthToken } from '../services/api';
import { updateUser } from '../services/user';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  isAuthenticated: boolean;
  isPublicComputer: boolean;
  login: (identifier: string, password?: string, isOtp?: boolean, isPublic?: boolean) => Promise<{ success: boolean; error?: string; isLocked?: boolean; lockMinutes?: number }>;
  logout: () => void;
  register: (params: Parameters<typeof registerUser>[0]) => Promise<{ success: boolean; error?: string; user?: User }>;
  refreshUser: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  updateUser: (updates: Partial<User>) => void;
  switchDemoUser: (persona: 'guest' | 'free' | 'premium' | 'paused' | 'locked' | 'pending_deletion') => void;
  sessionTimeoutWarning: boolean;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const id = getCurrentUserId();
    if (!id) return null;
    const all = getAllUsersData();
    return all[id]?.user || null;
  });

  const [isPublic, setIsPublic] = useState<boolean>(isPublicComputerSession());
  const [sessionTimeoutWarning, setSessionTimeoutWarning] = useState<boolean>(false);
  const timeoutTimerRef = useRef<any>(null);
  const warningTimerRef = useRef<any>(null);

  const refreshUser = useCallback(() => {
    const id = getCurrentUserId();
    if (!id) {
      setCurrentUserState(null);
      return;
    }
    const all = getAllUsersData();
    if (all[id]) {
      setCurrentUserState(all[id].user);
    } else {
      setCurrentUserState(null);
    }
  }, []);

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUserState(updated);
    }
  }, [currentUser]);

  const logout = useCallback(() => {
    setCurrentUserId(null);
    setAuthToken(null);
    setPublicComputerSession(false);
    setIsPublic(false);
    setCurrentUserState(null);
    setSessionTimeoutWarning(false);
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    // Automatically redirect back to the all-user home interface
    navigate('/', { replace: true });
  }, [navigate]);

  const resetActivityTimers = useCallback(() => {
    if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    if (!currentUser) return;

    // Public computer: 2 minute inactivity timeout with 30s warning
    // Regular computer: 15 minute inactivity timeout with 60s warning
    const warningMs = isPublic ? 90 * 1000 : 14 * 60 * 1000;
    const logoutMs = isPublic ? 120 * 1000 : 15 * 60 * 1000;

    warningTimerRef.current = setTimeout(() => {
      setSessionTimeoutWarning(true);
    }, warningMs);

    timeoutTimerRef.current = setTimeout(() => {
      logout();
    }, logoutMs);
  }, [currentUser, isPublic, logout]);

  const extendSession = () => {
    setSessionTimeoutWarning(false);
    resetActivityTimers();
  };

  useEffect(() => {
    const onActivity = () => {
      if (!sessionTimeoutWarning) {
        resetActivityTimers();
      }
    };

    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('click', onActivity);

    resetActivityTimers();

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('click', onActivity);
      if (timeoutTimerRef.current) clearTimeout(timeoutTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [resetActivityTimers, sessionTimeoutWarning]);

  const login = async (
    identifier: string,
    password?: string,
    isOtp: boolean = false,
    isPublicComp: boolean = false
  ) => {
    const res = await loginUser(identifier, password, isOtp);
    if (res.success && res.user) {
      setCurrentUserId(res.user.id);
      setCurrentUserState(res.user);
      setIsPublic(isPublicComp);
      setPublicComputerSession(isPublicComp);
      return { success: true };
    }
    return {
      success: false,
      error: res.error,
      isLocked: res.isLocked,
      lockMinutes: res.lockMinutesRemaining
    };
  };

  const register = async (params: Parameters<typeof registerUser>[0]) => {
    const res = await registerUser(params);
    if (res.success && res.user) {
      setCurrentUserId(res.user.id);
      setCurrentUserState(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, error: res.error };
  };

  const switchDemoUser = (persona: 'guest' | 'free' | 'premium' | 'paused' | 'locked' | 'pending_deletion') => {
    if (persona === 'guest') {
      logout();
      return;
    }

    const all = getAllUsersData();
    let targetUser: User | null = null;

    if (persona === 'free') {
      targetUser = all['user-shanto']?.user || null;
      if (targetUser) {
        targetUser.status = 'active';
        targetUser.plan = 'free';
      }
    } else if (persona === 'premium') {
      targetUser = all['user-nabila']?.user || null;
      if (targetUser) {
        targetUser.status = 'active';
        targetUser.plan = 'premium';
      }
    } else if (persona === 'paused') {
      targetUser = all['user-shanto']?.user || null;
      if (targetUser) {
        targetUser.status = 'paused';
      }
    } else if (persona === 'locked') {
      targetUser = all['user-shanto']?.user || null;
      if (targetUser) {
        targetUser.status = 'locked';
        targetUser.lockedUntil = new Date(Date.now() + 5 * 60000).toISOString();
      }
    } else if (persona === 'pending_deletion') {
      targetUser = all['user-shanto']?.user || null;
      if (targetUser) {
        targetUser.status = 'pending_deletion';
        targetUser.deletionRequestedAt = new Date(Date.now() + 7 * 86400000).toISOString();
      }
    }

    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setCurrentUserState({ ...targetUser });
      saveAllUsersData(all);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        isAuthenticated: !!currentUser,
        isPublicComputer: isPublic,
        login,
        logout,
        register,
        refreshUser,
        updateCurrentUser,
        updateUser: updateCurrentUser,
        switchDemoUser,
        sessionTimeoutWarning,
        extendSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
