'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User, Tenant, AppModule, PermissionLevel, GatedFeature, PlanTier } from '@/lib/types';
import { canView, canEdit, getPermission, isSuperAdmin } from '@/lib/permissions';
import { planHasFeature } from '@/lib/plans';
import { createBrowserSupabase } from '@/lib/supabase-browser';

interface AuthContextType {
  currentUser: User | null;
  currentTenant: Tenant | null;
  /** All tenants visible to this user (super admins see all). */
  tenants: Tenant[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
  /** True while the initial session is being restored. */
  isLoading: boolean;
  /** Switch active tenant (super admin only). */
  switchTenant: (tenantId: string) => void;
  /** Sign out and redirect to marketing page. */
  logout: () => void;
  /** Check if user can view a specific module. */
  canView: (mod: AppModule) => boolean;
  /** Check if user can edit within a specific module. */
  canEdit: (mod: AppModule) => boolean;
  /** Get the raw permission level for a module. */
  getPermission: (mod: AppModule) => PermissionLevel;
  /** Check if current tenant's plan includes a gated feature. */
  hasFeature: (feature: GatedFeature) => boolean;
  /** Current tenant's plan tier. */
  planTier: PlanTier;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentTenant: null,
  tenants: [],
  isAdmin: false,
  isSuperAdmin: false,
  isAuthenticated: false,
  isLoading: true,
  switchTenant: () => {},
  logout: () => {},
  canView: () => false,
  canEdit: () => false,
  getPermission: () => 'none',
  hasFeature: () => false,
  planTier: 'starter',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Supabase auth session listener ──
  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Use onAuthStateChange for all session events.
    // INITIAL_SESSION fires on mount with the current session (or null).
    // SIGNED_IN fires after login. SIGNED_OUT fires after logout.
    // TOKEN_REFRESHED fires when the access token is refreshed.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            await loadAppUser(session.user.id);
          } else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
            setCurrentUser(null);
            setActiveTenantId(null);
            setTenants([]);
          }
        } catch {
          // loadAppUser failed (network, RLS, no user row, etc.)
          // Clear auth state so the user can retry login.
          setCurrentUser(null);
          setActiveTenantId(null);
          setTenants([]);
        } finally {
          // Always mark loading done so the UI never gets stuck on the spinner
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load the app-level User row by Supabase auth UID,
   * then load tenants visible to that user.
   */
  async function loadAppUser(authUid: string) {
    const supabase = createBrowserSupabase();
    if (!supabase) return;

    // Fetch user row linked to this auth uid
    const { data: userRow, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_uid', authUid)
      .eq('is_active', true)
      .maybeSingle();

    if (userError || !userRow) {
      setCurrentUser(null);
      return;
    }

    const row = userRow as Record<string, unknown>;
    const appUser: User = {
      id: row.id as string,
      tenantId: row.tenant_id as string,
      email: row.email as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      role: row.role as User['role'],
      permissions: (row.permissions as User['permissions']) ?? {},
      isActive: row.is_active as boolean,
      createdAt: row.created_at as string,
      lastLoginAt: (row.last_login_at as string) ?? undefined,
      authUid: authUid,
    };

    setCurrentUser(appUser);
    setActiveTenantId(appUser.tenantId);

    // Load tenants visible to this user (RLS handles scoping)
    const { data: tenantRows } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true);

    if (tenantRows) {
      setTenants(
        (tenantRows as Record<string, unknown>[]).map(t => ({
          id: t.id as string,
          name: t.name as string,
          slug: t.slug as string,
          plan: (t.plan as PlanTier) ?? 'starter',
          address: (t.address as string) ?? undefined,
          city: (t.city as string) ?? undefined,
          state: (t.state as string) ?? undefined,
          zip: (t.zip as string) ?? undefined,
          phone: (t.phone as string) ?? undefined,
          email: (t.email as string) ?? undefined,
          logoUrl: (t.logo_url as string) ?? undefined,
          website: (t.website as string) ?? undefined,
          ein: (t.ein as string) ?? undefined,
          createdAt: t.created_at as string,
          isActive: t.is_active as boolean,
        }))
      );
    }
  }

  // ── Derived state ──
  const currentTenant = tenants.find(t => t.id === activeTenantId) ?? null;
  const currentPlan: PlanTier = currentTenant?.plan ?? 'starter';
  const userIsSuperAdmin = isSuperAdmin(currentUser);
  const userIsAdmin = currentUser?.role === 'admin' || userIsSuperAdmin;

  // ── Actions ──
  const switchTenant = useCallback((tenantId: string) => {
    if (!userIsSuperAdmin) return;
    setActiveTenantId(tenantId);
  }, [userIsSuperAdmin]);

  const logout = useCallback(async () => {
    const supabase = createBrowserSupabase();
    await supabase?.auth.signOut();
    setCurrentUser(null);
    setActiveTenantId(null);
    setTenants([]);
    // Hard redirect to force a full server round-trip through middleware,
    // ensuring cookies are cleared and no stale client state persists.
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        tenants,
        isAdmin: userIsAdmin,
        isSuperAdmin: userIsSuperAdmin,
        isAuthenticated: currentUser !== null,
        isLoading,
        switchTenant,
        logout,
        canView: (mod) => canView(currentUser, mod),
        canEdit: (mod) => canEdit(currentUser, mod),
        getPermission: (mod) => getPermission(currentUser, mod),
        hasFeature: (feature) => userIsSuperAdmin || planHasFeature(currentPlan, feature),
        planTier: currentPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
