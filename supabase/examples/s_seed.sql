-- Store Schema Seed Data
-- Uses hardcoded user IDs from seed.sql
-- user_1: b73eb03e-fb7a-424d-84ff-18e2791ce0b8 (superadmin)
-- user_2: b73eb03e-fb7a-424d-84ff-18e2791ce0b1

----------------------------------------------------------------
-- Products
----------------------------------------------------------------

INSERT INTO store.products (id, name, description, price, stock, status, category, created_at, updated_at) VALUES
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570001',
    'Wireless Headphones',
    'Over-ear noise cancelling headphones with 30-hour battery life and premium sound quality.',
    79.99, 45, 'active', 'Electronics',
    current_timestamp - interval '90 days', current_timestamp - interval '2 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570002',
    'Running Shoes',
    'Lightweight, breathable running shoes with responsive cushioning for all-day comfort.',
    119.99, 23, 'active', 'Footwear',
    current_timestamp - interval '80 days', current_timestamp - interval '5 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570003',
    'Coffee Maker',
    '12-cup programmable coffee maker with built-in grinder and thermal carafe.',
    49.99, 67, 'active', 'Kitchen',
    current_timestamp - interval '75 days', current_timestamp - interval '10 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570004',
    'Yoga Mat',
    'Non-slip, eco-friendly yoga mat with alignment lines and carry strap. 6mm thickness.',
    34.99, 89, 'active', 'Sports',
    current_timestamp - interval '70 days', current_timestamp - interval '3 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570005',
    'Laptop Stand',
    'Adjustable aluminum laptop stand with ventilation holes and foldable design.',
    29.99, 54, 'active', 'Electronics',
    current_timestamp - interval '65 days', current_timestamp - interval '1 day'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570006',
    'Insulated Water Bottle',
    'Stainless steel double-wall vacuum insulated bottle. Keeps drinks cold 24h, hot 12h.',
    19.99, 112, 'active', 'Lifestyle',
    current_timestamp - interval '60 days', current_timestamp - interval '7 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570007',
    'Desk Lamp',
    'LED desk lamp with adjustable brightness, color temperature, and USB charging port.',
    39.99, 31, 'active', 'Home',
    current_timestamp - interval '55 days', current_timestamp - interval '4 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570008',
    'Bluetooth Speaker',
    'Portable waterproof speaker with 360° sound, 20h battery, and built-in microphone.',
    59.99, 18, 'draft', 'Electronics',
    current_timestamp - interval '10 days', current_timestamp - interval '1 day'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570009',
    'Canvas Backpack',
    '30L waterproof canvas backpack with laptop compartment and ergonomic straps.',
    54.99, 7, 'active', 'Accessories',
    current_timestamp - interval '50 days', current_timestamp - interval '2 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570010',
    'Notebook Set',
    'Set of 3 premium hardcover notebooks. Dot grid, lined, and blank pages.',
    12.99, 0, 'out_of_stock', 'Stationery',
    current_timestamp - interval '120 days', current_timestamp - interval '30 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570011',
    'Phone Case',
    'Slim shockproof phone case with raised edges and wireless charging support.',
    14.99, 200, 'active', 'Accessories',
    current_timestamp - interval '45 days', current_timestamp - interval '6 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570012',
    'Mechanical Keyboard',
    'TKL mechanical keyboard with RGB backlight, tactile switches, and PBT keycaps.',
    89.99, 3, 'active', 'Electronics',
    current_timestamp - interval '40 days', current_timestamp - interval '2 days'
);


----------------------------------------------------------------
-- Orders
----------------------------------------------------------------

INSERT INTO store.orders (id, user_id, status, total, notes, created_at, updated_at) VALUES
-- User 1 orders
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580001',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered', 159.98, NULL,
    current_timestamp - interval '60 days', current_timestamp - interval '55 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580002',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered', 49.99, 'Leave at door',
    current_timestamp - interval '45 days', current_timestamp - interval '40 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580003',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'shipped', 84.98, NULL,
    current_timestamp - interval '10 days', current_timestamp - interval '7 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580004',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'processing', 89.99, 'Gift wrap please',
    current_timestamp - interval '3 days', current_timestamp - interval '2 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580005',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'pending', 54.99, NULL,
    current_timestamp - interval '1 day', current_timestamp - interval '1 day'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580006',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'cancelled', 34.99, 'Changed mind',
    current_timestamp - interval '20 days', current_timestamp - interval '19 days'
),
-- User 2 orders
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580007',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered', 139.97, NULL,
    current_timestamp - interval '55 days', current_timestamp - interval '50 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580008',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered', 79.99, NULL,
    current_timestamp - interval '35 days', current_timestamp - interval '30 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580009',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'refunded', 119.99, 'Wrong size',
    current_timestamp - interval '25 days', current_timestamp - interval '22 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580010',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'shipped', 109.98, NULL,
    current_timestamp - interval '8 days', current_timestamp - interval '5 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580011',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'processing', 19.99, NULL,
    current_timestamp - interval '2 days', current_timestamp - interval '1 day'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580012',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'pending', 44.98, NULL,
    current_timestamp, current_timestamp
);


