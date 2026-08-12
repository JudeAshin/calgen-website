import { adminApi } from '@/admin/services/adminApi';
import type {
  KycBank,
  KycDetailResponse,
  KycHost,
  KycListItem,
  KycListParams,
  KycListResponse,
  KycRecord,
  KycStatus,
  RejectKycRequest,
  ReviewDocumentsRequest,
} from '@/admin/types/kyc';

// ── Raw backend shapes (as actually returned today) ──────────────────────
interface RawBankBlock {
  account_holder_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  bank_name?: string | null;
  verification_status?: string | null; // pending_review | verified | rejected (host_bank_details table)
  rejection_reason?: string | null;
  updated_at?: string | null;
}

interface RawKycRecord {
  id: string;
  host_id: string;
  host?: KycRecord['host'];

  document_type?: string | null;
  document_number?: string | null;
  document_front_url?: string | null;
  document_back_url?: string | null;
  selfie_url?: string | null;

  pan_number?: string | null;
  pan_status?: string | null;

  status: string;

  bank_verification_status?: string | null;
  document_verification_status?: string | null;

  rejection_reason?: string | null;
  bank_rejection_reason?: string | null;
  bank_details_changed?: boolean;

  created_at: string;
  updated_at?: string;

  bank?: RawBankBlock | null;

  // ADD THIS
  verification?: RawVerification | null;
}

interface RawVerification {
  bank?: string | null;
  documents?: string | null;
  bank_verified_at?: string | null;
  document_verified_at?: string | null;
  bank_rejection_reason?: string | null;
  document_rejection_reason?: string | null;
}

// ── Normalization helpers ─────────────────────────────────────────────────

// host_kyc.bank_verification_status / document_verification_status use
// 'pending' | 'verified' | 'rejected'. Everything else in the UI (and
// host_bank_details.verification_status) uses 'pending_review' | 'verified' | 'rejected'.
// This collapses both into the one the UI understands.
function normalizeStatus(value?: string | null): KycStatus {
  if (value === 'pending') return 'pending_review';
  if (value === 'verified' || value === 'rejected' || value === 'pending_review') return value;
  return 'pending_review';
}

function mapBank(
  raw: RawKycRecord,
  verificationBankStatus?: string | null,
): KycBank {
  return {
    account_holder_name: raw.bank?.account_holder_name ?? null,
    account_number: raw.bank?.account_number ?? null,
    ifsc_code: raw.bank?.ifsc_code ?? null,
    bank_name: raw.bank?.bank_name ?? null,

    verification_status: normalizeStatus(
      verificationBankStatus ??
      raw.bank?.verification_status ??
      raw.bank_verification_status
    ),

    rejection_reason:
      raw.bank?.rejection_reason ??
      raw.bank_rejection_reason ??
      null,

    updated_at: raw.bank?.updated_at ?? undefined,
  };
}

function mapKycRecord(
  raw: RawKycRecord,
  host?: KycHost,
  verification?: RawVerification | null,
): KycRecord {
  return {
    id: raw.id,

    status: normalizeStatus(
      raw.document_verification_status ??
      verification?.documents ??
      raw.status
    ),

    pan_number: raw.pan_number,
    pan_status: raw.pan_status,
    document_type: raw.document_type,
    document_number: raw.document_number,
    document_front_url: raw.document_front_url,
    document_back_url: raw.document_back_url,
    selfie_url: raw.selfie_url,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    rejection_reason: raw.rejection_reason ?? null,
    bank_details_changed: raw.bank_details_changed ?? false,

    host: host ?? raw.host,

    bank: mapBank(raw, verification?.bank),
  };
}

function mapListItem(raw: RawKycRecord): KycListItem {
  const record = mapKycRecord(raw);
  return { ...record, host: raw.host!, bank: mapBank(raw) };
}

// Outgoing filter translation: the UI's status dropdowns use
// 'pending_review' everywhere, but the bank_status column on the backend
// stores 'pending'. Convert only for the bank filter.
function normalizeOutgoingBankStatus(value?: string): string | undefined {
  if (!value) return value;
  return value === 'pending_review' ? 'pending' : value;
}

function buildQuery(params: KycListParams): string {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.bank_status) query.set('bank_status', normalizeOutgoingBankStatus(params.bank_status)!);
  if (params.search) query.set('search', params.search);
  if (params.from_date) query.set('from_date', params.from_date);
  if (params.to_date) query.set('to_date', params.to_date);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const kycService = {
  async getKycList(params: KycListParams): Promise<KycListResponse> {
    const raw = await adminApi<{ success?: boolean; data: RawKycRecord[]; pagination: KycListResponse['pagination']; summary?: KycListResponse['summary'] }>(
      `/kyc${buildQuery(params)}`,
      'GET',
    );
    return {
      success: raw.success,
      pagination: raw.pagination,
      summary: raw.summary,
      data: (raw.data ?? []).map(mapListItem),
    };
  },

  async getKycById(id: string): Promise<KycDetailResponse> {
    const raw = await adminApi<{
      success?: boolean;
      data: {
        kyc: RawKycRecord;
        host: KycHost;
        bank?: RawBankBlock | null;
        verification?: RawVerification | null; // ← add this
      };
    }>(
      `/kyc/${encodeURIComponent(id)}`,
      'GET',
    );
  
    const kyc = mapKycRecord(
      {
        ...raw.data.kyc,
        bank: raw.data.bank ?? raw.data.kyc.bank,
      },
      raw.data.host,
      raw.data.verification, // ← pass it through
    );
  
    return {
      success: raw.success,
      data: {
        kyc,
        host: raw.data.host,
        bank: kyc.bank,
      },
    };
  },

  verifyBank(id: string): Promise<unknown> {
    return adminApi(
      `/kyc/${encodeURIComponent(id)}/bank`,
      'PATCH',
      {
        body: {
          status: 'verified',
        },
      },
    );
  },
  
  rejectBank(id: string, data: RejectKycRequest): Promise<unknown> {
    return adminApi(
      `/kyc/${encodeURIComponent(id)}/bank`,
      'PATCH',
      {
        body: {
          status: 'rejected',
          rejection_reason: data.reason,
        },
      },
    );
  },

  reviewDocuments(
    id: string,
    data: ReviewDocumentsRequest,
  ): Promise<unknown> {
    return adminApi(
      `/kyc/${encodeURIComponent(id)}/documents`,
      'PATCH',
      {
        body: data,
      },
    );
  },
};