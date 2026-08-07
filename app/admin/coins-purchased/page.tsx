'use client';

import { ShoppingBag } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function CoinsPurchasedPage() {
  return (
    <ModulePlaceholder
      title="Coins Purchased"
      description="Monitor caller coin purchase transactions"
      icon={ShoppingBag}
    />
  );
}