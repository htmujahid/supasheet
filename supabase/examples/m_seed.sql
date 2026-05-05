
    -- Manufacturing & Production Planning Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)
    -- product_id values are aligned to inventory.products UUIDs (b0000000-…) so both modules join when both are loaded.

    ----------------------------------------------------------------
    -- Work centers
    ----------------------------------------------------------------

    INSERT INTO manufacturing.work_centers (id, code, name, type, status, description, location, capacity_per_hour, cost_per_hour, currency, operator_user_id, is_active, color, tags, notes, created_at, updated_at) VALUES
    (
        'd0000000-0000-0000-0000-000000000001',
        'WC-ASM-01', 'Assembly Line 1', 'assembly', 'busy',
        'Primary assembly line for electronics.',
        'Plant A — Bay 1', 60, 45.00, 'USD',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        true, '#3b82f6', ARRAY['assembly','electronics'],
        'Runs two shifts.',
        current_timestamp - interval '700 days', current_timestamp - interval '5 days'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'WC-MCH-01', 'CNC Cell', 'machining', 'available',
        'CNC machining cell for metal parts.',
        'Plant A — Bay 2', 25, 80.00, 'USD',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        true, '#f97316', ARRAY['cnc','machining'],
        null,
        current_timestamp - interval '650 days', current_timestamp - interval '10 days'
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'WC-PKG-01', 'Packaging Station', 'packaging', 'available',
        'Final packaging and labeling station.',
        'Plant A — Bay 3', 120, 25.00, 'USD',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        true, '#22c55e', ARRAY['packaging'],
        null,
        current_timestamp - interval '500 days', current_timestamp - interval '8 days'
    ),
    (
        'd0000000-0000-0000-0000-000000000004',
        'WC-INS-01', 'QA Inspection Bench', 'inspection', 'busy',
        'In-line quality inspection bench.',
        'Plant A — QA Lane', 80, 35.00, 'USD',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        true, '#a855f7', ARRAY['qa','inspection'],
        null,
        current_timestamp - interval '450 days', current_timestamp - interval '3 days'
    ),
    (
        'd0000000-0000-0000-0000-000000000005',
        'WC-FIN-01', 'Finishing Booth', 'finishing', 'maintenance',
        'Powder coating and finishing booth.',
        'Plant B — Bay 1', 40, 55.00, 'USD',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        true, '#ec4899', ARRAY['finishing','coating'],
        'Quarterly maintenance — back online next week.',
        current_timestamp - interval '400 days', current_timestamp - interval '2 days'
    );


    ----------------------------------------------------------------
    -- BOMs
    ----------------------------------------------------------------

    INSERT INTO manufacturing.boms (id, bom_number, name, version, product_sku, product_name, product_id, status, output_quantity, unit_of_measure, description, effective_from, effective_to, estimated_cost, currency, tags, color, notes, user_id, created_at, updated_at) VALUES
    (
        'd0000000-0000-0000-0000-100000000001',
        'BOM-2026-0001',
        'Wireless Headphones Pro — Standard BOM',
        '2.1',
        'ELC-WHP-001', 'Wireless Headphones — Pro',
        'b0000000-0000-0000-0000-200000000001',
        'active', 1, 'each',
        'Standard production BOM for the Pro headphone line.',
        current_date - interval '180 days', null,
        38.50, 'USD',
        ARRAY['electronics','active'], '#3b82f6',
        'Released after v2.0 component refresh.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '200 days', current_timestamp - interval '20 days'
    ),
    (
        'd0000000-0000-0000-0000-100000000002',
        'BOM-2026-0002',
        'USB-C Cable 2m — Standard BOM',
        '1.4',
        'ELC-CBL-002', 'USB-C Cable 2m',
        'b0000000-0000-0000-0000-200000000002',
        'active', 50, 'each',
        'Bulk-batch BOM yielding 50 cables per run.',
        current_date - interval '300 days', null,
        125.00, 'USD',
        ARRAY['electronics','batch'], '#0ea5e9',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '320 days', current_timestamp - interval '40 days'
    ),
    (
        'd0000000-0000-0000-0000-100000000003',
        'BOM-2026-0003',
        'USB-C Docking Station — Pre-release BOM',
        '0.9',
        'HW-DOC-002', 'USB-C Docking Station',
        'b0000000-0000-0000-0000-20000000000c',
        'draft', 1, 'each',
        'Pre-release BOM pending validation runs.',
        current_date + interval '14 days', null,
        42.00, 'USD',
        ARRAY['hardware','draft'], '#fb923c',
        'Awaiting final component sign-off.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 days', current_timestamp - interval '4 days'
    ),
    (
        'd0000000-0000-0000-0000-100000000004',
        'BOM-2026-0004',
        'Leather Laptop Bag — Standard BOM',
        '1.0',
        'PRM-BAG-001', 'Leather Laptop Bag',
        'b0000000-0000-0000-0000-20000000000d',
        'active', 1, 'each',
        'Single-bag production BOM.',
        current_date - interval '120 days', null,
        72.00, 'USD',
        ARRAY['accessories','premium'], '#dc2626',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '140 days', current_timestamp - interval '10 days'
    );


    ----------------------------------------------------------------
    -- BOM items
    ----------------------------------------------------------------

    INSERT INTO manufacturing.bom_items (id, bom_id, line_number, component_sku, component_name, component_id, quantity, unit_of_measure, scrap_pct, unit_cost, is_optional, notes, created_at) VALUES
    -- BOM-2026-0001 (Headphones)
    ('d0000000-0000-0000-0000-200000000001', 'd0000000-0000-0000-0000-100000000001', 10, 'CMP-DRV-40', 'Driver Unit 40mm', null, 2, 'each', 1.0, 6.50, false, 'L+R drivers.', current_timestamp - interval '200 days'),
    ('d0000000-0000-0000-0000-200000000002', 'd0000000-0000-0000-0000-100000000001', 20, 'CMP-PCB-WHP', 'Headphone Mainboard', null, 1, 'each', 0.5, 12.00, false, null, current_timestamp - interval '200 days'),
    ('d0000000-0000-0000-0000-200000000003', 'd0000000-0000-0000-0000-100000000001', 30, 'CMP-BAT-LIPO', '900mAh LiPo Battery', null, 1, 'each', 0.5, 4.20, false, null, current_timestamp - interval '200 days'),
    ('d0000000-0000-0000-0000-200000000004', 'd0000000-0000-0000-0000-100000000001', 40, 'CMP-HSG-WHP', 'Headphone Housing Pair', null, 1, 'set', 1.0, 5.30, false, null, current_timestamp - interval '200 days'),
    ('d0000000-0000-0000-0000-200000000005', 'd0000000-0000-0000-0000-100000000001', 50, 'CMP-PAD-EAR', 'Memory Foam Earpads', null, 2, 'each', 2.0, 1.80, false, null, current_timestamp - interval '200 days'),
    ('d0000000-0000-0000-0000-200000000006', 'd0000000-0000-0000-0000-100000000001', 60, 'PKG-BOX-WHP', 'Retail Box', null, 1, 'each', 0.5, 0.80, false, null, current_timestamp - interval '200 days'),

    -- BOM-2026-0002 (USB-C cable, batch of 50)
    ('d0000000-0000-0000-0000-200000000007', 'd0000000-0000-0000-0000-100000000002', 10, 'CMP-WIR-USBC', 'USB-C Wire 2m', null, 50, 'each', 1.5, 1.10, false, null, current_timestamp - interval '320 days'),
    ('d0000000-0000-0000-0000-200000000008', 'd0000000-0000-0000-0000-100000000002', 20, 'CMP-CON-USBC', 'USB-C Connector', null, 100, 'each', 0.5, 0.40, false, '2 per cable.', current_timestamp - interval '320 days'),
    ('d0000000-0000-0000-0000-200000000009', 'd0000000-0000-0000-0000-100000000002', 30, 'CMP-BRD-NYL', 'Nylon Braid Sleeve', null, 50, 'each', 2.0, 0.30, false, null, current_timestamp - interval '320 days'),

    -- BOM-2026-0003 (Dock — draft)
    ('d0000000-0000-0000-0000-20000000000a', 'd0000000-0000-0000-0000-100000000003', 10, 'CMP-PCB-DOC', 'Dock Mainboard', null, 1, 'each', 1.0, 22.00, false, null, current_timestamp - interval '20 days'),
    ('d0000000-0000-0000-0000-20000000000b', 'd0000000-0000-0000-0000-100000000003', 20, 'CMP-HSG-DOC', 'Aluminum Dock Housing', null, 1, 'each', 1.0, 14.00, false, null, current_timestamp - interval '20 days'),
    ('d0000000-0000-0000-0000-20000000000c', 'd0000000-0000-0000-0000-100000000003', 30, 'CMP-CBL-PIG', 'Pigtail Cable USB-C', null, 1, 'each', 1.0, 3.50, false, null, current_timestamp - interval '20 days'),
    ('d0000000-0000-0000-0000-20000000000d', 'd0000000-0000-0000-0000-100000000003', 40, 'PKG-BOX-DOC', 'Dock Retail Box', null, 1, 'each', 0.5, 0.90, false, null, current_timestamp - interval '20 days'),

    -- BOM-2026-0004 (Leather bag)
    ('d0000000-0000-0000-0000-20000000000e', 'd0000000-0000-0000-0000-100000000004', 10, 'CMP-LTH-FG', 'Full-grain Leather Panel Set', null, 1, 'set', 1.0, 48.00, false, null, current_timestamp - interval '140 days'),
    ('d0000000-0000-0000-0000-20000000000f', 'd0000000-0000-0000-0000-100000000004', 20, 'CMP-ZIP-YKK', 'YKK Zipper 60cm', null, 1, 'each', 0.5, 4.50, false, null, current_timestamp - interval '140 days'),
    ('d0000000-0000-0000-0000-200000000010', 'd0000000-0000-0000-0000-100000000004', 30, 'CMP-STR-WBG', 'Webbing Strap', null, 1, 'each', 1.0, 6.00, false, null, current_timestamp - interval '140 days'),
    ('d0000000-0000-0000-0000-200000000011', 'd0000000-0000-0000-0000-100000000004', 40, 'CMP-HW-BUK', 'Brass Buckle Set', null, 1, 'set', 0.5, 4.20, false, null, current_timestamp - interval '140 days'),
    ('d0000000-0000-0000-0000-200000000012', 'd0000000-0000-0000-0000-100000000004', 50, 'PKG-BAG-DST', 'Dust Bag', null, 1, 'each', 0.5, 1.50, true, 'Optional gift packaging.', current_timestamp - interval '140 days');


    ----------------------------------------------------------------
    -- Routings
    ----------------------------------------------------------------

    INSERT INTO manufacturing.routings (id, routing_number, name, version, product_sku, product_name, bom_id, status, description, estimated_minutes, tags, notes, user_id, created_at, updated_at) VALUES
    (
        'd0000000-0000-0000-0000-300000000001',
        'RT-2026-0001',
        'Wireless Headphones Pro — Standard Routing',
        '2.0',
        'ELC-WHP-001', 'Wireless Headphones — Pro',
        'd0000000-0000-0000-0000-100000000001',
        'active',
        'Assembly → Inspection → Packaging.', 22,
        ARRAY['electronics'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '180 days', current_timestamp - interval '15 days'
    ),
    (
        'd0000000-0000-0000-0000-300000000002',
        'RT-2026-0002',
        'USB-C Cable 2m — Batch Routing',
        '1.2',
        'ELC-CBL-002', 'USB-C Cable 2m',
        'd0000000-0000-0000-0000-100000000002',
        'active',
        'Cut → Solder → Sleeve → Pack (batch of 50).', 90,
        ARRAY['electronics','batch'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '300 days', current_timestamp - interval '30 days'
    ),
    (
        'd0000000-0000-0000-0000-300000000003',
        'RT-2026-0003',
        'USB-C Docking Station — Pilot Routing',
        '0.9',
        'HW-DOC-002', 'USB-C Docking Station',
        'd0000000-0000-0000-0000-100000000003',
        'draft',
        'Pilot routing for first build.', 35,
        ARRAY['hardware','pilot'], 'Awaiting time-study finalization.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '3 days'
    ),
    (
        'd0000000-0000-0000-0000-300000000004',
        'RT-2026-0004',
        'Leather Laptop Bag — Standard Routing',
        '1.0',
        'PRM-BAG-001', 'Leather Laptop Bag',
        'd0000000-0000-0000-0000-100000000004',
        'active',
        'Cut → Stitch → Finish → Inspect → Pack.', 75,
        ARRAY['accessories'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '120 days', current_timestamp - interval '20 days'
    );


    ----------------------------------------------------------------
    -- Routing operations
    ----------------------------------------------------------------

    INSERT INTO manufacturing.routing_operations (id, routing_id, sequence_number, name, description, work_center_id, setup_minutes, run_minutes_per_unit, instructions, notes, created_at) VALUES
    -- RT-2026-0001 (Headphones)
    ('d0000000-0000-0000-0000-400000000001', 'd0000000-0000-0000-0000-300000000001', 10, 'Assemble PCB & drivers',
     'Solder drivers to PCB, install in housing.',
     'd0000000-0000-0000-0000-000000000001', 5, 8.0,
     'Follow ASM-WHP-001 work instruction.', null, current_timestamp - interval '180 days'),
    ('d0000000-0000-0000-0000-400000000002', 'd0000000-0000-0000-0000-300000000001', 20, 'In-line inspection',
     'Functional and acoustic check.',
     'd0000000-0000-0000-0000-000000000004', 2, 4.0,
     'Acoustic test using rig A.', null, current_timestamp - interval '180 days'),
    ('d0000000-0000-0000-0000-400000000003', 'd0000000-0000-0000-0000-300000000001', 30, 'Pack & label',
     'Pack into retail box, label and palletize.',
     'd0000000-0000-0000-0000-000000000003', 1, 3.0,
     'Use box CMP-BOX-WHP.', null, current_timestamp - interval '180 days'),

    -- RT-2026-0002 (Cable batch)
    ('d0000000-0000-0000-0000-400000000004', 'd0000000-0000-0000-0000-300000000002', 10, 'Cut & strip wires',
     'Cut wire to length and strip ends.',
     'd0000000-0000-0000-0000-000000000002', 5, 0.4,
     null, null, current_timestamp - interval '300 days'),
    ('d0000000-0000-0000-0000-400000000005', 'd0000000-0000-0000-0000-300000000002', 20, 'Solder connectors',
     'Solder USB-C connectors on both ends.',
     'd0000000-0000-0000-0000-000000000001', 5, 0.6,
     'Both ends per cable.', null, current_timestamp - interval '300 days'),
    ('d0000000-0000-0000-0000-400000000006', 'd0000000-0000-0000-0000-300000000002', 30, 'Apply nylon sleeve',
     null,
     'd0000000-0000-0000-0000-000000000005', 5, 0.3,
     null, null, current_timestamp - interval '300 days'),
    ('d0000000-0000-0000-0000-400000000007', 'd0000000-0000-0000-0000-300000000002', 40, 'Bag & label',
     null,
     'd0000000-0000-0000-0000-000000000003', 2, 0.2,
     null, null, current_timestamp - interval '300 days'),

    -- RT-2026-0003 (Dock pilot)
    ('d0000000-0000-0000-0000-400000000008', 'd0000000-0000-0000-0000-300000000003', 10, 'Assemble dock',
     'Mount PCB into housing, attach pigtail.',
     'd0000000-0000-0000-0000-000000000001', 8, 18.0,
     null, null, current_timestamp - interval '15 days'),
    ('d0000000-0000-0000-0000-400000000009', 'd0000000-0000-0000-0000-300000000003', 20, 'Functional test',
     'All ports functional test.',
     'd0000000-0000-0000-0000-000000000004', 3, 8.0,
     null, null, current_timestamp - interval '15 days'),
    ('d0000000-0000-0000-0000-40000000000a', 'd0000000-0000-0000-0000-300000000003', 30, 'Pack',
     null,
     'd0000000-0000-0000-0000-000000000003', 1, 4.0,
     null, null, current_timestamp - interval '15 days'),

    -- RT-2026-0004 (Leather bag)
    ('d0000000-0000-0000-0000-40000000000b', 'd0000000-0000-0000-0000-300000000004', 10, 'Cut leather panels',
     null,
     'd0000000-0000-0000-0000-000000000002', 10, 12.0,
     null, null, current_timestamp - interval '120 days'),
    ('d0000000-0000-0000-0000-40000000000c', 'd0000000-0000-0000-0000-300000000004', 20, 'Stitch & assemble',
     null,
     'd0000000-0000-0000-0000-000000000001', 5, 35.0,
     null, null, current_timestamp - interval '120 days'),
    ('d0000000-0000-0000-0000-40000000000d', 'd0000000-0000-0000-0000-300000000004', 30, 'Finish edges',
     null,
     'd0000000-0000-0000-0000-000000000005', 5, 12.0,
     null, null, current_timestamp - interval '120 days'),
    ('d0000000-0000-0000-0000-40000000000e', 'd0000000-0000-0000-0000-300000000004', 40, 'Inspect',
     null,
     'd0000000-0000-0000-0000-000000000004', 2, 8.0,
     null, null, current_timestamp - interval '120 days'),
    ('d0000000-0000-0000-0000-40000000000f', 'd0000000-0000-0000-0000-300000000004', 50, 'Pack & ship',
     null,
     'd0000000-0000-0000-0000-000000000003', 2, 5.0,
     null, null, current_timestamp - interval '120 days');


    ----------------------------------------------------------------
    -- Work orders
    ----------------------------------------------------------------

    INSERT INTO manufacturing.work_orders (id, work_order_number, product_sku, product_name, product_id, bom_id, routing_id, status, priority, quantity_planned, quantity_completed, quantity_scrapped, unit_of_measure, planned_start_date, planned_end_date, actual_start_date, actual_end_date, estimated_cost, actual_cost, currency, description, sales_order_reference, assigned_user_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Completed on time
    (
        'd0000000-0000-0000-0000-500000000001',
        'WO-2026-0001',
        'ELC-WHP-001', 'Wireless Headphones — Pro',
        'b0000000-0000-0000-0000-200000000001',
        'd0000000-0000-0000-0000-100000000001',
        'd0000000-0000-0000-0000-300000000001',
        'completed', 'high',
        200, 198, 2, 'each',
        current_date - interval '40 days', current_date - interval '32 days',
        current_timestamp - interval '40 days', current_timestamp - interval '33 days',
        7700.00, 7820.00, 'USD',
        'Headphone Q1 replenishment.',
        'SO-AC-1234', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['electronics','completed'], '#3b82f6',
        'Yield 99%; 2 units scrapped at QA.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '50 days', current_timestamp - interval '32 days'
    ),
    -- Completed late
    (
        'd0000000-0000-0000-0000-500000000002',
        'WO-2026-0002',
        'ELC-CBL-002', 'USB-C Cable 2m',
        'b0000000-0000-0000-0000-200000000002',
        'd0000000-0000-0000-0000-100000000002',
        'd0000000-0000-0000-0000-300000000002',
        'completed', 'medium',
        1500, 1480, 20, 'each',
        current_date - interval '30 days', current_date - interval '23 days',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days',
        4200.00, 4350.00, 'USD',
        'Bulk cable batch — 30 sub-runs of 50.',
        'SO-INI-2345', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['electronics','batch'], '#0ea5e9',
        'Hit minor solder defect mid-run; recovered.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '20 days'
    ),
    -- In progress
    (
        'd0000000-0000-0000-0000-500000000003',
        'WO-2026-0003',
        'PRM-BAG-001', 'Leather Laptop Bag',
        'b0000000-0000-0000-0000-20000000000d',
        'd0000000-0000-0000-0000-100000000004',
        'd0000000-0000-0000-0000-300000000004',
        'in_progress', 'high',
        50, 22, 1, 'each',
        current_date - interval '6 days', current_date + interval '4 days',
        current_timestamp - interval '6 days', null,
        3600.00, 1700.00, 'USD',
        'Premium Q2 bag run.',
        'SO-STARK-3456', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['accessories','premium'], '#dc2626',
        'On track with current cadence.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '1 day'
    ),
    -- Released (not started)
    (
        'd0000000-0000-0000-0000-500000000004',
        'WO-2026-0004',
        'ELC-WHP-001', 'Wireless Headphones — Pro',
        'b0000000-0000-0000-0000-200000000001',
        'd0000000-0000-0000-0000-100000000001',
        'd0000000-0000-0000-0000-300000000001',
        'released', 'critical',
        300, 0, 0, 'each',
        current_date + interval '2 days', current_date + interval '14 days',
        null, null,
        11550.00, null, 'USD',
        'Q3 enterprise headphone allocation.',
        'SO-WAYNE-4567', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['electronics','enterprise'], '#1d4ed8',
        'Critical for Wayne contract.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '4 days', current_timestamp - interval '2 days'
    ),
    -- On hold (overdue)
    (
        'd0000000-0000-0000-0000-500000000005',
        'WO-2026-0005',
        'HW-DOC-002', 'USB-C Docking Station',
        'b0000000-0000-0000-0000-20000000000c',
        'd0000000-0000-0000-0000-100000000003',
        'd0000000-0000-0000-0000-300000000003',
        'on_hold', 'medium',
        25, 0, 0, 'each',
        current_date - interval '14 days', current_date - interval '4 days',
        null, null,
        1100.00, null, 'USD',
        'Pilot run for new dock.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['hardware','pilot','on_hold'], '#fb923c',
        'On hold pending finalized BOM.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 days', current_timestamp - interval '4 days'
    ),
    -- Planned future
    (
        'd0000000-0000-0000-0000-500000000006',
        'WO-2026-0006',
        'ELC-CBL-002', 'USB-C Cable 2m',
        'b0000000-0000-0000-0000-200000000002',
        'd0000000-0000-0000-0000-100000000002',
        'd0000000-0000-0000-0000-300000000002',
        'planned', 'low',
        2000, 0, 0, 'each',
        current_date + interval '14 days', current_date + interval '21 days',
        null, null,
        5500.00, null, 'USD',
        'Q3 cable replenishment.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['electronics','batch','future'], '#0284c7',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '3 days', current_timestamp - interval '3 days'
    ),
    -- Cancelled
    (
        'd0000000-0000-0000-0000-500000000007',
        'WO-2026-0007',
        'PRM-BAG-001', 'Leather Laptop Bag',
        'b0000000-0000-0000-0000-20000000000d',
        'd0000000-0000-0000-0000-100000000004',
        'd0000000-0000-0000-0000-300000000004',
        'cancelled', 'low',
        20, 0, 0, 'each',
        current_date - interval '60 days', current_date - interval '50 days',
        null, null,
        1440.00, null, 'USD',
        'Custom run cancelled by customer.',
        'SO-LISA-9999', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['cancelled'], '#94a3b8',
        'Cancelled before start.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '70 days', current_timestamp - interval '60 days'
    );


    ----------------------------------------------------------------
    -- Work order operations
    ----------------------------------------------------------------

    INSERT INTO manufacturing.work_order_operations (id, work_order_id, routing_operation_id, work_center_id, sequence_number, name, status, planned_start_at, planned_end_at, actual_start_at, actual_end_at, planned_minutes, actual_minutes, operator_user_id, quantity_good, quantity_scrap, instructions, notes, created_at, updated_at) VALUES
    -- WO-0001 (completed)
    ('d0000000-0000-0000-0000-600000000001', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-400000000001', 'd0000000-0000-0000-0000-000000000001',
     10, 'Assemble PCB & drivers', 'completed',
     current_timestamp - interval '40 days', current_timestamp - interval '37 days',
     current_timestamp - interval '40 days', current_timestamp - interval '37 days',
     1605, 1620, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 200, 0, null, null,
     current_timestamp - interval '50 days', current_timestamp - interval '37 days'),
    ('d0000000-0000-0000-0000-600000000002', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-400000000002', 'd0000000-0000-0000-0000-000000000004',
     20, 'In-line inspection', 'completed',
     current_timestamp - interval '37 days', current_timestamp - interval '35 days',
     current_timestamp - interval '37 days', current_timestamp - interval '35 days',
     802, 820, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 198, 2, null, '2 units rejected for L/R imbalance.',
     current_timestamp - interval '50 days', current_timestamp - interval '35 days'),
    ('d0000000-0000-0000-0000-600000000003', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-400000000003', 'd0000000-0000-0000-0000-000000000003',
     30, 'Pack & label', 'completed',
     current_timestamp - interval '35 days', current_timestamp - interval '33 days',
     current_timestamp - interval '35 days', current_timestamp - interval '33 days',
     601, 595, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 198, 0, null, null,
     current_timestamp - interval '50 days', current_timestamp - interval '33 days'),

    -- WO-0002 (completed)
    ('d0000000-0000-0000-0000-600000000004', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-400000000004', 'd0000000-0000-0000-0000-000000000002',
     10, 'Cut & strip wires', 'completed',
     current_timestamp - interval '30 days', current_timestamp - interval '28 days',
     current_timestamp - interval '30 days', current_timestamp - interval '28 days',
     605, 615, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 1500, 0, null, null,
     current_timestamp - interval '40 days', current_timestamp - interval '28 days'),
    ('d0000000-0000-0000-0000-600000000005', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-400000000005', 'd0000000-0000-0000-0000-000000000001',
     20, 'Solder connectors', 'completed',
     current_timestamp - interval '28 days', current_timestamp - interval '24 days',
     current_timestamp - interval '28 days', current_timestamp - interval '23 days',
     905, 1020, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 1480, 20, null, 'Solder defects on first 20.',
     current_timestamp - interval '40 days', current_timestamp - interval '23 days'),
    ('d0000000-0000-0000-0000-600000000006', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-400000000007', 'd0000000-0000-0000-0000-000000000003',
     40, 'Bag & label', 'completed',
     current_timestamp - interval '23 days', current_timestamp - interval '22 days',
     current_timestamp - interval '23 days', current_timestamp - interval '20 days',
     302, 310, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 1480, 0, null, null,
     current_timestamp - interval '40 days', current_timestamp - interval '20 days'),

    -- WO-0003 (in progress — 22 done, leather bag)
    ('d0000000-0000-0000-0000-600000000007', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-40000000000b', 'd0000000-0000-0000-0000-000000000002',
     10, 'Cut leather panels', 'completed',
     current_timestamp - interval '6 days', current_timestamp - interval '5 days',
     current_timestamp - interval '6 days', current_timestamp - interval '5 days',
     610, 590, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 50, 0, null, null,
     current_timestamp - interval '15 days', current_timestamp - interval '5 days'),
    ('d0000000-0000-0000-0000-600000000008', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-40000000000c', 'd0000000-0000-0000-0000-000000000001',
     20, 'Stitch & assemble', 'in_progress',
     current_timestamp - interval '5 days', current_timestamp - interval '2 days',
     current_timestamp - interval '5 days', null,
     1755, 1380, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 22, 1, null, '1 unit set aside for rework.',
     current_timestamp - interval '15 days', current_timestamp - interval '6 hours'),
    ('d0000000-0000-0000-0000-600000000009', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-40000000000d', 'd0000000-0000-0000-0000-000000000005',
     30, 'Finish edges', 'pending',
     current_timestamp - interval '2 days', current_timestamp + interval '1 day',
     null, null,
     605, 0, null, 0, 0, null, 'Blocked: WC-FIN-01 in maintenance.',
     current_timestamp - interval '15 days', current_timestamp - interval '15 days'),
    ('d0000000-0000-0000-0000-60000000000a', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-40000000000e', 'd0000000-0000-0000-0000-000000000004',
     40, 'Inspect', 'pending',
     current_timestamp + interval '1 day', current_timestamp + interval '2 days',
     null, null,
     402, 0, null, 0, 0, null, null,
     current_timestamp - interval '15 days', current_timestamp - interval '15 days'),
    ('d0000000-0000-0000-0000-60000000000b', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-40000000000f', 'd0000000-0000-0000-0000-000000000003',
     50, 'Pack & ship', 'pending',
     current_timestamp + interval '2 days', current_timestamp + interval '4 days',
     null, null,
     252, 0, null, 0, 0, null, null,
     current_timestamp - interval '15 days', current_timestamp - interval '15 days'),

    -- WO-0004 (released — operations queued)
    ('d0000000-0000-0000-0000-60000000000c', 'd0000000-0000-0000-0000-500000000004', 'd0000000-0000-0000-0000-400000000001', 'd0000000-0000-0000-0000-000000000001',
     10, 'Assemble PCB & drivers', 'pending',
     current_timestamp + interval '2 days', current_timestamp + interval '6 days',
     null, null,
     2405, 0, null, 0, 0, null, null,
     current_timestamp - interval '4 days', current_timestamp - interval '4 days'),
    ('d0000000-0000-0000-0000-60000000000d', 'd0000000-0000-0000-0000-500000000004', 'd0000000-0000-0000-0000-400000000002', 'd0000000-0000-0000-0000-000000000004',
     20, 'In-line inspection', 'pending',
     current_timestamp + interval '6 days', current_timestamp + interval '9 days',
     null, null,
     1202, 0, null, 0, 0, null, null,
     current_timestamp - interval '4 days', current_timestamp - interval '4 days'),
    ('d0000000-0000-0000-0000-60000000000e', 'd0000000-0000-0000-0000-500000000004', 'd0000000-0000-0000-0000-400000000003', 'd0000000-0000-0000-0000-000000000003',
     30, 'Pack & label', 'pending',
     current_timestamp + interval '9 days', current_timestamp + interval '12 days',
     null, null,
     901, 0, null, 0, 0, null, null,
     current_timestamp - interval '4 days', current_timestamp - interval '4 days');


    ----------------------------------------------------------------
    -- Material issues
    ----------------------------------------------------------------

    INSERT INTO manufacturing.material_issues (id, issue_number, work_order_id, bom_item_id, component_sku, component_name, warehouse_code, quantity_required, quantity_issued, quantity_returned, unit_of_measure, unit_cost, status, issued_at, notes, user_id, created_at, updated_at) VALUES
    -- WO-0001 issues (issued, headphone parts)
    ('d0000000-0000-0000-0000-700000000001', 'MI-2026-0001', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-200000000001', 'CMP-DRV-40', 'Driver Unit 40mm', 'DC-MAIN', 400, 404, 0, 'each', 6.50, 'issued', current_timestamp - interval '40 days', '2 extra for scrap allowance.', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '41 days', current_timestamp - interval '40 days'),
    ('d0000000-0000-0000-0000-700000000002', 'MI-2026-0002', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-200000000002', 'CMP-PCB-WHP', 'Headphone Mainboard', 'DC-MAIN', 200, 200, 0, 'each', 12.00, 'issued', current_timestamp - interval '40 days', null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '41 days', current_timestamp - interval '40 days'),
    ('d0000000-0000-0000-0000-700000000003', 'MI-2026-0003', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-200000000003', 'CMP-BAT-LIPO', '900mAh LiPo Battery', 'DC-MAIN', 200, 200, 0, 'each', 4.20, 'issued', current_timestamp - interval '40 days', null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '41 days', current_timestamp - interval '40 days'),
    ('d0000000-0000-0000-0000-700000000004', 'MI-2026-0004', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-200000000005', 'CMP-PAD-EAR', 'Memory Foam Earpads', 'DC-MAIN', 400, 408, 0, 'each', 1.80, 'issued', current_timestamp - interval '40 days', null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '41 days', current_timestamp - interval '40 days'),

    -- WO-0002 issues (cable)
    ('d0000000-0000-0000-0000-700000000005', 'MI-2026-0005', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-200000000007', 'CMP-WIR-USBC', 'USB-C Wire 2m', 'DC-MAIN', 1500, 1530, 0, 'each', 1.10, 'issued', current_timestamp - interval '30 days', 'Scrap allowance.', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '31 days', current_timestamp - interval '30 days'),
    ('d0000000-0000-0000-0000-700000000006', 'MI-2026-0006', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-200000000008', 'CMP-CON-USBC', 'USB-C Connector', 'DC-MAIN', 3000, 3050, 30, 'each', 0.40, 'issued', current_timestamp - interval '28 days', '30 returned after solder defect mid-run.', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '31 days', current_timestamp - interval '23 days'),

    -- WO-0003 issues (leather bag — partial)
    ('d0000000-0000-0000-0000-700000000007', 'MI-2026-0007', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-20000000000e', 'CMP-LTH-FG', 'Full-grain Leather Panel Set', 'DC-MAIN', 50, 50, 0, 'set', 48.00, 'issued', current_timestamp - interval '6 days', null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '7 days', current_timestamp - interval '6 days'),
    ('d0000000-0000-0000-0000-700000000008', 'MI-2026-0008', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-20000000000f', 'CMP-ZIP-YKK', 'YKK Zipper 60cm', 'DC-MAIN', 50, 50, 0, 'each', 4.50, 'issued', current_timestamp - interval '5 days', null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '7 days', current_timestamp - interval '5 days'),

    -- WO-0004 reservations (released, not yet issued)
    ('d0000000-0000-0000-0000-700000000009', 'MI-2026-0009', 'd0000000-0000-0000-0000-500000000004', 'd0000000-0000-0000-0000-200000000001', 'CMP-DRV-40', 'Driver Unit 40mm', 'DC-MAIN', 600, 0, 0, 'each', 6.50, 'reserved', null, 'Reserved for upcoming run.', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '4 days', current_timestamp - interval '4 days'),
    ('d0000000-0000-0000-0000-70000000000a', 'MI-2026-0010', 'd0000000-0000-0000-0000-500000000004', 'd0000000-0000-0000-0000-200000000002', 'CMP-PCB-WHP', 'Headphone Mainboard', 'DC-MAIN', 300, 0, 0, 'each', 12.00, 'reserved', null, null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '4 days', current_timestamp - interval '4 days');


    ----------------------------------------------------------------
    -- Production outputs
    ----------------------------------------------------------------

    INSERT INTO manufacturing.production_outputs (id, output_number, work_order_id, work_center_id, status, quantity, unit_of_measure, lot_number, produced_at, inspected_at, inspector_user_id, quality_score, defect_reason, destination_warehouse_code, tags, notes, user_id, created_at, updated_at) VALUES
    -- WO-0001 outputs
    ('d0000000-0000-0000-0000-800000000001', 'OUT-2026-0001', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-000000000003',
     'good', 198, 'each', 'LOT-WHP-2026-04A',
     current_timestamp - interval '33 days', current_timestamp - interval '35 days',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 4.7, null,
     'DC-MAIN', ARRAY['headphones','good'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '33 days', current_timestamp - interval '33 days'),
    ('d0000000-0000-0000-0000-800000000002', 'OUT-2026-0002', 'd0000000-0000-0000-0000-500000000001', 'd0000000-0000-0000-0000-000000000004',
     'scrap', 2, 'each', 'LOT-WHP-2026-04A',
     current_timestamp - interval '35 days', current_timestamp - interval '35 days',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 1.0, 'L/R channel imbalance.',
     null, ARRAY['headphones','scrap'], 'Discarded.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '35 days', current_timestamp - interval '35 days'),

    -- WO-0002 outputs
    ('d0000000-0000-0000-0000-800000000003', 'OUT-2026-0003', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-000000000003',
     'good', 1480, 'each', 'LOT-CBL-2026-04B',
     current_timestamp - interval '20 days', current_timestamp - interval '21 days',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 4.4, null,
     'DC-MAIN', ARRAY['cable','good'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '20 days', current_timestamp - interval '20 days'),
    ('d0000000-0000-0000-0000-800000000004', 'OUT-2026-0004', 'd0000000-0000-0000-0000-500000000002', 'd0000000-0000-0000-0000-000000000001',
     'scrap', 20, 'each', 'LOT-CBL-2026-04B',
     current_timestamp - interval '24 days', current_timestamp - interval '24 days',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 0.5, 'Cold solder joints on first 20.',
     null, ARRAY['cable','scrap'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '24 days', current_timestamp - interval '24 days'),

    -- WO-0003 outputs (in progress)
    ('d0000000-0000-0000-0000-800000000005', 'OUT-2026-0005', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-000000000004',
     'good', 22, 'each', 'LOT-BAG-2026-05A',
     current_timestamp - interval '1 day', current_timestamp - interval '12 hours',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 4.6, null,
     'DC-MAIN', ARRAY['bag','good'], '22 of 50 done.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '1 day', current_timestamp - interval '12 hours'),
    ('d0000000-0000-0000-0000-800000000006', 'OUT-2026-0006', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-000000000004',
     'rework', 1, 'each', 'LOT-BAG-2026-05A',
     current_timestamp - interval '8 hours', current_timestamp - interval '6 hours',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 2.5, 'Stitching loose on side seam.',
     null, ARRAY['bag','rework'], 'Sending back for re-stitch.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '8 hours', current_timestamp - interval '6 hours'),

    -- Pending inspection (recent run)
    ('d0000000-0000-0000-0000-800000000007', 'OUT-2026-0007', 'd0000000-0000-0000-0000-500000000003', 'd0000000-0000-0000-0000-000000000001',
     'pending_inspection', 4, 'each', 'LOT-BAG-2026-05A',
     current_timestamp - interval '2 hours', null,
     null, null, null,
     null, ARRAY['bag','pending'], 'Awaiting QA.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '2 hours', current_timestamp - interval '2 hours');
