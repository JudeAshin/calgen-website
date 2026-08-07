'use client';

import { useAdminAuth } from '@/admin/hooks/use-auth';
import { LogOut, Menu } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 pl-16 lg:px-8">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-700">{user?.name ?? 'Admin'}</p>
          <p className="text-xs text-slate-400">{user?.email ?? ''}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
          {user?.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
