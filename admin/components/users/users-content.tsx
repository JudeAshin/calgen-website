'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users as UsersIcon,
  Phone as PhoneIcon,
  UserCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  Globe,
  Wifi,
  IndianRupee,
  Zap,
  Award,
  Eye,
} from 'lucide-react';
import { usersService } from '@/admin/services/users-service';
import { useAdminAuth } from '@/admin/hooks/use-auth';
import type {
  User,
  UsersResponse,
  UserType,
  Period,
  UserQueryParams,
  Pagination,
  UserSummary,
} from '@/admin/types/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDetailDrawer } from '@/admin/components/users/user-detail-drawer';

const AVAILABLE_LANGUAGES = [
  'Tamil',
  'English',
  'Hindi',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
];

const AVAILABLE_GENDERS = ['male', 'female', 'other'];

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Date' },
];

const PAGE_SIZES = [20, 50, 100];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function escapeCsv(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, headers: string[], rows: (string | number | undefined)[][]) {
  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function UsersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();

  // Filter state
  const [type, setType] = useState<UserType | 'all'>('all');
  const [period, setPeriod] = useState<Period>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [gender, setGender] = useState<string>('');

  // Data state
  const [users, setUsers] = useState<User[]>([]);
  const [summary, setSummary] = useState<UserSummary>({ total: 0, callers: 0, hosts: 0 });
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drawer
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Sync from URL on mount
  useEffect(() => {
    const t = (searchParams.get('type') as UserType | 'all') || 'all';
    const p = (searchParams.get('period') as Period) || 'all';
    setType(t);
    setPeriod(p);
    setFromDate(searchParams.get('from_date') || '');
    setToDate(searchParams.get('to_date') || '');
    setSearch(searchParams.get('search') || '');
    setDebouncedSearch(searchParams.get('search') || '');
    const langs = searchParams.get('languages');
    setLanguages(langs ? langs.split(',') : []);
    setGender(searchParams.get('gender') || '');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    setPagination((prev) => ({ ...prev, page: isNaN(page) ? 1 : page, limit: isNaN(limit) ? 20 : limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  // Build query params
  const queryParams: UserQueryParams = useMemo(() => {
    const params: UserQueryParams = {
      page: pagination.page,
      limit: pagination.limit,
    };
    if (type !== 'all') params.type = type;
    if (period !== 'all') params.period = period;
    if (period === 'custom') {
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;
    }
    if (debouncedSearch) params.search = debouncedSearch;
    if (languages.length > 0) params.languages = languages;
    if (gender) params.gender = gender;
    return params;
  }, [type, period, fromDate, toDate, debouncedSearch, languages, gender, pagination.page, pagination.limit]);

  // Update URL
  const updateUrl = useCallback((params: UserQueryParams) => {
    const url = new URLSearchParams();
    
    if (params.type) {
      url.set('type', params.type);
    }
  
    if (params.period && params.period !== 'all') {
      url.set('period', params.period);
    }
  
    if (params.from_date) {
      url.set('from_date', params.from_date);
    }
  
    if (params.to_date) {
      url.set('to_date', params.to_date);
    }
  
    if (params.search) {
      url.set('search', params.search);
    }
  
    if (params.languages && params.languages.length > 0) {
      url.set('languages', params.languages.join(','));
    }
  
    if (params.gender) {
      url.set('gender', params.gender);
    }
  
    if (params.page && params.page > 1) {
      url.set('page', String(params.page));
    }
  
    if (params.limit && params.limit !== 20) {
      url.set('limit', String(params.limit));
}
  
    const qs = url.toString();
    
    router.replace(
      qs ? `/admin/users?${qs}` : '/admin/users',
      { scroll: false },
    );
  }, [router]);

  // Fetch users
  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (!isAuthenticated) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const res: UsersResponse = await usersService.getUsers(queryParams);
      setUsers(res.data ?? []);
      setSummary(res.summary ?? { total: 0, callers: 0, hosts: 0 });
      setPagination(res.pagination ?? { page: 1, limit: 20, total: 0, total_pages: 0 });
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Unable to load users.',
      );
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [isAuthenticated, queryParams]);

  // Fetch when query params change
  useEffect(() => {
    updateUrl(queryParams);
    fetchUsers();
  }, [fetchUsers, updateUrl, queryParams]);

  // Handle filter changes - reset to page 1
  const handleTypeChange = (value: string) => {
    setType(value as UserType | 'all');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value as Period);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLanguageToggle = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleGenderChange = (value: string) => {
    setGender(value === 'all' ? '' : value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit: newLimit }));
  };

  const handleClearFilters = () => {
    setType('all');
    setPeriod('all');
    setFromDate('');
    setToDate('');
    setSearch('');
    setDebouncedSearch('');
    setLanguages([]);
    setGender('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = useMemo(() => {
    return (
      type !== 'all' ||
      period !== 'all' ||
      !!debouncedSearch ||
      languages.length > 0 ||
      !!gender ||
      fromDate ||
      toDate
    );
  }, [type, period, debouncedSearch, languages, gender, fromDate, toDate]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleExportCsv = () => {
    if (users.length === 0) return;

    if (type === 'caller' || (type === 'all' && users.every((u) => u.user_type === 'caller'))) {
      const headers = ['Name', 'Username', 'Phone', 'Email', 'Languages', 'XP', 'Level', 'Rating', 'Created Date'];
      const rows = users.map((u) => [
        u.name,
        u.username,
        u.phone,
        u.email,
        (u.preferred_languages ?? []).join('; '),
        u.xp,
        u.level,
        u.rating ?? '',
        formatDate(u.created_at),
      ]);
      downloadCsv('callers.csv', headers, rows);
    } else if (type === 'host' || (type === 'all' && users.every((u) => u.user_type === 'host'))) {
      const headers = ['Name', 'Username', 'Phone', 'Email', 'Languages', 'Base Caller Rate', 'Base Host Rate', 'Coin Per Minute', 'Rating', 'Total Calls', 'Online Status', 'Verification Status', 'Created Date'];
      const rows = users.map((u) => [
        u.name,
        u.username,
        u.phone,
        u.email,
        (u.host?.languages ?? u.preferred_languages ?? []).join('; '),
        u.host?.base_caller_rate,
        u.host?.base_host_rate,
        u.host?.coin_per_minute,
        u.host?.avg_rating ?? u.rating ?? '',
        u.host?.total_calls,
        u.host?.is_online ? 'Online' : 'Offline',
        u.host?.verification_status,
        formatDate(u.created_at),
      ]);
      downloadCsv('hosts.csv', headers, rows);
    } else {
      const headers = ['Name', 'Username', 'Type', 'Phone', 'Email', 'Languages', 'Created Date'];
      const rows = users.map((u) => [
        u.name,
        u.username,
        u.user_type,
        u.phone,
        u.email,
        (u.preferred_languages ?? []).join('; '),
        formatDate(u.created_at),
      ]);
      downloadCsv('users.csv', headers, rows);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Users Management</h2>
            <p className="text-sm text-slate-500">Monitor and manage callers and hosts</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={users.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={UsersIcon}
          label="Total Users"
          value={summary.total}
          color="emerald"
          loading={loading}
        />
        <SummaryCard
          icon={PhoneIcon}
          label="Callers"
          value={summary.callers}
          color="purple"
          loading={loading}
        />
        <SummaryCard
          icon={UserCircle2}
          label="Hosts"
          value={summary.hosts}
          color="blue"
          loading={loading}
        />
      </div>

      {/* Type Tabs */}
      <Tabs value={type} onValueChange={handleTypeChange}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="caller">Callers</TabsTrigger>
          <TabsTrigger value="host">Hosts</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, username, email or phone"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Period */}
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Gender */}
          <Select value={gender || 'all'} onValueChange={handleGenderChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              {AVAILABLE_GENDERS.map((g) => (
                <SelectItem key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Language multi-select */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Globe className="h-4 w-4 text-slate-400" />
                Languages
                {languages.length > 0 && (
                  <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-emerald-700">
                    {languages.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="start">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500">Filter by language</p>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <label key={lang} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <Checkbox
                      checked={languages.includes(lang)}
                      onCheckedChange={() => handleLanguageToggle(lang)}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Custom Date Range */}
        {period === 'custom' && (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-500">To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {(fromDate || toDate) && (
              <button
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                }}
                className="text-xs font-medium text-red-500 hover:text-red-600"
              >
                Clear dates
              </button>
            )}
          </div>
        )}

        {/* Selected language chips */}
        {languages.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageToggle(lang)}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
              >
                {lang}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div>
            <p>{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="mt-1 text-xs font-medium text-red-600 underline hover:text-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table / Loading / Empty */}
      {loading ? (
        <SkeletonTable />
      ) : error ? (
        null
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UsersIcon className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-700">No users found</h4>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            Try adjusting your filters to see more results.
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">User</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold">Gender / Age</th>
                    <th className="px-4 py-3 text-left font-semibold">Languages</th>
                    {type === 'caller' && (
                      <>
                        <th className="px-4 py-3 text-left font-semibold">XP</th>
                        <th className="px-4 py-3 text-left font-semibold">Level</th>
                        <th className="px-4 py-3 text-left font-semibold">Rating</th>
                      </>
                    )}
                    {type === 'host' && (
                      <>
                        <th className="px-4 py-3 text-left font-semibold">Base Caller Rate</th>
                        <th className="px-4 py-3 text-left font-semibold">Base Host Rate</th>
                        <th className="px-4 py-3 text-left font-semibold">Coin/Min</th>
                        <th className="px-4 py-3 text-left font-semibold">Rating</th>
                        <th className="px-4 py-3 text-left font-semibold">Total Calls</th>
                        <th className="px-4 py-3 text-left font-semibold">Online</th>
                        <th className="px-4 py-3 text-left font-semibold">Verification</th>
                      </>
                    )}
                    {type === 'all' && (
                      <>
                        <th className="px-4 py-3 text-left font-semibold">Rating</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left font-semibold">Registered</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      tabType={type}
                      onView={() => handleViewUser(user)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile/tablet cards */}
          <div className="space-y-3 lg:hidden">
            {users.map((user) => (
              <UserMobileCard
                key={user.id}
                user={user}
                tabType={type}
                onView={() => handleViewUser(user)}
              />
            ))}
          </div>

          {/* Pagination */}
          <PaginationBar
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {/* Detail Drawer */}
      <UserDetailDrawer
        user={selectedUser}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

/* ---------- Sub-components ---------- */

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: typeof UsersIcon;
  label: string;
  value: number;
  color: 'emerald' | 'purple' | 'blue';
  loading: boolean;
}) {
  const colorMap = {
    emerald: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
          {loading ? (
            <div className="mt-1 h-7 w-16 animate-pulse rounded bg-slate-200" />
          ) : (
            <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: UserType }) {
  return type === 'host' ? (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
      Host
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-700">
      Caller
    </span>
  );
}

function LanguageChips({ languages }: { languages?: string[] }) {
  if (!languages || languages.length === 0) return <span className="text-xs text-slate-400">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {languages.slice(0, 3).map((lang, i) => (
        <span key={`${lang}-${i}`} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
          {lang}
        </span>
      ))}
      {languages.length > 3 && (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
          +{languages.length - 3}
        </span>
      )}
    </div>
  );
}

function OnlineIndicator({ isOnline }: { isOnline?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <span className={isOnline ? 'font-medium text-emerald-700' : 'text-slate-400'}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </span>
  );
}

function VerificationBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-xs text-slate-400">—</span>;
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    rejected: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${styles[s] ?? 'bg-slate-100 text-slate-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RatingDisplay({ rating }: { rating?: number | string | null }) {
  const numericRating = Number(rating ?? 0);

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-semibold text-slate-700">
      {numericRating.toFixed(1)}
    </span>
</div>
  );
}

function UserTableRow({
  user,
  tabType,
  onView,
}: {
  user: User;
  tabType: UserType | 'all';
  onView: () => void;
}) {
  const isHost = user.user_type === 'host';
  const host = user.host;
  const languages = isHost ? host?.languages ?? user.preferred_languages : user.preferred_languages;

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            {user.photo_url ? <AvatarImage src={user.photo_url} alt={user.name} /> : null}
            <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700">
              {getInitials(user.name || '?')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
            {user.username && <p className="truncate text-xs text-slate-400">@{user.username}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <TypeBadge type={user.user_type} />
      </td>
      <td className="px-4 py-3">
        <p className="truncate text-xs text-slate-600">{user.email || '—'}</p>
        <p className="truncate text-xs text-slate-400">{user.phone || '—'}</p>
      </td>
      <td className="px-4 py-3 text-xs text-slate-600">
        <p>{user.gender ? String(user.gender) : '—'}</p>
        {user.age !== undefined && <p className="text-slate-400">{user.age} yrs</p>}
      </td>
      <td className="px-4 py-3">
        <LanguageChips languages={languages} />
      </td>

      {/* Caller-specific */}
      {tabType === 'caller' && (
        <>
          <td className="px-4 py-3 text-xs font-semibold text-slate-700">{user.xp ?? 0}</td>
          <td className="px-4 py-3">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
              <Award className="h-3 w-3" />
              Level {user.level ?? 1}
            </span>
          </td>
          <td className="px-4 py-3">
            <RatingDisplay rating={user.rating} />
          </td>
        </>
      )}

      {/* Host-specific */}
      {tabType === 'host' && (
        <>
          <td className="px-4 py-3 text-xs font-medium text-slate-700">
            {host?.base_caller_rate !== undefined ? `₹${host.base_caller_rate}` : '—'}
          </td>
          <td className="px-4 py-3 text-xs font-medium text-slate-700">
            {host?.base_host_rate !== undefined ? `₹${host.base_host_rate}` : '—'}
          </td>
          <td className="px-4 py-3 text-xs font-medium text-slate-700">
            {host?.coin_per_minute ?? '—'}
          </td>
          <td className="px-4 py-3">
            <RatingDisplay rating={host?.avg_rating ?? user.rating} />
          </td>
          <td className="px-4 py-3 text-xs text-slate-600">{host?.total_calls ?? '—'}</td>
          <td className="px-4 py-3">
            <OnlineIndicator isOnline={host?.is_online} />
          </td>
          <td className="px-4 py-3">
            <VerificationBadge status={host?.verification_status} />
          </td>
        </>
      )}

      {/* All users view */}
      {tabType === 'all' && (
        <>
          <td className="px-4 py-3">
            <RatingDisplay rating={isHost ? host?.avg_rating : user.rating} />
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-wrap gap-1">
              {user.is_profile_complete !== undefined && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.is_profile_complete ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {user.is_profile_complete ? 'Complete' : 'Incomplete'}
                </span>
              )}
              {user.is_voice_verified !== undefined && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${user.is_voice_verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {user.is_voice_verified ? 'Verified' : 'Unverified'}
                </span>
              )}
            </div>
          </td>
        </>
      )}

      <td className="px-4 py-3 text-xs text-slate-500">{formatDate(user.created_at)}</td>
      <td className="px-4 py-3">
        <button
          onClick={onView}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      </td>
    </tr>
  );
}

function UserMobileCard({
  user,
  tabType,
  onView,
}: {
  user: User;
  tabType: UserType | 'all';
  onView: () => void;
}) {
  const isHost = user.user_type === 'host';
  const host = user.host;
  const languages = isHost ? host?.languages ?? user.preferred_languages : user.preferred_languages;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {user.photo_url ? <AvatarImage src={user.photo_url} alt={user.name} /> : null}
            <AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700">
              {getInitials(user.name || '?')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
            {user.username && <p className="truncate text-xs text-slate-400">@{user.username}</p>}
            <div className="mt-1">
              <TypeBadge type={user.user_type} />
            </div>
          </div>
        </div>
        <button
          onClick={onView}
          className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </button>
      </div>

      <div className="mt-3 space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Email</span>
          <span className="truncate text-slate-600">{user.email || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Phone</span>
          <span className="text-slate-600">{user.phone || '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Languages</span>
          <LanguageChips languages={languages} />
        </div>
        {tabType === 'caller' && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-400">XP</span>
              <span className="font-medium text-slate-700">{user.xp ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level</span>
              <span className="font-medium text-slate-700">Level {user.level ?? 1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rating</span>
              <RatingDisplay rating={user.rating} />
            </div>
          </>
        )}
        {tabType === 'host' && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-400">Base Caller Rate</span>
              <span className="font-medium text-slate-700">{host?.base_caller_rate !== undefined ? `₹${host.base_caller_rate}` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Base Host Rate</span>
              <span className="font-medium text-slate-700">{host?.base_host_rate !== undefined ? `₹${host.base_host_rate}` : '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Coin/Min</span>
              <span className="font-medium text-slate-700">{host?.coin_per_minute ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Rating</span>
              <RatingDisplay rating={host?.avg_rating ?? user.rating} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Calls</span>
              <span className="font-medium text-slate-700">{host?.total_calls ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Online</span>
              <OnlineIndicator isOnline={host?.is_online} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verification</span>
              <VerificationBadge status={host?.verification_status} />
            </div>
          </>
        )}
        {tabType === 'all' && (
          <div className="flex justify-between">
            <span className="text-slate-400">Rating</span>
            <RatingDisplay rating={isHost ? host?.avg_rating : user.rating} />
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Registered</span>
          <span className="text-slate-600">{formatDate(user.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

function PaginationBar({
  pagination,
  onPageChange,
  onPageSizeChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}) {
  const { page, limit, total, total_pages } = pagination;

  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Build page numbers to display
  const pages: (number | '...')[] = [];
  const maxVisible = 5;
  if (total_pages <= maxVisible + 2) {
    for (let i = 1; i <= total_pages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(total_pages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < total_pages - 2) pages.push('...');
    pages.push(total_pages);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-700">{start}</span>–
          <span className="font-medium text-slate-700">{end}</span> of{' '}
          <span className="font-medium text-slate-700">{total.toLocaleString()}</span>
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Rows:</span>
          <Select value={String(limit)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-xs text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-emerald-600 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= total_pages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-3.5 last:border-0"
          >
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="hidden flex-1 space-y-2 sm:block">
              <div className="h-3.5 w-40 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
            <div className="hidden h-3.5 w-20 animate-pulse rounded bg-slate-200 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
