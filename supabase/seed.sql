INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                            "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                            "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                            "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                            "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                            "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                            "email_change_confirm_status", "banned_until", "reauthentication_token",
                            "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
VALUES ('00000000-0000-0000-0000-000000000000', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'authenticated',
        'authenticated', 'user@supasheet.dev', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
        '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
        '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}',
        '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b4", "email": "user@supasheet.dev", "email_verified": false, "phone_verified": false}',
        NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
        NULL, false, NULL, false);

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                 "updated_at", "id")
VALUES ('b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
        '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b4", "email": "user@supasheet.dev", "email_verified": false, "phone_verified": false}',
        'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
        '9bb58bad-24a4-41a8-9742-1b5b4e2d8ab1');

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                            "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                            "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                            "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                            "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                            "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                            "email_change_confirm_status", "banned_until", "reauthentication_token",
                            "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
VALUES ('00000000-0000-0000-0000-000000000000', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'authenticated',
        'authenticated', 'user1@supasheet.dev', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
        '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
        '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}',
        '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b1", "email": "user1@supasheet.dev", "email_verified": false, "phone_verified": false}',
        NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
        NULL, false, NULL, false);

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                 "updated_at", "id")
VALUES ('b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
        '{"sub": "b73eb03e-fb7a-424d-84ff-18e2791ce0b1", "email": "user1@supasheet.dev", "email_verified": false, "phone_verified": false}',
        'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
        '9bb58bad-24a4-41a8-9742-1b5b4e2d8abd');

INSERT INTO supasheet.role_permissions (role, permission) values ('user', 'supasheet.accounts:select');

INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('supasheet');
INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('supasheet');
INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('supasheet');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.generate_materialized_views('supasheet');

INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('public');
INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('public');
INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('public');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('public');

INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('reports');
INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('reports');
INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('reports');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('reports');


-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('finance');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('finance');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('finance');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.generate_materialized_views('finance');


-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('productivity');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('productivity');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('productivity');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.generate_materialized_views('productivity');


-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('journal');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('journal');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('journal');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.generate_materialized_views('journal');


-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('health_fitness');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('health_fitness');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('health_fitness');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.generate_materialized_views('health_fitness');


-- Todo Table Seeder
-- Uses hardcoded user IDs: b73eb03e-fb7a-424d-84ff-18e2791ce0b1 and b73eb03e-fb7a-424d-84ff-18e2791ce0b4

INSERT INTO tasks (id, title, description, status, priority, account_id, due_date, completed_at, tags, is_important, completion, duration, color, notes, created_at, updated_at, cover) VALUES

-- User 1 tasks (b73eb03e-fb7a-424d-84ff-18e2791ce0b1)
(
    extensions.uuid_generate_v4(),
    'Complete project proposal',
    'Draft and finalize the Q4 project proposal for the new marketing campaign',
    'in_progress',
    'high',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_date + interval '5 days',
    NULL,
    ARRAY['work', 'proposal', 'marketing'],
    true,
    65.5,
    8,
    '#3b82f6',
    'Waiting for feedback from stakeholders before finalizing',
    current_timestamp - interval '6 days',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/263/300/200.jpg?hmac=v6nAQqVXPFf8VKGlgJ_3Eu9Ou0XVxjdkp55M2I5tdzM']
),
(
    extensions.uuid_generate_v4(),
    'Buy groceries',
    'Milk, bread, eggs, chicken, vegetables for the week',
    'pending',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_date + interval '2 days',
    NULL,
    ARRAY['personal', 'shopping'],
    false,
    0,
    1,
    '#10b981',
    'Don''t forget organic milk and whole grain bread',
    current_timestamp - interval '1 day',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/29/300/200.jpg?hmac=p3UmlzDfUhFXDjsILC6IgsRpo49USFNO24jHP2exNFE']
),
(
    extensions.uuid_generate_v4(),
    'Schedule dentist appointment',
    'Annual checkup and cleaning',
    'completed',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_date - interval '3 days',
    current_timestamp - interval '3 days',
    ARRAY['health', 'personal'],
    false,
    100,
    2,
    '#22c55e',
    'Appointment went well, next visit scheduled for 6 months',
    current_timestamp - interval '10 days',
    current_timestamp - interval '3 days',
    ARRAY['https://fastly.picsum.photos/id/466/300/200.jpg?hmac=ynZ9L9zmxdc_vQ-UM_FDRX4tUF-5Ogg8apdMbX1_8sU']
),
(
    extensions.uuid_generate_v4(),
    'Review team performance reports',
    'Quarterly review for all direct reports',
    'pending',
    'urgent',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_date + interval '1 day',
    NULL,
    ARRAY['work', 'management', 'review'],
    true,
    0,
    12,
    '#ef4444',
    'Need to review 5 team members before deadline',
    current_timestamp - interval '2 days',
    current_timestamp - interval '2 days',
    ARRAY['https://fastly.picsum.photos/id/114/300/200.jpg?hmac=3ZMrUmxdXDWR0yScPMMY75756Fl_rkR4UdrtPCnewQ8']
),
(
    extensions.uuid_generate_v4(),
    'Plan weekend trip',
    'Research and book hotel for the mountain getaway',
    'in_progress',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_date + interval '7 days',
    NULL,
    ARRAY['personal', 'travel', 'vacation'],
    false,
    40,
    5,
    '#8b5cf6',
    'Found three good options, need to compare prices',
    current_timestamp - interval '4 days',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/99/300/200.jpg?hmac=U4YQmefe3Ng4IlKBytiAxUQdgd11VBNO59_0wZNOxPk']
),

