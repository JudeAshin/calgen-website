'use client';

import { KycDetailContent } from '@/admin/components/kyc/kyc-detail-content';

interface KycDetailModalProps {
  id: string;
  onClose: () => void;
}

export function KycDetailModal({ id, onClose }: KycDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="KYC submission details"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto max-w-5xl rounded-2xl bg-slate-50 p-4 shadow-xl sm:p-6">
        <KycDetailContent id={id} onClose={onClose} />
      </div>
    </div>
  );
}