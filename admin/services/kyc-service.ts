import { adminApi } from '@/admin/services/adminApi';
import type {
  KycDetailResponse,
  KycListParams,
  KycListResponse,
  RejectKycRequest,
} from '@/admin/types/kyc';

function buildQuery(params: KycListParams): string {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.bank_status) query.set('bank_status', params.bank_status);
  if (params.search) query.set('search', params.search);
  if (params.from_date) query.set('from_date', params.from_date);
  if (params.to_date) query.set('to_date', params.to_date);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const kycService = {
  getKycList(params: KycListParams): Promise<KycListResponse> {
    return adminApi<KycListResponse>(`/kyc${buildQuery(params)}`, 'GET');
  },

  getKycById(id: string): Promise<KycDetailResponse> {
    return adminApi<KycDetailResponse>(`/kyc/${encodeURIComponent(id)}`, 'GET');
  },

  verifyBank(id: string): Promise<unknown> {
    return adminApi(`/kyc/${encodeURIComponent(id)}/bank/verify`, 'PATCH');
  },

  rejectBank(id: string, data: RejectKycRequest): Promise<unknown> {
    return adminApi(`/kyc/${encodeURIComponent(id)}/bank/reject`, 'PATCH', { body: data });
  },

  verifyKyc(id: string): Promise<unknown> {
    return adminApi(`/kyc/${encodeURIComponent(id)}/verify`, 'PATCH');
  },

  rejectKyc(id: string, data: RejectKycRequest): Promise<unknown> {
    return adminApi(`/kyc/${encodeURIComponent(id)}/reject`, 'PATCH', { body: data });
  },
};