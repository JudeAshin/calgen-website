'use client';

import {
  X,
  Calendar,
  Bell,
  Tag,
  Hash,
  ToggleLeft,
  Zap,
  Trash2,
  Edit,
  Info,
} from 'lucide-react';
import {
  type AppLogoState,
  type FestivalSchedule,
  getLogoLabel,
  getScheduleStatus,
} from '@/admin/types/logos';
import { LogoPreview } from '@/admin/components/logos/logo-preview';

interface ScheduleDetailDrawerProps {
  schedule: FestivalSchedule | null;
  currentState: AppLogoState | null;
  open: boolean;
  onClose: () => void;
  onEdit: (schedule: FestivalSchedule) => void;
  onTrigger: (schedule: FestivalSchedule) => void;
  onDelete: (schedule: FestivalSchedule) => void;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return (
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: React.ReactNode;
}) {
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

function StatusBadge({
  status,
}: {
  status: ReturnType<typeof getScheduleStatus>;
}) {
  const styles: Record<string, string> = {
    currently_active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    active: 'border-blue-200 bg-blue-50 text-blue-700',
    upcoming: 'border-amber-200 bg-amber-50 text-amber-700',
    past: 'border-slate-200 bg-slate-100 text-slate-500',
    inactive: 'border-slate-200 bg-slate-100 text-slate-500',
  };
  const labels: Record<string, string> = {
    currently_active: 'Currently Active',
    active: 'Active',
    upcoming: 'Upcoming',
    past: 'Past',
    inactive: 'Inactive',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'currently_active'
            ? 'bg-emerald-500'
            : status === 'active'
              ? 'bg-blue-500'
              : status === 'upcoming'
                ? 'bg-amber-500'
                : 'bg-slate-400'
        }`}
      />
      {labels[status]}
    </span>
  );
}

export function ScheduleDetailDrawer({
  schedule,
  currentState,
  open,
  onClose,
  onEdit,
  onTrigger,
  onDelete,
}: ScheduleDetailDrawerProps) {
  if (!schedule) return null;

  const status = getScheduleStatus(schedule, currentState);
  const isCurrentlyActive = currentState?.current_schedule_id === schedule.id;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Schedule Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Logo preview */}
          <div className="mb-6 flex flex-col items-center text-center">
            <LogoPreview logoType={schedule.logo_type} size="xl" />
            <h4 className="mt-3 text-lg font-bold text-slate-900">{schedule.name}</h4>
            <p className="text-sm text-slate-500">{getLogoLabel(schedule.logo_type)}</p>
            <div className="mt-2">
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Basic info */}
          <div className="mb-1 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
            <DetailRow icon={Tag} label="Name" value={schedule.name} />
            <DetailRow
              icon={Info}
              label="Logo Type"
              value={getLogoLabel(schedule.logo_type)}
            />
            <DetailRow icon={Hash} label="Schedule ID" value={schedule.id} />
            <DetailRow
              icon={ToggleLeft}
              label="Active"
              value={schedule.is_active ? 'Yes' : 'No'}
            />
            <DetailRow icon={Hash} label="Priority" value={String(schedule.priority)} />
          </div>

          {/* Schedule */}
          <div className="mb-1 mt-4 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
            <DetailRow
              icon={Calendar}
              label="Notification Date"
              value={formatDate(schedule.notify_date)}
            />
            <DetailRow
              icon={Calendar}
              label="Festival Date"
              value={formatDate(schedule.festival_date)}
            />
            <DetailRow
              icon={Calendar}
              label="Revert Date"
              value={formatDate(schedule.revert_date)}
            />
            <DetailRow
              icon={Calendar}
              label="Created"
              value={formatDateTime(schedule.created_at)}
            />
          </div>

          {/* Notification */}
          <div className="mb-1 mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-400" />
              <p className="text-xs font-medium text-slate-400">Notification</p>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-slate-400">Title</p>
                <p className="text-sm text-slate-700">
                  {schedule.notification_title || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Body</p>
                <p className="text-sm text-slate-700">
                  {schedule.notification_body || '—'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 p-2.5 text-xs text-blue-700">
              <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              <p>
                The backend sends a silent FCM logo notification with the logo type
                when the logo is switched. Title and body are stored but not currently
                sent in the notification payload.
              </p>
            </div>
          </div>

          {/* Current state */}
          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-slate-400">Current State</p>
            {isCurrentlyActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Currently Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                Not Currently Active
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => onEdit(schedule)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onTrigger(schedule)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Zap className="h-4 w-4" />
              Make Current Now
            </button>
            <button
              onClick={() => onDelete(schedule)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 sm:flex-none"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
