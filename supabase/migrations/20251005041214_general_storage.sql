set
  client_min_messages = WARNING;

-- Buckets
insert into
  storage.buckets (id, name, public)
values
  ('public', 'public', true),
  ('personal', 'personal', true)
on conflict do nothing;

-- Public bucket policies
drop policy IF exists enable_read_authenticated_public_bucket on storage.buckets;

create policy enable_read_authenticated_public_bucket on storage.buckets as PERMISSIVE for
select
  to authenticated using (name = 'public');

drop policy IF exists enable_read_all_public_objects on storage.objects;

create policy enable_read_all_public_objects on storage.objects as PERMISSIVE for
select
  to public using (bucket_id = 'public');

drop policy IF exists enable_insert_authenticated_public_objects on storage.objects;

create policy enable_insert_authenticated_public_objects on storage.objects as PERMISSIVE for INSERT to authenticated
with
  check (bucket_id = 'public');

drop policy IF exists enable_update_owner_public_objects on storage.objects;

create policy enable_update_owner_public_objects on storage.objects as PERMISSIVE
for update
  to authenticated using (
    bucket_id = 'public'
    and owner_id::uuid = (
      select
        auth.uid ()::uuid
    )
  )
with
  check (
    bucket_id = 'public'
    and owner_id::uuid = (
      select
        auth.uid ()::uuid
    )
  );

drop policy IF exists enable_delete_owner_public_objects on storage.objects;

create policy enable_delete_owner_public_objects on storage.objects as PERMISSIVE for DELETE to authenticated using (
  bucket_id = 'public'
  and owner_id::uuid = (
    select
      auth.uid ()::uuid
  )
);

-- Personal bucket policies
drop policy IF exists enable_read_authenticated_personal_bucket on storage.buckets;

create policy enable_read_authenticated_personal_bucket on storage.buckets as PERMISSIVE for
select
  to authenticated using (name = 'personal');

drop policy IF exists enable_read_owner_personal_objects on storage.objects;

create policy enable_read_owner_personal_objects on storage.objects as PERMISSIVE for
select
  to authenticated using (
    bucket_id = 'personal'
    and owner_id::uuid = (
      select
        auth.uid ()::uuid
    )
  );

drop policy IF exists enable_insert_owner_personal_objects on storage.objects;

create policy enable_insert_owner_personal_objects on storage.objects as PERMISSIVE for INSERT to authenticated
with
  check (
    bucket_id = 'personal'
    and owner_id::uuid = (
      select
        auth.uid ()::uuid
    )
  );

drop policy IF exists enable_update_owner_personal_objects on storage.objects;

create policy enable_update_owner_personal_objects on storage.objects as PERMISSIVE
for update
  to authenticated using (
    bucket_id = 'personal'
    and owner_id::uuid = (
      select
        auth.uid ()::uuid
    )
  )
with
  check (
    bucket_id = 'personal'
    and owner_id::uuid = (
      select
        auth.uid ()::uuid
    )
  );

drop policy IF exists enable_delete_owner_personal_objects on storage.objects;

create policy enable_delete_owner_personal_objects on storage.objects as PERMISSIVE for DELETE to authenticated using (
  bucket_id = 'personal'
  and owner_id::uuid = (
    select
      auth.uid ()::uuid
  )
);
