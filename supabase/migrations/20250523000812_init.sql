/*
 * -------------------------------------------------------
 * Section: Supabase SaaS Starter Schema
 * This is the schema for the Supabase SaaS Starter.
 * It includes the schema for accounts
 * -------------------------------------------------------
 */
/*
 * -------------------------------------------------------
 * Section: Revoke default privileges from public schema
 * We will revoke all default privileges from public schema on functions to prevent public access to them
 * -------------------------------------------------------
 */

create extension if not exists "unaccent" schema public;

-- We remove all default privileges from public schema on functions to
--   prevent public access to them
alter default privileges
    revoke
    execute on functions
    from
    public;

revoke all on schema public
    from
    public;

revoke all PRIVILEGES on database "postgres"
    from
    "anon";

revoke all PRIVILEGES on schema "public"
    from
    "anon";

revoke all PRIVILEGES on schema "storage"
    from
    "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "public"
    from
    "anon";

revoke all PRIVILEGES on all SEQUENCES in schema "storage"
    from
    "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "public"
    from
    "anon";

revoke all PRIVILEGES on all FUNCTIONS in schema "storage"
    from
    "anon";

revoke all PRIVILEGES on all TABLES in schema "public"
    from
    "anon";

revoke all PRIVILEGES on all TABLES in schema "storage"
    from
    "anon";

-- We remove all default privileges from public schema on functions to
--   prevent public access to them by default
alter default privileges in schema public
    revoke
    execute on functions
    from
    anon,
    authenticated;

-- we allow the authenticated role to execute functions in the public schema
grant usage on schema public to authenticated;

-- we allow the service_role role to execute functions in the public schema
grant usage on schema public to service_role;
