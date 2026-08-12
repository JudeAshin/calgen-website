import { CheckCircle2, Clock3, XCircle } from 'lucide-react';
import type { KycStatus } from '@/admin/types/kyc';
import { getKycStatusLabel } from '@/admin/types/kyc';

export function KycStatusBadge({ status }: { status?: string | null }) {
  const styles: Record<string, string> = {
    pending_review: 'border-amber-200 bg-amber-50 text-amber-700',
    verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-red-200 bg-red-50 text-red-700',
  };
  const icons: Record<string, typeof Clock3> = {
    pending_review: Clock3,
    verified: CheckCircle2,
    rejected: XCircle,
  };
  const Icon = icons[status ?? ''] ?? Clock3;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status ?? ''] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`}>
      <Icon className="h-3.5 w-3.5" />
      {getKycStatusLabel(status)}
    </span>
  );
}

export function KycStatusDot({ status }: { status: KycStatus | string | null | undefined }) {
  const color = status === 'verified' ? 'bg-emerald-500' : status === 'rejected' ? 'bg-red-500' : 'bg-amber-500';
  return <span className={`h-2 w-2 rounded-full ${color}`} />;
}
