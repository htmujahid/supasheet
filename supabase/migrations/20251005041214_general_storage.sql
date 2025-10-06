insert into storage.buckets (id, name, public)
values ('public', 'public', true), ('personal', 'personal', true);

create policy "Enable read access to authenticated users for public bucket" ON storage.buckets
as permissive for select
to authenticated
using (
    name = 'public'
);

create policy "Enable read access to all users for public bucket" ON storage.objects
as permissive for select
to public
using (
    bucket_id = 'public'
);

create policy "Enable insert access to authenticated users for public bucket" ON storage.objects
as permissive for insert
to authenticated
with check (
    bucket_id = 'public'
);

create policy "Enable update access to owners for public bucket" ON storage.objects
as permissive for update
to authenticated
using (
    bucket_id = 'public' and owner_id::uuid = (select auth.uid()::uuid)
)
with check (
    bucket_id = 'public' and owner_id::uuid = (select auth.uid()::uuid)
);

create policy "Enable delete access to owners for public bucket" ON storage.objects
as permissive for delete
to authenticated
using (
    bucket_id = 'public' and owner_id::uuid = (select auth.uid()::uuid)
);


create policy "Enable read access to authenticated users for personal bucket" ON storage.buckets
as permissive for select
to authenticated
using (
    name = 'personal'
);

create policy "Enable read access to owners for personal bucket" ON storage.objects
as permissive for select
to authenticated
using (
    bucket_id = 'personal' and owner_id::uuid = (select auth.uid()::uuid)
);

create policy "Enable insert access to owners for personal bucket" ON storage.objects
as permissive for insert
to authenticated
with check (
    bucket_id = 'personal' and owner_id::uuid = (select auth.uid()::uuid)
);

create policy "Enable update access to owners for personal bucket" ON storage.objects
as permissive for update
to authenticated
using (
    bucket_id = 'personal' and owner_id::uuid = (select auth.uid())
)
with check (
    bucket_id = 'personal' and owner_id::uuid = (select auth.uid())
);

create policy "Enable delete access to owners for personal bucket" ON storage.objects
as permissive for delete
to authenticated
using (
    bucket_id = 'personal' and owner_id::uuid = (select auth.uid())
);