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

INSERT INTO tasks (id, title, description, status, priority, account_id, due_date, completed_at, tags, is_important, created_at, updated_at) VALUES

-- User 1 tasks (b73eb03e-fb7a-424d-84ff-18e2791ce0b1)
(
    uuid_generate_v4(),
    'Complete project proposal',
    'Draft and finalize the Q4 project proposal for the new marketing campaign',
    'in_progress',
    'high',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    '2025-10-05 17:00:00+00',
    NULL,
    ARRAY['work', 'proposal', 'marketing'],
    true,
    '2025-09-20 09:00:00+00',
    '2025-09-25 14:30:00+00'
),
(
    uuid_generate_v4(),
    'Buy groceries',
    'Milk, bread, eggs, chicken, vegetables for the week',
    'pending',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    '2025-09-28 18:00:00+00',
    NULL,
    ARRAY['personal', 'shopping'],
    false,
    '2025-09-27 08:15:00+00',
    '2025-09-27 08:15:00+00'
),
(
    uuid_generate_v4(),
    'Schedule dentist appointment',
    'Annual checkup and cleaning',
    'completed',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    '2025-09-30 15:00:00+00',
    '2025-09-26 10:45:00+00',
    ARRAY['health', 'personal'],
    false,
    '2025-09-15 12:00:00+00',
    '2025-09-26 10:45:00+00'
),
(
    uuid_generate_v4(),
    'Review team performance reports',
    'Quarterly review for all direct reports',
    'pending',
    'urgent',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    '2025-09-29 16:00:00+00',
    NULL,
    ARRAY['work', 'management', 'review'],
    true,
    '2025-09-26 11:00:00+00',
    '2025-09-26 11:00:00+00'
),
(
    uuid_generate_v4(),
    'Plan weekend trip',
    'Research and book hotel for the mountain getaway',
    'in_progress',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    '2025-10-01 12:00:00+00',
    NULL,
    ARRAY['personal', 'travel', 'vacation'],
    false,
    '2025-09-24 19:30:00+00',
    '2025-09-26 20:15:00+00'
),

-- User 2 tasks (b73eb03e-fb7a-424d-84ff-18e2791ce0b4)
(
    uuid_generate_v4(),
    'Finish reading "Clean Code"',
    'Complete the remaining chapters and take notes',
    'in_progress',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-10-15 23:59:00+00',
    NULL,
    ARRAY['learning', 'programming', 'books'],
    false,
    '2025-09-10 20:00:00+00',
    '2025-09-25 21:30:00+00'
),
(
    uuid_generate_v4(),
    'Update resume',
    'Add recent projects and certifications',
    'pending',
    'high',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-10-02 17:00:00+00',
    NULL,
    ARRAY['career', 'job-search'],
    true,
    '2025-09-26 16:45:00+00',
    '2025-09-26 16:45:00+00'
),
(
    uuid_generate_v4(),
    'Call mom',
    'Weekly check-in call with family',
    'completed',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-09-27 19:00:00+00',
    '2025-09-27 19:30:00+00',
    ARRAY['family', 'personal'],
    false,
    '2025-09-27 09:00:00+00',
    '2025-09-27 19:30:00+00'
),
(
    uuid_generate_v4(),
    'Fix database performance issue',
    'Optimize slow queries in the user dashboard',
    'in_progress',
    'urgent',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-09-28 09:00:00+00',
    NULL,
    ARRAY['work', 'database', 'bug-fix'],
    true,
    '2025-09-27 14:20:00+00',
    '2025-09-27 14:20:00+00'
),
(
    uuid_generate_v4(),
    'Learn Docker basics',
    'Complete online course and practice with sample projects',
    'pending',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-11-01 23:59:00+00',
    NULL,
    ARRAY['learning', 'devops', 'docker'],
    false,
    '2025-09-20 22:15:00+00',
    '2025-09-20 22:15:00+00'
),
(
    uuid_generate_v4(),
    'Organize digital photos',
    'Sort and backup photos from the last 6 months',
    'completed',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-09-25 12:00:00+00',
    NULL,
    ARRAY['personal', 'organization'],
    false,
    '2025-09-18 15:30:00+00',
    '2025-09-25 16:00:00+00'
),
(
    uuid_generate_v4(),
    'Prepare presentation for tech talk',
    'Create slides on microservices architecture',
    'in_progress',
    'high',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-10-08 10:00:00+00',
    NULL,
    ARRAY['work', 'presentation', 'tech-talk'],
    true,
    '2025-09-22 13:45:00+00',
    '2025-09-27 11:20:00+00'
),
(
    uuid_generate_v4(),
    'Renew car insurance',
    'Compare quotes and renew policy before expiration',
    'pending',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    '2025-10-12 23:59:00+00',
    NULL,
    ARRAY['personal', 'insurance', 'finance'],
    false,
    '2025-09-26 08:30:00+00',
    '2025-09-26 08:30:00+00'
);

-- Add some tasks with no due dates
INSERT INTO tasks (id, title, description, status, priority, account_id, due_date, completed_at, tags, is_important, created_at, updated_at) VALUES
(
    uuid_generate_v4(),
    'Research investment options',
    'Look into index funds and retirement planning',
    'pending',
    'medium',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    NULL,
    NULL,
    ARRAY['finance', 'investment', 'retirement'],
    false,
    '2025-09-25 10:00:00+00',
    '2025-09-25 10:00:00+00'
),
(
    uuid_generate_v4(),
    'Clean garage',
    'Organize tools and donate unused items',
    'pending',
    'low',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    NULL,
    NULL,
    ARRAY['home', 'organization', 'cleaning'],
    false,
    '2025-09-23 14:15:00+00',
    '2025-09-23 14:15:00+00'
);