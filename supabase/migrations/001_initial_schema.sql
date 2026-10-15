-- MAGIW MAGIW — Shoppable Instagram Feed schema

create extension if not exists "pgcrypto";

create type media_type as enum ('image', 'reel');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'EUR',
  sizes text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.instagram_posts (
  id uuid primary key default gen_random_uuid(),
  instagram_id text unique,
  media_type media_type not null default 'image',
  media_url text not null,
  thumbnail_url text,
  caption text,
  aspect_ratio numeric(4, 3) not null default 1.0,
  product_id uuid references public.products (id) on delete set null,
  display_order integer not null default 0,
  is_featured boolean not null default false,
  posted_at timestamptz,
  created_at timestamptz not null default now()
);

create index instagram_posts_display_order_idx on public.instagram_posts (display_order desc);
create index instagram_posts_product_id_idx on public.instagram_posts (product_id);

alter table public.products enable row level security;
alter table public.instagram_posts enable row level security;

create policy "Public read products"
  on public.products for select
  using (is_active = true);

create policy "Public read instagram posts"
  on public.instagram_posts for select
  using (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();
