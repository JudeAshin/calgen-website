export type UserType = 'caller' | 'host';

export type Gender = 'male' | 'female' | 'other';

export type Period =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_month'
  | 'custom';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface UserSummary {
  total: number;
  callers: number;
  hosts: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface HostDetails {
  languages?: string[];
  base_caller_rate?: number;
  base_host_rate?: number;
  rate_per_min?: number;
  coin_per_minute?: number;
  verification_status?: VerificationStatus | string;
  avg_rating?: number;
  total_calls?: number;
  is_online?: boolean;
  total_earnings?: number;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  age?: number;
  gender?: Gender | string;
  user_type: UserType;
  preferred_languages?: string[];
  created_at?: string;
  is_profile_complete?: boolean;
  is_voice_verified?: boolean;
  xp?: number;
  level?: number;
  rating?: number | string | null;
    total_ratings?: number;
  host?: HostDetails;
}

export interface UsersResponse {
  success: boolean;
  summary: UserSummary;
  pagination: Pagination;
  data: User[];
}

export interface UserQueryParams {
  type?: UserType;
  period?: Period;
  from_date?: string;
  to_date?: string;
  search?: string;
  languages?: string[];
  gender?: string;
  page?: number;
  limit?: number;
}
