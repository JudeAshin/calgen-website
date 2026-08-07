export type AdRole = 'caller' | 'host';

export type AdStatus = 'active' | 'inactive' | 'expired';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image?: string;
  redirect_url?: string;
  start_date?: string;
  end_date?: string;
  roles?: AdRole[];
  priority?: number;
  campaign_type?: string;
  campaign_data?: string;
  is_active?: boolean;
  status?: AdStatus;
  created_at?: string;
  updated_at?: string;
}

export interface RunningAdsResponse {
  success: boolean;
  caller_ads: Advertisement[];
  host_ads: Advertisement[];
}

export interface AdsListResponse {
  success: boolean;
  data: Advertisement[];
}

export interface CreateAdPayload {
  title: string;
  description: string;
  image: File | null;
  redirect_url: string;
  start_date: string;
  end_date: string;
  roles: AdRole[];
  priority: number;
  campaign_type: string;
  // campaign_data: Record<string, unknown> | null;
}