----------------------------------------------------------------
-- Function: supasheet.get_schemas
----------------------------------------------------------------
create or replace function supasheet.get_schemas () RETURNS table (schema text) LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        DISTINCT t.schema
    FROM supasheet.tables t
    INNER JOIN supasheet.role_permissions rp
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid());
$$;

revoke all on FUNCTION supasheet.get_schemas ()
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_schemas () to authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_tables
----------------------------------------------------------------
create or replace function supasheet.get_tables (
  schema_name text default null,
  table_name text default null
) RETURNS SETOF supasheet.tables LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        t.*
    FROM supasheet.tables t
    INNER JOIN supasheet.role_permissions rp
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid())
        AND (table_name IS NULL OR t.name = table_name)
        AND (schema_name IS NULL OR t.schema = schema_name);
$$;

revoke all on FUNCTION supasheet.get_tables (text, text)
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_tables (text, text) to authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_views
----------------------------------------------------------------
create or replace function supasheet.get_views (
  schema_name text default null,
  view_name text default null
) RETURNS SETOF supasheet.views LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        t.*
    FROM supasheet.views t
    INNER JOIN supasheet.role_permissions rp
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid())
        AND (view_name IS NULL OR t.name = view_name)
        AND (schema_name IS NULL OR t.schema = schema_name);
$$;

revoke all on FUNCTION supasheet.get_views (text, text)
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_views (text, text) to authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_materialized_views
----------------------------------------------------------------
create or replace function supasheet.get_materialized_views (
  schema_name text default null,
  view_name text default null
) RETURNS SETOF supasheet.materialized_views LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        t.*
    FROM supasheet.materialized_views t
    INNER JOIN supasheet.role_permissions rp
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid())
        AND (view_name IS NULL OR t.name = view_name)
        AND (schema_name IS NULL OR t.schema = schema_name);
$$;

revoke all on FUNCTION supasheet.get_materialized_views (text, text)
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_materialized_views (text, text) to authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_columns
----------------------------------------------------------------
create or replace function supasheet.get_columns (
  schema_name text default null,
  table_name text default null
) RETURNS SETOF supasheet.columns LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        t.*
    FROM supasheet.columns t
    INNER JOIN supasheet.role_permissions rp
        ON rp.permission::text = t.schema || '.' || t.table || ':select'
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid())
        AND (table_name IS NULL OR t.table = table_name)
        AND (schema_name IS NULL OR t.schema = schema_name)
    ORDER BY (t.ordinal_position::int);
$$;

revoke all on FUNCTION supasheet.get_columns (text, text)
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_columns (text, text) to authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_related_tables
----------------------------------------------------------------
create or replace function supasheet.get_related_tables (schema_name text, table_name text) RETURNS table (
  id bigint,
  schema text,
  name text,
  rls_enabled boolean,
  rls_forced boolean,
  replica_identity text,
  bytes int8,
  size text,
  live_rows_estimate int8,
  dead_rows_estimate int8,
  comment text,
  primary_keys jsonb,
  relationships jsonb,
  columns supasheet.columns[]
) LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        t.id,
        t.schema,
        t.name,
        t.rls_enabled,
        t.rls_forced,
        t.replica_identity,
        t.bytes,
        t.size,
        t.live_rows_estimate,
        t.dead_rows_estimate,
        t.comment,
        t.primary_keys,
        t.relationships,
        ARRAY(
            SELECT c
            FROM supasheet.columns c
            WHERE c.table_id = t.id
            ORDER BY c.ordinal_position::int
        ) AS columns
    FROM supasheet.tables t
    INNER JOIN supasheet.role_permissions rp
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid())
        AND NOT (t.schema = schema_name AND t.name = table_name)
        AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements(t.relationships) AS rel
            WHERE (
                (rel->>'source_table_name' = table_name AND rel->>'source_schema' = schema_name)
                OR
                (rel->>'target_table_name' = table_name AND rel->>'target_table_schema' = schema_name)
            )
        );
$$;

revoke all on FUNCTION supasheet.get_related_tables (text, text)
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_related_tables (text, text) to authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_permissions
----------------------------------------------------------------
create or replace function supasheet.get_permissions (schema_name text default null) RETURNS table (permission supasheet.app_permission) LANGUAGE sql SECURITY DEFINER
set
  search_path = '' as $$
    SELECT
        DISTINCT rp.permission
    FROM supasheet.role_permissions rp
    INNER JOIN supasheet.user_roles ur
        ON ur.role = rp.role
    WHERE ur.user_id = (select auth.uid())
        AND (schema_name IS NULL OR rp.permission::text LIKE schema_name || '.%');
$$;

revoke all on FUNCTION supasheet.get_permissions (text)
from
  anon,
  authenticated,
  service_role;

grant
execute on FUNCTION supasheet.get_permissions (text) to authenticated;
