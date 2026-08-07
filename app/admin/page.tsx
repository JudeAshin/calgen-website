'use client';

import { LayoutDashboard, Megaphone, Image, Flag, Coins, BadgeCheck, Wallet, ShoppingBag, Users } from 'lucide-react';

const STATS = [
  { label: 'Total Users', value: '—', icon: Users, color: 'bg-blue-50 text-blue-600' },
  { label: 'Active Hosts', value: '—', icon: BadgeCheck, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Coins Sold', value: '—', icon: Coins, color: 'bg-amber-50 text-amber-600' },
  { label: 'Pending Withdrawals', value: '—', icon: Wallet, color: 'bg-purple-50 text-purple-600' },
];

const MODULES = [
  { label: 'Advertisements', icon: Megaphone, status: 'Pending' },
  { label: 'Logos', icon: Image, status: 'Pending' },
  { label: 'Reports', icon: Flag, status: 'Pending' },
  { label: 'Coins', icon: Coins, status: 'Pending' },
  { label: 'Host KYC', icon: BadgeCheck, status: 'Pending' },
  { label: 'Withdrawals', icon: Wallet, status: 'Pending' },
  { label: 'Coins Purchased', icon: ShoppingBag, status: 'Pending' },
  { label: 'Users', icon: Users, status: 'Pending' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
        <p className="text-sm text-slate-500">Here is an overview of your platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">{stat.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Modules</h3>
        <p className="mt-1 text-sm text-slate-500">All modules will be implemented in future updates.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod) => (
            <div key={mod.label} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                <mod.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{mod.label}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.65rem] font-medium text-amber-700">
                {mod.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
