-- Adapted from information_schema.columns

-- Function to create _pg_meta_columns table
CREATE OR REPLACE FUNCTION create_pg_meta_columns()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_columns;
  
  -- Create table with query results
  CREATE TABLE _pg_meta_columns AS
  SELECT
    c.oid :: int8 AS table_id,
    nc.nspname AS schema,
    c.relname AS relation,
    (c.oid || '.' || a.attnum) AS id,
    a.attnum AS ordinal_position,
    a.attname AS name,
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
    t.typname AS actual_type,
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
    col_description(c.oid, a.attnum) AS comment
  FROM
    pg_attribute a
    LEFT JOIN pg_attrdef ad ON a.attrelid = ad.adrelid
    AND a.attnum = ad.adnum
    JOIN (
      pg_class c
      JOIN pg_namespace nc ON c.relnamespace = nc.oid and nc.nspname = 'public'
    ) ON a.attrelid = c.oid and c.relname not like '\_%' escape '\'
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
    );
    
  -- Add primary key
  ALTER TABLE _pg_meta_columns ADD PRIMARY KEY (id);
  
  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_columns_table_id_idx ON _pg_meta_columns(table_id);
  CREATE INDEX IF NOT EXISTS _pg_meta_columns_schema_table_idx ON _pg_meta_columns(schema, relation);

  ALTER TABLE _pg_meta_columns ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_columns"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (public.has_permission(relation::app_permission)))
  );
END;
$$ LANGUAGE plpgsql;


-- resulting table should be _pg_meta_foreign_tables
CREATE OR REPLACE FUNCTION create_pg_meta_foreign_tables()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_foreign_tables;

  -- Create table with query results
  CREATE TABLE _pg_meta_foreign_tables AS
  SELECT
    c.oid :: int8 AS id,
    n.nspname AS schema,
    c.relname AS name,
    obj_description(c.oid) AS comment
  FROM
    pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace and n.nspname = 'public'
  WHERE
    c.relkind = 'f' and c.relname not like '\_%' escape '\';

  -- Add primary key
  ALTER TABLE _pg_meta_foreign_tables ADD PRIMARY KEY (id);

  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_foreign_tables_schema_table_idx ON _pg_meta_foreign_tables(schema, name);

  ALTER TABLE _pg_meta_foreign_tables ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_foreign_tables"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (public.has_permission(name::app_permission)))
  );
END;
$$ LANGUAGE plpgsql;


-- resulting table should be _pg_meta_materialized_views
CREATE OR REPLACE FUNCTION create_pg_meta_materialized_views()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_materialized_views;

  -- Create table with query results
  CREATE TABLE _pg_meta_materialized_views AS
  SELECT
    c.oid::int8 as id,
    n.nspname as schema,
    c.relname as name,
    c.relispopulated as is_populated,
    obj_description(c.oid) as comment
  FROM
    pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace and n.nspname = 'public'
  WHERE
    c.relkind = 'm' and c.relname not like '\_%' escape '\';

  -- Add primary key
  ALTER TABLE _pg_meta_materialized_views ADD PRIMARY KEY (id);

  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_materialized_views_schema_table_idx ON _pg_meta_materialized_views(schema, name);

  ALTER TABLE _pg_meta_materialized_views ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_materialized_views"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (public.has_permission(name::app_permission)))
  );
END;
$$ LANGUAGE plpgsql;


-- resulting table should be _pg_meta_table_relationships
CREATE OR REPLACE FUNCTION create_pg_meta_table_relationships()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_table_relationships;

  -- Create table with query results
  CREATE TABLE _pg_meta_table_relationships AS
  WITH
  pks_uniques_cols AS (
    SELECT
      connamespace,
      conrelid,
      jsonb_agg(column_info.cols) as cols
    FROM pg_constraint
    JOIN lateral (
      SELECT array_agg(cols.attname order by cols.attnum) as cols
      FROM ( select unnest(conkey) as col) _
      JOIN pg_attribute cols on cols.attrelid = conrelid and cols.attnum = col
    ) column_info ON TRUE
    WHERE
      contype IN ('p', 'u') and
      connamespace::regnamespace::text <> 'pg_catalog'
    GROUP BY connamespace, conrelid
  )
  SELECT
    traint.conname AS foreign_key_name,
    ns1.nspname AS schema,
    tab.relname AS relation,
    column_info.cols AS columns,
    ns2.nspname AS referenced_schema,
    other.relname AS referenced_relation,
    column_info.refs AS referenced_columns,
    (column_info.cols IN (SELECT * FROM jsonb_array_elements(pks_uqs.cols))) AS is_one_to_one
  FROM pg_constraint traint
  JOIN LATERAL (
    SELECT
      jsonb_agg(cols.attname order by ord) AS cols,
      jsonb_agg(refs.attname order by ord) AS refs
    FROM unnest(traint.conkey, traint.confkey) WITH ORDINALITY AS _(col, ref, ord)
    JOIN pg_attribute cols ON cols.attrelid = traint.conrelid AND cols.attnum = col
    JOIN pg_attribute refs ON refs.attrelid = traint.confrelid AND refs.attnum = ref
  ) AS column_info ON TRUE
  JOIN pg_namespace ns1 ON ns1.oid = traint.connamespace and ns1.nspname = 'public'
  JOIN pg_class tab ON tab.oid = traint.conrelid and tab.relname not like '\_%' escape '\'
  JOIN pg_class other ON other.oid = traint.confrelid
  JOIN pg_namespace ns2 ON ns2.oid = other.relnamespace
  LEFT JOIN pks_uniques_cols pks_uqs ON pks_uqs.connamespace = traint.connamespace AND pks_uqs.conrelid = traint.conrelid
  WHERE traint.contype = 'f'
  AND traint.conparentid = 0;

  -- Add primary key
  ALTER TABLE _pg_meta_table_relationships ADD PRIMARY KEY (foreign_key_name, schema, relation);

  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_table_relationships_schema_relation_idx ON _pg_meta_table_relationships(schema, relation);
  CREATE INDEX IF NOT EXISTS _pg_meta_table_relationships_referenced_schema_relation_idx ON _pg_meta_table_relationships(referenced_schema, referenced_relation);

  ALTER TABLE _pg_meta_table_relationships ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_table_relationships"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (public.has_permission(relation::app_permission)))
  );
