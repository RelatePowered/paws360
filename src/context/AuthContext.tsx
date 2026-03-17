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
   * Uses a security-definer RPC to bypass RLS chicken-and-egg:
   * RLS policies depend on auth_uid being set, but seed/manual users
   * may not have it set yet. The RPC handles lookup + auto-linking.
   */
  async function loadAppUser(supabase: SupabaseClient, authUid: string, authEmail?: string) {
    console.log(`[Auth] loadAppUser called for authUid=${authUid} email=${authEmail ?? 'unknown'}`);

    // Call the security-definer RPC that bypasses RLS
    console.log('[Auth] Calling resolve_auth_user RPC...');
    const { data: result, error: rpcError } = await supabase
      .rpc('resolve_auth_user', {
        p_auth_uid: authUid,
        p_email: authEmail ?? '',
      });

    console.log('[Auth] resolve_auth_user result:', {
      hasResult: !!result,
      hasUser: !!result?.user,
      hasTenant: !!result?.tenant,
      error: rpcError?.message ?? null,
    });

    if (rpcError) {
      console.error('[Auth] resolve_auth_user RPC error:', rpcError);
      setCurrentUser(null);
      return;
    }

    if (!result || !result.user) {
      console.warn('[Auth] No user found by auth_uid or email — user does not exist in users table');
      setCurrentUser(null);
      return;
    }

    const u = result.user;
    const appUser: User = {
      id: u.id,
      tenantId: u.tenant_id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
      permissions: u.permissions ?? {},
      isActive: u.is_active,
      createdAt: u.created_at,
      lastLoginAt: u.last_login_at ?? undefined,
      authUid: authUid,
    };

    console.log(`[Auth] App user loaded: id=${appUser.id} email=${appUser.email} role=${appUser.role} tenantId=${appUser.tenantId}`);
    setCurrentUser(appUser);
    setActiveTenantId(appUser.tenantId);

    // Set tenant from the RPC result
    const t = result.tenant;
    if (t) {
      setTenants([{
        id: t.id,
        name: t.name,
        slug: t.slug,
        plan: t.plan ?? 'starter',
        address: t.address ?? undefined,
        city: t.city ?? undefined,
        state: t.state ?? undefined,
        zip: t.zip ?? undefined,
        phone: t.phone ?? undefined,
        email: t.email ?? undefined,
        logoUrl: t.logo_url ?? undefined,
        website: t.website ?? undefined,
        ein: t.ein ?? undefined,
        createdAt: t.created_at,
        isActive: t.is_active,
      }]);
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
