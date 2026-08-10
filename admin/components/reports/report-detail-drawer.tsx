'use client';

import {
  X,
  Flag,
  ArrowRight,
  User,
  Mail,
  Hash,
  Calendar,
  FileText,
  AlertCircle,
  Gavel,
  Clock,
  UserCircle2,
} from 'lucide-react';
import {
  type Report,
  getDirectionLabel,
  getReasonLabel,
  getReporterInfo,
  getReportedUser,
  getSeverityLabel,
  getStatusLabel,
} from '@/admin/types/reports';
import { SeverityBadge, StatusBadge } from '@/admin/components/reports/badges';

interface ReportDetailDrawerProps {
  report: Report | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onReview: (report: Report) => void;
}

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

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800">{value || '—'}</p>
      </div>
    </div>
  );
}

export function ReportDetailDrawer({ report, open, loading, onClose, onReview }: ReportDetailDrawerProps) {
  if (!report && !loading) return null;

  const reporter = report ? getReporterInfo(report) : null;
  const reported = report ? getReportedUser(report) : null;
  const isOpen = report?.status === 'open';

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-900">Report Details</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-500" />
          </div>
        ) : report ? (
          <>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* Status & Severity */}
              <div className="mb-5 flex items-center gap-2">
                <StatusBadge status={report.status} />
                <SeverityBadge severity={report.severity} />
                <span className="text-xs text-slate-400">Level {report.severity_level}</span>
              </div>

              {/* Who reported whom */}
              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-slate-400">Reporter</p>
                    <p className="text-sm font-semibold text-slate-900">{reporter?.name ?? '—'}</p>
                    <p className="text-xs text-slate-500">{reporter?.type ?? '—'}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-300" />
                  <div className="flex-1 text-center">
                    <p className="text-xs text-slate-400">Reported</p>
                    <p className="text-sm font-semibold text-slate-900">{reported?.name ?? '—'}</p>
                    <p className="text-xs text-slate-500">{reported?.type ?? '—'}</p>
                  </div>
                </div>
              </div>

              {/* Report Info */}
              <div className="mb-1 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
                <DetailRow icon={Hash} label="Report ID" value={<span className="font-mono text-xs">{report.id}</span>} />
                <DetailRow icon={Calendar} label="Created" value={formatDateTime(report.created_at)} />
                <DetailRow icon={ArrowRight} label="Direction" value={getDirectionLabel(report.direction)} />
                <DetailRow icon={Flag} label="Reason" value={getReasonLabel(report)} />
                <DetailRow icon={AlertCircle} label="Severity" value={getSeverityLabel(report.severity)} />
                <DetailRow icon={Hash} label="Severity Level" value={String(report.severity_level)} />
              </div>

              {/* Description */}
              {report.description && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <p className="text-xs font-medium text-slate-400">Description</p>
                  </div>
                  <p className="text-sm text-slate-700">{report.description}</p>
                </div>
              )}

              {/* Reporter Info */}
              <div className="mb-1 mt-4 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
                <div className="py-2.5">
                  <div className="mb-2 flex items-center gap-2">
                    <UserCircle2 className="h-4 w-4 text-slate-400" />
                    <p className="text-xs font-medium text-slate-400">Reporter</p>
                  </div>
                  <div className="grid grid-cols-1 gap-1 pl-6">
                    <p className="text-sm font-medium text-slate-800">{reporter?.name ?? '—'}</p>
                    <p className="text-xs text-slate-500">{reporter?.email ?? '—'}</p>
                    <p className="text-xs text-slate-400">Type: {reporter?.type ?? '—'}</p>
                  </div>
                </div>
              </div>

              {/* Reported User Info */}
              {reported && (
                <div className="mb-1 mt-4 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
                  <div className="py-2.5">
                    <div className="mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <p className="text-xs font-medium text-slate-400">Reported User</p>
                    </div>
                    <div className="grid grid-cols-1 gap-1 pl-6">
                      <p className="text-sm font-medium text-slate-800">{reported.name}</p>
                      <p className="text-xs text-slate-500">{reported.email}</p>
                      <p className="text-xs text-slate-400">Type: {reported.type}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Review Info */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-slate-400" />
                  <p className="text-xs font-medium text-slate-400">Admin Review</p>
                </div>
                {report.status === 'open' ? (
                  <p className="text-sm font-medium text-amber-600">Awaiting Admin Review</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Status:</span>
                      <StatusBadge status={report.status} />
                    </div>
                    {report.admin_note && (
                      <div>
                        <p className="text-xs text-slate-400">Admin Note</p>
                        <p className="text-sm text-slate-700">{report.admin_note}</p>
                      </div>
                    )}
                    {report.reviewed_by && (
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">Reviewed by:</span>
                        <span className="text-xs font-medium text-slate-600">{report.reviewed_by}</span>
                      </div>
                    )}
                    {report.reviewed_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400">Reviewed at:</span>
                        <span className="text-xs font-medium text-slate-600">{formatDateTime(report.reviewed_at)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {isOpen && (
              <div className="border-t border-slate-200 px-5 py-4">
                <button
                  onClick={() => onReview(report)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <Gavel className="h-4 w-4" />
                  Review Report
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
