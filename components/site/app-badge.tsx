import { SITE } from '@/lib/site';

interface BadgeProps {
  variant: 'app-store' | 'play-store';
  className?: string;
}

export function AppBadge({ variant, className = '' }: BadgeProps) {
  const href = variant === 'app-store' ? SITE.appStoreLink : SITE.playStoreLink;
  const label = variant === 'app-store' ? 'Download on the App Store' : 'Get it on Google Play';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center gap-3 rounded-2xl bg-black px-5 py-3 text-white transition-transform hover:scale-[1.03] hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
    >
      {variant === 'app-store' ? <AppleIcon /> : <PlayIcon />}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[0.65rem] font-medium opacity-80">
          {variant === 'app-store' ? 'Download on the' : 'GET IT ON'}
        </span>
        <span className="text-base font-semibold">
          {variant === 'app-store' ? 'App Store' : 'Google Play'}
        </span>
      </span>
    </a>
  );
}

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.7 2.2-3.99 2.3-4.06-1.25-1.84-3.2-2.09-3.9-2.12-1.66-.17-3.24.98-4.08.98-.84 0-2.13-.96-3.5-.93-1.8.03-3.46 1.05-4.38 2.66-1.87 3.24-.48 8.03 1.33 10.66.89 1.29 1.95 2.73 3.34 2.68 1.34-.06 1.85-.86 3.47-.86 1.62 0 2.08.86 3.5.83 1.44-.02 2.35-1.31 3.23-2.61 1.02-1.49 1.44-2.94 1.46-3.02-.03-.01-2.8-1.07-2.83-4.25zM14.3 4.7c.74-.9 1.24-2.14 1.1-3.39-1.07.04-2.37.71-3.14 1.6-.69.79-1.29 2.06-1.13 3.28 1.2.09 2.42-.61 3.17-1.49z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#34A853" d="M3.6 3.3c-.4.4-.6 1-.6 1.8v13.8c0 .8.2 1.4.6 1.8l.1.1L11 13.2v-.2L3.7 3.2l-.1.1z" />
      <path fill="#4285F4" d="M14.3 15.6l-2.4-2.4v-.2l2.4-2.4.1.1 2.9 1.6c.8.5.8 1.3 0 1.7l-3 1.6z" />
      <path fill="#FBBC04" d="M14.4 15.5L11 13 3.6 20.7c.3.3.8.3 1.4 0l9.4-5.2" />
      <path fill="#EA4335" d="M14.4 10.4L5 5.2c-.6-.3-1.1-.3-1.4 0L11 12l3.4-1.6z" />
    </svg>
  );
}