-- ==============================================================================
-- NURSURY E-COMMERCE SEED DATA & ADMIN CREATION SCRIPT
-- Run this in Supabase SQL Editor after running 20261017000000_nursery_schema.sql
-- ==============================================================================

-- 1. SEED BOTANICAL CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, badge, tagline, is_active, sort_order)
VALUES
  (
    'c0000000-0000-0000-0000-000000000001',
    'Indoor Plants',
    'indoor-plants',
    'Purifying, easy-care greens designed to thrive in your interior living and work spaces.',
    '/images/cat_indoor.jpg',
    'Popular',
    'Lush Living Decor',
    true,
    1
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'Outdoor Plants',
    'outdoor-plants',
    'Hardy palms, shrubs, and architectural foliage ready to bring life to balconies and gardens.',
    '/images/cat_outdoor.jpg',
    'Sun Loving',
    'Balcony & Garden',
    true,
    2
  ),
  (
    'c0000000-0000-0000-0000-000000000003',
    'Flowering Plants',
    'flowering-plants',
    'Vibrant blossoms and fragrant floral beauties that bring uplifting colors and natural scent.',
    '/images/cat_flowering.jpg',
    'Aromatic',
    'Vibrant Blooms',
    true,
    3
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'Succulents',
    'succulents',
    'Sculptural, drought-tolerant rosette succulents and healing aloes for desks and windowsills.',
    '/images/cat_succulents.jpg',
    'Low Water',
    'Sculptural Greens',
    true,
    4
  ),
  (
    'c0000000-0000-0000-0000-000000000005',
    'Pots & Planters',
    'pots-planters',
    'Handcrafted ceramic, classic terracotta, and suspended hanging planters with natural finishes.',
    '/images/cat_pots.jpg',
    'Handcrafted',
    'Designer Vessels',
    true,
    5
  ),
  (
    'c0000000-0000-0000-0000-000000000006',
    'Gardening Essentials',
    'gardening-essentials',
    'Enriched potting soils, organic compost, precision watering cans, and ergonomic tools.',
    '/images/cat_gardening.jpg',
    'Organic Care',
    'Nourish & Grow',
    true,
    6
  )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    badge = EXCLUDED.badge,
    tagline = EXCLUDED.tagline,
    is_active = EXCLUDED.is_active;

