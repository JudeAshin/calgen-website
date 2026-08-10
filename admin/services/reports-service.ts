import { adminAuthService } from '@/admin/services/auth-service';

import type {
  Report,
  ReportQueryParams,
  ReportsResponse,
  ReviewReportRequest,
  BannedUserQueryParams,
  BannedUsersResponse,
} from '@/admin/types/reports';

const REPORT_API_URL =
  'https://api.caligen.tech/reports';

async function reportApi<T = unknown>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: unknown,
): Promise<T> {
  const token = adminAuthService.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;

  try {
    res = await fetch(`${REPORT_API_URL}${path}`, {
      method,
      headers,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  } catch {
    throw {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  }

  if (res.status === 401) {
    adminAuthService.clearSession();

    if (typeof window !== 'undefined') {
      window.location.assign('/admin/login');
    }

    throw {
      message: 'Session expired. Please sign in again.',
      status: 401,
    };
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    try {
      const data = await res.json();

      if (data?.message) {
        message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {
      // No JSON response
    }

    throw {
      message,
      status: res.status,
    };
  }

  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export const reportsService = {
  // ─────────────────────────────────────────────────────────────
  // Get reports
  // GET /reports
  // ─────────────────────────────────────────────────────────────

  getReports(
    params: ReportQueryParams,
  ): Promise<ReportsResponse> {
    const query = new URLSearchParams();

    if (params.status) {
      query.set('status', params.status);
    }

    if (params.direction) {
      query.set('direction', params.direction);
    }

    if (params.severity) {
      query.set('severity', params.severity);
    }

    if (params.page) {
      query.set('page', String(params.page));
    }

    if (params.limit) {
      query.set('limit', String(params.limit));
    }

    const qs = query.toString();

    return reportApi<ReportsResponse>(
      `${qs ? `?${qs}` : ''}`,
      'GET',
    );
  },

  // ─────────────────────────────────────────────────────────────
  // Get report by ID
  // GET /reports/:id
  // ─────────────────────────────────────────────────────────────

  getReportById(
    id: string,
  ): Promise<Report> {
    return reportApi<Report>(
      `/${id}`,
      'GET',
    );
  },

  // ─────────────────────────────────────────────────────────────
  // Review report
  // PATCH /reports/:id/review
  // ─────────────────────────────────────────────────────────────

  reviewReport(
    id: string,
    data: ReviewReportRequest,
  ): Promise<Report> {
    return reportApi<Report>(
      `/${id}/review`,
      'PATCH',
      data,
    );
  },

  // ─────────────────────────────────────────────────────────────
  // Get banned users
  // GET /reports/banned/users
  // ─────────────────────────────────────────────────────────────

  getBannedUsers(
    params: BannedUserQueryParams,
  ): Promise<BannedUsersResponse> {
    const query = new URLSearchParams();

    if (params.role) {
      query.set('role', params.role);
    }

    if (params.page) {
      query.set('page', String(params.page));
    }

    if (params.limit) {
      query.set('limit', String(params.limit));
    }

    const qs = query.toString();

    return reportApi<BannedUsersResponse>(
      `/banned/users${qs ? `?${qs}` : ''}`,
      'GET',
    );
  },
};

