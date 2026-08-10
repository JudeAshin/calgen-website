export type ReportStatus = 'open' | 'warned' | 'banned' | 'resolved';

export type ReportDirection = 'caller_to_host' | 'host_to_caller';

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critically_high';

export type BannedRole = 'caller' | 'host';

export interface ReportUser {
  id: string;
  name?: string;
  email?: string;
  user_type?: string;
}

export interface ReportHost {
  id: string;
  user?: ReportUser;
}

export interface Report {
  id: string;
  reporter: ReportUser;
  direction: ReportDirection;
  reported_host?: ReportHost | null;
  reported_caller?: ReportUser | null;
  caller_reason?: string | null;
  host_reason?: string | null;
  reason?: string | null;
  severity: ReportSeverity;
  severity_level: number;
  description?: string | null;
  status: ReportStatus;
  admin_note?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ReviewReportRequest {
  status: 'resolved' | 'warned' | 'banned';
  admin_note?: string;
}

export interface BannedUser {
  id: string;
  user_id?: string;
  host_id?: string;
  name?: string;
  email?: string;
  role: BannedRole;
  is_banned: boolean;
  banned_by_severity: ReportSeverity | null;
  ban_message: string | null;
  low_count: number;
  medium_count: number;
  high_count: number;
  critically_high_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReportQueryParams {
  status?: string;
  direction?: string;
  severity?: string;
  page?: number;
  limit?: number;
}

export interface BannedUserQueryParams {
  role?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReportsResponse {
  success?: boolean;
  data: Report[];
  pagination: Pagination;
}

export interface BannedUsersResponse {
  success?: boolean;
  data: BannedUser[];
  pagination: Pagination;
}

export const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'warned', label: 'Warned' },
  { value: 'banned', label: 'Banned' },
  { value: 'resolved', label: 'Resolved' },
];

export const DIRECTION_OPTIONS: { value: ReportDirection; label: string }[] = [
  { value: 'caller_to_host', label: 'Caller → Host' },
  { value: 'host_to_caller', label: 'Host → Caller' },
];

export const SEVERITY_OPTIONS: { value: ReportSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critically_high', label: 'Critical' },
];

export const CALLER_REPORT_REASONS: Record<string, string> = {
  did_not_speak: 'Did Not Speak',
  unresponsive: 'Unresponsive',
  offensive_language: 'Offensive Language',
  harassment: 'Harassment',
  explicit_inappropriate_content: 'Explicit / Inappropriate Content',
};

export const HOST_REPORT_REASONS: Record<string, string> = {
  call_dropped_intentionally: 'Call Dropped Intentionally',
  disrespectful_behavior: 'Disrespectful Behavior',
  offensive_language: 'Offensive Language',
  harassment_or_threats: 'Harassment / Threats',
  explicit_inappropriate_content: 'Explicit / Inappropriate Content',
};

export function getStatusLabel(status: string): string {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status.charAt(0).toUpperCase() + status.slice(1);
}

export function getDirectionLabel(direction: string): string {
  if (direction === 'caller_to_host') return 'Caller → Host';
  if (direction === 'host_to_caller') return 'Host → Caller';
  return direction;
}

export function getSeverityLabel(severity: string): string {
  if (severity === 'critically_high') return 'Critical';
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}

export function getReasonLabel(report: Report): string {
  const reason = report.reason ?? report.caller_reason ?? report.host_reason ?? '';
  if (!reason) return '—';
  return (
    CALLER_REPORT_REASONS[reason] ??
    HOST_REPORT_REASONS[reason] ??
    reason.charAt(0).toUpperCase() + reason.slice(1).replace(/_/g, ' ')
  );
}

export function getReportedUser(report: Report): { name: string; email: string; id: string; type: string } | null {
  if (report.direction === 'caller_to_host' && report.reported_host) {
    const u = report.reported_host.user;
    return {
      name: u?.name ?? 'Unknown Host',
      email: u?.email ?? '—',
      id: report.reported_host.id,
      type: 'Host',
    };
  }
  if (report.direction === 'host_to_caller' && report.reported_caller) {
    return {
      name: report.reported_caller.name ?? 'Unknown Caller',
      email: report.reported_caller.email ?? '—',
      id: report.reported_caller.id,
      type: 'Caller',
    };
  }
  return null;
}

export function getReporterInfo(report: Report): { name: string; email: string; id: string; type: string } {
  const r = report.reporter;
  return {
    name: r.name ?? 'Unknown',
    email: r.email ?? '—',
    id: r.id,
    type: report.direction === 'caller_to_host' ? 'Caller' : 'Host',
  };
}
