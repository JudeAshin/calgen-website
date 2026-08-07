'use client';

import { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/admin/components/admin-sidebar';
import { AdminHeader } from '@/admin/components/admin-header';
import { useAdminAuth } from '@/admin/hooks/use-auth';

const TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/advertisements': 'Advertisements',
  '/admin/logos': 'Logos',
  '/admin/reports': 'Reports',
  '/admin/coins': 'Coins',
  '/admin/host-kyc': 'Host KYC',
  '/admin/withdrawals': 'Withdrawals',
  '/admin/coins-purchased': 'Coins Purchased',
  '/admin/users': 'Users',
};

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = useAdminAuth();

  const title = Object.entries(TITLES).find(([href]) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href),
  )?.[1] ?? 'Dashboard';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader title={title} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
