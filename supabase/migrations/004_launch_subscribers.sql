-- Launch list + 5% welcome discount codes

create table if not exists public.launch_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  discount_code text not null,
  discount_percent smallint not null default 5 check (discount_percent > 0 and discount_percent <= 100),
  locale text not null default 'el',
  created_at timestamptz not null default now(),
  constraint launch_subscribers_email_unique unique (email),
  constraint launch_subscribers_code_unique unique (discount_code)
);

create index launch_subscribers_created_at_idx
  on public.launch_subscribers (created_at desc);

alter table public.launch_subscribers enable row level security;

-- No public policies: inserts/reads go through the app API with service role only.
