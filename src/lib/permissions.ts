import type { User, AppModule, PermissionLevel } from './types';

/** Default permissions for each role — used when per-user overrides are absent. */
const ROLE_DEFAULTS: Record<string, Record<AppModule, PermissionLevel>> = {
  super_admin: {
    dashboard: 'edit',
    people: 'edit',
    animals: 'edit',
    adoptions: 'edit',
    donations: 'edit',
    organizations: 'edit',
    reports: 'edit',
    admin: 'edit',
  },
  admin: {
    dashboard: 'edit',
    people: 'edit',
    animals: 'edit',
    adoptions: 'edit',
    donations: 'edit',
    organizations: 'edit',
    reports: 'edit',
    admin: 'edit',
  },
  staff: {
    dashboard: 'view',
    people: 'view',
    animals: 'edit',
    adoptions: 'edit',
    donations: 'view',
    organizations: 'view',
    reports: 'view',
    admin: 'none',
  },
};

/**
 * Resolve the effective permission for a given module.
 * Priority: explicit user-level override → role default → 'none'.
 */
export function getPermission(user: User | null, mod: AppModule): PermissionLevel {
  if (!user || !user.isActive) return 'none';
  // Super admins always have full access
  if (user.role === 'super_admin') return 'edit';
  // Check user-level override first
  const override = user.permissions?.[mod];
  if (override) return override;
  // Fall back to role default
  return ROLE_DEFAULTS[user.role]?.[mod] ?? 'none';
}

/** Shorthand: can the user see this module at all? */
export function canView(user: User | null, mod: AppModule): boolean {
  const p = getPermission(user, mod);
  return p === 'view' || p === 'edit';
}

/** Shorthand: can the user create/update/delete within this module? */
export function canEdit(user: User | null, mod: AppModule): boolean {
  return getPermission(user, mod) === 'edit';
}

/** Is the user a super admin (cross-tenant access)? */
export function isSuperAdmin(user: User | null): boolean {
  return user?.role === 'super_admin';
}
