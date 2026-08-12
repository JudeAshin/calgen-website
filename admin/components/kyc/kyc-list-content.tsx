'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { BadgeCheck, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Search, Users, X, XCircle } from 'lucide-react';
import { useAdminAuth } from '@/admin/hooks/use-auth';
import { kycService } from '@/admin/services/kyc-service';
import type { KycListItem, KycListParams, KycPagination, KycSummary } from '@/admin/types/kyc';
import { getDocumentTypeLabel } from '@/admin/types/kyc';
import { KycStatusBadge } from '@/admin/components/kyc/kyc-badges';
import { KycDetailModal } from '@/admin/components/kyc/kyc-detail-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PAGE_SIZES = [20, 50, 100];

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name?: string): string {
  return (name ?? '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

function StatCard({ icon: Icon, label, description, value, tone, onClick, loading }: { icon: typeof Users; label: string; description: string; value: number; tone: string; onClick: () => void; loading: boolean }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
        <span className="text-xs font-medium text-slate-400">View filtered</span>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      {loading ? <div className="mt-1 h-8 w-16 animate-pulse rounded bg-slate-200" /> : <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>}
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </button>
  );
}

export function KycListContent() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<KycListItem[]>([]);
  const [summary, setSummary] = useState<KycSummary>({});
  const [pagination, setPagination] = useState<KycPagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [status, setStatus] = useState('');
  const [bankStatus, setBankStatus] = useState('');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setStatus(searchParams.get('status') ?? '');
    setBankStatus(searchParams.get('bank_status') ?? '');
    setSearch(searchParams.get('search') ?? '');
    setFromDate(searchParams.get('from_date') ?? '');
    setToDate(searchParams.get('to_date') ?? '');
    setSelectedId(searchParams.get('kyc_id'));
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '20');
    setPagination((previous) => ({ ...previous, page: Number.isFinite(page) && page > 0 ? page : 1, limit: PAGE_SIZES.includes(limit) ? limit : 20 }));
  }, [searchParams]);

  const params = useMemo<KycListParams>(() => ({
    ...(status ? { status } : {}),
    ...(bankStatus ? { bank_status: bankStatus } : {}),
    ...(search ? { search } : {}),
    ...(fromDate ? { from_date: fromDate } : {}),
    ...(toDate ? { to_date: toDate } : {}),
    page: pagination.page,
    limit: pagination.limit,
  }), [status, bankStatus, search, fromDate, toDate, pagination.page, pagination.limit]);

  const updateUrl = useCallback((next: KycListParams) => {
    const query = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)); });
    // preserve the open modal (kyc_id) across filter/pagination updates
    const currentKycId = searchParams.get('kyc_id');
    if (currentKycId) query.set('kyc_id', currentKycId);
    const nextQuery = query.toString();
    if (searchParams.toString() !== nextQuery) {
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ''}`, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const response = await kycService.getKycList(params);
      setItems(response.data ?? []);
      setSummary(response.summary ?? {});
      setPagination(response.pagination ?? { page: 1, limit: params.limit ?? 20, total: 0, totalPages: 0 });
    } catch (requestError) {
      setError(requestError && typeof requestError === 'object' && 'message' in requestError ? String((requestError as { message: string }).message) : 'Unable to load KYC submissions.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, params]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    updateUrl(params);
    load();
  }, [authLoading, isAuthenticated, load, params, updateUrl]);

  const clearFilters = () => {
    setStatus(''); setBankStatus(''); setSearch(''); setFromDate(''); setToDate('');
    setPagination((previous) => ({ ...previous, page: 1 }));
  };
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value === 'all' ? '' : value); setPagination((previous) => ({ ...previous, page: 1 })); };

  const openDetail = (id: string) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set('kyc_id', id);
    router.push(`${pathname}?${query.toString()}`, { scroll: false });
  };

  const closeDetail = () => {
    const query = new URLSearchParams(searchParams.toString());
    query.delete('kyc_id');
    const qs = query.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const totalPages = pagination.totalPages ?? pagination.total_pages ?? 0;
  const activeFilters = Boolean(status || bankStatus || search || fromDate || toDate);
  const pending = summary.pending_review ?? items.filter((item) => item.status === 'pending_review').length;
  const verified = summary.verified ?? items.filter((item) => item.status === 'verified').length;
  const rejected = summary.rejected ?? items.filter((item) => item.status === 'rejected').length;

  if (authLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><BadgeCheck className="h-5 w-5" /></div><div><h2 className="text-xl font-bold text-slate-900">Host KYC Verification</h2><p className="text-sm text-slate-500">Review host identity documents and bank account information before enabling withdrawals.</p></div></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total" description="All KYC submissions" value={summary.total ?? pagination.total} tone="bg-slate-100 text-slate-700" onClick={() => { clearFilters(); }} loading={loading} />
        <StatCard icon={Clock3} label="Pending Review" description="Identity verification pending" value={pending} tone="bg-amber-100 text-amber-700" onClick={() => { setStatus('pending_review'); setPagination((previous) => ({ ...previous, page: 1 })); }} loading={loading} />
        <StatCard icon={CheckCircle2} label="Verified" description="Identity verification complete" value={verified} tone="bg-emerald-100 text-emerald-700" onClick={() => { setStatus('verified'); setPagination((previous) => ({ ...previous, page: 1 })); }} loading={loading} />
        <StatCard icon={XCircle} label="Rejected" description="Needs correction or resubmission" value={rejected} tone="bg-red-100 text-red-700" onClick={() => { setStatus('rejected'); setPagination((previous) => ({ ...previous, page: 1 })); }} loading={loading} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPagination((previous) => ({ ...previous, page: 1 })); }} placeholder="Search host, username, email, or KYC ID" className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20" /></div>
          <Select value={status || 'all'} onValueChange={(value) => changeFilter(setStatus, value)}><SelectTrigger className="w-[155px]"><SelectValue placeholder="KYC Status" /></SelectTrigger><SelectContent><SelectItem value="all">All KYC Status</SelectItem><SelectItem value="pending_review">Pending Review</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select>
          <Select value={bankStatus || 'all'} onValueChange={(value) => changeFilter(setBankStatus, value)}><SelectTrigger className="w-[160px]"><SelectValue placeholder="Bank Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Bank Status</SelectItem><SelectItem value="pending_review">Pending Review</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select>
          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-slate-400" /><input type="date" value={fromDate} onChange={(event) => { setFromDate(event.target.value); setPagination((previous) => ({ ...previous, page: 1 })); }} className="rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none" /><span className="text-xs text-slate-400">to</span><input type="date" value={toDate} onChange={(event) => { setToDate(event.target.value); setPagination((previous) => ({ ...previous, page: 1 })); }} className="rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-600 focus:border-emerald-500 focus:outline-none" /></div>
          {activeFilters && <button onClick={clearFilters} className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"><X className="h-4 w-4" />Reset Filters</button>}
        </div>
      </div>

      {error && !loading && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error} <button onClick={load} className="ml-2 font-medium underline">Retry</button></div>}
      {loading ? <KycTableSkeleton /> : error ? null : items.length === 0 ? <EmptyState activeFilters={activeFilters} onClear={clearFilters} /> : <>
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 text-left">Host</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">KYC Status</th><th className="px-4 py-3 text-left">Bank Status</th><th className="px-4 py-3 text-left">Document</th><th className="px-4 py-3 text-left">Submitted</th><th className="px-4 py-3 text-left">Account Holder</th><th className="px-4 py-3 text-left">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map((item) => <KycRow key={item.id} item={item} onSelect={openDetail} />)}</tbody></table></div></div>
        <div className="space-y-3 lg:hidden">{items.map((item) => <KycCard key={item.id} item={item} onSelect={openDetail} />)}</div>
        <Pagination pagination={pagination} onPageChange={(page) => setPagination((previous) => ({ ...previous, page }))} onLimitChange={(limit) => setPagination((previous) => ({ ...previous, page: 1, limit }))} />
      </>}

      {selectedId && <KycDetailModal id={selectedId} onClose={closeDetail} />}
    </div>
  );
}

function KycRow({ item, onSelect }: { item: KycListItem; onSelect: (id: string) => void }) {
  return <tr className="cursor-pointer transition-colors hover:bg-slate-50/70" onClick={() => onSelect(item.id)}><td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar className="h-9 w-9"><AvatarImage src={item.host.photo_url ?? undefined} alt={item.host.name ?? 'Host'} /><AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700">{getInitials(item.host.name)}</AvatarFallback></Avatar><div><p className="font-medium text-slate-900">{item.host.name ?? 'Unknown host'}</p><p className="text-xs text-slate-400">{item.host.username ? `@${item.host.username}` : 'Username unavailable'}</p></div></div></td><td className="px-4 py-3 text-xs text-slate-600">{item.host.email ?? '—'}</td><td className="px-4 py-3"><KycStatusBadge status={item.status} /></td><td className="px-4 py-3"><KycStatusBadge status={item.bank?.verification_status} /></td><td className="px-4 py-3 text-xs text-slate-600">{getDocumentTypeLabel(item.document_type)}</td><td className="px-4 py-3 text-xs text-slate-500">{formatDate(item.created_at)}</td><td className="px-4 py-3 text-xs text-slate-600">{item.bank?.account_holder_name ?? '—'}</td><td className="px-4 py-3"><button onClick={(event) => { event.stopPropagation(); onSelect(item.id); }} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">View</button></td></tr>;
}

function KycCard({ item, onSelect }: { item: KycListItem; onSelect: (id: string) => void }) {
  return <button onClick={() => onSelect(item.id)} className="block w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><Avatar className="h-10 w-10"><AvatarImage src={item.host.photo_url ?? undefined} alt={item.host.name ?? 'Host'} /><AvatarFallback className="bg-emerald-100 text-xs font-semibold text-emerald-700">{getInitials(item.host.name)}</AvatarFallback></Avatar><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{item.host.name ?? 'Unknown host'}</p><p className="truncate text-xs text-slate-400">{item.host.username ? `@${item.host.username}` : 'Username unavailable'}</p></div></div><KycStatusBadge status={item.status} /></div><div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs"><div><p className="text-slate-400">Bank</p><KycStatusBadge status={item.bank?.verification_status} /></div><div><p className="text-slate-400">Submitted</p><p className="mt-1 text-slate-600">{formatDate(item.created_at)}</p></div></div></button>;
}

function EmptyState({ activeFilters, onClear }: { activeFilters: boolean; onClear: () => void }) {
  return <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><BadgeCheck className="h-6 w-6" /></div><h3 className="text-sm font-semibold text-slate-700">{activeFilters ? 'No KYC submissions match your filters' : 'No KYC submissions found'}</h3><p className="mt-1 text-xs text-slate-400">{activeFilters ? 'Try adjusting your filters.' : 'Host verification submissions will appear here.'}</p>{activeFilters && <button onClick={onClear} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Reset Filters</button>}</div>;
}

function Pagination({ pagination, onPageChange, onLimitChange }: { pagination: KycPagination; onPageChange: (page: number) => void; onLimitChange: (limit: number) => void }) {
  if (!pagination.total) return null;
  const totalPages = pagination.totalPages ?? pagination.total_pages ?? 0;
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);
  return <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">Showing <b className="text-slate-700">{start}–{end}</b> of <b className="text-slate-700">{pagination.total.toLocaleString()}</b></p><div className="flex items-center gap-1"><Select value={String(pagination.limit)} onValueChange={(value) => onLimitChange(Number(value))}><SelectTrigger className="mr-2 h-8 w-[76px] text-xs"><SelectValue /></SelectTrigger><SelectContent>{PAGE_SIZES.map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select><button onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="px-2 text-xs text-slate-500">Page {pagination.page} of {Math.max(totalPages, 1)}</span><button onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= totalPages} className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></div>;
}

function KycTableSkeleton() {
  return <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">{Array.from({ length: 7 }).map((_, index) => <div key={index} className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"><div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" /><div className="flex-1 space-y-2"><div className="h-3.5 w-32 animate-pulse rounded bg-slate-200" /><div className="h-3 w-24 animate-pulse rounded bg-slate-100" /></div><div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" /><div className="hidden h-6 w-24 animate-pulse rounded-full bg-slate-100 sm:block" /></div>)}</div>;
}