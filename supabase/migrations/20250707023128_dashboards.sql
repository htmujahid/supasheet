/*
 * -------------------------------------------------------
 * Section: Dashboard
 * This migration creates the schema for dashboards.
 * -------------------------------------------------------
 */

create or replace function supasheet.get_widgets(p_schema text default null)
returns table(
  id bigint,
  schema text,
  name text,
  is_updatable boolean,
  comment text
)
language sql
security definer
set search_path = ''
as $$
  select
    v.*
  from supasheet.views v
  inner join supasheet.role_permissions rp
      ON rp.permission::text = v.schema || '.' || v.name || ':select'
  inner join supasheet.user_roles ur
      ON ur.role = rp.role
  where ur.user_id = (select auth.uid())
    and (v.schema = p_schema and v.comment::jsonb ->> 'type' = 'dashboard_widget');
$$;

revoke all on function supasheet.get_widgets(text) from authenticated, service_role;

grant execute on function supasheet.get_widgets(text) to authenticated;
