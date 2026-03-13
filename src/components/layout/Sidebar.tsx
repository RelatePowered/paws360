'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Heart,
  DollarSign,
  BarChart3,
  Settings,
  X,
  ArrowLeftRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Animals', href: '/animals', icon: PawPrint },
  { name: 'Adoptions', href: '/adoptions', icon: Heart },
  { name: 'Donations', href: '/donations', icon: DollarSign },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Admin', href: '/admin', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">ShelterHub</h1>
              <p className="text-xs text-white/50">Management Platform</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-sidebar-hover"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-white/70 hover:bg-sidebar-hover hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Role Transitions highlight */}
        <div className="px-3 pb-4">
          <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
            <div className="flex items-center gap-2 text-sm font-medium text-primary-light mb-1">
              <ArrowLeftRight className="w-4 h-4" />
              Role Transitions
            </div>
            <p className="text-xs text-white/60">2 recent transitions</p>
          </div>
        </div>
      </aside>
    </>
  );
}