----------------------------------------------------------------
-- Order Items
----------------------------------------------------------------

INSERT INTO store.order_items (id, order_id, product_id, quantity, unit_price, created_at) VALUES
-- Order 1: Wireless Headphones + Laptop Stand
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580001', 'c1d2e3f4-a5b6-7890-cdef-ab1234570001', 1, 79.99, current_timestamp - interval '60 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580001', 'c1d2e3f4-a5b6-7890-cdef-ab1234570005', 1, 29.99, current_timestamp - interval '60 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580001', 'c1d2e3f4-a5b6-7890-cdef-ab1234570006', 2, 19.99, current_timestamp - interval '60 days'),

-- Order 2: Coffee Maker
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580002', 'c1d2e3f4-a5b6-7890-cdef-ab1234570003', 1, 49.99, current_timestamp - interval '45 days'),

-- Order 3: Yoga Mat + Phone Case
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580003', 'c1d2e3f4-a5b6-7890-cdef-ab1234570004', 2, 34.99, current_timestamp - interval '10 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580003', 'c1d2e3f4-a5b6-7890-cdef-ab1234570011', 1, 14.99, current_timestamp - interval '10 days'),

-- Order 4: Mechanical Keyboard
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580004', 'c1d2e3f4-a5b6-7890-cdef-ab1234570012', 1, 89.99, current_timestamp - interval '3 days'),

-- Order 5: Canvas Backpack
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580005', 'c1d2e3f4-a5b6-7890-cdef-ab1234570009', 1, 54.99, current_timestamp - interval '1 day'),

-- Order 6: Yoga Mat (cancelled)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580006', 'c1d2e3f4-a5b6-7890-cdef-ab1234570004', 1, 34.99, current_timestamp - interval '20 days'),

-- Order 7: Running Shoes + Water Bottle + Phone Case
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580007', 'c1d2e3f4-a5b6-7890-cdef-ab1234570002', 1, 119.99, current_timestamp - interval '55 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580007', 'c1d2e3f4-a5b6-7890-cdef-ab1234570006', 1, 19.99, current_timestamp - interval '55 days'),

-- Order 8: Wireless Headphones
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580008', 'c1d2e3f4-a5b6-7890-cdef-ab1234570001', 1, 79.99, current_timestamp - interval '35 days'),

-- Order 9: Running Shoes (refunded)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580009', 'c1d2e3f4-a5b6-7890-cdef-ab1234570002', 1, 119.99, current_timestamp - interval '25 days'),

-- Order 10: Desk Lamp + Laptop Stand
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580010', 'c1d2e3f4-a5b6-7890-cdef-ab1234570007', 1, 39.99, current_timestamp - interval '8 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580010', 'c1d2e3f4-a5b6-7890-cdef-ab1234570005', 1, 29.99, current_timestamp - interval '8 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580010', 'c1d2e3f4-a5b6-7890-cdef-ab1234570011', 1, 14.99, current_timestamp - interval '8 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580010', 'c1d2e3f4-a5b6-7890-cdef-ab1234570006', 1, 19.99, current_timestamp - interval '8 days'),

-- Order 11: Water Bottle
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580011', 'c1d2e3f4-a5b6-7890-cdef-ab1234570006', 1, 19.99, current_timestamp - interval '2 days'),

-- Order 12: Phone Case + Notebook Set
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580012', 'c1d2e3f4-a5b6-7890-cdef-ab1234570011', 2, 14.99, current_timestamp),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580012', 'c1d2e3f4-a5b6-7890-cdef-ab1234570010', 1, 12.99, current_timestamp);


----------------------------------------------------------------
-- Additional Products
----------------------------------------------------------------

