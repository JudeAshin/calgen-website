import type {
  AdminUser,
  AuthResponse,
  LoginCredentials,
} from '@/admin/types';
import { adminApi } from '@/admin/services/adminApi';

const TOKEN_KEY = 'calgen_admin_token';
const USER_KEY = 'calgen_admin_user';

interface BackendLoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}

export const adminAuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await adminApi<BackendLoginResponse>('/login', 'POST', {
      auth: false,
      body: credentials,
    });

    const user: AdminUser = {
      id: data.admin.id,
      email: data.admin.email,
      name: data.admin.name,
      role: 'admin',
    };

    return { token: data.token, user };
  },

  async logout(): Promise<void> {
    try {
      await adminApi<{ message: string }>('/logout', 'POST');
    } catch {
      // Even if the API call fails (expired/invalid token), clear local session.
    } finally {
      this.clearSession();
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AdminUser;
    } catch {
      return null;
    }
  },

  setSession(token: string, user: AdminUser): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
