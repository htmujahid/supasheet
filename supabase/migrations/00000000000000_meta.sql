create schema if not exists supasheet;

-- Initialize schema and extensions
grant usage on schema supasheet to anon, authenticated;


----------------------------------------------------------------
-- Function: supasheet.get_tables
----------------------------------------------------------------


CREATE OR REPLACE FUNCTION supasheet.get_tables(
  schema_filter TEXT DEFAULT NULL,
  ids_filter TEXT DEFAULT NULL,
  table_identifier_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT NULL,
  offset_count INTEGER DEFAULT NULL
)
RETURNS TABLE(
  id BIGINT,
  schema TEXT,
  name TEXT,
  rls_enabled BOOLEAN,
  rls_forced BOOLEAN,
  replica_identity TEXT,
  bytes BIGINT,
  size TEXT,
  live_rows_estimate BIGINT,
  dead_rows_estimate BIGINT,
  comment TEXT,
  primary_keys JSONB,
  relationships JSONB
)
LANGUAGE SQL
AS $$
SELECT
  c.oid :: int8 AS id,
  nc.nspname AS schema,
  c.relname AS name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced,
  CASE
    WHEN c.relreplident = 'd' THEN 'DEFAULT'
    WHEN c.relreplident = 'i' THEN 'INDEX'
    WHEN c.relreplident = 'f' THEN 'FULL'
    ELSE 'NOTHING'
  END AS replica_identity,
  pg_total_relation_size(format('%I.%I', nc.nspname, c.relname)) :: int8 AS bytes,
  pg_size_pretty(
    pg_total_relation_size(format('%I.%I', nc.nspname, c.relname))
  ) AS size,
  pg_stat_get_live_tuples(c.oid) AS live_rows_estimate,
  pg_stat_get_dead_tuples(c.oid) AS dead_rows_estimate,
  obj_description(c.oid) AS comment,
  coalesce(pk.primary_keys, '[]') as primary_keys,
  coalesce(
    jsonb_agg(relationships) filter (where relationships is not null),
    '[]'
  ) as relationships
FROM
  pg_namespace nc
  JOIN pg_class c ON nc.oid = c.relnamespace
  left join (
    select
      table_id,
      jsonb_agg(_pk.*) as primary_keys
    from (
      select
        n.nspname as schema,
        c.relname as table_name,
        a.attname as name,
        c.oid :: int8 as table_id
      from
        pg_index i,
        pg_class c,
        pg_attribute a,
        pg_namespace n
      where
        CASE WHEN schema_filter IS NOT NULL THEN n.nspname OPERATOR(pg_catalog.=) schema_filter ELSE true END
        AND CASE WHEN table_identifier_filter IS NOT NULL THEN n.nspname || '.' || c.relname OPERATOR(pg_catalog.=) table_identifier_filter ELSE true END
        AND i.indrelid = c.oid
        and c.relnamespace = n.oid
        and a.attrelid = c.oid
        and a.attnum = any (i.indkey)
        and i.indisprimary
    ) as _pk
    group by table_id
  ) as pk
  on pk.table_id = c.oid
  left join (
    select
      c.oid :: int8 as id,
      c.conname as constraint_name,
      nsa.nspname as source_schema,
      csa.relname as source_table_name,
      sa.attname as source_column_name,
      nta.nspname as target_table_schema,
      cta.relname as target_table_name,
      ta.attname as target_column_name
    from
      pg_constraint c
    join (
      pg_attribute sa
      join pg_class csa on sa.attrelid = csa.oid
      join pg_namespace nsa on csa.relnamespace = nsa.oid
    ) on sa.attrelid = c.conrelid and sa.attnum = any (c.conkey)
    join (
      pg_attribute ta
      join pg_class cta on ta.attrelid = cta.oid
      join pg_namespace nta on cta.relnamespace = nta.oid
    ) on ta.attrelid = c.confrelid and ta.attnum = any (c.confkey)
    where
      CASE WHEN schema_filter IS NOT NULL THEN nsa.nspname OPERATOR(pg_catalog.=) schema_filter OR nta.nspname OPERATOR(pg_catalog.=) schema_filter ELSE true END
      AND CASE WHEN table_identifier_filter IS NOT NULL THEN (nsa.nspname || '.' || csa.relname) OPERATOR(pg_catalog.=) table_identifier_filter OR (nta.nspname || '.' || cta.relname) OPERATOR(pg_catalog.=) table_identifier_filter ELSE true END
      AND c.contype = 'f'
  ) as relationships
  on (relationships.source_schema = nc.nspname and relationships.source_table_name = c.relname)
  or (relationships.target_table_schema = nc.nspname and relationships.target_table_name = c.relname)
