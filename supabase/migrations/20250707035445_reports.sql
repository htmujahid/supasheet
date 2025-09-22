/*
 * -------------------------------------------------------
 * Section: Reports
 * This migration creates the schema for reports.
 * -------------------------------------------------------
 */

-- Report table
create table if not exists supasheet.reports (
  id text primary key,
  name text not null,
  description text,
  "group" text,
  view_name text, -- name of the SQL view for this report item
  is_active boolean not null default true
);

-- Enable RLS on both tables
alter table supasheet.reports enable row level security;

-- Revoke all permissions and grant only select
revoke all on table supasheet.reports from authenticated, service_role;

grant select on table supasheet.reports to authenticated, service_role;

-- Create indexes for performance
create index idx_reports_is_active on supasheet.reports (is_active);

-- RLS Policies for report items - users can only view report items they have permission for
create policy "User can view report items they have permission for" on supasheet.reports for select using (
  (select (supasheet.has_permission(id::supasheet.app_permission)))
);
