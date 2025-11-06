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

INSERT INTO supasheet.user_roles(account_id, role) VALUES ('b73eb03e-fb7a-424d-84ff-18e2791ce0b4', 'user');

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

INSERT INTO supasheet.user_roles(account_id, role) VALUES ('b73eb03e-fb7a-424d-84ff-18e2791ce0b1', 'user');

-- Auth records for all 106 users from user_details

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'john.doe@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "john.doe@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "john.doe@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'jane.smith@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "jane.smith@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "jane.smith@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'bob.johnson@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "bob.johnson@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "bob.johnson@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'alice.williams@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "alice.williams@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "alice.williams@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'charlie.brown@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "charlie.brown@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "charlie.brown@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'diana.prince@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "diana.prince@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "diana.prince@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'ethan.hunt@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "ethan.hunt@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "ethan.hunt@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'fiona.gallagher@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "fiona.gallagher@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "fiona.gallagher@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'george.lucas@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "george.lucas@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "george.lucas@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'hannah.montana@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "hannah.montana@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "hannah.montana@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'isaac.newton@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "isaac.newton@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "isaac.newton@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'julia.roberts@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "julia.roberts@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "julia.roberts@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'kevin.hart@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "kevin.hart@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "kevin.hart@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'laura.palmer@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "laura.palmer@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "laura.palmer@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'michael.scott@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "michael.scott@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "michael.scott@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'nancy.drew@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "nancy.drew@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "nancy.drew@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'oscar.wilde@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "oscar.wilde@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "oscar.wilde@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'patricia.lee@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "patricia.lee@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "patricia.lee@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'quincy.jones@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "quincy.jones@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "quincy.jones@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'rachel.green@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "rachel.green@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "rachel.green@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'sam.wilson@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "sam.wilson@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "sam.wilson@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'tina.fey@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "tina.fey@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "tina.fey@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'uma.thurman@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "uma.thurman@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "uma.thurman@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'victor.hugo@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "victor.hugo@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "victor.hugo@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Generate a new UUID
    new_user_id := extensions.uuid_generate_v4();

    -- Insert into auth.users
    INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at",
                                "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token",
                                "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at",
                                "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin",
                                "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change",
                                "phone_change_token", "phone_change_sent_at", "email_change_token_current",
                                "email_change_confirm_status", "banned_until", "reauthentication_token",
                                "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous")
    VALUES ('00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated',
            'authenticated', 'wendy.williams@example.com', '$2a$10$/.78oHxqRLOcnyMeoqYulOcOWhyIeKoyaBYvZhQ0jhEFDtg1ddEPa',
            '2024-04-20 08:38:00.860548+00', NULL, '', '2024-04-20 08:37:43.343769+00', '', NULL, '', '', NULL,
            '2024-04-20 08:38:00.93864+00', '{"provider": "email", "providers": ["email"]}'::jsonb,
            ('{"sub": "' || new_user_id::text || '", "email": "wendy.williams@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            NULL, '2024-04-20 08:37:43.3385+00', '2024-04-20 08:38:00.942809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '',
            NULL, false, NULL, false);

    -- Insert into auth.identities
    INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at",
                                     "updated_at", "id")
    VALUES (new_user_id, new_user_id,
            ('{"sub": "' || new_user_id::text || '", "email": "wendy.williams@example.com", "email_verified": true, "phone_verified": false}')::jsonb,
            'email', '2024-04-20 08:20:34.46275+00', '2024-04-20 08:20:34.462773+00', '2024-04-20 08:20:34.462773+00',
            extensions.uuid_generate_v4());

    -- Insert into user_roles
    INSERT INTO supasheet.user_roles(account_id, role) VALUES (new_user_id, 'user');
END $$;

INSERT INTO supasheet.role_permissions (role, permission) values ('user', 'supasheet.accounts:select');

-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('supasheet');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('supasheet');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('supasheet');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.generate_materialized_views('supasheet');

-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('public');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('public');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('public');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('public');

-- INSERT INTO supasheet.columns SELECT * FROM supasheet.generate_columns('reports');
-- INSERT INTO supasheet.tables SELECT * FROM supasheet.generate_tables('reports');
-- INSERT INTO supasheet.views SELECT * FROM supasheet.generate_views('reports');
-- INSERT INTO supasheet.materialized_views SELECT * FROM supasheet.get_materialized_views('reports');


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

