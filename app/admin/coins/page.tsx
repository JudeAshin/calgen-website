'use client';

import { Coins } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function CoinsPage() {
  return (
    <ModulePlaceholder
      title="Coins"
      description="Manage coin packages, pricing, and discounts"
      icon={Coins}
    />
  );
}