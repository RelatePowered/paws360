'use client';

import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

/** Routes that render without the sidebar/header shell and don't require auth. */
const PUBLIC_ROUTES = ['/login', '/auth', '/marketing'];

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Public pages render bare (no shell chrome), no auth required
  const isPublicRoute = pathname === '/' || PUBLIC_ROUTES.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (!isPublicRoute && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isPublicRoute, isAuthenticated]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Don't render protected content until authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
