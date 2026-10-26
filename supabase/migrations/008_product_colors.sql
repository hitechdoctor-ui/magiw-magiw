alter table public.products
  add column if not exists colors text[] not null default '{}';

comment on column public.products.colors is
  'Available color options (Greek labels), e.g. Πράσινο, Λευκό';