WHERE
  CASE WHEN schema_filter IS NOT NULL THEN nc.nspname OPERATOR(pg_catalog.=) schema_filter ELSE true END
  AND CASE WHEN ids_filter IS NOT NULL THEN c.oid::text OPERATOR(pg_catalog.=) ids_filter ELSE true END
  AND CASE WHEN table_identifier_filter IS NOT NULL THEN nc.nspname || '.' || c.relname OPERATOR(pg_catalog.=) table_identifier_filter ELSE true END
  AND c.relkind IN ('r', 'p')
  AND NOT pg_is_other_temp_schema(nc.oid)
  AND (
    pg_has_role(c.relowner, 'USAGE')
    OR has_table_privilege(
      c.oid,
      'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
    )
    OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
  )
group by
  c.oid,
  c.relname,
  c.relrowsecurity,
  c.relforcerowsecurity,
  c.relreplident,
  nc.nspname,
  pk.primary_keys
ORDER BY c.oid
LIMIT CASE WHEN limit_count IS NOT NULL THEN limit_count END
OFFSET CASE WHEN offset_count IS NOT NULL THEN offset_count ELSE 0 END
$$;

revoke all on function supasheet.get_tables(text, text, text, integer, integer) from public;

create table if not exists supasheet.tables as select * from supasheet.get_tables() with no data;

revoke all on table supasheet.tables from public, anon, authenticated, service_role;
grant select on supasheet.tables to authenticated, service_role;

alter table supasheet.tables add constraint pk_tables_id primary key (id);

alter table supasheet.tables enable row level security;

create policy tables_read on supasheet.tables for
    select
    to authenticated using (true);


----------------------------------------------------------------
-- Function: supasheet.get_columns
----------------------------------------------------------------

CREATE OR REPLACE FUNCTION supasheet.get_columns(
    schema_filter TEXT DEFAULT NULL,
    table_id_filter TEXT DEFAULT NULL,
    table_identifier_filter TEXT DEFAULT NULL,
    column_name_filter TEXT DEFAULT NULL,
    ids_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT NULL,
    offset_count INTEGER DEFAULT NULL
)
RETURNS TABLE (
    table_id BIGINT,
    schema TEXT,
    "table" TEXT,
    id TEXT,
    ordinal_position TEXT,
    "name" TEXT,
    default_value TEXT,
    data_type TEXT,
    actual_type TEXT,
    format TEXT,
    is_identity BOOLEAN,
    identity_generation TEXT,
    is_generated BOOLEAN,
    is_nullable BOOLEAN,
    is_updatable BOOLEAN,
    is_unique BOOLEAN,
    "check" TEXT,
    enums JSON,
    "comment" TEXT
)
LANGUAGE SQL
AS $$
-- Adapted from information_schema.columns

SELECT
  c.oid :: int8 AS table_id,
  nc.nspname AS schema,
  c.relname AS "table",
  (c.oid || '.' || a.attnum) AS id,
  a.attnum AS ordinal_position,
  a.attname AS "name",
  CASE
    WHEN a.atthasdef THEN pg_get_expr(ad.adbin, ad.adrelid)
    ELSE NULL
  END AS default_value,
  CASE
    WHEN t.typtype = 'd' THEN CASE
      WHEN bt.typelem <> 0 :: oid
      AND bt.typlen = -1 THEN 'ARRAY'
      WHEN nbt.nspname = 'pg_catalog' THEN format_type(t.typbasetype, NULL)
      ELSE 'USER-DEFINED'
    END
    ELSE CASE
      WHEN t.typelem <> 0 :: oid
      AND t.typlen = -1 THEN 'ARRAY'
      WHEN nt.nspname = 'pg_catalog' THEN format_type(a.atttypid, NULL)
      ELSE 'USER-DEFINED'
    END
  END AS data_type,
  COALESCE(bt.typname, t.typname) AS format,
  t.typname as actual_type,
  a.attidentity IN ('a', 'd') AS is_identity,
  CASE
    a.attidentity
    WHEN 'a' THEN 'ALWAYS'
    WHEN 'd' THEN 'BY DEFAULT'
    ELSE NULL
  END AS identity_generation,
  a.attgenerated IN ('s') AS is_generated,
  NOT (
    a.attnotnull
    OR t.typtype = 'd' AND t.typnotnull
  ) AS is_nullable,
  (
    c.relkind IN ('r', 'p')
    OR c.relkind IN ('v', 'f') AND pg_column_is_updatable(c.oid, a.attnum, FALSE)
  ) AS is_updatable,
  uniques.table_id IS NOT NULL AS is_unique,
  check_constraints.definition AS "check",
  array_to_json(
    array(
      SELECT
        enumlabel
      FROM
        pg_catalog.pg_enum enums
      WHERE
        enums.enumtypid = coalesce(bt.oid, t.oid)
        OR enums.enumtypid = coalesce(bt.typelem, t.typelem)
      ORDER BY
        enums.enumsortorder
    )
  ) AS enums,
  col_description(c.oid, a.attnum) AS "comment"
