
    -- Inventory & Supply Chain Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)

    ----------------------------------------------------------------
    -- Warehouses
    ----------------------------------------------------------------

    INSERT INTO inventory.warehouses (id, name, code, type, description, address, city, country, capacity, manager_user_id, is_active, color, tags, notes, created_at, updated_at) VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'Main Distribution Center', 'DC-MAIN', 'main',
        'Primary distribution hub on the West Coast.',
        '500 Logistics Way', 'Oakland', 'United States', 50000,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        true, '#3b82f6', ARRAY['main','west-coast'],
        'Auto-replenishes from suppliers weekly.',
        current_timestamp - interval '900 days', current_timestamp - interval '20 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'East Coast Fulfillment', 'FF-EAST', 'fulfillment',
        'Fulfillment center serving East Coast orders.',
        '201 Harbor Dr', 'Newark', 'United States', 32000,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        true, '#22c55e', ARRAY['fulfillment','east-coast'],
        'High throughput; ships 5x/week.',
        current_timestamp - interval '700 days', current_timestamp - interval '15 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'Midwest Satellite', 'SAT-MW', 'satellite',
        'Smaller satellite warehouse for Midwest customers.',
        '1750 Commerce Pkwy', 'Indianapolis', 'United States', 12000,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        true, '#f97316', ARRAY['satellite','midwest'],
        null,
        current_timestamp - interval '450 days', current_timestamp - interval '40 days'
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'Returns Processing', 'RET-01', 'returns',
        'Returns intake and refurbishment.',
        '88 Recycle Lane', 'Phoenix', 'United States', 8000,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        true, '#a855f7', ARRAY['returns'],
        null,
        current_timestamp - interval '300 days', current_timestamp - interval '60 days'
    );


    ----------------------------------------------------------------
    -- Suppliers
    ----------------------------------------------------------------

    INSERT INTO inventory.suppliers (id, name, code, status, contact_name, email, phone, website, address, city, country, lead_time_days, payment_terms, tax_id, rating, description, tags, color, notes, user_id, created_at, updated_at) VALUES
    (
        'b0000000-0000-0000-0000-100000000001',
        'Globex Components', 'SUP-001', 'active',
        'Sarah Johnson', 'orders@globex-components.example.com', '+1-312-555-0100',
        'https://globex-components.example.com',
        '88 Industrial Way', 'Chicago', 'United States',
        14, 'Net 30', 'EIN-34-5678901', 4.5,
        'Primary electronics components supplier.',
        ARRAY['electronics','tier-1'], '#3b82f6',
        'Strategic supplier; quarterly business reviews.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '800 days', current_timestamp - interval '30 days'
    ),
    (
        'b0000000-0000-0000-0000-100000000002',
        'Acme Packaging', 'SUP-002', 'active',
        'John Smith', 'sales@acme-packaging.example.com', '+1-415-555-0101',
        'https://acme-packaging.example.com',
        '500 Market Street', 'San Francisco', 'United States',
        7, 'Net 15', 'EIN-12-3456789', 4.2,
        'Packaging materials and shipping supplies.',
        ARRAY['packaging','recurring'], '#22c55e',
        'Reliable; ships within SLA.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '600 days', current_timestamp - interval '20 days'
    ),
    (
        'b0000000-0000-0000-0000-100000000003',
        'Initech Apparel', 'SUP-003', 'active',
        'Michael Brown', 'wholesale@initech-apparel.example.com', '+1-512-555-0118',
        'https://initech-apparel.example.com',
        '4120 Tech Boulevard', 'Austin', 'United States',
        21, 'Net 45', 'EIN-23-4567890', 4.0,
        'Custom-branded apparel and merchandise.',
        ARRAY['apparel','custom'], '#a855f7',
        'Long lead time on custom prints.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '500 days', current_timestamp - interval '50 days'
    ),
    (
        'b0000000-0000-0000-0000-100000000004',
        'Wayne Hardware', 'SUP-004', 'on_hold',
        'James Wilson', 'orders@wayne-hardware.example.com', '+1-201-555-0199',
        'https://wayne-hardware.example.com',
        '1007 Mountain Drive', 'Gotham', 'United States',
        30, 'Net 60', 'EIN-45-6789012', 2.5,
        'Hardware and tooling supplier.',
        ARRAY['hardware','review'], '#f97316',
        'On hold pending quality review.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '400 days', current_timestamp - interval '15 days'
    ),
    (
        'b0000000-0000-0000-0000-100000000005',
        'Stark International', 'SUP-005', 'active',
        'Daniel White', 'logistics@stark-intl.example.com', '+1-212-555-0152',
        'https://stark-intl.example.com',
        '10880 Malibu Point', 'New York', 'United States',
        10, 'Net 30', 'EIN-56-7890123', 4.8,
        'Premium accessories supplier.',
        ARRAY['premium','accessories'], '#ef4444',
        'Top-rated supplier.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '550 days', current_timestamp - interval '8 days'
    );


    ----------------------------------------------------------------
    -- Products
    ----------------------------------------------------------------

    INSERT INTO inventory.products (id, sku, name, barcode, status, category, brand, description, unit_of_measure, weight, dimensions, cost_price, list_price, currency, reorder_point, reorder_quantity, safety_stock, default_supplier_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Electronics (Globex)
    (
        'b0000000-0000-0000-0000-200000000001',
        'ELC-WHP-001', 'Wireless Headphones — Pro', '0193456000011',
        'active', 'Electronics', 'Globex',
        'Over-ear noise-cancelling headphones with 30hr battery.',
        'each', 0.350, '20x18x8 cm', 45.00, 129.99, 'USD',
        50, 200, 25,
        'b0000000-0000-0000-0000-100000000001',
        ARRAY['audio','wireless'], '#3b82f6', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '500 days', current_timestamp - interval '10 days'
    ),
    (
        'b0000000-0000-0000-0000-200000000002',
        'ELC-CBL-002', 'USB-C Cable 2m', '0193456000028',
        'active', 'Electronics', 'Globex',
        '2m braided USB-C to USB-C cable, 100W PD.',
        'each', 0.080, '12x8x2 cm', 3.20, 14.99, 'USD',
        500, 2000, 200,
        'b0000000-0000-0000-0000-100000000001',
        ARRAY['cable','accessory'], '#0ea5e9', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '450 days', current_timestamp - interval '5 days'
    ),
    (
        'b0000000-0000-0000-0000-200000000003',
        'ELC-CHG-003', 'Wall Charger 65W', '0193456000035',
        'active', 'Electronics', 'Globex',
        'GaN 65W wall charger, dual USB-C.',
        'each', 0.110, '8x6x4 cm', 9.50, 39.99, 'USD',
        100, 500, 50,
        'b0000000-0000-0000-0000-100000000001',
        ARRAY['charger','accessory'], '#0284c7', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '400 days', current_timestamp - interval '7 days'
    ),
    (
        'b0000000-0000-0000-0000-200000000004',
        'ELC-MSE-004', 'Wireless Mouse — Ergo', '0193456000042',
        'backorder', 'Electronics', 'Globex',
        'Ergonomic wireless mouse with USB receiver.',
        'each', 0.150, '12x7x4 cm', 11.00, 34.99, 'USD',
        80, 300, 40,
        'b0000000-0000-0000-0000-100000000001',
        ARRAY['mouse','accessory'], '#06b6d4',
        'On backorder pending Q3 component shipment.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '350 days', current_timestamp - interval '12 days'
    ),
    -- Packaging (Acme)
    (
        'b0000000-0000-0000-0000-200000000005',
        'PKG-BOX-001', 'Shipping Box — Medium', '0193456000059',
        'active', 'Packaging', 'Acme',
        'Double-walled cardboard box, 30x20x15 cm.',
        'each', 0.180, '30x20x15 cm', 0.45, 0, 'USD',
        2000, 10000, 1000,
        'b0000000-0000-0000-0000-100000000002',
        ARRAY['box','recurring'], '#22c55e', 'Internal use; not for sale.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '600 days', current_timestamp - interval '3 days'
    ),
    (
        'b0000000-0000-0000-0000-200000000006',
        'PKG-TPE-002', 'Branded Packing Tape', '0193456000066',
        'active', 'Packaging', 'Acme',
        '50m roll, branded packing tape.',
        'roll', 0.260, '15x15x5 cm', 1.20, 0, 'USD',
        500, 2000, 200,
        'b0000000-0000-0000-0000-100000000002',
        ARRAY['tape','recurring'], '#16a34a', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '500 days', current_timestamp - interval '8 days'
    ),
    (
        'b0000000-0000-0000-0000-200000000007',
        'PKG-FIL-003', 'Air Pillow Filler', '0193456000073',
        'active', 'Packaging', 'Acme',
        'Inflatable void filler, case of 200.',
        'case', 4.500, '60x40x40 cm', 18.00, 0, 'USD',
        50, 200, 20,
        'b0000000-0000-0000-0000-100000000002',
        ARRAY['filler','recurring'], '#15803d', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '400 days', current_timestamp - interval '14 days'
    ),
    -- Apparel (Initech)
    (
        'b0000000-0000-0000-0000-200000000008',
        'APP-TSH-001', 'Branded T-Shirt — Black M', '0193456000080',
        'active', 'Apparel', 'Initech',
        'Premium cotton tee, branded, size M.',
        'each', 0.180, '30x20x2 cm', 6.00, 24.99, 'USD',
        100, 500, 50,
        'b0000000-0000-0000-0000-100000000003',
        ARRAY['tshirt','swag'], '#1f2937', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '300 days', current_timestamp - interval '6 days'
    ),
    (
        'b0000000-0000-0000-0000-200000000009',
        'APP-HOD-002', 'Branded Hoodie — Navy L', '0193456000097',
        'active', 'Apparel', 'Initech',
        'Heavy-weight branded hoodie, size L.',
        'each', 0.640, '40x30x6 cm', 18.00, 64.99, 'USD',
        50, 200, 25,
        'b0000000-0000-0000-0000-100000000003',
        ARRAY['hoodie','swag'], '#1e3a8a', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '300 days', current_timestamp - interval '20 days'
    ),
    (
        'b0000000-0000-0000-0000-20000000000a',
        'APP-CAP-003', 'Branded Cap', '0193456000103',
        'discontinued', 'Apparel', 'Initech',
        'Adjustable branded cap. Discontinued FY26.',
        'each', 0.110, '20x18x10 cm', 4.50, 19.99, 'USD',
        0, 0, 0,
        'b0000000-0000-0000-0000-100000000003',
        ARRAY['cap','discontinued'], '#6b7280', 'Sell through remaining stock.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '700 days', current_timestamp - interval '90 days'
    ),
    -- Hardware (Wayne)
    (
        'b0000000-0000-0000-0000-20000000000b',
        'HW-STD-001', 'Adjustable Laptop Stand', '0193456000110',
        'active', 'Hardware', 'Wayne',
        'Aluminium adjustable laptop stand.',
        'each', 0.900, '30x25x6 cm', 12.00, 49.99, 'USD',
        40, 150, 20,
        'b0000000-0000-0000-0000-100000000004',
        ARRAY['stand','desk'], '#f97316',
        'Quality concerns under review.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '350 days', current_timestamp - interval '15 days'
    ),
    (
        'b0000000-0000-0000-0000-20000000000c',
        'HW-DOC-002', 'USB-C Docking Station', '0193456000127',
        'preorder', 'Hardware', 'Wayne',
        '11-in-1 USB-C dock, available July.',
        'each', 0.380, '20x10x4 cm', 38.00, 119.99, 'USD',
        20, 100, 10,
        'b0000000-0000-0000-0000-100000000004',
        ARRAY['dock','preorder'], '#fb923c',
        'Pre-orders open.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 days', current_timestamp - interval '2 days'
    ),
    -- Premium accessories (Stark)
    (
        'b0000000-0000-0000-0000-20000000000d',
        'PRM-BAG-001', 'Leather Laptop Bag', '0193456000134',
        'active', 'Accessories', 'Stark',
        'Premium full-grain leather laptop bag.',
        'each', 1.200, '40x30x10 cm', 65.00, 229.99, 'USD',
        20, 80, 10,
        'b0000000-0000-0000-0000-100000000005',
        ARRAY['bag','premium'], '#dc2626', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '250 days', current_timestamp - interval '4 days'
    ),
    (
        'b0000000-0000-0000-0000-20000000000e',
        'PRM-WLT-002', 'Leather Cardholder', '0193456000141',
        'active', 'Accessories', 'Stark',
        'Slim full-grain leather cardholder.',
        'each', 0.060, '12x8x1 cm', 8.50, 39.99, 'USD',
        50, 200, 25,
        'b0000000-0000-0000-0000-100000000005',
        ARRAY['wallet','premium'], '#ef4444', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '200 days', current_timestamp - interval '9 days'
    ),
    (
        'b0000000-0000-0000-0000-20000000000f',
        'PRM-NTB-003', 'Hardcover Notebook', '0193456000158',
        'archived', 'Accessories', 'Stark',
        'Linen-bound notebook. Archived after limited run.',
        'each', 0.420, '22x16x2 cm', 5.00, 24.99, 'USD',
        0, 0, 0,
        'b0000000-0000-0000-0000-100000000005',
        ARRAY['notebook','archived'], '#7f1d1d', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '600 days', current_timestamp - interval '120 days'
    );


    ----------------------------------------------------------------
    -- Stock levels (per warehouse × product)
    ----------------------------------------------------------------

    INSERT INTO inventory.stock_levels (id, warehouse_id, product_id, quantity_on_hand, quantity_reserved, bin_location, last_counted_at, status, notes, created_at, updated_at) VALUES
    -- DC-MAIN
    ('b0000000-0000-0000-0000-300000000001', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000001', 220, 35, 'A1-01', current_timestamp - interval '7 days', 'in_stock', null, current_timestamp - interval '90 days', current_timestamp - interval '2 days'),
    ('b0000000-0000-0000-0000-300000000002', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000002', 1800, 250, 'A1-02', current_timestamp - interval '7 days', 'in_stock', null, current_timestamp - interval '90 days', current_timestamp - interval '2 days'),
    ('b0000000-0000-0000-0000-300000000003', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000003', 480, 50, 'A1-03', current_timestamp - interval '7 days', 'in_stock', null, current_timestamp - interval '90 days', current_timestamp - interval '2 days'),
    ('b0000000-0000-0000-0000-300000000004', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000004', 0, 0, 'A1-04', current_timestamp - interval '14 days', 'out_of_stock', 'Awaiting Q3 receipt.', current_timestamp - interval '90 days', current_timestamp - interval '12 days'),
    ('b0000000-0000-0000-0000-300000000005', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000005', 8500, 600, 'B2-01', current_timestamp - interval '5 days', 'in_stock', null, current_timestamp - interval '90 days', current_timestamp - interval '3 days'),
    ('b0000000-0000-0000-0000-300000000006', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000006', 1700, 100, 'B2-02', current_timestamp - interval '5 days', 'in_stock', null, current_timestamp - interval '90 days', current_timestamp - interval '8 days'),
    ('b0000000-0000-0000-0000-300000000007', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-200000000007', 130, 10, 'B2-03', current_timestamp - interval '5 days', 'in_stock', null, current_timestamp - interval '90 days', current_timestamp - interval '14 days'),
    ('b0000000-0000-0000-0000-300000000008', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-20000000000d', 60, 12, 'C3-01', current_timestamp - interval '10 days', 'in_stock', null, current_timestamp - interval '60 days', current_timestamp - interval '4 days'),
    ('b0000000-0000-0000-0000-300000000009', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-20000000000e', 180, 25, 'C3-02', current_timestamp - interval '10 days', 'in_stock', null, current_timestamp - interval '60 days', current_timestamp - interval '9 days'),

    -- FF-EAST
    ('b0000000-0000-0000-0000-30000000000a', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-200000000001', 95, 18, 'E-A1', current_timestamp - interval '6 days', 'in_stock', null, current_timestamp - interval '70 days', current_timestamp - interval '3 days'),
    ('b0000000-0000-0000-0000-30000000000b', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-200000000002', 850, 120, 'E-A2', current_timestamp - interval '6 days', 'in_stock', null, current_timestamp - interval '70 days', current_timestamp - interval '3 days'),
    ('b0000000-0000-0000-0000-30000000000c', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-200000000008', 85, 10, 'E-D1', current_timestamp - interval '4 days', 'low_stock', 'Below reorder point.', current_timestamp - interval '60 days', current_timestamp - interval '2 days'),
    ('b0000000-0000-0000-0000-30000000000d', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-200000000009', 35, 5, 'E-D2', current_timestamp - interval '4 days', 'low_stock', 'Reorder triggered.', current_timestamp - interval '60 days', current_timestamp - interval '2 days'),
    ('b0000000-0000-0000-0000-30000000000e', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-20000000000a', 250, 0, 'E-D3', current_timestamp - interval '20 days', 'overstocked', 'Discontinued — clear inventory.', current_timestamp - interval '180 days', current_timestamp - interval '20 days'),
    ('b0000000-0000-0000-0000-30000000000f', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-20000000000b', 22, 4, 'E-H1', current_timestamp - interval '5 days', 'low_stock', null, current_timestamp - interval '60 days', current_timestamp - interval '4 days'),

    -- SAT-MW
    ('b0000000-0000-0000-0000-300000000010', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-200000000002', 320, 40, 'M-01', current_timestamp - interval '8 days', 'in_stock', null, current_timestamp - interval '50 days', current_timestamp - interval '5 days'),
    ('b0000000-0000-0000-0000-300000000011', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-200000000003', 90, 8, 'M-02', current_timestamp - interval '8 days', 'low_stock', null, current_timestamp - interval '50 days', current_timestamp - interval '5 days'),
    ('b0000000-0000-0000-0000-300000000012', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-200000000005', 1200, 60, 'M-03', current_timestamp - interval '8 days', 'in_stock', null, current_timestamp - interval '50 days', current_timestamp - interval '5 days'),
    ('b0000000-0000-0000-0000-300000000013', 'b0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-200000000008', 60, 5, 'M-04', current_timestamp - interval '8 days', 'low_stock', 'Reorder pending.', current_timestamp - interval '50 days', current_timestamp - interval '5 days'),

    -- RET-01
    ('b0000000-0000-0000-0000-300000000014', 'b0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-200000000001', 12, 0, 'R-01', current_timestamp - interval '12 days', 'in_stock', 'Returned units pending refurb.', current_timestamp - interval '40 days', current_timestamp - interval '12 days'),
    ('b0000000-0000-0000-0000-300000000015', 'b0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-20000000000b', 8, 0, 'R-02', current_timestamp - interval '12 days', 'in_stock', 'Quality holds.', current_timestamp - interval '40 days', current_timestamp - interval '12 days');


    ----------------------------------------------------------------
    -- Purchase orders
    ----------------------------------------------------------------

    INSERT INTO inventory.purchase_orders (id, po_number, supplier_id, warehouse_id, status, order_date, expected_date, received_date, subtotal, tax, shipping, total, currency, description, tags, notes, user_id, created_at, updated_at) VALUES
    -- Received
    (
        'b0000000-0000-0000-0000-400000000001',
        'PO-2026-0001', 'b0000000-0000-0000-0000-100000000001', 'b0000000-0000-0000-0000-000000000001',
        'received',
        current_date - interval '50 days', current_date - interval '36 days', current_date - interval '34 days',
        15400.00, 1232.00, 350.00, 16982.00, 'USD',
        'Q1 electronics replenishment.',
        ARRAY['electronics','replenishment'], 'Received in full; 1 unit damaged on arrival.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '50 days', current_timestamp - interval '34 days'
    ),
    -- Partially received
    (
        'b0000000-0000-0000-0000-400000000002',
        'PO-2026-0002', 'b0000000-0000-0000-0000-100000000003', 'b0000000-0000-0000-0000-000000000002',
        'partially_received',
        current_date - interval '30 days', current_date - interval '9 days', null,
        4380.00, 350.00, 200.00, 4930.00, 'USD',
        'Apparel replenishment for east-coast fulfillment.',
        ARRAY['apparel'], 'T-shirts received; hoodies still in transit.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '30 days', current_timestamp - interval '5 days'
    ),
    -- Confirmed (in production at supplier)
    (
        'b0000000-0000-0000-0000-400000000003',
        'PO-2026-0003', 'b0000000-0000-0000-0000-100000000001', 'b0000000-0000-0000-0000-000000000001',
        'confirmed',
        current_date - interval '12 days', current_date + interval '10 days', null,
        7200.00, 580.00, 250.00, 8030.00, 'USD',
        'Mouse backorder fulfillment.',
        ARRAY['electronics','backorder'], 'Critical — clears the ELC-MSE-004 backorder.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '12 days', current_timestamp - interval '6 days'
    ),
    -- Submitted (recent)
    (
        'b0000000-0000-0000-0000-400000000004',
        'PO-2026-0004', 'b0000000-0000-0000-0000-100000000002', 'b0000000-0000-0000-0000-000000000001',
        'submitted',
        current_date - interval '4 days', current_date + interval '3 days', null,
        4150.00, 332.00, 0, 4482.00, 'USD',
        'Packaging top-up — boxes and tape.',
        ARRAY['packaging'], 'Auto-replen.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '4 days', current_timestamp - interval '4 days'
    ),
    -- Submitted (overdue)
    (
        'b0000000-0000-0000-0000-400000000005',
        'PO-2026-0005', 'b0000000-0000-0000-0000-100000000004', 'b0000000-0000-0000-0000-000000000002',
        'submitted',
        current_date - interval '40 days', current_date - interval '10 days', null,
        2400.00, 192.00, 150.00, 2742.00, 'USD',
        'Laptop stand replenishment.',
        ARRAY['hardware','overdue'], 'Supplier delayed — escalated.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '40 days', current_timestamp - interval '5 days'
    ),
    -- Draft
    (
        'b0000000-0000-0000-0000-400000000006',
        'PO-2026-0006', 'b0000000-0000-0000-0000-100000000005', 'b0000000-0000-0000-0000-000000000001',
        'draft',
        current_date - interval '1 day', current_date + interval '14 days', null,
        9750.00, 780.00, 200.00, 10730.00, 'USD',
        'Premium accessories Q3 buy.',
        ARRAY['premium','draft'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '1 day', current_timestamp - interval '1 day'
    ),
    -- Cancelled
    (
        'b0000000-0000-0000-0000-400000000007',
        'PO-2026-0007', 'b0000000-0000-0000-0000-100000000003', 'b0000000-0000-0000-0000-000000000003',
        'cancelled',
        current_date - interval '70 days', current_date - interval '49 days', null,
        2200.00, 176.00, 100.00, 2476.00, 'USD',
        'Cancelled apparel order — vendor capacity issue.',
        ARRAY['cancelled'], 'Re-routed to PO-2026-0002.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '70 days', current_timestamp - interval '60 days'
    );


    ----------------------------------------------------------------
    -- Purchase order items
    ----------------------------------------------------------------

    INSERT INTO inventory.purchase_order_items (id, po_id, product_id, quantity_ordered, quantity_received, unit_cost, notes, created_at) VALUES
    -- PO-2026-0001 (received)
    ('b0000000-0000-0000-0000-500000000001', 'b0000000-0000-0000-0000-400000000001', 'b0000000-0000-0000-0000-200000000001', 200, 200, 45.00, null, current_timestamp - interval '50 days'),
    ('b0000000-0000-0000-0000-500000000002', 'b0000000-0000-0000-0000-400000000001', 'b0000000-0000-0000-0000-200000000002', 1500, 1499, 3.20, '1 unit damaged on arrival.', current_timestamp - interval '50 days'),
    ('b0000000-0000-0000-0000-500000000003', 'b0000000-0000-0000-0000-400000000001', 'b0000000-0000-0000-0000-200000000003', 100, 100, 9.50, null, current_timestamp - interval '50 days'),

    -- PO-2026-0002 (partially received)
    ('b0000000-0000-0000-0000-500000000004', 'b0000000-0000-0000-0000-400000000002', 'b0000000-0000-0000-0000-200000000008', 300, 300, 6.00, 'Received.', current_timestamp - interval '30 days'),
    ('b0000000-0000-0000-0000-500000000005', 'b0000000-0000-0000-0000-400000000002', 'b0000000-0000-0000-0000-200000000009', 100, 0, 18.00, 'In transit.', current_timestamp - interval '30 days'),
    ('b0000000-0000-0000-0000-500000000006', 'b0000000-0000-0000-0000-400000000002', 'b0000000-0000-0000-0000-20000000000a', 30, 30, 4.50, 'Final clearance batch.', current_timestamp - interval '30 days'),

    -- PO-2026-0003 (confirmed)
    ('b0000000-0000-0000-0000-500000000007', 'b0000000-0000-0000-0000-400000000003', 'b0000000-0000-0000-0000-200000000004', 300, 0, 11.00, 'Clears the backorder once received.', current_timestamp - interval '12 days'),
    ('b0000000-0000-0000-0000-500000000008', 'b0000000-0000-0000-0000-400000000003', 'b0000000-0000-0000-0000-200000000003', 400, 0, 9.50, null, current_timestamp - interval '12 days'),

    -- PO-2026-0004 (submitted)
    ('b0000000-0000-0000-0000-500000000009', 'b0000000-0000-0000-0000-400000000004', 'b0000000-0000-0000-0000-200000000005', 5000, 0, 0.45, null, current_timestamp - interval '4 days'),
    ('b0000000-0000-0000-0000-50000000000a', 'b0000000-0000-0000-0000-400000000004', 'b0000000-0000-0000-0000-200000000006', 1000, 0, 1.20, null, current_timestamp - interval '4 days'),
    ('b0000000-0000-0000-0000-50000000000b', 'b0000000-0000-0000-0000-400000000004', 'b0000000-0000-0000-0000-200000000007', 50, 0, 18.00, null, current_timestamp - interval '4 days'),

    -- PO-2026-0005 (overdue submitted)
    ('b0000000-0000-0000-0000-50000000000c', 'b0000000-0000-0000-0000-400000000005', 'b0000000-0000-0000-0000-20000000000b', 200, 0, 12.00, 'Vendor delayed.', current_timestamp - interval '40 days'),

    -- PO-2026-0006 (draft)
    ('b0000000-0000-0000-0000-50000000000d', 'b0000000-0000-0000-0000-400000000006', 'b0000000-0000-0000-0000-20000000000d', 100, 0, 65.00, null, current_timestamp - interval '1 day'),
    ('b0000000-0000-0000-0000-50000000000e', 'b0000000-0000-0000-0000-400000000006', 'b0000000-0000-0000-0000-20000000000e', 250, 0, 8.50, null, current_timestamp - interval '1 day'),

    -- PO-2026-0007 (cancelled)
    ('b0000000-0000-0000-0000-50000000000f', 'b0000000-0000-0000-0000-400000000007', 'b0000000-0000-0000-0000-200000000008', 250, 0, 6.00, 'Cancelled with PO.', current_timestamp - interval '70 days'),
    ('b0000000-0000-0000-0000-500000000010', 'b0000000-0000-0000-0000-400000000007', 'b0000000-0000-0000-0000-200000000009', 50, 0, 18.00, 'Cancelled with PO.', current_timestamp - interval '70 days');


    ----------------------------------------------------------------
    -- Shipments
    ----------------------------------------------------------------

    INSERT INTO inventory.shipments (id, shipment_number, warehouse_id, customer_name, customer_email, destination_address, destination_city, destination_country, status, carrier, tracking_number, shipped_date, expected_delivery_date, delivered_date, weight, cost, currency, description, tags, notes, user_id, created_at, updated_at) VALUES
    -- Delivered on time
    (
        'b0000000-0000-0000-0000-600000000001',
        'SHP-2026-0001', 'b0000000-0000-0000-0000-000000000001',
        'Acme Corporation', 'shipping@acme.example.com', '500 Market Street', 'San Francisco', 'United States',
        'delivered', 'fedex', 'FX1Z9999990001',
        current_timestamp - interval '20 days', (current_date - interval '17 days'), current_timestamp - interval '17 days',
        4.5, 32.50, 'USD',
        'Acme equipment refresh — first batch.',
        ARRAY['customer','enterprise'], 'Signed for at front desk.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '21 days', current_timestamp - interval '17 days'
    ),
    -- Delivered late
    (
        'b0000000-0000-0000-0000-600000000002',
        'SHP-2026-0002', 'b0000000-0000-0000-0000-000000000002',
        'Initech Software', 'office@initech.example.com', '4120 Tech Boulevard', 'Austin', 'United States',
        'delivered', 'ups', '1Z999AA10000001',
        current_timestamp - interval '12 days', (current_date - interval '9 days'), current_timestamp - interval '7 days',
        2.1, 18.75, 'USD',
        'Initech swag pack.',
        ARRAY['swag'], 'Delayed at carrier hub by 2 days.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '13 days', current_timestamp - interval '7 days'
    ),
    -- In transit
    (
        'b0000000-0000-0000-0000-600000000003',
        'SHP-2026-0003', 'b0000000-0000-0000-0000-000000000001',
        'Stark Industries', 'office@stark.example.com', '10880 Malibu Point', 'New York', 'United States',
        'in_transit', 'fedex', 'FX1Z9999990003',
        current_timestamp - interval '2 days', (current_date + interval '2 days'), null,
        3.8, 28.20, 'USD',
        'Stark accessories order.',
        ARRAY['customer','premium'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '3 days', current_timestamp - interval '2 days'
    ),
    -- Shipped
    (
        'b0000000-0000-0000-0000-600000000004',
        'SHP-2026-0004', 'b0000000-0000-0000-0000-000000000002',
        'Globex Industries', 'receiving@globex.example.com', '88 Industrial Way', 'Chicago', 'United States',
        'shipped', 'usps', '9400111899560000000001',
        current_timestamp - interval '1 day', (current_date + interval '4 days'), null,
        1.2, 9.95, 'USD',
        'Globex evaluation kit.',
        ARRAY['eval'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 days', current_timestamp - interval '1 day'
    ),
    -- Preparing
    (
        'b0000000-0000-0000-0000-600000000005',
        'SHP-2026-0005', 'b0000000-0000-0000-0000-000000000001',
        'Wayne Enterprises', 'mailroom@wayne.example.com', '1007 Mountain Drive', 'Gotham', 'United States',
        'preparing', 'dhl', null,
        null, (current_date + interval '7 days'), null,
        6.0, 45.00, 'USD',
        'Wayne partner welcome kit.',
        ARRAY['partner'], 'Awaiting pick from B2-03.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '6 hours', current_timestamp - interval '6 hours'
    ),
    -- Returned
    (
        'b0000000-0000-0000-0000-600000000006',
        'SHP-2026-0006', 'b0000000-0000-0000-0000-000000000002',
        'Lisa Anderson Startup', 'lisa.anderson@example.com', '200 Mission Street', 'San Francisco', 'United States',
        'returned', 'ups', '1Z999AA10000006',
        current_timestamp - interval '40 days', (current_date - interval '37 days'), current_timestamp - interval '36 days',
        0.8, 8.10, 'USD',
        'Customer-initiated return.',
        ARRAY['return'], 'Items routed to RET-01 for refurb.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '45 days', current_timestamp - interval '20 days'
    );


    ----------------------------------------------------------------
    -- Shipment items
    ----------------------------------------------------------------

    INSERT INTO inventory.shipment_items (id, shipment_id, product_id, quantity, unit_price, notes, created_at) VALUES
    -- SHP-2026-0001 (delivered)
    ('b0000000-0000-0000-0000-700000000001', 'b0000000-0000-0000-0000-600000000001', 'b0000000-0000-0000-0000-200000000001', 10, 129.99, null, current_timestamp - interval '21 days'),
    ('b0000000-0000-0000-0000-700000000002', 'b0000000-0000-0000-0000-600000000001', 'b0000000-0000-0000-0000-200000000002', 25, 14.99, null, current_timestamp - interval '21 days'),
    ('b0000000-0000-0000-0000-700000000003', 'b0000000-0000-0000-0000-600000000001', 'b0000000-0000-0000-0000-200000000003', 10, 39.99, null, current_timestamp - interval '21 days'),

    -- SHP-2026-0002 (delivered late)
    ('b0000000-0000-0000-0000-700000000004', 'b0000000-0000-0000-0000-600000000002', 'b0000000-0000-0000-0000-200000000008', 20, 24.99, null, current_timestamp - interval '13 days'),
    ('b0000000-0000-0000-0000-700000000005', 'b0000000-0000-0000-0000-600000000002', 'b0000000-0000-0000-0000-200000000009', 10, 64.99, null, current_timestamp - interval '13 days'),

    -- SHP-2026-0003 (in transit)
    ('b0000000-0000-0000-0000-700000000006', 'b0000000-0000-0000-0000-600000000003', 'b0000000-0000-0000-0000-20000000000d', 5, 229.99, null, current_timestamp - interval '3 days'),
    ('b0000000-0000-0000-0000-700000000007', 'b0000000-0000-0000-0000-600000000003', 'b0000000-0000-0000-0000-20000000000e', 12, 39.99, null, current_timestamp - interval '3 days'),

    -- SHP-2026-0004 (shipped)
    ('b0000000-0000-0000-0000-700000000008', 'b0000000-0000-0000-0000-600000000004', 'b0000000-0000-0000-0000-200000000001', 2, 129.99, 'Demo unit.', current_timestamp - interval '2 days'),
    ('b0000000-0000-0000-0000-700000000009', 'b0000000-0000-0000-0000-600000000004', 'b0000000-0000-0000-0000-200000000002', 5, 14.99, null, current_timestamp - interval '2 days'),

    -- SHP-2026-0005 (preparing)
    ('b0000000-0000-0000-0000-70000000000a', 'b0000000-0000-0000-0000-600000000005', 'b0000000-0000-0000-0000-200000000008', 30, 24.99, null, current_timestamp - interval '6 hours'),
    ('b0000000-0000-0000-0000-70000000000b', 'b0000000-0000-0000-0000-600000000005', 'b0000000-0000-0000-0000-200000000009', 15, 64.99, null, current_timestamp - interval '6 hours'),
    ('b0000000-0000-0000-0000-70000000000c', 'b0000000-0000-0000-0000-600000000005', 'b0000000-0000-0000-0000-20000000000e', 15, 39.99, null, current_timestamp - interval '6 hours'),

    -- SHP-2026-0006 (returned)
    ('b0000000-0000-0000-0000-70000000000d', 'b0000000-0000-0000-0000-600000000006', 'b0000000-0000-0000-0000-200000000001', 1, 129.99, 'Customer return.', current_timestamp - interval '45 days');


    ----------------------------------------------------------------
    -- Stock movements (audit trail)
    ----------------------------------------------------------------

    INSERT INTO inventory.stock_movements (id, movement_number, type, product_id, warehouse_id, destination_warehouse_id, quantity, unit_cost, reference_type, reference_id, occurred_at, reason, notes, user_id, created_at) VALUES
    -- Receipts from PO-2026-0001
    ('b0000000-0000-0000-0000-800000000001', 'MOV-2026-0001', 'purchase_in', 'b0000000-0000-0000-0000-200000000001', 'b0000000-0000-0000-0000-000000000001', null, 200, 45.00,
     'purchase_order', 'b0000000-0000-0000-0000-400000000001',
     current_timestamp - interval '34 days', 'PO receipt', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '34 days'),
    ('b0000000-0000-0000-0000-800000000002', 'MOV-2026-0002', 'purchase_in', 'b0000000-0000-0000-0000-200000000002', 'b0000000-0000-0000-0000-000000000001', null, 1499, 3.20,
     'purchase_order', 'b0000000-0000-0000-0000-400000000001',
     current_timestamp - interval '34 days', 'PO receipt', '1 unit damaged not received.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '34 days'),

    -- Damage out (the broken cable)
    ('b0000000-0000-0000-0000-800000000003', 'MOV-2026-0003', 'damage_out', 'b0000000-0000-0000-0000-200000000002', 'b0000000-0000-0000-0000-000000000001', null, 1, 3.20,
     'adjustment', null,
     current_timestamp - interval '34 days', 'Damaged on arrival', 'Discarded; supplier credit pending.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '34 days'),

    -- Sale outs (matching delivered shipment SHP-2026-0001)
    ('b0000000-0000-0000-0000-800000000004', 'MOV-2026-0004', 'sale_out', 'b0000000-0000-0000-0000-200000000001', 'b0000000-0000-0000-0000-000000000001', null, 10, 45.00,
     'shipment', 'b0000000-0000-0000-0000-600000000001',
     current_timestamp - interval '20 days', 'Customer shipment', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '20 days'),
    ('b0000000-0000-0000-0000-800000000005', 'MOV-2026-0005', 'sale_out', 'b0000000-0000-0000-0000-200000000002', 'b0000000-0000-0000-0000-000000000001', null, 25, 3.20,
     'shipment', 'b0000000-0000-0000-0000-600000000001',
     current_timestamp - interval '20 days', 'Customer shipment', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '20 days'),

    -- Transfer DC-MAIN -> SAT-MW
    ('b0000000-0000-0000-0000-800000000006', 'MOV-2026-0006', 'transfer_out', 'b0000000-0000-0000-0000-200000000005', 'b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 1200, 0.45,
     'adjustment', null,
     current_timestamp - interval '15 days', 'Replenish satellite', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '15 days'),
    ('b0000000-0000-0000-0000-800000000007', 'MOV-2026-0007', 'transfer_in', 'b0000000-0000-0000-0000-200000000005', 'b0000000-0000-0000-0000-000000000003', null, 1200, 0.45,
     'adjustment', null,
     current_timestamp - interval '15 days', 'Replenish satellite', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '14 days'),

    -- Sale outs from FF-EAST shipment
    ('b0000000-0000-0000-0000-800000000008', 'MOV-2026-0008', 'sale_out', 'b0000000-0000-0000-0000-200000000008', 'b0000000-0000-0000-0000-000000000002', null, 20, 6.00,
     'shipment', 'b0000000-0000-0000-0000-600000000002',
     current_timestamp - interval '12 days', 'Customer shipment', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '12 days'),
    ('b0000000-0000-0000-0000-800000000009', 'MOV-2026-0009', 'sale_out', 'b0000000-0000-0000-0000-200000000009', 'b0000000-0000-0000-0000-000000000002', null, 10, 18.00,
     'shipment', 'b0000000-0000-0000-0000-600000000002',
     current_timestamp - interval '12 days', 'Customer shipment', null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '12 days'),

    -- Cycle count adjustment
    ('b0000000-0000-0000-0000-80000000000a', 'MOV-2026-0010', 'adjustment', 'b0000000-0000-0000-0000-200000000005', 'b0000000-0000-0000-0000-000000000001', null, -25, 0.45,
     'adjustment', null,
     current_timestamp - interval '5 days', 'Cycle count variance', 'Counted vs system; adjusted down.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '5 days'),

    -- Return inbound (RET-01)
    ('b0000000-0000-0000-0000-80000000000b', 'MOV-2026-0011', 'return_in', 'b0000000-0000-0000-0000-200000000001', 'b0000000-0000-0000-0000-000000000004', null, 1, 45.00,
     'shipment', 'b0000000-0000-0000-0000-600000000006',
     current_timestamp - interval '36 days', 'Customer return', 'Routed for refurb.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '36 days'),

    -- PO partial receipt (apparel t-shirts)
    ('b0000000-0000-0000-0000-80000000000c', 'MOV-2026-0012', 'purchase_in', 'b0000000-0000-0000-0000-200000000008', 'b0000000-0000-0000-0000-000000000002', null, 300, 6.00,
     'purchase_order', 'b0000000-0000-0000-0000-400000000002',
     current_timestamp - interval '8 days', 'PO partial receipt', 'Hoodies still in transit.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '8 days');
