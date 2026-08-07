'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from '@/admin/hooks/use-auth';
import { AdminLayout } from '@/admin/layouts/admin-layout';
import { useAuthGuard } from '@/admin/hooks/use-auth-guard';

function AdminGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';
  const { isLoading } = useAuthGuard();

  if (isLogin) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}