-- User 2 tasks (b73eb03e-fb7a-424d-84ff-18e2791ce0b4)
(
    extensions.uuid_generate_v4(),
    'Finish reading "Clean Code"',
    'Complete the remaining chapters and take notes',
    'in_progress',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date + interval '10 days',
    NULL,
    ARRAY['learning', 'programming', 'books'],
    false,
    75,
    20,
    '#06b6d4',
    'On chapter 14 of 17, taking detailed notes',
    current_timestamp - interval '12 days',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/431/300/200.jpg?hmac=t36jx_1pTMP348laF5bxobhFZk-XChMIoJAbYnEwrEs']
),
(
    extensions.uuid_generate_v4(),
    'Update resume',
    'Add recent projects and certifications',
    'pending',
    'high',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date + interval '3 days',
    NULL,
    ARRAY['career', 'job-search'],
    true,
    0,
    3,
    '#f59e0b',
    'Need to add AWS certification and latest React project',
    current_timestamp - interval '2 days',
    current_timestamp - interval '2 days',
    ARRAY['https://fastly.picsum.photos/id/904/300/200.jpg?hmac=vRlZFpSxP4DD0mBeAeRjLn4WGGH6pOYU-ufFlG8LEsw']
),
(
    extensions.uuid_generate_v4(),
    'Call mom',
    'Weekly check-in call with family',
    'completed',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date - interval '1 day',
    current_timestamp - interval '1 day',
    ARRAY['family', 'personal'],
    false,
    100,
    1,
    '#10b981',
    'Had a great conversation, mom is doing well',
    current_timestamp - interval '3 days',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=OCNB3_BcP7xW8cR7fqfj4wnfkY1XXktShILFVyH3vtU']
),
(
    extensions.uuid_generate_v4(),
    'Fix database performance issue',
    'Optimize slow queries in the user dashboard',
    'in_progress',
    'urgent',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date + interval '2 days',
    NULL,
    ARRAY['work', 'database', 'bug-fix'],
    true,
    80,
    6,
    '#dc2626',
    'Added indexes, testing query performance improvements',
    current_timestamp - interval '1 day',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/1027/300/200.jpg?hmac=bpuTGQJl9LsoTELrXiP0I1gc6BTycxz3kK0w-aVuyB8']
),
(
    extensions.uuid_generate_v4(),
    'Learn Docker basics',
    'Complete online course and practice with sample projects',
    'pending',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date + interval '14 days',
    NULL,
    ARRAY['learning', 'devops', 'docker'],
    false,
    0,
    15,
    '#6366f1',
    'Enrolled in Udemy course, 8 hours of content',
    current_timestamp - interval '5 days',
    current_timestamp - interval '5 days',
    ARRAY['https://fastly.picsum.photos/id/122/300/200.jpg?hmac=T6uhgiyd0AVUDANcmgFs98nQFUIT1X-L3DG6IAKbMo8']
),
(
    extensions.uuid_generate_v4(),
    'Organize digital photos',
    'Sort and backup photos from the last 6 months',
    'completed',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date - interval '2 days',
    current_timestamp - interval '2 days',
    ARRAY['personal', 'organization'],
    false,
    100,
    4,
    '#14b8a6',
    'All photos sorted and backed up to cloud storage',
    current_timestamp - interval '8 days',
    current_timestamp - interval '2 days',
    ARRAY['https://fastly.picsum.photos/id/81/300/200.jpg?hmac=RCRORiz7FRQIZpCWTcMoFDhm_9tQhTT12vHViqf3Cr8']
),
(
    extensions.uuid_generate_v4(),
    'Prepare presentation for tech talk',
    'Create slides on microservices architecture',
    'in_progress',
    'high',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date + interval '6 days',
    NULL,
    ARRAY['work', 'presentation', 'tech-talk'],
    true,
    55,
    10,
    '#f97316',
    'Created outline and 15 of 30 slides',
    current_timestamp - interval '7 days',
    current_timestamp - interval '1 day',
    ARRAY['https://fastly.picsum.photos/id/937/300/200.jpg?hmac=GJYxL7lzejHKjvxi5uA67PGLYLd8rg4FkdTfjl04fsw']
),
(
    extensions.uuid_generate_v4(),
    'Renew car insurance',
    'Compare quotes and renew policy before expiration',
    'pending',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_date + interval '12 days',
    NULL,
    ARRAY['personal', 'insurance', 'finance'],
    false,
    0,
    2,
    '#84cc16',
    'Got quotes from 3 companies, need to make decision',
    current_timestamp - interval '3 days',
    current_timestamp - interval '3 days',
    ARRAY['https://fastly.picsum.photos/id/254/300/200.jpg?hmac=YLqZvuVO1lr25UD2JmRLloIjBky8c_j42Joe73smTMQ']
);

-- Add some tasks with no due dates
INSERT INTO tasks (id, title, description, status, priority, account_id, due_date, completed_at, tags, is_important, completion, duration, color, notes, created_at, updated_at, cover) VALUES
(
    extensions.uuid_generate_v4(),
    'Research investment options',
    'Look into index funds and retirement planning',
    'pending',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    NULL,
    NULL,
    ARRAY['finance', 'investment', 'retirement'],
    false,
    10,
    NULL,
    '#a855f7',
    'Looking at Vanguard and Fidelity index funds',
    current_timestamp - interval '4 days',
    current_timestamp - interval '4 days',
    ARRAY['https://fastly.picsum.photos/id/793/300/200.jpg?hmac=G82bV14cNKQ_SOHDtRvtygV8wO5imAERJq0Agc46HbE']
),
(
    extensions.uuid_generate_v4(),
    'Clean garage',
    'Organize tools and donate unused items',
    'pending',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    NULL,
    NULL,
    ARRAY['home', 'organization', 'cleaning'],
    false,
    0,
    NULL,
    '#64748b',
    'Will do this on a weekend when weather is nice',
    current_timestamp - interval '6 days',
    current_timestamp - interval '6 days',
    ARRAY['https://fastly.picsum.photos/id/416/300/200.jpg?hmac=q5DuFu-Th6K9C_RBCvNJvIbjU7kpMzVzzhhjFCcYNsQ']
);


