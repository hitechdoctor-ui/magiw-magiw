alter table public.products
  add column if not exists image_urls text[] not null default '{}';

comment on column public.products.image_urls is
  'Public paths under /images/... for PDP gallery (AI copilot uploads).';