-- 2. SEED CORE BOTANICAL PRODUCTS
INSERT INTO public.products (
  id, name, slug, category_id, price, original_price, stock_quantity, is_active,
  plant_type, light_requirement, size, watering, image_url, description,
  is_featured, is_bestseller, is_new_arrival, is_beginner_friendly, is_low_light, is_seasonal,
  tags, care_guide
)
VALUES
  (
    'd0000000-0000-0000-0000-000000000001',
    'Monstera Deliciosa',
    'monstera-deliciosa',
    'c0000000-0000-0000-0000-000000000001',
    699.00,
    899.00,
    24,
    true,
    'Foliage Plant',
    'Bright Indirect',
    'Medium',
    'Once a week when topsoil dries',
    '/images/onboarding_plant.jpg',
    'Known as the Swiss Cheese plant, the Monstera Deliciosa features iconic natural leaf perforations that add architectural drama and lush botanical tranquility to any modern living space.',
    true, true, false, true, false, false,
    ARRAY['Statement Plant', 'Air Purifying', 'Living Room', 'Bestseller'],
    '{"light": "Thrives in medium to bright indirect sunlight. Avoid harsh direct midday rays.", "watering": "Allow top 2 inches of soil to dry out between waterings.", "soil": "Rich, well-aerated potting mix with perlite.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000002',
    'Snake Plant (Sansevieria)',
    'snake-plant',
    'c0000000-0000-0000-0000-000000000001',
    449.00,
    599.00,
    38,
    true,
    'Air Purifier',
    'Low Light',
    'Medium',
    'Every 2-3 weeks (drought hardy)',
    '/images/plant_snake.jpg',
    'Renowned for its indestructible nature and NASA-certified air-purifying prowess, the Sansevieria displays upright sword-shaped foliage with striking golden-yellow margins.',
    true, true, false, true, true, false,
    ARRAY['Low Maintenance', 'Bedroom Safe', 'Air Purifying'],
    '{"light": "Performs happily in dim corners or bright indirect sun.", "watering": "Extremely drought tolerant. Water only when soil is completely dry.", "soil": "Fast-draining cactus blend.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000003',
    'Peace Lily (Spathiphyllum)',
    'peace-lily',
    'c0000000-0000-0000-0000-000000000001',
    549.00,
    699.00,
    18,
    true,
    'Flowering Plant',
    'Low Light',
    'Medium',
    'When top inch of soil feels dry',
    '/images/plant_peacelily.jpg',
    'An elegant indoor classic featuring glossy deep emerald foliage complemented by serene, pure white floral spathes. An exceptional air detoxifier.',
    true, false, false, true, true, false,
    ARRAY['Air Purifying', 'White Blooms', 'Indoor Classic'],
    '{"light": "Prefers moderate shade or filtered light.", "watering": "Keep soil evenly moist but never waterlogged.", "soil": "Moisture-retentive rich peat loam.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000004',
    'Fiddle Leaf Fig (Ficus Lyrata)',
    'fiddle-leaf-fig',
    'c0000000-0000-0000-0000-000000000001',
    1199.00,
    1499.00,
    12,
    true,
    'Foliage Plant',
    'Bright Indirect',
    'Large',
    'Every 7-10 days',
    '/images/plant_fiddleleaf.jpg',
    'The designer darling of interior foliage. Boasting violin-shaped sculptural leaves and an upright tree form that creates an instant architectural focal point.',
    true, false, true, false, false, false,
    ARRAY['Luxury Decor', 'Large Plant', 'Architectural'],
    '{"light": "Requires 4-6 hours of consistent bright indirect light.", "watering": "Water thoroughly once top 50% of potting mix is dry.", "soil": "Coarse well-draining soil mix.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000005',
    'ZZ Plant (Zamioculcas Zamiifolia)',
    'zz-plant',
    'c0000000-0000-0000-0000-000000000001',
    529.00,
    649.00,
    30,
    true,
    'Foliage Plant',
    'Low Light',
    'Medium',
    'Every 2-3 weeks',
    '/images/plant_zz.jpg',
    'With glossy feather-like fronds and underground water-storing tubers, the ZZ plant thrives on neglect and shines in modern interior settings.',
    false, true, false, true, true, false,
    ARRAY['Indestructible', 'Low Light', 'Desk Plant'],
    '{"light": "Tolerates low light, office fluorescent bulbs, and shadows.", "watering": "Water sparingly every 2-3 weeks.", "soil": "Fast draining potting blend.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000006',
    'Areca Palm',
    'areca-palm',
    'c0000000-0000-0000-0000-000000000002',
    899.00,
    1199.00,
    15,
    true,
    'Air Purifier',
    'Bright Indirect',
    'Large',
    'Twice a week in summer',
    '/images/plant_arecapalm.jpg',
    'Feathery arching fronds produce a lush tropical canopy, humidifying ambient indoor air and adding relaxing resort vibes to any home or terrace.',
    false, true, false, true, false, false,
    ARRAY['Tropical', 'Air Purifying', 'Balcony'],
    '{"light": "Bright indirect sun or dappled outdoor shade.", "watering": "Keep soil slightly moist during growth period.", "soil": "Sandy, slightly acidic potting compost.", "petFriendly": true}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000007',
    'Bougainvillea Glabra (Magenta)',
    'bougainvillea-magenta',
    'c0000000-0000-0000-0000-000000000003',
    349.00,
    499.00,
    22,
    true,
    'Flowering Plant',
    'Full Sun',
    'Medium',
    'Once a week; drought hardy',
    '/images/plant_bougainvillea.jpg',
    'Explosions of vibrant magenta paper bracts that flourish under relentless sunny skies. An iconic Indian balcony and courtyard spectacle.',
    true, false, false, true, false, true,
    ARRAY['Vibrant Blooms', 'Sun Lover', 'Balcony'],
    '{"light": "Needs at least 6 hours of direct sun daily.", "watering": "Water only when soil dries out completely.", "soil": "Gritty well-aerated garden mix.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000008',
    'Aloe Vera Healing Plant',
    'aloe-vera-healing',
    'c0000000-0000-0000-0000-000000000004',
    279.00,
    399.00,
    45,
    true,
    'Succulent',
    'Bright Indirect',
    'Small',
    'Every 2-3 weeks',
    '/images/plant_aloevera.jpg',
    'Succulent rosettes containing medicinal cooling gel. Perfect for sunny kitchen sills and requiring virtually no watering fuss.',
    false, true, false, true, false, false,
    ARRAY['Medicinal', 'Low Water', 'Kitchen Sill'],
    '{"light": "Bright indirect sunlight or morning gentle sun.", "watering": "Soak and dry method every 2 to 3 weeks.", "soil": "Cactus / perlite mix.", "petFriendly": false}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000009',
    'Artisanal Terracotta Planter (8-inch)',
    'terracotta-planter-8in',
    'c0000000-0000-0000-0000-000000000005',
    399.00,
    549.00,
    50,
    true,
    'Planter',
    'All Lighting',
    'Medium',
    'N/A',
    '/images/pot_terracotta.jpg',
    'Naturally porous terracotta fired in traditional kilns. Promotes optimal root aeration and prevents moisture rot with dedicated drainage.',
    false, false, true, true, false, false,
    ARRAY['Handcrafted', 'Breathable Clay', 'Porous'],
    '{"light": "Suitable for both indoor and outdoor placements.", "watering": "Porous walls allow excess moisture to evaporate naturally.", "soil": "Compatible with all potting soils.", "petFriendly": true}'::jsonb
  ),
  (
    'd0000000-0000-0000-0000-000000000010',
    'Organic Vermicompost & Neem Care Pack (5kg)',
    'organic-vermicompost-5kg',
    'c0000000-0000-0000-0000-000000000006',
    329.00,
    449.00,
    60,
    true,
    'Garden Supply',
    'All Lighting',
    'Large',
    'Apply monthly',
    '/images/soil_vermicompost.jpg',
    'Slow-release organic earthworm castings fortified with pure cold-pressed neem cake powder for robust root nourishment and pest deterrence.',
    false, true, false, true, false, false,
    ARRAY['100% Organic', 'Soil Nutrition', 'Bio Fertilizer'],
    '{"light": "Store in a cool, dry place away from direct sun.", "watering": "Water the plant well after top-dressing with compost.", "soil": "Blends into any soil mix.", "petFriendly": true}'::jsonb
  )
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    category_id = EXCLUDED.category_id,
    is_active = EXCLUDED.is_active;

-- ==============================================================================
-- 3. PROMOTING AN ADMINISTRATOR
-- ==============================================================================
-- After registering an account via the website or Supabase Auth dashboard,
-- run the query below to grant that user administrator privileges.
-- Replace 'admin@nursury.store' with the user's real email:
--
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin' FROM auth.users WHERE email = 'admin@nursury.store'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = now();
