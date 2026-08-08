'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { UsersContent } from '@/admin/components/users/users-content';

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}