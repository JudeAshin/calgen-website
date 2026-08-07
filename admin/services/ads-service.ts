import { adminApi } from '@/admin/services/adminApi';
import type {
  Advertisement,
  AdsListResponse,
  CreateAdPayload,
  RunningAdsResponse,
} from '@/admin/types/ads';

export const adsService = {
  getAds(): Promise<AdsListResponse> {
    return adminApi<AdsListResponse>('/ads', 'GET');
  },

  getRunningAds(): Promise<RunningAdsResponse> {
    return adminApi<RunningAdsResponse>('/ads/running', 'GET');
  },

  getInactiveAds(): Promise<AdsListResponse> {
    return adminApi<AdsListResponse>('/ads/inactive', 'GET');
  },

  createAd(payload: CreateAdPayload): Promise<Advertisement> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('redirect_url', payload.redirect_url);
    formData.append('start_date', payload.start_date);
    formData.append('end_date', payload.end_date);
    formData.append('priority', String(payload.priority));
    formData.append('campaign_type', payload.campaign_type);

    payload.roles.forEach((role) => {
      formData.append('roles', role);
    });

    // if (payload.campaign_data) {
    //   formData.append('campaign_data', JSON.stringify(payload.campaign_data));
    // }

    if (payload.image) {
      formData.append('image', payload.image);
    }

    return adminApi<Advertisement>('/ads', 'POST', { body: formData });
  },

  toggleAd(id: string): Promise<Advertisement> {
    return adminApi<Advertisement>(`/ads/${id}/toggle`, 'PATCH');
  },

  deleteAd(id: string): Promise<{ message: string }> {
    return adminApi<{ message: string }>(`/ads/${id}/delete`, 'PATCH');
  },
};
