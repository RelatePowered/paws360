-- Migration: Add subscription plan to tenants
-- Supports plan-based feature gating (starter, professional, enterprise).

alter table public.tenants
  add column if not exists plan text not null default 'starter';

-- Add check constraint for valid plan values
alter table public.tenants
  add constraint tenants_plan_check
  check (plan in ('starter', 'professional', 'enterprise'));

comment on column public.tenants.plan is 'Subscription tier: starter, professional, or enterprise';
