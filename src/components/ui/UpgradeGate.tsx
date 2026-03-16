'use client';

import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getRequiredPlan, FEATURE_LABELS, getPlanInfo } from '@/lib/plans';
import type { GatedFeature } from '@/lib/types';

interface UpgradeGateProps {
  feature: GatedFeature;
  children: React.ReactNode;
}

/**
 * Wraps content that requires a specific plan tier.
 * If the tenant's plan includes the feature, renders children normally.
 * Otherwise, renders an upgrade prompt.
 */
export function UpgradeGate({ feature, children }: UpgradeGateProps) {
  const { hasFeature } = useAuth();

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  return <UpgradePrompt feature={feature} />;
}

/**
 * Standalone upgrade prompt card. Use when you want to show the
 * prompt inline (e.g. inside a tab or report section) rather than
 * replacing the entire page.
 */
export function UpgradePrompt({ feature }: { feature: GatedFeature }) {
  const { planTier } = useAuth();
  const requiredPlan = getRequiredPlan(feature);
  const requiredPlanInfo = getPlanInfo(requiredPlan);
  const featureLabel = FEATURE_LABELS[feature];
  const currentPlanInfo = getPlanInfo(planTier);

  return (
    <div className="flex items-center justify-center min-h-[400px] px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-6">
          <Lock className="w-8 h-8 text-indigo-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">{featureLabel}</h2>
        <p className="text-muted text-sm mb-6">
          This feature requires the <span className="font-semibold text-foreground">{requiredPlanInfo.name}</span> plan.
          You&apos;re currently on <span className="font-semibold text-foreground">{currentPlanInfo.name}</span>.
        </p>
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-800 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-indigo-700 dark:text-indigo-300">{requiredPlanInfo.name} Plan</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{requiredPlanInfo.price}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25">
          Upgrade to {requiredPlanInfo.name}
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-muted mt-4">
          Contact your administrator to upgrade your plan.
        </p>
      </div>
    </div>
  );
}

/**
 * Inline badge shown when a feature is gated — useful for sidebar
 * items or report cards that should be visible but locked.
 */
export function PlanBadge({ feature }: { feature: GatedFeature }) {
  const { hasFeature } = useAuth();

  if (hasFeature(feature)) return null;

  const requiredPlan = getRequiredPlan(feature);
  const info = getPlanInfo(requiredPlan);

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase">
      <Lock className="w-2.5 h-2.5" />
      {info.name}
    </span>
  );
}
