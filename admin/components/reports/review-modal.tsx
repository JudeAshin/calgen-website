'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, Check, AlertTriangle, Ban } from 'lucide-react';
import { reportsService } from '@/admin/services/reports-service';
import { useToast } from '@/hooks/use-toast';
import {
  type Report,
  type ReviewReportRequest,
  getReasonLabel,
  getReportedUser,
  getReporterInfo,
  getSeverityLabel,
} from '@/admin/types/reports';
import { SeverityBadge, StatusBadge } from '@/admin/components/reports/badges';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type ReviewAction = 'resolved' | 'warned' | 'banned';

interface ReviewModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ACTIONS: { value: ReviewAction; label: string; description: string; icon: typeof Check; color: string }[] = [
  {
    value: 'resolved',
    label: 'Resolve',
    description: 'No violation found / report resolved.',
    icon: Check,
    color: 'emerald',
  },
  {
    value: 'warned',
    label: 'Warn',
    description: 'Send/record a warning and keep the account active.',
    icon: AlertTriangle,
    color: 'blue',
  },
  {
    value: 'banned',
    label: 'Ban',
    description: 'Ban the reported account. This is a destructive action.',
    icon: Ban,
    color: 'red',
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; ring: string }> = {
  emerald: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-500/30' },
  blue: { border: 'border-blue-300', bg: 'bg-blue-50', text: 'text-blue-700', ring: 'ring-blue-500/30' },
  red: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-500/30' },
};

export function ReviewModal({ report, open, onClose, onSuccess }: ReviewModalProps) {
  const { toast } = useToast();
  const [selectedAction, setSelectedAction] = useState<ReviewAction | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);

  if (!report) return null;

  const reporter = getReporterInfo(report);
  const reported = getReportedUser(report);

  const reset = () => {
    setSelectedAction(null);
    setAdminNote('');
    setShowBanConfirm(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (action: ReviewAction) => {
    setLoading(true);
    try {
      const payload: ReviewReportRequest = {
        status: action,
        admin_note: adminNote.trim() || undefined,
      };
      await reportsService.reviewReport(report.id, payload);
      toast({
        title: `Report ${action === 'resolved' ? 'resolved' : action === 'warned' ? 'warning issued' : 'user banned'} successfully`,
        description:
          action === 'banned'
            ? 'The backend has applied the ban and sent the appropriate notification email.'
            : action === 'warned'
              ? 'A warning has been recorded for this report.'
              : 'The report has been marked as resolved.',
      });
      reset();
      onSuccess();
    } catch (err) {
      toast({
        title: 'Review failed',
        description:
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: ReviewAction) => {
    setSelectedAction(action);
    if (action === 'banned') {
      setShowBanConfirm(true);
    } else {
      handleSubmit(action);
    }
  };

  const handleBanConfirm = () => {
    setShowBanConfirm(false);
    handleSubmit('banned');
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleClose();
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Report</DialogTitle>
          </DialogHeader>

          {/* Report Summary */}
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <StatusBadge status={report.status} />
                <SeverityBadge severity={report.severity} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-400">Reported User</p>
                  <p className="text-sm font-semibold text-slate-900">{reported?.name ?? '—'}</p>
                  <p className="text-xs text-slate-500">{reported?.type ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Reporter</p>
                  <p className="text-sm font-semibold text-slate-900">{reporter.name}</p>
                  <p className="text-xs text-slate-500">{reporter.type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Reason</p>
                  <p className="text-sm text-slate-700">{getReasonLabel(report)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-400">Severity</p>
                  <p className="text-sm text-slate-700">
                    {getSeverityLabel(report.severity)} (Level {report.severity_level})
                  </p>
                </div>
              </div>
              {report.description && (
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-xs font-medium text-slate-400">Description</p>
                  <p className="mt-0.5 text-sm text-slate-700">{report.description}</p>
                </div>
              )}
            </div>

            {/* Admin Note */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Admin Note</label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note about your decision..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-400">Optional. Will be stored with the review.</p>
            </div>

            {/* Actions */}
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Action</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {ACTIONS.map((action) => {
                  const Icon = action.icon;
                  const c = COLOR_MAP[action.color];
                  return (
                    <button
                      key={action.value}
                      onClick={() => handleActionClick(action.value)}
                      disabled={loading}
                      className={`flex flex-col items-start gap-1.5 rounded-xl border-2 p-3 text-left transition-all hover:${c.bg} disabled:opacity-60 ${
                        selectedAction === action.value
                          ? `${c.border} ${c.bg} ring-2 ${c.ring}`
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg} ${c.text}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className={`text-sm font-semibold ${c.text}`}>{action.label}</p>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-50 py-3 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Reviewing...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Ban Confirmation */}
      <AlertDialog open={showBanConfirm} onOpenChange={setShowBanConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-700">
              <Ban className="h-5 w-5" />
              Ban this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately ban the reported account. The backend will update the
              user&apos;s ban status and send the appropriate notification/email. This action
              should only be used when the report has been reviewed and a ban is justified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  Banning...
                </>
              ) : (
                'Confirm Ban'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
