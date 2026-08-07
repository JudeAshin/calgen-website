export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: AdminUser;
  }
  
  export interface AuthContextValue {
    user: AdminUser | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
  }
  
  export interface NavItem {
    label: string;
    href: string;
    icon: string;
  }
  