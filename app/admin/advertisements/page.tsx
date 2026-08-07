'use client';

import { Megaphone } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function AdvertisationsPage() {
  return (
    <ModulePlaceholder
      title="Advertisements"
      description="Manage caller and host advertisements"
      icon={Megaphone}
    />
  );
}