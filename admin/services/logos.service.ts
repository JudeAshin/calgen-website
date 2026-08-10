import { adminAuthService } from '@/admin/services/auth-service';
import type {
  AppLogoState,
  CreateSchedulePayload,
  FestivalSchedule,
  RunCheckResult,
  UpdateSchedulePayload,
} from '@/admin/types/logos';

const LOGO_API_URL = 'https://api.caligen.tech/festival-logo';

async function logoApi<T = unknown>(
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
    res = await fetch(`${LOGO_API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
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
        message = data.message;
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

export const logosService = {
  getCurrentLogoState(): Promise<AppLogoState> {
    return logoApi<AppLogoState>(
      '/current',
      'GET',
    );
  },

  getSchedules(): Promise<FestivalSchedule[]> {
    return logoApi<FestivalSchedule[]>(
      '/schedules',
      'GET',
    );
  },

  getSchedule(id: string): Promise<FestivalSchedule> {
    return logoApi<FestivalSchedule>(
      `/schedules/${id}`,
      'GET',
    );
  },

  createSchedule(
    data: CreateSchedulePayload,
  ): Promise<FestivalSchedule> {
    return logoApi<FestivalSchedule>(
      '/schedules',
      'POST',
      data,
    );
  },

  updateSchedule(
    id: string,
    data: UpdateSchedulePayload,
  ): Promise<FestivalSchedule> {
    return logoApi<FestivalSchedule>(
      `/schedules/${id}`,
      'PATCH',
      data,
    );
  },

  deleteSchedule(id: string): Promise<{ message: string }> {
    return logoApi<{ message: string }>(
      `/schedules/${id}`,
      'DELETE',
    );
  },

  triggerLogo(
    logoType: string,
  ): Promise<{ message: string; logo_type: string }> {
    return logoApi<{ message: string; logo_type: string }>(
      `/trigger/${logoType}`,
      'POST',
      {},
    );
  },

  runCheck(
    force?: boolean,
    date?: string,
  ): Promise<RunCheckResult> {
    const query = new URLSearchParams();

    if (force) {
      query.set('force', 'true');
    }

    if (date) {
      query.set('date', date);
    }

    const qs = query.toString();

    return logoApi<RunCheckResult>(
      `/run-check${qs ? `?${qs}` : ''}`,
      'POST',
      {},
    );
  },

  seedSchedules(): Promise<{ message: string }> {
    return logoApi<{ message: string }>(
      '/seed',
      'POST',
      {},
    );
  },
};