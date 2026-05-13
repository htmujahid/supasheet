-- Store Schema Seed Data
-- Uses hardcoded user IDs from supabase/seed.sql:
--   user_1: b73eb03e-fb7a-424d-84ff-18e2791ce0b8 (superadmin)
--   user_2: b73eb03e-fb7a-424d-84ff-18e2791ce0b1
----------------------------------------------------------------
-- Products (initial 12)
----------------------------------------------------------------
insert into
  store.products (
    id,
    sku,
    name,
    description,
    price,
    stock,
    status,
    category,
    tags,
    featured,
    created_at,
    updated_at
  )
values
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570001',
    'WHP-001',
    'Wireless Headphones',
    'Over-ear noise cancelling headphones with 30-hour battery life and premium sound quality.',
    79.99,
    45,
    'active',
    'Electronics',
    array['audio', 'wireless', 'noise-cancelling'],
    true,
    current_timestamp - interval '90 days',
    current_timestamp - interval '2 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570002',
    'RNS-002',
    'Running Shoes',
    'Lightweight, breathable running shoes with responsive cushioning for all-day comfort.',
    119.99,
    23,
    'active',
    'Footwear',
    array['running', 'sports', 'athletic'],
    false,
    current_timestamp - interval '80 days',
    current_timestamp - interval '5 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570003',
    'CMK-003',
    'Coffee Maker',
    '12-cup programmable coffee maker with built-in grinder and thermal carafe.',
    49.99,
    67,
    'active',
    'Kitchen',
    array['coffee', 'appliance'],
    false,
    current_timestamp - interval '75 days',
    current_timestamp - interval '10 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570004',
    'YGM-004',
    'Yoga Mat',
    'Non-slip, eco-friendly yoga mat with alignment lines and carry strap. 6mm thickness.',
    34.99,
    89,
    'active',
    'Sports',
    array['yoga', 'fitness', 'eco-friendly'],
    false,
    current_timestamp - interval '70 days',
    current_timestamp - interval '3 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570005',
    'LPS-005',
    'Laptop Stand',
    'Adjustable aluminum laptop stand with ventilation holes and foldable design.',
    29.99,
    54,
    'active',
    'Electronics',
    array['workspace', 'ergonomic'],
    false,
    current_timestamp - interval '65 days',
    current_timestamp - interval '1 day'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    'WTB-006',
    'Insulated Water Bottle',
    'Stainless steel double-wall vacuum insulated bottle. Keeps drinks cold 24h, hot 12h.',
    19.99,
    112,
    'active',
    'Lifestyle',
    array['hydration', 'insulated', 'steel'],
    false,
    current_timestamp - interval '60 days',
    current_timestamp - interval '7 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570007',
    'DKL-007',
    'Desk Lamp',
    'LED desk lamp with adjustable brightness, color temperature, and USB charging port.',
    39.99,
    31,
    'active',
    'Home',
    array['lighting', 'workspace', 'led'],
    false,
    current_timestamp - interval '55 days',
    current_timestamp - interval '4 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570008',
    'BTS-008',
    'Bluetooth Speaker',
    'Portable waterproof speaker with 360 sound, 20h battery, and built-in microphone.',
    59.99,
    18,
    'draft',
    'Electronics',
    array['audio', 'portable', 'waterproof'],
    false,
    current_timestamp - interval '10 days',
    current_timestamp - interval '1 day'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570009',
    'BPK-009',
    'Canvas Backpack',
    '30L waterproof canvas backpack with laptop compartment and ergonomic straps.',
    54.99,
    7,
    'active',
    'Accessories',
    array['bag', 'travel', 'laptop'],
    false,
    current_timestamp - interval '50 days',
    current_timestamp - interval '2 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570010',
    'NTB-010',
    'Notebook Set',
    'Set of 3 premium hardcover notebooks. Dot grid, lined, and blank pages.',
    12.99,
    0,
    'out_of_stock',
    'Stationery',
    array['notebooks', 'stationery'],
    false,
    current_timestamp - interval '120 days',
    current_timestamp - interval '30 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    'PNC-011',
    'Phone Case',
    'Slim shockproof phone case with raised edges and wireless charging support.',
    14.99,
    200,
    'active',
    'Accessories',
    array['phone', 'protection'],
    false,
    current_timestamp - interval '45 days',
    current_timestamp - interval '6 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570012',
    'KBD-012',
    'Mechanical Keyboard',
    'TKL mechanical keyboard with RGB backlight, tactile switches, and PBT keycaps.',
    89.99,
    3,
    'active',
    'Electronics',
    array['keyboard', 'mechanical', 'rgb'],
    true,
    current_timestamp - interval '40 days',
    current_timestamp - interval '2 days'
  );

