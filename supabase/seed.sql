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

-- Additional tasks for user@supasheet.dev (b73eb03e-fb7a-424d-84ff-18e2791ce0b4) - 92 more tasks
INSERT INTO tasks (id, title, description, status, priority, account_id, due_date, completed_at, tags, is_important, completion, duration, color, notes, created_at, updated_at, cover) VALUES
-- Task batch 1 (same day)
(extensions.uuid_generate_v4(), 'Review code pull requests', 'Review pending PRs from the team', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '15 days', NULL, ARRAY['work', 'code-review'], true, 60, 2, '#f59e0b', 'Three PRs pending review', current_timestamp - interval '15 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=6H_nU_RMD3r6R6c9p6cK9V5MKpVqLjYxLBLmX_FcQlI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Write unit tests for API', 'Complete test coverage for new endpoints', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '13 days' + interval '1 day', NULL, ARRAY['work', 'testing', 'api'], false, 0, 4, '#3b82f6', 'Aim for 80% coverage', current_timestamp - interval '13 days', current_timestamp - interval '13 days', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=qZCk8d5mWFw-3cX2PxRXBU-sF_w9a1F6pGLOqBWQ6hk']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Prepare monthly budget', 'Review expenses and plan for next month', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '20 days' + interval '2 days', current_timestamp - interval '18 days', ARRAY['finance', 'personal'], true, 100, 3, '#10b981', 'Budget balanced successfully', current_timestamp - interval '20 days', current_timestamp - interval '18 days', ARRAY['https://fastly.picsum.photos/id/56/300/200.jpg?hmac=aBqmZpD_YPg_xMlNhxMWVJQYZJUvKGKHLLZl_rJLlxk']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Update LinkedIn profile', 'Add recent achievements and projects', 'in_progress', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '18 days' + interval '3 days', NULL, ARRAY['career', 'networking'], false, 45, 1, '#8b5cf6', 'Updated headline and summary', current_timestamp - interval '18 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/342/300/200.jpg?hmac=VyxJNYqKVYGQw1qKwWQmYqLkYKlqKhKqcHk7RkYYQkI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Organize team meeting', 'Schedule quarterly planning session', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '10 days' + interval '4 days', NULL, ARRAY['work', 'management', 'meeting'], true, 0, 2, '#ef4444', 'Need to coordinate with 8 people', current_timestamp - interval '10 days', current_timestamp - interval '10 days', ARRAY['https://fastly.picsum.photos/id/7/300/200.jpg?hmac=1RqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Research new framework', 'Evaluate NextJS 15 features', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '12 days' + interval '5 days', NULL, ARRAY['learning', 'programming', 'research'], false, 30, 8, '#06b6d4', 'Reviewing documentation and examples', current_timestamp - interval '12 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/119/300/200.jpg?hmac=7RqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'File tax documents', 'Gather receipts and prepare for filing', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '25 days' + interval '6 days', current_timestamp - interval '19 days', ARRAY['finance', 'personal', 'taxes'], true, 100, 5, '#22c55e', 'All documents submitted', current_timestamp - interval '25 days', current_timestamp - interval '19 days', ARRAY['https://fastly.picsum.photos/id/433/300/200.jpg?hmac=8RqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Setup development environment', 'Configure Docker containers for new project', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '8 days' + interval '7 days', NULL, ARRAY['work', 'devops', 'setup'], false, 0, 6, '#f97316', 'Need to install PostgreSQL and Redis', current_timestamp - interval '8 days', current_timestamp - interval '8 days', ARRAY['https://fastly.picsum.photos/id/152/300/200.jpg?hmac=9RqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Plan birthday party', 'Organize surprise party for friend', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '16 days' + interval '8 days', NULL, ARRAY['personal', 'social', 'event'], true, 70, 4, '#ec4899', 'Venue booked, need to finalize guest list', current_timestamp - interval '16 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/237/300/200.jpg?hmac=0RqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Refactor authentication module', 'Improve security and add OAuth support', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '11 days' + interval '9 days', NULL, ARRAY['work', 'security', 'refactoring'], true, 0, 12, '#dc2626', 'Critical security updates needed', current_timestamp - interval '11 days', current_timestamp - interval '11 days', ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=1SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Write blog post', 'Share learnings about microservices', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '22 days' + interval '10 days', current_timestamp - interval '12 days', ARRAY['writing', 'blog', 'tech'], false, 100, 6, '#84cc16', 'Published and received great feedback', current_timestamp - interval '22 days', current_timestamp - interval '12 days', ARRAY['https://fastly.picsum.photos/id/177/300/200.jpg?hmac=2SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Deploy hotfix to production', 'Fix critical bug in payment flow', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '30 days', current_timestamp - interval '30 days', ARRAY['work', 'deployment', 'bug-fix'], true, 100, 2, '#b91c1c', 'Hotfix deployed successfully', current_timestamp - interval '30 days', current_timestamp - interval '30 days', ARRAY['https://fastly.picsum.photos/id/111/300/200.jpg?hmac=3SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Review security audit report', 'Address vulnerabilities found in audit', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '9 days' + interval '1 day', NULL, ARRAY['work', 'security', 'audit'], true, 55, 8, '#dc2626', 'Fixed 12 out of 20 issues', current_timestamp - interval '9 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/453/300/200.jpg?hmac=4SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Buy new running shoes', 'Old ones are worn out', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '5 days' + interval '3 days', NULL, ARRAY['personal', 'shopping', 'fitness'], false, 0, 1, '#10b981', 'Need to try them on at store', current_timestamp - interval '5 days', current_timestamp - interval '5 days', ARRAY['https://fastly.picsum.photos/id/21/300/200.jpg?hmac=5SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Setup CI/CD pipeline', 'Automate testing and deployment', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '14 days' + interval '2 days', NULL, ARRAY['work', 'devops', 'automation'], true, 75, 10, '#f59e0b', 'GitHub Actions configured, testing integration', current_timestamp - interval '14 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=6SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Attend webinar on AI', 'Latest trends in machine learning', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '17 days' + interval '5 days', current_timestamp - interval '12 days', ARRAY['learning', 'ai', 'webinar'], false, 100, 2, '#6366f1', 'Great insights on LLMs', current_timestamp - interval '17 days', current_timestamp - interval '12 days', ARRAY['https://fastly.picsum.photos/id/25/300/200.jpg?hmac=7SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Create API documentation', 'Document all REST endpoints', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '6 days' + interval '7 days', NULL, ARRAY['work', 'documentation', 'api'], false, 0, 8, '#3b82f6', 'Using Swagger/OpenAPI spec', current_timestamp - interval '6 days', current_timestamp - interval '6 days', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=8SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Backup important files', 'Cloud backup of photos and documents', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '21 days' + interval '4 days', current_timestamp - interval '17 days', ARRAY['personal', 'backup', 'data'], false, 100, 3, '#14b8a6', 'All files backed up to Google Drive', current_timestamp - interval '21 days', current_timestamp - interval '17 days', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=9SqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Optimize database queries', 'Improve performance of slow queries', 'in_progress', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '7 days' + interval '6 days', NULL, ARRAY['work', 'database', 'optimization'], true, 85, 6, '#ef4444', 'Added indexes, testing performance', current_timestamp - interval '7 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/1025/300/200.jpg?hmac=0TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Plan vacation itinerary', 'Research activities for Japan trip', 'pending', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '19 days' + interval '8 days', NULL, ARRAY['personal', 'travel', 'planning'], false, 20, 5, '#8b5cf6', 'Found some interesting temples to visit', current_timestamp - interval '19 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/111/300/200.jpg?hmac=1TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Fix merge conflicts', 'Resolve conflicts in feature branch', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '28 days', current_timestamp - interval '28 days', ARRAY['work', 'git', 'code'], true, 100, 1, '#f59e0b', 'Conflicts resolved and merged', current_timestamp - interval '28 days', current_timestamp - interval '28 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=2TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Learn TypeScript advanced patterns', 'Study generics and utility types', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '24 days' + interval '10 days', NULL, ARRAY['learning', 'typescript', 'programming'], false, 40, 15, '#3b82f6', 'Completed 6 out of 15 lessons', current_timestamp - interval '24 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/430/300/200.jpg?hmac=3TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Conduct user interviews', 'Gather feedback on new feature', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '4 days' + interval '9 days', NULL, ARRAY['work', 'research', 'ux'], true, 0, 4, '#ec4899', 'Schedule interviews with 5 users', current_timestamp - interval '4 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/64/300/200.jpg?hmac=4TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Update dependencies', 'Upgrade npm packages to latest versions', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '26 days' + interval '2 days', current_timestamp - interval '24 days', ARRAY['work', 'maintenance', 'dependencies'], false, 100, 3, '#22c55e', 'All packages updated, tests passing', current_timestamp - interval '26 days', current_timestamp - interval '24 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=5TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Design database schema', 'Plan tables for new feature', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '11 days' + interval '1 day', NULL, ARRAY['work', 'database', 'design'], true, 50, 5, '#6366f1', 'Created ERD, reviewing with team', current_timestamp - interval '11 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/326/300/200.jpg?hmac=6TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Practice guitar', 'Learn new song for band practice', 'pending', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '8 days' + interval '3 days', NULL, ARRAY['personal', 'hobby', 'music'], false, 15, 10, '#f97316', 'Working on chord progressions', current_timestamp - interval '8 days', current_timestamp - interval '5 days', ARRAY['https://fastly.picsum.photos/id/145/300/200.jpg?hmac=7TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Prepare investor presentation', 'Create pitch deck for funding round', 'in_progress', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '6 days', NULL, ARRAY['work', 'business', 'presentation'], true, 65, 12, '#dc2626', 'Slides 75% complete, need financial projections', current_timestamp - interval '3 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/933/300/200.jpg?hmac=8TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Sort through old clothes', 'Donate items not worn in a year', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '23 days' + interval '4 days', current_timestamp - interval '19 days', ARRAY['personal', 'organization', 'donation'], false, 100, 2, '#84cc16', 'Donated 3 bags to charity', current_timestamp - interval '23 days', current_timestamp - interval '19 days', ARRAY['https://fastly.picsum.photos/id/416/300/200.jpg?hmac=9TqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Implement search functionality', 'Add full-text search to application', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '5 days' + interval '7 days', NULL, ARRAY['work', 'feature', 'search'], false, 0, 8, '#06b6d4', 'Considering Elasticsearch or PostgreSQL FTS', current_timestamp - interval '5 days', current_timestamp - interval '5 days', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=0UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Review contract terms', 'Read through new vendor agreement', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '6 days' + interval '5 days', NULL, ARRAY['work', 'legal', 'contracts'], true, 70, 3, '#f59e0b', 'Flagged a few items for legal review', current_timestamp - interval '6 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=1UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Emergency server restart', 'Fix memory leak issue', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '27 days', current_timestamp - interval '27 days', ARRAY['work', 'ops', 'emergency'], true, 100, 1, '#b91c1c', 'Server restarted, monitoring metrics', current_timestamp - interval '27 days', current_timestamp - interval '27 days', ARRAY['https://fastly.picsum.photos/id/111/300/200.jpg?hmac=2UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Study AWS certifications', 'Prepare for Solutions Architect exam', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '15 days' + interval '8 days', NULL, ARRAY['learning', 'aws', 'certification'], false, 25, 30, '#ff9900', 'Completed 3 out of 12 practice exams', current_timestamp - interval '15 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/119/300/200.jpg?hmac=3UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Build mobile app prototype', 'Create mockups for client review', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '12 days' + interval '10 days', NULL, ARRAY['work', 'design', 'mobile'], true, 80, 15, '#ec4899', 'Almost done with all screens', current_timestamp - interval '12 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/250/300/200.jpg?hmac=4UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Water house plants', 'Weekly watering routine', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '14 days' + interval '2 days', current_timestamp - interval '12 days', ARRAY['personal', 'home', 'plants'], false, 100, 1, '#22c55e', 'All plants watered and healthy', current_timestamp - interval '14 days', current_timestamp - interval '12 days', ARRAY['https://fastly.picsum.photos/id/152/300/200.jpg?hmac=5UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Configure monitoring alerts', 'Set up PagerDuty notifications', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '2 days' + interval '9 days', NULL, ARRAY['work', 'monitoring', 'devops'], true, 0, 4, '#dc2626', 'Critical for production readiness', current_timestamp - interval '2 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=6UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Write meeting notes', 'Document decisions from strategy session', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '20 days' + interval '1 day', current_timestamp - interval '19 days', ARRAY['work', 'documentation', 'meetings'], false, 100, 1, '#3b82f6', 'Notes shared with team', current_timestamp - interval '20 days', current_timestamp - interval '19 days', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=7UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Migrate to new hosting', 'Move application to better infrastructure', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '10 days' + interval '4 days', NULL, ARRAY['work', 'infrastructure', 'migration'], true, 60, 20, '#f97316', 'Database migrated, testing application', current_timestamp - interval '10 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=8UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Join online course', 'Enroll in advanced React patterns', 'pending', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '16 days' + interval '6 days', NULL, ARRAY['learning', 'react', 'course'], false, 0, 25, '#61dafb', 'Looking at Udemy and Frontend Masters', current_timestamp - interval '16 days', current_timestamp - interval '6 days', ARRAY['https://fastly.picsum.photos/id/119/300/200.jpg?hmac=9UqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Setup email automation', 'Configure drip campaign for onboarding', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '18 days' + interval '3 days', current_timestamp - interval '15 days', ARRAY['work', 'marketing', 'automation'], false, 100, 6, '#10b981', '5-email sequence created and tested', current_timestamp - interval '18 days', current_timestamp - interval '15 days', ARRAY['https://fastly.picsum.photos/id/342/300/200.jpg?hmac=0VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Create wireframes', 'Design new dashboard layout', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '9 days' + interval '7 days', NULL, ARRAY['work', 'design', 'ui'], true, 45, 8, '#8b5cf6', 'Completed desktop view, working on mobile', current_timestamp - interval '9 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/326/300/200.jpg?hmac=1VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Quick bug fix', 'Fix typo in error message', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '25 days', current_timestamp - interval '25 days', ARRAY['work', 'bug-fix', 'minor'], false, 100, 1, '#84cc16', 'Fixed and deployed', current_timestamp - interval '25 days', current_timestamp - interval '25 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=2VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Analyze user metrics', 'Review analytics data from last quarter', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '7 days' + interval '5 days', NULL, ARRAY['work', 'analytics', 'data'], false, 0, 5, '#06b6d4', 'Need to create dashboard in Tableau', current_timestamp - interval '7 days', current_timestamp - interval '7 days', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=3VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Conduct performance reviews', 'Annual review for team members', 'in_progress', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '13 days' + interval '10 days', NULL, ARRAY['work', 'management', 'hr'], true, 50, 16, '#ef4444', 'Completed 3 out of 6 reviews', current_timestamp - interval '13 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/114/300/200.jpg?hmac=4VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Order office supplies', 'Restock printer paper and pens', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '22 days' + interval '8 days', current_timestamp - interval '14 days', ARRAY['work', 'admin', 'supplies'], false, 100, 1, '#22c55e', 'Order received and distributed', current_timestamp - interval '22 days', current_timestamp - interval '14 days', ARRAY['https://fastly.picsum.photos/id/416/300/200.jpg?hmac=5VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Troubleshoot network issue', 'Fix intermittent connection drops', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '2 days', NULL, ARRAY['work', 'networking', 'troubleshooting'], true, 0, 4, '#dc2626', 'Suspect router configuration issue', current_timestamp - interval '3 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=6VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Write end-of-year report', 'Summarize achievements and goals', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '11 days' + interval '9 days', NULL, ARRAY['work', 'reporting', 'annual'], false, 35, 10, '#3b82f6', 'Drafted outline, collecting data', current_timestamp - interval '11 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=7VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Cancel unused subscriptions', 'Review and eliminate unnecessary services', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '19 days' + interval '1 day', current_timestamp - interval '18 days', ARRAY['finance', 'personal', 'savings'], false, 100, 2, '#84cc16', 'Cancelled 4 subscriptions, saving $50/month', current_timestamp - interval '19 days', current_timestamp - interval '18 days', ARRAY['https://fastly.picsum.photos/id/56/300/200.jpg?hmac=8VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Implement caching layer', 'Add Redis for improved performance', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '4 days' + interval '6 days', NULL, ARRAY['work', 'performance', 'caching'], true, 0, 8, '#ef4444', 'Critical for scaling to 10k users', current_timestamp - interval '4 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/1025/300/200.jpg?hmac=9VqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Schedule car maintenance', 'Book appointment for oil change', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '8 days' + interval '4 days', NULL, ARRAY['personal', 'auto', 'maintenance'], false, 50, 1, '#f97316', 'Called dealer, waiting for callback', current_timestamp - interval '8 days', current_timestamp - interval '5 days', ARRAY['https://fastly.picsum.photos/id/254/300/200.jpg?hmac=0WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Review pull request feedback', 'Address code review comments', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '24 days' + interval '7 days', current_timestamp - interval '17 days', ARRAY['work', 'code-review', 'git'], true, 100, 3, '#22c55e', 'All comments addressed and merged', current_timestamp - interval '24 days', current_timestamp - interval '17 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=1WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Setup development Wiki', 'Create internal documentation site', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '6 days' + interval '3 days', NULL, ARRAY['work', 'documentation', 'knowledge-base'], false, 0, 12, '#6366f1', 'Evaluating Confluence vs Notion', current_timestamp - interval '6 days', current_timestamp - interval '6 days', ARRAY['https://fastly.picsum.photos/id/326/300/200.jpg?hmac=2WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Approve expense report', 'Review team expense submissions', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '29 days', current_timestamp - interval '29 days', ARRAY['work', 'finance', 'admin'], false, 100, 1, '#10b981', 'All expenses approved', current_timestamp - interval '29 days', current_timestamp - interval '29 days', ARRAY['https://fastly.picsum.photos/id/56/300/200.jpg?hmac=3WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Design logo variations', 'Create alternate versions for dark mode', 'in_progress', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '17 days' + interval '5 days', NULL, ARRAY['work', 'design', 'branding'], false, 40, 6, '#ec4899', 'Created 3 variations, waiting for feedback', current_timestamp - interval '17 days', current_timestamp - interval '7 days', ARRAY['https://fastly.picsum.photos/id/237/300/200.jpg?hmac=4WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Negotiate salary increase', 'Prepare case for annual review', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '14 days' + interval '10 days', NULL, ARRAY['career', 'finance', 'negotiation'], true, 20, 8, '#f59e0b', 'Researching market rates', current_timestamp - interval '14 days', current_timestamp - interval '8 days', ARRAY['https://fastly.picsum.photos/id/904/300/200.jpg?hmac=5WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Test mobile responsiveness', 'Verify UI on different screen sizes', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '21 days' + interval '8 days', current_timestamp - interval '13 days', ARRAY['work', 'testing', 'mobile'], false, 100, 4, '#22c55e', 'Tested on 5 devices, all issues fixed', current_timestamp - interval '21 days', current_timestamp - interval '13 days', ARRAY['https://fastly.picsum.photos/id/250/300/200.jpg?hmac=6WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Install security updates', 'Apply OS patches to servers', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '1 day' + interval '2 days', NULL, ARRAY['work', 'security', 'maintenance'], true, 0, 3, '#dc2626', 'Scheduled for maintenance window', current_timestamp - interval '1 day', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=7WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Create video tutorial', 'Record walkthrough of new feature', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '12 days' + interval '9 days', NULL, ARRAY['work', 'video', 'documentation'], false, 55, 6, '#06b6d4', 'Script written, halfway through recording', current_timestamp - interval '12 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=8WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Fix broken link', 'Update URL in footer', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '16 days' + interval '1 day', current_timestamp - interval '15 days', ARRAY['work', 'bug-fix', 'website'], false, 100, 1, '#84cc16', 'Link updated and verified', current_timestamp - interval '16 days', current_timestamp - interval '15 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=9WqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Integrate payment gateway', 'Add Stripe checkout to platform', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '9 days' + interval '6 days', NULL, ARRAY['work', 'payment', 'integration'], true, 0, 15, '#635bff', 'Stripe account created, reviewing docs', current_timestamp - interval '9 days', current_timestamp - interval '9 days', ARRAY['https://fastly.picsum.photos/id/177/300/200.jpg?hmac=0XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Volunteer at food bank', 'Monthly community service', 'in_progress', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '5 days' + interval '4 days', NULL, ARRAY['personal', 'volunteer', 'community'], false, 0, 4, '#22c55e', 'Signed up for next Saturday', current_timestamp - interval '5 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/29/300/200.jpg?hmac=1XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Conduct A/B testing', 'Test two landing page variants', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '23 days' + interval '7 days', current_timestamp - interval '16 days', ARRAY['work', 'marketing', 'testing'], false, 100, 7, '#10b981', 'Variant B won with 15% higher conversion', current_timestamp - interval '23 days', current_timestamp - interval '16 days', ARRAY['https://fastly.picsum.photos/id/342/300/200.jpg?hmac=2XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Refactor legacy code', 'Modernize old authentication module', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '7 days' + interval '3 days', NULL, ARRAY['work', 'refactoring', 'tech-debt'], true, 0, 20, '#ef4444', 'High priority tech debt item', current_timestamp - interval '7 days', current_timestamp - interval '7 days', ARRAY['https://fastly.picsum.photos/id/1027/300/200.jpg?hmac=3XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Restart development server', 'Fix port conflict issue', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '26 days', current_timestamp - interval '26 days', ARRAY['work', 'dev', 'troubleshooting'], true, 100, 1, '#f59e0b', 'Server restarted on different port', current_timestamp - interval '26 days', current_timestamp - interval '26 days', ARRAY['https://fastly.picsum.photos/id/111/300/200.jpg?hmac=4XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Plan team building event', 'Organize quarterly offsite activity', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '18 days' + interval '10 days', NULL, ARRAY['work', 'team', 'culture'], false, 65, 8, '#8b5cf6', 'Booked venue, planning activities', current_timestamp - interval '18 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/99/300/200.jpg?hmac=5XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Renew SSL certificate', 'Update HTTPS certificate before expiry', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp + interval '5 days', NULL, ARRAY['work', 'security', 'ssl'], true, 0, 2, '#dc2626', 'Certificate expires in 15 days', current_timestamp, current_timestamp, ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=6XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Learn GraphQL', 'Study query language fundamentals', 'in_progress', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '13 days' + interval '8 days', NULL, ARRAY['learning', 'graphql', 'api'], false, 35, 20, '#e535ab', 'Completed basic queries, learning mutations', current_timestamp - interval '13 days', current_timestamp - interval '6 days', ARRAY['https://fastly.picsum.photos/id/119/300/200.jpg?hmac=7XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Submit expense report', 'File business trip expenses', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '17 days' + interval '2 days', current_timestamp - interval '15 days', ARRAY['work', 'finance', 'travel'], false, 100, 2, '#22c55e', 'Report submitted and approved', current_timestamp - interval '17 days', current_timestamp - interval '15 days', ARRAY['https://fastly.picsum.photos/id/56/300/200.jpg?hmac=8XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Build REST API endpoints', 'Create CRUD operations for products', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '4 days' + interval '9 days', NULL, ARRAY['work', 'api', 'backend'], true, 0, 12, '#3b82f6', 'Need to implement validation middleware', current_timestamp - interval '4 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=9XqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Update privacy policy', 'Revise terms for GDPR compliance', 'in_progress', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '2 days' + interval '6 days', NULL, ARRAY['work', 'legal', 'compliance'], true, 75, 5, '#ef4444', 'Legal team reviewing draft', current_timestamp - interval '2 days', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=0YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Reply to customer emails', 'Handle support inbox backlog', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '11 days' + interval '1 day', current_timestamp - interval '10 days', ARRAY['work', 'support', 'email'], true, 100, 3, '#22c55e', 'All 23 emails answered', current_timestamp - interval '11 days', current_timestamp - interval '10 days', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=1YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Attend Docker workshop', 'Learn container orchestration', 'pending', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '6 days' + interval '4 days', NULL, ARRAY['learning', 'docker', 'workshop'], false, 0, 4, '#2496ed', 'Workshop scheduled for next week', current_timestamp - interval '6 days', current_timestamp - interval '6 days', ARRAY['https://fastly.picsum.photos/id/122/300/200.jpg?hmac=2YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Prototype new feature', 'Build POC for real-time notifications', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '10 days' + interval '7 days', NULL, ARRAY['work', 'prototype', 'websocket'], true, 50, 10, '#f59e0b', 'WebSocket connection working, testing UI', current_timestamp - interval '10 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/431/300/200.jpg?hmac=3YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Get haircut', 'Schedule appointment at salon', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '15 days' + interval '3 days', current_timestamp - interval '12 days', ARRAY['personal', 'grooming'], false, 100, 1, '#84cc16', 'Haircut done, looks great', current_timestamp - interval '15 days', current_timestamp - interval '12 days', ARRAY['https://fastly.picsum.photos/id/466/300/200.jpg?hmac=4YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Clear browser cache', 'Fix local development issue', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '20 days', current_timestamp - interval '20 days', ARRAY['work', 'troubleshooting', 'dev'], false, 100, 1, '#3b82f6', 'Cache cleared, issue resolved', current_timestamp - interval '20 days', current_timestamp - interval '20 days', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=5YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Prepare conference talk', 'Create slides for tech conference', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp + interval '10 days', NULL, ARRAY['work', 'speaking', 'conference'], true, 0, 20, '#dc2626', 'Conference in 3 weeks, need to finish soon', current_timestamp, current_timestamp, ARRAY['https://fastly.picsum.photos/id/937/300/200.jpg?hmac=6YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5 days gap
(extensions.uuid_generate_v4(), 'Configure load balancer', 'Setup nginx for traffic distribution', 'in_progress', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '8 days' + interval '5 days', NULL, ARRAY['work', 'infrastructure', 'scaling'], true, 60, 8, '#10b981', 'Basic config done, testing failover', current_timestamp - interval '8 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=7YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8 days gap
(extensions.uuid_generate_v4(), 'Review book for club', 'Read and prepare discussion points', 'pending', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '12 days' + interval '8 days', NULL, ARRAY['personal', 'reading', 'book-club'], false, 40, 10, '#8b5cf6', 'Halfway through the book', current_timestamp - interval '12 days', current_timestamp - interval '8 days', ARRAY['https://fastly.picsum.photos/id/431/300/200.jpg?hmac=8YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2 days gap
(extensions.uuid_generate_v4(), 'Debug production error', 'Investigate 500 errors in logs', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '18 days' + interval '2 days', current_timestamp - interval '16 days', ARRAY['work', 'debugging', 'production'], true, 100, 4, '#b91c1c', 'Root cause found and fixed', current_timestamp - interval '18 days', current_timestamp - interval '16 days', ARRAY['https://fastly.picsum.photos/id/111/300/200.jpg?hmac=9YqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9 days gap
(extensions.uuid_generate_v4(), 'Setup automated backups', 'Configure daily database snapshots', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '5 days' + interval '9 days', NULL, ARRAY['work', 'backup', 'database'], false, 70, 6, '#06b6d4', 'Cron job created, testing restore process', current_timestamp - interval '5 days', current_timestamp - interval '2 days', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=0ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6 days gap
(extensions.uuid_generate_v4(), 'Write product roadmap', 'Plan features for next quarter', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '6 days', NULL, ARRAY['work', 'product', 'planning'], true, 0, 12, '#f97316', 'Gathering stakeholder input', current_timestamp - interval '3 days', current_timestamp - interval '3 days', ARRAY['https://fastly.picsum.photos/id/793/300/200.jpg?hmac=1ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1 day gap
(extensions.uuid_generate_v4(), 'Pay utility bills', 'Submit payments before due date', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '13 days' + interval '1 day', current_timestamp - interval '12 days', ARRAY['finance', 'personal', 'bills'], false, 100, 1, '#22c55e', 'All bills paid on time', current_timestamp - interval '13 days', current_timestamp - interval '12 days', ARRAY['https://fastly.picsum.photos/id/56/300/200.jpg?hmac=2ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4 days gap
(extensions.uuid_generate_v4(), 'Implement feature flags', 'Add toggle system for gradual rollouts', 'pending', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '1 day' + interval '4 days', NULL, ARRAY['work', 'feature', 'deployment'], true, 0, 10, '#ef4444', 'Researching LaunchDarkly vs custom solution', current_timestamp - interval '1 day', current_timestamp - interval '1 day', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=3ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7 days gap
(extensions.uuid_generate_v4(), 'Mentor junior developer', 'Weekly 1-on-1 session', 'in_progress', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '9 days' + interval '7 days', NULL, ARRAY['work', 'mentoring', 'team'], false, 50, 2, '#8b5cf6', 'Discussed career growth and goals', current_timestamp - interval '9 days', current_timestamp - interval '4 days', ARRAY['https://fastly.picsum.photos/id/904/300/200.jpg?hmac=4ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3 days gap
(extensions.uuid_generate_v4(), 'Clean email inbox', 'Archive and organize emails', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '16 days' + interval '3 days', current_timestamp - interval '13 days', ARRAY['personal', 'organization', 'email'], false, 100, 2, '#84cc16', 'Inbox zero achieved', current_timestamp - interval '16 days', current_timestamp - interval '13 days', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=5ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day
(extensions.uuid_generate_v4(), 'Hotfix login bug', 'Users unable to authenticate', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '24 days', current_timestamp - interval '24 days', ARRAY['work', 'bug-fix', 'critical'], true, 100, 2, '#b91c1c', 'Session handling issue fixed', current_timestamp - interval '24 days', current_timestamp - interval '24 days', ARRAY['https://fastly.picsum.photos/id/111/300/200.jpg?hmac=6ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10 days gap
(extensions.uuid_generate_v4(), 'Redesign dashboard UI', 'Modernize user interface', 'pending', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp + interval '10 days', NULL, ARRAY['work', 'design', 'ui'], true, 0, 25, '#ec4899', 'User research completed, starting mockups', current_timestamp, current_timestamp, ARRAY['https://fastly.picsum.photos/id/326/300/200.jpg?hmac=7ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day tasks with hourly gaps (Busy Work Day - Nov 1st)
-- 8:00 AM - Start of workday
(extensions.uuid_generate_v4(), 'Check overnight monitoring alerts', 'Review system health dashboard', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '8 hours', current_timestamp - interval '3 days' + interval '8 hours' + interval '15 minutes', ARRAY['work', 'monitoring', 'daily'], true, 100, 1, '#10b981', 'All systems operational', current_timestamp - interval '3 days' + interval '8 hours', current_timestamp - interval '3 days' + interval '8 hours' + interval '15 minutes', ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=8ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9:00 AM - 1 hour gap
(extensions.uuid_generate_v4(), 'Daily standup meeting', 'Team sync on progress and blockers', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '9 hours', current_timestamp - interval '3 days' + interval '9 hours' + interval '30 minutes', ARRAY['work', 'meeting', 'scrum'], false, 100, 1, '#3b82f6', 'Discussed sprint progress', current_timestamp - interval '3 days' + interval '9 hours', current_timestamp - interval '3 days' + interval '9 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=9ZqJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9:30 AM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Review pull request #423', 'Code review for authentication module', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '9 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '10 hours', ARRAY['work', 'code-review', 'security'], true, 100, 1, '#f59e0b', 'Approved with minor suggestions', current_timestamp - interval '3 days' + interval '9 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '10 hours', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=0ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10:30 AM - 1 hour gap
(extensions.uuid_generate_v4(), 'Fix failing unit tests', 'Resolve test failures in CI pipeline', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '10 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '11 hours', ARRAY['work', 'testing', 'ci'], true, 100, 1, '#ef4444', 'Fixed 3 broken tests', current_timestamp - interval '3 days' + interval '10 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '11 hours', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=1ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 11:30 AM - 1 hour gap
(extensions.uuid_generate_v4(), 'Update project documentation', 'Add API endpoint examples', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '11 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '12 hours', ARRAY['work', 'documentation', 'api'], false, 100, 1, '#06b6d4', 'Added 5 new examples', current_timestamp - interval '3 days' + interval '11 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '12 hours', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=2ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 12:30 PM - 1 hour gap
(extensions.uuid_generate_v4(), 'Respond to Slack messages', 'Clear pending team communications', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '12 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '12 hours' + interval '45 minutes', ARRAY['work', 'communication', 'slack'], false, 100, 1, '#84cc16', 'Responded to 12 messages', current_timestamp - interval '3 days' + interval '12 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '12 hours' + interval '45 minutes', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=3ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 1:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Quick lunch break', 'Grab sandwich from cafe', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '13 hours', current_timestamp - interval '3 days' + interval '13 hours' + interval '30 minutes', ARRAY['personal', 'break'], false, 100, 1, '#22c55e', 'Recharged for afternoon', current_timestamp - interval '3 days' + interval '13 hours', current_timestamp - interval '3 days' + interval '13 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=4ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2:00 PM - 1 hour gap
(extensions.uuid_generate_v4(), 'Client demo call', 'Present new features to stakeholder', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '14 hours', current_timestamp - interval '3 days' + interval '15 hours', ARRAY['work', 'meeting', 'demo'], true, 100, 1, '#dc2626', 'Demo went well, got approval', current_timestamp - interval '3 days' + interval '14 hours', current_timestamp - interval '3 days' + interval '15 hours', ARRAY['https://fastly.picsum.photos/id/937/300/200.jpg?hmac=5ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3:00 PM - 1 hour gap
(extensions.uuid_generate_v4(), 'Optimize database query', 'Improve slow customer search', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '15 hours', current_timestamp - interval '3 days' + interval '16 hours', ARRAY['work', 'database', 'optimization'], true, 100, 1, '#f59e0b', 'Query time reduced by 80%', current_timestamp - interval '3 days' + interval '15 hours', current_timestamp - interval '3 days' + interval '16 hours', ARRAY['https://fastly.picsum.photos/id/1025/300/200.jpg?hmac=6ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4:00 PM - 1 hour gap
(extensions.uuid_generate_v4(), 'Update dependencies in package.json', 'Patch security vulnerabilities', 'completed', 'urgent', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '16 hours', current_timestamp - interval '3 days' + interval '16 hours' + interval '30 minutes', ARRAY['work', 'security', 'dependencies'], true, 100, 1, '#ef4444', 'Updated 8 packages', current_timestamp - interval '3 days' + interval '16 hours', current_timestamp - interval '3 days' + interval '16 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=7ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 4:30 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Run security scan', 'Execute automated vulnerability check', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '16 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '17 hours', ARRAY['work', 'security', 'scanning'], true, 100, 1, '#10b981', 'No critical issues found', current_timestamp - interval '3 days' + interval '16 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '17 hours', ARRAY['https://fastly.picsum.photos/id/1015/300/200.jpg?hmac=8ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Commit and push changes', 'Push daily work to feature branch', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '17 hours', current_timestamp - interval '3 days' + interval '17 hours' + interval '15 minutes', ARRAY['work', 'git', 'version-control'], false, 100, 1, '#3b82f6', 'Pushed 6 commits', current_timestamp - interval '3 days' + interval '17 hours', current_timestamp - interval '3 days' + interval '17 hours' + interval '15 minutes', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=9ArJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5:30 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Quick coffee break', 'Afternoon energy boost', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '17 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '17 hours' + interval '45 minutes', ARRAY['personal', 'break'], false, 100, 1, '#8b5cf6', 'Feeling refreshed', current_timestamp - interval '3 days' + interval '17 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '17 hours' + interval '45 minutes', ARRAY['https://fastly.picsum.photos/id/431/300/200.jpg?hmac=0BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Review sprint board', 'Update Jira tickets status', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '18 hours', current_timestamp - interval '3 days' + interval '18 hours' + interval '20 minutes', ARRAY['work', 'project-management', 'jira'], false, 100, 1, '#06b6d4', 'Updated 9 tickets', current_timestamp - interval '3 days' + interval '18 hours', current_timestamp - interval '3 days' + interval '18 hours' + interval '20 minutes', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=1BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6:30 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Answer support ticket', 'Help customer with integration issue', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '18 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '19 hours', ARRAY['work', 'support', 'customer'], true, 100, 1, '#f59e0b', 'Customer issue resolved', current_timestamp - interval '3 days' + interval '18 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '19 hours', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=2BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Write deployment notes', 'Document release changes', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '19 hours', current_timestamp - interval '3 days' + interval '19 hours' + interval '30 minutes', ARRAY['work', 'documentation', 'deployment'], false, 100, 1, '#22c55e', 'Release notes completed', current_timestamp - interval '3 days' + interval '19 hours', current_timestamp - interval '3 days' + interval '19 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=3BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7:30 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Review analytics dashboard', 'Check user metrics and KPIs', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '19 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '20 hours', ARRAY['work', 'analytics', 'metrics'], false, 100, 1, '#8b5cf6', 'User engagement up 12%', current_timestamp - interval '3 days' + interval '19 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '20 hours', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=4BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Backup local work files', 'Sync to cloud storage', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '20 hours', current_timestamp - interval '3 days' + interval '20 hours' + interval '10 minutes', ARRAY['personal', 'backup', 'data'], false, 100, 1, '#10b981', 'All files backed up', current_timestamp - interval '3 days' + interval '20 hours', current_timestamp - interval '3 days' + interval '20 hours' + interval '10 minutes', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=5BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8:30 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'End of day team sync', 'Quick check-in with remote teammates', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '20 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '21 hours', ARRAY['work', 'meeting', 'team'], false, 100, 1, '#3b82f6', 'Aligned on tomorrow priorities', current_timestamp - interval '3 days' + interval '20 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '21 hours', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=6BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Additional same-day tasks to reach 30+ (continuing on same day)
-- 9:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Review merge conflicts', 'Resolve conflicts in main branch', 'completed', 'high', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '21 hours', current_timestamp - interval '3 days' + interval '21 hours' + interval '30 minutes', ARRAY['work', 'git', 'merge'], true, 100, 1, '#f59e0b', 'Conflicts resolved and merged', current_timestamp - interval '3 days' + interval '21 hours', current_timestamp - interval '3 days' + interval '21 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=7BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9:30 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Quick code refactor', 'Clean up duplicate functions', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '21 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '22 hours', ARRAY['work', 'refactoring', 'code-quality'], false, 100, 1, '#84cc16', 'Removed 50 lines of duplicate code', current_timestamp - interval '3 days' + interval '21 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '22 hours', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=8BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 10:00 PM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Update changelog', 'Document todays changes', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '22 hours', current_timestamp - interval '3 days' + interval '22 hours' + interval '15 minutes', ARRAY['work', 'documentation', 'changelog'], false, 100, 1, '#06b6d4', 'Changelog updated', current_timestamp - interval '3 days' + interval '22 hours', current_timestamp - interval '3 days' + interval '22 hours' + interval '15 minutes', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=9BrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Same day - earlier morning tasks (before 8 AM)
-- 6:00 AM - Early morning
(extensions.uuid_generate_v4(), 'Check email inbox', 'Review overnight emails', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '6 hours', current_timestamp - interval '3 days' + interval '6 hours' + interval '20 minutes', ARRAY['work', 'email', 'communication'], false, 100, 1, '#3b82f6', 'Processed 15 emails', current_timestamp - interval '3 days' + interval '6 hours', current_timestamp - interval '3 days' + interval '6 hours' + interval '20 minutes', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=0CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6:30 AM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Morning exercise', 'Quick workout routine', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '6 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '7 hours', ARRAY['personal', 'health', 'fitness'], false, 100, 1, '#22c55e', '30 min workout completed', current_timestamp - interval '3 days' + interval '6 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '7 hours', ARRAY['https://fastly.picsum.photos/id/365/300/200.jpg?hmac=1CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7:00 AM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Review daily schedule', 'Plan tasks for the day', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '7 hours', current_timestamp - interval '3 days' + interval '7 hours' + interval '15 minutes', ARRAY['work', 'planning', 'productivity'], false, 100, 1, '#8b5cf6', 'Day organized and prioritized', current_timestamp - interval '3 days' + interval '7 hours', current_timestamp - interval '3 days' + interval '7 hours' + interval '15 minutes', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=2CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7:30 AM - 30 minutes gap
(extensions.uuid_generate_v4(), 'Read tech news', 'Check Hacker News and dev.to', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '7 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '8 hours', ARRAY['personal', 'learning', 'tech'], false, 100, 1, '#06b6d4', 'Caught up on industry news', current_timestamp - interval '3 days' + interval '7 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '8 hours', ARRAY['https://fastly.picsum.photos/id/119/300/200.jpg?hmac=3CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- Mid-day additional tasks
-- 1:30 PM - Between lunch and afternoon
(extensions.uuid_generate_v4(), 'Review test coverage report', 'Check code coverage metrics', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '13 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '14 hours', ARRAY['work', 'testing', 'quality'], false, 100, 1, '#10b981', 'Coverage at 85%', current_timestamp - interval '3 days' + interval '13 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '14 hours', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=4CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 2:30 PM - 1 hour gap
(extensions.uuid_generate_v4(), 'Fix typo in UI', 'Correct spelling error in modal', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '14 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '14 hours' + interval '40 minutes', ARRAY['work', 'bug-fix', 'ui'], false, 100, 1, '#84cc16', 'Typo fixed', current_timestamp - interval '3 days' + interval '14 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '14 hours' + interval '40 minutes', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=5CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 3:30 PM - 1 hour gap
(extensions.uuid_generate_v4(), 'Add error handling', 'Improve error messages in API', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '15 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '16 hours', ARRAY['work', 'error-handling', 'api'], false, 100, 1, '#f59e0b', 'Better error messages added', current_timestamp - interval '3 days' + interval '15 hours' + interval '30 minutes', current_timestamp - interval '3 days' + interval '16 hours', ARRAY['https://fastly.picsum.photos/id/98/300/200.jpg?hmac=6CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 5:15 PM - Between afternoon tasks
(extensions.uuid_generate_v4(), 'Update status in standup doc', 'Document todays accomplishments', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '17 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '17 hours' + interval '30 minutes', ARRAY['work', 'documentation', 'standup'], false, 100, 1, '#3b82f6', 'Status updated', current_timestamp - interval '3 days' + interval '17 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '17 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/88/300/200.jpg?hmac=7CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 6:15 PM - Between evening tasks
(extensions.uuid_generate_v4(), 'Code review for teammate', 'Review PRs from junior dev', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '18 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '18 hours' + interval '30 minutes', ARRAY['work', 'code-review', 'mentoring'], false, 100, 1, '#8b5cf6', 'Provided constructive feedback', current_timestamp - interval '3 days' + interval '18 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '18 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/180/300/200.jpg?hmac=8CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 7:15 PM - Between evening tasks
(extensions.uuid_generate_v4(), 'Update environment variables', 'Add new config for staging', 'completed', 'medium', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '19 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '19 hours' + interval '30 minutes', ARRAY['work', 'devops', 'config'], false, 100, 1, '#06b6d4', 'Environment updated', current_timestamp - interval '3 days' + interval '19 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '19 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=9CrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 8:15 PM - Between evening tasks
(extensions.uuid_generate_v4(), 'Test mobile responsiveness', 'Check UI on different devices', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '20 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '20 hours' + interval '30 minutes', ARRAY['work', 'testing', 'mobile'], false, 100, 1, '#22c55e', 'Looks good on all devices', current_timestamp - interval '3 days' + interval '20 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '20 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/250/300/200.jpg?hmac=0DrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']),
-- 9:15 PM - Late evening
(extensions.uuid_generate_v4(), 'Create tomorrow task list', 'Plan priorities for next day', 'completed', 'low', 'b73eb03e-fb7a-424d-84ff-18e2791ce0b4', current_timestamp - interval '3 days' + interval '21 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '21 hours' + interval '30 minutes', ARRAY['work', 'planning', 'productivity'], false, 100, 1, '#8b5cf6', 'Tomorrow planned out', current_timestamp - interval '3 days' + interval '21 hours' + interval '15 minutes', current_timestamp - interval '3 days' + interval '21 hours' + interval '30 minutes', ARRAY['https://fastly.picsum.photos/id/201/300/200.jpg?hmac=1DrJq6JqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqI']);


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
