-- ============================================================
-- Humane Society Platform — Shelter Operations Schema
-- ============================================================
-- Adds: Asilomar condition tracking, medical records, foster
-- management, kennel locations, outcome tracking, SAC reporting
-- ============================================================

-- ── Alter Animals table ────────────────────────────────────
-- Add Asilomar condition, outcome tracking, altered status,
-- DOB, kennel location, hold period, foster link

alter table animals
  add column if not exists intake_condition text not null default 'healthy'
    check (intake_condition in ('healthy', 'treatable-rehabilitable', 'treatable-manageable', 'unhealthy-untreatable')),
  add column if not exists altered_status text not null default 'unknown'
    check (altered_status in ('intact', 'spayed', 'neutered', 'unknown')),
  add column if not exists date_of_birth text,
  add column if not exists kennel_location text,
  add column if not exists hold_expiration_date text,
  add column if not exists outcome_type text
    check (outcome_type in ('adoption', 'return-to-owner', 'transfer-out', 'euthanasia-owner-request', 'euthanasia-shelter', 'died-in-care', 'missing', 'other')),
  add column if not exists outcome_date text,
  add column if not exists foster_home_id text;

-- Update status check to include euthanized
alter table animals drop constraint if exists animals_status_check;
alter table animals add constraint animals_status_check
  check (status in ('intake', 'available', 'adopted', 'foster', 'medical-hold', 'transferred', 'deceased', 'euthanized'));

-- ── Medical Records ────────────────────────────────────────

create table if not exists medical_records (
  id            text primary key,
  tenant_id     text not null references tenants(id),
  animal_id     text not null references animals(id),
  type          text not null check (type in ('vaccination', 'surgery', 'treatment', 'exam', 'medication', 'test')),
  description   text not null,
  date          text not null,
  veterinarian  text,
  notes         text,
  next_due_date text,
  created_at    text not null default to_char(now(), 'YYYY-MM-DD')
);

-- ── Foster Homes ───────────────────────────────────────────

create table if not exists foster_homes (
  id                 text primary key,
  tenant_id          text not null references tenants(id),
  person_id          text,
  first_name         text not null,
  last_name          text not null,
  email              text not null,
  phone              text not null,
  address            text,
  city               text,
  state              text,
  zip                text,
  capacity           integer not null default 1,
  current_count      integer not null default 0,
  species_preference jsonb not null default '[]',
  size_preference    jsonb not null default '[]',
  is_active          boolean not null default true,
  notes              text,
  created_at         text not null default to_char(now(), 'YYYY-MM-DD'),
  updated_at         text not null default to_char(now(), 'YYYY-MM-DD')
);

-- ── Foster Placements ──────────────────────────────────────

create table if not exists foster_placements (
  id             text primary key,
  tenant_id      text not null references tenants(id),
  animal_id      text not null references animals(id),
  animal_name    text not null,
  foster_home_id text not null references foster_homes(id),
  foster_name    text not null,
  start_date     text not null,
  end_date       text,
  status         text not null check (status in ('active', 'completed', 'foster-to-adopt')),
  notes          text,
  created_at     text not null default to_char(now(), 'YYYY-MM-DD')
);

-- ── Kennel Locations ───────────────────────────────────────

create table if not exists kennel_locations (
  id                 text primary key,
  tenant_id          text not null references tenants(id),
  name               text not null,
  zone               text not null,
  species            text not null check (species in ('dog', 'cat', 'bird', 'rabbit', 'other')),
  size               text not null check (size in ('small', 'medium', 'large', 'extra-large')),
  is_occupied        boolean not null default false,
  current_animal_id  text,
  current_animal_name text,
  notes              text
);

-- ── RLS ────────────────────────────────────────────────────

alter table medical_records enable row level security;
alter table foster_homes enable row level security;
alter table foster_placements enable row level security;
alter table kennel_locations enable row level security;

do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'medical_records','foster_homes','foster_placements','kennel_locations'
    ])
  loop
    execute format(
      'create policy "Allow all during dev" on %I for all using (true) with check (true)',
      tbl
    );
  end loop;
end $$;

-- ── Indexes ────────────────────────────────────────────────

create index if not exists idx_medical_records_tenant on medical_records(tenant_id);
create index if not exists idx_medical_records_animal on medical_records(animal_id);
create index if not exists idx_foster_homes_tenant on foster_homes(tenant_id);
create index if not exists idx_foster_placements_tenant on foster_placements(tenant_id);
create index if not exists idx_foster_placements_animal on foster_placements(animal_id);
create index if not exists idx_foster_placements_home on foster_placements(foster_home_id);
create index if not exists idx_kennel_locations_tenant on kennel_locations(tenant_id);
create index if not exists idx_animals_intake_condition on animals(intake_condition);
create index if not exists idx_animals_outcome_type on animals(outcome_type);
