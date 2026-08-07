'use client';

import { Wallet } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function WithdrawalsPage() {
  return (
    <ModulePlaceholder
      title="Withdrawals"
      description="Process host withdrawal requests and payouts"
      icon={Wallet}
    />
  );
}