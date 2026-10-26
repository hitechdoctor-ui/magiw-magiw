alter table public.products
  add column if not exists color_images jsonb not null default '{}'::jsonb;

comment on column public.products.color_images is
  'Map of color label to image URL for PDP color switcher';
