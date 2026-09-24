import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole, AuthState, ROLE_PERMISSIONS } from '../types';

// ─── Stub user store (Firebase Auth will replace this) ───────────────────────
// These users will be used until Firebase Auth is connected.
const STUB_USERS: (UserProfile & { password: string })[] = [
  {
    uid: 'admin-001',
    email: 'admin@lifesync.app',
    password: 'admin123',
    displayName: 'LifeSync Admin',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    uid: 'user-001',
    email: 'prajwal@lifesync.app',
    password: 'user123',
    displayName: 'Prajwal Nair',
    role: 'user',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
  {
    uid: 'guest-001',
    email: 'guest@lifesync.app',
    password: 'guest123',
    displayName: 'Guest User',
    role: 'guest',
    createdAt: '2026-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    isActive: true,
  },
];

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  can: (action: 'write' | 'delete' | 'viewAdmin') => boolean;
  canAccessRoute: (path: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'lifesync_session';

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const user: UserProfile = JSON.parse(saved);
        setAuthState({ user, isLoading: false, isAuthenticated: true });
      } else {
        setAuthState(s => ({ ...s, isLoading: false }));
      }
    } catch {
      setAuthState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  // ── Login with email/password (stub — Firebase will replace) ──────────────
  const login = async (email: string, password: string): Promise<void> => {
    // TODO: Replace with Firebase Auth signInWithEmailAndPassword
    const found = STUB_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password.');
    }
    if (!found.isActive) {
      throw new Error('Your account has been deactivated. Contact an admin.');
    }
    const { password: _pw, ...user } = found;
    const profile: UserProfile = { ...user, lastLoginAt: new Date().toISOString() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setAuthState({ user: profile, isLoading: false, isAuthenticated: true });
  };

  // ── Google Sign-In (stub — Firebase will replace) ─────────────────────────
  const loginWithGoogle = async (): Promise<void> => {
    // TODO: Replace with Firebase Auth signInWithPopup(provider)
    throw new Error('Google Sign-In requires Firebase to be connected. Set FIREBASE_ENABLED=true in .env.');
  };

  // ── Sign Up (stub — Firebase will replace) ────────────────────────────────
  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    // TODO: Replace with Firebase Auth createUserWithEmailAndPassword
    const exists = STUB_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: UserProfile = {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      role: 'user', // new sign-ups are always regular users
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
    };
    STUB_USERS.push({ ...newUser, password });
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setAuthState({ user: newUser, isLoading: false, isAuthenticated: true });
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setAuthState({ user: null, isLoading: false, isAuthenticated: false });
  };

  // ── Permission helpers ────────────────────────────────────────────────────
  const getPermissions = () => {
    if (!authState.user) return ROLE_PERMISSIONS.guest;
    return ROLE_PERMISSIONS[authState.user.role];
  };

  const can = (action: 'write' | 'delete' | 'viewAdmin'): boolean => {
    const p = getPermissions();
    if (action === 'write') return p.canWrite;
    if (action === 'delete') return p.canDelete;
    if (action === 'viewAdmin') return p.canViewAdminPanel;
    return false;
  };

  const canAccessRoute = (path: string): boolean => {
    const p = getPermissions();
    if (p.accessibleRoutes.includes('*')) return true;
    // Check exact or prefix match
    return p.accessibleRoutes.some(r => path === r || path.startsWith(r + '/'));
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.user?.role === role;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      loginWithGoogle,
      logout,
      signUp,
      can,
      canAccessRoute,
      hasRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
