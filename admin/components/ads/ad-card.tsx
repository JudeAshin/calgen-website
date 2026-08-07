'use client';

import { Loader2, Power, Trash2, Calendar, ExternalLink, Tag } from 'lucide-react';
import { useState } from 'react';
import type { Advertisement, AdStatus } from '@/admin/types/ads';

interface AdCardProps {
  ad: Advertisement;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function getAdStatus(ad: Advertisement): AdStatus {
  if (ad.status) return ad.status;
  if (ad.is_active === false) return 'inactive';
  if (ad.end_date) {
    const endDate = new Date(ad.end_date);
    if (endDate.getTime() < Date.now()) return 'expired';
  }
  return 'active';
}

function StatusBadge({ status }: { status: AdStatus }) {
  const styles: Record<AdStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    expired: 'bg-red-50 text-red-600 border-red-200',
  };
  const dotColor: Record<AdStatus, string> = {
    active: 'bg-emerald-500',
    inactive: 'bg-slate-400',
    expired: 'bg-red-500',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AdCard({ ad, onToggle, onDelete }: AdCardProps) {
  const [toggling, setToggling] = useState(false);

  const status = getAdStatus(ad);
  const isActive = status === 'active';

  const handleToggle = () => {
    setToggling(true);
    onToggle(ad.id);
    setToggling(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {ad.image && (
        <div className="relative h-32 w-full overflow-hidden bg-slate-100">
          <img
            src={ad.image}
            alt={ad.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{ad.title}</h3>
          <StatusBadge status={status} />
        </div>

        {ad.description && (
          <p className="line-clamp-2 text-xs text-slate-500">{ad.description}</p>
        )}

        <div className="space-y-1.5 text-xs text-slate-500">
          {ad.campaign_type && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3 w-3 text-slate-400" />
              <span>{ad.campaign_type}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>
              {formatDate(ad.start_date)} — {formatDate(ad.end_date)}
            </span>
          </div>
          {ad.priority !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">Priority:</span>
              <span>{ad.priority}</span>
            </div>
          )}
          {ad.redirect_url && (
            <div className="flex items-center gap-1.5 truncate">
              <ExternalLink className="h-3 w-3 flex-shrink-0 text-slate-400" />
              <span className="truncate">{ad.redirect_url}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-60 ${
              isActive
                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {toggling ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Power className="h-3.5 w-3.5" />
            )}
            {isActive ? 'Turn OFF' : 'Turn ON'}
          </button>
          <button
            onClick={() => onDelete(ad.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
