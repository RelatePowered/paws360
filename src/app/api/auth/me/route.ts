import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

/**
 * GET /api/auth/me
 *
 * Server-side user resolution. Returns the authenticated user's app-level
 * profile and tenant data. This avoids browser-side PostgREST calls which
 * can hang due to connection/cookie issues with createBrowserClient.
 *
 * Flow:
 * 1. Verify auth via getUser() (uses cookies set by middleware)
 * 2. Look up users row by auth_uid, fallback to email match
 * 3. If matched by email, auto-link auth_uid for future logins
 * 4. Return user + tenant JSON
 */
export async function GET() {
  try {
    const supabase = await createServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    // Verify the authenticated user from cookies
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const authUid = authUser.id;
    const authEmail = authUser.email;

    // Try by auth_uid first
    let { data: userRow, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_uid', authUid)
      .eq('is_active', true)
      .maybeSingle();

    if (userError) { /* query error */ }

    // Fallback: match by email and auto-link auth_uid
    if (!userRow && authEmail) {
      const { data: emailRow, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (emailError) { /* query error */ }

      if (emailRow && !emailError) {
        // Auto-link auth_uid
        const { error: linkError } = await supabase
          .from('users')
          .update({ auth_uid: authUid } as never)
          .eq('id', (emailRow as Record<string, unknown>).id as string);

        if (linkError) { /* link error */ }
        userRow = emailRow;
      }
    }

    if (!userRow) {
      return NextResponse.json({ error: 'No user profile found' }, { status: 404 });
    }

    // Load tenant
    const row = userRow as Record<string, unknown>;
    const { data: tenantRows, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true);

    if (tenantError) { /* query error */ }

    return NextResponse.json({
      user: {
        id: row.id,
        tenant_id: row.tenant_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        role: row.role,
        permissions: row.permissions ?? {},
        is_active: row.is_active,
        created_at: row.created_at,
        last_login_at: row.last_login_at,
        auth_uid: authUid,
      },
      tenants: (tenantRows ?? []).map((t: Record<string, unknown>) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        plan: t.plan ?? 'starter',
        address: t.address,
        city: t.city,
        state: t.state,
        zip: t.zip,
        phone: t.phone,
        email: t.email,
        logo_url: t.logo_url,
        website: t.website,
        ein: t.ein,
        created_at: t.created_at,
        is_active: t.is_active,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
