'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Heart,
  DollarSign,
  Building2,
  BarChart3,
  Settings,
  Share2,
  X,
  Home,
  MapPin,
  Globe,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ROUTE_FEATURE_REQUIREMENTS, getPlanInfo } from '@/lib/plans';
import type { AppModule, GatedFeature } from '@/lib/types';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Module key used for permission checks. */
  module: AppModule;
  /** Optional gated feature — shows lock badge if plan doesn't include it. */
  gatedFeature?: GatedFeature;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
  { name: 'People', href: '/people', icon: Users, module: 'people' },
  { name: 'Animals', href: '/animals', icon: PawPrint, module: 'animals' },
  { name: 'Kennel Map', href: '/kennels', icon: MapPin, module: 'animals', gatedFeature: 'kennel_map' },
  { name: 'Foster', href: '/foster', icon: Home, module: 'animals', gatedFeature: 'foster_management' },
  { name: 'Adoptions', href: '/adoptions', icon: Heart, module: 'adoptions' },
  { name: 'Donations', href: '/donations', icon: DollarSign, module: 'donations' },
  { name: 'Organizations', href: '/organizations', icon: Building2, module: 'organizations' },
  { name: 'Publish Animals', href: '/animals/export', icon: Globe, module: 'animals', gatedFeature: 'petfinder_export' },
  { name: 'Social Media', href: '/social', icon: Share2, module: 'animals', gatedFeature: 'social_media_ai' },
  { name: 'Reports', href: '/reports', icon: BarChart3, module: 'reports' },
  { name: 'Admin', href: '/admin', icon: Settings, module: 'admin' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { canView, hasFeature, planTier } = useAuth();
  const planInfo = getPlanInfo(planTier);

  // Only show nav items the user has at least 'view' permission for
  const visibleNav = navigation.filter(item => canView(item.module));

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
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Paws360</h1>
              <p className="text-xs text-white/50">powered by Relate</p>
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
          {visibleNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const isLocked = item.gatedFeature ? !hasFeature(item.gatedFeature) : false;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : isLocked
                    ? 'text-white/40 hover:bg-sidebar-hover hover:text-white/60'
                    : 'text-white/70 hover:bg-sidebar-hover hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {isLocked && (
                  <Lock className="w-3.5 h-3.5 text-white/30" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Plan indicator */}
        <div className="px-4 py-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Plan</span>
            <span className={cn(
              'text-xs font-bold px-2 py-0.5 rounded-full',
              planTier === 'enterprise' ? 'bg-violet-500/30 text-violet-200' :
              planTier === 'professional' ? 'bg-indigo-500/30 text-indigo-200' :
              'bg-slate-500/30 text-slate-300'
            )}>
              {planInfo.name}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
