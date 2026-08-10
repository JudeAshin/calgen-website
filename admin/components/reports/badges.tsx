import {
    type Report,
    type ReportSeverity,
    type ReportStatus,
    getSeverityLabel,
    getStatusLabel,
  } from '@/admin/types/reports';
  
  export function StatusBadge({ status }: { status: ReportStatus }) {
    const styles: Record<string, string> = {
      open: 'border-amber-200 bg-amber-50 text-amber-700',
      warned: 'border-blue-200 bg-blue-50 text-blue-700',
      banned: 'border-red-200 bg-red-50 text-red-700',
      resolved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };
    const dots: Record<string, string> = {
      open: 'bg-amber-500',
      warned: 'bg-blue-500',
      banned: 'bg-red-500',
      resolved: 'bg-emerald-500',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[status] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dots[status] ?? 'bg-slate-400'}`} />
        {getStatusLabel(status)}
      </span>
    );
  }
  
  export function SeverityBadge({ severity }: { severity: ReportSeverity }) {
    const styles: Record<string, string> = {
      low: 'border-slate-200 bg-slate-100 text-slate-600',
      medium: 'border-blue-200 bg-blue-50 text-blue-700',
      high: 'border-orange-200 bg-orange-50 text-orange-700',
      critically_high: 'border-red-200 bg-red-50 text-red-700',
    };
    const dots: Record<string, string> = {
      low: 'bg-slate-400',
      medium: 'bg-blue-500',
      high: 'bg-orange-500',
      critically_high: 'bg-red-500',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${styles[severity] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dots[severity] ?? 'bg-slate-400'}`} />
        {getSeverityLabel(severity)}
      </span>
    );
  }
  