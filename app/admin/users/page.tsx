'use client';

import { Users } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function UsersPage() {
  return (
    <ModulePlaceholder
      title="Users"
      description="Manage caller and host users, status, and activity"
      icon={Users}
    />
  );
}
