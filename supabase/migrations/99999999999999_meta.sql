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
