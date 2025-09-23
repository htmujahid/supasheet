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
        '9bb58bad-24a4-41a8-9742-1b5b4e2d8abd');

INSERT INTO supasheet.columns SELECT * FROM supasheet.get_columns('supasheet');
INSERT INTO supasheet.tables SELECT * FROM supasheet.get_tables('supasheet');
INSERT INTO supasheet.views SELECT * FROM supasheet.get_views('supasheet');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('supasheet');


INSERT INTO supasheet.columns SELECT * FROM supasheet.get_columns('finance');
INSERT INTO supasheet.tables SELECT * FROM supasheet.get_tables('finance');
INSERT INTO supasheet.views SELECT * FROM supasheet.get_views('finance');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('finance');


INSERT INTO supasheet.columns SELECT * FROM supasheet.get_columns('productivity');
INSERT INTO supasheet.tables SELECT * FROM supasheet.get_tables('productivity');
INSERT INTO supasheet.views SELECT * FROM supasheet.get_views('productivity');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('productivity');


INSERT INTO supasheet.columns SELECT * FROM supasheet.get_columns('journal');
INSERT INTO supasheet.tables SELECT * FROM supasheet.get_tables('journal');
INSERT INTO supasheet.views SELECT * FROM supasheet.get_views('journal');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('journal');


INSERT INTO supasheet.columns SELECT * FROM supasheet.get_columns('health_fitness');
INSERT INTO supasheet.tables SELECT * FROM supasheet.get_tables('health_fitness');
INSERT INTO supasheet.views SELECT * FROM supasheet.get_views('health_fitness');
INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('health_fitness');

