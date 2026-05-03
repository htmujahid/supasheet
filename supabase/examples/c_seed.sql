
    -- CRM Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)

    ----------------------------------------------------------------
    -- Companies
    ----------------------------------------------------------------

    INSERT INTO crm.companies (id, name, legal_name, type, industry, website, phone, email, description, address, city, country, employee_count, annual_revenue, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- User 1 companies
    (
        'c0000000-0000-0000-0000-000000000001',
        'Acme Corporation',
        'Acme Corporation Inc.',
        'customer',
        'Technology',
        'https://acme.example.com',
        '+1-415-555-0100',
        'sales@acme.example.com',
        'Long-running enterprise customer on the platform team package.',
        '500 Market Street',
        'San Francisco',
        'United States',
        1200,
        85000000.00,
        ARRAY['enterprise', 'tier-1', 'tech'],
        '#3b82f6',
        'Renewal cycle Q1. Watch for procurement turnover.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '180 days',
        current_timestamp - interval '4 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'Globex Industries',
        'Globex Industries LLC',
        'prospect',
        'Manufacturing',
        'https://globex.example.com',
        '+1-312-555-0142',
        'hello@globex.example.com',
        'Mid-market prospect evaluating us against a legacy vendor.',
        '88 Industrial Way',
        'Chicago',
        'United States',
        450,
        18500000.00,
        ARRAY['mid-market', 'manufacturing', 'evaluation'],
        '#10b981',
        'Decision expected in 6 weeks.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days',
        current_timestamp - interval '2 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000003',
        'Initech Software',
        'Initech Software Co.',
        'customer',
        'Technology',
        'https://initech.example.com',
        '+1-512-555-0118',
        'support@initech.example.com',
        'Long-term SaaS customer with multi-product footprint.',
        '4120 Tech Boulevard',
        'Austin',
        'United States',
        320,
        12000000.00,
        ARRAY['saas', 'expansion', 'tech'],
        '#8b5cf6',
        'Add-on opportunity for analytics tier.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '420 days',
        current_timestamp - interval '14 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000004',
        'Wayne Enterprises',
        'Wayne Enterprises Holdings',
        'partner',
        'Conglomerate',
        'https://wayne.example.com',
        '+1-201-555-0199',
        'partners@wayne.example.com',
        'Strategic technology partner with co-marketing arrangement.',
        '1007 Mountain Drive',
        'Gotham',
        'United States',
        15000,
        2400000000.00,
        ARRAY['strategic', 'partner', 'enterprise'],
        '#0ea5e9',
        'Quarterly business review next month.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '600 days',
        current_timestamp - interval '20 days'
    ),
    -- User 2 companies
    (
        'c0000000-0000-0000-0000-000000000005',
        'Stark Industries',
        'Stark Industries Worldwide',
        'customer',
        'Defense',
        'https://stark.example.com',
        '+1-212-555-0173',
        'enterprise@stark.example.com',
        'Top-tier customer on the platform plus services tier.',
        '10880 Malibu Point',
        'New York',
        'United States',
        9500,
        1800000000.00,
        ARRAY['enterprise', 'tier-1', 'defense'],
        '#ef4444',
        'Executive sponsor change in progress.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '300 days',
        current_timestamp - interval '6 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000006',
        'Umbrella Corporation',
        'Umbrella Corp.',
        'prospect',
        'Pharmaceuticals',
        'https://umbrella.example.com',
        '+1-415-555-0188',
        'info@umbrella.example.com',
        'Late-stage prospect with active proof of value running.',
        '200 Research Park',
        'Raccoon City',
        'United States',
        2800,
        540000000.00,
        ARRAY['prospect', 'pharma', 'pov'],
        '#f97316',
        'Security review pending.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '90 days',
        current_timestamp - interval '3 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000007',
        'Cyberdyne Systems',
        'Cyberdyne Systems Corp.',
        'vendor',
        'Technology',
        'https://cyberdyne.example.com',
        '+1-408-555-0167',
        'accounts@cyberdyne.example.com',
        'Infrastructure vendor for the inference platform.',
        '18144 El Camino Real',
        'Sunnyvale',
        'United States',
        650,
        78000000.00,
        ARRAY['vendor', 'infra', 'tech'],
        '#a855f7',
        'Annual contract renews in 60 days.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '730 days',
        current_timestamp - interval '30 days'
    ),
    (
        'c0000000-0000-0000-0000-000000000008',
        'Soylent Foods',
        'Soylent Foods Holdings',
        'partner',
        'Food & Beverage',
        'https://soylent.example.com',
        '+1-617-555-0156',
        'partners@soylent.example.com',
        'Distribution partner for retail-channel offerings.',
        '77 Beacon Street',
        'Boston',
        'United States',
        780,
        125000000.00,
        ARRAY['partner', 'distribution', 'retail'],
        '#22c55e',
        'JBP being negotiated.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '210 days',
        current_timestamp - interval '12 days'
    );


    ----------------------------------------------------------------
    -- Contacts
    ----------------------------------------------------------------

    INSERT INTO crm.contacts (id, first_name, last_name, email, phone, mobile, job_title, department, status, lead_source, bio, linkedin_url, twitter_url, tags, notes, user_id, created_at, updated_at) VALUES
    -- User 1 contacts
    (
        'c0000000-0000-0000-0000-100000000001',
        'John', 'Smith',
        'john.smith@acme.example.com', '+1-415-555-0101', '+1-415-555-2101',
        'VP Engineering', 'Engineering', 'customer', 'inbound',
        'Long-time advocate, drove the original adoption.',
        'https://www.linkedin.com/in/john-smith-acme', null,
        ARRAY['champion', 'eng'], 'Always happy to take a call.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '170 days', current_timestamp - interval '4 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000002',
        'Sarah', 'Johnson',
        'sarah.johnson@globex.example.com', '+1-312-555-0142', '+1-312-555-2142',
        'Director of Operations', 'Operations', 'prospect', 'referral',
        'Coming from a competitor, knows the space well.',
        'https://www.linkedin.com/in/sarah-johnson-globex', null,
        ARRAY['evaluator', 'ops'], 'Decision-maker on procurement track.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '55 days', current_timestamp - interval '2 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000003',
        'Michael', 'Brown',
        'michael.brown@initech.example.com', '+1-512-555-0119', '+1-512-555-2119',
        'CTO', 'Technology', 'customer', 'inbound',
        'Technical sponsor for the analytics expansion.',
        'https://www.linkedin.com/in/michael-brown-initech', 'https://x.com/mbrown_initech',
        ARRAY['cto', 'expansion'], 'Wants quarterly roadmap reviews.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '410 days', current_timestamp - interval '14 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000004',
        'Emily', 'Davis',
        'emily.davis@globex.example.com', '+1-312-555-0143', null,
        'Procurement Manager', 'Procurement', 'lead', 'event',
        'Met at the Manufacturing Expo, qualifying interest.',
        'https://www.linkedin.com/in/emily-davis-globex', null,
        ARRAY['procurement', 'event-lead'], 'Send an updated quote next week.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '5 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000005',
        'James', 'Wilson',
        'james.wilson@wayne.example.com', '+1-201-555-0144', '+1-201-555-2144',
        'Head of Strategic Partnerships', 'Partnerships', 'customer', 'referral',
        'Primary contact for the Wayne partnership.',
        'https://www.linkedin.com/in/james-wilson-wayne', null,
        ARRAY['partner', 'exec'], 'Joint marketing planning ongoing.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '500 days', current_timestamp - interval '20 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000006',
        'Lisa', 'Anderson',
        'lisa.anderson@example.com', '+1-415-555-0145', '+1-415-555-2145',
        'Founder', 'Executive', 'prospect', 'cold_outreach',
        'Founder/CEO of a fast-growing startup, evaluating SaaS stack.',
        'https://www.linkedin.com/in/lisa-anderson', 'https://x.com/lisa_anderson',
        ARRAY['startup', 'founder'], 'Self-serve trial in progress.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '25 days', current_timestamp - interval '1 day'
    ),
    (
        'c0000000-0000-0000-0000-100000000007',
        'David', 'Martinez',
        'david.martinez@acme.example.com', '+1-415-555-0146', null,
        'Engineering Manager', 'Engineering', 'customer', 'inbound',
        'Day-to-day technical owner at Acme.',
        'https://www.linkedin.com/in/david-martinez-acme', null,
        ARRAY['eng', 'daily-driver'], 'Files most support tickets.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '120 days', current_timestamp - interval '7 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000008',
        'Jennifer', 'Taylor',
        'jennifer.taylor@example.com', '+1-415-555-0147', '+1-415-555-2147',
        'Marketing Lead', 'Marketing', 'lead', 'website',
        'Inbound lead from the pricing page.',
        'https://www.linkedin.com/in/jennifer-taylor', null,
        ARRAY['inbound', 'marketing'], 'Send the SMB pricing one-pager.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '12 days', current_timestamp - interval '12 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000009',
        'Robert', 'Thomas',
        'robert.thomas@initech.example.com', '+1-512-555-0148', null,
        'VP Customer Success', 'Customer Success', 'customer', 'referral',
        'CS leader at Initech who drives adoption.',
        'https://www.linkedin.com/in/robert-thomas-initech', null,
        ARRAY['cs', 'customer'], 'Quarterly health review scheduled.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '380 days', current_timestamp - interval '11 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000010',
        'Patricia', 'Hernandez',
        'patricia.hernandez@example.com', null, null,
        'Independent Advisor', 'External', 'inactive', 'other',
        'Former champion who left her role; staying in touch.',
        'https://www.linkedin.com/in/patricia-hernandez', null,
        ARRAY['advisor', 'alumni'], 'Re-engage when she lands somewhere new.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '700 days', current_timestamp - interval '90 days'
    ),
    -- User 2 contacts
    (
        'c0000000-0000-0000-0000-100000000011',
        'Christopher', 'Moore',
        'chris.moore@example.com', '+1-212-555-0150', '+1-212-555-2150',
        'CISO', 'Security', 'lead', 'website',
        'Security-conscious lead from a webinar signup.',
        'https://www.linkedin.com/in/chris-moore', null,
        ARRAY['security', 'inbound'], 'Wants to see SOC 2 documentation.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 days', current_timestamp - interval '20 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000012',
        'Jessica', 'Jackson',
        'jessica.jackson@umbrella.example.com', '+1-415-555-0151', '+1-415-555-2151',
        'VP Research', 'R&D', 'prospect', 'event',
        'Met at BIO Conference, owns the POV decision.',
        'https://www.linkedin.com/in/jessica-jackson-umbrella', null,
        ARRAY['research', 'pov-driver'], 'POV is in week 3.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '85 days', current_timestamp - interval '3 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000013',
        'Daniel', 'White',
        'daniel.white@stark.example.com', '+1-212-555-0152', null,
        'Director of Platform', 'Engineering', 'customer', 'inbound',
        'Day-to-day platform owner at Stark.',
        'https://www.linkedin.com/in/daniel-white-stark', null,
        ARRAY['platform', 'tech'], 'Backups for John Smith on call rotation.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '290 days', current_timestamp - interval '6 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000014',
        'Ashley', 'Harris',
        'ashley.harris@example.com', '+1-617-555-0153', null,
        'Operations Lead', 'Operations', 'lead', 'cold_outreach',
        'Ops leader at a target account, replied to outbound sequence.',
        'https://www.linkedin.com/in/ashley-harris', null,
        ARRAY['outbound', 'ops'], 'Opening discovery next week.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '2 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000015',
        'Matthew', 'Lewis',
        'matt.lewis@stark.example.com', '+1-212-555-0154', '+1-212-555-2154',
        'Head of Procurement', 'Procurement', 'customer', 'referral',
        'Owns the renewal paperwork at Stark.',
        'https://www.linkedin.com/in/matt-lewis-stark', null,
        ARRAY['procurement', 'renewal'], 'Wants 3-year discount terms next cycle.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '270 days', current_timestamp - interval '8 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000016',
        'Amanda', 'Walker',
        'amanda.walker@umbrella.example.com', '+1-415-555-0155', null,
        'Procurement Director', 'Procurement', 'prospect', 'website',
        'Procurement contact for the Umbrella deal.',
        'https://www.linkedin.com/in/amanda-walker-umbrella', null,
        ARRAY['procurement', 'pharma'], 'Asked for redlines on MSA.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '70 days', current_timestamp - interval '4 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000017',
        'Joshua', 'Hall',
        'josh.hall@example.com', '+1-617-555-0157', '+1-617-555-2157',
        'Solutions Architect', 'Engineering', 'lead', 'event',
        'Met at AWS re:Invent.',
        'https://www.linkedin.com/in/josh-hall', null,
        ARRAY['arch', 'event-lead'], 'Wants a technical deep-dive.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '35 days', current_timestamp - interval '6 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000018',
        'Megan', 'Allen',
        'megan.allen@soylent.example.com', '+1-617-555-0158', null,
        'Director of Channel', 'Sales', 'customer', 'referral',
        'Channel program lead at Soylent.',
        'https://www.linkedin.com/in/megan-allen-soylent', null,
        ARRAY['channel', 'partner'], 'JBP cadence is monthly.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '180 days', current_timestamp - interval '10 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000019',
        'Andrew', 'Young',
        'andrew.young@cyberdyne.example.com', '+1-408-555-0159', null,
        'Account Executive', 'Sales', 'prospect', 'inbound',
        'Vendor-side AE for our Cyberdyne contract.',
        'https://www.linkedin.com/in/andrew-young-cyberdyne', null,
        ARRAY['vendor', 'sales'], 'Quarterly check-in calls.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '700 days', current_timestamp - interval '30 days'
    ),
    (
        'c0000000-0000-0000-0000-100000000020',
        'Rebecca', 'King',
        'rebecca.king@example.com', null, null,
        'Former CFO', 'External', 'inactive', 'other',
        'Past contact who has since left her company.',
        'https://www.linkedin.com/in/rebecca-king', null,
        ARRAY['alumni'], 'Maintain warm relationship for future moves.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '500 days', current_timestamp - interval '120 days'
    );


    ----------------------------------------------------------------
    -- Contact ↔ Company links (primary employer + a few secondary)
    ----------------------------------------------------------------

    INSERT INTO crm.contact_companies (contact_id, company_id, role, is_primary, start_date, created_at) VALUES
    -- Primary employers (User 1)
    ('c0000000-0000-0000-0000-100000000001', 'c0000000-0000-0000-0000-000000000001', 'VP Engineering', true, current_date - interval '5 years', current_timestamp - interval '170 days'),
    ('c0000000-0000-0000-0000-100000000002', 'c0000000-0000-0000-0000-000000000002', 'Director of Operations', true, current_date - interval '3 years', current_timestamp - interval '55 days'),
    ('c0000000-0000-0000-0000-100000000003', 'c0000000-0000-0000-0000-000000000003', 'CTO', true, current_date - interval '4 years', current_timestamp - interval '410 days'),
    ('c0000000-0000-0000-0000-100000000004', 'c0000000-0000-0000-0000-000000000002', 'Procurement Manager', true, current_date - interval '2 years', current_timestamp - interval '40 days'),
    ('c0000000-0000-0000-0000-100000000005', 'c0000000-0000-0000-0000-000000000004', 'Head of Strategic Partnerships', true, current_date - interval '6 years', current_timestamp - interval '500 days'),
    ('c0000000-0000-0000-0000-100000000006', 'c0000000-0000-0000-0000-000000000002', 'Founder/CEO Advisor', false, current_date - interval '1 year', current_timestamp - interval '25 days'),
    ('c0000000-0000-0000-0000-100000000007', 'c0000000-0000-0000-0000-000000000001', 'Engineering Manager', true, current_date - interval '4 years', current_timestamp - interval '120 days'),
    ('c0000000-0000-0000-0000-100000000009', 'c0000000-0000-0000-0000-000000000003', 'VP Customer Success', true, current_date - interval '5 years', current_timestamp - interval '380 days'),

    -- Primary employers (User 2)
    ('c0000000-0000-0000-0000-100000000012', 'c0000000-0000-0000-0000-000000000006', 'VP Research', true, current_date - interval '4 years', current_timestamp - interval '85 days'),
    ('c0000000-0000-0000-0000-100000000013', 'c0000000-0000-0000-0000-000000000005', 'Director of Platform', true, current_date - interval '3 years', current_timestamp - interval '290 days'),
    ('c0000000-0000-0000-0000-100000000015', 'c0000000-0000-0000-0000-000000000005', 'Head of Procurement', true, current_date - interval '2 years', current_timestamp - interval '270 days'),
    ('c0000000-0000-0000-0000-100000000016', 'c0000000-0000-0000-0000-000000000006', 'Procurement Director', true, current_date - interval '3 years', current_timestamp - interval '70 days'),
    ('c0000000-0000-0000-0000-100000000018', 'c0000000-0000-0000-0000-000000000008', 'Director of Channel', true, current_date - interval '6 years', current_timestamp - interval '180 days'),
    ('c0000000-0000-0000-0000-100000000019', 'c0000000-0000-0000-0000-000000000007', 'Account Executive', true, current_date - interval '4 years', current_timestamp - interval '700 days'),

    -- Secondary employments (advisors / board / dual roles)
    ('c0000000-0000-0000-0000-100000000003', 'c0000000-0000-0000-0000-000000000001', 'Technical Advisor', false, current_date - interval '1 year', current_timestamp - interval '120 days'),
    ('c0000000-0000-0000-0000-100000000005', 'c0000000-0000-0000-0000-000000000003', 'Board Observer', false, current_date - interval '2 years', current_timestamp - interval '300 days'),
    ('c0000000-0000-0000-0000-100000000010', 'c0000000-0000-0000-0000-000000000004', 'Past Employee', false, current_date - interval '7 years', current_timestamp - interval '700 days'),
    ('c0000000-0000-0000-0000-100000000013', 'c0000000-0000-0000-0000-000000000007', 'Technical Advisor', false, current_date - interval '6 months', current_timestamp - interval '90 days'),
    ('c0000000-0000-0000-0000-100000000018', 'c0000000-0000-0000-0000-000000000005', 'Strategic Advisor', false, current_date - interval '1 year', current_timestamp - interval '150 days');


    ----------------------------------------------------------------
    -- Deals
    ----------------------------------------------------------------

    INSERT INTO crm.deals (id, title, description, stage, priority, value, currency, probability, expected_close_date, closed_at, company_id, primary_contact_id, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- User 1 deals
    (
        'c0000000-0000-0000-0000-200000000001',
        'Acme - Platform Renewal 2026',
        'Annual renewal plus 20% expansion on the platform tier.',
        'negotiation', 'high', 240000.00, 'USD', 75,
        current_timestamp + interval '21 days', null,
        'c0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-100000000001',
        ARRAY['renewal', 'expansion'], '#3b82f6',
        'Procurement asked for redlines, legal reviewing.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '40 days', current_timestamp - interval '2 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000002',
        'Globex - New Logo Annual',
        'New customer landing on the Standard tier with optional add-ons.',
        'proposal', 'high', 88000.00, 'USD', 55,
        current_timestamp + interval '35 days', null,
        'c0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-100000000002',
        ARRAY['new-logo', 'manufacturing'], '#10b981',
        'Proposal sent; awaiting feedback from Sarah and Emily.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '30 days', current_timestamp - interval '3 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000003',
        'Initech - Analytics Add-on',
        'Multi-year analytics tier expansion for Initech.',
        'qualified', 'medium', 60000.00, 'USD', 40,
        current_timestamp + interval '60 days', null,
        'c0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-100000000003',
        ARRAY['expansion', 'analytics'], '#8b5cf6',
        'Discovery complete; mapping to roadmap items.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '4 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000004',
        'Wayne Enterprises - Co-marketing Engagement',
        'Joint go-to-market motion with Wayne for the partner ecosystem.',
        'won', 'medium', 120000.00, 'USD', 100,
        current_timestamp - interval '15 days', current_timestamp - interval '15 days',
        'c0000000-0000-0000-0000-000000000004',
        'c0000000-0000-0000-0000-100000000005',
        ARRAY['partner', 'closed-won'], '#0ea5e9',
        'Closed last quarter. Pilot underway.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '90 days', current_timestamp - interval '15 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000005',
        'Globex - Procurement Pilot',
        'Limited pilot scope sale to validate before larger rollout.',
        'prospecting', 'low', 18000.00, 'USD', 15,
        current_timestamp + interval '90 days', null,
        'c0000000-0000-0000-0000-000000000002',
        'c0000000-0000-0000-0000-100000000004',
        ARRAY['pilot', 'manufacturing'], '#10b981',
        'Identifying procurement champion; needs internal alignment.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '12 days', current_timestamp - interval '5 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000006',
        'Acme - Services Add-on',
        'Add a 6-month implementation services package.',
        'qualified', 'medium', 35000.00, 'USD', 50,
        current_timestamp + interval '45 days', null,
        'c0000000-0000-0000-0000-000000000001',
        'c0000000-0000-0000-0000-100000000007',
        ARRAY['services', 'expansion'], '#3b82f6',
        'Statement of work in draft.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '18 days', current_timestamp - interval '7 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000007',
        'Initech - SMB Spin-off',
        'A second smaller deal from the same parent account.',
        'lost', 'low', 12000.00, 'USD', 0,
        current_timestamp - interval '20 days', current_timestamp - interval '20 days',
        'c0000000-0000-0000-0000-000000000003',
        'c0000000-0000-0000-0000-100000000009',
        ARRAY['lost', 'no-budget'], '#94a3b8',
        'Closed lost — buyer redirected budget elsewhere.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '120 days', current_timestamp - interval '20 days'
    ),
    -- User 2 deals
    (
        'c0000000-0000-0000-0000-200000000008',
        'Stark - Multi-year Renewal',
        'Three-year renewal with locked-in enterprise pricing.',
        'negotiation', 'critical', 950000.00, 'USD', 80,
        current_timestamp + interval '14 days', null,
        'c0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-100000000015',
        ARRAY['renewal', 'multi-year', 'enterprise'], '#ef4444',
        'Final pricing under exec review at Stark.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '70 days', current_timestamp - interval '1 day'
    ),
    (
        'c0000000-0000-0000-0000-200000000009',
        'Umbrella - POV Conversion',
        'Convert ongoing 6-week POV into an annual contract.',
        'proposal', 'high', 180000.00, 'USD', 60,
        current_timestamp + interval '28 days', null,
        'c0000000-0000-0000-0000-000000000006',
        'c0000000-0000-0000-0000-100000000012',
        ARRAY['pov', 'pharma'], '#f97316',
        'POV results meeting next week.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '50 days', current_timestamp - interval '3 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000010',
        'Soylent - Channel Expansion',
        'Expand the Soylent partnership to include the retail SKUs.',
        'qualified', 'medium', 145000.00, 'USD', 45,
        current_timestamp + interval '55 days', null,
        'c0000000-0000-0000-0000-000000000008',
        'c0000000-0000-0000-0000-100000000018',
        ARRAY['partner', 'expansion', 'retail'], '#22c55e',
        'JBP being negotiated with Megan.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '40 days', current_timestamp - interval '6 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000011',
        'Stark - Security Add-on',
        'Add the security and compliance suite to the existing tier.',
        'won', 'high', 220000.00, 'USD', 100,
        current_timestamp - interval '8 days', current_timestamp - interval '8 days',
        'c0000000-0000-0000-0000-000000000005',
        'c0000000-0000-0000-0000-100000000013',
        ARRAY['security', 'expansion', 'closed-won'], '#dc2626',
        'Closed earlier this month.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '60 days', current_timestamp - interval '8 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000012',
        'Umbrella - Procurement Pilot',
        'Smaller scoped pilot ahead of the broader contract.',
        'prospecting', 'medium', 22000.00, 'USD', 20,
        current_timestamp + interval '70 days', null,
        'c0000000-0000-0000-0000-000000000006',
        'c0000000-0000-0000-0000-100000000016',
        ARRAY['pilot', 'pharma'], '#fb923c',
        'Defining pilot success metrics.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '4 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000013',
        'Cyberdyne - Renewal',
        'Annual infrastructure renewal with our vendor Cyberdyne.',
        'won', 'medium', 78000.00, 'USD', 100,
        current_timestamp - interval '40 days', current_timestamp - interval '40 days',
        'c0000000-0000-0000-0000-000000000007',
        'c0000000-0000-0000-0000-100000000019',
        ARRAY['vendor', 'renewal'], '#a855f7',
        'Closed and signed last cycle.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '120 days', current_timestamp - interval '40 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000014',
        'Soylent - Pilot Loss',
        'Initial pilot did not convert; rolling into nurture for next year.',
        'lost', 'medium', 25000.00, 'USD', 0,
        current_timestamp - interval '30 days', current_timestamp - interval '30 days',
        'c0000000-0000-0000-0000-000000000008',
        'c0000000-0000-0000-0000-100000000018',
        ARRAY['lost', 'nurture'], '#94a3b8',
        'Re-engage in 6 months.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '150 days', current_timestamp - interval '30 days'
    ),
    (
        'c0000000-0000-0000-0000-200000000015',
        'Inbound Lead - Christopher Moore Eval',
        'Self-serve evaluation kicked off from the security webinar.',
        'prospecting', 'low', 9000.00, 'USD', 10,
        current_timestamp + interval '90 days', null,
        null,
        'c0000000-0000-0000-0000-100000000011',
        ARRAY['inbound', 'security'], '#fde047',
        'Open access to security docs and SOC 2 report.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '8 days', current_timestamp - interval '2 days'
    );


    ----------------------------------------------------------------
    -- Activities
    ----------------------------------------------------------------

    INSERT INTO crm.activities (subject, body, type, status, scheduled_at, completed_at, duration, deal_id, contact_id, company_id, tags, notes, user_id, created_at, updated_at) VALUES
    -- Acme renewal touchpoints
    ('Renewal kickoff call', 'Walk through renewal options with John and David.', 'call', 'completed',
     current_timestamp - interval '38 days', current_timestamp - interval '38 days', 1800000,
     'c0000000-0000-0000-0000-200000000001', 'c0000000-0000-0000-0000-100000000001', 'c0000000-0000-0000-0000-000000000001',
     ARRAY['renewal'], 'Acme team aligned on expansion scope.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '38 days', current_timestamp - interval '38 days'),
    ('Send renewal quote', 'Email renewal quote with discount tiers.', 'email', 'completed',
     current_timestamp - interval '30 days', current_timestamp - interval '30 days', null,
     'c0000000-0000-0000-0000-200000000001', 'c0000000-0000-0000-0000-100000000001', 'c0000000-0000-0000-0000-000000000001',
     ARRAY['renewal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '30 days', current_timestamp - interval '30 days'),
    ('Procurement redline review', 'Sync with Acme procurement on contract redlines.', 'meeting', 'pending',
     current_timestamp + interval '3 days', null, 1800000,
     'c0000000-0000-0000-0000-200000000001', 'c0000000-0000-0000-0000-100000000001', 'c0000000-0000-0000-0000-000000000001',
     ARRAY['legal', 'renewal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '2 days', current_timestamp - interval '2 days'),

    -- Globex evaluation
    ('Discovery call with Sarah', 'Initial discovery on operations pain points.', 'call', 'completed',
     current_timestamp - interval '28 days', current_timestamp - interval '28 days', 2700000,
     'c0000000-0000-0000-0000-200000000002', 'c0000000-0000-0000-0000-100000000002', 'c0000000-0000-0000-0000-000000000002',
     ARRAY['discovery'], 'Identified workflow blockers.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '28 days', current_timestamp - interval '28 days'),
    ('Send proposal', 'Initial proposal with Standard tier and add-on options.', 'email', 'completed',
     current_timestamp - interval '20 days', current_timestamp - interval '20 days', null,
     'c0000000-0000-0000-0000-200000000002', 'c0000000-0000-0000-0000-100000000002', 'c0000000-0000-0000-0000-000000000002',
     ARRAY['proposal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '20 days', current_timestamp - interval '20 days'),
    ('Procurement Q&A with Emily', 'Procurement-side questions on terms.', 'call', 'pending',
     current_timestamp + interval '5 days', null, 1500000,
     'c0000000-0000-0000-0000-200000000002', 'c0000000-0000-0000-0000-100000000004', 'c0000000-0000-0000-0000-000000000002',
     ARRAY['procurement'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '3 days', current_timestamp - interval '3 days'),

    -- Initech analytics expansion
    ('Roadmap review with Michael', 'Walk through analytics roadmap.', 'meeting', 'completed',
     current_timestamp - interval '15 days', current_timestamp - interval '15 days', 3600000,
     'c0000000-0000-0000-0000-200000000003', 'c0000000-0000-0000-0000-100000000003', 'c0000000-0000-0000-0000-000000000003',
     ARRAY['expansion', 'roadmap'], 'Validated priorities.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '15 days', current_timestamp - interval '15 days'),
    ('Internal pricing memo', 'Document expansion pricing approach.', 'note', 'completed',
     current_timestamp - interval '10 days', current_timestamp - interval '10 days', null,
     'c0000000-0000-0000-0000-200000000003', 'c0000000-0000-0000-0000-100000000003', 'c0000000-0000-0000-0000-000000000003',
     ARRAY['internal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '10 days', current_timestamp - interval '10 days'),

    -- Wayne partnership (closed)
    ('Pilot retro with James', 'Retrospective on pilot rollout.', 'meeting', 'completed',
     current_timestamp - interval '10 days', current_timestamp - interval '10 days', 3600000,
     'c0000000-0000-0000-0000-200000000004', 'c0000000-0000-0000-0000-100000000005', 'c0000000-0000-0000-0000-000000000004',
     ARRAY['partner', 'retro'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '10 days', current_timestamp - interval '10 days'),
    ('Joint marketing planning', 'Plan joint webinar series for next quarter.', 'meeting', 'in_progress',
     current_timestamp + interval '7 days', null, 5400000,
     'c0000000-0000-0000-0000-200000000004', 'c0000000-0000-0000-0000-100000000005', 'c0000000-0000-0000-0000-000000000004',
     ARRAY['partner', 'marketing'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '4 days', current_timestamp - interval '1 day'),

    -- Acme services
    ('Scope SOW', 'Draft scope of work for services package.', 'task', 'in_progress',
     current_timestamp + interval '2 days', null, null,
     'c0000000-0000-0000-0000-200000000006', 'c0000000-0000-0000-0000-100000000007', 'c0000000-0000-0000-0000-000000000001',
     ARRAY['services'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '5 days', current_timestamp - interval '1 day'),

    -- Inbound prospect Lisa
    ('Discovery with Lisa Anderson', 'Self-serve trial follow-up.', 'call', 'pending',
     current_timestamp + interval '4 days', null, 1500000,
     null, 'c0000000-0000-0000-0000-100000000006', null,
     ARRAY['inbound', 'startup'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '2 days', current_timestamp - interval '2 days'),

    -- Inbound lead Jennifer Taylor
    ('Send pricing one-pager', 'Email SMB pricing PDF to Jennifer.', 'email', 'pending',
     current_timestamp + interval '1 day', null, null,
     null, 'c0000000-0000-0000-0000-100000000008', null,
     ARRAY['inbound', 'marketing'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '1 day', current_timestamp - interval '1 day'),

    -- Initech CS quarterly review
    ('Quarterly health review with Robert', 'Review adoption metrics and account health.', 'meeting', 'completed',
     current_timestamp - interval '12 days', current_timestamp - interval '12 days', 3600000,
     null, 'c0000000-0000-0000-0000-100000000009', 'c0000000-0000-0000-0000-000000000003',
     ARRAY['cs', 'qbr'], 'Health is green; expansion conversation primed.',
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
     current_timestamp - interval '12 days', current_timestamp - interval '12 days'),

    -- Stark renewal (User 2)
    ('Stark exec briefing', 'Briefing for Stark executive sponsors on renewal.', 'meeting', 'completed',
     current_timestamp - interval '12 days', current_timestamp - interval '12 days', 3600000,
     'c0000000-0000-0000-0000-200000000008', 'c0000000-0000-0000-0000-100000000015', 'c0000000-0000-0000-0000-000000000005',
     ARRAY['renewal', 'exec'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '12 days', current_timestamp - interval '12 days'),
    ('Send 3-year proposal', 'Email Matt the 3-year discount proposal.', 'email', 'completed',
     current_timestamp - interval '6 days', current_timestamp - interval '6 days', null,
     'c0000000-0000-0000-0000-200000000008', 'c0000000-0000-0000-0000-100000000015', 'c0000000-0000-0000-0000-000000000005',
     ARRAY['renewal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '6 days', current_timestamp - interval '6 days'),
    ('Stark final pricing call', 'Final pricing review with Matt and exec.', 'call', 'pending',
     current_timestamp + interval '5 days', null, 2700000,
     'c0000000-0000-0000-0000-200000000008', 'c0000000-0000-0000-0000-100000000015', 'c0000000-0000-0000-0000-000000000005',
     ARRAY['renewal', 'critical'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '1 day', current_timestamp - interval '1 day'),

    -- Umbrella POV
    ('POV kickoff', 'Kickoff for Umbrella POV.', 'meeting', 'completed',
     current_timestamp - interval '40 days', current_timestamp - interval '40 days', 3600000,
     'c0000000-0000-0000-0000-200000000009', 'c0000000-0000-0000-0000-100000000012', 'c0000000-0000-0000-0000-000000000006',
     ARRAY['pov'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '40 days', current_timestamp - interval '40 days'),
    ('Weekly POV check-in', 'Recurring POV status sync.', 'meeting', 'in_progress',
     current_timestamp + interval '2 days', null, 1800000,
     'c0000000-0000-0000-0000-200000000009', 'c0000000-0000-0000-0000-100000000012', 'c0000000-0000-0000-0000-000000000006',
     ARRAY['pov', 'recurring'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '2 days', current_timestamp - interval '2 days'),
    ('Send MSA redlines', 'Email Amanda the MSA redlines.', 'email', 'completed',
     current_timestamp - interval '5 days', current_timestamp - interval '5 days', null,
     'c0000000-0000-0000-0000-200000000009', 'c0000000-0000-0000-0000-100000000016', 'c0000000-0000-0000-0000-000000000006',
     ARRAY['legal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '5 days', current_timestamp - interval '5 days'),

    -- Soylent expansion
    ('Channel JBP working session', 'Joint business plan working session.', 'meeting', 'completed',
     current_timestamp - interval '20 days', current_timestamp - interval '20 days', 5400000,
     'c0000000-0000-0000-0000-200000000010', 'c0000000-0000-0000-0000-100000000018', 'c0000000-0000-0000-0000-000000000008',
     ARRAY['partner', 'jbp'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '20 days', current_timestamp - interval '20 days'),
    ('Retail SKU scoping', 'Scope which retail SKUs to include.', 'note', 'completed',
     current_timestamp - interval '10 days', current_timestamp - interval '10 days', null,
     'c0000000-0000-0000-0000-200000000010', 'c0000000-0000-0000-0000-100000000018', 'c0000000-0000-0000-0000-000000000008',
     ARRAY['partner', 'scoping'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '10 days', current_timestamp - interval '10 days'),

    -- Stark security closed-won
    ('Security suite kickoff', 'Kickoff after closing the security add-on.', 'meeting', 'completed',
     current_timestamp - interval '5 days', current_timestamp - interval '5 days', 3600000,
     'c0000000-0000-0000-0000-200000000011', 'c0000000-0000-0000-0000-100000000013', 'c0000000-0000-0000-0000-000000000005',
     ARRAY['kickoff', 'closed-won'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '5 days', current_timestamp - interval '5 days'),

    -- Inbound CISO Christopher Moore
    ('Send SOC 2 report', 'Email Christopher our SOC 2 Type II report.', 'email', 'completed',
     current_timestamp - interval '6 days', current_timestamp - interval '6 days', null,
     'c0000000-0000-0000-0000-200000000015', 'c0000000-0000-0000-0000-100000000011', null,
     ARRAY['security', 'inbound'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '6 days', current_timestamp - interval '6 days'),
    ('Security architecture deep-dive', 'Deep-dive on security architecture for Christopher.', 'meeting', 'pending',
     current_timestamp + interval '6 days', null, 3600000,
     'c0000000-0000-0000-0000-200000000015', 'c0000000-0000-0000-0000-100000000011', null,
     ARRAY['security', 'inbound'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '2 days', current_timestamp - interval '2 days'),

    -- Cold outbound to Ashley Harris
    ('Outbound discovery', 'First discovery call from outbound sequence.', 'call', 'pending',
     current_timestamp + interval '6 days', null, 1500000,
     null, 'c0000000-0000-0000-0000-100000000014', null,
     ARRAY['outbound'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '2 days', current_timestamp - interval '2 days'),

    -- Joshua Hall event follow-up
    ('Technical deep-dive with Josh', 'Architecture deep-dive after AWS re:Invent.', 'meeting', 'pending',
     current_timestamp + interval '10 days', null, 3600000,
     null, 'c0000000-0000-0000-0000-100000000017', null,
     ARRAY['event-followup'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '6 days', current_timestamp - interval '6 days'),

    -- Cyberdyne renewal closed
    ('Cyberdyne renewal sign-off', 'Final sign-off note for the Cyberdyne vendor renewal.', 'note', 'completed',
     current_timestamp - interval '40 days', current_timestamp - interval '40 days', null,
     'c0000000-0000-0000-0000-200000000013', 'c0000000-0000-0000-0000-100000000019', 'c0000000-0000-0000-0000-000000000007',
     ARRAY['vendor', 'renewal'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '40 days', current_timestamp - interval '40 days'),

    -- Soylent loss debrief
    ('Loss debrief', 'Loss debrief and nurture plan for Soylent pilot.', 'note', 'completed',
     current_timestamp - interval '28 days', current_timestamp - interval '28 days', null,
     'c0000000-0000-0000-0000-200000000014', 'c0000000-0000-0000-0000-100000000018', 'c0000000-0000-0000-0000-000000000008',
     ARRAY['lost', 'nurture'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '28 days', current_timestamp - interval '28 days'),

    -- Umbrella pilot scoping
    ('Pilot success metrics', 'Define success metrics for Umbrella pilot.', 'task', 'in_progress',
     current_timestamp + interval '4 days', null, null,
     'c0000000-0000-0000-0000-200000000012', 'c0000000-0000-0000-0000-100000000016', 'c0000000-0000-0000-0000-000000000006',
     ARRAY['pilot'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '4 days', current_timestamp - interval '1 day'),

    -- Quarterly Cyberdyne check-in
    ('Cyberdyne quarterly check-in', 'Vendor quarterly call with Andrew.', 'call', 'pending',
     current_timestamp + interval '20 days', null, 1500000,
     null, 'c0000000-0000-0000-0000-100000000019', 'c0000000-0000-0000-0000-000000000007',
     ARRAY['vendor', 'recurring'], null,
     'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
     current_timestamp - interval '5 days', current_timestamp - interval '5 days');
