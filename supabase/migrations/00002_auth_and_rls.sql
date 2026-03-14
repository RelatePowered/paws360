-- ============================================================
-- Migration 2: Authentication, authorization & tenant-scoped RLS
-- ============================================================

-- ── Schema changes ───────────────────────────────────────────

-- Add auth_uid to link app users → Supabase auth.users
alter table users add column if not exists auth_uid uuid unique;

-- Expand role to include super_admin
alter table users drop constraint if exists users_role_check;
alter table users add constraint users_role_check
  check (role in ('super_admin', 'admin', 'staff'));

-- Per-user module permissions (overrides role defaults)
alter table users add column if not exists permissions jsonb not null default '{}';

-- Index for fast lookup by auth uid
create index if not exists idx_users_auth_uid on users(auth_uid);

-- ── Helper function: resolve current user's tenant ───────────

create or replace function auth_tenant_id()
returns text
language sql
stable
security definer
as $$
  select tenant_id from users where auth_uid = auth.uid() limit 1;
$$;

-- Helper: is the current user a super_admin?
create or replace function is_super_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists(
    select 1 from users
    where auth_uid = auth.uid() and role = 'super_admin'
  );
$$;

-- ── Drop permissive dev policies ─────────────────────────────

do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'tenants','users','people','moves','organizations',
      'donations','animals','admin_tags','alert_rules',
      'adopters','structured_notes','adoptions','animal_returns'
    ])
  loop
    execute format('drop policy if exists "Allow all during dev" on %I', tbl);
  end loop;
end $$;

-- ── Tenants policies ─────────────────────────────────────────
-- Super admins see all tenants; regular users see only their own.

create policy "tenants_select" on tenants
  for select using (
    is_super_admin() or id = auth_tenant_id()
  );

create policy "tenants_modify" on tenants
  for all using (is_super_admin())
  with check (is_super_admin());

-- ── Users policies ───────────────────────────────────────────
-- Users see other users in their own tenant. Super admins see all.
-- Only admins+ can insert/update users within their tenant.

create policy "users_select" on users
  for select using (
    is_super_admin() or tenant_id = auth_tenant_id()
  );

create policy "users_insert" on users
  for insert with check (
    is_super_admin()
    or (
      tenant_id = auth_tenant_id()
      and exists(
        select 1 from users
        where auth_uid = auth.uid() and role in ('admin', 'super_admin')
      )
    )
  );

create policy "users_update" on users
  for update using (
    is_super_admin()
    or (
      tenant_id = auth_tenant_id()
      and exists(
        select 1 from users
        where auth_uid = auth.uid() and role in ('admin', 'super_admin')
      )
    )
  );

create policy "users_delete" on users
  for delete using (
    is_super_admin()
  );

-- ── Tenant-scoped data policies (people, animals, etc.) ──────
-- Pattern: SELECT/INSERT/UPDATE scoped to own tenant. Super admins bypass.
-- DELETE restricted to admins within their tenant or super admins.

do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'people','moves','organizations','donations','animals',
      'admin_tags','alert_rules','adopters','structured_notes',
      'adoptions','animal_returns'
    ])
  loop
    -- SELECT: own tenant or super admin
    execute format(
      'create policy %I on %I for select using (
        is_super_admin() or tenant_id = auth_tenant_id()
      )',
      tbl || '_select', tbl
    );

    -- INSERT: own tenant or super admin
    execute format(
      'create policy %I on %I for insert with check (
        is_super_admin() or tenant_id = auth_tenant_id()
      )',
      tbl || '_insert', tbl
    );

    -- UPDATE: own tenant or super admin
    execute format(
      'create policy %I on %I for update using (
        is_super_admin() or tenant_id = auth_tenant_id()
      )',
      tbl || '_update', tbl
    );

    -- DELETE: admin within own tenant or super admin
    execute format(
      'create policy %I on %I for delete using (
        is_super_admin()
        or (
          tenant_id = auth_tenant_id()
          and exists(
            select 1 from users
            where auth_uid = auth.uid() and role in (''admin'', ''super_admin'')
          )
        )
      )',
      tbl || '_delete', tbl
    );
  end loop;
end $$;

-- ── Seed: promote Alice Admin to super_admin for dev ─────────

update users set role = 'super_admin', permissions = '{
  "dashboard": "edit",
  "people": "edit",
  "animals": "edit",
  "adoptions": "edit",
  "donations": "edit",
  "organizations": "edit",
  "reports": "edit",
  "admin": "edit"
}'::jsonb where id = 'user-1';

-- Give Bob Staff default staff permissions
update users set permissions = '{
  "dashboard": "view",
  "people": "view",
  "animals": "edit",
  "adoptions": "edit",
  "donations": "view",
  "organizations": "view",
  "reports": "view",
  "admin": "none"
}'::jsonb where id = 'user-2';

-- Carol Director keeps admin role
update users set permissions = '{
  "dashboard": "edit",
  "people": "edit",
  "animals": "edit",
  "adoptions": "edit",
  "donations": "edit",
  "organizations": "edit",
  "reports": "edit",
  "admin": "edit"
}'::jsonb where id = 'user-3';
