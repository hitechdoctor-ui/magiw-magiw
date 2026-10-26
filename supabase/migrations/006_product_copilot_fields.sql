-- AI Product Copilot — extended catalog metadata

create type public.product_collection as enum (
  'Evelina''s',
  'Gino',
  'Evelina''s Kids & Baby'
);

alter table public.products
  add column if not exists subtitle text,
  add column if not exists category public.product_collection,
  add column if not exists features text[] not null default '{}',
  add column if not exists is_bundle boolean not null default false;

comment on column public.products.subtitle is
  'Collection line, e.g. Evelina Collection — April 2026';
comment on column public.products.category is
  'Brand line for merchandising filters';
comment on column public.products.features is
  'Bullet highlights for PDP accordion / SEO';
comment on column public.products.is_bundle is
  'True when the SKU represents a multi-piece look or set';
