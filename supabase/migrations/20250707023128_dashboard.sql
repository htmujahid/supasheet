/*
 * -------------------------------------------------------
 * Section: Dashboards
 * This migration creates the schema for dashboards.
 * -------------------------------------------------------
 */

-- dashboards table
create table if not exists supasheet.dashboards (
  id text primary key,
  name text not null,
  description text,
  "group" text,
  widget_type text not null, -- 'chart', 'table', 'metric', 'custom', etc.
  view_name text, -- name of the SQL view for this widget
  is_active boolean not null default true
);

-- Enable RLS on both tables
alter table supasheet.dashboards enable row level security;

-- Revoke all permissions and grant only select
revoke all on table supasheet.dashboards from authenticated, service_role;

grant select on table supasheet.dashboards to authenticated, service_role;

-- Create indexes for performance
create index idx_dashboards_is_active on supasheet.dashboards (is_active);
create index idx_dashboards_widget_type on supasheet.dashboards (widget_type);

-- RLS Policies for dashboards - users can only view dashboards they have permission for
create policy "User can view dashboards they have permission for" on supasheet.dashboards for select using (
  (select (supasheet.has_permission(id::supasheet.app_permission)))
);