----------------------------------------------------------------
-- Orders (initial 12)
----------------------------------------------------------------
insert into
  store.orders (
    id,
    order_number,
    user_id,
    status,
    payment_method,
    subtotal,
    tax,
    shipping,
    total,
    shipping_address,
    tracking_number,
    notes,
    created_at,
    updated_at
  )
values
  -- User 1 orders
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580001',
    'ORD-2024-0001',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered',
    'credit_card',
    159.98,
    0,
    0,
    159.98,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000001',
    null,
    current_timestamp - interval '60 days',
    current_timestamp - interval '55 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580002',
    'ORD-2024-0002',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered',
    'paypal',
    49.99,
    0,
    0,
    49.99,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000002',
    'Leave at door',
    current_timestamp - interval '45 days',
    current_timestamp - interval '40 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580003',
    'ORD-2024-0003',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'shipped',
    'credit_card',
    84.98,
    0,
    0,
    84.98,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000003',
    null,
    current_timestamp - interval '10 days',
    current_timestamp - interval '7 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580004',
    'ORD-2024-0004',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'processing',
    'credit_card',
    89.99,
    0,
    0,
    89.99,
    '123 Main St, Springfield, IL 62701',
    null,
    'Gift wrap please',
    current_timestamp - interval '3 days',
    current_timestamp - interval '2 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580005',
    'ORD-2024-0005',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'pending',
    'paypal',
    54.99,
    0,
    0,
    54.99,
    '123 Main St, Springfield, IL 62701',
    null,
    null,
    current_timestamp - interval '1 day',
    current_timestamp - interval '1 day'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580006',
    'ORD-2024-0006',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'cancelled',
    'credit_card',
    34.99,
    0,
    0,
    34.99,
    '123 Main St, Springfield, IL 62701',
    null,
    'Changed mind',
    current_timestamp - interval '20 days',
    current_timestamp - interval '19 days'
  ),
  -- User 2 orders
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580007',
    'ORD-2024-0007',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered',
    'credit_card',
    139.97,
    0,
    0,
    139.97,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000007',
    null,
    current_timestamp - interval '55 days',
    current_timestamp - interval '50 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580008',
    'ORD-2024-0008',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered',
    'bank_transfer',
    79.99,
    0,
    0,
    79.99,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000008',
    null,
    current_timestamp - interval '35 days',
    current_timestamp - interval '30 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580009',
    'ORD-2024-0009',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'refunded',
    'credit_card',
    119.99,
    0,
    0,
    119.99,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000009',
    'Wrong size',
    current_timestamp - interval '25 days',
    current_timestamp - interval '22 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580010',
    'ORD-2024-0010',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'shipped',
    'paypal',
    109.98,
    0,
    0,
    109.98,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000010',
    null,
    current_timestamp - interval '8 days',
    current_timestamp - interval '5 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580011',
    'ORD-2024-0011',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'processing',
    'cash_on_delivery',
    19.99,
    0,
    0,
    19.99,
    '456 Oak Ave, Portland, OR 97205',
    null,
    null,
    current_timestamp - interval '2 days',
    current_timestamp - interval '1 day'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580012',
    'ORD-2024-0012',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'pending',
    'credit_card',
    44.98,
    0,
    0,
    44.98,
    '456 Oak Ave, Portland, OR 97205',
    null,
    null,
    current_timestamp,
    current_timestamp
  );

