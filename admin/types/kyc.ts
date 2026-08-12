export type KycStatus = 'pending_review' | 'verified' | 'rejected';
export type BankVerificationStatus = 'pending_review' | 'verified' | 'rejected';

export interface KycHost {
  id: string;
  user_id?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  photo_url?: string | null;
  created_at?: string;
}

export interface KycRecord {
  id: string;
  status: KycStatus;
  pan_number?: string | null;
  pan_status?: KycStatus | string | null;
  document_type?: string | null;
  document_number?: string | null;
  document_front_url?: string | null;
  document_back_url?: string | null;
  selfie_url?: string | null;
  created_at: string;
  updated_at?: string;
  rejection_reason?: string | null;
  bank_details_changed?: boolean;
  identity_status?: KycStatus;
  host?: KycHost;
  bank?: KycBank;
}

export interface KycBank {
  account_holder_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  bank_name?: string | null;
  verification_status: BankVerificationStatus;
  updated_at?: string;
  rejection_reason?: string | null;
}

export interface KycListItem extends KycRecord {
  host: KycHost;
  bank?: KycBank;
}

export interface KycDetailResponse {
  success?: boolean;
  data: {
    kyc: KycRecord;
    host: KycHost;
    bank?: KycBank | null;
  };
}

export interface KycSummary {
  total?: number;
  pending_review?: number;
  verified?: number;
  rejected?: number;
  bank_pending_review?: number;
}

export interface KycPagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  total_pages?: number;
}

export interface KycListResponse {
  success?: boolean;
  data: KycListItem[];
  pagination: KycPagination;
  summary?: KycSummary;
}

export interface KycListParams {
  status?: string;
  bank_status?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}

export interface RejectKycRequest {
  reason: string;
}

export const KYC_STATUS_OPTIONS: { value: KycStatus; label: string }[] = [
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  aadhaar: 'Aadhaar',
  passport: 'Passport',
  voter_id: 'Voter ID',
  voter: 'Voter ID',
};

export function getKycStatusLabel(status?: string | null): string {
  if (status === 'pending_review') return 'Pending Review';
  if (status === 'verified') return 'Verified';
  if (status === 'rejected') return 'Rejected';
  return status ? status.replace(/_/g, ' ') : 'Unknown';
}

export function getDocumentTypeLabel(type?: string | null): string {
  if (!type) return '—';
  return DOCUMENT_TYPE_LABELS[type.toLowerCase()] ?? type.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}