FROM
  pg_attribute a
  LEFT JOIN pg_attrdef ad ON a.attrelid = ad.adrelid
  AND a.attnum = ad.adnum
  JOIN (
    pg_class c
    JOIN pg_namespace nc ON c.relnamespace = nc.oid
  ) ON a.attrelid = c.oid
  JOIN (
    pg_type t
    JOIN pg_namespace nt ON t.typnamespace = nt.oid
  ) ON a.atttypid = t.oid
  LEFT JOIN (
    pg_type bt
    JOIN pg_namespace nbt ON bt.typnamespace = nbt.oid
  ) ON t.typtype = 'd'
  AND t.typbasetype = bt.oid
  LEFT JOIN (
    SELECT DISTINCT ON (table_id, ordinal_position)
      conrelid AS table_id,
      conkey[1] AS ordinal_position
    FROM pg_catalog.pg_constraint
    WHERE contype = 'u' AND cardinality(conkey) = 1
  ) AS uniques ON uniques.table_id = c.oid AND uniques.ordinal_position = a.attnum
  LEFT JOIN (
    -- We only select the first column check
    SELECT DISTINCT ON (table_id, ordinal_position)
      conrelid AS table_id,
      conkey[1] AS ordinal_position,
      substring(
        pg_get_constraintdef(pg_constraint.oid, true),
        8,
        length(pg_get_constraintdef(pg_constraint.oid, true)) - 8
      ) AS "definition"
    FROM pg_constraint
    WHERE contype = 'c' AND cardinality(conkey) = 1
    ORDER BY table_id, ordinal_position, oid asc
  ) AS check_constraints ON check_constraints.table_id = c.oid AND check_constraints.ordinal_position = a.attnum
WHERE
  (schema_filter IS NULL OR (nc.nspname || '' SIMILAR TO schema_filter)) AND
  (ids_filter IS NULL OR ((c.oid || '.' || a.attnum) || '' SIMILAR TO ids_filter)) AND
  (column_name_filter IS NULL OR ((c.relname || '.' || a.attname) || '' SIMILAR TO column_name_filter)) AND
  (table_id_filter IS NULL OR (c.oid::text || '' SIMILAR TO table_id_filter)) AND
  (table_identifier_filter IS NULL OR ((nc.nspname || '.' || c.relname) || '' SIMILAR TO table_identifier_filter)) AND
  NOT pg_is_other_temp_schema(nc.oid)
  AND a.attnum > 0
  AND NOT a.attisdropped
  AND (c.relkind IN ('r', 'v', 'm', 'f', 'p'))
  AND (
    pg_has_role(c.relowner, 'USAGE')
    OR has_column_privilege(
      c.oid,
      a.attnum,
      'SELECT, INSERT, UPDATE, REFERENCES'
    )
  )
ORDER BY c.oid, a.attnum
LIMIT CASE WHEN limit_count IS NOT NULL THEN limit_count ELSE NULL END
OFFSET CASE WHEN offset_count IS NOT NULL THEN offset_count ELSE 0 END;
$$;

revoke all on function supasheet.get_columns(text, text, text, text, text, integer, integer) from public;

create table if not exists supasheet.columns as select * from supasheet.get_columns() with no data;

revoke all on table supasheet.columns from public, anon, authenticated, service_role;
grant select on supasheet.columns to authenticated, service_role;

alter table supasheet.columns add constraint pk_columns_id primary key (id);

alter table supasheet.columns enable row level security;

create policy columns_read on supasheet.columns for
    select
    to authenticated using (true);

----------------------------------------------------------------
-- Function: supasheet.get_views
----------------------------------------------------------------

