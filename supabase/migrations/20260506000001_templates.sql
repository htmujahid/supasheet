/*
 * -------------------------------------------------------
 * Section: Template
 * This migration creates the schema for templates.
 * -------------------------------------------------------
 */

create or replace function supasheet.get_templates(p_schema text default null)
returns table(
  id bigint,
  schema text,
  name text,
  is_updatable boolean,
  comment text
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
    select
      v.*
    from supasheet.views v
    inner join supasheet.role_permissions rp
        ON rp.permission::text = v.schema || '.' || v.name || ':select'
    inner join supasheet.user_roles ur
        ON ur.role = rp.role
    where ur.user_id = auth.uid()
      and (v.schema = p_schema and v.comment::jsonb ->> 'type' = 'template');
end;
$$;

revoke all on function supasheet.get_templates(text) from authenticated, service_role;

grant execute on function supasheet.get_templates(text) to authenticated;


create or replace function supasheet.apply_template(
  p_schema text,
  p_template_name text,
  p_target_table text
)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_columns text;
  v_sql     text;
  v_count   integer;
begin
  select string_agg(quote_ident(tc.name), ', ' order by tc.ordinal_position::int)
  into v_columns
  from supasheet.get_columns(p_schema, p_template_name) tc
  where tc.name in (
    select tgt.name
    from supasheet.get_columns(p_schema, p_target_table) tgt
  );

  if v_columns is null then
    raise exception 'No matching columns between template "%" and table "%"',
      p_template_name, p_target_table
      using errcode = 'P0001';
  end if;

  v_sql := format(
    'insert into %I.%I (%s) select %s from %I.%I',
    p_schema, p_target_table,
    v_columns,
    v_columns,
    p_schema, p_template_name
  );

  execute v_sql;
  get diagnostics v_count = row_count;

  return v_count;
end;
$$;

revoke all on function supasheet.apply_template(text, text, text) from authenticated, service_role;

grant execute on function supasheet.apply_template(text, text, text) to authenticated;
