import { adminApi } from '@/admin/services/adminApi';
import type { UserQueryParams, UsersResponse } from '@/admin/types/users';

function buildQuery(params: UserQueryParams): string {
  const query = new URLSearchParams();

  if (params.type) query.set('type', params.type);
  if (params.period && params.period !== 'all' && params.period !== 'custom') {
    query.set('period', params.period);
  }
  if (params.period === 'custom') {
    if (params.from_date) query.set('from_date', params.from_date);
    if (params.to_date) query.set('to_date', params.to_date);
  }
  if (params.search) query.set('search', params.search);
  if (params.languages && params.languages.length > 0) {
    query.set('languages', params.languages.join(','));
  }
  if (params.gender) query.set('gender', params.gender);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const usersService = {
  getUsers(params: UserQueryParams): Promise<UsersResponse> {
    return adminApi<UsersResponse>(`/users${buildQuery(params)}`, 'GET');
  },
};
