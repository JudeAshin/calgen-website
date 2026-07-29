import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg ${className}`}
      aria-label="Calgen home"
    >
      <LogoMark className="h-8 w-8" />
      <span className={`text-xl ${dark ? 'text-white' : 'text-foreground'}`}>Calgen</span>
    </Link>
  );
}

// export function LogoMark({ className = '' }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 40 40"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//       aria-hidden="true"
//     >
//       <rect width="40" height="40" rx="12" fill="url(#calgen-logo)" />
//       <path
//         d="M14 26c0-1.1.9-2 2-2h6.5c2.5 0 4.5-2 4.5-4.5S25 15 22.5 15H16c-1.1 0-2-.9-2-2s.9-2 2-2h6.5c4.7 0 8.5 3.8 8.5 8.5S27.2 28 22.5 28H16c-1.1 0-2-.9-2-2z"
//         fill="white"
//       />
//       <circle cx="14" cy="24" r="3" fill="white" />
//       <defs>
//         <linearGradient id="calgen-logo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
//           <stop stopColor="#25D366" />
//           <stop offset="1" stopColor="#00B894" />
//         </linearGradient>
//       </defs>
//     </svg>
//   );
// }

export function LogoMark({ className = '' }: { className?: string }) {
  return (
<Image
  src="https://social-calling-app.s3.ap-south-1.amazonaws.com/profiles/Calgen_logo.jpg"
  alt="Calgen logo"
  width={40}
  height={40}
  priority
/>
  );
}