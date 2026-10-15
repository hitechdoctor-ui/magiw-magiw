-- Optional metadata for Virtual Try-On (IDM-VTON garment_des + category)

alter table public.products
  add column if not exists garment_description text,
  add column if not exists try_on_category text
    check (try_on_category is null or try_on_category in ('dresses', 'upper_body', 'lower_body'));

comment on column public.products.garment_description is
  'English garment_des prompt for Replicate IDM-VTON (length, silhouette, fabric).';
comment on column public.products.try_on_category is
  'IDM-VTON category: dresses, upper_body, or lower_body.';
