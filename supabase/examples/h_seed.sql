
    -- HR Seeder
    -- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 (User 1) and b73eb03e-fb7a-424d-84ff-18e2791ce0b4 (User 2)

    ----------------------------------------------------------------
    -- Departments
    ----------------------------------------------------------------

    INSERT INTO hr.departments (id, name, code, description, parent_id, color, created_at, updated_at) VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'Engineering',
        'ENG',
        'Builds and operates the platform.',
        null,
        '#3b82f6',
        current_timestamp - interval '900 days',
        current_timestamp - interval '30 days'
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'Product',
        'PROD',
        'Owns roadmap and product strategy.',
        null,
        '#8b5cf6',
        current_timestamp - interval '880 days',
        current_timestamp - interval '20 days'
    ),
    (
        'e0000000-0000-0000-0000-000000000003',
        'Sales',
        'SLS',
        'Drives revenue and customer acquisition.',
        null,
        '#10b981',
        current_timestamp - interval '870 days',
        current_timestamp - interval '15 days'
    ),
    (
        'e0000000-0000-0000-0000-000000000004',
        'Marketing',
        'MKT',
        'Brand, demand generation and content.',
        null,
        '#f97316',
        current_timestamp - interval '860 days',
        current_timestamp - interval '12 days'
    ),
    (
        'e0000000-0000-0000-0000-000000000005',
        'People Operations',
        'POPS',
        'HR, recruiting and culture programs.',
        null,
        '#ec4899',
        current_timestamp - interval '850 days',
        current_timestamp - interval '8 days'
    ),
    (
        'e0000000-0000-0000-0000-000000000006',
        'Backend',
        'ENG-BE',
        'Backend services and infrastructure.',
        'e0000000-0000-0000-0000-000000000001',
        '#1d4ed8',
        current_timestamp - interval '700 days',
        current_timestamp - interval '40 days'
    ),
    (
        'e0000000-0000-0000-0000-000000000007',
        'Frontend',
        'ENG-FE',
        'Web client and design systems.',
        'e0000000-0000-0000-0000-000000000001',
        '#60a5fa',
        current_timestamp - interval '700 days',
        current_timestamp - interval '40 days'
    );


    ----------------------------------------------------------------
    -- Positions
    ----------------------------------------------------------------

    INSERT INTO hr.positions (id, title, code, description, department_id, employment_type, level, min_salary, max_salary, currency, tags, created_at, updated_at) VALUES
    (
        'e0000000-0000-0000-0000-100000000001',
        'Senior Backend Engineer',
        'SBE',
        'Owns backend services end-to-end.',
        'e0000000-0000-0000-0000-000000000006',
        'full_time', 'Senior',
        150000.00, 210000.00, 'USD',
        ARRAY['backend','engineering'],
        current_timestamp - interval '600 days', current_timestamp - interval '60 days'
    ),
    (
        'e0000000-0000-0000-0000-100000000002',
        'Frontend Engineer',
        'FE',
        'Builds web client experiences.',
        'e0000000-0000-0000-0000-000000000007',
        'full_time', 'Mid',
        120000.00, 165000.00, 'USD',
        ARRAY['frontend','engineering'],
        current_timestamp - interval '550 days', current_timestamp - interval '55 days'
    ),
    (
        'e0000000-0000-0000-0000-100000000003',
        'Product Manager',
        'PM',
        'Owns product area roadmap and discovery.',
        'e0000000-0000-0000-0000-000000000002',
        'full_time', 'Mid',
        130000.00, 175000.00, 'USD',
        ARRAY['product'],
        current_timestamp - interval '500 days', current_timestamp - interval '50 days'
    ),
    (
        'e0000000-0000-0000-0000-100000000004',
        'Account Executive',
        'AE',
        'Closes enterprise deals.',
        'e0000000-0000-0000-0000-000000000003',
        'full_time', 'Senior',
        110000.00, 160000.00, 'USD',
        ARRAY['sales','quota'],
        current_timestamp - interval '480 days', current_timestamp - interval '48 days'
    ),
    (
        'e0000000-0000-0000-0000-100000000005',
        'Marketing Manager',
        'MM',
        'Runs demand generation programs.',
        'e0000000-0000-0000-0000-000000000004',
        'full_time', 'Mid',
        100000.00, 140000.00, 'USD',
        ARRAY['marketing'],
        current_timestamp - interval '450 days', current_timestamp - interval '45 days'
    ),
    (
        'e0000000-0000-0000-0000-100000000006',
        'People Operations Lead',
        'POPS-LD',
        'Owns HR programs and employee experience.',
        'e0000000-0000-0000-0000-000000000005',
        'full_time', 'Lead',
        130000.00, 170000.00, 'USD',
        ARRAY['hr','operations'],
        current_timestamp - interval '420 days', current_timestamp - interval '40 days'
    ),
    (
        'e0000000-0000-0000-0000-100000000007',
        'Engineering Intern',
        'ENG-INT',
        'Summer internship in the engineering org.',
        'e0000000-0000-0000-0000-000000000006',
        'intern', 'Intern',
        60000.00, 80000.00, 'USD',
        ARRAY['engineering','intern'],
        current_timestamp - interval '300 days', current_timestamp - interval '30 days'
    );


    ----------------------------------------------------------------
    -- Employees
    ----------------------------------------------------------------

    INSERT INTO hr.employees (id, employee_number, first_name, last_name, email, phone, mobile, bio,
        department_id, position_id, manager_id, employment_type, employment_status,
        hire_date, termination_date, birth_date, salary, currency,
        address, city, country, emergency_contact, emergency_phone,
        skills, tags, color, notes, user_id, created_at, updated_at) VALUES
    -- People Ops Lead (no manager) — User 1
    (
        'e0000000-0000-0000-0000-200000000001',
        'EMP-0001',
        'Olivia', 'Bennett',
        'olivia.bennett@example.com', '+1-415-555-0301', '+1-415-555-2301',
        'Long-time People Ops leader, runs HR end-to-end.',
        'e0000000-0000-0000-0000-000000000005',
        'e0000000-0000-0000-0000-100000000006',
        null,
        'full_time', 'active',
        current_date - interval '5 years', null, '1985-03-12',
        160000.00, 'USD',
        '500 Market Street', 'San Francisco', 'United States',
        'Mark Bennett', '+1-415-555-9001',
        ARRAY['hr','programs','culture'],
        ARRAY['leader','people-ops'], '#ec4899',
        'Leads weekly HR sync.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '5 years', current_timestamp - interval '14 days'
    ),
    -- Engineering Manager (no manager)
    (
        'e0000000-0000-0000-0000-200000000002',
        'EMP-0002',
        'Liam', 'Carter',
        'liam.carter@example.com', '+1-415-555-0302', '+1-415-555-2302',
        'Backend leader, manages the platform team.',
        'e0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-100000000001',
        null,
        'full_time', 'active',
        current_date - interval '4 years', null, '1986-07-22',
        205000.00, 'USD',
        '1200 Tech Plaza', 'San Francisco', 'United States',
        'Jane Carter', '+1-415-555-9002',
        ARRAY['go','postgres','distributed-systems'],
        ARRAY['leader','backend'], '#1d4ed8',
        'Tech lead for the platform pod.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '4 years', current_timestamp - interval '7 days'
    ),
    -- Backend engineer reporting to Liam
    (
        'e0000000-0000-0000-0000-200000000003',
        'EMP-0003',
        'Ava', 'Singh',
        'ava.singh@example.com', '+1-415-555-0303', null,
        'Senior backend engineer focused on data infra.',
        'e0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-100000000001',
        'e0000000-0000-0000-0000-200000000002',
        'full_time', 'active',
        current_date - interval '3 years', null, '1990-01-04',
        180000.00, 'USD',
        '88 Oak Street', 'San Francisco', 'United States',
        'Raj Singh', '+1-415-555-9003',
        ARRAY['python','airflow','kafka'],
        ARRAY['backend','data'], '#3b82f6',
        'Owns the ETL pipeline.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '3 years', current_timestamp - interval '4 days'
    ),
    -- Backend engineer on leave
    (
        'e0000000-0000-0000-0000-200000000004',
        'EMP-0004',
        'Noah', 'Garcia',
        'noah.garcia@example.com', '+1-415-555-0304', '+1-415-555-2304',
        'Backend engineer, currently on parental leave.',
        'e0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-100000000001',
        'e0000000-0000-0000-0000-200000000002',
        'full_time', 'on_leave',
        current_date - interval '2 years', null, '1991-09-14',
        165000.00, 'USD',
        '12 Hayes Lane', 'San Francisco', 'United States',
        'Maria Garcia', '+1-415-555-9004',
        ARRAY['rust','postgres'],
        ARRAY['backend','parent'], '#0ea5e9',
        'Returns in 6 weeks.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 years', current_timestamp - interval '20 days'
    ),
    -- Frontend engineer
    (
        'e0000000-0000-0000-0000-200000000005',
        'EMP-0005',
        'Mia', 'Thompson',
        'mia.thompson@example.com', '+1-415-555-0305', null,
        'Frontend engineer building the design system.',
        'e0000000-0000-0000-0000-000000000007',
        'e0000000-0000-0000-0000-100000000002',
        'e0000000-0000-0000-0000-200000000002',
        'full_time', 'active',
        current_date - interval '18 months', null, '1993-05-19',
        140000.00, 'USD',
        '600 Mission Street', 'San Francisco', 'United States',
        'Henry Thompson', '+1-415-555-9005',
        ARRAY['react','tailwind','typescript'],
        ARRAY['frontend','design-systems'], '#60a5fa',
        'Owns the component library.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '18 months', current_timestamp - interval '6 days'
    ),
    -- Product Manager
    (
        'e0000000-0000-0000-0000-200000000006',
        'EMP-0006',
        'Ethan', 'Wright',
        'ethan.wright@example.com', '+1-415-555-0306', '+1-415-555-2306',
        'PM for the analytics area.',
        'e0000000-0000-0000-0000-000000000002',
        'e0000000-0000-0000-0000-100000000003',
        null,
        'full_time', 'active',
        current_date - interval '14 months', null, '1989-11-08',
        160000.00, 'USD',
        '20 Pine Street', 'San Francisco', 'United States',
        'Sara Wright', '+1-415-555-9006',
        ARRAY['discovery','analytics','roadmapping'],
        ARRAY['product'], '#8b5cf6',
        'Co-leads the analytics pod.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '14 months', current_timestamp - interval '5 days'
    ),
    -- Account executive — User 2
    (
        'e0000000-0000-0000-0000-200000000007',
        'EMP-0007',
        'Sophia', 'Martinez',
        'sophia.martinez@example.com', '+1-212-555-0307', '+1-212-555-2307',
        'Enterprise AE in the East region.',
        'e0000000-0000-0000-0000-000000000003',
        'e0000000-0000-0000-0000-100000000004',
        null,
        'full_time', 'active',
        current_date - interval '20 months', null, '1988-04-25',
        150000.00, 'USD',
        '350 5th Ave', 'New York', 'United States',
        'Diego Martinez', '+1-212-555-9007',
        ARRAY['enterprise-sales','negotiation'],
        ARRAY['sales','enterprise'], '#10b981',
        'Top performer in Q3.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '20 months', current_timestamp - interval '3 days'
    ),
    -- AE on contract
    (
        'e0000000-0000-0000-0000-200000000008',
        'EMP-0008',
        'Lucas', 'Patel',
        'lucas.patel@example.com', '+1-212-555-0308', null,
        'Contract AE covering the SMB segment.',
        'e0000000-0000-0000-0000-000000000003',
        'e0000000-0000-0000-0000-100000000004',
        'e0000000-0000-0000-0000-200000000007',
        'contract', 'active',
        current_date - interval '8 months', null, '1992-12-30',
        110000.00, 'USD',
        '111 8th Ave', 'New York', 'United States',
        'Ana Patel', '+1-212-555-9008',
        ARRAY['smb-sales'],
        ARRAY['sales','contract'], '#22c55e',
        'Contract renews in 4 months.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '8 months', current_timestamp - interval '10 days'
    ),
    -- Marketing manager
    (
        'e0000000-0000-0000-0000-200000000009',
        'EMP-0009',
        'Isabella', 'Nguyen',
        'isabella.nguyen@example.com', '+1-617-555-0309', '+1-617-555-2309',
        'Demand gen lead, focused on enterprise pipeline.',
        'e0000000-0000-0000-0000-000000000004',
        'e0000000-0000-0000-0000-100000000005',
        null,
        'full_time', 'active',
        current_date - interval '2 years', null, '1987-08-11',
        135000.00, 'USD',
        '77 Beacon Street', 'Boston', 'United States',
        'Henry Nguyen', '+1-617-555-9009',
        ARRAY['demand-gen','content','events'],
        ARRAY['marketing'], '#f97316',
        'Owns the field marketing program.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '2 years', current_timestamp - interval '2 days'
    ),
    -- Engineering intern
    (
        'e0000000-0000-0000-0000-200000000010',
        'EMP-0010',
        'Aiden', 'Brooks',
        'aiden.brooks@example.com', '+1-415-555-0310', null,
        'Summer engineering intern on the data team.',
        'e0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-100000000007',
        'e0000000-0000-0000-0000-200000000003',
        'intern', 'active',
        current_date - interval '60 days', null, '2002-02-14',
        72000.00, 'USD',
        '40 Folsom Street', 'San Francisco', 'United States',
        'Megan Brooks', '+1-415-555-9010',
        ARRAY['python','sql'],
        ARRAY['intern','engineering'], '#fde047',
        'Project: data quality monitoring.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '60 days', current_timestamp - interval '7 days'
    ),
    -- Terminated employee (recent attrition)
    (
        'e0000000-0000-0000-0000-200000000011',
        'EMP-0011',
        'Mason', 'Cole',
        'mason.cole@example.com', null, null,
        'Former frontend engineer.',
        'e0000000-0000-0000-0000-000000000007',
        'e0000000-0000-0000-0000-100000000002',
        'e0000000-0000-0000-0000-200000000002',
        'full_time', 'terminated',
        current_date - interval '700 days', current_date - interval '30 days', '1990-06-02',
        135000.00, 'USD',
        null, 'Austin', 'United States',
        null, null,
        ARRAY['react','typescript'],
        ARRAY['alumni','frontend'], '#94a3b8',
        'Voluntary departure for new role.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '700 days', current_timestamp - interval '30 days'
    ),
    -- Suspended pending review
    (
        'e0000000-0000-0000-0000-200000000012',
        'EMP-0012',
        'Charlotte', 'Reed',
        'charlotte.reed@example.com', '+1-617-555-0312', null,
        'Marketing coordinator under HR review.',
        'e0000000-0000-0000-0000-000000000004',
        'e0000000-0000-0000-0000-100000000005',
        'e0000000-0000-0000-0000-200000000009',
        'part_time', 'suspended',
        current_date - interval '300 days', null, '1995-10-21',
        65000.00, 'USD',
        '15 Newbury Street', 'Boston', 'United States',
        'Owen Reed', '+1-617-555-9012',
        ARRAY['social-media'],
        ARRAY['marketing','review'], '#a855f7',
        'Pending investigation.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '300 days', current_timestamp - interval '12 days'
    );

    -- Wire department managers now that employees exist
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000001' WHERE id = 'e0000000-0000-0000-0000-000000000005';
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000002' WHERE id = 'e0000000-0000-0000-0000-000000000001';
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000002' WHERE id = 'e0000000-0000-0000-0000-000000000006';
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000005' WHERE id = 'e0000000-0000-0000-0000-000000000007';
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000006' WHERE id = 'e0000000-0000-0000-0000-000000000002';
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000007' WHERE id = 'e0000000-0000-0000-0000-000000000003';
    UPDATE hr.departments SET manager_id = 'e0000000-0000-0000-0000-200000000009' WHERE id = 'e0000000-0000-0000-0000-000000000004';


    ----------------------------------------------------------------
    -- Leave requests
    ----------------------------------------------------------------

    INSERT INTO hr.leave_requests (id, employee_id, type, status, start_date, end_date, days, reason, response, reviewer_id, reviewed_at, user_id, created_at, updated_at) VALUES
    -- Approved vacation (Ava)
    (
        'e0000000-0000-0000-0000-300000000001',
        'e0000000-0000-0000-0000-200000000003',
        'vacation', 'approved',
        current_date + interval '14 days', current_date + interval '21 days', 6,
        'Annual family vacation.',
        'Approved — coverage in place with Aiden.',
        'e0000000-0000-0000-0000-200000000002',
        current_timestamp - interval '5 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '8 days', current_timestamp - interval '5 days'
    ),
    -- Active parental leave (Noah)
    (
        'e0000000-0000-0000-0000-300000000002',
        'e0000000-0000-0000-0000-200000000004',
        'paternity', 'approved',
        current_date - interval '20 days', current_date + interval '70 days', 60,
        'Paternity leave for new arrival.',
        'Approved — full backfill plan documented.',
        'e0000000-0000-0000-0000-200000000002',
        current_timestamp - interval '40 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '50 days', current_timestamp - interval '40 days'
    ),
    -- Pending vacation (Mia)
    (
        'e0000000-0000-0000-0000-300000000003',
        'e0000000-0000-0000-0000-200000000005',
        'vacation', 'pending',
        current_date + interval '30 days', current_date + interval '37 days', 6,
        'Wedding anniversary trip.',
        null,
        'e0000000-0000-0000-0000-200000000002',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '2 days', current_timestamp - interval '2 days'
    ),
    -- Approved sick (Ethan, past)
    (
        'e0000000-0000-0000-0000-300000000004',
        'e0000000-0000-0000-0000-200000000006',
        'sick', 'approved',
        current_date - interval '10 days', current_date - interval '8 days', 3,
        'Flu — out for a few days.',
        'Approved.',
        'e0000000-0000-0000-0000-200000000001',
        current_timestamp - interval '10 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '10 days', current_timestamp - interval '8 days'
    ),
    -- Pending personal (Sophia)
    (
        'e0000000-0000-0000-0000-300000000005',
        'e0000000-0000-0000-0000-200000000007',
        'personal', 'pending',
        current_date + interval '5 days', current_date + interval '6 days', 2,
        'Family obligation.',
        null,
        'e0000000-0000-0000-0000-200000000001',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '1 day', current_timestamp - interval '1 day'
    ),
    -- Rejected (Lucas — too soon)
    (
        'e0000000-0000-0000-0000-300000000006',
        'e0000000-0000-0000-0000-200000000008',
        'vacation', 'rejected',
        current_date + interval '3 days', current_date + interval '10 days', 6,
        'Trip with friends.',
        'Rejected — overlaps with quarter-end push.',
        'e0000000-0000-0000-0000-200000000007',
        current_timestamp - interval '4 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '6 days', current_timestamp - interval '4 days'
    ),
    -- Cancelled (Isabella)
    (
        'e0000000-0000-0000-0000-300000000007',
        'e0000000-0000-0000-0000-200000000009',
        'vacation', 'cancelled',
        current_date + interval '20 days', current_date + interval '24 days', 4,
        'Was planning to travel; cancelled.',
        'Cancelled by employee.',
        'e0000000-0000-0000-0000-200000000001',
        current_timestamp - interval '2 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '15 days', current_timestamp - interval '2 days'
    ),
    -- Past approved bereavement (Liam)
    (
        'e0000000-0000-0000-0000-300000000008',
        'e0000000-0000-0000-0000-200000000002',
        'bereavement', 'approved',
        current_date - interval '120 days', current_date - interval '116 days', 5,
        'Family bereavement.',
        'Approved.',
        'e0000000-0000-0000-0000-200000000001',
        current_timestamp - interval '125 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '125 days', current_timestamp - interval '116 days'
    ),
    -- Pending unpaid (Aiden — intern extension)
    (
        'e0000000-0000-0000-0000-300000000009',
        'e0000000-0000-0000-0000-200000000010',
        'unpaid', 'pending',
        current_date + interval '40 days', current_date + interval '45 days', 4,
        'University orientation week.',
        null,
        'e0000000-0000-0000-0000-200000000003',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '3 days', current_timestamp - interval '3 days'
    ),
    -- Approved past sick (Aiden)
    (
        'e0000000-0000-0000-0000-300000000010',
        'e0000000-0000-0000-0000-200000000010',
        'sick', 'approved',
        current_date - interval '25 days', current_date - interval '24 days', 2,
        'Migraine.',
        'Approved.',
        'e0000000-0000-0000-0000-200000000003',
        current_timestamp - interval '24 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '25 days', current_timestamp - interval '24 days'
    );


    ----------------------------------------------------------------
    -- Performance reviews
    ----------------------------------------------------------------

    INSERT INTO hr.performance_reviews (id, employee_id, reviewer_id, period_start, period_end, rating, status,
        summary, strengths, areas_for_improvement, goals, comments, acknowledged_at, user_id, created_at, updated_at) VALUES
    -- Acknowledged (Ava)
    (
        'e0000000-0000-0000-0000-400000000001',
        'e0000000-0000-0000-0000-200000000003',
        'e0000000-0000-0000-0000-200000000002',
        current_date - interval '12 months', current_date - interval '6 months',
        4.5, 'acknowledged',
        'Strong half — delivered ETL pipeline ahead of schedule.',
        'Technical depth, reliability, strong collaborator.',
        'Could grow more in cross-team mentorship.',
        'Mentor 1 mid-level engineer in next half.',
        'Promotion case being prepared.',
        current_timestamp - interval '170 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '180 days', current_timestamp - interval '170 days'
    ),
    -- Completed not yet acknowledged (Mia)
    (
        'e0000000-0000-0000-0000-400000000002',
        'e0000000-0000-0000-0000-200000000005',
        'e0000000-0000-0000-0000-200000000002',
        current_date - interval '6 months', current_date - interval '1 month',
        4.0, 'completed',
        'Solid performance ramping the design system.',
        'Consistent delivery, strong UX intuition.',
        'Tighten async written communication.',
        'Drive design system adoption to 80% across product.',
        'Sent for acknowledgement last week.',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '10 days'
    ),
    -- In review (Sophia)
    (
        'e0000000-0000-0000-0000-400000000003',
        'e0000000-0000-0000-0000-200000000007',
        'e0000000-0000-0000-0000-200000000001',
        current_date - interval '6 months', current_date - interval '1 month',
        null, 'in_review',
        'Initial draft from Sophia''s self-assessment.',
        null, null,
        'Pending calibration session.',
        null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '8 days', current_timestamp - interval '2 days'
    ),
    -- Draft (Ethan)
    (
        'e0000000-0000-0000-0000-400000000004',
        'e0000000-0000-0000-0000-200000000006',
        'e0000000-0000-0000-0000-200000000001',
        current_date - interval '6 months', current_date - interval '1 month',
        null, 'draft',
        null, null, null, null, null, null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '4 days', current_timestamp - interval '4 days'
    ),
    -- Acknowledged exceeds (Liam)
    (
        'e0000000-0000-0000-0000-400000000005',
        'e0000000-0000-0000-0000-200000000002',
        'e0000000-0000-0000-0000-200000000001',
        current_date - interval '12 months', current_date - interval '6 months',
        5.0, 'acknowledged',
        'Outstanding leadership half — re-architected the platform team.',
        'Vision, execution, talent magnet.',
        'Spread thin across initiatives — delegate more.',
        'Hire 2 senior engineers in next quarter.',
        'Bonus uplift recommended.',
        current_timestamp - interval '160 days',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '170 days', current_timestamp - interval '160 days'
    ),
    -- Completed underperformer (Charlotte)
    (
        'e0000000-0000-0000-0000-400000000006',
        'e0000000-0000-0000-0000-200000000012',
        'e0000000-0000-0000-0000-200000000009',
        current_date - interval '12 months', current_date - interval '6 months',
        2.0, 'completed',
        'Performance below expectations across the half.',
        'Creative ideas, willing to learn.',
        'Reliability, follow-through, communication consistency.',
        'PIP outlined separately.',
        'Manager working with HR.',
        null,
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '180 days', current_timestamp - interval '150 days'
    );


    ----------------------------------------------------------------
    -- Job postings
    ----------------------------------------------------------------

    INSERT INTO hr.job_postings (id, title, description, department_id, position_id, status, employment_type,
        location, remote, openings, salary_min, salary_max, currency, posted_at, closes_at, tags, user_id, created_at, updated_at) VALUES
    (
        'e0000000-0000-0000-0000-500000000001',
        'Senior Backend Engineer (Platform)',
        'Looking for a senior backend engineer to join the platform pod.',
        'e0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-100000000001',
        'open', 'full_time',
        'San Francisco, CA', false, 2,
        160000.00, 210000.00, 'USD',
        current_timestamp - interval '21 days', current_timestamp + interval '30 days',
        ARRAY['backend','senior','platform'],
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '25 days', current_timestamp - interval '3 days'
    ),
    (
        'e0000000-0000-0000-0000-500000000002',
        'Frontend Engineer (Design Systems)',
        'Help shape our component library and design tokens pipeline.',
        'e0000000-0000-0000-0000-000000000007',
        'e0000000-0000-0000-0000-100000000002',
        'open', 'full_time',
        'Remote (US)', true, 1,
        130000.00, 170000.00, 'USD',
        current_timestamp - interval '14 days', current_timestamp + interval '45 days',
        ARRAY['frontend','remote','design-systems'],
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '18 days', current_timestamp - interval '4 days'
    ),
    (
        'e0000000-0000-0000-0000-500000000003',
        'Account Executive — East',
        'Quota-carrying AE covering enterprise accounts in the East region.',
        'e0000000-0000-0000-0000-000000000003',
        'e0000000-0000-0000-0000-100000000004',
        'on_hold', 'full_time',
        'New York, NY', false, 1,
        120000.00, 170000.00, 'USD',
        current_timestamp - interval '60 days', current_timestamp + interval '15 days',
        ARRAY['sales','enterprise','east'],
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '70 days', current_timestamp - interval '10 days'
    ),
    (
        'e0000000-0000-0000-0000-500000000004',
        'Engineering Intern (Summer)',
        'Summer internship on the data quality team.',
        'e0000000-0000-0000-0000-000000000006',
        'e0000000-0000-0000-0000-100000000007',
        'filled', 'intern',
        'San Francisco, CA', false, 1,
        65000.00, 80000.00, 'USD',
        current_timestamp - interval '120 days', current_timestamp - interval '60 days',
        ARRAY['intern','engineering'],
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '130 days', current_timestamp - interval '60 days'
    ),
    (
        'e0000000-0000-0000-0000-500000000005',
        'Marketing Manager — Demand Gen',
        'Run our demand gen and field events programs.',
        'e0000000-0000-0000-0000-000000000004',
        'e0000000-0000-0000-0000-100000000005',
        'draft', 'full_time',
        'Boston, MA', true, 1,
        110000.00, 150000.00, 'USD',
        null, current_timestamp + interval '60 days',
        ARRAY['marketing','demand-gen'],
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '6 days', current_timestamp - interval '1 day'
    );


    ----------------------------------------------------------------
    -- Candidates
    ----------------------------------------------------------------

    INSERT INTO hr.candidates (id, posting_id, first_name, last_name, email, phone, status, source,
        current_company, current_title, expected_salary, currency, linkedin_url, rating, tags, notes, user_id, created_at, updated_at) VALUES
    -- Senior Backend Engineer pipeline
    (
        'e0000000-0000-0000-0000-600000000001',
        'e0000000-0000-0000-0000-500000000001',
        'Henry', 'Adams',
        'henry.adams@example.com', '+1-415-555-0401',
        'interview', 'referral',
        'Globex Industries', 'Staff Engineer',
        205000.00, 'USD',
        'https://www.linkedin.com/in/henry-adams', 4.5,
        ARRAY['referral','strong'],
        'Onsite scheduled next week.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '14 days', current_timestamp - interval '2 days'
    ),
    (
        'e0000000-0000-0000-0000-600000000002',
        'e0000000-0000-0000-0000-500000000001',
        'Grace', 'Kim',
        'grace.kim@example.com', '+1-415-555-0402',
        'screening', 'linkedin',
        'Initech Software', 'Senior Backend Engineer',
        190000.00, 'USD',
        'https://www.linkedin.com/in/grace-kim', 4.0,
        ARRAY['inbound'],
        'Recruiter screen completed; tech screen scheduled.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '8 days', current_timestamp - interval '3 days'
    ),
    (
        'e0000000-0000-0000-0000-600000000003',
        'e0000000-0000-0000-0000-500000000001',
        'Owen', 'Diaz',
        'owen.diaz@example.com', null,
        'rejected', 'job_board',
        null, 'Backend Engineer',
        180000.00, 'USD',
        'https://www.linkedin.com/in/owen-diaz', 2.0,
        ARRAY['rejected'],
        'Did not pass tech screen.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '20 days', current_timestamp - interval '15 days'
    ),

    -- Frontend Engineer pipeline
    (
        'e0000000-0000-0000-0000-600000000004',
        'e0000000-0000-0000-0000-500000000002',
        'Chloe', 'Foster',
        'chloe.foster@example.com', '+1-415-555-0404',
        'offer', 'referral',
        'Acme Corporation', 'Frontend Engineer II',
        160000.00, 'USD',
        'https://www.linkedin.com/in/chloe-foster', 4.8,
        ARRAY['offer-out'],
        'Verbal offer extended; awaiting response.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '10 days', current_timestamp - interval '1 day'
    ),
    (
        'e0000000-0000-0000-0000-600000000005',
        'e0000000-0000-0000-0000-500000000002',
        'Ryan', 'Murphy',
        'ryan.murphy@example.com', '+1-415-555-0405',
        'applied', 'website',
        'Wayne Enterprises', 'Junior Frontend Engineer',
        130000.00, 'USD',
        'https://www.linkedin.com/in/ryan-murphy', null,
        ARRAY['inbound'],
        'Resume looks promising.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '4 days', current_timestamp - interval '4 days'
    ),

    -- Account Executive pipeline (User 2)
    (
        'e0000000-0000-0000-0000-600000000006',
        'e0000000-0000-0000-0000-500000000003',
        'Ella', 'Ortiz',
        'ella.ortiz@example.com', '+1-212-555-0406',
        'interview', 'referral',
        'Stark Industries', 'Senior AE',
        165000.00, 'USD',
        'https://www.linkedin.com/in/ella-ortiz', 4.2,
        ARRAY['referral','enterprise'],
        '2nd round next Monday.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '18 days', current_timestamp - interval '3 days'
    ),
    (
        'e0000000-0000-0000-0000-600000000007',
        'e0000000-0000-0000-0000-500000000003',
        'Nathan', 'Walker',
        'nathan.walker@example.com', '+1-212-555-0407',
        'withdrawn', 'linkedin',
        'Soylent Foods', 'AE',
        150000.00, 'USD',
        'https://www.linkedin.com/in/nathan-walker', null,
        ARRAY['withdrawn'],
        'Accepted offer elsewhere.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        current_timestamp - interval '30 days', current_timestamp - interval '20 days'
    ),

    -- Engineering intern pipeline (filled posting)
    (
        'e0000000-0000-0000-0000-600000000008',
        'e0000000-0000-0000-0000-500000000004',
        'Aiden', 'Brooks',
        'aiden.brooks@example.com', '+1-415-555-0310',
        'hired', 'university_event',
        'University of California', 'CS Student',
        72000.00, 'USD',
        'https://www.linkedin.com/in/aiden-brooks', 4.5,
        ARRAY['hired','intern'],
        'Started 60 days ago.',
        'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        current_timestamp - interval '110 days', current_timestamp - interval '60 days'
    );
