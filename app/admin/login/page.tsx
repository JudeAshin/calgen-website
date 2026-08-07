import type { Metadata } from 'next';
import { AdminLoginForm } from '@/admin/components/admin-login-form';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Calgen admin panel login',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <AdminLoginForm />
    </div>
  );
}