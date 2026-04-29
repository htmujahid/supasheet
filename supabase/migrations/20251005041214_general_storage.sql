-- Cleanup
DROP POLICY IF EXISTS "enable_read_authenticated_public_bucket" ON storage.buckets;
DROP POLICY IF EXISTS "enable_read_all_public_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_insert_authenticated_public_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_update_owner_public_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_delete_owner_public_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_read_authenticated_personal_bucket" ON storage.buckets;
DROP POLICY IF EXISTS "enable_read_owner_personal_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_insert_owner_personal_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_update_owner_personal_objects" ON storage.objects;
DROP POLICY IF EXISTS "enable_delete_owner_personal_objects" ON storage.objects;

-- Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true), ('personal', 'personal', true)
ON CONFLICT DO NOTHING;

-- Public bucket policies
CREATE POLICY enable_read_authenticated_public_bucket ON storage.buckets
AS PERMISSIVE FOR SELECT TO authenticated
USING (name = 'public');

CREATE POLICY enable_read_all_public_objects ON storage.objects
AS PERMISSIVE FOR SELECT TO public
USING (bucket_id = 'public');

CREATE POLICY enable_insert_authenticated_public_objects ON storage.objects
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'public');

CREATE POLICY enable_update_owner_public_objects ON storage.objects
AS PERMISSIVE FOR UPDATE TO authenticated
USING (bucket_id = 'public' AND owner_id::uuid = (SELECT auth.uid()::uuid))
WITH CHECK (bucket_id = 'public' AND owner_id::uuid = (SELECT auth.uid()::uuid));

CREATE POLICY enable_delete_owner_public_objects ON storage.objects
AS PERMISSIVE FOR DELETE TO authenticated
USING (bucket_id = 'public' AND owner_id::uuid = (SELECT auth.uid()::uuid));

-- Personal bucket policies
CREATE POLICY enable_read_authenticated_personal_bucket ON storage.buckets
AS PERMISSIVE FOR SELECT TO authenticated
USING (name = 'personal');

CREATE POLICY enable_read_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR SELECT TO authenticated
USING (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));

CREATE POLICY enable_insert_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));

CREATE POLICY enable_update_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR UPDATE TO authenticated
USING (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid))
WITH CHECK (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));

CREATE POLICY enable_delete_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR DELETE TO authenticated
USING (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));
