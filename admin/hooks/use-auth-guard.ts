'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '@/admin/hooks/use-auth';

export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return { isAuthenticated, isLoading };
}
