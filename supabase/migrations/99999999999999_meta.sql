----------------------------------------------------------------
-- Function: supasheet.get_schemas
----------------------------------------------------------------


CREATE OR REPLACE FUNCTION supasheet.get_schemas()
RETURNS TABLE(schema text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        DISTINCT t.schema
    FROM supasheet.tables t
    INNER JOIN supasheet.role_permissions rp 
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur 
        ON ur.role = rp.role
    WHERE ur.account_id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION supasheet.get_schemas() FROM anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION supasheet.get_schemas() TO authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_tables
----------------------------------------------------------------


CREATE OR REPLACE FUNCTION supasheet.get_tables(schema_name text DEFAULT NULL, table_name text DEFAULT NULL)
RETURNS SETOF supasheet.tables
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.*
    FROM supasheet.tables t
    INNER JOIN supasheet.role_permissions rp 
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur 
        ON ur.role = rp.role
    WHERE ur.account_id = auth.uid()
        AND (table_name IS NULL OR t.name = table_name)
        AND (schema_name IS NULL OR t.schema = schema_name);
END;
$$;

REVOKE ALL ON FUNCTION supasheet.get_tables(text, text) FROM anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION supasheet.get_tables(text, text) TO authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_views
----------------------------------------------------------------


CREATE OR REPLACE FUNCTION supasheet.get_views(schema_name text DEFAULT NULL, view_name text DEFAULT NULL)
RETURNS SETOF supasheet.views
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.*
    FROM supasheet.views t
    INNER JOIN supasheet.role_permissions rp 
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur 
        ON ur.role = rp.role
    WHERE ur.account_id = auth.uid()
        AND (view_name IS NULL OR t.name = view_name)
        AND (schema_name IS NULL OR t.schema = schema_name);
END;
$$;

REVOKE ALL ON FUNCTION supasheet.get_views(text, text) FROM anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION supasheet.get_views(text, text) TO authenticated;


----------------------------------------------------------------
-- Function: supasheet.get_materialized_views
----------------------------------------------------------------


CREATE OR REPLACE FUNCTION supasheet.get_materialized_views(schema_name text DEFAULT NULL, view_name text DEFAULT NULL)
RETURNS SETOF supasheet.materialized_views
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.*
    FROM supasheet.materialized_views t
    INNER JOIN supasheet.role_permissions rp 
        ON rp.permission::text = t.schema || '.' || t.name || ':select'
    INNER JOIN supasheet.user_roles ur 
        ON ur.role = rp.role
    WHERE ur.account_id = auth.uid()
        AND (view_name IS NULL OR t.name = view_name)
        AND (schema_name IS NULL OR t.schema = schema_name);
END;
$$;

REVOKE ALL ON FUNCTION supasheet.get_materialized_views(text, text) FROM anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION supasheet.get_materialized_views(text, text) TO authenticated;

----------------------------------------------------------------
-- Function: supasheet.get_columns
----------------------------------------------------------------

CREATE OR REPLACE FUNCTION supasheet.get_columns(schema_name text DEFAULT NULL, table_name text DEFAULT NULL)
RETURNS SETOF supasheet.columns
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.*
    FROM supasheet.columns t
    INNER JOIN supasheet.role_permissions rp 
        ON rp.permission::text = t.schema || '.' || t.table || ':select'
    INNER JOIN supasheet.user_roles ur 
        ON ur.role = rp.role
    WHERE ur.account_id = auth.uid()
        AND (table_name IS NULL OR t.table = table_name)
        AND (schema_name IS NULL OR t.schema = schema_name)
    ORDER BY (t.ordinal_position::int);
END;
$$;

REVOKE ALL ON FUNCTION supasheet.get_columns(text, text) FROM anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION supasheet.get_columns(text, text) TO authenticated;


CREATE OR REPLACE FUNCTION supasheet.get_related_tables(schema_name text, table_name text)
RETURNS TABLE(
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
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
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
    WHERE ur.account_id = auth.uid()
        -- Exclude the input table itself
        AND NOT (t.schema = schema_name AND t.name = table_name)
        -- Find tables that have relationships with the input table
        AND EXISTS (
            SELECT 1
            FROM jsonb_array_elements(t.relationships) AS rel
            WHERE (
                (rel->>'source_table_name' = table_name AND rel->>'source_schema' = schema_name)
                OR
                (rel->>'target_table_name' = table_name AND rel->>'target_table_schema' = schema_name)
            )
        );
END;
$$;

REVOKE ALL ON FUNCTION supasheet.get_related_tables(text, text) FROM anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION supasheet.get_related_tables(text, text) TO authenticated;