----------------------------------------------------------------
-- Order Items (initial)
----------------------------------------------------------------
insert into
  store.order_items (
    id,
    order_id,
    product_id,
    quantity,
    unit_price,
    created_at
  )
values
  -- Order 1: Wireless Headphones + Laptop Stand + Water Bottle x2
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580001',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570001',
    1,
    79.99,
    current_timestamp - interval '60 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580001',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570005',
    1,
    29.99,
    current_timestamp - interval '60 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580001',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    2,
    19.99,
    current_timestamp - interval '60 days'
  ),
  -- Order 2: Coffee Maker
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580002',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570003',
    1,
    49.99,
    current_timestamp - interval '45 days'
  ),
  -- Order 3: Yoga Mat + Phone Case
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580003',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570004',
    2,
    34.99,
    current_timestamp - interval '10 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580003',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    1,
    14.99,
    current_timestamp - interval '10 days'
  ),
  -- Order 4: Mechanical Keyboard
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580004',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570012',
    1,
    89.99,
    current_timestamp - interval '3 days'
  ),
  -- Order 5: Canvas Backpack
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580005',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570009',
    1,
    54.99,
    current_timestamp - interval '1 day'
  ),
  -- Order 6: Yoga Mat (cancelled)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580006',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570004',
    1,
    34.99,
    current_timestamp - interval '20 days'
  ),
  -- Order 7: Running Shoes + Water Bottle
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580007',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570002',
    1,
    119.99,
    current_timestamp - interval '55 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580007',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    1,
    19.99,
    current_timestamp - interval '55 days'
  ),
  -- Order 8: Wireless Headphones
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580008',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570001',
    1,
    79.99,
    current_timestamp - interval '35 days'
  ),
  -- Order 9: Running Shoes (refunded)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580009',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570002',
    1,
    119.99,
    current_timestamp - interval '25 days'
  ),
  -- Order 10: Desk Lamp + Laptop Stand + Phone Case + Water Bottle
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580010',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570007',
    1,
    39.99,
    current_timestamp - interval '8 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580010',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570005',
    1,
    29.99,
    current_timestamp - interval '8 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580010',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    1,
    14.99,
    current_timestamp - interval '8 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580010',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    1,
    19.99,
    current_timestamp - interval '8 days'
  ),
  -- Order 11: Water Bottle
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580011',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    1,
    19.99,
    current_timestamp - interval '2 days'
  ),
  -- Order 12: Phone Case x2 + Notebook Set
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580012',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    2,
    14.99,
    current_timestamp
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580012',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570010',
    1,
    12.99,
    current_timestamp
  );

----------------------------------------------------------------
-- Additional Products (12 more)
----------------------------------------------------------------
insert into
  store.products (
    id,
    sku,
    name,
    description,
    price,
    stock,
    status,
    category,
    tags,
    featured,
    created_at,
    updated_at
  )