INSERT INTO store.products (id, name, description, price, stock, status, category, created_at, updated_at) VALUES
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570013',
    'Standing Desk Mat',
    'Anti-fatigue cushioned mat for standing desks. Non-slip base and beveled edges.',
    44.99, 38, 'active', 'Home',
    current_timestamp - interval '35 days', current_timestamp - interval '3 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570014',
    'Resistance Bands Set',
    'Set of 5 resistance bands with varying tension levels and carry bag included.',
    24.99, 74, 'active', 'Sports',
    current_timestamp - interval '30 days', current_timestamp - interval '5 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570015',
    'Scented Candle Set',
    'Set of 4 soy wax candles in seasonal scents. 40-hour burn time each.',
    29.99, 56, 'active', 'Lifestyle',
    current_timestamp - interval '28 days', current_timestamp - interval '8 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570016',
    'Stainless Steel Pan',
    'Tri-ply stainless steel 10-inch pan, oven-safe up to 500°F. Dishwasher safe.',
    64.99, 29, 'active', 'Kitchen',
    current_timestamp - interval '25 days', current_timestamp - interval '4 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570017',
    'USB-C Hub 7-in-1',
    'Multi-port hub with HDMI, USB-A x3, SD card, microSD, and USB-C PD charging.',
    39.99, 61, 'active', 'Electronics',
    current_timestamp - interval '22 days', current_timestamp - interval '2 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570018',
    'Leather Wallet',
    'Slim bifold genuine leather wallet with RFID blocking and 6 card slots.',
    34.99, 0, 'out_of_stock', 'Accessories',
    current_timestamp - interval '100 days', current_timestamp - interval '15 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570019',
    'Bamboo Cutting Board',
    'Large bamboo cutting board with juice groove and non-slip rubber feet.',
    22.99, 5, 'active', 'Kitchen',
    current_timestamp - interval '20 days', current_timestamp - interval '1 day'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570020',
    'Wireless Charging Pad',
    '15W fast wireless charger compatible with all Qi-enabled devices. LED indicator.',
    27.99, 42, 'active', 'Electronics',
    current_timestamp - interval '18 days', current_timestamp - interval '3 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570021',
    'Hiking Boots',
    'Waterproof mid-cut hiking boots with vibram outsole and ankle support.',
    149.99, 14, 'active', 'Footwear',
    current_timestamp - interval '15 days', current_timestamp - interval '5 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570022',
    'Portable Power Bank',
    '20000mAh power bank with dual USB-A and USB-C output. Airline approved.',
    49.99, 33, 'active', 'Electronics',
    current_timestamp - interval '12 days', current_timestamp - interval '2 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570023',
    'Foam Roller',
    'High-density EVA foam roller for muscle recovery and myofascial release. 18 inch.',
    19.99, 88, 'active', 'Sports',
    current_timestamp - interval '10 days', current_timestamp - interval '4 days'
),
(
    'c1d2e3f4-a5b6-7890-cdef-ab1234570024',
    'Smartwatch Band',
    'Silicone sport band compatible with major smartwatch models. Pack of 3 colors.',
    9.99, 0, 'archived', 'Accessories',
    current_timestamp - interval '150 days', current_timestamp - interval '60 days'
);


----------------------------------------------------------------
-- Additional Orders
----------------------------------------------------------------

INSERT INTO store.orders (id, user_id, status, total, notes, created_at, updated_at) VALUES
-- User 1 additional orders
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580013',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered', 94.98, NULL,
    current_timestamp - interval '55 days', current_timestamp - interval '50 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580014',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered', 64.99, 'Fragile, handle with care',
    current_timestamp - interval '40 days', current_timestamp - interval '35 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580015',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered', 29.99, NULL,
    current_timestamp - interval '30 days', current_timestamp - interval '26 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580016',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'refunded', 149.99, 'Wrong size, too narrow',
    current_timestamp - interval '18 days', current_timestamp - interval '14 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580017',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'delivered', 52.98, NULL,
    current_timestamp - interval '14 days', current_timestamp - interval '9 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580018',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'shipped', 39.99, NULL,
    current_timestamp - interval '5 days', current_timestamp - interval '3 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580019',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    'cancelled', 24.99, 'Found cheaper elsewhere',
    current_timestamp - interval '12 days', current_timestamp - interval '12 days'
),
-- User 2 additional orders
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580020',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered', 87.98, NULL,
    current_timestamp - interval '58 days', current_timestamp - interval '53 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580021',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered', 44.99, NULL,
    current_timestamp - interval '42 days', current_timestamp - interval '37 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580022',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered', 199.98, 'Birthday gift, please include card',
    current_timestamp - interval '28 days', current_timestamp - interval '23 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580023',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'cancelled', 39.99, NULL,
    current_timestamp - interval '22 days', current_timestamp - interval '22 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580024',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'delivered', 74.98, NULL,
    current_timestamp - interval '16 days', current_timestamp - interval '11 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580025',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'shipped', 49.99, NULL,
    current_timestamp - interval '6 days', current_timestamp - interval '4 days'
),
(
    'd1e2f3a4-b5c6-7890-defa-bc1234580026',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'processing', 67.98, NULL,
    current_timestamp - interval '1 day', current_timestamp - interval '1 day'
);


