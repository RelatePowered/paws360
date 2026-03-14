-- ============================================================
-- Humane Society Platform — Initial Schema
-- ============================================================
-- All tables are tenant-scoped via tenant_id + RLS policies.
-- Run this migration against your Supabase project.
-- ============================================================

-- ── Tenants ──────────────────────────────────────────────────

create table if not exists tenants (
  id          text primary key,
  name        text not null,
  slug        text not null unique,
  address     text,
  city        text,
  state       text,
  zip         text,
  phone       text,
  email       text,
  logo_url    text,
  created_at  text not null default to_char(now(), 'YYYY-MM-DD'),
  is_active   boolean not null default true
);

-- ── Users ────────────────────────────────────────────────────

create table if not exists users (
  id            text primary key,
  tenant_id     text not null references tenants(id),
  email         text not null,
  first_name    text not null,
  last_name     text not null,
  role          text not null check (role in ('admin', 'staff')),
  is_active     boolean not null default true,
  created_at    text not null default to_char(now(), 'YYYY-MM-DD'),
  last_login_at text
);

-- ── People ───────────────────────────────────────────────────

create table if not exists people (
  id                    text primary key,
  tenant_id             text not null references tenants(id),
  first_name            text not null,
  last_name             text not null,
  email                 text not null,
  phone                 text not null,
  address               text,
  city                  text,
  state                 text,
  zip                   text,
  roles                 jsonb not null default '[]',
  tags                  jsonb not null default '[]',
  organization_id       text,
  organization_name     text,
  created_at            text not null default to_char(now(), 'YYYY-MM-DD'),
  updated_at            text not null default to_char(now(), 'YYYY-MM-DD'),
  total_donations       numeric not null default 0,
  total_volunteer_hours numeric not null default 0,
  is_active             boolean not null default true
);

-- ── Moves (relationship history) ─────────────────────────────

create table if not exists moves (
  id         text primary key,
  tenant_id  text not null references tenants(id),
  person_id  text not null references people(id),
  from_roles jsonb not null default '[]',
  to_roles   jsonb not null default '[]',
  date       text not null,
  trigger    text
);

-- ── Organizations ────────────────────────────────────────────

create table if not exists organizations (
  id                     text primary key,
  tenant_id              text not null references tenants(id),
  name                   text not null,
  type                   text not null check (type in ('corporation', 'foundation', 'nonprofit', 'small-business', 'other')),
  ein                    text,
  contact_name           text not null,
  contact_email          text not null,
  contact_phone          text not null,
  address                text,
  city                   text,
  state                  text,
  zip                    text,
  member_ids             jsonb not null default '[]',
  roles                  jsonb not null default '[]',
  total_donations        numeric not null default 0,
  total_volunteer_hours  numeric not null default 0,
  matching_gift_program  boolean not null default false,
  match_ratio            numeric,
  tags                   jsonb not null default '[]',
  notes                  text,
  created_at             text not null default to_char(now(), 'YYYY-MM-DD'),
  updated_at             text not null default to_char(now(), 'YYYY-MM-DD'),
  is_active              boolean not null default true
);

-- ── Donations ────────────────────────────────────────────────

create table if not exists donations (
  id                text primary key,
  tenant_id         text not null references tenants(id),
  person_id         text,
  person_name       text,
  organization_id   text,
  organization_name text,
  type              text not null check (type in ('monetary', 'in-kind', 'time')),
  amount            numeric,
  description       text not null,
  date              text not null,
  category          text not null,
  hours             numeric,
  item_description  text,
  estimated_value   numeric,
  receipt_issued    boolean not null default false,
  notes             text
);

-- ── Animals ──────────────────────────────────────────────────

create table if not exists animals (
  id                text primary key,
  tenant_id         text not null references tenants(id),
  animal_id         text not null,
  name              text not null,
  species           text not null check (species in ('dog', 'cat', 'bird', 'rabbit', 'other')),
  breed             text not null,
  color             text not null,
  gender            text not null check (gender in ('male', 'female', 'unknown')),
  size              text not null check (size in ('small', 'medium', 'large', 'extra-large')),
  age               text,
  weight            numeric,
  microchip_id      text,
  status            text not null check (status in ('intake', 'available', 'adopted', 'foster', 'medical-hold', 'transferred', 'deceased')),
  intake_date       text not null,
  intake_type       text not null check (intake_type in ('stray', 'surrender', 'transfer', 'return', 'confiscation')),
  intake_person_id   text,
  intake_person_name text,
  description       text not null,
  medical_notes     jsonb not null default '[]',
  tags              jsonb not null default '[]',
  photo_url         text,
  created_at        text not null default to_char(now(), 'YYYY-MM-DD'),
  updated_at        text not null default to_char(now(), 'YYYY-MM-DD')
);

