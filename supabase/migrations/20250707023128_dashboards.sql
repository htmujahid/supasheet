/*
 * -------------------------------------------------------
 * Section: Dashboard
 * This migration creates the schema for dashboards.
 * -------------------------------------------------------
 */

create schema if not exists dashboards;

grant usage on schema dashboards to authenticated;

-- dashboards table
create table if not exists supasheet.dashboards (
  id uuid primary key default gen_random_uuid(),
  name text not null not null,
  description text,
  caption text,
  "group" text,
  widget_type text not null, -- 'table', 'metric', 'custom', etc.
  view_name text, -- name of the SQL view for this widget
  filter_field text,
  is_active boolean not null default true
);

-- Enable RLS on both tables
alter table supasheet.dashboards enable row level security;

-- Revoke all permissions and grant only select
revoke all on table supasheet.dashboards from authenticated, service_role;

-- Create indexes for performance
create index idx_dashboards_is_active on supasheet.dashboards (is_active);
create index idx_dashboards_widget_type on supasheet.dashboards (widget_type);


create or replace function supasheet.get_dashboards()
returns table(group_name text, widgets_count bigint)
language plpgsql
security definer
as $$
begin
  return query
    select
      "group" as group_name,
      count(*) as widgets_count
    from supasheet.dashboards d
    inner join supasheet.role_permissions rp
        ON rp.permission::text = 'dashboards.' || d.view_name || ':select'
    inner join supasheet.user_roles ur
        ON ur.role = rp.role
    where ur.account_id = auth.uid() and d.is_active = true
    group by "group";
end;
$$;

revoke all on function supasheet.get_dashboards() from authenticated, service_role;

grant execute on function supasheet.get_dashboards() to authenticated;


create or replace function supasheet.get_widgets(p_group text default null)
returns setof supasheet.dashboards
language plpgsql
security definer
as $$
begin
  return query
    select
      d.*
    from supasheet.dashboards d
    inner join supasheet.role_permissions rp
        ON rp.permission::text = 'dashboards.' || d.view_name || ':select'
    inner join supasheet.user_roles ur
        ON ur.role = rp.role
    where ur.account_id = auth.uid() and is_active = true
      and (p_group is null or d."group" = p_group);
end;
$$;

revoke all on function supasheet.get_widgets(text) from authenticated, service_role;

grant execute on function supasheet.get_widgets(text) to authenticated;