----------------------------------------------------------------
-- Additional Order Items
----------------------------------------------------------------

INSERT INTO store.order_items (id, order_id, product_id, quantity, unit_price, created_at) VALUES
-- Order 13: Standing Desk Mat + Resistance Bands
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580013', 'c1d2e3f4-a5b6-7890-cdef-ab1234570013', 1, 44.99, current_timestamp - interval '55 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580013', 'c1d2e3f4-a5b6-7890-cdef-ab1234570014', 2, 24.99, current_timestamp - interval '55 days'),

-- Order 14: Stainless Steel Pan
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580014', 'c1d2e3f4-a5b6-7890-cdef-ab1234570016', 1, 64.99, current_timestamp - interval '40 days'),

-- Order 15: USB-C Hub
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580015', 'c1d2e3f4-a5b6-7890-cdef-ab1234570017', 1, 39.99, current_timestamp - interval '30 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580015', 'c1d2e3f4-a5b6-7890-cdef-ab1234570020', 1, 27.99, current_timestamp - interval '30 days'),

-- Order 16: Hiking Boots (refunded)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580016', 'c1d2e3f4-a5b6-7890-cdef-ab1234570021', 1, 149.99, current_timestamp - interval '18 days'),

-- Order 17: Scented Candles + Bamboo Cutting Board
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580017', 'c1d2e3f4-a5b6-7890-cdef-ab1234570015', 1, 29.99, current_timestamp - interval '14 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580017', 'c1d2e3f4-a5b6-7890-cdef-ab1234570019', 1, 22.99, current_timestamp - interval '14 days'),

-- Order 18: USB-C Hub (shipped)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580018', 'c1d2e3f4-a5b6-7890-cdef-ab1234570017', 1, 39.99, current_timestamp - interval '5 days'),

-- Order 19: Resistance Bands (cancelled)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580019', 'c1d2e3f4-a5b6-7890-cdef-ab1234570014', 1, 24.99, current_timestamp - interval '12 days'),

-- Order 20: Wireless Charging Pad + Foam Roller
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580020', 'c1d2e3f4-a5b6-7890-cdef-ab1234570020', 1, 27.99, current_timestamp - interval '58 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580020', 'c1d2e3f4-a5b6-7890-cdef-ab1234570023', 3, 19.99, current_timestamp - interval '58 days'),

-- Order 21: Standing Desk Mat
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580021', 'c1d2e3f4-a5b6-7890-cdef-ab1234570013', 1, 44.99, current_timestamp - interval '42 days'),

-- Order 22: Hiking Boots + Power Bank
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580022', 'c1d2e3f4-a5b6-7890-cdef-ab1234570021', 1, 149.99, current_timestamp - interval '28 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580022', 'c1d2e3f4-a5b6-7890-cdef-ab1234570022', 1, 49.99, current_timestamp - interval '28 days'),

-- Order 23: Wireless Charging Pad (cancelled)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580023', 'c1d2e3f4-a5b6-7890-cdef-ab1234570020', 1, 27.99, current_timestamp - interval '22 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580023', 'c1d2e3f4-a5b6-7890-cdef-ab1234570017', 1, 39.99, current_timestamp - interval '22 days'),

-- Order 24: Scented Candles + Foam Roller
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580024', 'c1d2e3f4-a5b6-7890-cdef-ab1234570015', 1, 29.99, current_timestamp - interval '16 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580024', 'c1d2e3f4-a5b6-7890-cdef-ab1234570023', 1, 19.99, current_timestamp - interval '16 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580024', 'c1d2e3f4-a5b6-7890-cdef-ab1234570011', 1, 14.99, current_timestamp - interval '16 days'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580024', 'c1d2e3f4-a5b6-7890-cdef-ab1234570006', 1, 19.99, current_timestamp - interval '16 days'),

-- Order 25: Power Bank (shipped)
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580025', 'c1d2e3f4-a5b6-7890-cdef-ab1234570022', 1, 49.99, current_timestamp - interval '6 days'),

-- Order 26: Bamboo Cutting Board + Stainless Steel Pan
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580026', 'c1d2e3f4-a5b6-7890-cdef-ab1234570019', 1, 22.99, current_timestamp - interval '1 day'),
(gen_random_uuid(), 'd1e2f3a4-b5c6-7890-defa-bc1234580026', 'c1d2e3f4-a5b6-7890-cdef-ab1234570016', 1, 64.99, current_timestamp - interval '1 day');
