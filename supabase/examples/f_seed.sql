
    -- Finance / Payroll / Accounting Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)

    ----------------------------------------------------------------
    -- Accounts (Chart of Accounts)
    ----------------------------------------------------------------

    INSERT INTO finance.accounts (id, code, name, type, parent_id, description, currency, opening_balance, current_balance, is_active, color, created_at, updated_at) VALUES
    -- Assets
    (
        'f0000000-0000-0000-0000-000000000001',
        '1000', 'Cash & Bank', 'asset', null,
        'Operating cash and bank accounts.',
        'USD', 250000.00, 412500.00, true, '#10b981',
        current_timestamp - interval '2 years', current_timestamp - interval '5 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000002',
        '1100', 'Accounts Receivable', 'asset', null,
        'Outstanding customer invoices.',
        'USD', 0, 124000.00, true, '#22c55e',
        current_timestamp - interval '2 years', current_timestamp - interval '4 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000003',
        '1500', 'Equipment & Computers', 'asset', null,
        'Owned equipment, depreciating.',
        'USD', 80000.00, 64000.00, true, '#16a34a',
        current_timestamp - interval '2 years', current_timestamp - interval '60 days'
    ),
    -- Liabilities
    (
        'f0000000-0000-0000-0000-000000000004',
        '2000', 'Accounts Payable', 'liability', null,
        'Outstanding vendor bills.',
        'USD', 0, 38500.00, true, '#ef4444',
        current_timestamp - interval '2 years', current_timestamp - interval '4 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000005',
        '2100', 'Payroll Liabilities', 'liability', null,
        'Withheld taxes and benefits.',
        'USD', 0, 28200.00, true, '#dc2626',
        current_timestamp - interval '2 years', current_timestamp - interval '6 days'
    ),
    -- Equity
    (
        'f0000000-0000-0000-0000-000000000006',
        '3000', 'Retained Earnings', 'equity', null,
        'Accumulated earnings.',
        'USD', 200000.00, 312000.00, true, '#3b82f6',
        current_timestamp - interval '2 years', current_timestamp - interval '30 days'
    ),
    -- Revenue
    (
        'f0000000-0000-0000-0000-000000000007',
        '4000', 'Subscription Revenue', 'revenue', null,
        'Recurring SaaS subscription revenue.',
        'USD', 0, 540000.00, true, '#0ea5e9',
        current_timestamp - interval '2 years', current_timestamp - interval '2 days'
    ),
    (
        'f0000000-0000-0000-0000-000000000008',
        '4100', 'Services Revenue', 'revenue', null,
        'Implementation and professional services.',
        'USD', 0, 96000.00, true, '#0284c7',
        current_timestamp - interval '2 years', current_timestamp - interval '10 days'
    ),
    -- Expenses
    (
        'f0000000-0000-0000-0000-000000000009',
        '5000', 'Salaries & Wages', 'expense', null,
        'Gross payroll.',
        'USD', 0, 480000.00, true, '#f97316',
        current_timestamp - interval '2 years', current_timestamp - interval '3 days'
    ),
    (
        'f0000000-0000-0000-0000-00000000000a',
        '5100', 'Software Subscriptions', 'expense', null,
        'Internal SaaS tools.',
        'USD', 0, 38000.00, true, '#fb923c',
        current_timestamp - interval '2 years', current_timestamp - interval '7 days'
    ),
    (
        'f0000000-0000-0000-0000-00000000000b',
        '5200', 'Travel & Entertainment', 'expense', null,
        'Travel, meals, entertainment.',
        'USD', 0, 24500.00, true, '#fdba74',
        current_timestamp - interval '2 years', current_timestamp - interval '5 days'
    ),
    (
        'f0000000-0000-0000-0000-00000000000c',
        '5300', 'Office & Facilities', 'expense', null,
        'Rent and office supplies.',
        'USD', 0, 64000.00, true, '#fed7aa',
        current_timestamp - interval '2 years', current_timestamp - interval '15 days'
    );


    ----------------------------------------------------------------
    -- Vendors
    ----------------------------------------------------------------

    INSERT INTO finance.vendors (id, name, legal_name, code, website, email, phone, address, city, country, tax_id, payment_terms, description, tags, color, notes, user_id, created_at, updated_at) VALUES
    (
        'f0000000-0000-0000-0000-100000000001',
        'Cyberdyne Systems', 'Cyberdyne Systems Corp.', 'V-001',
        'https://cyberdyne.example.com', 'accounts@cyberdyne.example.com', '+1-408-555-0167',
        '18144 El Camino Real', 'Sunnyvale', 'United States',
        'EIN-12-3456789', 'Net 30',
        'Infrastructure vendor for the inference platform.',
        ARRAY['infra','tech'], '#a855f7',
        'Annual contract; primary vendor.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 years', current_timestamp - interval '30 days'
    ),
    (
        'f0000000-0000-0000-0000-100000000002',
        'Initech Office Supplies', 'Initech Office Supplies LLC', 'V-002',
        'https://initech-office.example.com', 'billing@initech-office.example.com', '+1-512-555-0118',
        '4120 Tech Boulevard', 'Austin', 'United States',
        'EIN-23-4567890', 'Net 15',
        'Office supplies and consumables.',
        ARRAY['office'], '#8b5cf6',
        'Monthly recurring deliveries.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '500 days', current_timestamp - interval '14 days'
    ),
    (
        'f0000000-0000-0000-0000-100000000003',
        'Globex Cloud', 'Globex Cloud Holdings', 'V-003',
        'https://cloud.globex.example.com', 'ar@globex.example.com', '+1-312-555-0142',
        '88 Industrial Way', 'Chicago', 'United States',
        'EIN-34-5678901', 'Net 30',
        'Cloud infrastructure provider.',
        ARRAY['cloud','infra'], '#3b82f6',
        'Largest spend vendor.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '700 days', current_timestamp - interval '20 days'
    ),
    (
        'f0000000-0000-0000-0000-100000000004',
        'Wayne Legal', 'Wayne & Associates LLP', 'V-004',
        'https://wayne-legal.example.com', 'ar@wayne-legal.example.com', '+1-201-555-0199',
        '1007 Mountain Drive', 'Gotham', 'United States',
        'EIN-45-6789012', 'Net 45',
        'Outside legal counsel.',
        ARRAY['legal','services'], '#0ea5e9',
        'Hourly billing; monthly retainer.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '600 days', current_timestamp - interval '40 days'
    ),
    (
        'f0000000-0000-0000-0000-100000000005',
        'Soylent Catering', 'Soylent Catering Group', 'V-005',
        'https://catering.soylent.example.com', 'invoices@soylent.example.com', '+1-617-555-0156',
        '77 Beacon Street', 'Boston', 'United States',
        'EIN-56-7890123', 'Net 15',
        'Office catering for offsites and lunches.',
        ARRAY['catering','meals'], '#22c55e',
        'Used for quarterly offsites.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '300 days', current_timestamp - interval '60 days'
    );


    ----------------------------------------------------------------
    -- Invoices
    ----------------------------------------------------------------

    INSERT INTO finance.invoices (id, invoice_number, customer_name, customer_email, customer_address, status, issue_date, due_date, paid_date, subtotal, tax, total, amount_paid, currency, description, line_items, revenue_account_id, tags, notes, user_id, created_at, updated_at) VALUES
    -- Paid invoices (revenue)
    (
        'f0000000-0000-0000-0000-200000000001',
        'INV-2026-0001',
        'Acme Corporation', 'ap@acme.example.com', '500 Market Street, San Francisco, CA',
        'paid',
        current_date - interval '90 days', current_date - interval '60 days', current_date - interval '55 days',
        20000.00, 1800.00, 21800.00, 21800.00, 'USD',
        'Q1 platform subscription.',
        '[{"description":"Platform tier — Q1","quantity":1,"unit_price":20000.00,"amount":20000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000007',
        ARRAY['subscription','q1'],
        'Paid early.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '90 days', current_timestamp - interval '55 days'
    ),
    (
        'f0000000-0000-0000-0000-200000000002',
        'INV-2026-0002',
        'Initech Software', 'finance@initech.example.com', '4120 Tech Boulevard, Austin, TX',
        'paid',
        current_date - interval '70 days', current_date - interval '40 days', current_date - interval '38 days',
        12000.00, 1080.00, 13080.00, 13080.00, 'USD',
        'Analytics add-on annual fee.',
        '[{"description":"Analytics add-on","quantity":1,"unit_price":12000.00,"amount":12000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000007',
        ARRAY['expansion'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '70 days', current_timestamp - interval '38 days'
    ),
    (
        'f0000000-0000-0000-0000-200000000003',
        'INV-2026-0003',
        'Stark Industries', 'ap@stark.example.com', '10880 Malibu Point, New York, NY',
        'paid',
        current_date - interval '50 days', current_date - interval '20 days', current_date - interval '15 days',
        80000.00, 7200.00, 87200.00, 87200.00, 'USD',
        'Enterprise platform — multi-year tranche 1.',
        '[{"description":"Enterprise platform","quantity":1,"unit_price":80000.00,"amount":80000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000007',
        ARRAY['enterprise'],
        'Multi-year deal first installment.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '50 days', current_timestamp - interval '15 days'
    ),
    -- Sent invoices (outstanding)
    (
        'f0000000-0000-0000-0000-200000000004',
        'INV-2026-0004',
        'Globex Industries', 'billing@globex.example.com', '88 Industrial Way, Chicago, IL',
        'sent',
        current_date - interval '15 days', current_date + interval '15 days', null,
        18000.00, 1620.00, 19620.00, 0, 'USD',
        'New logo annual subscription.',
        '[{"description":"Standard tier — annual","quantity":1,"unit_price":18000.00,"amount":18000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000007',
        ARRAY['new-logo'],
        'Sent via portal.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '15 days', current_timestamp - interval '14 days'
    ),
    (
        'f0000000-0000-0000-0000-200000000005',
        'INV-2026-0005',
        'Umbrella Corporation', 'finance@umbrella.example.com', '200 Research Park, Raccoon City, IL',
        'sent',
        current_date - interval '8 days', current_date + interval '22 days', null,
        45000.00, 4050.00, 49050.00, 0, 'USD',
        'POV conversion — first-year tier.',
        '[{"description":"Pro tier — annual","quantity":1,"unit_price":45000.00,"amount":45000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000007',
        ARRAY['pov','pharma'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '8 days', current_timestamp - interval '8 days'
    ),
    (
        'f0000000-0000-0000-0000-200000000006',
        'INV-2026-0006',
        'Wayne Enterprises', 'ap@wayne.example.com', '1007 Mountain Drive, Gotham, NJ',
        'sent',
        current_date - interval '5 days', current_date + interval '40 days', null,
        25000.00, 2250.00, 27250.00, 0, 'USD',
        'Co-marketing engagement Q2.',
        '[{"description":"Co-marketing program","quantity":1,"unit_price":25000.00,"amount":25000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000008',
        ARRAY['partner'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 days', current_timestamp - interval '5 days'
    ),
    -- Overdue
    (
        'f0000000-0000-0000-0000-200000000007',
        'INV-2026-0007',
        'Acme Corporation', 'ap@acme.example.com', '500 Market Street, San Francisco, CA',
        'overdue',
        current_date - interval '60 days', current_date - interval '30 days', null,
        15000.00, 1350.00, 16350.00, 0, 'USD',
        'Services — implementation week 1.',
        '[{"description":"Implementation services","quantity":1,"unit_price":15000.00,"amount":15000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000008',
        ARRAY['services','overdue'],
        'Following up via AR.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '5 days'
    ),
    (
        'f0000000-0000-0000-0000-200000000008',
        'INV-2026-0008',
        'Soylent Foods', 'ap@soylent.example.com', '77 Beacon Street, Boston, MA',
        'overdue',
        current_date - interval '90 days', current_date - interval '60 days', null,
        9000.00, 810.00, 9810.00, 0, 'USD',
        'Channel partner setup fee.',
        '[{"description":"Setup fee","quantity":1,"unit_price":9000.00,"amount":9000.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000008',
        ARRAY['partner','overdue'],
        'In dispute — escalated.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '90 days', current_timestamp - interval '10 days'
    ),
    -- Draft
    (
        'f0000000-0000-0000-0000-200000000009',
        'INV-2026-0009',
        'Cyberdyne Systems', 'ap@cyberdyne.example.com', '18144 El Camino Real, Sunnyvale, CA',
        'draft',
        current_date - interval '2 days', current_date + interval '28 days', null,
        7500.00, 675.00, 8175.00, 0, 'USD',
        'Reciprocal services credit.',
        '[{"description":"Services credit","quantity":1,"unit_price":7500.00,"amount":7500.00}]'::jsonb,
        'f0000000-0000-0000-0000-000000000008',
        ARRAY['draft'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '2 days', current_timestamp - interval '1 day'
    ),
    -- Cancelled
    (
        'f0000000-0000-0000-0000-20000000000a',
        'INV-2026-0010',
        'Lisa Anderson Startup', 'lisa.anderson@example.com', null,
        'cancelled',
        current_date - interval '40 days', current_date - interval '10 days', null,
        2500.00, 225.00, 2725.00, 0, 'USD',
        'Pilot — cancelled by customer.',
        null,
        'f0000000-0000-0000-0000-000000000007',
        ARRAY['cancelled'],
        'Customer rolled back to free tier.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '8 days'
    );


    ----------------------------------------------------------------
    -- Bills
    ----------------------------------------------------------------

    INSERT INTO finance.bills (id, bill_number, vendor_id, status, issue_date, due_date, paid_date, subtotal, tax, total, amount_paid, currency, description, expense_account_id, tags, notes, user_id, created_at, updated_at) VALUES
    -- Paid bills
    (
        'f0000000-0000-0000-0000-300000000001',
        'BILL-2026-0001',
        'f0000000-0000-0000-0000-100000000003',
        'paid',
        current_date - interval '60 days', current_date - interval '30 days', current_date - interval '32 days',
        12500.00, 0, 12500.00, 12500.00, 'USD',
        'Globex Cloud — March infra.',
        'f0000000-0000-0000-0000-00000000000a',
        ARRAY['infra','recurring'],
        'Auto-pay.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '32 days'
    ),
    (
        'f0000000-0000-0000-0000-300000000002',
        'BILL-2026-0002',
        'f0000000-0000-0000-0000-100000000001',
        'paid',
        current_date - interval '50 days', current_date - interval '20 days', current_date - interval '21 days',
        8500.00, 0, 8500.00, 8500.00, 'USD',
        'Cyberdyne — inference compute.',
        'f0000000-0000-0000-0000-00000000000a',
        ARRAY['infra'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '50 days', current_timestamp - interval '21 days'
    ),
    (
        'f0000000-0000-0000-0000-300000000003',
        'BILL-2026-0003',
        'f0000000-0000-0000-0000-100000000004',
        'paid',
        current_date - interval '35 days', current_date - interval '5 days', current_date - interval '4 days',
        6200.00, 0, 6200.00, 6200.00, 'USD',
        'Wayne Legal — March retainer.',
        'f0000000-0000-0000-0000-00000000000c',
        ARRAY['legal','retainer'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '35 days', current_timestamp - interval '4 days'
    ),
    -- Approved (awaiting payment)
    (
        'f0000000-0000-0000-0000-300000000004',
        'BILL-2026-0004',
        'f0000000-0000-0000-0000-100000000003',
        'approved',
        current_date - interval '15 days', current_date + interval '15 days', null,
        13800.00, 0, 13800.00, 0, 'USD',
        'Globex Cloud — April infra.',
        'f0000000-0000-0000-0000-00000000000a',
        ARRAY['infra','recurring'],
        'Approved; scheduled to pay.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '15 days', current_timestamp - interval '4 days'
    ),
    (
        'f0000000-0000-0000-0000-300000000005',
        'BILL-2026-0005',
        'f0000000-0000-0000-0000-100000000005',
        'approved',
        current_date - interval '10 days', current_date + interval '5 days', null,
        4200.00, 336.00, 4536.00, 0, 'USD',
        'Soylent Catering — Q2 offsite.',
        'f0000000-0000-0000-0000-00000000000b',
        ARRAY['offsite','catering'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '10 days', current_timestamp - interval '3 days'
    ),
    -- Pending review
    (
        'f0000000-0000-0000-0000-300000000006',
        'BILL-2026-0006',
        'f0000000-0000-0000-0000-100000000002',
        'pending',
        current_date - interval '4 days', current_date + interval '11 days', null,
        1850.00, 148.00, 1998.00, 0, 'USD',
        'Office supplies — April delivery.',
        'f0000000-0000-0000-0000-00000000000c',
        ARRAY['office'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '4 days', current_timestamp - interval '4 days'
    ),
    -- Overdue
    (
        'f0000000-0000-0000-0000-300000000007',
        'BILL-2026-0007',
        'f0000000-0000-0000-0000-100000000004',
        'overdue',
        current_date - interval '70 days', current_date - interval '40 days', null,
        9500.00, 0, 9500.00, 0, 'USD',
        'Wayne Legal — contract review.',
        'f0000000-0000-0000-0000-00000000000c',
        ARRAY['legal','overdue'],
        'In dispute — line items contested.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '70 days', current_timestamp - interval '5 days'
    ),
    -- Draft
    (
        'f0000000-0000-0000-0000-300000000008',
        'BILL-2026-0008',
        'f0000000-0000-0000-0000-100000000003',
        'draft',
        current_date - interval '1 day', current_date + interval '29 days', null,
        15200.00, 0, 15200.00, 0, 'USD',
        'Globex Cloud — May infra (preview).',
        'f0000000-0000-0000-0000-00000000000a',
        ARRAY['draft','infra'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '1 day', current_timestamp - interval '1 day'
    );


    ----------------------------------------------------------------
    -- Expenses
    ----------------------------------------------------------------

    INSERT INTO finance.expenses (id, expense_number, employee_name, employee_email, category, status, amount, currency, expense_date, description, merchant, payment_method, expense_account_id, reviewer_user_id, reviewed_at, response, reimbursed_at, tags, notes, user_id, created_at, updated_at) VALUES
    (
        'f0000000-0000-0000-0000-400000000001',
        'EXP-2026-0001',
        'Liam Carter', 'liam.carter@example.com',
        'travel', 'reimbursed',
        850.00, 'USD',
        current_date - interval '40 days', 'Conference flight to NYC.', 'United Airlines', 'credit_card',
        'f0000000-0000-0000-0000-00000000000b',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '38 days',
        'Approved.', current_timestamp - interval '30 days',
        ARRAY['travel','conference'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '30 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000002',
        'EXP-2026-0002',
        'Liam Carter', 'liam.carter@example.com',
        'lodging', 'reimbursed',
        1200.00, 'USD',
        current_date - interval '38 days', 'Hotel — 3 nights.', 'Marriott', 'credit_card',
        'f0000000-0000-0000-0000-00000000000b',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '36 days',
        'Approved.', current_timestamp - interval '30 days',
        ARRAY['travel','hotel'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '38 days', current_timestamp - interval '30 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000003',
        'EXP-2026-0003',
        'Sophia Martinez', 'sophia.martinez@example.com',
        'meals', 'approved',
        185.50, 'USD',
        current_date - interval '12 days', 'Customer dinner with Stark execs.', 'Le Bernardin', 'credit_card',
        'f0000000-0000-0000-0000-00000000000b',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '10 days',
        'Approved — pending reimbursement.', null,
        ARRAY['meals','customer'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '12 days', current_timestamp - interval '10 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000004',
        'EXP-2026-0004',
        'Mia Thompson', 'mia.thompson@example.com',
        'software', 'submitted',
        49.00, 'USD',
        current_date - interval '5 days', 'Figma plugin license.', 'Figma', 'credit_card',
        'f0000000-0000-0000-0000-00000000000a',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        null, null,
        ARRAY['software','design'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 days', current_timestamp - interval '5 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000005',
        'EXP-2026-0005',
        'Ava Singh', 'ava.singh@example.com',
        'training', 'submitted',
        599.00, 'USD',
        current_date - interval '12 days', 'Online course — distributed systems.', 'Educative', 'credit_card',
        'f0000000-0000-0000-0000-00000000000a',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', null,
        null, null,
        ARRAY['training'], 'Manager pre-approved verbally.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '12 days', current_timestamp - interval '12 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000006',
        'EXP-2026-0006',
        'Isabella Nguyen', 'isabella.nguyen@example.com',
        'marketing', 'rejected',
        2400.00, 'USD',
        current_date - interval '18 days', 'Booth materials for trade show.', 'PrintCo', 'credit_card',
        'f0000000-0000-0000-0000-00000000000c',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '15 days',
        'Rejected — exceeds approved trade show budget.', null,
        ARRAY['marketing','rejected'], 'Resubmit under FY budget once approved.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '18 days', current_timestamp - interval '15 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000007',
        'EXP-2026-0007',
        'Ethan Wright', 'ethan.wright@example.com',
        'meals', 'reimbursed',
        78.20, 'USD',
        current_date - interval '25 days', 'Team lunch — sprint kickoff.', 'Sweetgreen', 'cash',
        'f0000000-0000-0000-0000-00000000000b',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '23 days',
        'Approved.', current_timestamp - interval '18 days',
        ARRAY['meals','team'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '25 days', current_timestamp - interval '18 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000008',
        'EXP-2026-0008',
        'Olivia Bennett', 'olivia.bennett@example.com',
        'office', 'approved',
        320.00, 'USD',
        current_date - interval '7 days', 'Office whiteboards.', 'Staples', 'credit_card',
        'f0000000-0000-0000-0000-00000000000c',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', current_timestamp - interval '5 days',
        'Approved.', null,
        ARRAY['office'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '7 days', current_timestamp - interval '5 days'
    ),
    (
        'f0000000-0000-0000-0000-400000000009',
        'EXP-2026-0009',
        'Lucas Patel', 'lucas.patel@example.com',
        'travel', 'submitted',
        642.30, 'USD',
        current_date - interval '3 days', 'Train tickets — customer visit.', 'Amtrak', 'credit_card',
        'f0000000-0000-0000-0000-00000000000b',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', null,
        null, null,
        ARRAY['travel','customer'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '3 days', current_timestamp - interval '3 days'
    ),
    (
        'f0000000-0000-0000-0000-40000000000a',
        'EXP-2026-0010',
        'Aiden Brooks', 'aiden.brooks@example.com',
        'other', 'draft',
        45.00, 'USD',
        current_date - interval '1 day', 'Coworking day pass.', 'WeWork', 'credit_card',
        'f0000000-0000-0000-0000-00000000000c',
        null, null,
        null, null,
        ARRAY['draft'], 'Will submit once receipt arrives.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '1 day', current_timestamp - interval '1 day'
    );


    ----------------------------------------------------------------
    -- Payments
    ----------------------------------------------------------------

    INSERT INTO finance.payments (id, payment_number, direction, status, method, amount, currency, payment_date, reference_number, party_name, party_email, invoice_id, bill_id, account_id, description, tags, notes, user_id, created_at, updated_at) VALUES
    -- Incoming (against paid invoices)
    (
        'f0000000-0000-0000-0000-500000000001',
        'PAY-2026-0001', 'incoming', 'completed', 'wire',
        21800.00, 'USD', current_date - interval '55 days', 'WIRE-ACME-001',
        'Acme Corporation', 'ap@acme.example.com',
        'f0000000-0000-0000-0000-200000000001', null,
        'f0000000-0000-0000-0000-000000000001',
        'Acme Q1 platform payment.',
        ARRAY['ar'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '55 days', current_timestamp - interval '55 days'
    ),
    (
        'f0000000-0000-0000-0000-500000000002',
        'PAY-2026-0002', 'incoming', 'completed', 'ach',
        13080.00, 'USD', current_date - interval '38 days', 'ACH-INI-002',
        'Initech Software', 'finance@initech.example.com',
        'f0000000-0000-0000-0000-200000000002', null,
        'f0000000-0000-0000-0000-000000000001',
        'Initech analytics add-on payment.',
        ARRAY['ar'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '38 days', current_timestamp - interval '38 days'
    ),
    (
        'f0000000-0000-0000-0000-500000000003',
        'PAY-2026-0003', 'incoming', 'completed', 'wire',
        87200.00, 'USD', current_date - interval '15 days', 'WIRE-STARK-003',
        'Stark Industries', 'ap@stark.example.com',
        'f0000000-0000-0000-0000-200000000003', null,
        'f0000000-0000-0000-0000-000000000001',
        'Stark enterprise tranche 1.',
        ARRAY['ar','enterprise'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '15 days'
    ),
    (
        'f0000000-0000-0000-0000-500000000004',
        'PAY-2026-0004', 'incoming', 'pending', 'check',
        4900.00, 'USD', current_date - interval '2 days', 'CHK-1029',
        'Globex Industries', 'billing@globex.example.com',
        'f0000000-0000-0000-0000-200000000004', null,
        'f0000000-0000-0000-0000-000000000001',
        'Partial Globex payment received — pending clearance.',
        ARRAY['ar','partial'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 days', current_timestamp - interval '2 days'
    ),
    -- Outgoing (against paid bills)
    (
        'f0000000-0000-0000-0000-500000000005',
        'PAY-2026-0005', 'outgoing', 'completed', 'ach',
        12500.00, 'USD', current_date - interval '32 days', 'ACH-GLB-001',
        'Globex Cloud', 'ar@globex.example.com',
        null, 'f0000000-0000-0000-0000-300000000001',
        'f0000000-0000-0000-0000-000000000001',
        'Globex March infra payment.',
        ARRAY['ap','infra'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '32 days', current_timestamp - interval '32 days'
    ),
    (
        'f0000000-0000-0000-0000-500000000006',
        'PAY-2026-0006', 'outgoing', 'completed', 'ach',
        8500.00, 'USD', current_date - interval '21 days', 'ACH-CYB-001',
        'Cyberdyne Systems', 'accounts@cyberdyne.example.com',
        null, 'f0000000-0000-0000-0000-300000000002',
        'f0000000-0000-0000-0000-000000000001',
        'Cyberdyne inference compute.',
        ARRAY['ap','infra'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '21 days', current_timestamp - interval '21 days'
    ),
    (
        'f0000000-0000-0000-0000-500000000007',
        'PAY-2026-0007', 'outgoing', 'completed', 'wire',
        6200.00, 'USD', current_date - interval '4 days', 'WIRE-WAYNE-001',
        'Wayne Legal', 'ar@wayne-legal.example.com',
        null, 'f0000000-0000-0000-0000-300000000003',
        'f0000000-0000-0000-0000-000000000001',
        'Wayne legal retainer.',
        ARRAY['ap','legal'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '4 days', current_timestamp - interval '4 days'
    ),
    -- Outgoing for expense reimbursements
    (
        'f0000000-0000-0000-0000-500000000008',
        'PAY-2026-0008', 'outgoing', 'completed', 'ach',
        2050.00, 'USD', current_date - interval '30 days', 'REIMB-LCARTER-001',
        'Liam Carter', 'liam.carter@example.com',
        null, null,
        'f0000000-0000-0000-0000-000000000001',
        'Reimbursement — travel expenses.',
        ARRAY['reimbursement'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '30 days'
    ),
    -- Failed payment
    (
        'f0000000-0000-0000-0000-500000000009',
        'PAY-2026-0009', 'incoming', 'failed', 'credit_card',
        2725.00, 'USD', current_date - interval '20 days', 'CC-LISA-001',
        'Lisa Anderson Startup', 'lisa.anderson@example.com',
        'f0000000-0000-0000-0000-20000000000a', null,
        'f0000000-0000-0000-0000-000000000001',
        'Customer card declined.',
        ARRAY['ar','failed'], 'Invoice cancelled afterwards.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '12 days'
    ),
    -- Refunded
    (
        'f0000000-0000-0000-0000-50000000000a',
        'PAY-2026-0010', 'outgoing', 'refunded', 'credit_card',
        300.00, 'USD', current_date - interval '50 days', 'REF-CC-001',
        'Initech Office Supplies', 'billing@initech-office.example.com',
        null, null,
        'f0000000-0000-0000-0000-000000000001',
        'Refund issued for damaged supplies.',
        ARRAY['refund'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '50 days', current_timestamp - interval '48 days'
    );


    ----------------------------------------------------------------
    -- Budgets
    ----------------------------------------------------------------

    INSERT INTO finance.budgets (id, name, period, period_start, period_end, department, account_id, amount, spent, currency, description, color, tags, notes, user_id, created_at, updated_at) VALUES
    (
        'f0000000-0000-0000-0000-600000000001',
        'Engineering Software FY26', 'annual',
        date_trunc('year', current_date)::date, (date_trunc('year', current_date) + interval '1 year - 1 day')::date,
        'Engineering', 'f0000000-0000-0000-0000-00000000000a',
        50000.00, 38000.00, 'USD',
        'Annual SaaS tooling budget for Engineering.',
        '#3b82f6', ARRAY['engineering','software'],
        'Tracking close to ceiling.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '120 days', current_timestamp - interval '7 days'
    ),
    (
        'f0000000-0000-0000-0000-600000000002',
        'Marketing Q2', 'quarterly',
        (date_trunc('quarter', current_date))::date, (date_trunc('quarter', current_date) + interval '3 months - 1 day')::date,
        'Marketing', 'f0000000-0000-0000-0000-00000000000c',
        45000.00, 18500.00, 'USD',
        'Quarterly demand gen and field events.',
        '#f97316', ARRAY['marketing','q2'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '40 days', current_timestamp - interval '4 days'
    ),
    (
        'f0000000-0000-0000-0000-600000000003',
        'Sales Travel — May', 'monthly',
        date_trunc('month', current_date)::date, (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
        'Sales', 'f0000000-0000-0000-0000-00000000000b',
        12000.00, 5400.00, 'USD',
        'Monthly travel allowance for AEs.',
        '#22c55e', ARRAY['sales','travel'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '4 days', current_timestamp - interval '1 day'
    ),
    (
        'f0000000-0000-0000-0000-600000000004',
        'Office & Facilities FY26', 'annual',
        date_trunc('year', current_date)::date, (date_trunc('year', current_date) + interval '1 year - 1 day')::date,
        'Operations', 'f0000000-0000-0000-0000-00000000000c',
        80000.00, 64000.00, 'USD',
        'Office rent and supplies for the year.',
        '#fdba74', ARRAY['office','facilities'],
        'Spend on track.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '150 days', current_timestamp - interval '15 days'
    ),
    (
        'f0000000-0000-0000-0000-600000000005',
        'People Programs Q2', 'quarterly',
        (date_trunc('quarter', current_date))::date, (date_trunc('quarter', current_date) + interval '3 months - 1 day')::date,
        'People Operations', 'f0000000-0000-0000-0000-00000000000c',
        18000.00, 6200.00, 'USD',
        'Team offsites, learning stipends, culture programs.',
        '#ec4899', ARRAY['people','programs'],
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '6 days'
    );


    ----------------------------------------------------------------
    -- Payroll runs
    ----------------------------------------------------------------

    INSERT INTO finance.payroll_runs (id, run_number, period_start, period_end, pay_date, status, total_gross, total_deductions, total_tax, total_net, currency, employee_count, description, tags, notes, user_id, created_at, updated_at) VALUES
    -- Past completed run
    (
        'f0000000-0000-0000-0000-700000000001',
        'PR-2026-03',
        (date_trunc('month', current_date) - interval '2 months')::date,
        (date_trunc('month', current_date) - interval '1 month - 1 day')::date,
        (date_trunc('month', current_date) - interval '1 month + 4 days')::date,
        'completed',
        148000.00, 22500.00, 35200.00, 90300.00, 'USD',
        12,
        'March 2026 payroll run.',
        ARRAY['monthly','completed'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '50 days'
    ),
    -- Most recent completed
    (
        'f0000000-0000-0000-0000-700000000002',
        'PR-2026-04',
        (date_trunc('month', current_date) - interval '1 month')::date,
        (date_trunc('month', current_date) - interval '1 day')::date,
        (date_trunc('month', current_date) + interval '4 days')::date,
        'completed',
        152400.00, 23200.00, 36400.00, 92800.00, 'USD',
        12,
        'April 2026 payroll run.',
        ARRAY['monthly','completed'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    -- Processing (current cycle)
    (
        'f0000000-0000-0000-0000-700000000003',
        'PR-2026-05',
        date_trunc('month', current_date)::date,
        (date_trunc('month', current_date) + interval '1 month - 1 day')::date,
        (date_trunc('month', current_date) + interval '1 month + 4 days')::date,
        'processing',
        154800.00, 23600.00, 36900.00, 94300.00, 'USD',
        12,
        'May 2026 payroll run — in progress.',
        ARRAY['monthly','processing'], 'Reviewing time-off adjustments.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 days', current_timestamp - interval '1 day'
    );


    ----------------------------------------------------------------
    -- Payslips (most recent completed run, sample subset)
    ----------------------------------------------------------------

    INSERT INTO finance.payslips (id, payslip_number, run_id, employee_name, employee_email, employee_user_id, status, currency,
        base_salary, bonuses, overtime, gross_salary,
        tax_withheld, social_security, health_insurance, retirement, other_deductions,
        net_salary, hours_worked, payment_method, paid_at, notes, user_id, created_at, updated_at) VALUES
    (
        'f0000000-0000-0000-0000-800000000001',
        'PS-2026-04-001',
        'f0000000-0000-0000-0000-700000000002',
        'Olivia Bennett', 'olivia.bennett@example.com', null,
        'paid', 'USD',
        13333.00, 0, 0, 13333.00,
        3000.00, 800.00, 250.00, 666.65, 0,
        8616.35, 168, 'bank_transfer',
        (date_trunc('month', current_date) + interval '4 days'),
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    (
        'f0000000-0000-0000-0000-800000000002',
        'PS-2026-04-002',
        'f0000000-0000-0000-0000-700000000002',
        'Liam Carter', 'liam.carter@example.com', null,
        'paid', 'USD',
        17083.00, 2000.00, 0, 19083.00,
        4500.00, 1100.00, 250.00, 954.15, 0,
        12278.85, 168, 'bank_transfer',
        (date_trunc('month', current_date) + interval '4 days'),
        'Spot bonus for platform launch.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    (
        'f0000000-0000-0000-0000-800000000003',
        'PS-2026-04-003',
        'f0000000-0000-0000-0000-700000000002',
        'Ava Singh', 'ava.singh@example.com', null,
        'paid', 'USD',
        15000.00, 0, 450.00, 15450.00,
        3500.00, 950.00, 250.00, 750.00, 0,
        10000.00, 172, 'bank_transfer',
        (date_trunc('month', current_date) + interval '4 days'),
        '4 hours overtime.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    (
        'f0000000-0000-0000-0000-800000000004',
        'PS-2026-04-004',
        'f0000000-0000-0000-0000-700000000002',
        'Mia Thompson', 'mia.thompson@example.com', null,
        'paid', 'USD',
        11666.00, 0, 0, 11666.00,
        2700.00, 750.00, 250.00, 583.30, 0,
        7382.70, 168, 'bank_transfer',
        (date_trunc('month', current_date) + interval '4 days'),
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    (
        'f0000000-0000-0000-0000-800000000005',
        'PS-2026-04-005',
        'f0000000-0000-0000-0000-700000000002',
        'Ethan Wright', 'ethan.wright@example.com', null,
        'paid', 'USD',
        13333.00, 1500.00, 0, 14833.00,
        3300.00, 850.00, 250.00, 666.65, 0,
        9766.35, 168, 'bank_transfer',
        (date_trunc('month', current_date) + interval '4 days'),
        'Quarterly bonus.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    (
        'f0000000-0000-0000-0000-800000000006',
        'PS-2026-04-006',
        'f0000000-0000-0000-0000-700000000002',
        'Sophia Martinez', 'sophia.martinez@example.com', null,
        'paid', 'USD',
        12500.00, 4000.00, 0, 16500.00,
        3700.00, 950.00, 250.00, 625.00, 0,
        10975.00, 168, 'bank_transfer',
        (date_trunc('month', current_date) + interval '4 days'),
        'Sales commission for Q1 close.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),
    -- Current cycle (issued, not yet paid)
    (
        'f0000000-0000-0000-0000-800000000007',
        'PS-2026-05-001',
        'f0000000-0000-0000-0000-700000000003',
        'Olivia Bennett', 'olivia.bennett@example.com', null,
        'issued', 'USD',
        13333.00, 0, 0, 13333.00,
        3000.00, 800.00, 250.00, 666.65, 0,
        8616.35, 168, 'bank_transfer',
        null,
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 days', current_timestamp - interval '1 day'
    ),
    (
        'f0000000-0000-0000-0000-800000000008',
        'PS-2026-05-002',
        'f0000000-0000-0000-0000-700000000003',
        'Aiden Brooks', 'aiden.brooks@example.com', null,
        'pending', 'USD',
        6000.00, 0, 0, 6000.00,
        1100.00, 372.00, 0, 0, 0,
        4528.00, 160, 'bank_transfer',
        null,
        'Intern — partial month.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 days', current_timestamp - interval '1 day'
    );


    ----------------------------------------------------------------
    -- Journal entries (general ledger)
    ----------------------------------------------------------------

    INSERT INTO finance.journal_entries (id, entry_number, entry_date, status, debit_account_id, credit_account_id, amount, currency, description, reference_type, reference_id, tags, notes, user_id, created_at, updated_at) VALUES
    -- Acme paid: Cash dr / Revenue cr
    (
        'f0000000-0000-0000-0000-900000000001',
        'JE-2026-0001', current_date - interval '55 days', 'posted',
        'f0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000007',
        21800.00, 'USD',
        'Acme Q1 platform — cash receipt.',
        'invoice', 'f0000000-0000-0000-0000-200000000001',
        ARRAY['ar','revenue'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '55 days', current_timestamp - interval '55 days'
    ),
    -- Initech paid
    (
        'f0000000-0000-0000-0000-900000000002',
        'JE-2026-0002', current_date - interval '38 days', 'posted',
        'f0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000007',
        13080.00, 'USD',
        'Initech analytics add-on — cash receipt.',
        'invoice', 'f0000000-0000-0000-0000-200000000002',
        ARRAY['ar','revenue'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '38 days', current_timestamp - interval '38 days'
    ),
    -- Stark paid
    (
        'f0000000-0000-0000-0000-900000000003',
        'JE-2026-0003', current_date - interval '15 days', 'posted',
        'f0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000007',
        87200.00, 'USD',
        'Stark enterprise tranche 1 — cash receipt.',
        'invoice', 'f0000000-0000-0000-0000-200000000003',
        ARRAY['ar','revenue','enterprise'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '15 days'
    ),
    -- Globex bill paid: Software Subscriptions dr / Cash cr
    (
        'f0000000-0000-0000-0000-900000000004',
        'JE-2026-0004', current_date - interval '32 days', 'posted',
        'f0000000-0000-0000-0000-00000000000a', 'f0000000-0000-0000-0000-000000000001',
        12500.00, 'USD',
        'Globex March infra — paid.',
        'bill', 'f0000000-0000-0000-0000-300000000001',
        ARRAY['ap','infra'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '32 days', current_timestamp - interval '32 days'
    ),
    -- Cyberdyne bill paid
    (
        'f0000000-0000-0000-0000-900000000005',
        'JE-2026-0005', current_date - interval '21 days', 'posted',
        'f0000000-0000-0000-0000-00000000000a', 'f0000000-0000-0000-0000-000000000001',
        8500.00, 'USD',
        'Cyberdyne inference compute — paid.',
        'bill', 'f0000000-0000-0000-0000-300000000002',
        ARRAY['ap','infra'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '21 days', current_timestamp - interval '21 days'
    ),
    -- April payroll: Salaries & Wages dr / Cash cr
    (
        'f0000000-0000-0000-0000-900000000006',
        'JE-2026-0006', (date_trunc('month', current_date) + interval '4 days')::date, 'posted',
        'f0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000001',
        92800.00, 'USD',
        'April 2026 payroll — net cash out.',
        'payroll_run', 'f0000000-0000-0000-0000-700000000002',
        ARRAY['payroll'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '20 days'
    ),
    -- April payroll withholding: Salaries dr / Payroll Liabilities cr
    (
        'f0000000-0000-0000-0000-900000000007',
        'JE-2026-0007', (date_trunc('month', current_date) + interval '4 days')::date, 'posted',
        'f0000000-0000-0000-0000-000000000009', 'f0000000-0000-0000-0000-000000000005',
        59600.00, 'USD',
        'April 2026 payroll — taxes and benefits withheld.',
        'payroll_run', 'f0000000-0000-0000-0000-700000000002',
        ARRAY['payroll','withholding'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '20 days'
    ),
    -- Travel reimbursement: Travel & Ent dr / Cash cr
    (
        'f0000000-0000-0000-0000-900000000008',
        'JE-2026-0008', current_date - interval '30 days', 'posted',
        'f0000000-0000-0000-0000-00000000000b', 'f0000000-0000-0000-0000-000000000001',
        2050.00, 'USD',
        'Liam Carter travel reimbursement.',
        'expense', 'f0000000-0000-0000-0000-400000000001',
        ARRAY['expense','reimbursement'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '30 days'
    ),
    -- Draft (not yet posted)
    (
        'f0000000-0000-0000-0000-900000000009',
        'JE-2026-0009', current_date - interval '2 days', 'draft',
        'f0000000-0000-0000-0000-00000000000c', 'f0000000-0000-0000-0000-000000000004',
        320.00, 'USD',
        'Office whiteboards — bill accrual.',
        'expense', 'f0000000-0000-0000-0000-400000000008',
        ARRAY['accrual','draft'], null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 days', current_timestamp - interval '2 days'
    ),
    -- Reversed entry
    (
        'f0000000-0000-0000-0000-90000000000a',
        'JE-2026-0010', current_date - interval '48 days', 'reversed',
        'f0000000-0000-0000-0000-00000000000c', 'f0000000-0000-0000-0000-000000000001',
        300.00, 'USD',
        'Initech office supplies — reversed after refund.',
        'payment', 'f0000000-0000-0000-0000-50000000000a',
        ARRAY['reversed'], 'Reversed when refund cleared.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '50 days', current_timestamp - interval '48 days'
    );
