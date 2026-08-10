'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import {
  LOGO_TYPE_OPTIONS,
  type CreateSchedulePayload,
  type FestivalSchedule,
  type LogoType,
  type UpdateSchedulePayload,
} from '@/admin/types/logos';
import { LogoPreview } from '@/admin/components/logos/logo-preview';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { logosService } from '@/admin/services/logos.service';

interface ScheduleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingSchedule?: FestivalSchedule | null;
}

export function ScheduleForm({ onSuccess, onCancel, editingSchedule }: ScheduleFormProps) {
  const isEdit = !!editingSchedule;

  const [logoType, setLogoType] = useState<LogoType>(
    (editingSchedule?.logo_type as LogoType) ?? 'default',
  );
  const [name, setName] = useState(editingSchedule?.name ?? '');
  const [notifyDate, setNotifyDate] = useState(editingSchedule?.notify_date ?? '');
  const [festivalDate, setFestivalDate] = useState(editingSchedule?.festival_date ?? '');
  const [revertDate, setRevertDate] = useState(editingSchedule?.revert_date ?? '');
  const [priority, setPriority] = useState(editingSchedule?.priority ?? 1);
  const [isActive, setIsActive] = useState(editingSchedule?.is_active ?? true);
  const [notificationTitle, setNotificationTitle] = useState(
    editingSchedule?.notification_title ?? '',
  );
  const [notificationBody, setNotificationBody] = useState(
    editingSchedule?.notification_body ?? '',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60';
  const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';
  const helperClass = 'mt-1 text-xs text-slate-400';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!notifyDate) {
      setError('Notification date is required.');
      return;
    }
    if (!revertDate) {
      setError('Revert date is required.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && editingSchedule) {
        const payload: UpdateSchedulePayload = {
          logo_type: logoType,
          name: name.trim(),
          notify_date: notifyDate,
          festival_date: festivalDate || null,
          revert_date: revertDate,
          priority,
          is_active: isActive,
          notification_title: notificationTitle.trim() || null,
          notification_body: notificationBody.trim() || null,
        };
        await logosService.updateSchedule(editingSchedule.id, payload);
      } else {
        const payload: CreateSchedulePayload = {
          logo_type: logoType,
          name: name.trim(),
          notify_date: notifyDate,
          festival_date: festivalDate || undefined,
          revert_date: revertDate,
          priority,
          is_active: isActive,
          notification_title: notificationTitle.trim() || undefined,
          notification_body: notificationBody.trim() || undefined,
        };
        await logosService.createSchedule(payload);
      }
      onSuccess();
    } catch (err) {
      setError(
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : isEdit
            ? 'Failed to update schedule.'
            : 'Failed to create schedule.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logo Type & Preview */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Logo Type</h3>
        <div className="flex items-start gap-4">
          <LogoPreview logoType={logoType} size="lg" />
          <div className="flex-1">
            <label className={labelClass}>Festival Logo</label>
            <Select
              value={logoType}
              onValueChange={(v) => setLogoType(v as LogoType)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select logo type" />
              </SelectTrigger>
              <SelectContent>
                {LOGO_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={helperClass}>
              Select the festival logo that will be displayed to users.
            </p>
          </div>
        </div>
      </div>

      {/* Schedule Details */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Schedule Details</h3>
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Christmas 2026"
            className={inputClass}
            disabled={loading}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Notification Date</label>
            <input
              type="date"
              value={notifyDate}
              onChange={(e) => setNotifyDate(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
            <p className={helperClass}>
              Logo becomes active on this date when the daily check runs.
            </p>
          </div>
          <div>
            <label className={labelClass}>
              Festival Date <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              value={festivalDate}
              onChange={(e) => setFestivalDate(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
          </div>
          <div>
            <label className={labelClass}>Revert Date</label>
            <input
              type="date"
              value={revertDate}
              onChange={(e) => setRevertDate(e.target.value)}
              className={inputClass}
              disabled={loading}
            />
            <p className={helperClass}>
              Logo reverts to default on this date unless another schedule starts.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Priority</label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              min={1}
              className={inputClass}
              disabled={loading}
            />
            <p className={helperClass}>
              Higher priority wins when multiple schedules start on the same date.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={loading}
            />
            <span className="text-sm font-medium text-slate-700">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Notification */}
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-800">
          Notification (Optional)
        </h3>
        <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          <p>
            These fields are stored in the schedule but the backend currently sends
            a silent FCM logo notification with only the logo type. They may be used
            for future notification content.
          </p>
        </div>
        <div>
          <label className={labelClass}>Notification Title</label>
          <input
            type="text"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            placeholder="Optional notification title"
            className={inputClass}
            disabled={loading}
          />
        </div>
        <div>
          <label className={labelClass}>Notification Body</label>
          <textarea
            value={notificationBody}
            onChange={(e) => setNotificationBody(e.target.value)}
            placeholder="Optional notification body"
            rows={3}
            className={inputClass}
            disabled={loading}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : isEdit ? (
            'Update Schedule'
          ) : (
            'Create Schedule'
          )}
        </button>
      </div>
    </form>
  );
}
