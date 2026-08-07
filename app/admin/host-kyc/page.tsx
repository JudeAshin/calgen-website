'use client';

import { BadgeCheck } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function HostKycPage() {
  return (
    <ModulePlaceholder
      title="Host KYC"
      description="Review host KYC submissions and verification documents"
      icon={BadgeCheck}
    />
  );
}