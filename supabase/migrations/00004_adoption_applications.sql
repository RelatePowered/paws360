-- Migration: Adoption Applications table
-- Stores adoption application submissions and their review workflow.

create table if not exists public.adoption_applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  animal_name text not null,
  applicant_name text not null,
  applicant_email text not null,
  applicant_phone text not null,
  address text,
  city text,
  state text,
  zip text,
  household_type text not null default 'house',
  has_yard boolean not null default false,
  has_fence boolean not null default false,
  other_pets text not null default 'None',
  other_pets_details text,
  has_children boolean not null default false,
  children_ages text,
  experience text not null default '',
  veterinarian_name text,
  veterinarian_phone text,
  reason_for_adopting text not null default '',
  status text not null default 'submitted',
  review_notes text,
  reviewed_by text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_adoption_applications_tenant on public.adoption_applications(tenant_id);
create index if not exists idx_adoption_applications_animal on public.adoption_applications(animal_id);
create index if not exists idx_adoption_applications_status on public.adoption_applications(status);

-- RLS
alter table public.adoption_applications enable row level security;

-- Dev-mode permissive policy (restrict in production)
create policy "adoption_applications_tenant_access"
  on public.adoption_applications
  for all
  using (true)
  with check (true);

-- Also add checkout_donation column to adoptions table
alter table public.adoptions add column if not exists checkout_donation numeric;
