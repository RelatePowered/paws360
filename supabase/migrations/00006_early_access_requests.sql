-- ============================================================
-- Migration 6: Early access request form submissions
-- ============================================================

create table early_access_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company_name text not null,
  staff_count text not null,
  animals_per_year text not null,
  role text not null,
  created_at timestamptz not null default now()
);

alter table early_access_requests enable row level security;

-- Allow anonymous inserts (public form, no auth required)
create policy "early_access_insert" on early_access_requests
  for insert with check (true);

-- Only super admins can view submissions
create policy "early_access_select" on early_access_requests
  for select using (is_super_admin());