CREATE OR REPLACE FUNCTION supasheet.get_views(
  schema_filter TEXT DEFAULT NULL,
  ids_filter TEXT DEFAULT NULL,
  view_identifier_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT NULL,
  offset_count INTEGER DEFAULT NULL
)
RETURNS TABLE(
  id BIGINT,
  schema TEXT,
  name TEXT,
  is_updatable BOOLEAN,
  comment TEXT
)
LANGUAGE SQL
AS $$
SELECT
  c.oid :: int8 AS id,
  n.nspname AS schema,
  c.relname AS name,
  -- See definition of information_schema.views
  (pg_relation_is_updatable(c.oid, false) & 20) = 20 AS is_updatable,
  obj_description(c.oid) AS comment
FROM
  pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
    CASE WHEN schema_filter IS NOT NULL THEN n.nspname OPERATOR(pg_catalog.=) schema_filter ELSE true END
  AND CASE WHEN ids_filter IS NOT NULL THEN c.oid::text OPERATOR(pg_catalog.=) ids_filter ELSE true END
  AND CASE WHEN view_identifier_filter IS NOT NULL THEN (n.nspname || '.' || c.relname) OPERATOR(pg_catalog.=) view_identifier_filter ELSE true END
  AND c.relkind = 'v'
  AND NOT pg_is_other_temp_schema(n.oid)
  AND (
    pg_has_role(c.relowner, 'USAGE')
    OR has_table_privilege(
      c.oid,
      'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
    )
    OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
  )
ORDER BY c.oid
LIMIT CASE WHEN limit_count IS NOT NULL THEN limit_count END
OFFSET CASE WHEN offset_count IS NOT NULL THEN offset_count ELSE 0 END
$$;

revoke all on function supasheet.get_views(text, text, text, integer, integer) from public;

create table if not exists supasheet.views as select * from supasheet.get_views() with no data;

revoke all on table supasheet.views from public, anon, authenticated, service_role;
grant select on supasheet.views to authenticated, service_role;

alter table supasheet.views add constraint pk_views_id primary key (id);

alter table supasheet.views enable row level security;
create policy views_read on supasheet.views for
    select
    to authenticated using (true);


----------------------------------------------------------------
-- Function: supasheet.get_materialized_views
----------------------------------------------------------------

CREATE OR REPLACE FUNCTION supasheet.get_materialized_views(
    schema_filter TEXT DEFAULT NULL,
    ids_filter TEXT DEFAULT NULL,
    materialized_view_identifier_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT NULL,
    offset_count INTEGER DEFAULT NULL
) 
RETURNS TABLE(
    id BIGINT,
    schema TEXT,
    name TEXT,
    is_populated BOOLEAN,
    comment TEXT
)
LANGUAGE SQL
AS $$
SELECT
  c.oid :: int8 AS id,
  n.nspname AS schema,
  c.relname AS name,
  c.relispopulated AS is_populated,
  obj_description(c.oid) AS comment
FROM
  pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE
    CASE WHEN schema_filter IS NOT NULL THEN n.nspname OPERATOR(pg_catalog.=) schema_filter ELSE true END
  AND CASE WHEN ids_filter IS NOT NULL THEN c.oid::text OPERATOR(pg_catalog.=) ids_filter ELSE true END
  AND CASE WHEN materialized_view_identifier_filter IS NOT NULL THEN (n.nspname || '.' || c.relname) OPERATOR(pg_catalog.=) materialized_view_identifier_filter ELSE true END
  AND c.relkind = 'm'
  AND NOT pg_is_other_temp_schema(n.oid)
  AND (
    pg_has_role(c.relowner, 'USAGE')
    OR has_table_privilege(
      c.oid,
      'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
    )
    OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
  )
ORDER BY c.oid
LIMIT CASE WHEN limit_count IS NOT NULL THEN limit_count END
OFFSET CASE WHEN offset_count IS NOT NULL THEN offset_count ELSE 0 END
$$;

revoke all on function supasheet.get_materialized_views(text, text, text, integer, integer) from public;

create table if not exists supasheet.materialized_views as select * from supasheet.get_materialized_views() with no data;

revoke all on table supasheet.materialized_views from public, anon, authenticated, service_role;
grant select on supasheet.materialized_views to authenticated, service_role;

alter table supasheet.materialized_views add constraint pk_materialized_views_id primary key (id);

alter table supasheet.materialized_views enable row level security;
create policy materialized_views_read on supasheet.materialized_views for
    select
    to authenticated using (true);

