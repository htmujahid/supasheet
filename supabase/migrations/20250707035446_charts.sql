/*
 * -------------------------------------------------------
 * Section: Charts
 * This migration creates the schema for charts module.
 * Separate from dashboards to handle chart-specific functionality.
 * -------------------------------------------------------
 */

create schema if not exists charts;

grant usage on schema charts to authenticated;

-- charts table
create table if not exists supasheet.charts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  caption text,
  "group" text,
  chart_type text not null, -- 'area', 'bar', 'line', 'pie', 'radar', etc.
  view_name text, -- name of the SQL view for this chart
  is_active boolean not null default true
);

-- Enable RLS on charts table
alter table supasheet.charts enable row level security;

-- Revoke all permissions and grant only select
revoke all on table supasheet.charts from authenticated, service_role;

-- Create indexes for performance
create index idx_charts_is_active on supasheet.charts (is_active);
create index idx_charts_chart_type on supasheet.charts (chart_type);
create index idx_charts_group on supasheet.charts ("group");

-- Function to get chart groups
create or replace function supasheet.get_chart_groups()
returns table(group_name text, charts_count bigint)
language plpgsql
security definer
as $$
begin
  return query
    select
      "group" as group_name,
      count(*) as charts_count
    from supasheet.charts c
    inner join supasheet.role_permissions rp
        ON rp.permission::text = 'charts.' || c.view_name || ':select'
    inner join supasheet.user_roles ur
        ON ur.role = rp.role
    where ur.account_id = auth.uid() and c.is_active = true
    group by "group";
end;
$$;

revoke all on function supasheet.get_chart_groups() from authenticated, service_role;
grant execute on function supasheet.get_chart_groups() to authenticated;

-- Function to get charts
create or replace function supasheet.get_charts(p_group text default null)
returns setof supasheet.charts
language plpgsql
security definer
as $$
begin
  return query
    select
      c.*
    from supasheet.charts c
    inner join supasheet.role_permissions rp
        ON rp.permission::text = 'charts.' || c.view_name || ':select'
    inner join supasheet.user_roles ur
        ON ur.role = rp.role
    where ur.account_id = auth.uid() and is_active = true
      and (p_group is null or c."group" = p_group);
end;
$$;

revoke all on function supasheet.get_charts(text) from authenticated, service_role;
grant execute on function supasheet.get_charts(text) to authenticated;
