'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../lib/auth';
import { IUser } from '@brikien/types';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Don't check on every pathname change if we're already initialized and just moved to login
      if (initialized && pathname === '/login') {
        setLoading(false);
        return;
      }

      try {
        const response: any = await authService.getMe();
        setUser(response.data);
        if (pathname === '/login') {
          router.replace('/dashboard');
        }
      } catch (error) {
        // Only redirect to login if we're not already there
        if (pathname !== '/login' && pathname !== '/') {
          router.replace('/login');
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, [pathname, router, initialized]);

  const login = async (data: any) => {
    const response: any = await authService.login(data);
    setUser(response.data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
