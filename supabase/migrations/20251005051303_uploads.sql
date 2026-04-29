-- Cleanup

DROP POLICY IF EXISTS enable_read_authenticated_uploads_bucket ON storage.buckets;
DROP POLICY IF EXISTS enable_read_authorized_uploads_objects ON storage.objects;
DROP POLICY IF EXISTS enable_insert_authorized_uploads_objects ON storage.objects;
DROP POLICY IF EXISTS enable_update_authorized_uploads_objects ON storage.objects;
DROP POLICY IF EXISTS enable_delete_authorized_uploads_objects ON storage.objects;

-- Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT DO NOTHING;

-- Uploads bucket policies
CREATE POLICY enable_read_authenticated_uploads_bucket ON storage.buckets
AS PERMISSIVE FOR SELECT TO authenticated
USING (name = 'uploads');

CREATE POLICY enable_read_authorized_uploads_objects ON storage.objects
AS PERMISSIVE FOR SELECT TO authenticated
USING (
    bucket_id = 'uploads' AND supasheet.has_permission(
        format('%s.%s:select', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

CREATE POLICY enable_insert_authorized_uploads_objects ON storage.objects
AS PERMISSIVE FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'uploads' AND supasheet.has_permission(
        format('%s.%s:insert', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

CREATE POLICY enable_update_authorized_uploads_objects ON storage.objects
AS PERMISSIVE FOR UPDATE TO authenticated
USING (
    bucket_id = 'uploads' AND supasheet.has_permission(
        format('%s.%s:update', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

CREATE POLICY enable_delete_authorized_uploads_objects ON storage.objects
AS PERMISSIVE FOR DELETE TO authenticated
USING (
    bucket_id = 'uploads' AND supasheet.has_permission(
        format('%s.%s:delete', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);