values
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570013',
    'DMT-013',
    'Standing Desk Mat',
    'Anti-fatigue cushioned mat for standing desks. Non-slip base and beveled edges.',
    44.99,
    38,
    'active',
    'Home',
    array['workspace', 'ergonomic'],
    false,
    current_timestamp - interval '35 days',
    current_timestamp - interval '3 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570014',
    'RBN-014',
    'Resistance Bands Set',
    'Set of 5 resistance bands with varying tension levels and carry bag included.',
    24.99,
    74,
    'active',
    'Sports',
    array['fitness', 'strength', 'portable'],
    false,
    current_timestamp - interval '30 days',
    current_timestamp - interval '5 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570015',
    'SCD-015',
    'Scented Candle Set',
    'Set of 4 soy wax candles in seasonal scents. 40-hour burn time each.',
    29.99,
    56,
    'active',
    'Lifestyle',
    array['home', 'candle', 'gift'],
    false,
    current_timestamp - interval '28 days',
    current_timestamp - interval '8 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570016',
    'SSP-016',
    'Stainless Steel Pan',
    'Tri-ply stainless steel 10-inch pan, oven-safe up to 500F. Dishwasher safe.',
    64.99,
    29,
    'active',
    'Kitchen',
    array['cookware', 'steel'],
    false,
    current_timestamp - interval '25 days',
    current_timestamp - interval '4 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570017',
    'HUB-017',
    'USB-C Hub 7-in-1',
    'Multi-port hub with HDMI, USB-A x3, SD card, microSD, and USB-C PD charging.',
    39.99,
    61,
    'active',
    'Electronics',
    array['usb-c', 'adapter', 'laptop'],
    false,
    current_timestamp - interval '22 days',
    current_timestamp - interval '2 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570018',
    'WAL-018',
    'Leather Wallet',
    'Slim bifold genuine leather wallet with RFID blocking and 6 card slots.',
    34.99,
    0,
    'out_of_stock',
    'Accessories',
    array['wallet', 'leather', 'rfid'],
    false,
    current_timestamp - interval '100 days',
    current_timestamp - interval '15 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570019',
    'BCB-019',
    'Bamboo Cutting Board',
    'Large bamboo cutting board with juice groove and non-slip rubber feet.',
    22.99,
    5,
    'active',
    'Kitchen',
    array['kitchen', 'bamboo', 'eco-friendly'],
    false,
    current_timestamp - interval '20 days',
    current_timestamp - interval '1 day'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570020',
    'WCP-020',
    'Wireless Charging Pad',
    '15W fast wireless charger compatible with all Qi-enabled devices. LED indicator.',
    27.99,
    42,
    'active',
    'Electronics',
    array['wireless', 'charging', 'qi'],
    false,
    current_timestamp - interval '18 days',
    current_timestamp - interval '3 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570021',
    'HKB-021',
    'Hiking Boots',
    'Waterproof mid-cut hiking boots with vibram outsole and ankle support.',
    149.99,
    14,
    'active',
    'Footwear',
    array['hiking', 'outdoor', 'waterproof'],
    true,
    current_timestamp - interval '15 days',
    current_timestamp - interval '5 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570022',
    'PWB-022',
    'Portable Power Bank',
    '20000mAh power bank with dual USB-A and USB-C output. Airline approved.',
    49.99,
    33,
    'active',
    'Electronics',
    array['power', 'travel', 'portable'],
    false,
    current_timestamp - interval '12 days',
    current_timestamp - interval '2 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570023',
    'FRR-023',
    'Foam Roller',
    'High-density EVA foam roller for muscle recovery and myofascial release. 18 inch.',
    19.99,
    88,
    'active',
    'Sports',
    array['recovery', 'fitness'],
    false,
    current_timestamp - interval '10 days',
    current_timestamp - interval '4 days'
  ),
  (
    'c1d2e3f4-a5b6-7890-cdef-ab1234570024',
    'SWB-024',
    'Smartwatch Band',
    'Silicone sport band compatible with major smartwatch models. Pack of 3 colors.',
    9.99,
    0,
    'archived',
    'Accessories',
    array['wearable', 'band'],
    false,
    current_timestamp - interval '150 days',
    current_timestamp - interval '60 days'
  );

----------------------------------------------------------------
-- Additional Orders (14 more)
----------------------------------------------------------------
insert into
  store.orders (
    id,
    order_number,
    user_id,
    status,
    payment_method,
    subtotal,
    tax,
    shipping,
    total,
    shipping_address,
    tracking_number,
    notes,
    created_at,
    updated_at
  )
