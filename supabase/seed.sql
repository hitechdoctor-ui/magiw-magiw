insert into public.products (id, name, slug, sku, description, price_cents, sizes, stock) values
  (
    'f5000000-0000-0000-0000-000000000005',
    'NOVEMBER TULLE SET',
    'november-tulle-set',
    'MM-NT001',
    'Black stripe-sleeve top με full-length pleated tulle maxi φούστα.',
    18400,
    array['XS', 'S', 'M', 'L', 'XL'],
    6
  ),
  (
    'e4000000-0000-0000-0000-000000000004',
    'EVELINA SHIMMER SET',
    'evelina-shimmer-set',
    'MM-EV001',
    'Evening σετ: metallic gold blouse, black mini skirt και open blazer.',
    19600,
    array['XS', 'S', 'M', 'L'],
    5
  ),
  (
    'd3000000-0000-0000-0000-000000000003',
    'ANGEL INSPIRATION SET',
    'angel-inspiration-set',
    'MM-AI001',
    'Τριών τεμαχίων editorial σετ με denim corset, hooded top και wide-leg stripe trouser.',
    22800,
    array['XS', 'S', 'M', 'L'],
    4
  ),
  (
    'c2000000-0000-0000-0000-000000000002',
    'ATELIER GREEN SATIN DRESS',
    'atelier-green-satin-dress',
    'AIG-GW001',
    'Χειροποίητο maxi φόρεμα από εξαιρετικής ποιότητας σατέν ύφασμα σε σμαραγδί απόχρωση.',
    11000,
    array['S', 'M', 'L', 'XL'],
    5
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Red Velvet Coat',
    'red-velvet-coat',
    'MW-RVC001',
    'Χειροποίητο βελούδινο παλτό, σχεδιασμένο και κομμένο στο χέρι. Διαθέτει μεταξωτή φόδρα και premium ραφή.',
    12000,
    array['S', 'M', 'L', 'XL'],
    8
  ),
  (
    'b1000000-0000-0000-0000-000000000001',
    'ΣΕΤ: ΜΑΤ ΜΑΥΡΟ ΜΠΟΥΣΤΙΕ & ΦΟΥΣΤΑ',
    'handmade-satin-bustier-skirt-set',
    'MM-BT001',
    'Ματ μαύρο σετ με bustier top και maxi φούστα — χειροποίητο πατρόν.',
    7500,
    array['S', 'M', 'L'],
    6
  )
on conflict (slug) do update set
  sku = excluded.sku,
  name = excluded.name,
  description = excluded.description,
  price_cents = excluded.price_cents,
  sizes = excluded.sizes,
  stock = excluded.stock;

insert into public.instagram_posts (
  instagram_id, media_type, media_url, caption, aspect_ratio, product_id, display_order, is_featured, posted_at
) values
  (
    'magiw_november_tulle',
    'image',
    '/images/products/november-tulle-set/01-motion.jpg',
    'November — black tulle maxi & stripe top.',
    0.75,
    'f5000000-0000-0000-0000-000000000005',
    140,
    true,
    now() - interval '3 hours'
  ),
  (
    'magiw_evelina_set',
    'image',
    '/images/products/evelina-set/01-front.jpg',
    'Evelina — gold shimmer & black mini.',
    0.75,
    'e4000000-0000-0000-0000-000000000004',
    130,
    true,
    now() - interval '6 hours'
  ),
  (
    'magiw_angel_inspiration',
    'image',
    '/images/products/angel-inspiration/01-full.jpg',
    'Angel Inspiration — layered denim & knit.',
    0.75,
    'd3000000-0000-0000-0000-000000000003',
    120,
    true,
    now() - interval '12 hours'
  ),
  (
    'magiw_aig_gw001',
    'image',
    '/images/products/aig-gw001-1.jpg',
    'Emerald satin — atelier edition.',
    0.8,
    'c2000000-0000-0000-0000-000000000002',
    110,
    true,
    now() - interval '1 day'
  ),
  (
    'magiw_red_velvet',
    'image',
    '/velvet-1.jpg',
    'Red velvet, hand-finished in Athens.',
    0.8,
    'a3333333-3333-3333-3333-333333333333',
    100,
    true,
    now() - interval '2 days'
  ),
  (
    'magiw_black_set',
    'image',
    '/images/sample-set.jpg',
    'Matte black satin — bustier & maxi skirt.',
    0.8,
    'b1000000-0000-0000-0000-000000000001',
    90,
    true,
    now() - interval '3 days'
  );