-- ── Admin Tags ───────────────────────────────────────────────

create table if not exists admin_tags (
  id         text primary key,
  tenant_id  text not null references tenants(id),
  label      text not null,
  category   text not null check (category in ('person', 'animal', 'adopter', 'donation', 'alert')),
  severity   text check (severity in ('info', 'warning', 'critical')),
  is_active  boolean not null default true,
  created_at text not null default to_char(now(), 'YYYY-MM-DD')
);

-- ── Alert Rules ──────────────────────────────────────────────

create table if not exists alert_rules (
  id          text primary key,
  tenant_id   text not null references tenants(id),
  name        text not null,
  description text not null,
  condition   text not null check (condition in ('return_count_gte', 'note_severity', 'custom')),
  threshold   integer not null,
  severity    text not null check (severity in ('info', 'warning', 'critical')),
  is_active   boolean not null default true
);

-- ── Adopters ─────────────────────────────────────────────────

create table if not exists adopters (
  id         text primary key,
  tenant_id  text not null references tenants(id),
  first_name text not null,
  last_name  text not null,
  email      text not null,
  phone      text not null,
  address    text,
  city       text,
  state      text,
  zip        text,
  flagged    boolean not null default false,
  created_at text not null default to_char(now(), 'YYYY-MM-DD'),
  updated_at text not null default to_char(now(), 'YYYY-MM-DD')
);

-- ── Structured Notes (on adopters) ───────────────────────────

create table if not exists structured_notes (
  id        text primary key,
  tenant_id text not null references tenants(id),
  adopter_id text not null references adopters(id),
  tag_id    text not null,
  tag_label text not null,
  severity  text not null check (severity in ('info', 'warning', 'critical')),
  date      text not null,
  added_by  text not null
);

-- ── Adoptions ────────────────────────────────────────────────

create table if not exists adoptions (
  id            text primary key,
  tenant_id     text not null references tenants(id),
  animal_id     text not null,
  animal_name   text not null,
  adopter_id    text not null,
  adopter_name  text not null,
  date          text not null,
  fee           numeric not null,
  status        text not null check (status in ('completed', 'pending', 'returned')),
  return_date   text,
  return_reason text
);

-- ── Animal Returns ───────────────────────────────────────────

create table if not exists animal_returns (
  id           text primary key,
  tenant_id    text not null references tenants(id),
  adoption_id  text not null references adoptions(id),
  animal_id    text not null,
  animal_name  text not null,
  adopter_id   text not null references adopters(id),
  date         text not null,
  reason_tag_id text not null,
  reason_label text not null
);

-- ── Row Level Security ───────────────────────────────────────
-- Enable RLS on all tenant-scoped tables. Policies will be
-- configured when Supabase Auth is wired up.

alter table tenants enable row level security;
alter table users enable row level security;
alter table people enable row level security;
alter table moves enable row level security;
alter table organizations enable row level security;
alter table donations enable row level security;
alter table animals enable row level security;
alter table admin_tags enable row level security;
alter table alert_rules enable row level security;
alter table adopters enable row level security;
alter table structured_notes enable row level security;
alter table adoptions enable row level security;
alter table animal_returns enable row level security;

-- Temporary permissive policies for development (replace with
-- proper auth-based policies before going to production).

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
    execute format(
      'create policy "Allow all during dev" on %I for all using (true) with check (true)',
      tbl
    );
  end loop;
end $$;

-- ── Indexes ──────────────────────────────────────────────────

create index if not exists idx_users_tenant on users(tenant_id);
create index if not exists idx_people_tenant on people(tenant_id);
create index if not exists idx_moves_tenant on moves(tenant_id);
create index if not exists idx_moves_person on moves(person_id);
create index if not exists idx_organizations_tenant on organizations(tenant_id);
create index if not exists idx_donations_tenant on donations(tenant_id);
create index if not exists idx_donations_person on donations(person_id);
create index if not exists idx_donations_org on donations(organization_id);
create index if not exists idx_animals_tenant on animals(tenant_id);
create index if not exists idx_animals_status on animals(status);
create index if not exists idx_admin_tags_tenant on admin_tags(tenant_id);
create index if not exists idx_alert_rules_tenant on alert_rules(tenant_id);
create index if not exists idx_adopters_tenant on adopters(tenant_id);
create index if not exists idx_structured_notes_adopter on structured_notes(adopter_id);
create index if not exists idx_adoptions_tenant on adoptions(tenant_id);
create index if not exists idx_adoptions_adopter on adoptions(adopter_id);
create index if not exists idx_animal_returns_adopter on animal_returns(adopter_id);
