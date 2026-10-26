-- Demo / pre-Stripe checkout orders

create table if not exists public.checkout_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text not null,
  address_line1 text not null,
  city text not null,
  postal_code text not null,
  country text not null default 'GR',
  notes text,
  discount_code text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'EUR',
  line_items jsonb not null default '[]'::jsonb,
  status text not null default 'demo_pending',
  locale text not null default 'el',
  created_at timestamptz not null default now()
);

create index checkout_orders_created_at_idx
  on public.checkout_orders (created_at desc);

create index checkout_orders_email_idx
  on public.checkout_orders (email);

alter table public.checkout_orders enable row level security;
