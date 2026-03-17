-- ============================================================
-- Migration 9: Allow users to bootstrap their own auth session
-- ============================================================
-- The existing users_select policy depends on is_super_admin() and
-- auth_tenant_id(), both of which look up auth_uid = auth.uid().
-- Seed users or manually-created users have auth_uid = NULL, so
-- RLS blocks all reads and the app can't bootstrap.
--
-- Fix: let authenticated users read and update their own row
-- by matching email from the JWT. This handles the first-login
-- case where auth_uid hasn't been linked yet.

-- Allow users to SELECT their own row by email
create policy "users_select_self_by_email" on users
  for select using (
    email = (auth.jwt() ->> 'email')
  );

-- Allow users to UPDATE their own row by email (to link auth_uid)
create policy "users_update_self_by_email" on users
  for update using (
    email = (auth.jwt() ->> 'email')
  ) with check (
    email = (auth.jwt() ->> 'email')
  );

-- Also allow users to SELECT their own tenant once matched by email
-- (needed because tenants_select depends on auth_tenant_id() which
-- requires auth_uid to be set)
create policy "tenants_select_by_user_email" on tenants
  for select using (
    id in (
      select tenant_id from users
      where email = (auth.jwt() ->> 'email') and is_active = true
    )
  );
