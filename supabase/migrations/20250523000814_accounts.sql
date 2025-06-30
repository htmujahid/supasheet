/*
 * -------------------------------------------------------
 * Section: Accounts
 * We create the schema for the accounts. Accounts are the top level entity in the Supabase Makerpublic. They can be team or personal accounts.
 * -------------------------------------------------------
 */
-- Accounts table
create table if not exists
    public.accounts
(
    id          uuid unique  not null default extensions.uuid_generate_v4(),
    name        varchar(255) not null,
    email       varchar(320) unique,
    updated_at  timestamp with time zone,
    created_at  timestamp with time zone,
    created_by  uuid references auth.users,
    updated_by  uuid references auth.users,
    picture_url varchar(1000),
    public_data jsonb                 default '{}'::jsonb not null,
    primary key (id)
);

-- Enable RLS on the accounts table
alter table "public"."accounts"
    enable row level security;

-- SELECT(accounts):
-- Users can read their own accounts
create policy accounts_read on public.accounts for
    select
    to authenticated using (
        (select auth.uid()) = id
    );

-- UPDATE(accounts):
-- Users can update their own accounts
create policy accounts_update on public.accounts
    for update
    to authenticated using (
        (select auth.uid()) = id
    )
    with
    check (
        (select auth.uid()) = id
    );

-- Revoke all on accounts table from authenticated and service_role
revoke all on public.accounts
    from
    authenticated,
    service_role;

-- Open up access to accounts
grant
    select
    ,
    insert,
    update,
    delete on table public.accounts to authenticated,
    service_role;

-- Function "public.protect_account_fields"
-- Function to protect account fields from being updated by anyone
create
    or replace function public.protect_account_fields() returns trigger as
$$
begin
    if current_user in ('authenticated', 'anon') then
        if new.id <> old.id or new.email <> old.email then
            raise exception 'You do not have permission to update this field';

        end if;

    end if;

    return NEW;

end
$$ language plpgsql
    set
        search_path = '';

-- trigger to protect account fields
create trigger protect_account_fields
    before
        update
    on public.accounts
    for each row
execute function public.protect_account_fields();

-- create a trigger to update the account email when the primary owner email is updated
create
    or replace function public.handle_update_user_email() returns trigger
    language plpgsql
    security definer
    set
        search_path = '' as
$$
begin
    update
        public.accounts
    set email = new.email
    where id = new.id;

    return new;

end;

$$;

-- trigger the function every time a user email is updated only if the user is the primary owner of the account and
-- the account is personal account
create trigger "on_auth_user_updated"
    after
        update of email
    on auth.users
    for each row
execute procedure public.handle_update_user_email();

-- Function "public.new_user_created_setup"
-- Setup a new user account after user creation
create
    or replace function public.new_user_created_setup() returns trigger
    language plpgsql
    security definer
    set
        search_path = '' as
$$
declare
    user_name   text;
    picture_url text;
begin
    if new.raw_user_meta_data ->> 'name' is not null then
        user_name := new.raw_user_meta_data ->> 'name';

    end if;

    if user_name is null and new.email is not null then
        user_name := split_part(new.email, '@', 1);

    end if;

    if user_name is null then
        user_name := '';

    end if;

    if new.raw_user_meta_data ->> 'avatar_url' is not null then
        picture_url := new.raw_user_meta_data ->> 'avatar_url';
    else
        picture_url := null;
    end if;

    insert into public.accounts(id,
                                name,
                                picture_url,
                                email)
    values (new.id,
            user_name,
            picture_url,
            new.email);

    return new;

end;

$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
    after insert
    on auth.users
    for each row
execute procedure public.new_user_created_setup();

-- Storage
-- Account Image
insert into storage.buckets (id, name, PUBLIC)
values ('account_image', 'account_image', true);

-- Function: get the storage filename as a UUID.
-- Useful if you want to name files with UUIDs related to an account
create
    or replace function public.get_storage_filename_as_uuid(name text) returns uuid
    set
        search_path = '' as
$$
begin
    return replace(storage.filename(name), concat('.',
                                                  storage.extension(name)), '')::uuid;

end;

$$ language plpgsql;

grant
    execute on function public.get_storage_filename_as_uuid (text) to authenticated,
    service_role;

-- RLS policies for storage bucket account_image
create policy account_image on storage.objects for all using (
    bucket_id = 'account_image'
        and (
        public.get_storage_filename_as_uuid(name) = auth.uid()
        )
    )
    with
    check (
    bucket_id = 'account_image'
        and (
        public.get_storage_filename_as_uuid(name) = auth.uid()
        )
    );