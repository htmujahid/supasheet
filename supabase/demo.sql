-- ================================================================
-- Supasheet Demo — "Studio" (agency / project delivery workspace)
-- ================================================================
-- A single, unified schema + seed file that exercises every
-- Supasheet superpower in one coherent business domain: a small
-- creative/dev studio managing clients, staff, projects, tasks,
-- billable services, and invoices.
--
-- Feature coverage:
--   - Schema-scoped RBAC (supasheet.app_permission / role_permissions)
--   - Row Level Security via supasheet.has_permission()
--   - All column data types: URL, TEL, EMAIL, RICH_TEXT, COLOR,
--     PERCENTAGE, DURATION, file, AVATAR, enums, arrays
--   - All view layouts: kanban, calendar, gallery, list, tree
--   - Field sections, filter presets, quick_create, duplicated,
--     conditional field behavior, lookup fill + lookup filter
--   - Singleton resource (workspace_settings)
--   - Many-to-many junction with inline form (project_members)
--   - One-to-many detail lines with lookup-fill + a business
--     trigger that keeps parent totals in sync (invoice_items)
--   - Reports, dashboard widgets (card_1..4, table_1..2), charts
--     (pie/bar/line/radar)
--   - Notifications (fan-out on create/status change)
--   - Audit logging and per-resource comments
--   - Detail page "tabs" allowlist
--
-- Apply directly against a local Supabase Postgres instance, e.g.:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/demo.sql
--
-- Requires the base Supasheet migrations (supabase/migrations/*)
-- to already be applied. Also add "demo" to config.toml's
-- `api.schemas` / `api.extra_search_path` so PostgREST exposes it.
-- ================================================================
create schema if not exists demo;

grant usage on schema demo to authenticated;

----------------------------------------------------------------
-- Enums + permissions (must commit before use)
----------------------------------------------------------------
begin;

create type demo.client_status as enum('lead', 'active', 'on_hold', 'churned');

create type demo.department as enum(
  'design',
  'engineering',
  'product',
  'marketing',
  'sales',
  'operations'
);

create type demo.employment_status as enum('active', 'on_leave', 'offboarded');

create type demo.project_status as enum(
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled'
);

create type demo.priority_level as enum('low', 'medium', 'high', 'critical');

create type demo.milestone_status as enum(
  'pending',
  'in_progress',
  'completed',
  'missed'
);

create type demo.task_status as enum(
  'todo',
  'in_progress',
  'in_review',
  'blocked',
  'done',
  'cancelled'
);

create type demo.service_category as enum(
  'design',
  'development',
  'consulting',
  'marketing',
  'support'
);

create type demo.invoice_status as enum(
  'draft',
  'sent',
  'paid',
  'overdue',
  'void'
);

create type demo.portfolio_category as enum(
  'web',
  'branding',
  'mobile',
  'product_design',
  'marketing'
);

-- Clients
alter type supasheet.app_permission
add value 'demo.clients:select';

alter type supasheet.app_permission
add value 'demo.clients:insert';

alter type supasheet.app_permission
add value 'demo.clients:update';

alter type supasheet.app_permission
add value 'demo.clients:delete';

alter type supasheet.app_permission
add value 'demo.clients:audit';

alter type supasheet.app_permission
add value 'demo.clients:comment';

-- Team members
alter type supasheet.app_permission
add value 'demo.team_members:select';

alter type supasheet.app_permission
add value 'demo.team_members:insert';

alter type supasheet.app_permission
add value 'demo.team_members:update';

alter type supasheet.app_permission
add value 'demo.team_members:delete';

alter type supasheet.app_permission
add value 'demo.team_members:audit';

alter type supasheet.app_permission
add value 'demo.team_members:comment';

-- Projects
alter type supasheet.app_permission
add value 'demo.projects:select';

alter type supasheet.app_permission
add value 'demo.projects:insert';

alter type supasheet.app_permission
add value 'demo.projects:update';

alter type supasheet.app_permission
add value 'demo.projects:delete';

alter type supasheet.app_permission
add value 'demo.projects:audit';

alter type supasheet.app_permission
add value 'demo.projects:comment';

-- Project ↔ Team member junction (no :update — link rows are insert/delete only)
alter type supasheet.app_permission
add value 'demo.project_members:select';

alter type supasheet.app_permission
add value 'demo.project_members:insert';

alter type supasheet.app_permission
add value 'demo.project_members:delete';

alter type supasheet.app_permission
add value 'demo.project_members:audit';

alter type supasheet.app_permission
add value 'demo.project_members:comment';

-- Milestones
alter type supasheet.app_permission
add value 'demo.milestones:select';

alter type supasheet.app_permission
add value 'demo.milestones:insert';

alter type supasheet.app_permission
add value 'demo.milestones:update';

alter type supasheet.app_permission
add value 'demo.milestones:delete';

alter type supasheet.app_permission
add value 'demo.milestones:audit';

alter type supasheet.app_permission
add value 'demo.milestones:comment';

-- Tasks
alter type supasheet.app_permission
add value 'demo.tasks:select';

alter type supasheet.app_permission
add value 'demo.tasks:insert';

alter type supasheet.app_permission
add value 'demo.tasks:update';

alter type supasheet.app_permission
add value 'demo.tasks:delete';

alter type supasheet.app_permission
add value 'demo.tasks:audit';

alter type supasheet.app_permission
add value 'demo.tasks:comment';

-- Portfolio items (published case studies — gallery-first showcase)
alter type supasheet.app_permission
add value 'demo.portfolio_items:select';

alter type supasheet.app_permission
add value 'demo.portfolio_items:insert';

alter type supasheet.app_permission
add value 'demo.portfolio_items:update';

alter type supasheet.app_permission
add value 'demo.portfolio_items:delete';

alter type supasheet.app_permission
add value 'demo.portfolio_items:audit';

alter type supasheet.app_permission
add value 'demo.portfolio_items:comment';

-- Services (billing catalog)
alter type supasheet.app_permission
add value 'demo.services:select';

alter type supasheet.app_permission
add value 'demo.services:insert';

alter type supasheet.app_permission
add value 'demo.services:update';

alter type supasheet.app_permission
add value 'demo.services:delete';

alter type supasheet.app_permission
add value 'demo.services:audit';

alter type supasheet.app_permission
add value 'demo.services:comment';

-- Invoices
alter type supasheet.app_permission
add value 'demo.invoices:select';

alter type supasheet.app_permission
add value 'demo.invoices:insert';

alter type supasheet.app_permission
add value 'demo.invoices:update';

alter type supasheet.app_permission
add value 'demo.invoices:delete';

alter type supasheet.app_permission
add value 'demo.invoices:audit';

alter type supasheet.app_permission
add value 'demo.invoices:comment';

-- Invoice line items
alter type supasheet.app_permission
add value 'demo.invoice_items:select';

alter type supasheet.app_permission
add value 'demo.invoice_items:insert';

alter type supasheet.app_permission
add value 'demo.invoice_items:update';

alter type supasheet.app_permission
add value 'demo.invoice_items:delete';

alter type supasheet.app_permission
add value 'demo.invoice_items:audit';

alter type supasheet.app_permission
add value 'demo.invoice_items:comment';

-- Time entries
alter type supasheet.app_permission
add value 'demo.time_entries:select';

alter type supasheet.app_permission
add value 'demo.time_entries:insert';

alter type supasheet.app_permission
add value 'demo.time_entries:update';

alter type supasheet.app_permission
add value 'demo.time_entries:delete';

alter type supasheet.app_permission
add value 'demo.time_entries:audit';

alter type supasheet.app_permission
add value 'demo.time_entries:comment';

-- Workspace settings (singleton — no :delete)
alter type supasheet.app_permission
add value 'demo.workspace_settings:select';

alter type supasheet.app_permission
add value 'demo.workspace_settings:insert';

alter type supasheet.app_permission
add value 'demo.workspace_settings:update';

alter type supasheet.app_permission
add value 'demo.workspace_settings:audit';

alter type supasheet.app_permission
add value 'demo.workspace_settings:comment';

-- Users mirror view (so PostgREST joins from demo.* tables can resolve)
alter type supasheet.app_permission
add value 'demo.users:select';

-- Reports
alter type supasheet.app_permission
add value 'demo.clients_report:select';

alter type supasheet.app_permission
add value 'demo.projects_report:select';

alter type supasheet.app_permission
add value 'demo.invoices_report:select';

alter type supasheet.app_permission
add value 'demo.team_utilization_report:select';

-- Dashboard widgets
alter type supasheet.app_permission
add value 'demo.active_projects_count:select';

alter type supasheet.app_permission
add value 'demo.task_completion:select';

alter type supasheet.app_permission
add value 'demo.revenue_summary:select';

alter type supasheet.app_permission
add value 'demo.project_health:select';

alter type supasheet.app_permission
add value 'demo.recent_tasks:select';

alter type supasheet.app_permission
add value 'demo.upcoming_milestones:select';

alter type supasheet.app_permission
add value 'demo.top_clients:select';

-- Charts
alter type supasheet.app_permission
add value 'demo.tasks_by_status_pie:select';

alter type supasheet.app_permission
add value 'demo.projects_by_client_bar:select';

alter type supasheet.app_permission
add value 'demo.revenue_trend_line:select';

alter type supasheet.app_permission
add value 'demo.team_workload_radar:select';

commit;

----------------------------------------------------------------
-- Users mirror view
----------------------------------------------------------------
create or replace view demo.users
with
  (security_invoker = true) as
select
  *
from
  supasheet.users;

revoke all on demo.users
from
  authenticated,
  service_role;

grant
select
  on demo.users to authenticated;

----------------------------------------------------------------
-- Clients
----------------------------------------------------------------
create table demo.clients (
  id uuid primary key default extensions.uuid_generate_v4 (),
  name varchar(255) not null,
  logo supasheet.file,
  website supasheet.URL,
  email supasheet.EMAIL,
  phone supasheet.TEL,
  industry varchar(255),
  status demo.client_status not null default 'lead',
  address text,
  city varchar(255),
  country varchar(255),
  tags varchar(500) [],
  color supasheet.COLOR,
  notes text,
  user_id uuid default auth.uid () references supasheet.users (id) on delete set null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.clients.status is '{
    "progress": false,
    "enums": {
        "lead": {"variant": "info", "icon": "Sprout"},
        "active": {"variant": "success", "icon": "BadgeCheck"},
        "on_hold": {"variant": "warning", "icon": "PauseCircle"},
        "churned": {"variant": "destructive", "icon": "UserMinus"}
    }
}';

comment on table demo.clients is '{
    "icon": "Building2",
    "display": "block",
    "primary_view": "kanban",
    "views": [
        {
            "id": "kanban",
            "name": "Clients By Status",
            "type": "kanban",
            "group": "status",
            "title": "name",
            "description": "industry",
            "date": "created_at",
            "badge": "status"
        },
        {
            "id": "gallery",
            "name": "Client Gallery",
            "type": "gallery",
            "cover": "logo",
            "title": "name",
            "description": "industry",
            "badge": "status"
        }
    ],
    "filter_presets": [
        {"id": "active", "name": "Active", "filters": [{"id": "status", "value": "active", "operator": "eq"}]},
        {"id": "leads", "name": "Leads", "filters": [{"id": "status", "value": "lead", "operator": "eq"}]},
        {"id": "at_risk", "name": "At Risk", "filters": [{"id": "status", "value": "on_hold", "operator": "eq"}]}
    ],
    "fields": {
        "sections": [
            {"id": "profile", "title": "Profile", "fields": ["name", "logo", "industry", "status"]},
            {"id": "contact", "title": "Contact", "fields": ["website", "email", "phone"]},
            {"id": "location", "title": "Location", "fields": ["address", "city", "country"]},
            {"id": "organization", "title": "Organization", "fields": ["tags", "color"]},
            {"id": "extras", "title": "Notes", "collapsible": true, "fields": ["notes"]}
        ]
    },
    "query": {
        "sort": [{"id": "name", "desc": false}],
        "join": [{"table": "users", "on": "user_id", "columns": ["name", "email"]}]
    }
}';

comment on column demo.clients.logo is '{"accept":"image/*", "maxSize": 2097152}';

revoke all on table demo.clients
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.clients to authenticated;

create index idx_demo_clients_user_id on demo.clients (user_id);

create index idx_demo_clients_status on demo.clients (status);

create index idx_demo_clients_industry on demo.clients (industry);

create index idx_demo_clients_country on demo.clients (country);

create index idx_demo_clients_created_at on demo.clients (created_at desc);

alter table demo.clients enable row level security;

create policy clients_select on demo.clients for
select
  to authenticated using (supasheet.has_permission ('demo.clients:select'));

create policy clients_insert on demo.clients for insert to authenticated
with
  check (supasheet.has_permission ('demo.clients:insert'));

create policy clients_update on demo.clients
for update
  to authenticated using (supasheet.has_permission ('demo.clients:update'))
with
  check (supasheet.has_permission ('demo.clients:update'));

create policy clients_delete on demo.clients for delete to authenticated using (supasheet.has_permission ('demo.clients:delete'));

----------------------------------------------------------------
-- Team members (staff directory, org hierarchy)
----------------------------------------------------------------
create table demo.team_members (
  id uuid primary key default extensions.uuid_generate_v4 (),
  user_id uuid references supasheet.users (id) on delete set null,
  manager_id uuid references demo.team_members (id) on delete set null,
  name varchar(255) not null,
  avatar supasheet.AVATAR,
  email supasheet.EMAIL,
  phone supasheet.TEL,
  job_title varchar(255),
  department demo.department not null default 'operations',
  employment_status demo.employment_status not null default 'active',
  bio supasheet.RICH_TEXT,
  hire_date date,
  hourly_rate numeric(10, 2),
  color supasheet.COLOR,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.team_members.department is '{
    "progress": false,
    "enums": {
        "design": {"variant": "secondary", "icon": "Palette"},
        "engineering": {"variant": "info", "icon": "Code2"},
        "product": {"variant": "default", "icon": "Box"},
        "marketing": {"variant": "warning", "icon": "Megaphone"},
        "sales": {"variant": "success", "icon": "TrendingUp"},
        "operations": {"variant": "outline", "icon": "Settings2"}
    }
}';

comment on column demo.team_members.employment_status is '{
    "progress": false,
    "enums": {
        "active": {"variant": "success", "icon": "CircleCheck"},
        "on_leave": {"variant": "warning", "icon": "Palmtree"},
        "offboarded": {"variant": "destructive", "icon": "UserX"}
    }
}';

comment on table demo.team_members is '{
    "icon": "Users",
    "display": "block",
    "primary_view": "tree",
    "views": [
        {
            "id": "tree",
            "name": "Org Chart",
            "type": "tree",
            "parent": "manager_id",
            "title": "name",
            "secondary": "job_title"
        },
        {
            "id": "gallery",
            "name": "Team Gallery",
            "type": "gallery",
            "cover": "avatar",
            "title": "name",
            "description": "job_title",
            "badge": "department"
        }
    ],
    "filter_presets": [
        {"id": "active", "name": "Active", "filters": [{"id": "employment_status", "value": "active", "operator": "eq"}]}
    ],
    "fields": {
        "sections": [
            {"id": "identity", "title": "Identity", "fields": ["name", "avatar", "job_title", "department"]},
            {"id": "contact", "title": "Contact", "fields": ["email", "phone"]},
            {"id": "employment", "title": "Employment", "fields": ["employment_status", "manager_id", "hire_date", "hourly_rate"]},
            {"id": "extras", "title": "Bio", "collapsible": true, "fields": ["bio", "color"]}
        ]
    },
    "query": {
        "sort": [{"id": "name", "desc": false}],
        "join": [
            {"table": "users", "on": "user_id", "columns": ["name", "email"]},
            {"table": "team_members", "on": "manager_id", "alias": "manager", "columns": ["name", "job_title"]}
        ]
    }
}';

comment on column demo.team_members.avatar is '{"accept":"image/*"}';

revoke all on table demo.team_members
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.team_members to authenticated;

create index idx_demo_team_members_user_id on demo.team_members (user_id);

create index idx_demo_team_members_manager_id on demo.team_members (manager_id);

create index idx_demo_team_members_department on demo.team_members (department);

create index idx_demo_team_members_employment_status on demo.team_members (employment_status);

alter table demo.team_members enable row level security;

create policy team_members_select on demo.team_members for
select
  to authenticated using (supasheet.has_permission ('demo.team_members:select'));

create policy team_members_insert on demo.team_members for insert to authenticated
with
  check (supasheet.has_permission ('demo.team_members:insert'));

create policy team_members_update on demo.team_members
for update
  to authenticated using (supasheet.has_permission ('demo.team_members:update'))
with
  check (supasheet.has_permission ('demo.team_members:update'));

create policy team_members_delete on demo.team_members for delete to authenticated using (supasheet.has_permission ('demo.team_members:delete'));

----------------------------------------------------------------
-- Projects
----------------------------------------------------------------
create table demo.projects (
  id uuid primary key default extensions.uuid_generate_v4 (),
  name varchar(255) not null,
  client_id uuid references demo.clients (id) on delete set null,
  owner_id uuid references demo.team_members (id) on delete set null,
  description supasheet.RICH_TEXT,
  cover supasheet.file,
  status demo.project_status not null default 'planning',
  priority demo.priority_level not null default 'medium',
  budget numeric(12, 2),
  start_date date,
  due_date date,
  progress supasheet.PERCENTAGE default 0,
  tags varchar(500) [],
  color supasheet.COLOR,
  notes text,
  user_id uuid default auth.uid () references supasheet.users (id) on delete set null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.projects.status is '{
    "progress": true,
    "enums": {
        "planning": {"variant": "outline", "icon": "ClipboardList"},
        "active": {"variant": "info", "icon": "Play"},
        "on_hold": {"variant": "warning", "icon": "PauseCircle"},
        "completed": {"variant": "success", "icon": "CheckCircle2"},
        "cancelled": {"variant": "destructive", "icon": "XCircle"}
    }
}';

comment on column demo.projects.priority is '{
    "progress": false,
    "enums": {
        "low": {"variant": "outline", "icon": "ArrowDown"},
        "medium": {"variant": "info", "icon": "Minus"},
        "high": {"variant": "warning", "icon": "ArrowUp"},
        "critical": {"variant": "destructive", "icon": "Flame"}
    }
}';

comment on table demo.projects is '{
    "icon": "FolderKanban",
    "display": "block",
    "primary_view": "kanban",
    "tabs": ["tasks", "milestones", "invoices", "project_members"],
    "views": [
        {
            "id": "kanban",
            "name": "Projects By Status",
            "type": "kanban",
            "group": "status",
            "title": "name",
            "description": "notes",
            "date": "due_date",
            "badge": "priority"
        },
        {
            "id": "calendar",
            "name": "Project Timeline",
            "type": "calendar",
            "title": "name",
            "badge": "status",
            "start_date": "start_date",
            "end_date": "due_date"
        },
        {
            "id": "list",
            "name": "All Projects",
            "type": "list",
            "title": "name",
            "description": "status",
            "field_1": "status",
            "field_2": "due_date"
        }
    ],
    "filter_presets": [
        {"id": "active", "name": "Active", "filters": [{"id": "status", "value": "active", "operator": "eq"}]},
        {"id": "high_priority", "name": "High Priority", "filters": [{"id": "priority", "value": ["high", "critical"], "operator": "in"}]},
        {"id": "completed", "name": "Completed", "filters": [{"id": "status", "value": "completed", "operator": "eq"}]}
    ],
    "fields": {
        "sections": [
            {"id": "overview", "title": "Overview", "fields": ["name", "client_id", "owner_id", "description", "cover"]},
            {"id": "status", "title": "Status", "fields": ["status", "priority", "progress"]},
            {"id": "schedule", "title": "Schedule", "fields": ["start_date", "due_date"]},
            {"id": "budgeting", "title": "Budgeting", "fields": ["budget"]},
            {"id": "organization", "title": "Organization", "fields": ["tags", "color"]},
            {"id": "extras", "title": "Notes", "collapsible": true, "fields": ["notes"]}
        ]
    },
    "query": {
        "sort": [{"id": "due_date", "desc": false}],
        "join": [
            {"table": "users", "on": "user_id", "columns": ["name", "email"]},
            {"table": "clients", "on": "client_id", "columns": ["name", "industry"]},
            {"table": "team_members", "on": "owner_id", "columns": ["name", "avatar", "job_title"]}
        ]
    }
}';

comment on column demo.projects.cover is '{"accept":"image/*"}';

revoke all on table demo.projects
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.projects to authenticated;

create index idx_demo_projects_client_id on demo.projects (client_id);

create index idx_demo_projects_owner_id on demo.projects (owner_id);

create index idx_demo_projects_status on demo.projects (status);

create index idx_demo_projects_priority on demo.projects (priority);

create index idx_demo_projects_due_date on demo.projects (due_date);

create index idx_demo_projects_user_id on demo.projects (user_id);

create index idx_demo_projects_created_at on demo.projects (created_at desc);

alter table demo.projects enable row level security;

create policy projects_select on demo.projects for
select
  to authenticated using (supasheet.has_permission ('demo.projects:select'));

create policy projects_insert on demo.projects for insert to authenticated
with
  check (supasheet.has_permission ('demo.projects:insert'));

create policy projects_update on demo.projects
for update
  to authenticated using (supasheet.has_permission ('demo.projects:update'))
with
  check (supasheet.has_permission ('demo.projects:update'));

create policy projects_delete on demo.projects for delete to authenticated using (supasheet.has_permission ('demo.projects:delete'));

----------------------------------------------------------------
-- Project ↔ Team member junction (many-to-many, inline form)
----------------------------------------------------------------
create table demo.project_members (
  id uuid primary key default extensions.uuid_generate_v4 (),
  project_id uuid not null references demo.projects (id) on delete cascade,
  team_member_id uuid not null references demo.team_members (id) on delete cascade,
  role_on_project varchar(255),
  allocation_percent supasheet.PERCENTAGE,
  created_at timestamptz default current_timestamp,
  unique (project_id, team_member_id)
);

comment on table demo.project_members is '{
    "icon": "UserPlus",
    "inline_form": true,
    "display": "none",
    "fields": {
        "sections": [
            {"id": "link", "title": "Link", "fields": ["project_id", "team_member_id", "role_on_project"]},
            {"id": "details", "title": "Details", "fields": ["allocation_percent"]}
        ]
    },
    "query": {
        "sort": [{"id": "created_at", "desc": true}],
        "join": [
            {"table": "projects", "on": "project_id", "columns": ["name", "status"]},
            {"table": "team_members", "on": "team_member_id", "columns": ["name", "job_title", "avatar"]}
        ]
    }
}';

revoke all on table demo.project_members
from
  authenticated,
  service_role;

grant
select
,
  insert,
  delete on table demo.project_members to authenticated;

create index idx_demo_project_members_project_id on demo.project_members (project_id);

create index idx_demo_project_members_team_member_id on demo.project_members (team_member_id);

alter table demo.project_members enable row level security;

create policy project_members_select on demo.project_members for
select
  to authenticated using (
    supasheet.has_permission ('demo.project_members:select')
  );

create policy project_members_insert on demo.project_members for insert to authenticated
with
  check (
    supasheet.has_permission ('demo.project_members:insert')
  );

create policy project_members_delete on demo.project_members for delete to authenticated using (
  supasheet.has_permission ('demo.project_members:delete')
);

----------------------------------------------------------------
-- Milestones
----------------------------------------------------------------
create table demo.milestones (
  id uuid primary key default extensions.uuid_generate_v4 (),
  project_id uuid not null references demo.projects (id) on delete cascade,
  title varchar(255) not null,
  description text,
  due_date date,
  status demo.milestone_status not null default 'pending',
  sort_order integer default 0,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.milestones.status is '{
    "progress": true,
    "enums": {
        "pending": {"variant": "outline", "icon": "Circle"},
        "in_progress": {"variant": "info", "icon": "Loader"},
        "completed": {"variant": "success", "icon": "CheckCircle2"},
        "missed": {"variant": "destructive", "icon": "AlertTriangle"}
    }
}';

comment on table demo.milestones is '{
    "icon": "Milestone",
    "display": "block",
    "primary_view": "calendar",
    "views": [
        {
            "id": "calendar",
            "name": "Milestone Calendar",
            "type": "calendar",
            "title": "title",
            "badge": "status",
            "start_date": "due_date",
            "end_date": "due_date"
        },
        {
            "id": "kanban",
            "name": "Milestones By Status",
            "type": "kanban",
            "group": "status",
            "title": "title",
            "description": "description",
            "date": "due_date"
        }
    ],
    "fields": {
        "sections": [
            {"id": "details", "title": "Details", "fields": ["project_id", "title", "description"]},
            {"id": "schedule", "title": "Schedule", "fields": ["status", "due_date", "sort_order"]}
        ]
    },
    "query": {
        "sort": [{"id": "due_date", "desc": false}],
        "join": [{"table": "projects", "on": "project_id", "columns": ["name", "status"]}]
    }
}';

revoke all on table demo.milestones
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.milestones to authenticated;

create index idx_demo_milestones_project_id on demo.milestones (project_id);

create index idx_demo_milestones_status on demo.milestones (status);

create index idx_demo_milestones_due_date on demo.milestones (due_date);

alter table demo.milestones enable row level security;

create policy milestones_select on demo.milestones for
select
  to authenticated using (supasheet.has_permission ('demo.milestones:select'));

create policy milestones_insert on demo.milestones for insert to authenticated
with
  check (supasheet.has_permission ('demo.milestones:insert'));

create policy milestones_update on demo.milestones
for update
  to authenticated using (supasheet.has_permission ('demo.milestones:update'))
with
  check (supasheet.has_permission ('demo.milestones:update'));

create policy milestones_delete on demo.milestones for delete to authenticated using (supasheet.has_permission ('demo.milestones:delete'));

----------------------------------------------------------------
-- Tasks (kanban + tree for subtasks + calendar for due dates)
----------------------------------------------------------------
create table demo.tasks (
  id uuid primary key default extensions.uuid_generate_v4 (),
  project_id uuid references demo.projects (id) on delete cascade,
  milestone_id uuid references demo.milestones (id) on delete set null,
  parent_task_id uuid references demo.tasks (id) on delete cascade,
  assignee_id uuid references demo.team_members (id) on delete set null,
  title varchar(500) not null,
  description supasheet.RICH_TEXT,
  status demo.task_status not null default 'todo',
  priority demo.priority_level not null default 'medium',
  blocked_reason text,
  estimated_hours numeric(6, 2),
  due_date date,
  completed_at timestamptz,
  attachments supasheet.file,
  tags varchar(500) [],
  user_id uuid default auth.uid () references supasheet.users (id) on delete set null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.tasks.status is '{
    "progress": true,
    "enums": {
        "todo": {"variant": "outline", "icon": "Circle"},
        "in_progress": {"variant": "info", "icon": "Loader"},
        "in_review": {"variant": "warning", "icon": "Eye"},
        "blocked": {"variant": "destructive", "icon": "Ban"},
        "done": {"variant": "success", "icon": "CheckCircle2"},
        "cancelled": {"variant": "secondary", "icon": "XCircle"}
    }
}';

comment on column demo.tasks.priority is '{
    "progress": false,
    "enums": {
        "low": {"variant": "outline", "icon": "ArrowDown"},
        "medium": {"variant": "info", "icon": "Minus"},
        "high": {"variant": "warning", "icon": "ArrowUp"},
        "critical": {"variant": "destructive", "icon": "Flame"}
    }
}';

comment on table demo.tasks is '{
    "icon": "ListTodo",
    "display": "block",
    "primary_view": "kanban",
    "views": [
        {
            "id": "kanban",
            "name": "Tasks By Status",
            "type": "kanban",
            "group": "status",
            "title": "title",
            "description": "description",
            "date": "due_date",
            "badge": "priority"
        },
        {
            "id": "tree",
            "name": "Task Breakdown",
            "type": "tree",
            "parent": "parent_task_id",
            "title": "title",
            "secondary": "status"
        },
        {
            "id": "calendar",
            "name": "Task Due Dates",
            "type": "calendar",
            "title": "title",
            "badge": "status",
            "start_date": "created_at",
            "end_date": "due_date"
        }
    ],
    "filter_presets": [
        {"id": "todo", "name": "To Do", "filters": [{"id": "status", "value": "todo", "operator": "eq"}]},
        {"id": "in_progress", "name": "In Progress", "filters": [{"id": "status", "value": "in_progress", "operator": "eq"}]},
        {"id": "blocked", "name": "Blocked", "filters": [{"id": "status", "value": "blocked", "operator": "eq"}]},
        {"id": "done", "name": "Done", "filters": [{"id": "status", "value": "done", "operator": "eq"}]}
    ],
    "fields": {
        "quick_create": ["title", "project_id", "assignee_id", "due_date", "priority"],
        "duplicated": ["title", "description", "status", "priority", "project_id", "milestone_id", "assignee_id", "estimated_hours", "tags"],
        "sections": [
            {"id": "summary", "title": "Summary", "fields": ["title", "description", "project_id", "milestone_id", "parent_task_id"]},
            {"id": "assignment", "title": "Assignment", "fields": ["assignee_id", "status", "priority"]},
            {"id": "blocker", "title": "Blocker", "fields": ["blocked_reason"]},
            {"id": "schedule", "title": "Schedule", "fields": ["due_date", "estimated_hours", "completed_at"]},
            {"id": "extras", "title": "Attachments & tags", "collapsible": true, "fields": ["attachments", "tags"]}
        ],
        "behavior": {
            "blocked_reason": {
                "visible": [{"id": "status", "operator": "eq", "value": "blocked"}],
                "required": [{"id": "status", "operator": "eq", "value": "blocked"}]
            },
            "completed_at": {
                "visible": [{"id": "status", "operator": "eq", "value": "done"}]
            }
        }
    },
    "query": {
        "sort": [{"id": "due_date", "desc": false}],
        "join": [
            {"table": "users", "on": "user_id", "columns": ["name", "email"]},
            {"table": "projects", "on": "project_id", "columns": ["name", "status"]},
            {"table": "milestones", "on": "milestone_id", "columns": ["title", "status"]},
            {"table": "team_members", "on": "assignee_id", "columns": ["name", "avatar", "job_title"]}
        ]
    }
}';

comment on column demo.tasks.attachments is '{"accept":"*", "maxFiles": 20}';

revoke all on table demo.tasks
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.tasks to authenticated;

create index idx_demo_tasks_project_id on demo.tasks (project_id);

create index idx_demo_tasks_milestone_id on demo.tasks (milestone_id);

create index idx_demo_tasks_parent_task_id on demo.tasks (parent_task_id);

create index idx_demo_tasks_assignee_id on demo.tasks (assignee_id);

create index idx_demo_tasks_status on demo.tasks (status);

create index idx_demo_tasks_priority on demo.tasks (priority);

create index idx_demo_tasks_due_date on demo.tasks (due_date);

create index idx_demo_tasks_user_id on demo.tasks (user_id);

create index idx_demo_tasks_created_at on demo.tasks (created_at desc);

alter table demo.tasks enable row level security;

create policy tasks_select on demo.tasks for
select
  to authenticated using (supasheet.has_permission ('demo.tasks:select'));

create policy tasks_insert on demo.tasks for insert to authenticated
with
  check (supasheet.has_permission ('demo.tasks:insert'));

create policy tasks_update on demo.tasks
for update
  to authenticated using (supasheet.has_permission ('demo.tasks:update'))
with
  check (supasheet.has_permission ('demo.tasks:update'));

create policy tasks_delete on demo.tasks for delete to authenticated using (supasheet.has_permission ('demo.tasks:delete'));

----------------------------------------------------------------
-- Portfolio items (published case studies — gallery is the natural
-- default here: a visual grid of finished work, like a studio's
-- public portfolio page)
----------------------------------------------------------------
create table demo.portfolio_items (
  id uuid primary key default extensions.uuid_generate_v4 (),
  project_id uuid references demo.projects (id) on delete set null,
  client_id uuid references demo.clients (id) on delete set null,
  title varchar(255) not null,
  summary text,
  description supasheet.RICH_TEXT,
  cover supasheet.file,
  category demo.portfolio_category not null default 'web',
  external_url supasheet.URL,
  is_published boolean not null default true,
  published_at date,
  tags varchar(500) [],
  color supasheet.COLOR,
  sort_order integer default 0,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.portfolio_items.category is '{
    "progress": false,
    "enums": {
        "web": {"variant": "info", "icon": "Globe"},
        "branding": {"variant": "secondary", "icon": "Palette"},
        "mobile": {"variant": "success", "icon": "Smartphone"},
        "product_design": {"variant": "default", "icon": "Box"},
        "marketing": {"variant": "warning", "icon": "Megaphone"}
    }
}';

comment on table demo.portfolio_items is '{
    "icon": "Image",
    "display": "block",
    "primary_view": "gallery",
    "views": [
        {
            "id": "gallery",
            "name": "Portfolio Gallery",
            "type": "gallery",
            "cover": "cover",
            "title": "title",
            "description": "summary",
            "badge": "category"
        },
        {
            "id": "list",
            "name": "Case Studies List",
            "type": "list",
            "title": "title",
            "description": "summary",
            "field_1": "category",
            "field_2": "published_at"
        }
    ],
    "filter_presets": [
        {"id": "published", "name": "Published", "filters": [{"id": "is_published", "value": "true", "operator": "eq"}]},
        {"id": "draft", "name": "Drafts", "filters": [{"id": "is_published", "value": "false", "operator": "eq"}]}
    ],
    "fields": {
        "sections": [
            {"id": "overview", "title": "Overview", "fields": ["title", "cover", "category", "project_id", "client_id"]},
            {"id": "content", "title": "Content", "fields": ["summary", "description", "external_url"]},
            {"id": "publishing", "title": "Publishing", "fields": ["is_published", "published_at", "sort_order"]},
            {"id": "organization", "title": "Organization", "fields": ["tags", "color"]}
        ]
    },
    "query": {
        "sort": [{"id": "sort_order", "desc": false}],
        "join": [
            {"table": "projects", "on": "project_id", "columns": ["name", "status"]},
            {"table": "clients", "on": "client_id", "columns": ["name", "industry"]}
        ]
    }
}';

comment on column demo.portfolio_items.cover is '{"accept":"image/*", "maxSize": 5242880}';

revoke all on table demo.portfolio_items
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.portfolio_items to authenticated;

create index idx_demo_portfolio_items_project_id on demo.portfolio_items (project_id);

create index idx_demo_portfolio_items_client_id on demo.portfolio_items (client_id);

create index idx_demo_portfolio_items_category on demo.portfolio_items (category);

create index idx_demo_portfolio_items_is_published on demo.portfolio_items (is_published);

create index idx_demo_portfolio_items_sort_order on demo.portfolio_items (sort_order);

alter table demo.portfolio_items enable row level security;

create policy portfolio_items_select on demo.portfolio_items for
select
  to authenticated using (
    supasheet.has_permission ('demo.portfolio_items:select')
  );

create policy portfolio_items_insert on demo.portfolio_items for insert to authenticated
with
  check (
    supasheet.has_permission ('demo.portfolio_items:insert')
  );

create policy portfolio_items_update on demo.portfolio_items
for update
  to authenticated using (
    supasheet.has_permission ('demo.portfolio_items:update')
  )
with
  check (
    supasheet.has_permission ('demo.portfolio_items:update')
  );

create policy portfolio_items_delete on demo.portfolio_items for delete to authenticated using (
  supasheet.has_permission ('demo.portfolio_items:delete')
);

----------------------------------------------------------------
-- Services (billable catalog — list view)
----------------------------------------------------------------
create table demo.services (
  id uuid primary key default extensions.uuid_generate_v4 (),
  name varchar(255) not null,
  description text,
  category demo.service_category not null default 'development',
  default_rate numeric(10, 2) not null default 0,
  unit varchar(20) not null default 'hour',
  is_active boolean not null default true,
  color supasheet.COLOR,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.services.category is '{
    "progress": false,
    "enums": {
        "design": {"variant": "secondary", "icon": "Palette"},
        "development": {"variant": "info", "icon": "Code2"},
        "consulting": {"variant": "default", "icon": "Lightbulb"},
        "marketing": {"variant": "warning", "icon": "Megaphone"},
        "support": {"variant": "success", "icon": "LifeBuoy"}
    }
}';

comment on table demo.services is '{
    "icon": "Wrench",
    "display": "block",
    "primary_view": "list",
    "views": [
        {
            "id": "list",
            "name": "Service Catalog",
            "type": "list",
            "title": "name",
            "description": "category",
            "field_1": "default_rate",
            "field_2": "unit"
        },
        {
            "id": "kanban",
            "name": "Services By Category",
            "type": "kanban",
            "group": "category",
            "title": "name",
            "description": "description"
        }
    ],
    "fields": {
        "sections": [
            {"id": "details", "title": "Details", "fields": ["name", "description", "category"]},
            {"id": "pricing", "title": "Pricing", "fields": ["default_rate", "unit", "is_active", "color"]}
        ]
    },
    "query": {"sort": [{"id": "name", "desc": false}]}
}';

revoke all on table demo.services
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.services to authenticated;

create index idx_demo_services_category on demo.services (category);

create index idx_demo_services_is_active on demo.services (is_active);

alter table demo.services enable row level security;

create policy services_select on demo.services for
select
  to authenticated using (supasheet.has_permission ('demo.services:select'));

create policy services_insert on demo.services for insert to authenticated
with
  check (supasheet.has_permission ('demo.services:insert'));

create policy services_update on demo.services
for update
  to authenticated using (supasheet.has_permission ('demo.services:update'))
with
  check (supasheet.has_permission ('demo.services:update'));

create policy services_delete on demo.services for delete to authenticated using (supasheet.has_permission ('demo.services:delete'));

----------------------------------------------------------------
-- Invoices
----------------------------------------------------------------
create sequence if not exists demo.invoice_number_seq;

create table demo.invoices (
  id uuid primary key default extensions.uuid_generate_v4 (),
  invoice_number varchar(50) not null unique default (
    'INV-' || to_char(current_date, 'YYYY') || '-' || lpad(
      nextval('demo.invoice_number_seq')::text,
      4,
      '0'
    )
  ),
  client_id uuid not null references demo.clients (id) on delete restrict,
  project_id uuid references demo.projects (id) on delete set null,
  status demo.invoice_status not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  currency varchar(3) not null default 'USD',
  subtotal numeric(12, 2) not null default 0,
  tax_rate supasheet.PERCENTAGE default 0,
  tax_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null default 0,
  paid_at timestamptz,
  notes text,
  user_id uuid default auth.uid () references supasheet.users (id) on delete set null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column demo.invoices.status is '{
    "progress": true,
    "enums": {
        "draft": {"variant": "outline", "icon": "FileEdit"},
        "sent": {"variant": "info", "icon": "Send"},
        "paid": {"variant": "success", "icon": "CircleCheck"},
        "overdue": {"variant": "destructive", "icon": "AlertCircle"},
        "void": {"variant": "secondary", "icon": "Ban"}
    }
}';

comment on table demo.invoices is '{
    "icon": "Receipt",
    "display": "block",
    "primary_view": "kanban",
    "tabs": ["invoice_items"],
    "views": [
        {
            "id": "kanban",
            "name": "Invoices By Status",
            "type": "kanban",
            "group": "status",
            "title": "invoice_number",
            "description": "notes",
            "date": "due_date",
            "badge": "status"
        },
        {
            "id": "calendar",
            "name": "Invoice Due Dates",
            "type": "calendar",
            "title": "invoice_number",
            "badge": "status",
            "start_date": "issue_date",
            "end_date": "due_date"
        }
    ],
    "filter_presets": [
        {"id": "unpaid", "name": "Unpaid", "filters": [{"id": "status", "value": ["sent", "overdue"], "operator": "in"}]},
        {"id": "overdue", "name": "Overdue", "filters": [{"id": "status", "value": "overdue", "operator": "eq"}]},
        {"id": "paid", "name": "Paid", "filters": [{"id": "status", "value": "paid", "operator": "eq"}]}
    ],
    "fields": {
        "sections": [
            {"id": "details", "title": "Details", "fields": ["invoice_number", "client_id", "project_id", "status"]},
            {"id": "dates", "title": "Dates", "fields": ["issue_date", "due_date", "paid_at"]},
            {"id": "amounts", "title": "Amounts", "fields": ["currency", "subtotal", "tax_rate", "tax_amount", "total"]},
            {"id": "extras", "title": "Notes", "collapsible": true, "fields": ["notes"]}
        ],
        "behavior": {
            "paid_at": {"visible": [{"id": "status", "operator": "eq", "value": "paid"}]}
        },
        "lookups": {
            "project_id": {"filter": [{"on": "client_id", "column": "client_id"}]}
        }
    },
    "query": {
        "sort": [{"id": "due_date", "desc": true}],
        "join": [
            {"table": "users", "on": "user_id", "columns": ["name", "email"]},
            {"table": "clients", "on": "client_id", "columns": ["name", "email"]},
            {"table": "projects", "on": "project_id", "columns": ["name", "status"]}
        ]
    }
}';

revoke all on table demo.invoices
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.invoices to authenticated;

create index idx_demo_invoices_client_id on demo.invoices (client_id);

create index idx_demo_invoices_project_id on demo.invoices (project_id);

create index idx_demo_invoices_status on demo.invoices (status);

create index idx_demo_invoices_issue_date on demo.invoices (issue_date);

create index idx_demo_invoices_due_date on demo.invoices (due_date);

create index idx_demo_invoices_user_id on demo.invoices (user_id);

alter table demo.invoices enable row level security;

create policy invoices_select on demo.invoices for
select
  to authenticated using (supasheet.has_permission ('demo.invoices:select'));

create policy invoices_insert on demo.invoices for insert to authenticated
with
  check (supasheet.has_permission ('demo.invoices:insert'));

create policy invoices_update on demo.invoices
for update
  to authenticated using (supasheet.has_permission ('demo.invoices:update'))
with
  check (supasheet.has_permission ('demo.invoices:update'));

create policy invoices_delete on demo.invoices for delete to authenticated using (supasheet.has_permission ('demo.invoices:delete'));

----------------------------------------------------------------
-- Invoice line items (lookup fill from services catalog)
----------------------------------------------------------------
create table demo.invoice_items (
  id uuid primary key default extensions.uuid_generate_v4 (),
  invoice_id uuid not null references demo.invoices (id) on delete cascade,
  service_id uuid references demo.services (id) on delete set null,
  description varchar(500),
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(10, 2) not null default 0,
  line_total numeric(12, 2) generated always as (quantity * unit_price) stored,
  sort_order integer default 0,
  created_at timestamptz default current_timestamp
);

comment on table demo.invoice_items is '{
    "icon": "ListPlus",
    "inline_form": true,
    "display": "none",
    "fields": {
        "sections": [
            {"id": "line", "title": "Line item", "fields": ["service_id", "description"]},
            {"id": "pricing", "title": "Pricing", "fields": ["quantity", "unit_price", "line_total"]}
        ],
        "lookups": {
            "service_id": {
                "fill": [
                    {"target": "unit_price", "source": "default_rate"},
                    {"target": "description", "source": "name"}
                ]
            }
        }
    },
    "query": {
        "sort": [{"id": "sort_order", "desc": false}],
        "join": [
            {"table": "invoices", "on": "invoice_id", "columns": ["invoice_number", "status"]},
            {"table": "services", "on": "service_id", "columns": ["name", "category"]}
        ]
    }
}';

revoke all on table demo.invoice_items
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.invoice_items to authenticated;

create index idx_demo_invoice_items_invoice_id on demo.invoice_items (invoice_id);

create index idx_demo_invoice_items_service_id on demo.invoice_items (service_id);

alter table demo.invoice_items enable row level security;

create policy invoice_items_select on demo.invoice_items for
select
  to authenticated using (
    supasheet.has_permission ('demo.invoice_items:select')
  );

create policy invoice_items_insert on demo.invoice_items for insert to authenticated
with
  check (
    supasheet.has_permission ('demo.invoice_items:insert')
  );

create policy invoice_items_update on demo.invoice_items
for update
  to authenticated using (
    supasheet.has_permission ('demo.invoice_items:update')
  )
with
  check (
    supasheet.has_permission ('demo.invoice_items:update')
  );

create policy invoice_items_delete on demo.invoice_items for delete to authenticated using (
  supasheet.has_permission ('demo.invoice_items:delete')
);

-- Keep parent invoice totals in sync with its line items.
create or replace function demo.trg_invoice_items_recalc () returns trigger as $$
declare
    v_invoice_id uuid := coalesce(new.invoice_id, old.invoice_id);
    v_subtotal   numeric(12, 2);
    v_tax_rate   numeric;
    v_tax_amount numeric(12, 2);
begin
    select coalesce(sum(line_total), 0) into v_subtotal
    from demo.invoice_items
    where invoice_id = v_invoice_id;

    select coalesce(tax_rate, 0) into v_tax_rate
    from demo.invoices
    where id = v_invoice_id;

    v_tax_amount := round(v_subtotal * v_tax_rate / 100, 2);

    update demo.invoices
    set subtotal   = v_subtotal,
        tax_amount = v_tax_amount,
        total      = v_subtotal + v_tax_amount,
        updated_at = current_timestamp
    where id = v_invoice_id;

    return coalesce(new, old);
end;
$$ language plpgsql security definer
set
  search_path = '';

create trigger invoice_items_recalc
after insert
or update
or delete on demo.invoice_items for each row
execute function demo.trg_invoice_items_recalc ();

----------------------------------------------------------------
-- Time entries (billable hours logged against tasks)
----------------------------------------------------------------
create table demo.time_entries (
  id uuid primary key default extensions.uuid_generate_v4 (),
  task_id uuid references demo.tasks (id) on delete cascade,
  team_member_id uuid references demo.team_members (id) on delete set null,
  entry_date date not null default current_date,
  duration supasheet.DURATION not null,
  is_billable boolean not null default true,
  notes text,
  created_at timestamptz default current_timestamp
);

comment on table demo.time_entries is '{
    "icon": "Clock",
    "display": "block",
    "fields": {
        "sections": [
            {"id": "entry", "title": "Entry", "fields": ["task_id", "team_member_id", "entry_date"]},
            {"id": "duration", "title": "Duration", "fields": ["duration", "is_billable", "notes"]}
        ]
    },
    "query": {
        "sort": [{"id": "entry_date", "desc": true}],
        "join": [
            {"table": "tasks", "on": "task_id", "columns": ["title", "status"]},
            {"table": "team_members", "on": "team_member_id", "columns": ["name", "avatar"]}
        ]
    }
}';

revoke all on table demo.time_entries
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update,
  delete on table demo.time_entries to authenticated;

create index idx_demo_time_entries_task_id on demo.time_entries (task_id);

create index idx_demo_time_entries_team_member_id on demo.time_entries (team_member_id);

create index idx_demo_time_entries_entry_date on demo.time_entries (entry_date desc);

alter table demo.time_entries enable row level security;

create policy time_entries_select on demo.time_entries for
select
  to authenticated using (
    supasheet.has_permission ('demo.time_entries:select')
  );

create policy time_entries_insert on demo.time_entries for insert to authenticated
with
  check (
    supasheet.has_permission ('demo.time_entries:insert')
  );

create policy time_entries_update on demo.time_entries
for update
  to authenticated using (
    supasheet.has_permission ('demo.time_entries:update')
  )
with
  check (
    supasheet.has_permission ('demo.time_entries:update')
  );

create policy time_entries_delete on demo.time_entries for delete to authenticated using (
  supasheet.has_permission ('demo.time_entries:delete')
);

----------------------------------------------------------------
-- Workspace settings (singleton — one row only)
----------------------------------------------------------------
create table demo.workspace_settings (
  id uuid primary key default extensions.uuid_generate_v4 (),
  workspace_name varchar(255) not null default 'My Studio',
  logo supasheet.file,
  primary_color supasheet.COLOR default '#6366f1',
  default_currency varchar(3) not null default 'USD',
  invoice_prefix varchar(20) not null default 'INV',
  support_email supasheet.EMAIL,
  timezone varchar(100) not null default 'UTC',
  fiscal_year_start date,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on table demo.workspace_settings is '{
    "icon": "Settings",
    "name": "Workspace Settings",
    "display": "block",
    "singleton": true,
    "fields": {
        "sections": [
            {"id": "identity", "title": "Identity", "fields": ["workspace_name", "logo", "primary_color"]},
            {"id": "billing", "title": "Billing", "fields": ["default_currency", "invoice_prefix", "fiscal_year_start"]},
            {"id": "contact", "title": "Contact", "fields": ["support_email", "timezone"]}
        ]
    }
}';

comment on column demo.workspace_settings.logo is '{"accept":"image/*", "maxSize": 2097152}';

revoke all on table demo.workspace_settings
from
  authenticated,
  service_role;

grant
select
,
  insert,
  update on table demo.workspace_settings to authenticated;

alter table demo.workspace_settings enable row level security;

create policy workspace_settings_select on demo.workspace_settings for
select
  to authenticated using (
    supasheet.has_permission ('demo.workspace_settings:select')
  );

create policy workspace_settings_insert on demo.workspace_settings for insert to authenticated
with
  check (
    supasheet.has_permission ('demo.workspace_settings:insert')
  );

create policy workspace_settings_update on demo.workspace_settings
for update
  to authenticated using (
    supasheet.has_permission ('demo.workspace_settings:update')
  )
with
  check (
    supasheet.has_permission ('demo.workspace_settings:update')
  );

----------------------------------------------------------------
-- Reports
----------------------------------------------------------------
create or replace view demo.clients_report
with
  (security_invoker = true) as
select
  c.id,
  c.name,
  c.industry,
  c.status,
  c.country,
  u.name as owner,
  count(distinct p.id) as project_count,
  count(distinct i.id) as invoice_count,
  coalesce(
    sum(i.total) filter (
      where
        i.status = 'paid'
    ),
    0
  ) as revenue_collected,
  coalesce(
    sum(i.total) filter (
      where
        i.status in ('sent', 'overdue')
    ),
    0
  ) as revenue_outstanding,
  c.created_at
from
  demo.clients c
  left join supasheet.users u on u.id = c.user_id
  left join demo.projects p on p.client_id = c.id
  left join demo.invoices i on i.client_id = c.id
group by
  c.id,
  u.name;

revoke all on demo.clients_report
from
  authenticated,
  service_role;

grant
select
  on demo.clients_report to authenticated;

comment on view demo.clients_report is '{"type": "report", "name": "Clients Report", "description": "Clients with project counts and invoice revenue rollups"}';

create or replace view demo.projects_report
with
  (security_invoker = true) as
select
  p.id,
  p.name,
  p.status,
  p.priority,
  p.budget,
  p.progress,
  p.due_date,
  c.name as client,
  tm.name as owner,
  count(distinct t.id) as task_count,
  count(distinct t.id) filter (
    where
      t.status = 'done'
  ) as tasks_done,
  coalesce(sum(te.duration), 0) as total_seconds_logged,
  p.created_at
from
  demo.projects p
  left join demo.clients c on c.id = p.client_id
  left join demo.team_members tm on tm.id = p.owner_id
  left join demo.tasks t on t.project_id = p.id
  left join demo.time_entries te on te.task_id = t.id
group by
  p.id,
  c.name,
  tm.name;

revoke all on demo.projects_report
from
  authenticated,
  service_role;

grant
select
  on demo.projects_report to authenticated;

comment on view demo.projects_report is '{"type": "report", "name": "Projects Report", "description": "Projects with client, owner, task, and logged-time rollups"}';

create or replace view demo.invoices_report
with
  (security_invoker = true) as
select
  i.id,
  i.invoice_number,
  i.status,
  i.issue_date,
  i.due_date,
  i.currency,
  i.total,
  c.name as client,
  p.name as project,
  count(ii.id) as item_count,
  i.created_at
from
  demo.invoices i
  left join demo.clients c on c.id = i.client_id
  left join demo.projects p on p.id = i.project_id
  left join demo.invoice_items ii on ii.invoice_id = i.id
group by
  i.id,
  c.name,
  p.name;

revoke all on demo.invoices_report
from
  authenticated,
  service_role;

grant
select
  on demo.invoices_report to authenticated;

comment on view demo.invoices_report is '{"type": "report", "name": "Invoices Report", "description": "Invoices with client, project, and line item counts"}';

create or replace view demo.team_utilization_report
with
  (security_invoker = true) as
select
  tm.id,
  tm.name,
  tm.department,
  tm.job_title,
  count(distinct t.id) as tasks_assigned,
  count(distinct t.id) filter (
    where
      t.status = 'done'
  ) as tasks_completed,
  count(distinct pm.project_id) as active_projects,
  coalesce(sum(te.duration), 0) as total_seconds_logged
from
  demo.team_members tm
  left join demo.tasks t on t.assignee_id = tm.id
  left join demo.project_members pm on pm.team_member_id = tm.id
  left join demo.time_entries te on te.team_member_id = tm.id
group by
  tm.id;

revoke all on demo.team_utilization_report
from
  authenticated,
  service_role;

grant
select
  on demo.team_utilization_report to authenticated;

comment on view demo.team_utilization_report is '{"type": "report", "name": "Team Utilization Report", "description": "Task load and logged hours per team member"}';

----------------------------------------------------------------
-- Dashboard widget views
----------------------------------------------------------------
-- card_1: count of active projects
create or replace view demo.active_projects_count
with
  (security_invoker = true) as
select
  count(*) as value,
  'folder-kanban' as icon,
  'active projects' as label
from
  demo.projects
where
  status = 'active';

revoke all on demo.active_projects_count
from
  authenticated,
  service_role;

grant
select
  on demo.active_projects_count to authenticated;

-- card_2: task completion (done vs open)
create or replace view demo.task_completion
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'done'
  ) as primary,
  count(*) filter (
    where
      status not in ('done', 'cancelled')
  ) as secondary,
  'Done' as primary_label,
  'Open' as secondary_label
from
  demo.tasks;

revoke all on demo.task_completion
from
  authenticated,
  service_role;

grant
select
  on demo.task_completion to authenticated;

-- card_3: revenue collected + collection rate
create or replace view demo.revenue_summary
with
  (security_invoker = true) as
select
  coalesce(
    sum(total) filter (
      where
        status = 'paid'
    ),
    0
  ) as value,
  case
    when count(*) filter (
      where
        status in ('paid', 'sent', 'overdue')
    ) > 0 then round(
      (
        count(*) filter (
          where
            status = 'paid'
        )::numeric / count(*) filter (
          where
            status in ('paid', 'sent', 'overdue')
        )::numeric
      ) * 100,
      1
    )
    else 0
  end as percent
from
  demo.invoices;

revoke all on demo.revenue_summary
from
  authenticated,
  service_role;

grant
select
  on demo.revenue_summary to authenticated;

-- card_4: project health (at-risk breakdown)
create or replace view demo.project_health
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status not in ('completed', 'cancelled')
      and (
        priority in ('high', 'critical')
        or (
          due_date is not null
          and due_date < current_date
        )
      )
  ) as current,
  count(*) filter (
    where
      status not in ('completed', 'cancelled')
  ) as total,
  json_build_array(
    json_build_object(
      'label',
      'Critical',
      'value',
      count(*) filter (
        where
          status not in ('completed', 'cancelled')
          and priority = 'critical'
      )
    ),
    json_build_object(
      'label',
      'High',
      'value',
      count(*) filter (
        where
          status not in ('completed', 'cancelled')
          and priority = 'high'
      )
    ),
    json_build_object(
      'label',
      'Overdue',
      'value',
      count(*) filter (
        where
          status not in ('completed', 'cancelled')
          and due_date is not null
          and due_date < current_date
      )
    )
  ) as segments
from
  demo.projects;

revoke all on demo.project_health
from
  authenticated,
  service_role;

grant
select
  on demo.project_health to authenticated;

-- table_1: recent tasks
create or replace view demo.recent_tasks
with
  (security_invoker = true) as
select
  title,
  status,
  coalesce(due_date::text, 'no due date') as amount,
  to_char(created_at, 'MM/DD') as date
from
  demo.tasks
order by
  created_at desc
limit
  10;

revoke all on demo.recent_tasks
from
  authenticated,
  service_role;

grant
select
  on demo.recent_tasks to authenticated;

-- table_1: upcoming milestones (pairs with Recent Tasks to fill the row)
create or replace view demo.upcoming_milestones
with
  (security_invoker = true) as
select
  m.title,
  p.name as project,
  m.status,
  to_char(m.due_date, 'MM/DD') as date
from
  demo.milestones m
  left join demo.projects p on p.id = m.project_id
where
  m.status not in ('completed', 'missed')
  and m.due_date is not null
order by
  m.due_date asc
limit
  10;

revoke all on demo.upcoming_milestones
from
  authenticated,
  service_role;

grant
select
  on demo.upcoming_milestones to authenticated;

-- table_2: top clients by revenue
create or replace view demo.top_clients
with
  (security_invoker = true) as
select
  c.name as client,
  c.industry,
  count(i.id) as invoices,
  coalesce(sum(i.total), 0) as revenue
from
  demo.clients c
  left join demo.invoices i on i.client_id = c.id
group by
  c.id,
  c.name,
  c.industry
having
  count(i.id) > 0
order by
  revenue desc nulls last
limit
  10;

revoke all on demo.top_clients
from
  authenticated,
  service_role;

grant
select
  on demo.top_clients to authenticated;

comment on view demo.active_projects_count is '{"type": "dashboard_widget", "name": "Active Projects", "description": "Count of projects currently active", "widget_type": "card_1"}';

comment on view demo.task_completion is '{"type": "dashboard_widget", "name": "Task Completion", "description": "Done vs open tasks", "widget_type": "card_2"}';

comment on view demo.revenue_summary is '{"type": "dashboard_widget", "name": "Revenue Collected", "description": "Paid revenue and collection rate", "widget_type": "card_3"}';

comment on view demo.project_health is '{"type": "dashboard_widget", "name": "Project Health", "description": "At-risk open projects breakdown", "widget_type": "card_4"}';

comment on view demo.recent_tasks is '{"type": "dashboard_widget", "name": "Recent Tasks", "description": "Latest 10 tasks", "widget_type": "table_1"}';

comment on view demo.upcoming_milestones is '{"type": "dashboard_widget", "name": "Upcoming Milestones", "description": "Next 10 milestones due across active projects", "widget_type": "table_1"}';

comment on view demo.top_clients is '{"type": "dashboard_widget", "name": "Top Clients", "description": "Top 10 clients by invoiced revenue", "widget_type": "table_2"}';

----------------------------------------------------------------
-- Charts
----------------------------------------------------------------
-- Pie: tasks by status
create or replace view demo.tasks_by_status_pie
with
  (security_invoker = true) as
select
  status::text as label,
  count(*) as value
from
  demo.tasks
group by
  status
order by
  case status
    when 'todo' then 1
    when 'in_progress' then 2
    when 'in_review' then 3
    when 'blocked' then 4
    when 'done' then 5
    when 'cancelled' then 6
  end;

revoke all on demo.tasks_by_status_pie
from
  authenticated,
  service_role;

grant
select
  on demo.tasks_by_status_pie to authenticated;

-- Bar: projects by client
create or replace view demo.projects_by_client_bar
with
  (security_invoker = true) as
select
  c.name as label,
  count(p.id) as total,
  count(p.id) filter (
    where
      p.status = 'completed'
  ) as completed
from
  demo.clients c
  left join demo.projects p on p.client_id = c.id
group by
  c.id,
  c.name
having
  count(p.id) > 0
order by
  count(p.id) desc
limit
  10;

revoke all on demo.projects_by_client_bar
from
  authenticated,
  service_role;

grant
select
  on demo.projects_by_client_bar to authenticated;

-- Line: weekly invoiced revenue (last 8 weeks)
create or replace view demo.revenue_trend_line
with
  (security_invoker = true) as
select
  to_char(date_trunc('week', issue_date), 'Mon DD') as date,
  count(*) as invoices,
  coalesce(sum(total), 0)::bigint as revenue
from
  demo.invoices
where
  issue_date >= current_date - interval '8 weeks'
group by
  date_trunc('week', issue_date)
order by
  date_trunc('week', issue_date);

revoke all on demo.revenue_trend_line
from
  authenticated,
  service_role;

grant
select
  on demo.revenue_trend_line to authenticated;

-- Radar: team workload by department
create or replace view demo.team_workload_radar
with
  (security_invoker = true) as
select
  tm.department::text as metric,
  count(t.id) as total,
  count(t.id) filter (
    where
      t.status = 'done'
  ) as completed,
  count(t.id) filter (
    where
      t.status = 'in_progress'
  ) as in_progress
from
  demo.team_members tm
  left join demo.tasks t on t.assignee_id = tm.id
group by
  tm.department;

revoke all on demo.team_workload_radar
from
  authenticated,
  service_role;

grant
select
  on demo.team_workload_radar to authenticated;

comment on view demo.tasks_by_status_pie is '{"type": "chart", "name": "Tasks By Status", "description": "Task count grouped by workflow status", "chart_type": "pie"}';

comment on view demo.projects_by_client_bar is '{"type": "chart", "name": "Projects By Client", "description": "Top 10 clients by project count", "chart_type": "bar"}';

comment on view demo.revenue_trend_line is '{"type": "chart", "name": "Revenue Trend", "description": "Weekly invoice count and revenue over 8 weeks", "chart_type": "line"}';

comment on view demo.team_workload_radar is '{"type": "chart", "name": "Team Workload", "description": "Task load per department", "chart_type": "radar"}';

----------------------------------------------------------------
-- Role permissions
----------------------------------------------------------------
-- x-admin: full access to every demo resource
insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'demo.clients:select'),
  ('x-admin', 'demo.clients:insert'),
  ('x-admin', 'demo.clients:update'),
  ('x-admin', 'demo.clients:delete'),
  ('x-admin', 'demo.clients:audit'),
  ('x-admin', 'demo.clients:comment'),
  ('x-admin', 'demo.team_members:select'),
  ('x-admin', 'demo.team_members:insert'),
  ('x-admin', 'demo.team_members:update'),
  ('x-admin', 'demo.team_members:delete'),
  ('x-admin', 'demo.team_members:audit'),
  ('x-admin', 'demo.team_members:comment'),
  ('x-admin', 'demo.projects:select'),
  ('x-admin', 'demo.projects:insert'),
  ('x-admin', 'demo.projects:update'),
  ('x-admin', 'demo.projects:delete'),
  ('x-admin', 'demo.projects:audit'),
  ('x-admin', 'demo.projects:comment'),
  ('x-admin', 'demo.project_members:select'),
  ('x-admin', 'demo.project_members:insert'),
  ('x-admin', 'demo.project_members:delete'),
  ('x-admin', 'demo.project_members:audit'),
  ('x-admin', 'demo.project_members:comment'),
  ('x-admin', 'demo.milestones:select'),
  ('x-admin', 'demo.milestones:insert'),
  ('x-admin', 'demo.milestones:update'),
  ('x-admin', 'demo.milestones:delete'),
  ('x-admin', 'demo.milestones:audit'),
  ('x-admin', 'demo.milestones:comment'),
  ('x-admin', 'demo.tasks:select'),
  ('x-admin', 'demo.tasks:insert'),
  ('x-admin', 'demo.tasks:update'),
  ('x-admin', 'demo.tasks:delete'),
  ('x-admin', 'demo.tasks:audit'),
  ('x-admin', 'demo.tasks:comment'),
  ('x-admin', 'demo.portfolio_items:select'),
  ('x-admin', 'demo.portfolio_items:insert'),
  ('x-admin', 'demo.portfolio_items:update'),
  ('x-admin', 'demo.portfolio_items:delete'),
  ('x-admin', 'demo.portfolio_items:audit'),
  ('x-admin', 'demo.portfolio_items:comment'),
  ('x-admin', 'demo.services:select'),
  ('x-admin', 'demo.services:insert'),
  ('x-admin', 'demo.services:update'),
  ('x-admin', 'demo.services:delete'),
  ('x-admin', 'demo.services:audit'),
  ('x-admin', 'demo.services:comment'),
  ('x-admin', 'demo.invoices:select'),
  ('x-admin', 'demo.invoices:insert'),
  ('x-admin', 'demo.invoices:update'),
  ('x-admin', 'demo.invoices:delete'),
  ('x-admin', 'demo.invoices:audit'),
  ('x-admin', 'demo.invoices:comment'),
  ('x-admin', 'demo.invoice_items:select'),
  ('x-admin', 'demo.invoice_items:insert'),
  ('x-admin', 'demo.invoice_items:update'),
  ('x-admin', 'demo.invoice_items:delete'),
  ('x-admin', 'demo.invoice_items:audit'),
  ('x-admin', 'demo.invoice_items:comment'),
  ('x-admin', 'demo.time_entries:select'),
  ('x-admin', 'demo.time_entries:insert'),
  ('x-admin', 'demo.time_entries:update'),
  ('x-admin', 'demo.time_entries:delete'),
  ('x-admin', 'demo.time_entries:audit'),
  ('x-admin', 'demo.time_entries:comment'),
  ('x-admin', 'demo.workspace_settings:select'),
  ('x-admin', 'demo.workspace_settings:insert'),
  ('x-admin', 'demo.workspace_settings:update'),
  ('x-admin', 'demo.workspace_settings:audit'),
  ('x-admin', 'demo.workspace_settings:comment'),
  ('x-admin', 'demo.users:select'),
  ('x-admin', 'demo.clients_report:select'),
  ('x-admin', 'demo.projects_report:select'),
  ('x-admin', 'demo.invoices_report:select'),
  ('x-admin', 'demo.team_utilization_report:select'),
  ('x-admin', 'demo.active_projects_count:select'),
  ('x-admin', 'demo.task_completion:select'),
  ('x-admin', 'demo.revenue_summary:select'),
  ('x-admin', 'demo.project_health:select'),
  ('x-admin', 'demo.recent_tasks:select'),
  ('x-admin', 'demo.upcoming_milestones:select'),
  ('x-admin', 'demo.top_clients:select'),
  ('x-admin', 'demo.tasks_by_status_pie:select'),
  ('x-admin', 'demo.projects_by_client_bar:select'),
  ('x-admin', 'demo.revenue_trend_line:select'),
  ('x-admin', 'demo.team_workload_radar:select');

-- user: day-to-day delivery work — no deletes, no audit trail, no HR/settings writes
insert into
  supasheet.role_permissions (role, permission)
values
  ('user', 'demo.clients:select'),
  ('user', 'demo.clients:insert'),
  ('user', 'demo.clients:update'),
  ('user', 'demo.clients:comment'),
  ('user', 'demo.team_members:select'),
  ('user', 'demo.projects:select'),
  ('user', 'demo.projects:insert'),
  ('user', 'demo.projects:update'),
  ('user', 'demo.projects:comment'),
  ('user', 'demo.project_members:select'),
  ('user', 'demo.project_members:insert'),
  ('user', 'demo.project_members:delete'),
  ('user', 'demo.milestones:select'),
  ('user', 'demo.milestones:insert'),
  ('user', 'demo.milestones:update'),
  ('user', 'demo.tasks:select'),
  ('user', 'demo.tasks:insert'),
  ('user', 'demo.tasks:update'),
  ('user', 'demo.tasks:comment'),
  ('user', 'demo.portfolio_items:select'),
  ('user', 'demo.portfolio_items:insert'),
  ('user', 'demo.portfolio_items:update'),
  ('user', 'demo.services:select'),
  ('user', 'demo.invoices:select'),
  ('user', 'demo.invoices:insert'),
  ('user', 'demo.invoices:update'),
  ('user', 'demo.invoice_items:select'),
  ('user', 'demo.invoice_items:insert'),
  ('user', 'demo.invoice_items:update'),
  ('user', 'demo.invoice_items:delete'),
  ('user', 'demo.time_entries:select'),
  ('user', 'demo.time_entries:insert'),
  ('user', 'demo.time_entries:update'),
  ('user', 'demo.workspace_settings:select'),
  ('user', 'demo.users:select'),
  ('user', 'demo.clients_report:select'),
  ('user', 'demo.projects_report:select'),
  ('user', 'demo.invoices_report:select'),
  ('user', 'demo.team_utilization_report:select'),
  ('user', 'demo.active_projects_count:select'),
  ('user', 'demo.task_completion:select'),
  ('user', 'demo.revenue_summary:select'),
  ('user', 'demo.project_health:select'),
  ('user', 'demo.recent_tasks:select'),
  ('user', 'demo.upcoming_milestones:select'),
  ('user', 'demo.top_clients:select'),
  ('user', 'demo.tasks_by_status_pie:select'),
  ('user', 'demo.projects_by_client_bar:select'),
  ('user', 'demo.revenue_trend_line:select'),
  ('user', 'demo.team_workload_radar:select');

----------------------------------------------------------------
-- Audit triggers
----------------------------------------------------------------
create trigger audit_demo_clients_insert
after insert on demo.clients for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_clients_update
after update on demo.clients for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_clients_delete
before delete on demo.clients for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_team_members_insert
after insert on demo.team_members for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_team_members_update
after update on demo.team_members for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_team_members_delete
before delete on demo.team_members for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_projects_insert
after insert on demo.projects for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_projects_update
after update on demo.projects for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_projects_delete
before delete on demo.projects for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_project_members_insert
after insert on demo.project_members for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_project_members_delete
before delete on demo.project_members for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_milestones_insert
after insert on demo.milestones for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_milestones_update
after update on demo.milestones for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_milestones_delete
before delete on demo.milestones for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_tasks_insert
after insert on demo.tasks for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_tasks_update
after update on demo.tasks for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_tasks_delete
before delete on demo.tasks for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_portfolio_items_insert
after insert on demo.portfolio_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_portfolio_items_update
after update on demo.portfolio_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_portfolio_items_delete
before delete on demo.portfolio_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_services_insert
after insert on demo.services for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_services_update
after update on demo.services for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_services_delete
before delete on demo.services for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_invoices_insert
after insert on demo.invoices for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_invoices_update
after update on demo.invoices for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_invoices_delete
before delete on demo.invoices for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_invoice_items_insert
after insert on demo.invoice_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_invoice_items_update
after update on demo.invoice_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_invoice_items_delete
before delete on demo.invoice_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_time_entries_insert
after insert on demo.time_entries for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_time_entries_update
after update on demo.time_entries for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_time_entries_delete
before delete on demo.time_entries for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_workspace_settings_insert
after insert on demo.workspace_settings for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_demo_workspace_settings_update
after update on demo.workspace_settings for each row
execute function supasheet.audit_trigger_function ();

----------------------------------------------------------------
-- Notifications
----------------------------------------------------------------
-- Projects: notify on creation or status change
create or replace function demo.trg_projects_notify () returns trigger as $$
declare
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
begin
    v_recipients := array_remove(
        supasheet.get_users_with_permission('demo.projects:select') || array[new.user_id],
        null
    );

    if tg_op = 'INSERT' then
        v_type  := 'demo_project_created';
        v_title := 'New project';
        v_body  := 'Project "' || new.name || '" was created.';
    elsif new.status is distinct from old.status then
        v_type  := 'demo_project_status_changed';
        v_title := 'Project status updated';
        v_body  := 'Project "' || new.name || '" is now ' || new.status::text || '.';
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object('project_id', new.id, 'status', new.status, 'client_id', new.client_id),
        '/demo/resource/projects/' || new.id::text || '/detail'
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists projects_notify on demo.projects;

create trigger projects_notify
after insert
or update of status on demo.projects for each row
execute function demo.trg_projects_notify ();

-- Tasks: notify assignee on assignment and on status change
create or replace function demo.trg_tasks_notify () returns trigger as $$
declare
    v_recipients      uuid[];
    v_assignee_user   uuid;
    v_type            text;
    v_title           text;
    v_body            text;
begin
    if new.assignee_id is not null then
        select user_id into v_assignee_user from demo.team_members where id = new.assignee_id;
    end if;

    if tg_op = 'INSERT' then
        v_type  := 'demo_task_created';
        v_title := 'New task';
        v_body  := 'Task "' || new.title || '" was created.';
        v_recipients := array_remove(array[new.user_id, v_assignee_user], null);
    elsif new.assignee_id is distinct from old.assignee_id then
        v_type  := 'demo_task_assigned';
        v_title := 'Task assigned to you';
        v_body  := 'Task "' || new.title || '" was assigned to you.';
        v_recipients := array_remove(array[v_assignee_user], null);
    elsif new.status is distinct from old.status then
        v_type  := 'demo_task_status_changed';
        v_title := 'Task status updated';
        v_body  := 'Task "' || new.title || '" is now ' || new.status::text || '.';
        v_recipients := array_remove(array[new.user_id, v_assignee_user], null);
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object(
            'task_id',     new.id,
            'project_id',  new.project_id,
            'assignee_id', new.assignee_id,
            'status',      new.status
        ),
        '/demo/resource/tasks/' || new.id::text || '/detail'
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists tasks_notify on demo.tasks;

create trigger tasks_notify
after insert
or update of assignee_id,
status on demo.tasks for each row
execute function demo.trg_tasks_notify ();

-- Invoices: notify on creation and when status flips to sent/overdue/paid
create or replace function demo.trg_invoices_notify () returns trigger as $$
declare
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
begin
    v_recipients := array_remove(
        supasheet.get_users_with_permission('demo.invoices:select') || array[new.user_id],
        null
    );

    if tg_op = 'INSERT' then
        v_type  := 'demo_invoice_created';
        v_title := 'New invoice';
        v_body  := 'Invoice ' || new.invoice_number || ' was created.';
    elsif new.status is distinct from old.status then
        v_type  := 'demo_invoice_status_changed';
        v_title := 'Invoice status updated';
        v_body  := 'Invoice ' || new.invoice_number || ' is now ' || new.status::text || '.';
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object(
            'invoice_id',   new.id,
            'client_id',    new.client_id,
            'status',       new.status,
            'total',        new.total
        ),
        '/demo/resource/invoices/' || new.id::text || '/detail'
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists invoices_notify on demo.invoices;

create trigger invoices_notify
after insert
or update of status on demo.invoices for each row
execute function demo.trg_invoices_notify ();

-- ================================================================
-- SEED DATA
-- Uses the three hardcoded users from supabase/seed.sql:
--   b73eb03e-fb7a-424d-84ff-18e2791ce0b8  superadmin@supasheet.dev (x-admin)
--   b73eb03e-fb7a-424d-84ff-18e2791ce0b1  user1@supasheet.dev (user)
--   b73eb03e-fb7a-424d-84ff-18e2791ce0b4  user@supasheet.dev (user)
-- ================================================================

----------------------------------------------------------------
-- Workspace settings
----------------------------------------------------------------
insert into
  demo.workspace_settings (
    workspace_name,
    primary_color,
    default_currency,
    invoice_prefix,
    support_email,
    timezone,
    fiscal_year_start
  )
values
  (
    'Northstar Studio',
    '#6366f1',
    'USD',
    'INV',
    'billing@northstar.studio',
    'America/New_York',
    date_trunc('year', current_date)::date
  );

----------------------------------------------------------------
-- Clients
----------------------------------------------------------------
insert into
  demo.clients (
    id,
    name,
    website,
    email,
    phone,
    industry,
    status,
    address,
    city,
    country,
    tags,
    color,
    notes,
    user_id,
    created_at
  )
values
  (
    'c1a00000-0000-0000-0000-000000000001',
    'Acme Robotics',
    'https://acme-robotics.example.com',
    'hello@acme-robotics.example.com',
    '+1-415-555-0101',
    'Robotics',
    'active',
    '500 Factory Row',
    'San Jose',
    'USA',
    array['enterprise', 'priority'],
    '#f97316',
    'Long-standing client, quarterly retainer.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '220 days'
  ),
  (
    'c1a00000-0000-0000-0000-000000000002',
    'Blue Harbor Media',
    'https://blueharbor.example.com',
    'contact@blueharbor.example.com',
    '+1-212-555-0102',
    'Media & Publishing',
    'active',
    '88 Harbor Street',
    'Boston',
    'USA',
    array['media'],
    '#0ea5e9',
    'Brand refresh in progress.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_timestamp - interval '160 days'
  ),
  (
    'c1a00000-0000-0000-0000-000000000003',
    'Nimbus Health',
    'https://nimbushealth.example.com',
    'partnerships@nimbushealth.example.com',
    '+1-312-555-0103',
    'Healthcare',
    'active',
    '12 Cloud Plaza',
    'Chicago',
    'USA',
    array['healthcare', 'compliance'],
    '#22c55e',
    'HIPAA-adjacent project — see compliance notes doc.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '90 days'
  ),
  (
    'c1a00000-0000-0000-0000-000000000004',
    'Greenfield Retail',
    'https://greenfieldretail.example.com',
    'ops@greenfieldretail.example.com',
    '+1-206-555-0104',
    'Retail',
    'on_hold',
    '4 Market Square',
    'Seattle',
    'USA',
    array['retail'],
    '#eab308',
    'Paused pending their Q3 budget approval.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_timestamp - interval '130 days'
  ),
  (
    'c1a00000-0000-0000-0000-000000000005',
    'Solstice Finance',
    'https://solsticefinance.example.com',
    'hello@solsticefinance.example.com',
    '+1-646-555-0105',
    'Financial Services',
    'lead',
    null,
    'New York',
    'USA',
    array['fintech'],
    '#a855f7',
    'Inbound lead from referral, discovery call scheduled.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_timestamp - interval '12 days'
  );

----------------------------------------------------------------
-- Team members (org chart: Priya -> {Jordan, Sam, Taylor, Morgan, Drew}; Jordan -> Casey; Sam -> Riley)
----------------------------------------------------------------
insert into
  demo.team_members (
    id,
    user_id,
    manager_id,
    name,
    email,
    phone,
    job_title,
    department,
    employment_status,
    hire_date,
    hourly_rate,
    color
  )
values
  (
    'ea000000-0000-0000-0000-000000000001',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    null,
    'Priya Sharma',
    'priya@northstar.studio',
    '+1-415-555-0201',
    'Studio Director',
    'operations',
    'active',
    current_date - interval '4 years',
    185.00,
    '#6366f1'
  ),
  (
    'ea000000-0000-0000-0000-000000000002',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    'ea000000-0000-0000-0000-000000000001',
    'Jordan Lee',
    'jordan@northstar.studio',
    '+1-415-555-0202',
    'Engineering Lead',
    'engineering',
    'active',
    current_date - interval '3 years',
    160.00,
    '#0ea5e9'
  ),
  (
    'ea000000-0000-0000-0000-000000000003',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    'ea000000-0000-0000-0000-000000000001',
    'Sam Rivera',
    'sam@northstar.studio',
    '+1-415-555-0203',
    'Design Lead',
    'design',
    'active',
    current_date - interval '3 years',
    155.00,
    '#f97316'
  ),
  (
    'ea000000-0000-0000-0000-000000000004',
    null,
    'ea000000-0000-0000-0000-000000000002',
    'Casey Morgan',
    'casey@northstar.studio',
    '+1-415-555-0204',
    'Senior Engineer',
    'engineering',
    'active',
    current_date - interval '2 years',
    130.00,
    '#0ea5e9'
  ),
  (
    'ea000000-0000-0000-0000-000000000005',
    null,
    'ea000000-0000-0000-0000-000000000003',
    'Riley Chen',
    'riley@northstar.studio',
    '+1-415-555-0205',
    'Product Designer',
    'design',
    'active',
    current_date - interval '18 months',
    120.00,
    '#f97316'
  ),
  (
    'ea000000-0000-0000-0000-000000000006',
    null,
    'ea000000-0000-0000-0000-000000000001',
    'Taylor Brooks',
    'taylor@northstar.studio',
    '+1-415-555-0206',
    'Marketing Manager',
    'marketing',
    'active',
    current_date - interval '2 years',
    110.00,
    '#eab308'
  ),
  (
    'ea000000-0000-0000-0000-000000000007',
    null,
    'ea000000-0000-0000-0000-000000000001',
    'Morgan Blake',
    'morgan@northstar.studio',
    '+1-415-555-0207',
    'Sales Executive',
    'sales',
    'active',
    current_date - interval '1 year',
    100.00,
    '#22c55e'
  ),
  (
    'ea000000-0000-0000-0000-000000000008',
    null,
    'ea000000-0000-0000-0000-000000000001',
    'Drew Ellis',
    'drew@northstar.studio',
    '+1-415-555-0208',
    'Support Specialist',
    'operations',
    'on_leave',
    current_date - interval '9 months',
    85.00,
    '#a855f7'
  );

----------------------------------------------------------------
-- Projects
----------------------------------------------------------------
insert into
  demo.projects (
    id,
    name,
    client_id,
    owner_id,
    description,
    status,
    priority,
    budget,
    start_date,
    due_date,
    progress,
    tags,
    color,
    user_id,
    created_at
  )
values
  (
    'ec000000-0000-0000-0000-000000000001',
    'Acme Robotics — Website Relaunch',
    'c1a00000-0000-0000-0000-000000000001',
    'ea000000-0000-0000-0000-000000000002',
    'Full marketing site rebuild with a new product configurator.',
    'active',
    'high',
    48000.00,
    current_date - interval '45 days',
    current_date + interval '20 days',
    62,
    array['web', 'marketing'],
    '#f97316',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '46 days'
  ),
  (
    'ec000000-0000-0000-0000-000000000002',
    'Blue Harbor — Brand Refresh',
    'c1a00000-0000-0000-0000-000000000002',
    'ea000000-0000-0000-0000-000000000003',
    'New visual identity, logo system, and editorial style guide.',
    'active',
    'medium',
    26000.00,
    current_date - interval '30 days',
    current_date + interval '35 days',
    40,
    array['branding'],
    '#0ea5e9',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_timestamp - interval '31 days'
  ),
  (
    'ec000000-0000-0000-0000-000000000003',
    'Nimbus Health — Patient Portal',
    'c1a00000-0000-0000-0000-000000000003',
    'ea000000-0000-0000-0000-000000000002',
    'Secure patient-facing portal for appointments and records.',
    'planning',
    'critical',
    120000.00,
    current_date + interval '10 days',
    current_date + interval '150 days',
    5,
    array['healthcare', 'web-app'],
    '#22c55e',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '8 days'
  ),
  (
    'ec000000-0000-0000-0000-000000000004',
    'Greenfield Retail — POS Rollout',
    'c1a00000-0000-0000-0000-000000000004',
    'ea000000-0000-0000-0000-000000000004',
    'In-store point-of-sale system rollout across 12 locations.',
    'on_hold',
    'medium',
    75000.00,
    current_date - interval '60 days',
    current_date + interval '90 days',
    25,
    array['retail', 'pos'],
    '#eab308',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_timestamp - interval '61 days'
  ),
  (
    'ec000000-0000-0000-0000-000000000005',
    'Internal — Studio Ops Dashboard',
    null,
    'ea000000-0000-0000-0000-000000000001',
    'Internal tooling to track studio capacity and billing.',
    'completed',
    'low',
    8000.00,
    current_date - interval '120 days',
    current_date - interval '20 days',
    100,
    array['internal', 'tooling'],
    '#6366f1',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '121 days'
  );

----------------------------------------------------------------
-- Project members
----------------------------------------------------------------
insert into
  demo.project_members (project_id, team_member_id, role_on_project, allocation_percent)
values
  ('ec000000-0000-0000-0000-000000000001', 'ea000000-0000-0000-0000-000000000002', 'Tech Lead', 50),
  ('ec000000-0000-0000-0000-000000000001', 'ea000000-0000-0000-0000-000000000004', 'Engineer', 80),
  ('ec000000-0000-0000-0000-000000000001', 'ea000000-0000-0000-0000-000000000005', 'Designer', 30),
  ('ec000000-0000-0000-0000-000000000002', 'ea000000-0000-0000-0000-000000000003', 'Design Lead', 60),
  ('ec000000-0000-0000-0000-000000000002', 'ea000000-0000-0000-0000-000000000005', 'Designer', 40),
  ('ec000000-0000-0000-0000-000000000002', 'ea000000-0000-0000-0000-000000000006', 'Marketing', 20),
  ('ec000000-0000-0000-0000-000000000003', 'ea000000-0000-0000-0000-000000000002', 'Tech Lead', 40),
  ('ec000000-0000-0000-0000-000000000003', 'ea000000-0000-0000-0000-000000000004', 'Engineer', 50),
  ('ec000000-0000-0000-0000-000000000004', 'ea000000-0000-0000-0000-000000000004', 'Engineer', 30),
  ('ec000000-0000-0000-0000-000000000005', 'ea000000-0000-0000-0000-000000000001', 'Sponsor', 10),
  ('ec000000-0000-0000-0000-000000000005', 'ea000000-0000-0000-0000-000000000008', 'Coordinator', 20);

----------------------------------------------------------------
-- Milestones
----------------------------------------------------------------
insert into
  demo.milestones (id, project_id, title, description, due_date, status, sort_order)
values
  (
    '5e000000-0000-0000-0000-000000000001',
    'ec000000-0000-0000-0000-000000000001',
    'Discovery & IA',
    'Stakeholder interviews, sitemap, content audit.',
    current_date - interval '25 days',
    'completed',
    1
  ),
  (
    '5e000000-0000-0000-0000-000000000002',
    'ec000000-0000-0000-0000-000000000001',
    'Design Handoff',
    'Final designs approved and handed to engineering.',
    current_date - interval '2 days',
    'completed',
    2
  ),
  (
    '5e000000-0000-0000-0000-000000000003',
    'ec000000-0000-0000-0000-000000000001',
    'Launch',
    'Production deploy and DNS cutover.',
    current_date + interval '20 days',
    'pending',
    3
  ),
  (
    '5e000000-0000-0000-0000-000000000004',
    'ec000000-0000-0000-0000-000000000002',
    'Logo Concepts',
    'Three logo directions presented to client.',
    current_date - interval '5 days',
    'completed',
    1
  ),
  (
    '5e000000-0000-0000-0000-000000000005',
    'ec000000-0000-0000-0000-000000000002',
    'Style Guide',
    'Full brand guidelines document delivered.',
    current_date + interval '15 days',
    'in_progress',
    2
  ),
  (
    '5e000000-0000-0000-0000-000000000006',
    'ec000000-0000-0000-0000-000000000003',
    'Requirements Sign-off',
    'Scope, compliance requirements, and success metrics agreed.',
    current_date + interval '15 days',
    'pending',
    1
  );

----------------------------------------------------------------
-- Tasks (includes subtasks via parent_task_id for the tree view)
----------------------------------------------------------------
insert into
  demo.tasks (
    id,
    project_id,
    milestone_id,
    parent_task_id,
    assignee_id,
    title,
    description,
    status,
    priority,
    blocked_reason,
    estimated_hours,
    due_date,
    completed_at,
    tags,
    user_id,
    created_at
  )
values
  -- Acme Robotics — Website Relaunch
  (
    'a5000000-0000-0000-0000-000000000001',
    'ec000000-0000-0000-0000-000000000001',
    '5e000000-0000-0000-0000-000000000002',
    null,
    'ea000000-0000-0000-0000-000000000004',
    'Build product configurator',
    'Interactive 3D configurator for the robotics product line.',
    'in_progress',
    'high',
    null,
    40,
    current_date + interval '5 days',
    null,
    array['frontend'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '20 days'
  ),
  (
    'a5000000-0000-0000-0000-000000000002',
    'ec000000-0000-0000-0000-000000000001',
    '5e000000-0000-0000-0000-000000000002',
    'a5000000-0000-0000-0000-000000000001',
    'ea000000-0000-0000-0000-000000000004',
    'Configurator: color + material step',
    'Sub-step of the configurator build.',
    'done',
    'medium',
    null,
    10,
    current_date - interval '3 days',
    current_timestamp - interval '3 days',
    array['frontend'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '18 days'
  ),
  (
    'a5000000-0000-0000-0000-000000000003',
    'ec000000-0000-0000-0000-000000000001',
    '5e000000-0000-0000-0000-000000000002',
    'a5000000-0000-0000-0000-000000000001',
    'ea000000-0000-0000-0000-000000000004',
    'Configurator: pricing summary step',
    'Sub-step of the configurator build.',
    'in_progress',
    'medium',
    null,
    12,
    current_date + interval '4 days',
    null,
    array['frontend'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '17 days'
  ),
  (
    'a5000000-0000-0000-0000-000000000004',
    'ec000000-0000-0000-0000-000000000001',
    '5e000000-0000-0000-0000-000000000003',
    null,
    'ea000000-0000-0000-0000-000000000002',
    'Set up production hosting',
    'Provision hosting and CI/CD for launch.',
    'blocked',
    'high',
    'Waiting on client to approve hosting vendor.',
    8,
    current_date + interval '10 days',
    null,
    array['devops'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '10 days'
  ),
  (
    'a5000000-0000-0000-0000-000000000005',
    'ec000000-0000-0000-0000-000000000001',
    null,
    null,
    'ea000000-0000-0000-0000-000000000005',
    'Accessibility audit',
    'WCAG 2.1 AA pass on the new templates.',
    'todo',
    'medium',
    null,
    6,
    current_date + interval '18 days',
    null,
    array['a11y'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '5 days'
  ),
  -- Blue Harbor — Brand Refresh
  (
    'a5000000-0000-0000-0000-000000000006',
    'ec000000-0000-0000-0000-000000000002',
    '5e000000-0000-0000-0000-000000000004',
    null,
    'ea000000-0000-0000-0000-000000000005',
    'Design logo concept variations',
    'Three distinct directions for client review.',
    'done',
    'high',
    null,
    16,
    current_date - interval '6 days',
    current_timestamp - interval '5 days',
    array['branding'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_timestamp - interval '25 days'
  ),
  (
    'a5000000-0000-0000-0000-000000000007',
    'ec000000-0000-0000-0000-000000000002',
    '5e000000-0000-0000-0000-000000000005',
    null,
    'ea000000-0000-0000-0000-000000000003',
    'Draft brand style guide',
    'Typography, color system, usage rules.',
    'in_review',
    'medium',
    null,
    20,
    current_date + interval '8 days',
    null,
    array['branding'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_timestamp - interval '12 days'
  ),
  (
    'a5000000-0000-0000-0000-000000000008',
    'ec000000-0000-0000-0000-000000000002',
    '5e000000-0000-0000-0000-000000000005',
    null,
    'ea000000-0000-0000-0000-000000000006',
    'Plan launch announcement',
    'Coordinate press release and social rollout.',
    'todo',
    'low',
    null,
    5,
    current_date + interval '18 days',
    null,
    array['marketing'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1',
    current_timestamp - interval '4 days'
  ),
  -- Nimbus Health — Patient Portal
  (
    'a5000000-0000-0000-0000-000000000009',
    'ec000000-0000-0000-0000-000000000003',
    '5e000000-0000-0000-0000-000000000006',
    null,
    'ea000000-0000-0000-0000-000000000002',
    'Compliance requirements workshop',
    'Confirm HIPAA-adjacent requirements with client legal.',
    'in_progress',
    'critical',
    null,
    12,
    current_date + interval '7 days',
    null,
    array['compliance'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '6 days'
  ),
  (
    'a5000000-0000-0000-0000-00000000000a',
    'ec000000-0000-0000-0000-000000000003',
    '5e000000-0000-0000-0000-000000000006',
    null,
    'ea000000-0000-0000-0000-000000000004',
    'Draft technical architecture',
    'Data model, auth strategy, hosting region.',
    'todo',
    'high',
    null,
    18,
    current_date + interval '12 days',
    null,
    array['architecture'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '3 days'
  ),
  -- Greenfield Retail — POS Rollout (on hold project)
  (
    'a5000000-0000-0000-0000-00000000000b',
    'ec000000-0000-0000-0000-000000000004',
    null,
    null,
    'ea000000-0000-0000-0000-000000000004',
    'Pilot store hardware install',
    'Install and test terminals at the pilot location.',
    'blocked',
    'medium',
    'Project on hold pending client budget approval.',
    24,
    current_date + interval '30 days',
    null,
    array['hardware'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_timestamp - interval '55 days'
  ),
  (
    'a5000000-0000-0000-0000-00000000000c',
    'ec000000-0000-0000-0000-000000000004',
    null,
    null,
    'ea000000-0000-0000-0000-000000000004',
    'Inventory sync integration',
    'Connect POS to existing inventory system.',
    'cancelled',
    'low',
    null,
    30,
    null,
    null,
    array['integration'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4',
    current_timestamp - interval '50 days'
  ),
  -- Internal — Studio Ops Dashboard (completed project)
  (
    'a5000000-0000-0000-0000-00000000000d',
    'ec000000-0000-0000-0000-000000000005',
    null,
    null,
    'ea000000-0000-0000-0000-000000000008',
    'Ship capacity planning view',
    'Team allocation vs. logged hours dashboard.',
    'done',
    'medium',
    null,
    14,
    current_date - interval '25 days',
    current_timestamp - interval '22 days',
    array['internal'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '110 days'
  ),
  (
    'a5000000-0000-0000-0000-00000000000e',
    'ec000000-0000-0000-0000-000000000005',
    null,
    null,
    'ea000000-0000-0000-0000-000000000001',
    'Wire up billing export',
    'Monthly CSV export of paid invoices for accounting.',
    'done',
    'low',
    null,
    6,
    current_date - interval '21 days',
    current_timestamp - interval '20 days',
    array['internal'],
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8',
    current_timestamp - interval '100 days'
  );

----------------------------------------------------------------
-- Portfolio items (published case studies)
----------------------------------------------------------------
insert into
  demo.portfolio_items (
    project_id,
    client_id,
    title,
    summary,
    category,
    external_url,
    is_published,
    published_at,
    tags,
    color,
    sort_order
  )
values
  (
    'ec000000-0000-0000-0000-000000000005',
    null,
    'Studio Ops Dashboard',
    'Internal capacity-planning tool that replaced a spreadsheet-based process.',
    'product_design',
    'https://northstar.studio/work/ops-dashboard',
    true,
    current_date - interval '18 days',
    array['internal', 'tooling'],
    '#6366f1',
    1
  ),
  (
    'ec000000-0000-0000-0000-000000000001',
    'c1a00000-0000-0000-0000-000000000001',
    'Acme Robotics Website',
    'A marketing site rebuild with an interactive product configurator.',
    'web',
    'https://acme-robotics.example.com',
    true,
    current_date - interval '3 days',
    array['web', 'configurator'],
    '#f97316',
    2
  ),
  (
    'ec000000-0000-0000-0000-000000000002',
    'c1a00000-0000-0000-0000-000000000002',
    'Blue Harbor Brand System',
    'A full visual identity refresh, from logo concepts to editorial style guide.',
    'branding',
    null,
    true,
    current_date - interval '5 days',
    array['branding'],
    '#0ea5e9',
    3
  ),
  (
    null,
    'c1a00000-0000-0000-0000-000000000003',
    'Nimbus Health Discovery',
    'Early concept work from the patient portal discovery phase.',
    'product_design',
    null,
    false,
    null,
    array['healthcare', 'concept'],
    '#22c55e',
    4
  );

----------------------------------------------------------------
-- Services (billing catalog)
----------------------------------------------------------------
insert into
  demo.services (id, name, description, category, default_rate, unit, color)
values
  (
    '5ec00000-0000-0000-0000-000000000001',
    'Discovery Workshop',
    'Stakeholder alignment and requirements gathering.',
    'consulting',
    150.00,
    'hour',
    '#a855f7'
  ),
  (
    '5ec00000-0000-0000-0000-000000000002',
    'UI/UX Design',
    'Interface design, prototyping, and user testing.',
    'design',
    120.00,
    'hour',
    '#f97316'
  ),
  (
    '5ec00000-0000-0000-0000-000000000003',
    'Frontend Development',
    'Component implementation and integration work.',
    'development',
    140.00,
    'hour',
    '#0ea5e9'
  ),
  (
    '5ec00000-0000-0000-0000-000000000004',
    'Backend Development',
    'API, database, and infrastructure engineering.',
    'development',
    150.00,
    'hour',
    '#0ea5e9'
  ),
  (
    '5ec00000-0000-0000-0000-000000000005',
    'QA Testing',
    'Manual and automated test coverage.',
    'development',
    90.00,
    'hour',
    '#22c55e'
  ),
  (
    '5ec00000-0000-0000-0000-000000000006',
    'Content Strategy',
    'Messaging, copywriting, and editorial planning.',
    'marketing',
    110.00,
    'hour',
    '#eab308'
  ),
  (
    '5ec00000-0000-0000-0000-000000000007',
    'Brand Identity Package',
    'Logo system, color palette, and typography — fixed scope.',
    'design',
    2500.00,
    'project',
    '#f97316'
  ),
  (
    '5ec00000-0000-0000-0000-000000000008',
    'Support Retainer',
    'Ongoing maintenance and support hours.',
    'support',
    100.00,
    'hour',
    '#6366f1'
  );

----------------------------------------------------------------
-- Invoices (subtotal/tax/total are recalculated by the
-- invoice_items_recalc trigger once line items are inserted below)
----------------------------------------------------------------
insert into
  demo.invoices (
    id,
    client_id,
    project_id,
    status,
    issue_date,
    due_date,
    tax_rate,
    paid_at,
    notes,
    user_id
  )
values
  (
    'ffa00000-0000-0000-0000-000000000001',
    'c1a00000-0000-0000-0000-000000000001',
    'ec000000-0000-0000-0000-000000000001',
    'paid',
    current_date - interval '40 days',
    current_date - interval '10 days',
    8,
    current_timestamp - interval '9 days',
    'Milestone 1 — Discovery & IA.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8'
  ),
  (
    'ffa00000-0000-0000-0000-000000000002',
    'c1a00000-0000-0000-0000-000000000001',
    'ec000000-0000-0000-0000-000000000001',
    'sent',
    current_date - interval '5 days',
    current_date + interval '25 days',
    8,
    null,
    'Milestone 2 — Design Handoff.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8'
  ),
  (
    'ffa00000-0000-0000-0000-000000000003',
    'c1a00000-0000-0000-0000-000000000002',
    'ec000000-0000-0000-0000-000000000002',
    'overdue',
    current_date - interval '35 days',
    current_date - interval '5 days',
    6.5,
    null,
    'Logo concepts + initial workshops.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b1'
  ),
  (
    'ffa00000-0000-0000-0000-000000000004',
    'c1a00000-0000-0000-0000-000000000004',
    'ec000000-0000-0000-0000-000000000004',
    'draft',
    current_date - interval '2 days',
    current_date + interval '28 days',
    0,
    null,
    'Draft pending client sign-off — project on hold.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b4'
  ),
  (
    'ffa00000-0000-0000-0000-000000000005',
    'c1a00000-0000-0000-0000-000000000001',
    null,
    'paid',
    current_date - interval '80 days',
    current_date - interval '50 days',
    8,
    current_timestamp - interval '48 days',
    'Quarterly support retainer.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8'
  ),
  (
    'ffa00000-0000-0000-0000-000000000006',
    'c1a00000-0000-0000-0000-000000000003',
    'ec000000-0000-0000-0000-000000000003',
    'draft',
    current_date - interval '1 day',
    current_date + interval '29 days',
    0,
    null,
    'Discovery workshop deposit.',
    'b73eb03e-fb7a-424d-84ff-18e2791ce0b8'
  );

----------------------------------------------------------------
-- Invoice line items (unit_price backfilled here to mirror what the
-- lookup-fill UI would populate from demo.services.default_rate)
----------------------------------------------------------------
insert into
  demo.invoice_items (invoice_id, service_id, description, quantity, unit_price, sort_order)
values
  -- ffa...001 (Acme, paid) — Discovery Workshop + UI/UX Design
  ('ffa00000-0000-0000-0000-000000000001', '5ec00000-0000-0000-0000-000000000001', 'Discovery Workshop', 20, 150.00, 1),
  ('ffa00000-0000-0000-0000-000000000001', '5ec00000-0000-0000-0000-000000000002', 'UI/UX Design', 40, 120.00, 2),
  -- ffa...002 (Acme, sent) — Frontend Development
  ('ffa00000-0000-0000-0000-000000000002', '5ec00000-0000-0000-0000-000000000003', 'Frontend Development', 60, 140.00, 1),
  ('ffa00000-0000-0000-0000-000000000002', '5ec00000-0000-0000-0000-000000000005', 'QA Testing', 10, 90.00, 2),
  -- ffa...003 (Blue Harbor, overdue) — Brand Identity Package
  ('ffa00000-0000-0000-0000-000000000003', '5ec00000-0000-0000-0000-000000000007', 'Brand Identity Package', 1, 2500.00, 1),
  ('ffa00000-0000-0000-0000-000000000003', '5ec00000-0000-0000-0000-000000000001', 'Discovery Workshop', 8, 150.00, 2),
  -- ffa...004 (Greenfield, draft) — Backend Development
  ('ffa00000-0000-0000-0000-000000000004', '5ec00000-0000-0000-0000-000000000004', 'Backend Development', 15, 150.00, 1),
  -- ffa...005 (Acme, paid) — Support Retainer
  ('ffa00000-0000-0000-0000-000000000005', '5ec00000-0000-0000-0000-000000000008', 'Support Retainer', 25, 100.00, 1),
  -- ffa...006 (Nimbus, draft) — Discovery Workshop deposit
  ('ffa00000-0000-0000-0000-000000000006', '5ec00000-0000-0000-0000-000000000001', 'Discovery Workshop', 10, 150.00, 1);

----------------------------------------------------------------
-- Time entries
----------------------------------------------------------------
insert into
  demo.time_entries (task_id, team_member_id, entry_date, duration, is_billable, notes)
values
  ('a5000000-0000-0000-0000-000000000001', 'ea000000-0000-0000-0000-000000000004', current_date - interval '18 days', 14400, true, 'Configurator scaffolding.'),
  ('a5000000-0000-0000-0000-000000000001', 'ea000000-0000-0000-0000-000000000004', current_date - interval '15 days', 21600, true, '3D model integration.'),
  ('a5000000-0000-0000-0000-000000000002', 'ea000000-0000-0000-0000-000000000004', current_date - interval '10 days', 18000, true, 'Color + material step complete.'),
  ('a5000000-0000-0000-0000-000000000003', 'ea000000-0000-0000-0000-000000000004', current_date - interval '3 days', 10800, true, 'Pricing summary in progress.'),
  ('a5000000-0000-0000-0000-000000000004', 'ea000000-0000-0000-0000-000000000002', current_date - interval '9 days', 7200, true, 'Hosting vendor comparison.'),
  ('a5000000-0000-0000-0000-000000000006', 'ea000000-0000-0000-0000-000000000005', current_date - interval '20 days', 28800, true, 'Logo concept sketches.'),
  ('a5000000-0000-0000-0000-000000000006', 'ea000000-0000-0000-0000-000000000005', current_date - interval '18 days', 25200, true, 'Refined final concept direction.'),
  ('a5000000-0000-0000-0000-000000000007', 'ea000000-0000-0000-0000-000000000003', current_date - interval '11 days', 21600, true, 'Typography system draft.'),
  ('a5000000-0000-0000-0000-000000000007', 'ea000000-0000-0000-0000-000000000003', current_date - interval '6 days', 18000, true, 'Color system + usage rules.'),
  ('a5000000-0000-0000-0000-000000000009', 'ea000000-0000-0000-0000-000000000002', current_date - interval '5 days', 14400, true, 'Compliance workshop prep.'),
  ('a5000000-0000-0000-0000-00000000000a', 'ea000000-0000-0000-0000-000000000004', current_date - interval '2 days', 10800, true, 'Initial architecture notes.'),
  ('a5000000-0000-0000-0000-00000000000d', 'ea000000-0000-0000-0000-000000000008', current_date - interval '24 days', 21600, false, 'Internal tooling — non-billable.'),
  ('a5000000-0000-0000-0000-00000000000e', 'ea000000-0000-0000-0000-000000000001', current_date - interval '21 days', 7200, false, 'Internal tooling — non-billable.');

select supasheet.refresh_metadata();