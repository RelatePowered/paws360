'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
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
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auth session listener ──
  useEffect(() => {
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Safety timeout: if loading hasn't resolved in 15s, force it off
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 15000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user && (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            await loadAppUser();
          } else if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)) {
            setCurrentUser(null);
            setActiveTenantId(null);
            setTenants([]);
          }
        } catch {
          setCurrentUser(null);
          setActiveTenantId(null);
          setTenants([]);
        } finally {
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
   * Fetch the app-level user profile via server-side API route.
   * This avoids browser-side PostgREST calls which hang.
   * The API route uses the server Supabase client with cookies.
   */
  async function loadAppUser() {
    const res = await fetch('/api/auth/me', { credentials: 'same-origin' });

    if (!res.ok) {
      setCurrentUser(null);
      return;
    }

    const data = await res.json();

    if (!data.user) {
      setCurrentUser(null);
      return;
    }

    const u = data.user;
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
      authUid: u.auth_uid,
    };

    setCurrentUser(appUser);
    setActiveTenantId(appUser.tenantId);

    if (data.tenants?.length) {
      setTenants(
        data.tenants.map((t: Record<string, unknown>) => ({
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
