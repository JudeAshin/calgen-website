'use client';

import { X, Star, Phone, Mail, Calendar, Globe, Award, Zap, TrendingUp, Wifi, BadgeCheck, ShieldCheck, IndianRupee, Clock } from 'lucide-react';
import type { User } from '@/admin/types/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserDetailDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
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

function StatusPill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        active
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-slate-200 bg-slate-100 text-slate-500'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {label}
    </span>
  );
}

function VerificationBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-sm text-slate-400">—</span>;
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    rejected: 'border-red-200 bg-red-50 text-red-600',
  };
  const icons: Record<string, typeof ShieldCheck> = {
    approved: BadgeCheck,
    pending: Clock,
    rejected: X,
  };
  const Icon = icons[s] ?? ShieldCheck;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[s] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function UserDetailDrawer({ user, open, onClose }: UserDetailDrawerProps) {
  if (!user) return null;

  const isHost = user.user_type === 'host';
  const isCaller = user.user_type === 'caller';
  const host = user.host;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">User Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Profile section */}
          <div className="mb-6 flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 border-2 border-slate-200">
              {user.photo_url ? (
                <AvatarImage src={user.photo_url} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-emerald-100 text-lg font-semibold text-emerald-700">
                {getInitials(user.name || '?')}
              </AvatarFallback>
            </Avatar>
            <h4 className="mt-3 text-lg font-bold text-slate-900">{user.name}</h4>
            {user.username && <p className="text-sm text-slate-500">@{user.username}</p>}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isHost
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-purple-50 text-purple-700'
                }`}
              >
                {isHost ? 'Host' : 'Caller'}
              </span>
              {user.is_profile_complete !== undefined && (
                <StatusPill
                  label={user.is_profile_complete ? 'Profile Complete' : 'Incomplete'}
                  active={user.is_profile_complete}
                />
              )}
            </div>
          </div>

          {/* Contact info */}
          <div className="mb-1 divide-y divide-slate-50 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
            <DetailRow icon={Phone} label="Phone" value={user.phone} />
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow icon={Calendar} label="Registered" value={formatDate(user.created_at)} />
            {user.age !== undefined && user.age !== null && (
              <DetailRow icon={Clock} label="Age" value={`${user.age} years`} />
            )}
            {user.gender && (
              <DetailRow icon={ShieldCheck} label="Gender" value={String(user.gender)} />
            )}
          </div>

          {/* Languages */}
          <div className="mb-1 mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />
              <p className="text-xs font-medium text-slate-400">Languages</p>
            </div>
            {user.preferred_languages && user.preferred_languages.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {user.preferred_languages.map((lang, i) => (
                  <span
                    key={`${lang}-${i}`}
                    className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No languages set</p>
            )}
          </div>

          {/* Verification */}
          <div className="mb-1 mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-slate-400">Verification</p>
            <div className="flex flex-wrap gap-2">
              {user.is_voice_verified !== undefined && (
                <StatusPill label={user.is_voice_verified ? 'Voice Verified' : 'Voice Not Verified'} active={user.is_voice_verified} />
              )}
              {isHost && host?.verification_status && (
                <VerificationBadge status={host.verification_status} />
              )}
            </div>
          </div>

          {/* Caller-specific */}
          {isCaller && (
            <div className="mb-1 mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
              <p className="mb-3 text-xs font-medium text-slate-400">Caller Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-3 text-center">
                  <Zap className="mx-auto mb-1 h-4 w-4 text-amber-500" />
                  <p className="text-lg font-bold text-slate-900">{user.xp ?? 0}</p>
                  <p className="text-xs text-slate-400">XP</p>
                </div>
                <div className="rounded-lg bg-white p-3 text-center">
                  <Award className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                  <p className="text-lg font-bold text-slate-900">Level {user.level ?? 1}</p>
                  <p className="text-xs text-slate-400">Level</p>
                </div>
                <div className="rounded-lg bg-white p-3 text-center">
                  <Star className="mx-auto mb-1 h-4 w-4 text-yellow-500" />
                  <p className="text-lg font-bold text-slate-900">{user.rating != null ? Number(user.rating).toFixed(1) : '—'}</p>
                  <p className="text-xs text-slate-400">Rating</p>
                </div>
                <div className="rounded-lg bg-white p-3 text-center">
                  <TrendingUp className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                  <p className="text-lg font-bold text-slate-900">{user.total_ratings ?? 0}</p>
                  <p className="text-xs text-slate-400">Total Ratings</p>
                </div>
              </div>
            </div>
          )}

          {/* Host-specific */}
          {isHost && host && (
            <div className="mb-1 mt-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
              <p className="mb-3 text-xs font-medium text-slate-400">Host Stats</p>
              <div className="space-y-2.5">
                {host.is_online !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="text-sm text-slate-500">Online Status</span>
                    <StatusPill label={host.is_online ? 'Online' : 'Offline'} active={host.is_online} />
                  </div>
                )}
                {host.base_caller_rate !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <IndianRupee className="h-3.5 w-3.5" /> Base Caller Rate
                    </span>
                    <span className="text-sm font-semibold text-slate-900">₹{host.base_caller_rate}</span>
                  </div>
                )}
                {host.base_host_rate !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <IndianRupee className="h-3.5 w-3.5" /> Base Host Rate
                    </span>
                    <span className="text-sm font-semibold text-slate-900">₹{host.base_host_rate}</span>
                  </div>
                )}
                {host.coin_per_minute !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Zap className="h-3.5 w-3.5" /> Coin Per Minute
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{host.coin_per_minute}</span>
                  </div>
                )}
                {host.avg_rating !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Star className="h-3.5 w-3.5" /> Avg Rating
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{host.avg_rating?.toFixed(1) ?? '—'}</span>
                  </div>
                )}
                {host.total_calls !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Phone className="h-3.5 w-3.5" /> Total Calls
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{host.total_calls}</span>
                  </div>
                )}
                {host.total_earnings !== undefined && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <TrendingUp className="h-3.5 w-3.5" /> Total Earnings
                    </span>
                    <span className="text-sm font-semibold text-slate-900">₹{host.total_earnings}</span>
                  </div>
                )}
                {host.verification_status && (
                  <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verification
                    </span>
                    <VerificationBadge status={host.verification_status} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
