import type { PlanTier, PlanInfo, PlanLimits, GatedFeature } from './types';

// ========== Plan Definitions ==========

export const PLAN_DEFINITIONS: Record<PlanTier, PlanInfo> = {
  starter: {
    tier: 'starter',
    name: 'Starter',
    price: '$49/mo',
    limits: {
      maxUsers: 2,
      maxAnimalsPerYear: 100,
      features: [],
    },
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    price: '$149/mo',
    limits: {
      maxUsers: 10,
      maxAnimalsPerYear: 1000,
      features: [
        'asilomar_reports',
        'sac_reports',
        'petfinder_export',
        'adopt_a_pet_export',
        'adoption_applications',
        'foster_management',
        'kennel_map',
        'vaccination_alerts',
        'social_media_ai',
        'point_of_adoption_donations',
        'moves_management',
        'api_access',
      ],
    },
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    limits: {
      maxUsers: 0, // unlimited
      maxAnimalsPerYear: 0, // unlimited
      features: [
        'asilomar_reports',
        'sac_reports',
        'petfinder_export',
        'adopt_a_pet_export',
        'adoption_applications',
        'foster_management',
        'kennel_map',
        'vaccination_alerts',
        'social_media_ai',
        'point_of_adoption_donations',
        'moves_management',
        'multi_tenant',
        'sso',
        'api_access',
        'custom_integrations',
      ],
    },
  },
};

// ========== Feature Gating ==========

/** Check if a plan tier includes a specific gated feature. */
export function planHasFeature(plan: PlanTier, feature: GatedFeature): boolean {
  return PLAN_DEFINITIONS[plan].limits.features.includes(feature);
}

/** Get the plan limits for a given tier. */
export function getPlanLimits(plan: PlanTier): PlanLimits {
  return PLAN_DEFINITIONS[plan].limits;
}

/** Get the plan info for a given tier. */
export function getPlanInfo(plan: PlanTier): PlanInfo {
  return PLAN_DEFINITIONS[plan];
}

/** Get the minimum plan required for a feature. */
export function getRequiredPlan(feature: GatedFeature): PlanTier {
  if (PLAN_DEFINITIONS.starter.limits.features.includes(feature)) return 'starter';
  if (PLAN_DEFINITIONS.professional.limits.features.includes(feature)) return 'professional';
  return 'enterprise';
}

/** Human-readable feature labels for upgrade prompts. */
export const FEATURE_LABELS: Record<GatedFeature, string> = {
  asilomar_reports: 'Asilomar / Live Release Rate Reports',
  sac_reports: 'Shelter Animals Count (SAC) Reports',
  petfinder_export: 'Petfinder Export',
  adopt_a_pet_export: 'Adopt-a-Pet Export',
  adoption_applications: 'Adoption Application Pipeline',
  foster_management: 'Foster Network Management',
  kennel_map: 'Kennel Map',
  vaccination_alerts: 'Vaccination Alerts',
  social_media_ai: 'AI Social Media Posts',
  point_of_adoption_donations: 'Point-of-Adoption Donations',
  moves_management: 'Moves Management (CRM)',
  multi_tenant: 'Multi-Tenant Support',
  sso: 'SSO / SAML Integration',
  api_access: 'API Access',
  custom_integrations: 'Custom Integrations',
};

/**
 * Map routes to the features they require.
 * Routes not listed here are available on all plans.
 */
export const ROUTE_FEATURE_REQUIREMENTS: Record<string, GatedFeature> = {
  '/foster': 'foster_management',
  '/kennels': 'kennel_map',
  '/animals/export': 'petfinder_export',
  '/social': 'social_media_ai',
};

/**
 * Map report sub-types to required features.
 * Used for gating individual report cards within the reports page.
 */
export const REPORT_FEATURE_REQUIREMENTS: Record<string, GatedFeature> = {
  asilomar: 'asilomar_reports',
  sac: 'sac_reports',
};
