'use client';

import { LogoMark } from '@/components/site/logo';
import { getLogoLabel, type LogoType } from '@/admin/types/logos';
import { cn } from '@/lib/utils';

const FESTIVAL_STYLES: Record<
  string,
  { bg: string; emoji: string; label: string }
> = {
  default: { bg: '', emoji: '', label: '' },
  pongal: { bg: 'bg-amber-100 text-amber-700', emoji: '🌾', label: 'Pongal' },
  holi: { bg: 'bg-pink-100 text-pink-700', emoji: '🎨', label: 'Holi' },
  ramzan: { bg: 'bg-emerald-100 text-emerald-700', emoji: '🌙', label: 'Ramzan' },
  deepawali: { bg: 'bg-orange-100 text-orange-700', emoji: '🪔', label: 'Deepawali' },
  christmas: { bg: 'bg-red-100 text-red-700', emoji: '🎄', label: 'Christmas' },
  new_year: { bg: 'bg-blue-100 text-blue-700', emoji: '🎉', label: 'New Year' },
};

interface LogoPreviewProps {
  logoType: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { container: 'h-10 w-10', icon: 'h-5 w-5', emoji: 'text-lg' },
  md: { container: 'h-14 w-14', icon: 'h-7 w-7', emoji: 'text-2xl' },
  lg: { container: 'h-20 w-20', icon: 'h-10 w-10', emoji: 'text-3xl' },
  xl: { container: 'h-28 w-28', icon: 'h-14 w-14', emoji: 'text-5xl' },
};

export function LogoPreview({ logoType, size = 'md', className }: LogoPreviewProps) {
  const style = FESTIVAL_STYLES[logoType] ?? FESTIVAL_STYLES.default;
  const dims = SIZE_MAP[size];

  if (logoType === 'default' || !style.emoji) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl',
          dims.container,
          className,
        )}
      >
        <LogoMark className={dims.icon} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl border border-slate-200 bg-white',
        dims.container,
        className,
      )}
    >
      <span className={dims.emoji}>{style.emoji}</span>
    </div>
  );
}

export function getFestivalEmoji(logoType: string): string {
  return FESTIVAL_STYLES[logoType]?.emoji ?? '';
}
