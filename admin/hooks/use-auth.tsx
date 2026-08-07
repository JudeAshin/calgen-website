'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthService } from '@/admin/services/auth-service';
import type { AdminUser, AuthContextValue, LoginCredentials } from '@/admin/types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = adminAuthService.getToken();
    const storedUser = adminAuthService.getUser();
    setToken(storedToken);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await adminAuthService.login(credentials);
    adminAuthService.setSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await adminAuthService.logout();
    setToken(null);
    setUser(null);
    router.replace('/admin/login');
  }, [router]);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
