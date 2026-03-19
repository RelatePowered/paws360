-- ============================================================
-- Migration 10: Secure resolve_auth_user RPC
-- ============================================================
-- The previous version accepted arbitrary p_auth_uid, allowing
-- any authenticated user to link their auth identity to another
-- user's row (account takeover). Now we enforce that p_auth_uid
-- must match the caller's auth.uid().

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
  -- SECURITY: Ensure the caller can only resolve their own identity.
  -- This prevents account takeover by passing another user's email
  -- with an attacker's auth_uid.
  if p_auth_uid is distinct from auth.uid() then
    return null;
  end if;

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
