import { adminAuthService } from '@/admin/services/auth-service';

const ADMIN_API_URL = 'http://localhost:3001/admin';

export interface AdminApiOptions {
  auth?: boolean;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface AdminApiError {
  message: string;
  status: number;
}

async function handleUnauthorized(): Promise<void> {
  adminAuthService.clearSession();
  if (typeof window !== 'undefined') {
    window.location.assign('/admin/login');
  }
}

export async function adminApi<T = unknown>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  options: AdminApiOptions = {},
): Promise<T> {
  const { auth = true, headers = {}, body } = options;

  const isFormData = body instanceof FormData;
  const requestHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...headers,
  };

  if (auth) {
    const token = adminAuthService.getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const url = `${ADMIN_API_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw { message: 'Network error. Please check your connection.', status: 0 } as AdminApiError;
  }

  if (res.status === 401) {
    await handleUnauthorized();
    throw { message: 'Session expired. Please sign in again.', status: 401 } as AdminApiError;
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* response had no JSON body */
    }
    throw { message, status: res.status } as AdminApiError;
  }

  try {
    return (await res.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export { ADMIN_API_URL };
