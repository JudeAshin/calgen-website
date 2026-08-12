'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { kycService } from '@/admin/services/kyc-service';
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type ActionType = 'verify-bank' | 'reject-bank' | 'verify-kyc' | 'reject-kyc';

interface KycActionDialogProps {
  id: string;
  action: ActionType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CONFIG: Record<ActionType, { title: string; message: string; success: string; reject: boolean; button: string }> = {
  'verify-bank': { title: 'Verify bank account?', message: 'Confirm that the bank account information has been reviewed and is correct.', success: 'Bank account verified successfully.', reject: false, button: 'Verify Bank Account' },
  'reject-bank': { title: 'Reject bank account', message: 'Provide a reason for rejecting these bank details.', success: 'Bank account rejected.', reject: true, button: 'Reject Bank Account' },
  'verify-kyc': { title: 'Verify KYC?', message: 'Confirm that the PAN, government ID, document name and selfie have been reviewed and verified.', success: 'KYC verified successfully.', reject: false, button: 'Verify KYC' },
  'reject-kyc': { title: 'Reject KYC', message: 'Provide a reason for rejecting these identity documents.', success: 'KYC rejected.', reject: true, button: 'Reject KYC' },
};

export function KycActionDialog({ id, action, onClose, onSuccess }: KycActionDialogProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const config = action ? CONFIG[action] : null;

  useEffect(() => {
    if (!action) setReason('');
  }, [action]);

  if (!config || !action) return null;

  const submit = async () => {
    if (config.reject && !reason.trim()) return;
    setSubmitting(true);
    try {
      if (action === 'verify-bank') await kycService.verifyBank(id);
      if (action === 'reject-bank') await kycService.rejectBank(id, { reason: reason.trim() });
      if (action === 'verify-kyc') await kycService.reviewDocuments(id, {
        status: 'verified',
        name_matches: true,
      });
      if (action === 'reject-kyc') await kycService.reviewDocuments(id, {
        status: 'rejected',
        name_matches: false,
        rejection_reason: reason,
      });
      toast({ title: config.success });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Action could not be completed',
        description: error && typeof error === 'object' && 'message' in error ? String((error as { message: string }).message) : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (config.reject) {
    return (
      <Dialog open={Boolean(action)} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DialogHeader><DialogTitle>{config.title}</DialogTitle></DialogHeader>
          <p className="text-sm text-slate-500">{config.message}</p>
          <div>
            <label htmlFor="kyc-rejection-reason" className="mb-1.5 block text-sm font-medium text-slate-700">Rejection reason <span className="text-red-500">*</span></label>
            <Textarea id="kyc-rejection-reason" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this submission is being rejected..." rows={4} disabled={submitting} />
          </div>
          <DialogFooter>
            <button onClick={onClose} disabled={submitting} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={submit} disabled={!reason.trim() || submitting} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : config.button}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AlertDialog open={Boolean(action)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>{config.title}</AlertDialogTitle><AlertDialogDescription>{config.message}</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={submit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">{submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Confirming...</> : config.button}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
