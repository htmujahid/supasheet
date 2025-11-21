insert into storage.buckets (id, name, public) 
values ('uploads', 'uploads', true);

create policy "Enable read access to authenticated users for upload bucket" ON storage.buckets
as permissive for select
to authenticated
using (
    name = 'uploads'
);

create policy "Enable read access to authorized users for upload bucket" ON storage.objects
as permissive for select
to authenticated
using (
    bucket_id = 'uploads' and supasheet.has_permission(
        format('%s.%s:select', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

create policy "Enable insert access to authorized users for upload bucket" ON storage.objects
as permissive for insert
to authenticated
with check (
    bucket_id = 'uploads' and supasheet.has_permission(
        format('%s.%s:insert', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

create policy "Enable update access to authorized users for upload bucket" ON storage.objects
as permissive for update
to authenticated
using (
    bucket_id = 'uploads' and supasheet.has_permission(
        format('%s.%s:update', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

create policy "Enable delete access to authorized users for upload bucket" ON storage.objects
as permissive for delete
to authenticated
using (
    bucket_id = 'uploads' and supasheet.has_permission(
        format('%s.%s:delete', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);

