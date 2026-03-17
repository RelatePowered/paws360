-- ============================================================
-- Migration 8: RPC function to resolve and link auth users
-- ============================================================
-- When a user signs in via Supabase Auth but their users row doesn't
-- have auth_uid set yet (e.g. seed data or manually-created users),
-- RLS blocks all reads because is_super_admin() and auth_tenant_id()
-- both return false/null.
--
-- This security-definer function bypasses RLS to:
--   1. Look up the user by auth_uid
--   2. If not found, look up by email and auto-link auth_uid
--   3. Return the user row + tenant data as JSON

create or replace function resolve_auth_user(p_auth_uid uuid, p_email text)
returns jsonb
language plpgsql
stable
security definer
as $$
declare
  v_user record;
  v_tenant record;
begin
  -- First try by auth_uid
  select * into v_user from users
    where auth_uid = p_auth_uid and is_active = true
    limit 1;

  -- Fallback: match by email and link auth_uid
  if v_user is null and p_email is not null then
    select * into v_user from users
      where email = p_email and is_active = true
      limit 1;

    if v_user is not null then
      update users set auth_uid = p_auth_uid where id = v_user.id;
    end if;
  end if;

  -- No user found at all
  if v_user is null then
    return null;
  end if;

  -- Fetch the user's tenant
  select * into v_tenant from tenants
    where id = v_user.tenant_id and is_active = true
    limit 1;

  return jsonb_build_object(
    'user', jsonb_build_object(
      'id', v_user.id,
      'tenant_id', v_user.tenant_id,
      'email', v_user.email,
      'first_name', v_user.first_name,
      'last_name', v_user.last_name,
      'role', v_user.role,
      'permissions', v_user.permissions,
      'is_active', v_user.is_active,
      'created_at', v_user.created_at,
      'last_login_at', v_user.last_login_at,
      'auth_uid', p_auth_uid
    ),
    'tenant', case when v_tenant is not null then jsonb_build_object(
      'id', v_tenant.id,
      'name', v_tenant.name,
      'slug', v_tenant.slug,
      'plan', v_tenant.plan,
      'address', v_tenant.address,
      'city', v_tenant.city,
      'state', v_tenant.state,
      'zip', v_tenant.zip,
      'phone', v_tenant.phone,
      'email', v_tenant.email,
      'logo_url', v_tenant.logo_url,
      'website', v_tenant.website,
      'ein', v_tenant.ein,
      'created_at', v_tenant.created_at,
      'is_active', v_tenant.is_active
    ) else null end
  );
end;
$$;
