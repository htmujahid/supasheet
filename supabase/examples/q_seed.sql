
    -- Quality Management (QMS) Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)
    -- Product SKUs align to inventory.products / manufacturing examples (ELC-*, APP-*, HW-*, PRM-*).

    ----------------------------------------------------------------
    -- Standards
    ----------------------------------------------------------------

    INSERT INTO quality.standards (id, code, name, version, type, status, description, scope, issued_by, effective_from, review_due_date, tags, color, notes, user_id, created_at, updated_at) VALUES
    (
        '70000000-0000-0000-0000-000000000001',
        'ISO-9001-2015', 'ISO 9001:2015 — Quality Management Systems',
        '2015',
        'iso', 'active',
        'International standard for QMS requirements.',
        'All operations.',
        'ISO',
        current_date - interval '2 years', current_date + interval '180 days',
        ARRAY['iso','qms'], '#3b82f6',
        'Primary QMS standard.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 years', current_timestamp - interval '60 days'
    ),
    (
        '70000000-0000-0000-0000-000000000002',
        'ISO-14001-2015', 'ISO 14001:2015 — Environmental Management',
        '2015',
        'iso', 'active',
        'Environmental management systems standard.',
        'All facilities.',
        'ISO',
        current_date - interval '18 months', current_date + interval '275 days',
        ARRAY['iso','environment'], '#22c55e',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '18 months', current_timestamp - interval '90 days'
    ),
    (
        '70000000-0000-0000-0000-000000000003',
        'INT-INSP-001', 'Incoming Inspection Procedure',
        '2.3',
        'internal', 'active',
        'Internal SOP for incoming material inspection.',
        'Inventory receiving and inspection.',
        'QA Department',
        current_date - interval '300 days', current_date + interval '60 days',
        ARRAY['sop','incoming'], '#a855f7',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '320 days', current_timestamp - interval '40 days'
    ),
    (
        '70000000-0000-0000-0000-000000000004',
        'INT-INSP-002', 'Final Inspection Procedure (legacy)',
        '1.0',
        'internal', 'superseded',
        'Original final inspection SOP — superseded by INT-INSP-003.',
        'Final inspection lane.',
        'QA Department',
        current_date - interval '900 days', null,
        ARRAY['sop','final','legacy'], '#94a3b8',
        'Superseded.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '900 days', current_timestamp - interval '300 days'
    ),
    (
        '70000000-0000-0000-0000-000000000005',
        'CUST-ACME-SPEC-01', 'Acme — Custom Headphone Acoustic Spec',
        '1.2',
        'customer_spec', 'active',
        'Customer acoustic specification for ELC-WHP-001 supplied to Acme.',
        'Acme orders only.',
        'Acme Corporation',
        current_date - interval '180 days', current_date + interval '180 days',
        ARRAY['customer','acoustic'], '#0ea5e9',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '200 days', current_timestamp - interval '20 days'
    );

    -- Wire supersession
    UPDATE quality.standards SET superseded_by_id = '70000000-0000-0000-0000-000000000003'
    WHERE id = '70000000-0000-0000-0000-000000000004';


    ----------------------------------------------------------------
    -- Inspections
    ----------------------------------------------------------------

    INSERT INTO quality.inspections (id, inspection_number, title, type, result, standard_id, source_type, source_reference, supplier_name, product_sku, product_name, lot_number, sample_size, pass_count, fail_count, inspector_user_id, scheduled_at, started_at, completed_at, description, findings, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Incoming — passed
    (
        '70000000-0000-0000-0000-100000000001',
        'INSP-2026-0001', 'Incoming — Driver units (Globex)',
        'incoming', 'passed',
        '70000000-0000-0000-0000-000000000003',
        'purchase_order', 'PO-2026-0001', 'Globex Components',
        'CMP-DRV-40', 'Driver Unit 40mm', 'LOT-DRV-2026-04A',
        20, 20, 0,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '34 days', current_timestamp - interval '34 days', current_timestamp - interval '34 days',
        'Acoustic and visual check of incoming driver batch.',
        'All units within spec.',
        ARRAY['incoming','passed'], '#22c55e', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '34 days', current_timestamp - interval '34 days'
    ),
    -- Incoming — conditional
    (
        '70000000-0000-0000-0000-100000000002',
        'INSP-2026-0002', 'Incoming — USB-C cables (PO-0001)',
        'incoming', 'conditional',
        '70000000-0000-0000-0000-000000000003',
        'purchase_order', 'PO-2026-0001', 'Globex Components',
        'CMP-WIR-USBC', 'USB-C Wire 2m', 'LOT-WIR-2026-04A',
        25, 24, 1,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '34 days', current_timestamp - interval '34 days', current_timestamp - interval '34 days',
        'AQL inspection on incoming wire batch.',
        '1 unit damaged jacket — flagged.',
        ARRAY['incoming','conditional'], '#fb923c', 'Use-as-is approved by QA.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '34 days', current_timestamp - interval '34 days'
    ),
    -- In-process — passed
    (
        '70000000-0000-0000-0000-100000000003',
        'INSP-2026-0003', 'In-process — Headphone WO-0001 mid-run',
        'in_process', 'passed',
        '70000000-0000-0000-0000-000000000005',
        'work_order', 'WO-2026-0001', null,
        'ELC-WHP-001', 'Wireless Headphones — Pro', 'LOT-WHP-2026-04A',
        10, 10, 0,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '38 days', current_timestamp - interval '38 days', current_timestamp - interval '38 days',
        'Mid-run check on assembly line 1.',
        'No deviations.',
        ARRAY['in_process'], '#3b82f6', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '38 days', current_timestamp - interval '38 days'
    ),
    -- Final — failed (drove the 2-unit scrap)
    (
        '70000000-0000-0000-0000-100000000004',
        'INSP-2026-0004', 'Final — Headphone WO-0001 batch',
        'final', 'failed',
        '70000000-0000-0000-0000-000000000005',
        'work_order', 'WO-2026-0001', null,
        'ELC-WHP-001', 'Wireless Headphones — Pro', 'LOT-WHP-2026-04A',
        200, 198, 2,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '35 days', current_timestamp - interval '35 days', current_timestamp - interval '35 days',
        'Final QA on batch of 200.',
        '2 units rejected for L/R imbalance.',
        ARRAY['final','failed'], '#ef4444', 'Rejected units routed to scrap.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '35 days', current_timestamp - interval '35 days'
    ),
    -- Final — failed (cable solder defect)
    (
        '70000000-0000-0000-0000-100000000005',
        'INSP-2026-0005', 'Final — Cable WO-0002 first sub-batch',
        'final', 'failed',
        '70000000-0000-0000-0000-000000000003',
        'work_order', 'WO-2026-0002', null,
        'ELC-CBL-002', 'USB-C Cable 2m', 'LOT-CBL-2026-04B',
        30, 10, 20,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '24 days', current_timestamp - interval '24 days', current_timestamp - interval '24 days',
        'First sub-batch final inspection.',
        'Cold solder joints across first 20 units.',
        ARRAY['final','failed','solder'], '#dc2626', 'Solder station temp recalibrated mid-run.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '24 days', current_timestamp - interval '24 days'
    ),
    -- First-article — passed (leather bag)
    (
        '70000000-0000-0000-0000-100000000006',
        'INSP-2026-0006', 'First Article — Leather bag WO-0003',
        'first_article', 'passed',
        '70000000-0000-0000-0000-000000000003',
        'work_order', 'WO-2026-0003', null,
        'PRM-BAG-001', 'Leather Laptop Bag', 'LOT-BAG-2026-05A',
        1, 1, 0,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '6 days', current_timestamp - interval '6 days', current_timestamp - interval '6 days',
        'First-article approval before production run.',
        'Approved for production.',
        ARRAY['first_article','approved'], '#22c55e', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '6 days', current_timestamp - interval '6 days'
    ),
    -- Supplier audit
    (
        '70000000-0000-0000-0000-100000000007',
        'INSP-2026-0007', 'Supplier audit — Wayne Industrial',
        'supplier_audit', 'conditional',
        '70000000-0000-0000-0000-000000000001',
        'supplier', 'SUP-A002', 'Wayne Industrial',
        null, null, null,
        1, 1, 0,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '60 days', current_timestamp - interval '59 days',
        'Annual supplier audit on Wayne Industrial site.',
        '2 minor findings raised.',
        ARRAY['supplier_audit'], '#fb923c', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '65 days', current_timestamp - interval '59 days'
    ),
    -- Pending
    (
        '70000000-0000-0000-0000-100000000008',
        'INSP-2026-0008', 'Final — Bag WO-0003 outputs (pending)',
        'final', 'pending',
        '70000000-0000-0000-0000-000000000003',
        'work_order', 'WO-2026-0003', null,
        'PRM-BAG-001', 'Leather Laptop Bag', 'LOT-BAG-2026-05A',
        4, 0, 0,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '2 hours', null, null,
        'Awaiting QA on the latest 4 units.',
        null,
        ARRAY['final','pending'], '#94a3b8', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '2 hours', current_timestamp - interval '2 hours'
    );


    ----------------------------------------------------------------
    -- Inspection items
    ----------------------------------------------------------------

    INSERT INTO quality.inspection_items (id, inspection_id, line_number, characteristic, method, specification, measured_value, tolerance, result, notes, created_at) VALUES
    -- INSP-0001 (driver passed)
    ('70000000-0000-0000-0000-200000000001', '70000000-0000-0000-0000-100000000001', 10, 'Driver impedance', 'LCR meter', '32 Ω ±5%', '32.4', '±5%', 'pass', null, current_timestamp - interval '34 days'),
    ('70000000-0000-0000-0000-200000000002', '70000000-0000-0000-0000-100000000001', 20, 'SPL output', 'Acoustic rig A', '105 dB ±3', '104.8', '±3 dB', 'pass', null, current_timestamp - interval '34 days'),
    ('70000000-0000-0000-0000-200000000003', '70000000-0000-0000-0000-100000000001', 30, 'Visual / cosmetic', 'Visual', 'No defects', 'OK', null, 'pass', null, current_timestamp - interval '34 days'),

    -- INSP-0002 (cable conditional)
    ('70000000-0000-0000-0000-200000000004', '70000000-0000-0000-0000-100000000002', 10, 'Wire continuity', 'Continuity tester', '< 0.5 Ω', '0.31', '< 0.5 Ω', 'pass', null, current_timestamp - interval '34 days'),
    ('70000000-0000-0000-0000-200000000005', '70000000-0000-0000-0000-100000000002', 20, 'Jacket condition', 'Visual', 'No tears', '1 unit nicked', null, 'fail', '1 of 25 units jacket damage.', current_timestamp - interval '34 days'),
    ('70000000-0000-0000-0000-200000000006', '70000000-0000-0000-0000-100000000002', 30, 'Length', 'Tape', '2.0 m ±10mm', '1.99 m', '±10mm', 'pass', null, current_timestamp - interval '34 days'),

    -- INSP-0004 (headphone final failed)
    ('70000000-0000-0000-0000-200000000007', '70000000-0000-0000-0000-100000000004', 10, 'L/R balance', 'Acoustic rig A', '< 1 dB delta', '2.4 dB', '< 1 dB', 'fail', '2 units fail.', current_timestamp - interval '35 days'),
    ('70000000-0000-0000-0000-200000000008', '70000000-0000-0000-0000-100000000004', 20, 'Battery runtime', 'Bench test', '> 28 hr', '30 hr', '> 28 hr', 'pass', null, current_timestamp - interval '35 days'),
    ('70000000-0000-0000-0000-200000000009', '70000000-0000-0000-0000-100000000004', 30, 'Bluetooth pairing', 'Manual', 'Pairs cleanly', 'OK', null, 'pass', null, current_timestamp - interval '35 days'),

    -- INSP-0005 (cable solder failed)
    ('70000000-0000-0000-0000-20000000000a', '70000000-0000-0000-0000-100000000005', 10, 'USB-C functional', 'Functional rig', '100W PD pass', '20 fail / 30', null, 'fail', 'Cold solder.', current_timestamp - interval '24 days'),
    ('70000000-0000-0000-0000-20000000000b', '70000000-0000-0000-0000-100000000005', 20, 'Continuity', 'Continuity tester', '< 0.5 Ω', '0.32', '< 0.5 Ω', 'pass', null, current_timestamp - interval '24 days'),

    -- INSP-0006 (first article passed)
    ('70000000-0000-0000-0000-20000000000c', '70000000-0000-0000-0000-100000000006', 10, 'Stitch quality', 'Visual + tug', 'No loose', 'OK', null, 'pass', null, current_timestamp - interval '6 days'),
    ('70000000-0000-0000-0000-20000000000d', '70000000-0000-0000-0000-100000000006', 20, 'Hardware fit', 'Manual', 'Snug', 'OK', null, 'pass', null, current_timestamp - interval '6 days'),
    ('70000000-0000-0000-0000-20000000000e', '70000000-0000-0000-0000-100000000006', 30, 'Color match', 'Visual', 'Spec swatch', 'OK', null, 'pass', null, current_timestamp - interval '6 days');


    ----------------------------------------------------------------
    -- Non-conformances (NCRs)
    ----------------------------------------------------------------

    INSERT INTO quality.non_conformances (id, ncr_number, title, severity, status, disposition, inspection_id, source_type, source_reference, supplier_name, product_sku, product_name, lot_number, quantity_affected, estimated_cost, currency, description, root_cause, discovered_at, resolved_at, closed_at, assigned_user_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Closed (the headphone scrap)
    (
        '70000000-0000-0000-0000-300000000001',
        'NCR-2026-0001', 'L/R imbalance on headphone batch',
        'minor', 'closed', 'scrap',
        '70000000-0000-0000-0000-100000000004',
        'work_order', 'WO-2026-0001', null,
        'ELC-WHP-001', 'Wireless Headphones — Pro', 'LOT-WHP-2026-04A',
        2, 90.00, 'USD',
        '2 units exceeded L/R balance spec.',
        'Suspected adhesive variation on driver mount.',
        current_timestamp - interval '35 days', current_timestamp - interval '34 days', current_timestamp - interval '32 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['scrap','closed'], '#94a3b8', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '35 days', current_timestamp - interval '32 days'
    ),
    -- Investigating (cable solder — major)
    (
        '70000000-0000-0000-0000-300000000002',
        'NCR-2026-0002', 'Cold solder joints on cable batch',
        'major', 'investigating', 'rework',
        '70000000-0000-0000-0000-100000000005',
        'work_order', 'WO-2026-0002', null,
        'ELC-CBL-002', 'USB-C Cable 2m', 'LOT-CBL-2026-04B',
        20, 64.00, 'USD',
        'Cold solder joints on first 20 cables produced.',
        'Solder station temperature drifted; recalibration needed.',
        current_timestamp - interval '24 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['rework','solder'], '#fb923c', 'Affected units pulled for rework.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '24 days', current_timestamp - interval '5 days'
    ),
    -- Open (cable jacket — incoming)
    (
        '70000000-0000-0000-0000-300000000003',
        'NCR-2026-0003', 'Damaged jacket on incoming USB-C wire',
        'minor', 'open', 'use_as_is',
        '70000000-0000-0000-0000-100000000002',
        'purchase_order', 'PO-2026-0001', 'Globex Components',
        'CMP-WIR-USBC', 'USB-C Wire 2m', 'LOT-WIR-2026-04A',
        1, 1.10, 'USD',
        '1 unit jacket damaged.',
        null,
        current_timestamp - interval '34 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['use_as_is','minor'], '#0ea5e9', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '34 days', current_timestamp - interval '30 days'
    ),
    -- Critical open (Wayne dock components)
    (
        '70000000-0000-0000-0000-300000000004',
        'NCR-2026-0004', 'Suspect Wayne dock board batch',
        'critical', 'investigating', 'return_to_supplier',
        null,
        'supplier', 'SUP-A002', 'Wayne Industrial',
        'CMP-PCB-DOC', 'Dock Mainboard', 'LOT-PCB-DOC-2026-05A',
        80, 1760.00, 'USD',
        'Out-of-tolerance USB-C controllers found in spot check; potential field-failure risk.',
        'Suspected reused components from sub-tier supplier.',
        current_timestamp - interval '8 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['critical','supplier','escalated'], '#dc2626', 'Escalated to procurement.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '8 days', current_timestamp - interval '1 day'
    ),
    -- Resolved awaiting closure
    (
        '70000000-0000-0000-0000-300000000005',
        'NCR-2026-0005', 'Bag stitching loose on first run unit',
        'minor', 'resolved', 'rework',
        null,
        'work_order', 'WO-2026-0003', null,
        'PRM-BAG-001', 'Leather Laptop Bag', 'LOT-BAG-2026-05A',
        1, 72.00, 'USD',
        'Loose stitching on side seam — sent for re-stitch.',
        'Operator missed thread tension setting at start of shift.',
        current_timestamp - interval '8 hours', current_timestamp - interval '2 hours', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['rework','minor'], '#fb923c', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '8 hours', current_timestamp - interval '2 hours'
    ),
    -- Cancelled
    (
        '70000000-0000-0000-0000-300000000006',
        'NCR-2026-0006', 'Suspected paint defect on bag (false alarm)',
        'minor', 'cancelled', null,
        null,
        'work_order', 'WO-2026-0003', null,
        'PRM-BAG-001', 'Leather Laptop Bag', 'LOT-BAG-2026-05A',
        2, 0, 'USD',
        'Apparent finish defect — re-inspection cleared.',
        'Lighting artifact on inspection bench.',
        current_timestamp - interval '4 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['cancelled','false-alarm'], '#94a3b8', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '4 days', current_timestamp - interval '3 days'
    );


    ----------------------------------------------------------------
    -- CAPA
    ----------------------------------------------------------------

    INSERT INTO quality.capa (id, capa_number, title, type, status, priority, ncr_id, description, root_cause, corrective_action, preventive_action, verification_plan, owner_user_id, verifier_user_id, opened_at, target_close_date, closed_at, effectiveness_score, cost, currency, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Closed (drove from NCR-0001)
    (
        '70000000-0000-0000-0000-400000000001',
        'CAPA-2026-0001', 'Update driver mount adhesive process',
        'corrective', 'closed', 'medium',
        '70000000-0000-0000-0000-300000000001',
        'Adjust adhesive cure time and add inline check.',
        'Driver adhesive cure variation.',
        'Updated SOP with longer cure time and added pre-test.',
        'Cycle review weekly for 1 month.',
        'Inspect next 5 batches; expect 0 imbalance fails.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '34 days', current_date - interval '20 days', current_timestamp - interval '20 days',
        4.5, 250.00, 'USD',
        ARRAY['closed','effective'], null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '34 days', current_timestamp - interval '20 days'
    ),
    -- In progress (cable solder)
    (
        '70000000-0000-0000-0000-400000000002',
        'CAPA-2026-0002', 'Solder station calibration program',
        'corrective', 'in_progress', 'high',
        '70000000-0000-0000-0000-300000000002',
        'Implement weekly solder station temperature calibration.',
        'Solder station drift caused cold joints.',
        'Recalibrated and re-ran defective sub-batch.',
        'Weekly calibration logged + drift alert at ±5°C.',
        'Inspect first sub-batch of next 4 cable WOs.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 days', current_date + interval '10 days', null,
        null, 480.00, 'USD',
        ARRAY['in_progress','calibration'], '#fb923c', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '4 days'
    ),
    -- Open critical (supplier)
    (
        '70000000-0000-0000-0000-400000000003',
        'CAPA-2026-0003', 'Wayne Industrial — supplier corrective action',
        'corrective', 'open', 'critical',
        '70000000-0000-0000-0000-300000000004',
        'Force Wayne to provide root cause + 8D, plus segregate/return affected lots.',
        'Suspected reused sub-tier components.',
        'Quarantine all Wayne dock boards in inventory pending audit.',
        'Wayne to deliver 8D within 14 days; supplier audit to follow.',
        'Receive 8D + 100% inspection on next 3 lots.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '7 days', current_date + interval '14 days', null,
        null, 0, 'USD',
        ARRAY['critical','supplier'], '#dc2626', 'High visibility.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '7 days', current_timestamp - interval '1 day'
    ),
    -- Verification (bag stitching)
    (
        '70000000-0000-0000-0000-400000000004',
        'CAPA-2026-0004', 'Operator shift-start checklist',
        'preventive', 'verification', 'low',
        '70000000-0000-0000-0000-300000000005',
        'Add tension setting checklist at shift start.',
        'Operator skipped tension setting check.',
        'Re-stitched defective bag.',
        'New shift-start checklist with tension verification.',
        'Audit 5 random shifts.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '6 hours', current_date + interval '7 days', null,
        null, 50.00, 'USD',
        ARRAY['preventive','checklist'], null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '6 hours', current_timestamp - interval '1 hour'
    ),
    -- Cancelled
    (
        '70000000-0000-0000-0000-400000000005',
        'CAPA-2026-0005', 'Inspection bench lighting upgrade (cancelled)',
        'preventive', 'cancelled', 'low',
        '70000000-0000-0000-0000-300000000006',
        'Cancelled — root cause turned out to be operator misread, not lighting.',
        'False alarm — re-inspection cleared the units.',
        null, null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', null,
        current_timestamp - interval '3 days', current_date + interval '30 days', null,
        null, 0, 'USD',
        ARRAY['cancelled'], '#94a3b8', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '3 days', current_timestamp - interval '2 days'
    );


    ----------------------------------------------------------------
    -- Audits
    ----------------------------------------------------------------

    INSERT INTO quality.audits (id, audit_number, title, type, status, standard_id, auditee, auditor_user_id, external_auditor, scope, objectives, scheduled_date, started_at, completed_at, closed_at, overall_score, summary, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Closed external
    (
        '70000000-0000-0000-0000-500000000001',
        'AUD-2026-0001', 'ISO 9001 — annual surveillance audit',
        'external', 'closed',
        '70000000-0000-0000-0000-000000000001',
        'Operations & QA',
        null, 'BSI Group',
        'All operations under ISO 9001 scope.',
        'Confirm continued conformance for surveillance year 2.',
        current_date - interval '120 days', current_timestamp - interval '120 days', current_timestamp - interval '118 days', current_timestamp - interval '60 days',
        4.6,
        'Conformance maintained — 1 minor finding raised.',
        ARRAY['external','iso','closed'], '#22c55e', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '150 days', current_timestamp - interval '60 days'
    ),
    -- Completed internal
    (
        '70000000-0000-0000-0000-500000000002',
        'AUD-2026-0002', 'Q2 internal audit — production',
        'internal', 'completed',
        '70000000-0000-0000-0000-000000000003',
        'Manufacturing',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        'Production lines and incoming inspection.',
        'Routine internal audit per schedule.',
        current_date - interval '20 days', current_timestamp - interval '20 days', current_timestamp - interval '19 days', null,
        4.0,
        '3 findings raised, mostly procedural.',
        ARRAY['internal','q2'], '#3b82f6', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '19 days'
    ),
    -- In progress supplier
    (
        '70000000-0000-0000-0000-500000000003',
        'AUD-2026-0003', 'Supplier audit — Globex Components',
        'supplier', 'in_progress',
        '70000000-0000-0000-0000-000000000001',
        'Globex Components',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        'Globex incoming process.',
        'Annual supplier qualification refresh.',
        current_date - interval '3 days', current_timestamp - interval '3 days', null, null,
        null,
        null,
        ARRAY['supplier','in_progress'], '#fb923c', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '3 days'
    ),
    -- Planned regulatory
    (
        '70000000-0000-0000-0000-500000000004',
        'AUD-2026-0004', 'Regulatory inspection — incoming materials',
        'regulatory', 'planned',
        '70000000-0000-0000-0000-000000000002',
        'QA + Operations',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'EPA Inspector',
        'Environmental compliance review.',
        'Triannual EPA inspection.',
        current_date + interval '21 days', null, null, null,
        null,
        null,
        ARRAY['regulatory','planned'], '#a855f7', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '5 days', current_timestamp - interval '5 days'
    );


    ----------------------------------------------------------------
    -- Audit findings
    ----------------------------------------------------------------

    INSERT INTO quality.audit_findings (id, finding_number, audit_id, severity, status, clause, title, description, evidence, recommendation, capa_id, owner_user_id, target_close_date, closed_at, tags, notes, created_at, updated_at) VALUES
    -- AUD-0001 (ISO surveillance closed)
    (
        '70000000-0000-0000-0000-600000000001',
        'AF-2026-0001', '70000000-0000-0000-0000-500000000001',
        'minor', 'closed',
        '7.5.3', 'Document control — outdated SOP referenced in training',
        'Training references INT-INSP-002 instead of v2.3.',
        'Training deck v3 page 12.',
        'Update training deck.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_date - interval '90 days', current_timestamp - interval '70 days',
        ARRAY['doc-control','closed'], null,
        current_timestamp - interval '120 days', current_timestamp - interval '70 days'
    ),
    -- AUD-0002 (Q2 internal — 3 findings)
    (
        '70000000-0000-0000-0000-600000000002',
        'AF-2026-0002', '70000000-0000-0000-0000-500000000002',
        'observation', 'closed',
        '8.5.1', 'Inspection log — sporadic missing initials',
        '5 of 30 incoming inspection logs missing inspector initials.',
        'Bin A1 incoming logs (Apr).',
        'Add initials field validation in tablet form.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_date - interval '5 days', current_timestamp - interval '8 days',
        ARRAY['observation'], null,
        current_timestamp - interval '20 days', current_timestamp - interval '8 days'
    ),
    (
        '70000000-0000-0000-0000-600000000003',
        'AF-2026-0003', '70000000-0000-0000-0000-500000000002',
        'minor', 'in_progress',
        '8.7', 'Non-conforming product handling — segregation gap',
        'Reworked cables and good cables stored in adjacent bins without clear separation.',
        'Bin B2 photo evidence.',
        'Repaint bin lines and add labels.',
        '70000000-0000-0000-0000-400000000002', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_date + interval '10 days', null,
        ARRAY['minor','segregation'], null,
        current_timestamp - interval '20 days', current_timestamp - interval '5 days'
    ),
    (
        '70000000-0000-0000-0000-600000000004',
        'AF-2026-0004', '70000000-0000-0000-0000-500000000002',
        'major', 'open',
        '7.1.5.2', 'Calibration — solder station overdue',
        'Solder station last calibrated 11 months ago — calibration due 6-month interval.',
        'Calibration log WC-ASM-01.',
        'Implement weekly calibration program (linked CAPA).',
        '70000000-0000-0000-0000-400000000002', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_date - interval '3 days', null,
        ARRAY['major','calibration','overdue'], 'Overdue close.',
        current_timestamp - interval '20 days', current_timestamp - interval '3 days'
    ),
    -- AUD-0003 (Globex supplier audit — in progress)
    (
        '70000000-0000-0000-0000-600000000005',
        'AF-2026-0005', '70000000-0000-0000-0000-500000000003',
        'observation', 'open',
        '8.4.2', 'Cosmetic packaging variability',
        'Slight color variation on incoming retail boxes batch-to-batch.',
        'Visual sample comparison, Mar vs Apr.',
        'Tighten supplier color spec.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_date + interval '20 days', null,
        ARRAY['observation','supplier'], null,
        current_timestamp - interval '3 days', current_timestamp - interval '3 days'
    ),
    (
        '70000000-0000-0000-0000-600000000006',
        'AF-2026-0006', '70000000-0000-0000-0000-500000000003',
        'minor', 'open',
        '8.4.3', 'Incoming COA missing for last shipment',
        'Certificate of Analysis not provided with last 2 shipments.',
        'Receiving log Apr 18, Apr 26.',
        'Add CoA receipt as gating step.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_date + interval '20 days', null,
        ARRAY['minor','documentation'], null,
        current_timestamp - interval '3 days', current_timestamp - interval '3 days'
    ),
    -- Critical from supplier audit (Wayne earlier)
    (
        '70000000-0000-0000-0000-600000000007',
        'AF-2026-0007', '70000000-0000-0000-0000-500000000001',
        'critical', 'resolved',
        '8.5', 'Suspected counterfeit components reported by supplier',
        'Wayne disclosed potential sub-tier substitution mid-year.',
        'Disclosure email + lot trace.',
        'Triggered NCR-2026-0004 and CAPA-2026-0003.',
        '70000000-0000-0000-0000-400000000003', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_date + interval '14 days', null,
        ARRAY['critical','supplier'], 'Awaiting verification.',
        current_timestamp - interval '50 days', current_timestamp - interval '7 days'
    ),
    -- Verified
    (
        '70000000-0000-0000-0000-600000000008',
        'AF-2026-0008', '70000000-0000-0000-0000-500000000001',
        'minor', 'verified',
        '6.1', 'Risk register — no review record for Q1',
        'Risk register lacked dated Q1 review.',
        'Risk register file.',
        'Add quarterly review timestamp.',
        null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_date - interval '60 days', null,
        ARRAY['minor','risk'], 'Awaiting closure.',
        current_timestamp - interval '120 days', current_timestamp - interval '50 days'
    );


    ----------------------------------------------------------------
    -- Certifications
    ----------------------------------------------------------------

    INSERT INTO quality.certifications (id, certificate_number, name, standard_id, status, issuing_body, scope, issued_date, expiry_date, last_audit_date, next_audit_date, contact_user_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    (
        '70000000-0000-0000-0000-700000000001',
        'CERT-ISO9001-2024-001', 'ISO 9001:2015 Certificate',
        '70000000-0000-0000-0000-000000000001', 'active',
        'BSI Group', 'All operations.',
        current_date - interval '700 days', current_date + interval '395 days',
        current_date - interval '120 days', current_date + interval '245 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['iso','active'], '#22c55e',
        '3-year cycle, next surveillance Q2 next year.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '700 days', current_timestamp - interval '60 days'
    ),
    (
        '70000000-0000-0000-0000-700000000002',
        'CERT-ISO14001-2025-001', 'ISO 14001:2015 Certificate',
        '70000000-0000-0000-0000-000000000002', 'expiring_soon',
        'BSI Group', 'All facilities.',
        current_date - interval '530 days', current_date + interval '40 days',
        current_date - interval '180 days', current_date + interval '20 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['iso','expiring'], '#fb923c',
        'Recertification audit scheduled.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '530 days', current_timestamp - interval '30 days'
    ),
    (
        '70000000-0000-0000-0000-700000000003',
        'CERT-RoHS-2024-001', 'RoHS Compliance Declaration',
        null, 'active',
        'Internal — backed by component CoAs.', 'Electronics product line.',
        current_date - interval '300 days', current_date + interval '65 days',
        current_date - interval '60 days', current_date + interval '305 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['rohs','electronics'], '#3b82f6',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '300 days', current_timestamp - interval '60 days'
    ),
    (
        '70000000-0000-0000-0000-700000000004',
        'CERT-SOC2-2024-001', 'SOC 2 Type II Report',
        null, 'expired',
        'Big-4 Auditor', 'Cloud-platform operations.',
        current_date - interval '460 days', current_date - interval '95 days',
        current_date - interval '95 days', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['soc2','expired'], '#ef4444',
        'Renewal in progress — expect new report next month.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '460 days', current_timestamp - interval '30 days'
    ),
    (
        '70000000-0000-0000-0000-700000000005',
        'CERT-CE-2026-001', 'CE Marking — Product Family Pro',
        null, 'pending',
        'Notified Body 1234', 'ELC-WHP-001 product family.',
        null, current_date + interval '730 days',
        null, current_date + interval '90 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['ce','pending'], '#a855f7',
        'Application submitted — awaiting type test results.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '40 days', current_timestamp - interval '5 days'
    );


    ----------------------------------------------------------------
    -- Customer complaints
    ----------------------------------------------------------------

    INSERT INTO quality.complaints (id, complaint_number, title, severity, status, customer_name, customer_email, product_sku, product_name, lot_number, order_reference, received_at, resolved_at, closed_at, description, response, resolution, ncr_id, capa_id, assigned_user_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Closed
    (
        '70000000-0000-0000-0000-800000000001',
        'COMP-2026-0001', 'Headphone arrived with imbalanced channels',
        'medium', 'closed',
        'Acme Corporation', 'support@acme.example.com',
        'ELC-WHP-001', 'Wireless Headphones — Pro', 'LOT-WHP-2026-04A',
        'SO-AC-1234',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days', current_timestamp - interval '10 days',
        'Customer reported one channel quieter than the other on initial use.',
        'Replacement shipped overnight.',
        'Confirmed isolated unit — replacement sent. Linked to NCR-0001 lot.',
        '70000000-0000-0000-0000-300000000001', '70000000-0000-0000-0000-400000000001',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['closed','replaced'], '#22c55e', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '10 days'
    ),
    -- Investigating
    (
        '70000000-0000-0000-0000-800000000002',
        'COMP-2026-0002', 'USB-C cable failed within 2 weeks',
        'high', 'investigating',
        'Initech Software', 'support@initech.example.com',
        'ELC-CBL-002', 'USB-C Cable 2m', 'LOT-CBL-2026-04B',
        'SO-INI-2345',
        current_timestamp - interval '14 days', null, null,
        'Customer reports 5 cables failed across their team within 2 weeks.',
        'Replacements sent; root cause analysis in progress.',
        null,
        '70000000-0000-0000-0000-300000000002', '70000000-0000-0000-0000-400000000002',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['investigating','escalated'], '#fb923c', 'Escalated — possible solder defect.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '14 days', current_timestamp - interval '4 days'
    ),
    -- Critical received
    (
        '70000000-0000-0000-0000-800000000003',
        'COMP-2026-0003', 'Dock burned out after 1 hour use',
        'critical', 'received',
        'Stark Industries', 'eng-support@stark.example.com',
        'HW-DOC-002', 'USB-C Docking Station', 'LOT-DOC-2026-05A',
        'SO-STARK-3456',
        current_timestamp - interval '2 days', null, null,
        'Customer reported visible smoke and dock failure after 1 hour use; suspect controller failure.',
        null,
        null,
        '70000000-0000-0000-0000-300000000004', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['critical','safety'], '#dc2626', 'Tied to suspect Wayne board batch.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '2 days', current_timestamp - interval '1 day'
    ),
    -- Resolved
    (
        '70000000-0000-0000-0000-800000000004',
        'COMP-2026-0004', 'Bag stitching loose on receipt',
        'low', 'resolved',
        'Wayne Enterprises', 'shipping@wayne.example.com',
        'PRM-BAG-001', 'Leather Laptop Bag', 'LOT-BAG-2026-05A',
        null,
        current_timestamp - interval '6 hours', current_timestamp - interval '2 hours', null,
        'Customer reported loose stitching out of box.',
        'Replacement bag dispatched same day.',
        'Linked to NCR-0005 (single unit issue).',
        '70000000-0000-0000-0000-300000000005', '70000000-0000-0000-0000-400000000004',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        ARRAY['resolved','quick'], null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '6 hours', current_timestamp - interval '2 hours'
    ),
    -- Rejected
    (
        '70000000-0000-0000-0000-800000000005',
        'COMP-2026-0005', 'Headphone "broken after 6 months" (out of warranty / accidental damage)',
        'low', 'rejected',
        'Lisa Anderson', 'lisa.anderson@example.com',
        'ELC-WHP-001', 'Wireless Headphones — Pro', null,
        'SO-LISA-9999',
        current_timestamp - interval '15 days', null, current_timestamp - interval '12 days',
        'Customer reported headphone broken after 6 months — visible drop damage.',
        'Out of warranty due to accidental damage.',
        'Rejected — discount offered on replacement.',
        null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        ARRAY['rejected','out-of-warranty'], '#94a3b8', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '15 days', current_timestamp - interval '12 days'
    );
