/*
 * -------------------------------------------------------
 * Section: Reports and Report Items
 * This migration creates the schema for reports and report items.
 * Reports can contain multiple report items, and report items can have different view configurations.
 * -------------------------------------------------------
 */

-- Reports table
create table if not exists public.reports (
  id text primary key,
  name text not null,
  description text,
  icon text
);

-- Report Items table
create table if not exists public.report_items (
  id text primary key,
  report_id text references public.reports(id) on delete cascade not null,
  name text not null,
  description text,
  view_name text, -- name of the SQL view for this report item
  is_active boolean not null default true
);

-- Enable RLS on both tables
alter table public.reports enable row level security;
alter table public.report_items enable row level security;

-- Revoke all permissions and grant only select
revoke all on table public.reports from authenticated, service_role;
revoke all on table public.report_items from authenticated, service_role;

grant select on table public.reports to authenticated, service_role;
grant select on table public.report_items to authenticated, service_role;

-- Create indexes for performance
create index idx_report_items_report_id on public.report_items (report_id);
create index idx_report_items_is_active on public.report_items (is_active);

-- RLS Policies for reports - all authenticated users can view reports
create policy "All users can view reports" on public.reports for select to authenticated using (
  true
);

-- RLS Policies for report items - users can only view report items they have permission for
create policy "User can view report items they have permission for" on public.report_items for select using (
  (select (public.has_permission(id::app_permission)))
);
