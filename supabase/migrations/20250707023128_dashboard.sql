/*
 * -------------------------------------------------------
 * Section: Dashboards and Widgets
 * This migration creates the schema for dashboards and widgets.
 * Dashboards can contain multiple widgets, and widgets can have different view configurations.
 * -------------------------------------------------------
 */

-- Dashboards table
create table if not exists public.dashboards (
  id text primary key,
  name text not null,
  description text,
  icon text
);

-- Widgets table
create table if not exists public.widgets (
  id text primary key,
  dashboard_id text references public.dashboards(id) on delete cascade not null,
  name text not null,
  description text,
  widget_type text not null, -- 'chart', 'table', 'metric', 'custom', etc.
  view_name text, -- name of the SQL view for this widget
  is_active boolean not null default true
);

-- Enable RLS on both tables
alter table public.dashboards enable row level security;
alter table public.widgets enable row level security;

-- Revoke all permissions and grant only select
revoke all on table public.dashboards from authenticated, service_role;
revoke all on table public.widgets from authenticated, service_role;

grant select on table public.dashboards to authenticated, service_role;
grant select on table public.widgets to authenticated, service_role;

-- Create indexes for performance
create index idx_widgets_dashboard_id on public.widgets (dashboard_id);
create index idx_widgets_is_active on public.widgets (is_active);
create index idx_widgets_widget_type on public.widgets (widget_type);

-- RLS Policies for dashboards - all authenticated users can view dashboards
create policy "All users can view dashboards" on public.dashboards for select to authenticated using (
  true
);

-- RLS Policies for widgets - users can only view widgets they have permission for
create policy "User can view widgets they have permission for" on public.widgets for select using (
  (select (public.has_permission(id::app_permission)))
);
