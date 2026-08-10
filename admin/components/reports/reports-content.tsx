'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Flag,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Ban,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { reportsService } from '@/admin/services/reports-service';
import { useAdminAuth } from '@/admin/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import {
  type Report,
  type ReportStatus,
  type ReportDirection,
  type ReportSeverity,
  type BannedUser,
  type BannedRole,
  type Pagination,
  type ReportQueryParams,
  type BannedUserQueryParams,
  STATUS_OPTIONS,
  DIRECTION_OPTIONS,
  SEVERITY_OPTIONS,
  getDirectionLabel,
  getReasonLabel,
  getReportedUser,
  getReporterInfo,
  getSeverityLabel,
} from '@/admin/types/reports';
import { SeverityBadge, StatusBadge } from '@/admin/components/reports/badges';
import { ReportDetailDrawer } from '@/admin/components/reports/report-detail-drawer';
import { ReviewModal } from '@/admin/components/reports/review-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PAGE_SIZES = [20, 50, 100];

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

type Tab = 'reports' | 'banned';

export function ReportsContent() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();

  const [tab, setTab] = useState<Tab>('reports');

  // Reports state
  const [reports, setReports] = useState<Report[]>([]);
  const [reportsPagination, setReportsPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  // Banned users state
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [bannedPagination, setBannedPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [bannedLoading, setBannedLoading] = useState(false);
  const [bannedError, setBannedError] = useState<string | null>(null);

  // Filters - reports
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [directionFilter, setDirectionFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filters - banned
  const [bannedRoleFilter, setBannedRoleFilter] = useState<string>('');

  // Drawer / modal
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Banned user detail
  const [selectedBannedUser, setSelectedBannedUser] = useState<BannedUser | null>(null);
  const [bannedDrawerOpen, setBannedDrawerOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  // Build report query params
  const reportQuery = useMemo((): ReportQueryParams => {
    const params: ReportQueryParams = {
      page: reportsPagination.page,
      limit: reportsPagination.limit,
    };
    if (statusFilter) params.status = statusFilter;
    if (directionFilter) params.direction = directionFilter;
    if (severityFilter) params.severity = severityFilter;
    return params;
  }, [statusFilter, directionFilter, severityFilter, reportsPagination.page, reportsPagination.limit]);

  // Fetch reports
  const fetchReports = useCallback(async () => {
    if (!isAuthenticated) return;
    setReportsLoading(true);
    setReportsError(null);
    try {
      const res = await reportsService.getReports(reportQuery);
      let data = res.data ?? [];
      // Client-side search
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        data = data.filter((r) => {
          const reporter = getReporterInfo(r);
          const reported = getReportedUser(r);
          return (
            r.id.toLowerCase().includes(q) ||
            (reporter.name?.toLowerCase().includes(q) ?? false) ||
            (reporter.email?.toLowerCase().includes(q) ?? false) ||
            (reported?.name?.toLowerCase().includes(q) ?? false) ||
            (reported?.email?.toLowerCase().includes(q) ?? false)
          );
        });
      }
      setReports(data);
      setReportsPagination(res.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      setReportsError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Unable to load reports. Please try again.',
      );
    } finally {
      setReportsLoading(false);
    }
  }, [isAuthenticated, reportQuery, debouncedSearch]);

  // Fetch banned users
  const fetchBannedUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    setBannedLoading(true);
    setBannedError(null);
    try {
      const params: BannedUserQueryParams = {
        page: bannedPagination.page,
        limit: bannedPagination.limit,
      };
      if (bannedRoleFilter) params.role = bannedRoleFilter;
      const res = await reportsService.getBannedUsers(params);
      setBannedUsers(res.data ?? []);
      setBannedPagination(res.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err) {
      setBannedError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'Unable to load banned users.',
      );
    } finally {
      setBannedLoading(false);
    }
  }, [isAuthenticated, bannedRoleFilter, bannedPagination.page, bannedPagination.limit]);

  // Fetch on mount and when filters change
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    fetchReports();
  }, [authLoading, isAuthenticated, fetchReports]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    if (tab === 'banned') fetchBannedUsers();
  }, [authLoading, isAuthenticated, tab, fetchBannedUsers]);

  const handleRefresh = async () => {
    if (tab === 'reports') {
      await fetchReports();
    } else {
      await fetchBannedUsers();
    }
    toast({ title: 'Refreshed.' });
  };

  // Filter handlers - reset to page 1
  const handleStatusChange = (v: string) => {
    setStatusFilter(v === 'all' ? '' : v);
    setReportsPagination((p) => ({ ...p, page: 1 }));
  };
  const handleDirectionChange = (v: string) => {
    setDirectionFilter(v === 'all' ? '' : v);
    setReportsPagination((p) => ({ ...p, page: 1 }));
  };
  const handleSeverityChange = (v: string) => {
    setSeverityFilter(v === 'all' ? '' : v);
    setReportsPagination((p) => ({ ...p, page: 1 }));
  };
  const handleBannedRoleChange = (v: string) => {
    setBannedRoleFilter(v === 'all' ? '' : v);
    setBannedPagination((p) => ({ ...p, page: 1 }));
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setDirectionFilter('');
    setSeverityFilter('');
    setSearch('');
    setDebouncedSearch('');
    setReportsPagination((p) => ({ ...p, page: 1 }));
  };

  const hasActiveFilters = useMemo(() => {
    return !!statusFilter || !!directionFilter || !!severityFilter || !!debouncedSearch;
  }, [statusFilter, directionFilter, severityFilter, debouncedSearch]);

  // View report detail
  const handleViewReport = async (report: Report) => {
    setSelectedReport(report);
    setDrawerOpen(true);
    setDetailLoading(true);
    try {
      const full = await reportsService.getReportById(report.id);
      setSelectedReport(full);
    } catch {
      // Keep the list data if detail fetch fails
    } finally {
      setDetailLoading(false);
    }
  };

  // Review
  const handleReviewClick = (report: Report) => {
    setReviewOpen(true);
  };

  const handleReviewSuccess = async () => {
    setReviewOpen(false);
    setDrawerOpen(false);
    toast({ title: 'Refreshing data...' });
    // Refresh both reports and banned users
    await fetchReports();
    if (tab === 'banned') await fetchBannedUsers();
  };

  // Banned user detail
  const handleViewBannedUser = (user: BannedUser) => {
    setSelectedBannedUser(user);
    setBannedDrawerOpen(true);
  };

  // Summary card counts (from currently loaded data)
  const openCount = useMemo(() => reports.filter((r) => r.status === 'open').length, [reports]);
  const highCount = useMemo(() => reports.filter((r) => r.severity === 'high').length, [reports]);
  const criticalCount = useMemo(() => reports.filter((r) => r.severity === 'critically_high').length, [reports]);
  const bannedCount = bannedUsers.length;

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
            <Flag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Report Management</h2>
            <p className="text-sm text-slate-500">Review and manage user reports and bans</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={reportsLoading || bannedLoading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${reportsLoading || bannedLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard icon={Flag} label="Open Reports" value={openCount} color="amber" loading={reportsLoading} />
        <SummaryCard icon={AlertTriangle} label="High Severity" value={highCount} color="orange" loading={reportsLoading} />
        <SummaryCard icon={ShieldAlert} label="Critical Reports" value={criticalCount} color="red" loading={reportsLoading} />
        <SummaryCard icon={Ban} label="Banned Users" value={bannedCount} color="slate" loading={bannedLoading} />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="banned">Banned Users</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Reports Tab */}
      {tab === 'reports' && (
        <>
          {/* Filter Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email, or ID"
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

              {/* Status */}
              <Select value={statusFilter || 'all'} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Direction */}
              <Select value={directionFilter || 'all'} onValueChange={handleDirectionChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Directions</SelectItem>
                  {DIRECTION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Severity */}
              <Select value={severityFilter || 'all'} onValueChange={handleSeverityChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  {SEVERITY_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
          </div>

          {/* Error */}
          {reportsError && !reportsLoading && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p>{reportsError}</p>
                <button
                  onClick={() => fetchReports()}
                  className="mt-1 text-xs font-medium text-red-600 underline hover:text-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Table / Loading / Empty */}
          {reportsLoading ? (
            <SkeletonTable />
          ) : reportsError ? null : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Flag className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">
                {hasActiveFilters ? 'No reports match your filters' : 'No reports found'}
              </h4>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                {hasActiveFilters
                  ? 'Try adjusting or clearing your filters.'
                  : 'Reports submitted by callers and hosts will appear here.'}
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
                        <th className="px-4 py-3 text-left font-semibold">Reporter</th>
                        <th className="px-4 py-3 text-left font-semibold">Reported User</th>
                        <th className="px-4 py-3 text-left font-semibold">Direction</th>
                        <th className="px-4 py-3 text-left font-semibold">Reason</th>
                        <th className="px-4 py-3 text-left font-semibold">Severity</th>
                        <th className="px-4 py-3 text-left font-semibold">Level</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Created</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reports.map((report) => {
                        const reporter = getReporterInfo(report);
                        const reported = getReportedUser(report);
                        return (
                          <tr
                            key={report.id}
                            className="cursor-pointer transition-colors hover:bg-slate-50/70"
                            onClick={() => handleViewReport(report)}
                          >
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-900">{reporter.name}</p>
                              <p className="text-xs text-slate-400">{reporter.type}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-slate-900">{reported?.name ?? '—'}</p>
                              <p className="text-xs text-slate-400">{reported?.type ?? '—'}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600">
                              {getDirectionLabel(report.direction)}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600">
                              {getReasonLabel(report)}
                            </td>
                            <td className="px-4 py-3">
                              <SeverityBadge severity={report.severity} />
                            </td>
                            <td className="px-4 py-3 text-xs font-medium text-slate-700">
                              {report.severity_level}
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={report.status} />
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                              {formatDate(report.created_at)}
                            </td>
                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleViewReport(report)}
                                className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 lg:hidden">
                {reports.map((report) => {
                  const reporter = getReporterInfo(report);
                  const reported = getReportedUser(report);
                  return (
                    <div
                      key={report.id}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50/50"
                      onClick={() => handleViewReport(report)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="truncate font-medium text-slate-700">{reporter.name}</span>
                            <ArrowRight className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate font-medium text-slate-700">{reported?.name ?? '—'}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{getReasonLabel(report)}</p>
                        </div>
                        <div className="flex flex-shrink-0 flex-col items-end gap-1">
                          <SeverityBadge severity={report.severity} />
                          <StatusBadge status={report.status} />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{getDirectionLabel(report.direction)}</span>
                        <span>{formatDate(report.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <PaginationBar
                pagination={reportsPagination}
                onPageChange={(p) => setReportsPagination((prev) => ({ ...prev, page: p }))}
                onPageSizeChange={(l) => setReportsPagination((prev) => ({ ...prev, page: 1, limit: l }))}
              />
            </>
          )}
        </>
      )}

      {/* Banned Users Tab */}
      {tab === 'banned' && (
        <>
          {/* Filter Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-500">Filter by role:</span>
              <Select value={bannedRoleFilter || 'all'} onValueChange={handleBannedRoleChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="caller">Caller</SelectItem>
                  <SelectItem value="host">Host</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error */}
          {bannedError && !bannedLoading && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <div>
                <p>{bannedError}</p>
                <button
                  onClick={() => fetchBannedUsers()}
                  className="mt-1 text-xs font-medium text-red-600 underline hover:text-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Table / Loading / Empty */}
          {bannedLoading ? (
            <SkeletonTable />
          ) : bannedError ? null : bannedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Ban className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">No banned users</h4>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                There are currently no users with an active ban.
              </p>
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
                        <th className="px-4 py-3 text-left font-semibold">Email</th>
                        <th className="px-4 py-3 text-left font-semibold">Role</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Trigger Severity</th>
                        <th className="px-4 py-3 text-center font-semibold">Low</th>
                        <th className="px-4 py-3 text-center font-semibold">Med</th>
                        <th className="px-4 py-3 text-center font-semibold">High</th>
                        <th className="px-4 py-3 text-center font-semibold">Critical</th>
                        <th className="px-4 py-3 text-left font-semibold">Ban Message</th>
                        <th className="px-4 py-3 text-left font-semibold">Updated</th>
                        <th className="px-4 py-3 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bannedUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="cursor-pointer transition-colors hover:bg-slate-50/70"
                          onClick={() => handleViewBannedUser(user)}
                        >
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-slate-900">{user.name ?? '—'}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">{user.email ?? '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${user.role === 'host' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                              {user.role === 'host' ? 'Host' : 'Caller'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Banned
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.banned_by_severity ? (
                              <SeverityBadge severity={user.banned_by_severity} />
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center text-xs text-slate-600">{user.low_count}</td>
                          <td className="px-4 py-3 text-center text-xs text-slate-600">{user.medium_count}</td>
                          <td className="px-4 py-3 text-center text-xs text-slate-600">{user.high_count}</td>
                          <td className="px-4 py-3 text-center text-xs text-slate-600">{user.critically_high_count}</td>
                          <td className="px-4 py-3">
                            <p className="max-w-[200px] truncate text-xs text-slate-500">{user.ban_message ?? '—'}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{formatDate(user.updated_at)}</td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleViewBannedUser(user)}
                              className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 lg:hidden">
                {bannedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50/50"
                    onClick={() => handleViewBannedUser(user)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{user.name ?? '—'}</p>
                        <p className="truncate text-xs text-slate-400">{user.email ?? '—'}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${user.role === 'host' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                            {user.role === 'host' ? 'Host' : 'Caller'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Banned
                          </span>
                        </div>
                      </div>
                      {user.banned_by_severity && <SeverityBadge severity={user.banned_by_severity} />}
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <p className="text-slate-400">Low</p>
                        <p className="font-medium text-slate-600">{user.low_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Med</p>
                        <p className="font-medium text-slate-600">{user.medium_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">High</p>
                        <p className="font-medium text-slate-600">{user.high_count}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Critical</p>
                        <p className="font-medium text-slate-600">{user.critically_high_count}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Updated: {formatDate(user.updated_at)}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <PaginationBar
                pagination={bannedPagination}
                onPageChange={(p) => setBannedPagination((prev) => ({ ...prev, page: p }))}
                onPageSizeChange={(l) => setBannedPagination((prev) => ({ ...prev, page: 1, limit: l }))}
              />
            </>
          )}
        </>
      )}

      {/* Report Detail Drawer */}
      <ReportDetailDrawer
        report={selectedReport}
        open={drawerOpen}
        loading={detailLoading}
        onClose={() => setDrawerOpen(false)}
        onReview={(r) => handleReviewClick(r)}
      />

      {/* Review Modal */}
      <ReviewModal
        report={selectedReport}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSuccess={handleReviewSuccess}
      />

      {/* Banned User Detail Drawer */}
      <BannedUserDrawer
        user={selectedBannedUser}
        open={bannedDrawerOpen}
        onClose={() => setBannedDrawerOpen(false)}
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
  icon: typeof Flag;
  label: string;
  value: number;
  color: 'amber' | 'orange' | 'red' | 'slate';
  loading: boolean;
}) {
  const colorMap = {
    amber: 'bg-amber-100 text-amber-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    slate: 'bg-slate-100 text-slate-700',
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

function PaginationBar({
  pagination,
  onPageChange,
  onPageSizeChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}) {
  const { page, limit, total, totalPages } = pagination;
  if (total === 0) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages: (number | '...')[] = [];
  const maxVisible = 5;
  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
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
          disabled={page >= totalPages}
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
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 px-4 py-3.5 last:border-0"
        >
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
  );
}

/* ---------- Banned User Drawer ---------- */

function BannedUserDrawer({
  user,
  open,
  onClose,
}: {
  user: BannedUser | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            <h3 className="text-base font-semibold text-slate-900">Banned User Details</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* User header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Ban className="h-8 w-8" />
            </div>
            <h4 className="mt-3 text-lg font-bold text-slate-900">{user.name ?? 'Unknown'}</h4>
            <p className="text-sm text-slate-500">{user.email ?? '—'}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${user.role === 'host' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                {user.role === 'host' ? 'Host' : 'Caller'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Banned
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
            <BannedDetailRow label="User ID" value={<span className="font-mono text-xs">{user.user_id ?? user.host_id ?? user.id}</span>} />
            <BannedDetailRow label="Ban Status" value={user.is_banned ? 'Banned' : 'Not Banned'} />
            <BannedDetailRow
              label="Banned By Severity"
              value={user.banned_by_severity ? <SeverityBadge severity={user.banned_by_severity} /> : '—'}
            />
          </div>

          {/* Report Counts */}
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <p className="mb-3 text-xs font-medium text-slate-400">Report Counts (Backend Managed)</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-400">Low</p>
                <p className="text-lg font-bold text-slate-700">{user.low_count}</p>
              </div>
              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-400">Medium</p>
                <p className="text-lg font-bold text-slate-700">{user.medium_count}</p>
              </div>
              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-400">High</p>
                <p className="text-lg font-bold text-slate-700">{user.high_count}</p>
              </div>
              <div className="rounded-lg bg-white p-2">
                <p className="text-xs text-slate-400">Critical</p>
                <p className="text-lg font-bold text-slate-700">{user.critically_high_count}</p>
              </div>
            </div>
          </div>

          {/* Ban Message */}
          {user.ban_message && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <p className="mb-1 text-xs font-medium text-slate-400">Ban Message</p>
              <p className="text-sm text-slate-700">{user.ban_message}</p>
            </div>
          )}

          {/* Dates */}
          <div className="mt-4 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
            <BannedDetailRow label="Created" value={formatDateTime(user.created_at)} />
            <BannedDetailRow label="Last Updated" value={formatDateTime(user.updated_at)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BannedDetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-2.5">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
    </div>
  );
}