values
  -- User 1 additional orders
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580013',
    'ORD-2024-0013',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered',
    'credit_card',
    94.98,
    0,
    0,
    94.98,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000013',
    null,
    current_timestamp - interval '55 days',
    current_timestamp - interval '50 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580014',
    'ORD-2024-0014',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered',
    'paypal',
    64.99,
    0,
    0,
    64.99,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000014',
    'Fragile, handle with care',
    current_timestamp - interval '40 days',
    current_timestamp - interval '35 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580015',
    'ORD-2024-0015',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered',
    'bank_transfer',
    29.99,
    0,
    0,
    29.99,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000015',
    null,
    current_timestamp - interval '30 days',
    current_timestamp - interval '26 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580016',
    'ORD-2024-0016',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'refunded',
    'credit_card',
    149.99,
    0,
    0,
    149.99,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000016',
    'Wrong size, too narrow',
    current_timestamp - interval '18 days',
    current_timestamp - interval '14 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580017',
    'ORD-2024-0017',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered',
    'credit_card',
    52.98,
    0,
    0,
    52.98,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000017',
    null,
    current_timestamp - interval '14 days',
    current_timestamp - interval '9 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580018',
    'ORD-2024-0018',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'shipped',
    'paypal',
    39.99,
    0,
    0,
    39.99,
    '123 Main St, Springfield, IL 62701',
    'TRK1Z999AA10000018',
    null,
    current_timestamp - interval '5 days',
    current_timestamp - interval '3 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580019',
    'ORD-2024-0019',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'cancelled',
    'cash_on_delivery',
    24.99,
    0,
    0,
    24.99,
    '123 Main St, Springfield, IL 62701',
    null,
    'Found cheaper elsewhere',
    current_timestamp - interval '12 days',
    current_timestamp - interval '12 days'
  ),
  -- User 2 additional orders
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580020',
    'ORD-2024-0020',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered',
    'credit_card',
    87.98,
    0,
    0,
    87.98,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000020',
    null,
    current_timestamp - interval '58 days',
    current_timestamp - interval '53 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580021',
    'ORD-2024-0021',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered',
    'paypal',
    44.99,
    0,
    0,
    44.99,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000021',
    null,
    current_timestamp - interval '42 days',
    current_timestamp - interval '37 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580022',
    'ORD-2024-0022',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered',
    'credit_card',
    199.98,
    0,
    0,
    199.98,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000022',
    'Birthday gift, please include card',
    current_timestamp - interval '28 days',
    current_timestamp - interval '23 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580023',
    'ORD-2024-0023',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'cancelled',
    'credit_card',
    39.99,
    0,
    0,
    39.99,
    '456 Oak Ave, Portland, OR 97205',
    null,
    null,
    current_timestamp - interval '22 days',
    current_timestamp - interval '22 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580024',
    'ORD-2024-0024',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered',
    'bank_transfer',
    74.98,
    0,
    0,
    74.98,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000024',
    null,
    current_timestamp - interval '16 days',
    current_timestamp - interval '11 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580025',
    'ORD-2024-0025',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'shipped',
    'paypal',
    49.99,
    0,
    0,
    49.99,
    '456 Oak Ave, Portland, OR 97205',
    'TRK1Z999AA10000025',
    null,
    current_timestamp - interval '6 days',
    current_timestamp - interval '4 days'
  ),
  (
    'd1e2f3a4-b5c6-7890-defa-bc1234580026',
    'ORD-2024-0026',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'processing',
    'credit_card',
    67.98,
    0,
    0,
    67.98,
    '456 Oak Ave, Portland, OR 97205',
    null,
    null,
    current_timestamp - interval '1 day',
    current_timestamp - interval '1 day'
  );

----------------------------------------------------------------
-- Additional Order Items
----------------------------------------------------------------
insert into
  store.order_items (
    id,
    order_id,
    product_id,
    quantity,
    unit_price,
    created_at
  )
