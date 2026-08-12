'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { X, BadgeCheck, Banknote, Check, CheckCircle2, ClipboardCheck, FileCheck2, Mail, Phone, ShieldAlert, UserRound } from 'lucide-react';
import { useAdminAuth } from '@/admin/hooks/use-auth';
import { kycService } from '@/admin/services/kyc-service';
import type { KycBank, KycHost, KycRecord } from '@/admin/types/kyc';
import { getDocumentTypeLabel } from '@/admin/types/kyc';
import { KycStatusBadge } from '@/admin/components/kyc/kyc-badges';
import { DocumentViewer } from '@/admin/components/kyc/document-viewer';
import { KycActionDialog } from '@/admin/components/kyc/kyc-action-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ActionType = 'verify-bank' | 'reject-bank' | 'verify-kyc' | 'reject-kyc';

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatDateTime(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${formatDate(value)} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
}
function initials(name?: string): string { return (name ?? '?').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(); }

interface KycDetailContentProps {
  id: string;
  onClose: () => void;
}

export function KycDetailContent({ id, onClose }: KycDetailContentProps) {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const [kyc, setKyc] = useState<KycRecord | null>(null);
  const [host, setHost] = useState<KycHost | null>(null);
  const [bank, setBank] = useState<KycBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<ActionType | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    if (!isAuthenticated || !id) return;
    setLoading(true); setError(null);
    try {
      const response = await kycService.getKycById(id);
      setKyc(response.data.kyc);
      setHost(response.data.host);
      setBank(response.data.bank ?? response.data.kyc.bank ?? null);
    } catch (requestError) {
      setError(requestError && typeof requestError === 'object' && 'message' in requestError ? String((requestError as { message: string }).message) : 'Unable to load this KYC submission.');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => { if (!authLoading) load(); }, [authLoading, load]);

  const identityStatus = kyc?.status;
  const bankStatus = bank?.verification_status;
  const bankChanged = Boolean(kyc?.bank_details_changed) && bankStatus === 'pending_review';
  const toggleCheck = (key: string) => setChecks((current) => ({ ...current, [key]: !current[key] }));

  if (authLoading || loading) return <DetailSkeleton onClose={onClose} />;
  if (error || !kyc || !host) {
    return (
      <div className="space-y-4">
        <button onClick={onClose} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <X className="h-4 w-4" />
          Close
        </button>
        <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">
          {error ?? 'KYC submission not found.'}
          <button onClick={load} className="ml-2 font-medium underline">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={onClose} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <X className="h-4 w-4" />
          Close
        </button>
        <p className="font-mono text-xs text-slate-400">KYC ID: {kyc.id}</p>
      </div>

      <HostInfoCard host={host} kyc={kyc} />
      {bankChanged && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Bank Details Changed – Re-verification Required</p>
            <p className="mt-1 text-xs text-amber-700">The host updated their bank details after identity verification. Review the new bank information without requesting identity documents again.</p>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-slate-500" />
          <div>
            <h2 className="text-base font-semibold text-slate-900">Verification Progress</h2>
            <p className="text-xs text-slate-500">Identity and bank verification are independent.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ProgressItem label="Identity Documents" status={identityStatus} />
          <ProgressItem label="Bank Account" status={bankStatus} />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <IdentitySection kyc={kyc} />
          <BankSection bank={bank} />
          <Checklist checks={checks} onToggle={toggleCheck} />
        </div>
        <aside className="h-fit xl:sticky xl:top-5">
          <ActionPanel kyc={kyc} bank={bank} onAction={setAction} />
        </aside>
      </div>

      <KycActionDialog id={kyc.id} action={action} onClose={() => setAction(null)} onSuccess={load} />
    </div>
  );
}

function HostInfoCard({ host, kyc }: { host: KycHost; kyc: KycRecord }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><Avatar className="h-20 w-20 border-2 border-slate-200"><AvatarImage src={host.photo_url ?? undefined} alt={host.name ?? 'Host'} /><AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700">{initials(host.name)}</AvatarFallback></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold text-slate-900">{host.name ?? 'Unknown host'}</h1><span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">Host</span></div><p className="mt-1 text-sm text-slate-500">{host.username ? `@${host.username}` : 'Username unavailable'}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{host.email ?? '—'}</span><span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{host.phone ?? '—'}</span><span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" />Host ID: {host.id}</span></div></div><div className="text-left sm:text-right"><p className="text-xs text-slate-400">Registered</p><p className="text-sm font-medium text-slate-700">{formatDate(host.created_at)}</p><div className="mt-2"><KycStatusBadge status={kyc.status} /></div></div></div></section>;
}

function ProgressItem({ label, status }: { label: string; status?: string | null }) {
  const verified = status === 'verified'; const rejected = status === 'rejected';
  return <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${verified ? 'border-emerald-200 bg-emerald-50/60' : rejected ? 'border-red-200 bg-red-50/60' : 'border-amber-200 bg-amber-50/60'}`}><div className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full ${verified ? 'bg-emerald-100 text-emerald-700' : rejected ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{verified ? <Check className="h-4 w-4" /> : rejected ? <X className="h-4 w-4" /> : <span className="text-xs font-bold">!</span>}</div><span className="text-sm font-semibold text-slate-800">{label}</span></div><KycStatusBadge status={status} /></div>;
}

function IdentitySection({ kyc }: { kyc: KycRecord }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><FileCheck2 className="h-5 w-5 text-slate-500" /><div><h2 className="text-base font-semibold text-slate-900">Identity Documents</h2><p className="text-xs text-slate-500">Review the PAN, government ID, and selfie together.</p></div></div><div className="grid gap-3 sm:grid-cols-2"><Info label="PAN Number" value={kyc.pan_number} mono /><Info label="PAN Status" value={kyc.pan_status ? <KycStatusBadge status={kyc.pan_status} /> : 'Included in KYC review'} /><Info label="Document Type" value={getDocumentTypeLabel(kyc.document_type)} /><Info label="Document Number" value={kyc.document_number} mono /></div><div className="mt-5 grid gap-4 md:grid-cols-3"><DocumentViewer label={`${getDocumentTypeLabel(kyc.document_type)} Front`} url={kyc.document_front_url} alt="Government ID front" /><DocumentViewer label={`${getDocumentTypeLabel(kyc.document_type)} Back`} url={kyc.document_back_url} alt="Government ID back" /><DocumentViewer label="Selfie" url={kyc.selfie_url} alt="Submitted host selfie" /></div></section>;
}

function BankSection({ bank }: { bank: KycBank | null }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Banknote className="h-5 w-5 text-slate-500" /><div><h2 className="text-base font-semibold text-slate-900">Bank Account Verification</h2><p className="text-xs text-slate-500">Review independently from identity documents.</p></div></div><KycStatusBadge status={bank?.verification_status} /></div>{bank ? <div className="grid gap-3 sm:grid-cols-2"><Info label="Account Holder Name" value={bank.account_holder_name} /><Info label="Account Number" value={bank.account_number} mono /><Info label="IFSC Code" value={bank.ifsc_code} mono /><Info label="Bank Name" value={bank.bank_name} /><Info label="Last Updated" value={formatDateTime(bank.updated_at)} />{bank.rejection_reason && <Info label="Rejection Reason" value={bank.rejection_reason} />}</div> : <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">Bank information is not available.</div>}</section>;
}

function Info({ label, value, mono = false }: { label: string; value?: ReactNode; mono?: boolean }) {
  return <div className="rounded-lg bg-slate-50 px-3 py-2.5"><p className="text-xs font-medium text-slate-400">{label}</p><p className={`mt-1 text-sm font-medium text-slate-800 ${mono ? 'font-mono' : ''}`}>{value || '—'}</p></div>;
}

function Checklist({ checks, onToggle }: { checks: Record<string, boolean>; onToggle: (key: string) => void }) {
  const groups = [{ label: 'Identity Review', items: [['pan', 'PAN reviewed'], ['id', 'Government ID reviewed'], ['name', 'Name matches'], ['selfie', 'Selfie reviewed']] }, { label: 'Bank Review', items: [['holder', 'Account holder name checked'], ['account', 'Account number checked'], ['ifsc', 'IFSC checked'], ['bank', 'Bank information checked']] }];
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-slate-500" /><div><h2 className="text-base font-semibold text-slate-900">Review Checklist</h2><p className="text-xs text-slate-500">A workflow aid; the backend remains authoritative.</p></div></div><div className="grid gap-5 sm:grid-cols-2">{groups.map((group) => <div key={group.label}><p className="mb-2 text-sm font-semibold text-slate-700">{group.label}</p><div className="space-y-2">{group.items.map(([key, label]) => <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={Boolean(checks[key])} onChange={() => onToggle(key)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />{label}</label>)}</div></div>)}</div></section>;
}

function ActionPanel({ kyc, bank, onAction }: { kyc: KycRecord; bank: KycBank | null; onAction: (action: ActionType) => void }) {
  const canReviewKyc = kyc.status === 'pending_review' || kyc.status === 'rejected';
  const canReviewBank = bank?.verification_status === 'pending_review' || bank?.verification_status === 'rejected';
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-base font-semibold text-slate-900">Verification Actions</h2><p className="mt-1 text-xs text-slate-500">Only the selected verification area will be changed.</p><div className="mt-4 space-y-4"><div className="rounded-lg border border-slate-100 p-3"><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold text-slate-700">Bank Account</span><KycStatusBadge status={bank?.verification_status} /></div>{canReviewBank ? <div className="grid gap-2"><button onClick={() => onAction('verify-bank')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Verify Bank Account</button><button onClick={() => onAction('reject-bank')} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Reject Bank Account</button></div> : <p className="text-xs text-slate-500">No bank action is required.</p>}</div><div className="rounded-lg border border-slate-100 p-3"><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold text-slate-700">Identity Documents</span><KycStatusBadge status={kyc.status} /></div>{canReviewKyc ? <div className="grid gap-2"><button onClick={() => onAction('verify-kyc')} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Verify KYC</button><button onClick={() => onAction('reject-kyc')} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Reject KYC</button></div> : <p className="text-xs text-slate-500">Identity documents are already verified.</p>}</div></div></div>;
}

function DetailSkeleton({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5">
      <button onClick={onClose} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
        <X className="h-4 w-4" />
        Close
      </button>
      <div className="h-36 animate-pulse rounded-xl bg-white" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl bg-white" />
        <div className="h-64 animate-pulse rounded-xl bg-white" />
      </div>
    </div>
  );
}