'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconColor?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ title, value, subtitle, icon, iconColor = 'bg-primary/10 text-primary', trend }: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn('text-xs font-medium mt-2', trend.positive ? 'text-success' : 'text-danger')}>
              {trend.positive ? '+' : ''}{trend.value}
            </p>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', iconColor)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