values
  -- Order 13: Standing Desk Mat + Resistance Bands x2
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580013',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570013',
    1,
    44.99,
    current_timestamp - interval '55 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580013',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570014',
    2,
    24.99,
    current_timestamp - interval '55 days'
  ),
  -- Order 14: Stainless Steel Pan
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580014',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570016',
    1,
    64.99,
    current_timestamp - interval '40 days'
  ),
  -- Order 15: USB-C Hub
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580015',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570017',
    1,
    39.99,
    current_timestamp - interval '30 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580015',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570020',
    1,
    27.99,
    current_timestamp - interval '30 days'
  ),
  -- Order 16: Hiking Boots (refunded)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580016',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570021',
    1,
    149.99,
    current_timestamp - interval '18 days'
  ),
  -- Order 17: Scented Candles + Bamboo Cutting Board
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580017',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570015',
    1,
    29.99,
    current_timestamp - interval '14 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580017',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570019',
    1,
    22.99,
    current_timestamp - interval '14 days'
  ),
  -- Order 18: USB-C Hub (shipped)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580018',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570017',
    1,
    39.99,
    current_timestamp - interval '5 days'
  ),
  -- Order 19: Resistance Bands (cancelled)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580019',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570014',
    1,
    24.99,
    current_timestamp - interval '12 days'
  ),
  -- Order 20: Wireless Charging Pad + Foam Roller x3
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580020',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570020',
    1,
    27.99,
    current_timestamp - interval '58 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580020',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570023',
    3,
    19.99,
    current_timestamp - interval '58 days'
  ),
  -- Order 21: Standing Desk Mat
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580021',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570013',
    1,
    44.99,
    current_timestamp - interval '42 days'
  ),
  -- Order 22: Hiking Boots + Power Bank
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580022',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570021',
    1,
    149.99,
    current_timestamp - interval '28 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580022',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570022',
    1,
    49.99,
    current_timestamp - interval '28 days'
  ),
  -- Order 23: Wireless Charging Pad + USB-C Hub (cancelled)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580023',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570020',
    1,
    27.99,
    current_timestamp - interval '22 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580023',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570017',
    1,
    39.99,
    current_timestamp - interval '22 days'
  ),
  -- Order 24: Scented Candles + Foam Roller + Phone Case + Water Bottle
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580024',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570015',
    1,
    29.99,
    current_timestamp - interval '16 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580024',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570023',
    1,
    19.99,
    current_timestamp - interval '16 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580024',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    1,
    14.99,
    current_timestamp - interval '16 days'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580024',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    1,
    19.99,
    current_timestamp - interval '16 days'
  ),
  -- Order 25: Power Bank (shipped)
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580025',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570022',
    1,
    49.99,
    current_timestamp - interval '6 days'
  ),
  -- Order 26: Bamboo Cutting Board + Stainless Steel Pan
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580026',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570019',
    1,
    22.99,
    current_timestamp - interval '1 day'
  ),
  (
    gen_random_uuid(),
    'd1e2f3a4-b5c6-7890-defa-bc1234580026',
    'c1d2e3f4-a5b6-7890-cdef-ab1234570016',
    1,
    64.99,
    current_timestamp - interval '1 day'
  );

----------------------------------------------------------------
-- Reviews (mix of approved / pending / rejected; varied ratings)
----------------------------------------------------------------
insert into
  store.reviews (
    id,
    product_id,
    user_id,
    rating,
    title,
    content,
    status,
    verified_purchase,
    helpful_count,
    created_at,
    updated_at
  )
