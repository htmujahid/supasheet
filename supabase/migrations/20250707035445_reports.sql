/*
 * -------------------------------------------------------
 * Section: Report
 * This migration creates the schema for reports.
 * -------------------------------------------------------
 */

create or replace function supasheet.get_reports(p_schema text default null)
returns table(
  id bigint,
  schema text,
  name text,
  is_updatable boolean,
  comment text
)
language plpgsql
security definer
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
    where ur.account_id = auth.uid()
      and (v.schema = p_schema and v.comment::jsonb ->> 'type' = 'report');
end;
$$;

revoke all on function supasheet.get_reports(text) from authenticated, service_role;

grant execute on function supasheet.get_reports(text) to authenticated;
