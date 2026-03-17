'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import type { User, Tenant, AppModule, PermissionLevel, GatedFeature, PlanTier } from '@/lib/types';
import { canView, canEdit, getPermission, isSuperAdmin } from '@/lib/permissions';
import { planHasFeature } from '@/lib/plans';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import type { SupabaseClient } from '@supabase/supabase-js';

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
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Supabase auth session listener ──
  useEffect(() => {
    console.log('[Auth] Initializing auth context...');
    const supabase = createBrowserSupabase();
    if (!supabase) {
      console.error('[Auth] createBrowserSupabase() returned null — env vars missing');
      setIsLoading(false);
      return;
    }
    console.log('[Auth] Supabase client created, setting up onAuthStateChange...');

    // Safety timeout: if loading hasn't resolved in 15s, force it off
    loadingTimerRef.current = setTimeout(() => {
      console.error('[Auth] Safety timeout — forcing isLoading to false after 15s');
      setIsLoading(false);
    }, 15000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`[Auth] onAuthStateChange event="${event}" hasSession=${!!session} userId=${session?.user?.id ?? 'none'}`);
        try {
          if (session?.user && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            console.log(`[Auth] Loading app user for auth uid: ${session.user.id} email: ${session.user.email}`);
            await loadAppUser(supabase, session.user.id, session.user.email);
          } else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
            console.log('[Auth] No session or signed out, clearing state');
            setCurrentUser(null);
            setActiveTenantId(null);
            setTenants([]);
          }
        } catch (err) {
          console.error('[Auth] Error in onAuthStateChange handler:', err);
          setCurrentUser(null);
          setActiveTenantId(null);
          setTenants([]);
        } finally {
          console.log('[Auth] Setting isLoading to false');
          if (loadingTimerRef.current) {
            clearTimeout(loadingTimerRef.current);
            loadingTimerRef.current = null;
          }
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load the app-level User row by Supabase auth UID,
   * then load tenants visible to that user.
   * Falls back to email match if auth_uid isn't linked yet (seed users).
   * Requires migration 00009 email-based RLS policies to work.
   */
  async function loadAppUser(supabase: SupabaseClient, authUid: string, authEmail?: string) {
    console.log(`[Auth] loadAppUser called for authUid=${authUid} email=${authEmail ?? 'unknown'}`);

    // Try by auth_uid first
    console.log('[Auth] Querying users table by auth_uid...');
    let { data: userRow, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_uid', authUid)
      .eq('is_active', true)
      .maybeSingle();

    console.log('[Auth] Users query by auth_uid:', { found: !!userRow, error: userError?.message ?? null });

    // Fallback: match by email (works thanks to users_select_self_by_email RLS policy)
    if (!userRow && !userError && authEmail) {
      console.log(`[Auth] Trying email fallback: ${authEmail}`);
      const { data: emailRow, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authEmail)
        .eq('is_active', true)
        .maybeSingle();

      console.log('[Auth] Users query by email:', { found: !!emailRow, error: emailError?.message ?? null });

      if (emailRow && !emailError) {
        // Link auth_uid for future logins (works thanks to users_update_self_by_email RLS policy)
        console.log(`[Auth] Linking auth_uid to user id=${(emailRow as Record<string, unknown>).id}`);
        const { error: linkError } = await supabase
          .from('users')
          .update({ auth_uid: authUid } as never)
          .eq('id', (emailRow as Record<string, unknown>).id as string);

        if (linkError) {
          console.warn('[Auth] Failed to link auth_uid (non-fatal):', linkError.message);
        } else {
          console.log('[Auth] auth_uid linked successfully');
        }
        userRow = emailRow;
      }
    }

    if (!userRow) {
      console.warn('[Auth] No user row found by auth_uid or email');
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

    console.log(`[Auth] App user loaded: id=${appUser.id} email=${appUser.email} role=${appUser.role} tenantId=${appUser.tenantId}`);
    setCurrentUser(appUser);
    setActiveTenantId(appUser.tenantId);

    // Load tenant (email-based RLS policy on tenants handles bootstrap)
    console.log('[Auth] Querying tenants table...');
    const { data: tenantRows, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true);

    console.log('[Auth] Tenants query:', { count: tenantRows?.length ?? 0, error: tenantError?.message ?? null });

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

    console.log('[Auth] loadAppUser complete');
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