-- Sample data (120 users)
insert into public.user_details (
  name, email, phone, website, status, verified, role, department, created_by,
  salary, rating, projects, skills, join_date, created_at, updated_at, last_active, notes
) values
  ('John Doe', 'john.doe@example.com', '+1 (555) 779-3615', 'https://example.com', 'active', false, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 168197, 5, 23, ARRAY['cloud', 'javascript', 'java', 'rust']::user_skill[], '2022-11-18', '2023-12-03 15:19:00', '2023-12-03 15:19:00', '13:45', 'Senior engineering leader with cloud architecture expertise'),
  ('Jane Smith', 'jane.smith@example.com', '+1 (555) 555-0123', 'https://janesmith.dev', 'active', true, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 95000, 4, 15, ARRAY['sql', 'nosql']::user_skill[], '2023-01-15', '2023-06-20 10:30:00', '2023-06-20 10:30:00', '09:15', 'Marketing specialist with data analytics background'),
  ('Bob Johnson', 'bob.johnson@example.com', '+1 (555) 555-0124', 'https://bobjohnson.io', 'inactive', false, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 78000, 3, 8, ARRAY['sql']::user_skill[], '2022-08-10', '2023-09-15 14:45:00', '2023-09-15 14:45:00', '16:20', 'Sales representative currently on leave'),
  ('Alice Williams', 'alice.williams@example.com', '+1 (555) 555-0125', 'https://alicew.net', 'active', true, 'moderator', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 125000, 5, 30, ARRAY['go', 'cloud', 'devops']::user_skill[], '2021-03-22', '2023-05-10 11:00:00', '2023-05-10 11:00:00', '14:30', 'DevOps engineer managing cloud infrastructure'),
  ('Charlie Brown', 'charlie.brown@example.com', '+1 (555) 555-0126', 'https://charlieb.com', 'active', false, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 65000, 3, 5, ARRAY['nosql']::user_skill[], '2023-06-01', '2023-11-01 08:00:00', '2023-11-01 08:00:00', '10:00', 'Operations coordinator for customer support'),
  ('Diana Prince', 'diana.prince@example.com', '+1 (555) 555-0127', 'https://dianaprince.org', 'active', true, 'admin', 'hr', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 98000, 4, 12, ARRAY['security']::user_skill[], '2022-02-14', '2023-07-22 13:15:00', '2023-07-22 13:15:00', '15:45', 'HR director focusing on security compliance'),
  ('Ethan Hunt', 'ethan.hunt@example.com', '+1 (555) 555-0128', 'https://ethanhunt.dev', 'inactive', true, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 110000, 5, 20, ARRAY['devops', 'cloud']::user_skill[], '2021-11-30', '2023-04-05 09:30:00', '2023-04-05 09:30:00', '11:20', 'Operations lead with DevOps expertise'),
  ('Fiona Gallagher', 'fiona.gallagher@example.com', '+1 (555) 555-0129', 'https://fionag.io', 'active', false, 'user', 'finance', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 88000, 4, 9, ARRAY['sql', 'nosql']::user_skill[], '2023-04-18', '2023-10-12 12:00:00', '2023-10-12 12:00:00', '08:30', 'Financial analyst with database management skills'),
  ('George Lucas', 'george.lucas@example.com', '+1 (555) 555-0130', 'https://georgelucas.tech', 'active', true, 'moderator', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 145000, 5, 35, ARRAY['java', 'javascript', 'cloud']::user_skill[], '2020-09-15', '2023-02-28 10:45:00', '2023-02-28 10:45:00', '17:00', 'Principal engineer specializing in Java systems'),
  ('Hannah Montana', 'hannah.montana@example.com', '+1 (555) 555-0131', 'https://hannahm.cloud', 'active', true, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 72000, 3, 11, ARRAY['sql']::user_skill[], '2022-12-01', '2023-08-17 14:20:00', '2023-08-17 14:20:00', '12:15', 'Content marketing specialist'),
  ('Isaac Newton', 'isaac.newton@example.com', '+1 (555) 555-0132', 'https://isaac.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 115000, 4, 28, ARRAY['rust', 'go']::user_skill[], '2022-05-20', '2023-09-10 09:00:00', '2023-09-10 09:00:00', '08:00', 'Backend engineer focused on performance'),
  ('Julia Roberts', 'julia.roberts@example.com', '+1 (555) 555-0133', 'https://juliar.net', 'pending', false, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 82000, 3, 7, ARRAY['javascript']::user_skill[], '2023-07-01', '2023-10-05 11:30:00', '2023-10-05 11:30:00', '10:30', 'UI/UX designer with frontend development skills'),
  ('Kevin Hart', 'kevin.hart@example.com', '+1 (555) 555-0134', 'https://kevinh.io', 'active', true, 'admin', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 135000, 5, 42, ARRAY['devops', 'security', 'cloud']::user_skill[], '2020-01-15', '2023-03-12 14:00:00', '2023-03-12 14:00:00', '13:00', 'Head of operations and security'),
  ('Laura Palmer', 'laura.palmer@example.com', '+1 (555) 555-0135', 'https://laurap.com', 'active', false, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 70000, 3, 6, NULL, '2023-03-10', '2023-08-25 10:15:00', '2023-08-25 10:15:00', '09:45', 'Junior sales associate'),
  ('Michael Scott', 'michael.scott@example.com', '+1 (555) 555-0136', 'https://michaels.org', 'active', true, 'moderator', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 105000, 4, 18, ARRAY['sql']::user_skill[], '2021-06-20', '2023-07-08 13:30:00', '2023-07-08 13:30:00', '12:30', 'Sales team lead with CRM expertise'),
  ('Nancy Drew', 'nancy.drew@example.com', '+1 (555) 555-0137', 'https://nancyd.dev', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 98000, 4, 21, ARRAY['php', 'sql', 'javascript']::user_skill[], '2022-09-05', '2023-11-15 08:45:00', '2023-11-15 08:45:00', '08:15', 'Full-stack developer with PHP expertise'),
  ('Oscar Wilde', 'oscar.wilde@example.com', '+1 (555) 555-0138', 'https://oscarw.tech', 'inactive', false, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 75000, 2, 4, ARRAY['nosql']::user_skill[], '2023-02-28', '2023-06-30 15:00:00', '2023-06-30 15:00:00', '14:00', 'Marketing analyst on extended leave'),
  ('Patricia Lee', 'patricia.lee@example.com', '+1 (555) 555-0139', 'https://patricial.io', 'active', true, 'user', 'hr', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 85000, 4, 13, ARRAY['security']::user_skill[], '2022-11-12', '2023-09-20 11:20:00', '2023-09-20 11:20:00', '10:50', 'HR specialist focusing on compliance'),
  ('Quincy Jones', 'quincy.jones@example.com', '+1 (555) 555-0140', 'https://quincyj.net', 'active', false, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 92000, 4, 16, ARRAY['sql', 'nosql', 'cloud']::user_skill[], '2022-04-15', '2023-08-08 09:30:00', '2023-08-08 09:30:00', '09:00', 'Product manager with technical background'),
  ('Rachel Green', 'rachel.green@example.com', '+1 (555) 555-0141', 'https://rachelg.com', 'active', true, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 88000, 4, 19, ARRAY['javascript', 'nosql']::user_skill[], '2021-12-01', '2023-10-18 14:15:00', '2023-10-18 14:15:00', '13:45', 'Senior product designer'),
  ('Sam Wilson', 'sam.wilson@example.com', '+1 (555) 555-0142', 'https://samw.dev', 'pending', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 102000, 3, 12, ARRAY['swift', 'kotlin']::user_skill[], '2023-08-01', '2023-11-22 10:00:00', '2023-11-22 10:00:00', '09:30', 'Mobile developer specializing in iOS and Android'),
  ('Tina Fey', 'tina.fey@example.com', '+1 (555) 555-0143', 'https://tinaf.org', 'active', true, 'moderator', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 118000, 5, 27, ARRAY['sql', 'cloud']::user_skill[], '2021-08-20', '2023-05-25 12:45:00', '2023-05-25 12:45:00', '12:15', 'Senior product manager'),
  ('Uma Thurman', 'uma.thurman@example.com', '+1 (555) 555-0144', 'https://umat.io', 'active', false, 'user', 'finance', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 79000, 3, 8, ARRAY['sql']::user_skill[], '2023-01-20', '2023-07-14 08:30:00', '2023-07-14 08:30:00', '08:00', 'Financial operations coordinator'),
  ('Victor Hugo', 'victor.hugo@example.com', '+1 (555) 555-0145', 'https://victorh.tech', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 155000, 5, 40, ARRAY['java', 'go', 'cloud', 'devops']::user_skill[], '2020-03-10', '2023-04-16 15:30:00', '2023-04-16 15:30:00', '15:00', 'VP of Engineering'),
  ('Wendy Williams', 'wendy.williams@example.com', '+1 (555) 555-0146', 'https://wendyw.net', 'active', true, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 76000, 3, 10, NULL, '2022-10-05', '2023-11-02 10:45:00', '2023-11-02 10:45:00', '10:15', 'Marketing coordinator'),
  ('Xavier Martinez', 'xavier.martinez@example.com', '+1 (555) 555-0147', 'https://xavierm.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 105000, 4, 24, ARRAY['rust', 'javascript', 'cloud']::user_skill[], '2022-02-28', '2023-06-19 13:00:00', '2023-06-19 13:00:00', '12:30', 'Systems engineer with Rust expertise'),
  ('Yolanda Garcia', 'yolanda.garcia@example.com', '+1 (555) 555-0148', 'https://yolandag.io', 'inactive', true, 'user', 'hr', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 81000, 3, 9, ARRAY['security']::user_skill[], '2022-07-15', '2023-09-28 11:15:00', '2023-09-28 11:15:00', '11:00', 'HR coordinator currently on maternity leave'),
  ('Zachary Taylor', 'zachary.taylor@example.com', '+1 (555) 555-0149', 'https://zacharyt.com', 'active', true, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 73000, 3, 7, NULL, '2023-05-10', '2023-10-21 09:20:00', '2023-10-21 09:20:00', '09:00', 'Sales development representative'),
  ('Amy Adams', 'amy.adams@example.com', '+1 (555) 555-0150', 'https://amya.org', 'active', false, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 91000, 4, 17, ARRAY['javascript', 'php']::user_skill[], '2021-11-08', '2023-08-03 14:30:00', '2023-08-03 14:30:00', '14:00', 'Product designer with frontend skills'),
  ('Brian Cox', 'brian.cox@example.com', '+1 (555) 555-0151', 'https://brianc.dev', 'active', true, 'moderator', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 132000, 5, 33, ARRAY['java', 'sql', 'cloud']::user_skill[], '2020-12-15', '2023-03-27 10:00:00', '2023-03-27 10:00:00', '09:30', 'Senior engineering manager'),
  ('Catherine Zeta', 'catherine.zeta@example.com', '+1 (555) 555-0152', 'https://catherinez.tech', 'pending', false, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 68000, 2, 3, NULL, '2023-09-01', '2023-12-05 11:00:00', '2023-12-05 11:00:00', '10:30', 'New operations assistant in onboarding'),
  ('David Lee', 'david.lee@example.com', '+1 (555) 555-0153', 'https://davidl.io', 'active', true, 'user', 'finance', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 94000, 4, 14, ARRAY['sql', 'nosql']::user_skill[], '2022-03-18', '2023-07-11 12:15:00', '2023-07-11 12:15:00', '11:45', 'Senior financial analyst'),
  ('Emma Watson', 'emma.watson@example.com', '+1 (555) 555-0154', 'https://emmaw.net', 'active', true, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 99000, 4, 20, ARRAY['sql', 'cloud']::user_skill[], '2021-10-22', '2023-09-05 13:45:00', '2023-09-05 13:45:00', '13:15', 'Product owner with technical expertise'),
  ('Frank Miller', 'frank.miller@example.com', '+1 (555) 555-0155', 'https://frankm.com', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 108000, 4, 25, ARRAY['go', 'devops', 'cloud']::user_skill[], '2022-01-10', '2023-05-30 08:50:00', '2023-05-30 08:50:00', '08:20', 'Platform engineer'),
  ('Grace Hopper', 'grace.hopper@example.com', '+1 (555) 555-0156', 'https://graceh.dev', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 165000, 5, 45, ARRAY['java', 'go', 'rust', 'cloud']::user_skill[], '2019-11-01', '2023-02-14 15:00:00', '2023-02-14 15:00:00', '14:30', 'Distinguished engineer and technical fellow'),
  ('Henry Ford', 'henry.ford@example.com', '+1 (555) 555-0157', 'https://henryf.org', 'inactive', false, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 71000, 2, 5, NULL, '2023-06-15', '2023-10-28 10:30:00', '2023-10-28 10:30:00', '10:00', 'Sales associate on performance improvement plan'),
  ('Iris West', 'iris.west@example.com', '+1 (555) 555-0158', 'https://irisw.io', 'active', true, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 84000, 4, 15, ARRAY['sql', 'nosql']::user_skill[], '2022-08-25', '2023-11-09 09:15:00', '2023-11-09 09:15:00', '08:45', 'Marketing data analyst'),
  ('Jack Ryan', 'jack.ryan@example.com', '+1 (555) 555-0159', 'https://jackr.tech', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 112000, 5, 29, ARRAY['kotlin', 'swift', 'cloud']::user_skill[], '2021-07-12', '2023-06-22 14:20:00', '2023-06-22 14:20:00', '13:50', 'Senior mobile engineer'),
  ('Karen Page', 'karen.page@example.com', '+1 (555) 555-0160', 'https://karenp.net', 'active', false, 'user', 'hr', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 77000, 3, 8, NULL, '2023-02-20', '2023-08-14 11:30:00', '2023-08-14 11:30:00', '11:00', 'HR generalist'),
  ('Leo Valdez', 'leo.valdez@example.com', '+1 (555) 555-0161', 'https://leov.dev', 'pending', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 95000, 3, 11, ARRAY['javascript', 'nosql']::user_skill[], '2023-07-20', '2023-11-28 10:00:00', '2023-11-28 10:00:00', '09:30', 'Frontend engineer pending background check'),
  ('Maria Hill', 'maria.hill@example.com', '+1 (555) 555-0162', 'https://mariah.com', 'active', true, 'moderator', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 121000, 5, 31, ARRAY['devops', 'security', 'cloud']::user_skill[], '2021-04-08', '2023-07-19 12:45:00', '2023-07-19 12:45:00', '12:15', 'Operations manager'),
  ('Nathan Drake', 'nathan.drake@example.com', '+1 (555) 555-0163', 'https://nathand.io', 'active', true, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 87000, 4, 16, ARRAY['javascript']::user_skill[], '2022-06-30', '2023-10-11 13:30:00', '2023-10-11 13:30:00', '13:00', 'UX designer with prototyping skills'),
  ('Olivia Pope', 'olivia.pope@example.com', '+1 (555) 555-0164', 'https://oliviap.org', 'active', true, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 103000, 4, 22, ARRAY['sql', 'cloud']::user_skill[], '2021-09-14', '2023-05-17 09:45:00', '2023-05-17 09:45:00', '09:15', 'Senior product manager'),
  ('Peter Parker', 'peter.parker@example.com', '+1 (555) 555-0165', 'https://peterp.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 101000, 4, 23, ARRAY['php', 'javascript', 'sql']::user_skill[], '2022-05-05', '2023-09-12 14:00:00', '2023-09-12 14:00:00', '13:30', 'Full-stack developer'),
  ('Quinn Fabray', 'quinn.fabray@example.com', '+1 (555) 555-0166', 'https://quinnf.tech', 'active', true, 'user', 'finance', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 89000, 4, 12, ARRAY['sql']::user_skill[], '2022-11-20', '2023-08-29 10:20:00', '2023-08-29 10:20:00', '09:50', 'Financial controller'),
  ('Ryan Reynolds', 'ryan.reynolds@example.com', '+1 (555) 555-0167', 'https://ryanr.net', 'active', true, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 80000, 4, 13, ARRAY['sql', 'nosql']::user_skill[], '2022-09-08', '2023-11-14 11:50:00', '2023-11-14 11:50:00', '11:20', 'Growth marketing specialist'),
  ('Sarah Connor', 'sarah.connor@example.com', '+1 (555) 555-0168', 'https://sarahc.io', 'active', false, 'admin', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 142000, 5, 38, ARRAY['security', 'devops', 'cloud']::user_skill[], '2020-07-22', '2023-04-20 15:15:00', '2023-04-20 15:15:00', '14:45', 'Director of security operations'),
  ('Tony Stark', 'tony.stark@example.com', '+1 (555) 555-0169', 'https://tonys.dev', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 180000, 5, 50, ARRAY['java', 'rust', 'go', 'cloud', 'devops']::user_skill[], '2019-06-10', '2023-01-25 16:00:00', '2023-01-25 16:00:00', '15:30', 'CTO and chief architect'),
  ('Ursula Vernon', 'ursula.vernon@example.com', '+1 (555) 555-0170', 'https://ursulav.com', 'inactive', true, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 85000, 3, 10, ARRAY['javascript']::user_skill[], '2022-12-10', '2023-08-05 10:30:00', '2023-08-05 10:30:00', '10:00', 'Graphic designer on sabbatical'),
  ('Violet Baudelaire', 'violet.baudelaire@example.com', '+1 (555) 555-0171', 'https://violetb.org', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 107000, 4, 26, ARRAY['rust', 'go', 'cloud']::user_skill[], '2021-05-18', '2023-06-28 13:20:00', '2023-06-28 13:20:00', '12:50', 'Backend systems engineer'),
  ('Wade Wilson', 'wade.wilson@example.com', '+1 (555) 555-0172', 'https://wadew.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 98000, 3, 18, ARRAY['javascript', 'php']::user_skill[], '2022-10-15', '2023-11-05 09:00:00', '2023-11-05 09:00:00', '08:30', 'Full-stack engineer'),
  ('Xena Warrior', 'xena.warrior@example.com', '+1 (555) 555-0173', 'https://xenaw.io', 'active', true, 'moderator', 'hr', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 115000, 5, 24, ARRAY['security']::user_skill[], '2021-03-05', '2023-07-07 14:40:00', '2023-07-07 14:40:00', '14:10', 'HR director and compliance officer'),
  ('Yvonne Strahovski', 'yvonne.strahovski@example.com', '+1 (555) 555-0174', 'https://yvonnes.tech', 'active', true, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 96000, 4, 19, ARRAY['sql', 'cloud']::user_skill[], '2022-04-22', '2023-09-18 10:55:00', '2023-09-18 10:55:00', '10:25', 'Product manager'),
  ('Zoe Saldana', 'zoe.saldana@example.com', '+1 (555) 555-0175', 'https://zoes.net', 'pending', false, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 69000, 2, 4, NULL, '2023-08-15', '2023-12-01 11:10:00', '2023-12-01 11:10:00', '10:40', 'Junior sales representative'),
  ('Aaron Burr', 'aaron.burr@example.com', '+1 (555) 555-0176', 'https://aaronb.com', 'active', true, 'user', 'finance', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 92000, 4, 15, ARRAY['sql', 'nosql']::user_skill[], '2022-07-08', '2023-10-16 12:25:00', '2023-10-16 12:25:00', '11:55', 'Senior accountant'),
  ('Beatrice Prior', 'beatrice.prior@example.com', '+1 (555) 555-0177', 'https://beatricep.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 104000, 4, 21, ARRAY['java', 'cloud']::user_skill[], '2022-03-12', '2023-08-21 08:35:00', '2023-08-21 08:35:00', '08:05', 'Software engineer'),
  ('Connor Kenway', 'connor.kenway@example.com', '+1 (555) 555-0178', 'https://connectk.io', 'active', true, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 86000, 4, 14, ARRAY['devops', 'cloud']::user_skill[], '2022-09-20', '2023-11-12 13:50:00', '2023-11-12 13:50:00', '13:20', 'DevOps engineer'),
  ('Daenerys Targaryen', 'daenerys.targaryen@example.com', '+1 (555) 555-0179', 'https://daenerystart.org', 'active', true, 'moderator', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 125000, 5, 32, ARRAY['sql', 'cloud', 'nosql']::user_skill[], '2020-11-18', '2023-05-09 15:25:00', '2023-05-09 15:25:00', '14:55', 'Director of product management'),
  ('Elliot Alderson', 'elliot.alderson@example.com', '+1 (555) 555-0180', 'https://elliota.tech', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 116000, 5, 30, ARRAY['security', 'rust', 'go']::user_skill[], '2021-06-25', '2023-07-15 09:40:00', '2023-07-15 09:40:00', '09:10', 'Security engineer'),
  ('Felicity Smoak', 'felicity.smoak@example.com', '+1 (555) 555-0181', 'https://felicitys.net', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 109000, 4, 27, ARRAY['javascript', 'sql', 'cloud']::user_skill[], '2021-08-14', '2023-10-03 14:10:00', '2023-10-03 14:10:00', '13:40', 'Full-stack engineer with security focus'),
  ('Geralt Rivia', 'geralt.rivia@example.com', '+1 (555) 555-0182', 'https://geraltr.dev', 'inactive', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 111000, 4, 22, ARRAY['go', 'rust']::user_skill[], '2021-12-03', '2023-06-12 11:05:00', '2023-06-12 11:05:00', '10:35', 'Systems engineer on extended leave'),
  ('Hermione Granger', 'hermione.granger@example.com', '+1 (555) 555-0183', 'https://hermioneg.io', 'active', true, 'moderator', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 128000, 5, 34, ARRAY['java', 'javascript', 'cloud']::user_skill[], '2020-10-07', '2023-04-28 12:30:00', '2023-04-28 12:30:00', '12:00', 'Engineering team lead'),
  ('Inigo Montoya', 'inigo.montoya@example.com', '+1 (555) 555-0184', 'https://inigom.com', 'active', false, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 75000, 3, 9, NULL, '2023-01-28', '2023-07-26 10:15:00', '2023-07-26 10:15:00', '09:45', 'Account executive'),
  ('Jessica Jones', 'jessica.jones@example.com', '+1 (555) 555-0185', 'https://jessicaj.org', 'active', true, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 88000, 4, 16, ARRAY['security', 'devops']::user_skill[], '2022-05-30', '2023-09-22 11:45:00', '2023-09-22 11:45:00', '11:15', 'Security operations analyst'),
  ('Katniss Everdeen', 'katniss.everdeen@example.com', '+1 (555) 555-0186', 'https://katnisse.dev', 'active', true, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 97000, 4, 20, ARRAY['sql']::user_skill[], '2022-02-16', '2023-08-11 13:05:00', '2023-08-11 13:05:00', '12:35', 'Product analyst'),
  ('Luke Skywalker', 'luke.skywalker@example.com', '+1 (555) 555-0187', 'https://lukes.tech', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 105000, 4, 24, ARRAY['cloud', 'devops', 'java']::user_skill[], '2022-01-22', '2023-06-05 09:25:00', '2023-06-05 09:25:00', '08:55', 'Cloud platform engineer'),
  ('Moana Waialiki', 'moana.waialiki@example.com', '+1 (555) 555-0188', 'https://moanaw.net', 'pending', false, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 83000, 3, 11, ARRAY['javascript']::user_skill[], '2023-07-10', '2023-11-20 10:50:00', '2023-11-20 10:50:00', '10:20', 'Product designer in probation period'),
  ('Naruto Uzumaki', 'naruto.uzumaki@example.com', '+1 (555) 555-0189', 'https://narutou.io', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 100000, 4, 22, ARRAY['javascript', 'nosql']::user_skill[], '2022-04-08', '2023-09-27 14:35:00', '2023-09-27 14:35:00', '14:05', 'Frontend engineer'),
  ('Optimus Prime', 'optimus.prime@example.com', '+1 (555) 555-0190', 'https://optimusp.com', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 172000, 5, 48, ARRAY['java', 'go', 'rust', 'cloud', 'devops']::user_skill[], '2019-09-12', '2023-03-08 15:45:00', '2023-03-08 15:45:00', '15:15', 'SVP of engineering'),
  ('Phoebe Buffay', 'phoebe.buffay@example.com', '+1 (555) 555-0191', 'https://phoebeb.org', 'active', false, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 78000, 3, 10, NULL, '2022-10-28', '2023-11-08 09:30:00', '2023-11-08 09:30:00', '09:00', 'Marketing coordinator'),
  ('Quasimodo Bell', 'quasimodo.bell@example.com', '+1 (555) 555-0192', 'https://quasimodob.dev', 'active', true, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 84000, 4, 13, ARRAY['devops']::user_skill[], '2022-08-18', '2023-10-25 12:00:00', '2023-10-25 12:00:00', '11:30', 'Operations engineer'),
  ('Rey Skywalker', 'rey.skywalker@example.com', '+1 (555) 555-0193', 'https://reys.tech', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 113000, 5, 28, ARRAY['kotlin', 'swift', 'cloud']::user_skill[], '2021-07-28', '2023-07-03 10:40:00', '2023-07-03 10:40:00', '10:10', 'Senior mobile developer'),
  ('Samwise Gamgee', 'samwise.gamgee@example.com', '+1 (555) 555-0194', 'https://samwiseg.net', 'active', false, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 81000, 3, 12, ARRAY['cloud']::user_skill[], '2022-11-05', '2023-08-18 11:20:00', '2023-08-18 11:20:00', '10:50', 'Cloud operations specialist'),
  ('Thanos Titan', 'thanos.titan@example.com', '+1 (555) 555-0195', 'https://thanost.io', 'inactive', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 95000, 2, 8, ARRAY['java']::user_skill[], '2023-03-15', '2023-09-08 13:15:00', '2023-09-08 13:15:00', '12:45', 'Software engineer terminated'),
  ('Uriah Heep', 'uriah.heep@example.com', '+1 (555) 555-0196', 'https://uriahh.com', 'active', true, 'user', 'finance', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 90000, 4, 14, ARRAY['sql', 'nosql']::user_skill[], '2022-06-12', '2023-10-09 09:50:00', '2023-10-09 09:50:00', '09:20', 'Financial systems analyst'),
  ('Veronica Mars', 'veronica.mars@example.com', '+1 (555) 555-0197', 'https://veronicam.org', 'active', true, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 101000, 4, 21, ARRAY['sql', 'cloud']::user_skill[], '2021-09-22', '2023-05-22 14:25:00', '2023-05-22 14:25:00', '13:55', 'Senior product manager'),
  ('William Wallace', 'william.wallace@example.com', '+1 (555) 555-0198', 'https://williamw.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 106000, 4, 25, ARRAY['go', 'cloud', 'devops']::user_skill[], '2022-01-30', '2023-07-28 08:45:00', '2023-07-28 08:45:00', '08:15', 'Platform engineer'),
  ('Xander Harris', 'xander.harris@example.com', '+1 (555) 555-0199', 'https://xanderh.tech', 'active', true, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 79000, 3, 10, NULL, '2023-04-05', '2023-10-14 10:05:00', '2023-10-14 10:05:00', '09:35', 'IT operations technician'),
  ('Ygritte Snow', 'ygritte.snow@example.com', '+1 (555) 555-0200', 'https://ygittes.net', 'active', true, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 89000, 4, 17, ARRAY['javascript']::user_skill[], '2022-07-20', '2023-11-03 13:40:00', '2023-11-03 13:40:00', '13:10', 'Senior UX designer'),
  ('Zelda Hyrule', 'zelda.hyrule@example.com', '+1 (555) 555-0201', 'https://zeldah.io', 'active', false, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 94000, 4, 18, ARRAY['sql']::user_skill[], '2022-05-15', '2023-09-16 11:55:00', '2023-09-16 11:55:00', '11:25', 'Product owner'),
  ('Adrian Monk', 'adrian.monk@example.com', '+1 (555) 555-0202', 'https://adrianm.com', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 110000, 5, 26, ARRAY['security', 'java', 'cloud']::user_skill[], '2021-10-18', '2023-06-09 12:10:00', '2023-06-09 12:10:00', '11:40', 'Security engineer'),
  ('Buffy Summers', 'buffy.summers@example.com', '+1 (555) 555-0203', 'https://buffys.org', 'active', true, 'moderator', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 119000, 5, 29, ARRAY['security', 'devops', 'cloud']::user_skill[], '2021-05-03', '2023-07-21 15:05:00', '2023-07-21 15:05:00', '14:35', 'Security operations manager'),
  ('Clark Kent', 'clark.kent@example.com', '+1 (555) 555-0204', 'https://clarkk.dev', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 102000, 4, 23, ARRAY['javascript', 'php', 'sql']::user_skill[], '2022-03-25', '2023-08-27 09:15:00', '2023-08-27 09:15:00', '08:45', 'Full-stack developer'),
  ('Donna Noble', 'donna.noble@example.com', '+1 (555) 555-0205', 'https://donnan.tech', 'pending', false, 'user', 'hr', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 72000, 3, 6, NULL, '2023-08-22', '2023-12-04 10:25:00', '2023-12-04 10:25:00', '09:55', 'HR assistant in training'),
  ('Ezio Auditore', 'ezio.auditore@example.com', '+1 (555) 555-0206', 'https://ezioa.net', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 114000, 5, 30, ARRAY['swift', 'kotlin', 'cloud']::user_skill[], '2021-06-08', '2023-06-17 14:50:00', '2023-06-17 14:50:00', '14:20', 'Lead mobile engineer'),
  ('Frodo Baggins', 'frodo.baggins@example.com', '+1 (555) 555-0207', 'https://frodob.io', 'active', false, 'user', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 93000, 4, 17, ARRAY['sql', 'cloud']::user_skill[], '2022-09-12', '2023-11-07 11:35:00', '2023-11-07 11:35:00', '11:05', 'Product manager'),
  ('Gandalf Grey', 'gandalf.grey@example.com', '+1 (555) 555-0208', 'https://gandalfg.com', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 175000, 5, 52, ARRAY['java', 'go', 'rust', 'cloud', 'devops', 'security']::user_skill[], '2019-05-15', '2023-01-18 16:15:00', '2023-01-18 16:15:00', '15:45', 'Chief architect'),
  ('Harry Potter', 'harry.potter@example.com', '+1 (555) 555-0209', 'https://harryp.org', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 108000, 4, 26, ARRAY['java', 'javascript', 'sql']::user_skill[], '2021-11-28', '2023-08-02 10:20:00', '2023-08-02 10:20:00', '09:50', 'Software engineer'),
  ('Indiana Jones', 'indiana.jones@example.com', '+1 (555) 555-0210', 'https://indianaj.dev', 'active', false, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 87000, 4, 15, ARRAY['devops', 'cloud']::user_skill[], '2022-07-05', '2023-10-19 13:25:00', '2023-10-19 13:25:00', '12:55', 'DevOps engineer'),
  ('Jon Snow', 'jon.snow@example.com', '+1 (555) 555-0211', 'https://jons.tech', 'active', true, 'moderator', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 126000, 5, 33, ARRAY['go', 'cloud', 'devops']::user_skill[], '2020-12-20', '2023-04-11 09:35:00', '2023-04-11 09:35:00', '09:05', 'Engineering manager'),
  ('Kara Danvers', 'kara.danvers@example.com', '+1 (555) 555-0212', 'https://karad.net', 'active', true, 'user', 'marketing', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 82000, 4, 14, ARRAY['sql', 'nosql']::user_skill[], '2022-08-08', '2023-11-11 10:45:00', '2023-11-11 10:45:00', '10:15', 'Marketing analytics lead'),
  ('Lara Croft', 'lara.croft@example.com', '+1 (555) 555-0213', 'https://larac.io', 'active', false, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 91000, 4, 18, ARRAY['javascript', 'php']::user_skill[], '2022-04-18', '2023-09-25 14:15:00', '2023-09-25 14:15:00', '13:45', 'Senior product designer'),
  ('Max Rockatansky', 'max.rockatansky@example.com', '+1 (555) 555-0214', 'https://maxr.com', 'inactive', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 97000, 3, 14, ARRAY['rust', 'go']::user_skill[], '2022-10-02', '2023-07-12 11:00:00', '2023-07-12 11:00:00', '10:30', 'Systems engineer on medical leave'),
  ('Neo Anderson', 'neo.anderson@example.com', '+1 (555) 555-0215', 'https://neoa.org', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 118000, 5, 31, ARRAY['security', 'rust', 'go', 'cloud']::user_skill[], '2021-04-20', '2023-05-14 15:30:00', '2023-05-14 15:30:00', '15:00', 'Senior security engineer'),
  ('Obi-Wan Kenobi', 'obiwan.kenobi@example.com', '+1 (555) 555-0216', 'https://obiwank.dev', 'active', true, 'moderator', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 131000, 5, 35, ARRAY['java', 'cloud', 'devops']::user_skill[], '2020-08-14', '2023-03-22 12:50:00', '2023-03-22 12:50:00', '12:20', 'Principal engineer'),
  ('Percy Jackson', 'percy.jackson@example.com', '+1 (555) 555-0217', 'https://percyj.tech', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 99000, 4, 20, ARRAY['javascript', 'nosql']::user_skill[], '2022-06-17', '2023-10-06 08:55:00', '2023-10-06 08:55:00', '08:25', 'Frontend engineer'),
  ('Quorra Flynn', 'quorra.flynn@example.com', '+1 (555) 555-0218', 'https://quorraf.net', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 104000, 4, 22, ARRAY['cloud', 'devops', 'go']::user_skill[], '2022-02-09', '2023-08-23 13:10:00', '2023-08-23 13:10:00', '12:40', 'Cloud infrastructure engineer'),
  ('Rick Grimes', 'rick.grimes@example.com', '+1 (555) 555-0219', 'https://rickg.io', 'active', true, 'user', 'operations', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 91000, 4, 17, ARRAY['security', 'devops']::user_skill[], '2022-05-22', '2023-09-30 11:40:00', '2023-09-30 11:40:00', '11:10', 'Security operations engineer'),
  ('Sherlock Holmes', 'sherlock.holmes@example.com', '+1 (555) 555-0220', 'https://sherlockh.com', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 168000, 5, 46, ARRAY['security', 'java', 'go', 'rust', 'cloud']::user_skill[], '2019-10-25', '2023-02-06 15:50:00', '2023-02-06 15:50:00', '15:20', 'VP of security engineering'),
  ('Thor Odinson', 'thor.odinson@example.com', '+1 (555) 555-0221', 'https://thoro.org', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 112000, 5, 27, ARRAY['cloud', 'devops', 'java']::user_skill[], '2021-07-15', '2023-07-01 10:30:00', '2023-07-01 10:30:00', '10:00', 'Cloud platform engineer'),
  ('Usagi Tsukino', 'usagi.tsukino@example.com', '+1 (555) 555-0222', 'https://usagit.dev', 'pending', false, 'user', 'design', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 80000, 3, 9, ARRAY['javascript']::user_skill[], '2023-09-05', '2023-12-03 11:15:00', '2023-12-03 11:15:00', '10:45', 'UX designer in onboarding'),
  ('Vincent Vega', 'vincent.vega@example.com', '+1 (555) 555-0223', 'https://vincentv.tech', 'active', true, 'user', 'sales', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 77000, 3, 11, NULL, '2022-11-18', '2023-08-30 09:40:00', '2023-08-30 09:40:00', '09:10', 'Senior account executive'),
  ('Wanda Maximoff', 'wanda.maximoff@example.com', '+1 (555) 555-0224', 'https://wandam.net', 'active', true, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 107000, 4, 24, ARRAY['rust', 'go', 'cloud']::user_skill[], '2021-09-30', '2023-06-15 14:05:00', '2023-06-15 14:05:00', '13:35', 'Backend engineer'),
  ('Xavier Charles', 'xavier.charles@example.com', '+1 (555) 555-0225', 'https://xavierc.io', 'active', true, 'admin', 'product', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 148000, 5, 40, ARRAY['sql', 'cloud', 'nosql']::user_skill[], '2020-06-18', '2023-04-25 16:20:00', '2023-04-25 16:20:00', '15:50', 'Chief product officer'),
  ('Yoda Master', 'yoda.master@example.com', '+1 (555) 555-0226', 'https://yodam.com', 'active', true, 'admin', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 185000, 5, 55, ARRAY['java', 'go', 'rust', 'cloud', 'devops', 'security']::user_skill[], '2018-12-01', '2023-01-10 17:00:00', '2023-01-10 17:00:00', '16:30', 'Chief technology officer'),
  ('Zuko Prince', 'zuko.prince@example.com', '+1 (555) 555-0227', 'https://zukop.org', 'active', false, 'user', 'engineering', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 103000, 4, 21, ARRAY['kotlin', 'swift']::user_skill[], '2022-03-08', '2023-09-14 12:35:00', '2023-09-14 12:35:00', '12:05', 'Mobile engineer');
