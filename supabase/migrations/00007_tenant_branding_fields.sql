-- Add website and EIN columns to tenants for branding configuration
alter table tenants add column if not exists website text;
alter table tenants add column if not exists ein text;
