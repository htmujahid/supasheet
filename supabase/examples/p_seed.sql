
    -- Procurement, Sourcing & Asset Management Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)

    ----------------------------------------------------------------
    -- Suppliers (with qualification + scorecard)
    ----------------------------------------------------------------

    INSERT INTO procurement.suppliers (id, code, name, legal_name, status, tier, contact_name, email, phone, website, address, city, country, tax_id, payment_terms, currency, categories, certifications, qualified_at, qualified_by_user_id, score_quality, score_delivery, score_cost, score_communication, score_overall, description, tags, color, notes, user_id, created_at, updated_at) VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'SUP-A001', 'Globex Components', 'Globex Components Inc.',
        'preferred', 'strategic',
        'Sarah Johnson', 'orders@globex-components.example.com', '+1-312-555-0100',
        'https://globex-components.example.com',
        '88 Industrial Way', 'Chicago', 'United States',
        'EIN-34-5678901', 'Net 30', 'USD',
        ARRAY['electronics','components'],
        'ISO 9001, RoHS, REACH compliant.',
        current_date - interval '700 days', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        4.8, 4.6, 4.2, 4.7, 4.6,
        'Strategic partner for electronic components.',
        ARRAY['electronics','strategic'], '#3b82f6',
        'Top-tier supplier — quarterly QBR cadence.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '750 days', current_timestamp - interval '20 days'
    ),
    (
        'a0000000-0000-0000-0000-000000000002',
        'SUP-A002', 'Wayne Industrial', 'Wayne Industrial LLC',
        'qualified', 'tier_1',
        'James Wilson', 'sales@wayne-industrial.example.com', '+1-201-555-0199',
        'https://wayne-industrial.example.com',
        '1007 Mountain Drive', 'Gotham', 'United States',
        'EIN-45-6789012', 'Net 45', 'USD',
        ARRAY['hardware','industrial'],
        'ISO 9001 certified.',
        current_date - interval '500 days', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        4.2, 3.9, 4.5, 4.0, 4.1,
        'Industrial hardware and tooling.',
        ARRAY['hardware','tier-1'], '#0ea5e9',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '550 days', current_timestamp - interval '15 days'
    ),
    (
        'a0000000-0000-0000-0000-000000000003',
        'SUP-A003', 'Stark International', 'Stark International Holdings',
        'preferred', 'strategic',
        'Daniel White', 'logistics@stark-intl.example.com', '+1-212-555-0152',
        'https://stark-intl.example.com',
        '10880 Malibu Point', 'New York', 'United States',
        'EIN-56-7890123', 'Net 30', 'USD',
        ARRAY['premium','accessories','logistics'],
        'ISO 9001, ISO 14001, SOC 2.',
        current_date - interval '600 days', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        4.9, 4.8, 4.0, 4.9, 4.8,
        'Premium accessories and logistics.',
        ARRAY['premium','strategic'], '#ef4444',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '650 days', current_timestamp - interval '8 days'
    ),
    (
        'a0000000-0000-0000-0000-000000000004',
        'SUP-A004', 'Initech Services', 'Initech Services LLC',
        'on_hold', 'tier_2',
        'Michael Brown', 'sales@initech-services.example.com', '+1-512-555-0118',
        'https://initech-services.example.com',
        '4120 Tech Boulevard', 'Austin', 'United States',
        'EIN-23-4567890', 'Net 30', 'USD',
        ARRAY['services','consulting'],
        'No certifications.',
        current_date - interval '300 days', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        3.5, 3.0, 4.2, 3.2, 3.4,
        'Professional services consultancy — under quality review.',
        ARRAY['services','review'], '#f97316',
        'On hold pending audit completion.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '350 days', current_timestamp - interval '12 days'
    ),
    (
        'a0000000-0000-0000-0000-000000000005',
        'SUP-A005', 'Soylent Catering', 'Soylent Catering Group',
        'pending', 'transactional',
        'Megan Allen', 'invoices@soylent.example.com', '+1-617-555-0156',
        'https://catering.soylent.example.com',
        '77 Beacon Street', 'Boston', 'United States',
        'EIN-67-8901234', 'Net 15', 'USD',
        ARRAY['catering','food'],
        null,
        null, null,
        null, null, null, null, null,
        'New supplier — qualification in progress.',
        ARRAY['catering','pending'], '#22c55e',
        'Awaiting first audit.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 days', current_timestamp - interval '2 days'
    ),
    (
        'a0000000-0000-0000-0000-000000000006',
        'SUP-A006', 'Cyberdyne Reseller', 'Cyberdyne Reseller LLC',
        'blacklisted', 'tier_3',
        null, 'sales@cyberdyne-reseller.example.com', null,
        null, null, 'Sunnyvale', 'United States',
        null, 'Net 30', 'USD',
        ARRAY['electronics'],
        null,
        current_date - interval '900 days', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        1.8, 1.5, 2.0, 1.8, 1.7,
        'Counterfeit components found in shipment — blacklisted FY26.',
        ARRAY['blacklisted'], '#dc2626',
        'Do not engage.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '950 days', current_timestamp - interval '180 days'
    );


    ----------------------------------------------------------------
    -- Contracts
    ----------------------------------------------------------------

    INSERT INTO procurement.contracts (id, contract_number, title, supplier_id, type, status, start_date, end_date, auto_renew, renewal_notice_days, value, currency, description, terms, signed_by_user_id, signed_at, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Active long-term
    (
        'a0000000-0000-0000-0000-100000000001',
        'CTR-2026-0001', 'Globex Components — Master Supply Agreement',
        'a0000000-0000-0000-0000-000000000001',
        'master', 'active',
        current_date - interval '400 days', current_date + interval '330 days',
        true, 90,
        500000.00, 'USD',
        'Multi-year supply agreement for electronic components.',
        'Standard MSA — Net 30. Volume-based pricing tiers.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '400 days',
        ARRAY['msa','strategic'], '#3b82f6',
        'Renews automatically with 90-day notice.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '420 days', current_timestamp - interval '60 days'
    ),
    -- Expiring soon
    (
        'a0000000-0000-0000-0000-100000000002',
        'CTR-2026-0002', 'Wayne Industrial — Hardware Supply',
        'a0000000-0000-0000-0000-000000000002',
        'msa', 'expiring_soon',
        current_date - interval '700 days', current_date + interval '40 days',
        false, 60,
        180000.00, 'USD',
        'Two-year hardware supply agreement.',
        'Net 45. Renewal under negotiation.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '700 days',
        ARRAY['hardware','renewal'], '#fb923c',
        'Renewal review starts in 2 weeks.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '720 days', current_timestamp - interval '4 days'
    ),
    -- Active SOW
    (
        'a0000000-0000-0000-0000-100000000003',
        'CTR-2026-0003', 'Stark International — Premium Logistics SOW',
        'a0000000-0000-0000-0000-000000000003',
        'sow', 'active',
        current_date - interval '90 days', current_date + interval '275 days',
        false, 30,
        220000.00, 'USD',
        'Statement of work for premium logistics services.',
        'Milestone-based billing.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '90 days',
        ARRAY['sow','premium'], '#ef4444',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '95 days', current_timestamp - interval '10 days'
    ),
    -- Draft
    (
        'a0000000-0000-0000-0000-100000000004',
        'CTR-2026-0004', 'Soylent Catering — Pilot SOW',
        'a0000000-0000-0000-0000-000000000005',
        'sow', 'draft',
        current_date + interval '30 days', current_date + interval '120 days',
        false, 14,
        18000.00, 'USD',
        'Pilot catering agreement for company offsites.',
        'Per-event pricing.',
        null, null,
        ARRAY['pilot','catering'], '#22c55e',
        'Pending supplier qualification.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '5 days', current_timestamp - interval '2 days'
    ),
    -- Expired
    (
        'a0000000-0000-0000-0000-100000000005',
        'CTR-2026-0005', 'Initech Services — Consulting Retainer',
        'a0000000-0000-0000-0000-000000000004',
        'msa', 'expired',
        current_date - interval '450 days', current_date - interval '85 days',
        false, 30,
        120000.00, 'USD',
        'Annual consulting retainer.',
        'Hourly billing against monthly cap.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '450 days',
        ARRAY['expired','services'], '#94a3b8',
        'Expired pending quality review outcome.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '460 days', current_timestamp - interval '85 days'
    ),
    -- Terminated
    (
        'a0000000-0000-0000-0000-100000000006',
        'CTR-2026-0006', 'Cyberdyne Reseller — Component Resale (terminated)',
        'a0000000-0000-0000-0000-000000000006',
        'spot', 'terminated',
        current_date - interval '900 days', current_date - interval '180 days',
        false, 30,
        45000.00, 'USD',
        'Spot purchase agreement — terminated for cause.',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '900 days',
        ARRAY['terminated'], '#7f1d1d',
        'Terminated after counterfeit components incident.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '900 days', current_timestamp - interval '180 days'
    );


    ----------------------------------------------------------------
    -- Requisitions
    ----------------------------------------------------------------

    INSERT INTO procurement.requisitions (id, requisition_number, title, status, priority, department, cost_center, requested_date, needed_by_date, estimated_total, currency, justification, approver_user_id, approved_at, response, contract_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Approved + converted
    (
        'a0000000-0000-0000-0000-200000000001',
        'REQ-2026-0001', 'Engineering laptops — Q3 hires',
        'converted', 'high',
        'Engineering', 'CC-ENG-001',
        current_date - interval '40 days', current_date - interval '10 days',
        45000.00, 'USD',
        'Laptops for 15 new engineering hires this quarter.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '38 days',
        'Approved.', 'a0000000-0000-0000-0000-100000000001',
        ARRAY['engineering','laptops'], '#3b82f6',
        'Converted to RFQ-2026-0001.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '42 days', current_timestamp - interval '20 days'
    ),
    -- Approved
    (
        'a0000000-0000-0000-0000-200000000002',
        'REQ-2026-0002', 'Office furniture refresh',
        'approved', 'medium',
        'Operations', 'CC-OPS-001',
        current_date - interval '15 days', current_date + interval '15 days',
        22000.00, 'USD',
        'Refresh of common-area furniture in HQ.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '12 days',
        'Approved — proceed with sourcing.', null,
        ARRAY['office','furniture'], '#0ea5e9',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '16 days', current_timestamp - interval '12 days'
    ),
    -- Submitted (awaiting approval)
    (
        'a0000000-0000-0000-0000-200000000003',
        'REQ-2026-0003', 'Marketing event collateral',
        'submitted', 'high',
        'Marketing', 'CC-MKT-001',
        current_date - interval '4 days', current_date + interval '14 days',
        8500.00, 'USD',
        'Booth signage and giveaways for upcoming trade show.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', null,
        null, null,
        ARRAY['marketing','event'], '#f97316',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '4 days', current_timestamp - interval '4 days'
    ),
    -- Submitted overdue
    (
        'a0000000-0000-0000-0000-200000000004',
        'REQ-2026-0004', 'Sales team travel kits',
        'submitted', 'medium',
        'Sales', 'CC-SLS-001',
        current_date - interval '25 days', current_date - interval '5 days',
        4200.00, 'USD',
        'Branded travel kits for the sales team.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', null,
        null, null,
        ARRAY['sales','swag','overdue'], '#ef4444',
        'Awaiting approval — escalating.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '25 days', current_timestamp - interval '5 days'
    ),
    -- Rejected
    (
        'a0000000-0000-0000-0000-200000000005',
        'REQ-2026-0005', 'Premium espresso machine',
        'rejected', 'low',
        'Operations', 'CC-OPS-002',
        current_date - interval '20 days', current_date - interval '5 days',
        3800.00, 'USD',
        'Replacement espresso machine for SF office kitchen.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '17 days',
        'Rejected — out of FY budget. Resubmit next quarter.', null,
        ARRAY['office','rejected'], '#94a3b8',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '17 days'
    ),
    -- Draft
    (
        'a0000000-0000-0000-0000-200000000006',
        'REQ-2026-0006', 'Server room UPS units',
        'draft', 'critical',
        'IT', 'CC-IT-001',
        current_date - interval '1 day', current_date + interval '20 days',
        12500.00, 'USD',
        'Replace failing UPS units in primary server room.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        null, 'a0000000-0000-0000-0000-100000000002',
        ARRAY['it','infra','draft'], '#dc2626',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '1 day', current_timestamp - interval '1 day'
    );


    ----------------------------------------------------------------
    -- Requisition items
    ----------------------------------------------------------------

    INSERT INTO procurement.requisition_items (id, requisition_id, line_number, item_name, item_sku, description, category, quantity, unit_of_measure, estimated_unit_cost, suggested_supplier_id, notes, created_at) VALUES
    -- REQ-0001 (laptops)
    ('a0000000-0000-0000-0000-300000000001', 'a0000000-0000-0000-0000-200000000001', 10, 'Engineering laptop — 16" Pro', 'IT-LPT-PRO16', 'High-spec dev laptop.', 'IT/Hardware', 15, 'each', 3000.00, 'a0000000-0000-0000-0000-000000000001', null, current_timestamp - interval '42 days'),

    -- REQ-0002 (furniture)
    ('a0000000-0000-0000-0000-300000000002', 'a0000000-0000-0000-0000-200000000002', 10, 'Lounge sofa', 'OFC-SOFA-LG', '3-seater lounge sofa.', 'Office/Furniture', 4, 'each', 2500.00, 'a0000000-0000-0000-0000-000000000003', null, current_timestamp - interval '16 days'),
    ('a0000000-0000-0000-0000-300000000003', 'a0000000-0000-0000-0000-200000000002', 20, 'Lounge chair', 'OFC-CHR-LG', 'Single lounge chair.', 'Office/Furniture', 8, 'each', 900.00, 'a0000000-0000-0000-0000-000000000003', null, current_timestamp - interval '16 days'),
    ('a0000000-0000-0000-0000-300000000004', 'a0000000-0000-0000-0000-200000000002', 30, 'Coffee table', 'OFC-TBL-CF', null, 'Office/Furniture', 4, 'each', 800.00, null, null, current_timestamp - interval '16 days'),

    -- REQ-0003 (marketing collateral)
    ('a0000000-0000-0000-0000-300000000005', 'a0000000-0000-0000-0000-200000000003', 10, 'Booth backdrop banner', 'MKT-BNR-BD', '8x10ft printed backdrop.', 'Marketing/Print', 1, 'each', 1500.00, null, null, current_timestamp - interval '4 days'),
    ('a0000000-0000-0000-0000-300000000006', 'a0000000-0000-0000-0000-200000000003', 20, 'Branded notebooks', 'MKT-NTB-BR', 'Hardcover branded notebooks.', 'Marketing/Swag', 500, 'each', 12.00, 'a0000000-0000-0000-0000-000000000003', null, current_timestamp - interval '4 days'),
    ('a0000000-0000-0000-0000-300000000007', 'a0000000-0000-0000-0000-200000000003', 30, 'Pens (branded)', 'MKT-PEN-BR', null, 'Marketing/Swag', 1000, 'each', 1.00, null, null, current_timestamp - interval '4 days'),

    -- REQ-0004 (sales travel kits)
    ('a0000000-0000-0000-0000-300000000008', 'a0000000-0000-0000-0000-200000000004', 10, 'Travel pouch (branded)', 'SLS-TRV-POU', null, 'Sales/Swag', 30, 'each', 80.00, 'a0000000-0000-0000-0000-000000000003', null, current_timestamp - interval '25 days'),
    ('a0000000-0000-0000-0000-300000000009', 'a0000000-0000-0000-0000-200000000004', 20, 'Power bank 10K', 'SLS-PWR-10K', null, 'Sales/Swag', 30, 'each', 60.00, 'a0000000-0000-0000-0000-000000000001', null, current_timestamp - interval '25 days'),

    -- REQ-0006 (UPS units)
    ('a0000000-0000-0000-0000-30000000000a', 'a0000000-0000-0000-0000-200000000006', 10, 'Rack UPS 3kVA', 'IT-UPS-3K', '3kVA rack-mount UPS.', 'IT/Infra', 4, 'each', 3000.00, 'a0000000-0000-0000-0000-000000000002', null, current_timestamp - interval '1 day'),
    ('a0000000-0000-0000-0000-30000000000b', 'a0000000-0000-0000-0000-200000000006', 20, 'Battery extension pack', 'IT-UPS-BAT', null, 'IT/Infra', 4, 'each', 600.00, 'a0000000-0000-0000-0000-000000000002', null, current_timestamp - interval '1 day');


    ----------------------------------------------------------------
    -- RFQs
    ----------------------------------------------------------------

    INSERT INTO procurement.rfqs (id, rfq_number, title, status, requisition_id, description, requirements, issued_date, response_due_date, expected_award_date, awarded_at, estimated_value, awarded_value, currency, awarded_supplier_id, invited_supplier_count, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Awarded (laptop RFQ)
    (
        'a0000000-0000-0000-0000-400000000001',
        'RFQ-2026-0001', 'Engineering laptops Q3 — bulk',
        'awarded', 'a0000000-0000-0000-0000-200000000001',
        '15 high-spec laptops for Q3 hires.',
        'Min 32GB RAM, 1TB SSD, 16" display, 3-year warranty.',
        current_date - interval '38 days', current_date - interval '28 days', current_date - interval '24 days',
        current_timestamp - interval '24 days',
        45000.00, 42750.00, 'USD',
        'a0000000-0000-0000-0000-000000000001', 3,
        ARRAY['it','laptops'], '#3b82f6',
        'Awarded to Globex.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '38 days', current_timestamp - interval '24 days'
    ),
    -- Open (furniture RFQ)
    (
        'a0000000-0000-0000-0000-400000000002',
        'RFQ-2026-0002', 'Office furniture refresh',
        'open', 'a0000000-0000-0000-0000-200000000002',
        '4 sofas, 8 chairs, 4 coffee tables.',
        'Modern style, leather/fabric mix, neutral palette.',
        current_date - interval '10 days', current_date + interval '10 days', current_date + interval '14 days',
        null,
        22000.00, null, 'USD',
        null, 4,
        ARRAY['office','furniture'], '#0ea5e9',
        'Quotes coming in.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '10 days', current_timestamp - interval '2 days'
    ),
    -- Closed (no award yet)
    (
        'a0000000-0000-0000-0000-400000000003',
        'RFQ-2026-0003', 'UPS replacement units',
        'closed', null,
        '4 rack-mount UPS units + battery extensions.',
        'Min 3kVA, ~30 min runtime at full load.',
        current_date - interval '20 days', current_date - interval '5 days', current_date + interval '5 days',
        null,
        14400.00, null, 'USD',
        null, 3,
        ARRAY['it','infra'], '#fb923c',
        'In evaluation.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '5 days'
    ),
    -- Cancelled
    (
        'a0000000-0000-0000-0000-400000000004',
        'RFQ-2026-0004', 'Espresso machine RFQ (cancelled)',
        'cancelled', 'a0000000-0000-0000-0000-200000000005',
        'Replacement espresso machine for SF office.',
        null,
        current_date - interval '18 days', current_date - interval '8 days', null,
        null,
        3800.00, null, 'USD',
        null, 2,
        ARRAY['cancelled'], '#94a3b8',
        'Cancelled after requisition rejected.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '18 days', current_timestamp - interval '8 days'
    );


    ----------------------------------------------------------------
    -- Quotes
    ----------------------------------------------------------------

    INSERT INTO procurement.quotes (id, quote_number, rfq_id, supplier_id, status, submitted_at, valid_until, total_price, currency, lead_time_days, payment_terms, line_items, description, notes, score, user_id, created_at, updated_at) VALUES
    -- RFQ-0001 quotes
    ('a0000000-0000-0000-0000-500000000001', 'Q-2026-0001-A', 'a0000000-0000-0000-0000-400000000001', 'a0000000-0000-0000-0000-000000000001', 'awarded',
     current_timestamp - interval '32 days', current_date - interval '5 days',
     42750.00, 'USD', 21, 'Net 30',
     '[{"item":"16\" Pro Laptop","qty":15,"unit":2850.00,"total":42750.00}]'::jsonb,
     'Globex laptop quote — best price + warranty.', 'Awarded.',
     4.7, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '32 days', current_timestamp - interval '24 days'),
    ('a0000000-0000-0000-0000-500000000002', 'Q-2026-0001-B', 'a0000000-0000-0000-0000-400000000001', 'a0000000-0000-0000-0000-000000000002', 'rejected',
     current_timestamp - interval '30 days', current_date - interval '5 days',
     45600.00, 'USD', 14, 'Net 45',
     '[{"item":"16\" Pro Laptop","qty":15,"unit":3040.00,"total":45600.00}]'::jsonb,
     'Wayne quote — higher price, faster delivery.', 'Rejected on price.',
     4.0, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '30 days', current_timestamp - interval '24 days'),
    ('a0000000-0000-0000-0000-500000000003', 'Q-2026-0001-C', 'a0000000-0000-0000-0000-400000000001', 'a0000000-0000-0000-0000-000000000004', 'rejected',
     current_timestamp - interval '29 days', current_date - interval '5 days',
     48000.00, 'USD', 30, 'Net 30',
     '[{"item":"16\" Pro Laptop","qty":15,"unit":3200.00,"total":48000.00}]'::jsonb,
     'Initech quote — premium brand.', 'Out of budget.',
     3.5, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '29 days', current_timestamp - interval '24 days'),

    -- RFQ-0002 quotes (open)
    ('a0000000-0000-0000-0000-500000000004', 'Q-2026-0002-A', 'a0000000-0000-0000-0000-400000000002', 'a0000000-0000-0000-0000-000000000003', 'shortlisted',
     current_timestamp - interval '5 days', current_date + interval '25 days',
     21500.00, 'USD', 28, 'Net 30',
     null, 'Stark furniture proposal.', 'Premium look — preferred.',
     4.6, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '5 days', current_timestamp - interval '2 days'),
    ('a0000000-0000-0000-0000-500000000005', 'Q-2026-0002-B', 'a0000000-0000-0000-0000-400000000002', 'a0000000-0000-0000-0000-000000000002', 'submitted',
     current_timestamp - interval '3 days', current_date + interval '27 days',
     19800.00, 'USD', 21, 'Net 45',
     null, 'Wayne furniture proposal.', 'Cheapest — under review.',
     4.0, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '3 days', current_timestamp - interval '3 days'),

    -- RFQ-0003 quotes (closed, evaluating)
    ('a0000000-0000-0000-0000-500000000006', 'Q-2026-0003-A', 'a0000000-0000-0000-0000-400000000003', 'a0000000-0000-0000-0000-000000000002', 'shortlisted',
     current_timestamp - interval '8 days', current_date + interval '30 days',
     14000.00, 'USD', 14, 'Net 45',
     '[{"item":"3kVA UPS","qty":4,"unit":2900.00,"total":11600.00},{"item":"Battery pack","qty":4,"unit":600.00,"total":2400.00}]'::jsonb,
     'Wayne UPS proposal.', 'Strong fit on lead time.',
     4.2, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '8 days', current_timestamp - interval '5 days'),
    ('a0000000-0000-0000-0000-500000000007', 'Q-2026-0003-B', 'a0000000-0000-0000-0000-400000000003', 'a0000000-0000-0000-0000-000000000001', 'submitted',
     current_timestamp - interval '6 days', current_date + interval '30 days',
     14400.00, 'USD', 21, 'Net 30',
     null, 'Globex UPS proposal.', null,
     4.5, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '6 days', current_timestamp - interval '5 days'),

    -- RFQ-0004 quotes (cancelled)
    ('a0000000-0000-0000-0000-500000000008', 'Q-2026-0004-A', 'a0000000-0000-0000-0000-400000000004', 'a0000000-0000-0000-0000-000000000005', 'withdrawn',
     current_timestamp - interval '15 days', current_date - interval '5 days',
     3800.00, 'USD', 7, 'Net 15',
     null, 'Espresso machine quote.', 'Withdrawn after RFQ cancelled.',
     null, 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '15 days', current_timestamp - interval '8 days');


    ----------------------------------------------------------------
    -- Asset categories
    ----------------------------------------------------------------

    INSERT INTO procurement.asset_categories (id, code, name, parent_id, description, default_depreciation_method, default_useful_life_months, default_salvage_pct, color, tags, created_at, updated_at) VALUES
    ('a0000000-0000-0000-0000-600000000001', 'CAT-IT', 'IT Hardware', null, 'Laptops, monitors, networking gear.', 'straight_line', 36, 5.00, '#3b82f6', ARRAY['it'], current_timestamp - interval '700 days', current_timestamp - interval '60 days'),
    ('a0000000-0000-0000-0000-600000000002', 'CAT-IT-LP', 'Laptops', 'a0000000-0000-0000-0000-600000000001', 'Engineering and corporate laptops.', 'straight_line', 36, 5.00, '#0ea5e9', ARRAY['it','laptops'], current_timestamp - interval '700 days', current_timestamp - interval '60 days'),
    ('a0000000-0000-0000-0000-600000000003', 'CAT-OFC', 'Office Furniture', null, 'Desks, chairs, lounge furniture.', 'straight_line', 84, 10.00, '#22c55e', ARRAY['office'], current_timestamp - interval '700 days', current_timestamp - interval '90 days'),
    ('a0000000-0000-0000-0000-600000000004', 'CAT-VEH', 'Vehicles', null, 'Company cars, vans.', 'declining_balance', 60, 20.00, '#f97316', ARRAY['fleet'], current_timestamp - interval '700 days', current_timestamp - interval '120 days'),
    ('a0000000-0000-0000-0000-600000000005', 'CAT-MFG', 'Production Equipment', null, 'Machines and tooling.', 'units_of_production', 120, 10.00, '#a855f7', ARRAY['manufacturing'], current_timestamp - interval '700 days', current_timestamp - interval '60 days');


    ----------------------------------------------------------------
    -- Assets
    ----------------------------------------------------------------

    INSERT INTO procurement.assets (id, asset_tag, name, serial_number, category_id, supplier_id, status, condition, manufacturer, model, location, department, purchase_date, purchase_cost, currency, depreciation_method, useful_life_months, salvage_value, accumulated_depreciation, current_value, warranty_until, insured, insurance_policy, last_inspection_date, next_inspection_date, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- Laptops
    (
        'a0000000-0000-0000-0000-700000000001',
        'AST-LPT-0001', 'Engineering Laptop #001', 'SN-LPT-2025-001',
        'a0000000-0000-0000-0000-600000000002', 'a0000000-0000-0000-0000-000000000001',
        'in_use', 'good',
        'Globex', '16" Pro 2025',
        'SF HQ — Bay 2', 'Engineering',
        current_date - interval '600 days', 2850.00, 'USD',
        'straight_line', 36, 142.50, 1582.00, 1268.00,
        current_date + interval '460 days', true, 'POL-IT-001',
        current_date - interval '180 days', current_date + interval '180 days',
        ARRAY['laptop','engineering'], '#3b82f6', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '600 days', current_timestamp - interval '20 days'
    ),
    (
        'a0000000-0000-0000-0000-700000000002',
        'AST-LPT-0002', 'Engineering Laptop #002', 'SN-LPT-2026-002',
        'a0000000-0000-0000-0000-600000000002', 'a0000000-0000-0000-0000-000000000001',
        'in_use', 'excellent',
        'Globex', '16" Pro 2026',
        'NY Office — Desk 14', 'Engineering',
        current_date - interval '90 days', 2850.00, 'USD',
        'straight_line', 36, 142.50, 230.00, 2620.00,
        current_date + interval '985 days', true, 'POL-IT-001',
        null, current_date + interval '275 days',
        ARRAY['laptop','engineering'], '#3b82f6', 'New issue.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '90 days', current_timestamp - interval '30 days'
    ),
    (
        'a0000000-0000-0000-0000-700000000003',
        'AST-LPT-0003', 'Engineering Laptop #003', 'SN-LPT-2024-003',
        'a0000000-0000-0000-0000-600000000002', 'a0000000-0000-0000-0000-000000000001',
        'maintenance', 'fair',
        'Globex', '16" Pro 2024',
        'SF HQ — IT Bench', 'IT',
        current_date - interval '900 days', 2750.00, 'USD',
        'straight_line', 36, 137.50, 2200.00, 550.00,
        current_date - interval '170 days', true, 'POL-IT-001',
        current_date - interval '90 days', current_date + interval '90 days',
        ARRAY['laptop','repair'], '#fb923c', 'Battery swap in progress.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '900 days', current_timestamp - interval '6 days'
    ),
    -- Furniture
    (
        'a0000000-0000-0000-0000-700000000004',
        'AST-OFC-0001', 'Lounge Sofa — North Lobby', null,
        'a0000000-0000-0000-0000-600000000003', 'a0000000-0000-0000-0000-000000000003',
        'in_use', 'excellent',
        'Stark', 'Premium 3-seater',
        'SF HQ — North Lobby', 'Operations',
        current_date - interval '60 days', 2500.00, 'USD',
        'straight_line', 84, 250.00, 178.00, 2322.00,
        null, false, null,
        null, current_date + interval '335 days',
        ARRAY['furniture','lobby'], '#22c55e', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '10 days'
    ),
    -- Vehicle
    (
        'a0000000-0000-0000-0000-700000000005',
        'AST-VEH-0001', 'Delivery Van', 'VIN-VAN-2024-001',
        'a0000000-0000-0000-0000-600000000004', 'a0000000-0000-0000-0000-000000000002',
        'in_use', 'good',
        'Wayne', 'CommercialVan 2024',
        'Oakland DC', 'Logistics',
        current_date - interval '500 days', 38000.00, 'USD',
        'declining_balance', 60, 7600.00, 11400.00, 26600.00,
        current_date + interval '230 days', true, 'POL-FLT-001',
        current_date - interval '60 days', current_date + interval '120 days',
        ARRAY['vehicle','fleet'], '#f97316', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '500 days', current_timestamp - interval '12 days'
    ),
    -- Production equipment
    (
        'a0000000-0000-0000-0000-700000000006',
        'AST-MFG-0001', 'CNC Mill — Bay 2', 'SN-CNC-2022-001',
        'a0000000-0000-0000-0000-600000000005', 'a0000000-0000-0000-0000-000000000002',
        'in_use', 'good',
        'Wayne', 'IndustrialMill 4040',
        'Plant A — Bay 2', 'Manufacturing',
        current_date - interval '900 days', 85000.00, 'USD',
        'units_of_production', 120, 8500.00, 19500.00, 65500.00,
        current_date + interval '90 days', true, 'POL-MFG-001',
        current_date - interval '30 days', current_date + interval '60 days',
        ARRAY['cnc','machining'], '#a855f7', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '900 days', current_timestamp - interval '20 days'
    ),
    -- Available (in stock, not yet assigned)
    (
        'a0000000-0000-0000-0000-700000000007',
        'AST-LPT-0004', 'Engineering Laptop #004 (spare)', 'SN-LPT-2026-004',
        'a0000000-0000-0000-0000-600000000002', 'a0000000-0000-0000-0000-000000000001',
        'available', 'new',
        'Globex', '16" Pro 2026',
        'SF HQ — IT Storage', 'IT',
        current_date - interval '7 days', 2850.00, 'USD',
        'straight_line', 36, 142.50, 0, 2850.00,
        current_date + interval '1068 days', true, 'POL-IT-001',
        null, current_date + interval '358 days',
        ARRAY['laptop','spare'], '#0ea5e9', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '7 days', current_timestamp - interval '7 days'
    ),
    -- Retired
    (
        'a0000000-0000-0000-0000-700000000008',
        'AST-LPT-9001', 'Old Engineering Laptop', 'SN-LPT-2020-901',
        'a0000000-0000-0000-0000-600000000002', null,
        'retired', 'poor',
        'Globex', '15" 2020',
        'SF HQ — IT Storage', 'IT',
        current_date - interval '1500 days', 2400.00, 'USD',
        'straight_line', 36, 120.00, 2280.00, 120.00,
        current_date - interval '500 days', false, null,
        current_date - interval '300 days', null,
        ARRAY['retired'], '#94a3b8', 'Awaiting disposal.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '1500 days', current_timestamp - interval '90 days'
    );


    ----------------------------------------------------------------
    -- Asset assignments
    ----------------------------------------------------------------

    INSERT INTO procurement.asset_assignments (id, asset_id, assignee_user_id, assignee_name, assignee_department, status, assigned_at, expected_return_date, returned_at, location, purpose, return_condition, notes, user_id, created_at, updated_at) VALUES
    -- Active
    (
        'a0000000-0000-0000-0000-800000000001', 'a0000000-0000-0000-0000-700000000001',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'Olivia Bennett', 'People Operations',
        'active', current_timestamp - interval '600 days', null, null,
        'SF HQ — Bay 2', 'Daily work laptop.', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '600 days', current_timestamp - interval '600 days'
    ),
    (
        'a0000000-0000-0000-0000-800000000002', 'a0000000-0000-0000-0000-700000000002',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'Sophia Martinez', 'Sales',
        'active', current_timestamp - interval '90 days', null, null,
        'NY Office — Desk 14', 'Daily work laptop.', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '90 days', current_timestamp - interval '90 days'
    ),
    (
        'a0000000-0000-0000-0000-800000000003', 'a0000000-0000-0000-0000-700000000005',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'Logistics Pool', 'Logistics',
        'active', current_timestamp - interval '500 days', null, null,
        'Oakland DC', 'Delivery rotation.', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '500 days', current_timestamp - interval '500 days'
    ),
    (
        'a0000000-0000-0000-0000-800000000004', 'a0000000-0000-0000-0000-700000000006',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'Liam Carter', 'Engineering',
        'active', current_timestamp - interval '900 days', null, null,
        'Plant A — Bay 2', 'Production owner.', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '900 days', current_timestamp - interval '900 days'
    ),
    -- Returned (laptop swap)
    (
        'a0000000-0000-0000-0000-800000000005', 'a0000000-0000-0000-0000-700000000003',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'Ava Singh', 'Engineering',
        'returned', current_timestamp - interval '900 days', current_date - interval '7 days', current_timestamp - interval '7 days',
        'SF HQ — IT Bench', 'Daily work laptop — returned for repair.', 'fair', 'Battery swelled.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '900 days', current_timestamp - interval '7 days'
    ),
    -- Returned (sofa transfer)
    (
        'a0000000-0000-0000-0000-800000000006', 'a0000000-0000-0000-0000-700000000004',
        null, 'Operations Pool', 'Operations',
        'transferred', current_timestamp - interval '60 days', null, current_timestamp - interval '5 days',
        'SF HQ — North Lobby', 'Lobby refresh — repositioned.', 'excellent', 'Moved between lobbies.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '5 days'
    ),
    -- Lost
    (
        'a0000000-0000-0000-0000-800000000007', 'a0000000-0000-0000-0000-700000000008',
        null, 'Unassigned', 'IT',
        'lost', current_timestamp - interval '1500 days', null, current_timestamp - interval '90 days',
        'Unknown', 'Old loaner pool.', 'poor', 'Reported lost during office move.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '1500 days', current_timestamp - interval '90 days'
    );


    ----------------------------------------------------------------
    -- Asset maintenance
    ----------------------------------------------------------------

    INSERT INTO procurement.asset_maintenance (id, maintenance_number, asset_id, type, status, title, description, scheduled_date, started_at, completed_at, technician_user_id, vendor_supplier_id, cost, currency, parts_used, findings, next_due_date, tags, notes, user_id, created_at, updated_at) VALUES
    -- Completed preventive
    (
        'a0000000-0000-0000-0000-900000000001', 'MNT-2026-0001', 'a0000000-0000-0000-0000-700000000006',
        'preventive', 'completed',
        'CNC Mill — quarterly PM',
        'Quarterly preventive maintenance on the CNC mill.',
        current_date - interval '30 days', current_timestamp - interval '30 days', current_timestamp - interval '29 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'a0000000-0000-0000-0000-000000000002',
        850.00, 'USD',
        'Coolant filter, way oil 5L.', 'All within spec.',
        current_date + interval '60 days',
        ARRAY['preventive','cnc'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '29 days'
    ),
    -- In progress (laptop battery swap)
    (
        'a0000000-0000-0000-0000-900000000002', 'MNT-2026-0002', 'a0000000-0000-0000-0000-700000000003',
        'corrective', 'in_progress',
        'Laptop battery replacement',
        'Swelled battery on engineering laptop.',
        current_date - interval '5 days', current_timestamp - interval '4 days', null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'a0000000-0000-0000-0000-000000000001',
        180.00, 'USD',
        'Replacement battery pack.', null,
        null,
        ARRAY['corrective','laptop'], 'Awaiting part.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 days', current_timestamp - interval '1 day'
    ),
    -- Scheduled (vehicle service)
    (
        'a0000000-0000-0000-0000-900000000003', 'MNT-2026-0003', 'a0000000-0000-0000-0000-700000000005',
        'preventive', 'scheduled',
        'Delivery van — 60-day service',
        'Routine 60-day vehicle inspection and oil change.',
        current_date + interval '30 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'a0000000-0000-0000-0000-000000000002',
        320.00, 'USD',
        null, null,
        current_date + interval '120 days',
        ARRAY['preventive','vehicle'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '5 days', current_timestamp - interval '5 days'
    ),
    -- Scheduled overdue
    (
        'a0000000-0000-0000-0000-900000000004', 'MNT-2026-0004', 'a0000000-0000-0000-0000-700000000001',
        'inspection', 'scheduled',
        'Annual laptop inspection',
        'Annual hardware inspection and audit.',
        current_date - interval '7 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        0, 'USD',
        null, null,
        current_date + interval '358 days',
        ARRAY['inspection','laptop','overdue'], 'Overdue — needs reschedule.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '14 days', current_timestamp - interval '7 days'
    ),
    -- Completed calibration
    (
        'a0000000-0000-0000-0000-900000000005', 'MNT-2026-0005', 'a0000000-0000-0000-0000-700000000006',
        'calibration', 'completed',
        'CNC mill — annual calibration',
        'Annual precision calibration.',
        current_date - interval '90 days', current_timestamp - interval '90 days', current_timestamp - interval '89 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'a0000000-0000-0000-0000-000000000002',
        1500.00, 'USD',
        'Calibration kit.', 'Within tolerance.',
        current_date + interval '275 days',
        ARRAY['calibration','cnc'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '100 days', current_timestamp - interval '89 days'
    ),
    -- Cancelled
    (
        'a0000000-0000-0000-0000-900000000006', 'MNT-2026-0006', 'a0000000-0000-0000-0000-700000000008',
        'corrective', 'cancelled',
        'Old laptop repair (cancelled)',
        'Cancelled — asset retired.',
        current_date - interval '95 days', null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        0, 'USD',
        null, null,
        null,
        ARRAY['cancelled'], 'Asset retired before repair.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '95 days', current_timestamp - interval '95 days'
    ),
    -- Upgrade
    (
        'a0000000-0000-0000-0000-900000000007', 'MNT-2026-0007', 'a0000000-0000-0000-0000-700000000002',
        'upgrade', 'completed',
        'Laptop RAM upgrade',
        'RAM upgrade from 32GB to 64GB.',
        current_date - interval '20 days', current_timestamp - interval '20 days', current_timestamp - interval '20 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'a0000000-0000-0000-0000-000000000001',
        420.00, 'USD',
        '2x32GB DDR5 SODIMM.', 'Upgrade successful.',
        null,
        ARRAY['upgrade','laptop'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '25 days', current_timestamp - interval '20 days'
    );
