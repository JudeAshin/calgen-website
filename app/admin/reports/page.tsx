'use client';

import { Flag } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports"
      description="Manage caller reports, host reports, and bans"
      icon={Flag}
    />
  );
}
