insert into public.products (id, name, slug, description, price_cents, sizes, stock) values
  (
    'a1111111-1111-1111-1111-111111111111',
    'Deconstructed Blazer',
    'deconstructed-blazer',
    'Oversized blazer με ασύμμετρα κουμπιά και raw edges.',
    28900,
    array['XS', 'S', 'M', 'L'],
    12
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Sculpted Midi Dress',
    'sculpted-midi-dress',
    'Midi φόρεμα με draped λεπτομέρειες και ελαφριά stretch ύφανση.',
    19500,
    array['XS', 'S', 'M'],
    8
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Asymmetric Knit Top',
    'asymmetric-knit-top',
    'Fine knit τοπ με one-shoulder γραμμή.',
    8900,
    array['XS', 'S', 'M', 'L'],
    20
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Wide Pleat Trousers',
    'wide-pleat-trousers',
    'Παντελόνι με deep pleats και high waist.',
    14200,
    array['34', '36', '38', '40'],
    15
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    'Statement Trench',
    'statement-trench',
    'Trench coat με exaggerated collar και belt detail.',
    34900,
    array['S', 'M', 'L'],
    6
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    'Layered Mesh Skirt',
    'layered-mesh-skirt',
    'Διπλό mesh φούστα με sheer overlay.',
    11800,
    array['XS', 'S', 'M'],
    10
  );

insert into public.instagram_posts (
  instagram_id, media_type, media_url, thumbnail_url, caption, aspect_ratio, product_id, display_order, is_featured, posted_at
) values
  (
    'magiw_001',
    'image',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    null,
    'Deconstructed silhouettes for the in-between season.',
    0.8,
    'a1111111-1111-1111-1111-111111111111',
    100,
    true,
    now() - interval '2 days'
  ),
  (
    'magiw_002',
    'reel',
    'https://videos.pexels.com/video-files/4761786/4761786-uhd_1440_2732_25fps.mp4',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80',
    'Movement study — sculpted midi in motion.',
    0.5625,
    'a2222222-2222-2222-2222-222222222222',
    90,
    true,
    now() - interval '3 days'
  ),
  (
    'magiw_003',
    'image',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    null,
    'Texture play. Knit meets structure.',
    1.0,
    'a3333333-3333-3333-3333-333333333333',
    80,
    false,
    now() - interval '5 days'
  ),
  (
    'magiw_004',
    'image',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    null,
    'Wide pleats, narrow focus.',
    0.75,
    'a4444444-4444-4444-4444-444444444444',
    70,
    false,
    now() - interval '6 days'
  ),
  (
    'magiw_005',
    'reel',
    'https://videos.pexels.com/video-files/5481517/5481517-uhd_1440_2732_25fps.mp4',
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
    'Statement outerwear — shop the trench.',
    0.5625,
    'a5555555-5555-5555-5555-555555555555',
    60,
    true,
    now() - interval '8 days'
  ),
  (
    'magiw_006',
    'image',
    'https://images.unsplash.com/photo-1469334031216-e425a81287a2?w=800&q=80',
    null,
    'Sheer layers for evening light.',
    0.8,
    'a6666666-6666-6666-6666-666666666666',
    50,
    false,
    now() - interval '10 days'
  );
