create schema if not exists supasheet;

-- Initialize schema and extensions
grant usage on schema supasheet to authenticated,
service_role;

----------------------------------------------------------------
-- Materialized View: supasheet.tables
----------------------------------------------------------------
create materialized view if not exists supasheet.tables as
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
        i.indrelid = c.oid
        and c.relnamespace = n.oid
        and a.attrelid = c.oid
        and a.attnum = any (i.indkey)
        and i.indisprimary
    ) as _pk
    group by table_id
  ) as pk on pk.table_id = c.oid
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
    where c.contype = 'f'
  ) as relationships
  on (relationships.source_schema = nc.nspname and relationships.source_table_name = c.relname)
  or (relationships.target_table_schema = nc.nspname and relationships.target_table_name = c.relname)
WHERE
  c.relkind IN ('r', 'p')
  AND NOT pg_is_other_temp_schema(nc.oid)
  AND nc.nspname NOT IN (
    'vault', 'supabase_migrations', 'pg_catalog', 'realtime', 'supasheet',
    'storage', 'supabase_functions', '_realtime', 'information_schema', 'net', 'auth', 'extensions'
  )
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
with no data;

revoke all on supasheet.tables
from
  public,
  anon,
  authenticated,
  service_role;

create unique index on supasheet.tables (id);

----------------------------------------------------------------
-- Materialized View: supasheet.columns
----------------------------------------------------------------
create materialized view if not exists supasheet.columns as
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
  t.typname as actual_type,
  COALESCE(bt.typname, t.typname) AS format,
  COALESCE(nbt.nspname, nt.nspname) AS format_schema,
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
  NOT pg_is_other_temp_schema(nc.oid)
  AND nc.nspname NOT IN (
    'vault', 'supabase_migrations', 'pg_catalog', 'realtime', 'supasheet',
    'storage', 'supabase_functions', '_realtime', 'information_schema', 'net', 'auth', 'extensions'
  )
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
with no data;

revoke all on supasheet.columns
from
  public,
  anon,
  authenticated,
  service_role;

create unique index on supasheet.columns (id);

----------------------------------------------------------------
-- Materialized View: supasheet.views
----------------------------------------------------------------
create materialized view if not exists supasheet.views as
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
  c.relkind = 'v'
  AND NOT pg_is_other_temp_schema(n.oid)
  AND n.nspname NOT IN (
    'vault', 'supabase_migrations', 'pg_catalog', 'realtime', 'supasheet',
    'storage', 'supabase_functions', '_realtime', 'information_schema', 'net', 'auth', 'extensions'
  )
  AND (
    pg_has_role(c.relowner, 'USAGE')
    OR has_table_privilege(
      c.oid,
      'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
    )
    OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
  )
ORDER BY c.oid
with no data;

revoke all on supasheet.views
from
  public,
  anon,
  authenticated,
  service_role;

create unique index on supasheet.views (id);

----------------------------------------------------------------
-- Materialized View: supasheet.materialized_views
----------------------------------------------------------------
create materialized view if not exists supasheet.materialized_views as
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
  c.relkind = 'm'
  AND NOT pg_is_other_temp_schema(n.oid)
  AND n.nspname NOT IN (
    'vault', 'supabase_migrations', 'pg_catalog', 'realtime', 'supasheet',
    'storage', 'supabase_functions', '_realtime', 'information_schema', 'net', 'auth', 'extensions'
  )
  AND (
    pg_has_role(c.relowner, 'USAGE')
    OR has_table_privilege(
      c.oid,
      'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'
    )
    OR has_any_column_privilege(c.oid, 'SELECT, INSERT, UPDATE, REFERENCES')
  )
ORDER BY c.oid
with no data;

revoke all on supasheet.materialized_views
from
  public,
  anon,
  authenticated,
  service_role;

create unique index on supasheet.materialized_views (id);

-- Initial population
refresh materialized view supasheet.columns;
refresh materialized view supasheet.tables;
refresh materialized view supasheet.views;
refresh materialized view supasheet.materialized_views;

----------------------------------------------------------------
-- Trigger Function for CREATE events
----------------------------------------------------------------
create or replace function supasheet.log_new_table_creation () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger table_creation_trigger on ddl_command_end when TAG in (
  'CREATE TABLE',
  'CREATE VIEW',
  'CREATE MATERIALIZED VIEW'
)
execute function supasheet.log_new_table_creation ();

----------------------------------------------------------------
-- Trigger Function for DROP events
----------------------------------------------------------------
create or replace function supasheet.log_table_deletion () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger table_deletion_trigger on sql_drop when TAG in (
  'DROP TABLE',
  'DROP VIEW',
  'DROP MATERIALIZED VIEW'
)
execute function supasheet.log_table_deletion ();

----------------------------------------------------------------
-- Trigger Function for ALTER events
----------------------------------------------------------------
create or replace function supasheet.log_table_alteration () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger table_alteration_trigger on ddl_command_end when TAG in (
  'ALTER TABLE',
  'ALTER VIEW',
  'ALTER MATERIALIZED VIEW'
)
execute function supasheet.log_table_alteration ();

----------------------------------------------------------------
-- Trigger Function for COMMENT events
----------------------------------------------------------------
create or replace function supasheet.log_comment_changes () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger comment_trigger on ddl_command_end when TAG in ('COMMENT')
execute function supasheet.log_comment_changes ();

----------------------------------------------------------------
-- Trigger Function for ALTER TYPE events (enum changes)
----------------------------------------------------------------
create or replace function supasheet.log_enum_alteration () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.columns;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger enum_alteration_trigger on ddl_command_end when TAG in ('ALTER TYPE')
execute function supasheet.log_enum_alteration ();

----------------------------------------------------------------
-- Trigger Function for CREATE SCHEMA events
----------------------------------------------------------------
create or replace function supasheet.log_schema_creation () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger schema_creation_trigger on ddl_command_end when TAG in ('CREATE SCHEMA')
execute function supasheet.log_schema_creation ();

----------------------------------------------------------------
-- Trigger Function for ALTER SCHEMA events
----------------------------------------------------------------
create or replace function supasheet.log_schema_alteration () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger schema_alteration_trigger on ddl_command_end when TAG in ('ALTER SCHEMA')
execute function supasheet.log_schema_alteration ();

----------------------------------------------------------------
-- Trigger Function for DROP SCHEMA events
----------------------------------------------------------------
create or replace function supasheet.log_schema_deletion () RETURNS event_trigger as $$
BEGIN
    REFRESH MATERIALIZED VIEW supasheet.tables;
    REFRESH MATERIALIZED VIEW supasheet.columns;
    REFRESH MATERIALIZED VIEW supasheet.views;
    REFRESH MATERIALIZED VIEW supasheet.materialized_views;
END;
$$ LANGUAGE plpgsql
set
  search_path = '';

create event trigger schema_deletion_trigger on sql_drop when TAG in ('DROP SCHEMA')
execute function supasheet.log_schema_deletion ();
