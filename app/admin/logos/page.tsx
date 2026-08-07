'use client';

import { Image } from 'lucide-react';
import { ModulePlaceholder } from '@/admin/components/module-placeholder';

export default function LogosPage() {
  return (
    <ModulePlaceholder
      title="Logos"
      description="Manage application logos and active selection"
      icon={Image}
    />
  );
}