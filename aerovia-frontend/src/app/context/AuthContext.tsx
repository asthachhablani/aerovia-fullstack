import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi, type UserProfile } from '../services/api';

export type { UserProfile };

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = 'aerovia_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, loading: true });

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setState({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    authApi.me()
      .then(res => setState({ user: res.user, isAuthenticated: true, loading: false }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setState({ user: null, isAuthenticated: false, loading: false });
      });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem(TOKEN_KEY, res.token);
      setState({ user: res.user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Login failed.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await authApi.register(name, email, password);
      localStorage.setItem(TOKEN_KEY, res.token);
      setState({ user: res.user, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: (err as Error).message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, isAuthenticated: false, loading: false });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const res = await userApi.updateProfile(data);
    setState(prev => ({ ...prev, user: res.user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
