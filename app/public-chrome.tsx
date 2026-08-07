'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import Navbar from '@/components/site/navbar';
import Footer from '@/components/site/footer';
import FloatingDownloadButton from '@/components/site/floating-download-button';

export function PublicChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      <FloatingDownloadButton />
    </>
  );
}