values
  -- Wireless Headphones
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570001',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    5,
    'Best headphones I''ve owned',
    'Battery life is exactly as advertised. ANC works great on flights. Comfortable for 8+ hour stretches.',
    'approved',
    true,
    14,
    current_timestamp - interval '50 days',
    current_timestamp - interval '50 days'
  ),
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570001',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    4,
    'Great sound, slight comfort issue',
    'Audio quality is fantastic but the clamp force is a bit tight on the first day. Loosens up after a week.',
    'approved',
    true,
    6,
    current_timestamp - interval '25 days',
    current_timestamp - interval '25 days'
  ),
  -- Running Shoes
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570002',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    5,
    'Perfect for daily runs',
    'Light, breathable, and the cushioning is just right for my 5K route. Sized true.',
    'approved',
    true,
    9,
    current_timestamp - interval '52 days',
    current_timestamp - interval '52 days'
  ),
  -- Coffee Maker
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570003',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    4,
    'Solid daily driver',
    'Built-in grinder is convenient. Carafe keeps coffee hot for hours. Cleaning the grinder takes some work.',
    'approved',
    true,
    3,
    current_timestamp - interval '38 days',
    current_timestamp - interval '38 days'
  ),
  -- Yoga Mat
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570004',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    5,
    'Grippy and well-padded',
    'No-slip even during sweaty sessions. The alignment lines are subtle but useful.',
    'approved',
    true,
    11,
    current_timestamp - interval '8 days',
    current_timestamp - interval '8 days'
  ),
  -- Mechanical Keyboard
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570012',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    5,
    'Tactile and beautiful',
    'PBT keycaps are excellent. RGB is tasteful, not overdone. Sound profile is satisfying without being loud.',
    'approved',
    true,
    22,
    current_timestamp - interval '1 day',
    current_timestamp - interval '1 day'
  ),
  -- Hiking Boots (refunded order — review still allowed but pending)
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570021',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    2,
    'Sized too narrow for me',
    'Quality looks great but the fit was wrong. Sending back. Wish they offered wide widths.',
    'pending',
    true,
    0,
    current_timestamp - interval '13 days',
    current_timestamp - interval '13 days'
  ),
  -- Power Bank
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570022',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    4,
    'Heavy but reliable',
    'Charges my phone 4-5 times. The USB-C PD output is great for travel. Wish it weighed less.',
    'approved',
    true,
    5,
    current_timestamp - interval '2 days',
    current_timestamp - interval '2 days'
  ),
  -- Standing Desk Mat
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570013',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    5,
    'Real difference for back pain',
    'Standing for long stretches is much more comfortable. The beveled edges don''t snag on my chair.',
    'approved',
    true,
    8,
    current_timestamp - interval '40 days',
    current_timestamp - interval '40 days'
  ),
  -- Phone Case
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    3,
    'Protects but bulky',
    'Does the job protecting the phone but adds noticeable bulk. Wireless charging works through it.',
    'approved',
    false,
    1,
    current_timestamp - interval '15 days',
    current_timestamp - interval '15 days'
  ),
  -- Notebook Set (rejected — likely promotional spam)
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570010',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    5,
    'Great for school',
    'Buy three sets and get the fourth free at NotebookHub.example.com — discount code SPAM50',
    'rejected',
    false,
    0,
    current_timestamp - interval '20 days',
    current_timestamp - interval '19 days'
  ),
  -- Foam Roller
  (
    gen_random_uuid(),
    'c1d2e3f4-a5b6-7890-cdef-ab1234570023',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    4,
    'Density is right for me',
    'Firm enough to actually release knots without being unbearable on the IT band. Holds shape well.',
    'pending',
    false,
    0,
    current_timestamp - interval '3 days',
    current_timestamp - interval '3 days'
  );

----------------------------------------------------------------
-- Store Settings (single record)
----------------------------------------------------------------
insert into
  store.store_settings (
    store_name,
    store_description,
    contact_email,
    contact_phone,
    currency,
    tax_rate,
    shipping_rate,
    free_shipping_threshold
  )
values
  (
    'Supasheet Store',
    'Your one-stop shop for electronics, home goods, and lifestyle essentials.',
    'hello@supasheetstore.example.com',
    '+1 (800) 555-0100',
    'USD',
    8.25,
    5.99,
    75.00
  );
