-- Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true), ('personal', 'personal', true)
ON CONFLICT DO NOTHING;

-- Public bucket policies
DROP POLICY IF EXISTS enable_read_authenticated_public_bucket ON storage.buckets;
CREATE POLICY enable_read_authenticated_public_bucket ON storage.buckets
AS PERMISSIVE FOR SELECT TO authenticated
USING (name = 'public');

DROP POLICY IF EXISTS enable_read_all_public_objects ON storage.objects;
CREATE POLICY enable_read_all_public_objects ON storage.objects
AS PERMISSIVE FOR SELECT TO public
USING (bucket_id = 'public');

DROP POLICY IF EXISTS enable_insert_authenticated_public_objects ON storage.objects;
CREATE POLICY enable_insert_authenticated_public_objects ON storage.objects
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'public');

DROP POLICY IF EXISTS enable_update_owner_public_objects ON storage.objects;
CREATE POLICY enable_update_owner_public_objects ON storage.objects
AS PERMISSIVE FOR UPDATE TO authenticated
USING (bucket_id = 'public' AND owner_id::uuid = (SELECT auth.uid()::uuid))
WITH CHECK (bucket_id = 'public' AND owner_id::uuid = (SELECT auth.uid()::uuid));

DROP POLICY IF EXISTS enable_delete_owner_public_objects ON storage.objects;
CREATE POLICY enable_delete_owner_public_objects ON storage.objects
AS PERMISSIVE FOR DELETE TO authenticated
USING (bucket_id = 'public' AND owner_id::uuid = (SELECT auth.uid()::uuid));

-- Personal bucket policies
DROP POLICY IF EXISTS enable_read_authenticated_personal_bucket ON storage.buckets;
CREATE POLICY enable_read_authenticated_personal_bucket ON storage.buckets
AS PERMISSIVE FOR SELECT TO authenticated
USING (name = 'personal');

DROP POLICY IF EXISTS enable_read_owner_personal_objects ON storage.objects;
CREATE POLICY enable_read_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR SELECT TO authenticated
USING (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));

DROP POLICY IF EXISTS enable_insert_owner_personal_objects ON storage.objects;
CREATE POLICY enable_insert_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));

DROP POLICY IF EXISTS enable_update_owner_personal_objects ON storage.objects;
CREATE POLICY enable_update_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR UPDATE TO authenticated
USING (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid))
WITH CHECK (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));

DROP POLICY IF EXISTS enable_delete_owner_personal_objects ON storage.objects;
CREATE POLICY enable_delete_owner_personal_objects ON storage.objects
AS PERMISSIVE FOR DELETE TO authenticated
USING (bucket_id = 'personal' AND owner_id::uuid = (SELECT auth.uid()::uuid));
