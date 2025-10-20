/*
 * -------------------------------------------------------
 * Section: Report
 * This migration creates the schema for reports.
 * -------------------------------------------------------
 */

create schema if not exists reports;

grant usage on schema reports to authenticated;

-- Report table
create table if not exists supasheet.reports (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  "group" text,
  view_name text, -- name of the SQL view for this report item
  filter_field text, 
  is_active boolean not null default true
);

-- Enable RLS on both tables
alter table supasheet.reports enable row level security;

-- Revoke all permissions and grant only select
revoke all on table supasheet.reports from authenticated, service_role;


-- Create indexes for performance
create index idx_reports_is_active on supasheet.reports (is_active);


create or replace function supasheet.get_report_groups()
returns table(group_name text, report_count bigint)
language plpgsql
security definer
as $$
begin
  return query
    select
      "group" as group_name,
      count(*) as report_count
    from supasheet.reports r
    inner join supasheet.role_permissions rp 
        ON rp.permission::text = 'reports.' || r.view_name || ':select'
    inner join supasheet.user_roles ur 
        ON ur.role = rp.role
    where ur.account_id = auth.uid() and is_active = true
    group by "group";
end;
$$;

revoke all on function supasheet.get_report_groups() from authenticated, service_role;

grant execute on function supasheet.get_report_groups() to authenticated;


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
