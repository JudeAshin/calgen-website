'use client';

import { type LucideIcon } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ModulePlaceholder({ title, description, icon: Icon }: PlaceholderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-700">Module coming soon</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          This module has not been implemented yet. It will be built in a future update.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Pending implementation
        </div>
      </div>
    </div>
  );
}
