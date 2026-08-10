export type LogoType =
  | 'default'
  | 'pongal'
  | 'holi'
  | 'ramzan'
  | 'deepawali'
  | 'christmas'
  | 'new_year';

export const LOGO_TYPE_OPTIONS: { value: LogoType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'pongal', label: 'Pongal' },
  { value: 'holi', label: 'Holi' },
  { value: 'ramzan', label: 'Ramzan' },
  { value: 'deepawali', label: 'Deepawali' },
  { value: 'christmas', label: 'Christmas' },
  { value: 'new_year', label: 'New Year' },
];

export function getLogoLabel(type: string): string {
  return (
    LOGO_TYPE_OPTIONS.find((o) => o.value === type)?.label ??
    type.charAt(0).toUpperCase() + type.slice(1)
  );
}

export interface AppLogoState {
  id: string;
  current_logo_type: string;
  current_schedule_id: string | null;
  last_changed_at: string | null;
  last_checked_date: string | null;
  updated_at: string;
}

export interface FestivalSchedule {
  id: string;
  logo_type: string;
  name: string;
  notify_date: string;
  festival_date: string | null;
  revert_date: string;
  priority: number;
  is_active: boolean;
  notification_title: string | null;
  notification_body: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSchedulePayload {
  logo_type: LogoType;
  name: string;
  notify_date: string;
  festival_date?: string;
  revert_date: string;
  priority?: number;
  is_active?: boolean;
  notification_title?: string;
  notification_body?: string;
}

export interface UpdateSchedulePayload {
  logo_type?: LogoType;
  name?: string;
  notify_date?: string;
  festival_date?: string | null;
  revert_date?: string;
  priority?: number;
  is_active?: boolean;
  notification_title?: string | null;
  notification_body?: string | null;
}

export interface RunCheckResult {
  action: 'switched' | 'reverted' | 'none' | 'skipped_already_processed' | string;
  logo_type?: string;
  schedule_id?: string;
  current_logo_type?: string;
  date?: string;
}

export type ScheduleStatus =
  | 'active'
  | 'inactive'
  | 'upcoming'
  | 'currently_active'
  | 'past';

export function getScheduleStatus(
  schedule: FestivalSchedule,
  currentState: AppLogoState | null,
): ScheduleStatus {
  if (currentState?.current_schedule_id === schedule.id) {
    return 'currently_active';
  }
  if (!schedule.is_active) {
    return 'inactive';
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const notify = new Date(schedule.notify_date);
  notify.setHours(0, 0, 0, 0);
  const revert = new Date(schedule.revert_date);
  revert.setHours(0, 0, 0, 0);

  if (today < notify) return 'upcoming';
  if (today > revert) return 'past';
  return 'active';
}