END;
$$ LANGUAGE plpgsql;


-- resulting table should be _pg_meta_tables
CREATE OR REPLACE FUNCTION create_pg_meta_tables()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_tables;

  -- Create table with query results
  CREATE TABLE _pg_meta_tables AS
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
    JOIN pg_class c ON nc.oid = c.relnamespace and nc.nspname = 'public' and c.relname not like '\_%' escape '\'
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
        c.contype = 'f'
    ) as relationships
    on (relationships.source_schema = nc.nspname and relationships.source_table_name = c.relname)
    or (relationships.target_table_schema = nc.nspname and relationships.target_table_name = c.relname)
  WHERE
    c.relkind IN ('r', 'p')
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
    pk.primary_keys;

  -- Add primary key
  ALTER TABLE _pg_meta_tables ADD PRIMARY KEY (id);

  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_tables_schema_name_idx ON _pg_meta_tables(schema, name);

  ALTER TABLE _pg_meta_tables ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_tables"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (public.has_permission(name::app_permission)))
  );
END;
$$ LANGUAGE plpgsql;


-- resulting table should be _pg_meta_types
CREATE OR REPLACE FUNCTION create_pg_meta_types()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_types;

  -- Create table with query results
  CREATE TABLE _pg_meta_types AS
  SELECT
    t.oid::int8 as id,
    t.typname as name,
    n.nspname as schema,
    format_type (t.oid, null) as format,
    coalesce(t_enums.enums, '[]') as enums,
    coalesce(t_attributes.attributes, '[]') as attributes,
    obj_description (t.oid, 'pg_type') as comment
  FROM
    pg_type t
    left join pg_namespace n on n.oid = t.typnamespace and t.typname not like '\_%' escape '\'
  left join (
    select
      enumtypid,
      jsonb_agg(enumlabel order by enumsortorder) as enums
    from
      pg_enum
    group by
      enumtypid
  ) as t_enums on t_enums.enumtypid = t.oid
  left join (
    select
      oid,
      jsonb_agg(
        jsonb_build_object('name', a.attname, 'type_id', a.atttypid::int8)
        order by a.attnum asc
      ) as attributes
    from
      pg_class c
      join pg_attribute a on a.attrelid = c.oid
    where
      c.relkind = 'c' and not a.attisdropped
    group by
      c.oid
  ) as t_attributes on t_attributes.oid = t.typrelid
  where  n.nspname = 'public' and t_enums.enums is not null;

  -- Add primary key
  ALTER TABLE _pg_meta_types ADD PRIMARY KEY (id);

  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_types_schema_name_idx ON _pg_meta_types(schema, name);

  ALTER TABLE _pg_meta_types ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_types"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    true
  );
END;
$$ LANGUAGE plpgsql;


-- resulting table should be _pg_meta_views
CREATE OR REPLACE FUNCTION create_pg_meta_views()
RETURNS void AS $$
BEGIN
  -- Drop table if exists
  DROP TABLE IF EXISTS _pg_meta_views;

  -- Create table with query results
  CREATE TABLE _pg_meta_views AS
  SELECT
  c.oid :: int8 AS id,
  n.nspname AS schema,
  c.relname AS name,
  -- See definition of information_schema.views
  (pg_relation_is_updatable(c.oid, false) & 20) = 20 AS is_updatable,
  obj_description(c.oid) AS comment
  FROM
    pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace and n.nspname = 'public'
  WHERE
    c.relkind = 'v' and c.relname not like '\_%' escape '\';

  -- Add primary key
  ALTER TABLE _pg_meta_views ADD PRIMARY KEY (id);

  -- Add indexes for common queries
  CREATE INDEX IF NOT EXISTS _pg_meta_views_schema_name_idx ON _pg_meta_views(schema, name);

  ALTER TABLE _pg_meta_views ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Enable read access for authorized users"
  ON "public"."_pg_meta_views"
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (public.has_permission(name::app_permission)))
  );
END;
$$ LANGUAGE plpgsql;


-- Function to create all meta tables
CREATE OR REPLACE FUNCTION create_all_pg_meta_tables()
RETURNS void AS $$
BEGIN
  PERFORM create_pg_meta_columns();
  PERFORM create_pg_meta_foreign_tables();
  PERFORM create_pg_meta_materialized_views();
  PERFORM create_pg_meta_table_relationships();
  PERFORM create_pg_meta_tables();
  PERFORM create_pg_meta_types();
  PERFORM create_pg_meta_views();
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_all_pg_meta_tables();
