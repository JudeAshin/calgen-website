'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Megaphone,
  Image,
  Flag,
  Coins,
  BadgeCheck,
  Wallet,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAdminAuth } from '@/admin/hooks/use-auth';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Advertisements', href: '/admin/advertisements', icon: Megaphone },
  { label: 'Logos', href: '/admin/logos', icon: Image },
  { label: 'Reports', href: '/admin/reports', icon: Flag },
  { label: 'Coins', href: '/admin/coins', icon: Coins },
  { label: 'Host KYC', href: '/admin/host-kyc', icon: BadgeCheck },
  { label: 'Withdrawals', href: '/admin/withdrawals', icon: Wallet },
  { label: 'Coins Purchased', href: '/admin/coins-purchased', icon: ShoppingBag },
  { label: 'Users', href: '/admin/users', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm lg:hidden"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-900 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            C
          </div>
          <span className="text-lg font-bold text-white">Calgen</span>
          <span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[0.65rem] font-medium text-slate-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
