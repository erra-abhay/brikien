'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (!loading && user && requireAdmin && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router, requireAdmin]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null; // will redirect
  }

  return <>{children}</>;
}
