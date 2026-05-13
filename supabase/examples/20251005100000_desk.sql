create schema if not exists desk;

grant usage on schema desk to authenticated;

begin;

create type desk.task_status as enum('pending', 'in_progress', 'completed', 'archived');

create type desk.task_priority as enum('low', 'medium', 'high', 'critical');

create type desk.project_status as enum(
  'planning',
  'active',
  'on_hold',
  'completed',
  'cancelled'
);

create type desk.project_priority as enum('low', 'medium', 'high', 'critical');

-- Task permissions
alter type supasheet.app_permission
add value 'desk.tasks:select';

alter type supasheet.app_permission
add value 'desk.tasks:insert';

alter type supasheet.app_permission
add value 'desk.tasks:update';

alter type supasheet.app_permission
add value 'desk.tasks:delete';

alter type supasheet.app_permission
add value 'desk.tasks:audit';

alter type supasheet.app_permission
add value 'desk.user_tasks:select';

alter type supasheet.app_permission
add value 'desk.task_report:select';

alter type supasheet.app_permission
add value 'desk.task_summary:select';

alter type supasheet.app_permission
add value 'desk.task_completion_rate:select';

alter type supasheet.app_permission
add value 'desk.tasks_by_status:select';

alter type supasheet.app_permission
add value 'desk.task_critical_count:select';

alter type supasheet.app_permission
add value if not exists 'desk.task_list_simple:select';

alter type supasheet.app_permission
add value if not exists 'desk.active_tasks_simple:select';

alter type supasheet.app_permission
add value 'desk.task_priority_bar:select';

alter type supasheet.app_permission
add value 'desk.task_completion_line:select';

alter type supasheet.app_permission
add value 'desk.task_status_pie:select';

alter type supasheet.app_permission
add value 'desk.task_metrics_radar:select';

-- Project permissions
alter type supasheet.app_permission
add value 'desk.projects:select';

alter type supasheet.app_permission
add value 'desk.projects:insert';

alter type supasheet.app_permission
add value 'desk.projects:update';

alter type supasheet.app_permission
add value 'desk.projects:delete';

alter type supasheet.app_permission
add value 'desk.projects:audit';

alter type supasheet.app_permission
add value 'desk.project_report:select';

alter type supasheet.app_permission
add value 'desk.project_summary:select';

alter type supasheet.app_permission
add value 'desk.project_completion_rate:select';

alter type supasheet.app_permission
add value 'desk.project_list_simple:select';

alter type supasheet.app_permission
add value 'desk.project_task_overview:select';

alter type supasheet.app_permission
add value 'desk.project_status_pie:select';

alter type supasheet.app_permission
add value 'desk.project_priority_bar:select';

-- Task comment permissions
alter type supasheet.app_permission
add value 'desk.task_comments:select';

alter type supasheet.app_permission
add value 'desk.task_comments:insert';

alter type supasheet.app_permission
add value 'desk.task_comments:update';

alter type supasheet.app_permission
add value 'desk.task_comments:delete';

alter type supasheet.app_permission
add value 'desk.task_comments:audit';

alter type supasheet.app_permission
add value 'desk.users:select';

commit;

----------------------------------------------------------------
-- Projects table (created before tasks so tasks can FK to it)
----------------------------------------------------------------
create table desk.projects (
  id uuid primary key default extensions.uuid_generate_v4 (),
  title varchar(500) not null,
  description supasheet.RICH_TEXT,
  status desk.project_status default 'planning',
  priority desk.project_priority default 'medium',
  cover supasheet.file,
  -- User association
  user_id uuid default auth.uid () references supasheet.users (id) on delete cascade,
  -- Dates
  start_date timestamptz,
  end_date timestamptz,
  -- Organization
  tags varchar(500) [],
  color supasheet.color,
  notes text,
  -- Audit fields
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column desk.projects.status is '{
    "progress": true,
    "enums": {
        "planning": {
            "variant": "outline",
            "icon": "Lightbulb"
        },
        "active": {
            "variant": "info",
            "icon": "Zap"
        },
        "on_hold": {
            "variant": "warning",
            "icon": "PauseCircle"
        },
        "completed": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "cancelled": {
            "variant": "destructive",
            "icon": "XCircle"
        }
    }
}';

comment on column desk.projects.priority is '{
    "progress": false,
    "enums": {
        "low": {
            "variant": "outline",
            "icon": "CircleArrowDown"
        },
        "medium": {
            "variant": "info",
            "icon": "CircleMinus"
        },
        "high": {
            "variant": "warning",
            "icon": "CircleArrowUp"
        },
        "critical": {
            "variant": "destructive",
            "icon": "ShieldAlert"
        }
    }
}';

comment on table desk.projects is '{
    "icon": "FolderKanban",
    "display": "block",
    "query": {
        "sort": [{"id":"title","desc":false}],
        "join": [{"table":"users","on":"user_id","columns":["name","email"]}]
    },
    "primaryItem": "kanban",
    "items": [
        {"id":"kanban","name":"Projects By Status","type":"kanban","group":"status","title":"title","description":"description","date":"start_date","badge":"priority"},
        {"id":"calendar","name":"Project Timeline","type":"calendar","title":"title","startDate":"start_date","endDate":"end_date","badge":"status"},
        {"id":"gallery","name":"Project Gallery","type":"gallery","cover":"cover","title":"title","description":"description","badge":"status"}
    ],
    "sections": [
        {"id":"summary","title":"Summary","fields":["title","description","cover"]},
        {"id":"schedule","title":"Schedule","fields":["status","priority","start_date","end_date"]},
        {"id":"organization","title":"Organization","fields":["tags","color"]},
        {"id":"extras","title":"Notes","collapsible":true,"fields":["notes"]}
    ]
}';

comment on column desk.projects.cover is '{"accept":"image/*"}';

revoke all on table desk.projects
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table desk.projects to authenticated;

create index idx_projects_user_id on desk.projects (user_id);

create index idx_projects_status on desk.projects (status);

create index idx_projects_priority on desk.projects (priority);

alter table desk.projects enable row level security;

create policy projects_select on desk.projects for
select
  to authenticated using (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.projects:select')
  );

create policy projects_insert on desk.projects for insert to authenticated
with
  check (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.projects:insert')
  );

create policy projects_update on desk.projects
for update
  to authenticated using (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.projects:update')
  )
with
  check (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.projects:update')
  );

create policy projects_delete on desk.projects for delete to authenticated using (
  user_id = (
    select
      auth.uid ()
  )
  and supasheet.has_permission ('desk.projects:delete')
);

----------------------------------------------------------------
-- Tasks table
----------------------------------------------------------------
create table desk.tasks (
  id uuid primary key default extensions.uuid_generate_v4 (),
  title varchar(500) not null,
  description supasheet.RICH_TEXT,
  status desk.task_status default 'pending',
  priority desk.task_priority default 'medium',
  cover supasheet.file,
  -- User association (creator vs assignee)
  user_id uuid default auth.uid () references supasheet.users (id) on delete cascade,
  assignee_id uuid references supasheet.users (id) on delete set null,
  -- Project association
  project_id uuid references desk.projects (id) on delete set null,
  -- Dates
  due_date timestamptz,
  completed_at timestamptz,
  -- Organization
  tags varchar(500) [],
  is_important boolean default false,
  -- Progress tracking
  completion supasheet.percentage,
  estimated_duration supasheet.duration,
  duration supasheet.duration,
  -- File tracking
  attachments supasheet.file,
  -- Customization
  color supasheet.color,
  notes text,
  -- Audit fields
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column desk.tasks.status is '{
    "progress": true,
    "enums": {
        "pending": {
            "variant": "warning",
            "icon": "Clock"
        },
        "in_progress": {
            "variant": "info",
            "icon": "Loader"
        },
        "completed": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "archived": {
            "variant": "outline",
            "icon": "Archive"
        }
    }
}';

comment on column desk.tasks.priority is '{
    "progress": false,
    "enums": {
        "low": {
            "variant": "outline",
            "icon": "CircleArrowDown"
        },
        "medium": {
            "variant": "info",
            "icon": "CircleMinus"
        },
        "high": {
            "variant": "warning",
            "icon": "CircleArrowUp"
        },
        "critical": {
            "variant": "destructive",
            "icon": "Flame"
        }
    }
}';

comment on table desk.tasks is '{
    "icon": "ListTodo",
    "display": "block",
    "query": {
        "sort": [{"id":"title","desc":false}],
        "join": [
            {"table":"users","on":"user_id","columns":["name","email"]},
            {"table":"users","on":"assignee_id","columns":["name"]},
            {"table":"projects","on":"project_id","columns":["title"]}
        ]
    },
    "items": [
        {"id":"status","name":"Tasks By Status","type":"kanban","group":"status","title":"title","description":"description","date":"created_at","badge":"priority"},
        {"id":"priority","name":"Tasks By Priority","type":"kanban","group":"priority","title":"title","description":"description","date":"created_at","badge":"status"},
        {"id":"calendar","name":"Calendar View","type":"calendar", "title": "title", "startDate": "created_at", "endDate": "due_date", "badge": "status"},
        {"id":"gallery","name":"Gallery View","type":"gallery","cover":"cover","title":"title","description":"description","badge":"status"}
    ],
    "sections": [
        {"id":"summary","title":"Summary","fields":["title","description","cover"]},
        {"id":"schedule","title":"Schedule","fields":["status","priority","assignee_id","due_date","completed_at"]},
        {"id":"organization","title":"Organization","fields":["project_id","tags","is_important"]},
        {"id":"progress","title":"Progress","fields":["completion","estimated_duration","duration"]},
        {"id":"extras","title":"Attachments & notes","description":"Files, color tag, and free-form notes","collapsible":true,"fields":["attachments","color","notes"]}
    ]
}';

comment on column desk.tasks.cover is '{"accept":"image/*"}';

comment on column desk.tasks.attachments is '{"accept":"*", "maxFiles": 999}';

revoke all on table desk.tasks
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table desk.tasks to authenticated;

create index idx_tasks_user_id on desk.tasks (user_id);

create index idx_tasks_assignee_id on desk.tasks (assignee_id);

create index idx_tasks_status on desk.tasks (status);

create index idx_tasks_priority on desk.tasks (priority);

create index idx_tasks_project_id on desk.tasks (project_id);

create index idx_tasks_due_date on desk.tasks (due_date);

alter table desk.tasks enable row level security;

create policy tasks_select on desk.tasks for
select
  to authenticated using (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.tasks:select')
  );

create policy tasks_insert on desk.tasks for insert to authenticated
with
  check (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.tasks:insert')
  );

create policy tasks_update on desk.tasks
for update
  to authenticated using (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.tasks:update')
  )
with
  check (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.tasks:update')
  );

create policy tasks_delete on desk.tasks for delete to authenticated using (
  user_id = (
    select
      auth.uid ()
  )
  and supasheet.has_permission ('desk.tasks:delete')
);

----------------------------------------------------------------
-- Task comments (threaded discussion on a task)
----------------------------------------------------------------
create table desk.task_comments (
  id uuid primary key default extensions.uuid_generate_v4 (),
  task_id uuid not null references desk.tasks (id) on delete cascade,
  user_id uuid default auth.uid () references supasheet.users (id) on delete cascade,
  content text not null,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on table desk.task_comments is '{
    "icon": "MessageSquare",
    "inlineForm": true,
    "display": "block",
    "query": {
        "sort": [{"id":"created_at","desc":true}],
        "join": [
            {"table":"tasks","on":"task_id","columns":["title","status"]},
            {"table":"users","on":"user_id","columns":["name","email"]}
        ]
    },
    "sections": [
        {"id":"context","title":"Context","fields":["task_id"]},
        {"id":"body","title":"Comment","fields":["content"]}
    ]
}';

revoke all on table desk.task_comments
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table desk.task_comments to authenticated;

create index idx_task_comments_task_id on desk.task_comments (task_id);

create index idx_task_comments_user_id on desk.task_comments (user_id);

alter table desk.task_comments enable row level security;

-- Owner of the parent task can see all comments on it; comment authors always see their own
create policy task_comments_select on desk.task_comments for
select
  to authenticated using (
    supasheet.has_permission ('desk.task_comments:select')
    and (
      user_id = (
        select
          auth.uid ()
      )
      or exists (
        select
          1
        from
          desk.tasks t
        where
          t.id = task_id
          and t.user_id = (
            select
              auth.uid ()
          )
      )
    )
  );

create policy task_comments_insert on desk.task_comments for insert to authenticated
with
  check (
    supasheet.has_permission ('desk.task_comments:insert')
    and user_id = (
      select
        auth.uid ()
    )
    and exists (
      select
        1
      from
        desk.tasks t
      where
        t.id = task_id
        and t.user_id = (
          select
            auth.uid ()
        )
    )
  );

create policy task_comments_update on desk.task_comments
for update
  to authenticated using (
    supasheet.has_permission ('desk.task_comments:update')
    and user_id = (
      select
        auth.uid ()
    )
  )
with
  check (
    supasheet.has_permission ('desk.task_comments:update')
    and user_id = (
      select
        auth.uid ()
    )
  );

create policy task_comments_delete on desk.task_comments for delete to authenticated using (
  supasheet.has_permission ('desk.task_comments:delete')
  and user_id = (
    select
      auth.uid ()
  )
);

-- View of tasks joined with user name
create or replace view desk.user_tasks
with
  (security_invoker = true) as
select
  a.name as user_name,
  t.*
from
  desk.tasks t
  join supasheet.users a on t.user_id = a.id;

comment on view desk.user_tasks is '{"icon": "UserCheck"}';

revoke all on desk.user_tasks
from
  authenticated,
  service_role;

grant
select
  on desk.user_tasks to authenticated;

create or replace view desk.users
with
  (security_invoker = true) as
select
  *
from
  supasheet.users;

revoke all on desk.users
from
  authenticated,
  service_role;

grant
select
  on desk.users to authenticated;

----------------------------------------------------------------
-- Reports
----------------------------------------------------------------
create or replace view desk.task_report
with
  (security_invoker = true) as
select
  a.name as user_name,
  t.*
from
  desk.tasks t
  join supasheet.users a on t.user_id = a.id;

revoke all on desk.task_report
from
  authenticated,
  service_role;

grant
select
  on desk.task_report to authenticated;

comment on view desk.task_report is '{"type": "report", "name": "Task Report", "description": "Full task list with user details"}';

create or replace view desk.project_report
with
  (security_invoker = true) as
select
  u.name as user_name,
  p.id,
  p.title,
  p.description,
  p.status,
  p.priority,
  p.start_date,
  p.end_date,
  p.tags,
  p.color,
  count(t.id) as total_tasks,
  count(t.id) filter (
    where
      t.status = 'completed'
  ) as completed_tasks,
  count(t.id) filter (
    where
      t.status != 'completed'
  ) as open_tasks,
  p.created_at,
  p.updated_at
from
  desk.projects p
  join supasheet.users u on p.user_id = u.id
  left join desk.tasks t on t.project_id = p.id
group by
  p.id,
  u.name;

revoke all on desk.project_report
from
  authenticated,
  service_role;

grant
select
  on desk.project_report to authenticated;

comment on view desk.project_report is '{"type": "report", "name": "Project Report", "description": "Projects with task completion summary"}';

----------------------------------------------------------------
-- Dashboard widget views for tasks
----------------------------------------------------------------
create or replace view desk.task_summary
with
  (security_invoker = true) as
select
  count(*) as value,
  'list-todo' as icon,
  'active tasks' as label
from
  desk.tasks t
where
  t.status != 'completed';

revoke all on desk.task_summary
from
  authenticated,
  service_role;

grant
select
  on desk.task_summary to authenticated;

-- View for task completion rate (Card2 - split layout)
create or replace view desk.task_completion_rate
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'completed'
  ) as primary,
  count(*) filter (
    where
      status != 'completed'
  ) as secondary,
  'Completed' as primary_label,
  'Active' as secondary_label
from
  desk.tasks t;

revoke all on desk.task_completion_rate
from
  authenticated,
  service_role;

grant
select
  on desk.task_completion_rate to authenticated;

-- View for completed tasks stats (Card3 - value and percent layout)
create or replace view desk.tasks_by_status
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'completed'
  ) as value,
  case
    when count(*) > 0 then round(
      (
        count(*) filter (
          where
            status = 'completed'
        )::numeric / count(*)::numeric
      ) * 100,
      1
    )
    else 0
  end as percent
from
  desk.tasks t;

revoke all on desk.tasks_by_status
from
  authenticated,
  service_role;

grant
select
  on desk.tasks_by_status to authenticated;

-- View for task progress with breakdown (Card4 - progress layout)
create or replace view desk.task_critical_count
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status != 'completed'
      and priority in ('high', 'critical')
  ) as current,
  count(*) filter (
    where
      status != 'completed'
  ) as total,
  json_build_array(
    json_build_object(
      'label',
      'Critical',
      'value',
      count(*) filter (
        where
          priority = 'critical'
          and status != 'completed'
      )
    ),
    json_build_object(
      'label',
      'High',
      'value',
      count(*) filter (
        where
          priority = 'high'
          and status != 'completed'
      )
    ),
    json_build_object(
      'label',
      'Overdue',
      'value',
      count(*) filter (
        where
          due_date < current_timestamp
          and status != 'completed'
      )
    )
  ) as segments
from
  desk.tasks;

revoke all on desk.task_critical_count
from
  authenticated,
  service_role;

grant
select
  on desk.task_critical_count to authenticated;

comment on view desk.task_summary is '{"type": "dashboard_widget", "name": "Task Summary", "description": "Summary of active tasks", "widget_type": "card_1"}';

comment on view desk.task_completion_rate is '{"type": "dashboard_widget", "name": "Task Completion Rate", "description": "Completed vs Active tasks", "widget_type": "card_2"}';

comment on view desk.tasks_by_status is '{"type": "dashboard_widget", "name": "Tasks by Status", "description": "Completed tasks stats", "widget_type": "card_3"}';

comment on view desk.task_critical_count is '{"type": "dashboard_widget", "name": "Task Critical Count", "description": "High priority tasks", "widget_type": "card_4"}';

-- Table widget: recent tasks (simple)
create or replace view desk.task_list_simple
with
  (security_invoker = true) as
select
  title,
  status,
  priority,
  completion
from
  desk.tasks
order by
  created_at desc
limit
  10;

revoke all on desk.task_list_simple
from
  authenticated,
  service_role;

grant
select
  on desk.task_list_simple to authenticated;

-- Table widget: active tasks by priority
create or replace view desk.active_tasks_simple
with
  (security_invoker = true) as
select
  title,
  priority,
  to_char(due_date, 'MM/DD') as due
from
  desk.tasks
where
  status != 'completed'
order by
  case priority
    when 'critical' then 1
    when 'high' then 2
    when 'medium' then 3
    when 'low' then 4
  end,
  due_date
limit
  10;

revoke all on desk.active_tasks_simple
from
  authenticated,
  service_role;

grant
select
  on desk.active_tasks_simple to authenticated;

comment on view desk.task_list_simple is '{"type": "dashboard_widget", "name": "Recent Tasks", "description": "Latest tasks in the system", "widget_type": "table_1"}';

comment on view desk.active_tasks_simple is '{"type": "dashboard_widget", "name": "Priority Queue", "description": "Active tasks by priority", "widget_type": "table_1"}';

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_completion_rate:select'),
  ('x-admin', 'desk.tasks_by_status:select'),
  ('x-admin', 'desk.task_critical_count:select'),
  ('x-admin', 'desk.task_list_simple:select'),
  ('x-admin', 'desk.active_tasks_simple:select');

----------------------------------------------------------------
-- Dashboard widget views for projects
----------------------------------------------------------------
-- Card1: count of active projects
create or replace view desk.project_summary
with
  (security_invoker = true) as
select
  count(*) as value,
  'folder-kanban' as icon,
  'active projects' as label
from
  desk.projects
where
  status = 'active';

revoke all on desk.project_summary
from
  authenticated,
  service_role;

grant
select
  on desk.project_summary to authenticated;

-- Card2: completed vs in-progress projects
create or replace view desk.project_completion_rate
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'completed'
  ) as primary,
  count(*) filter (
    where
      status not in ('completed', 'cancelled')
  ) as secondary,
  'Completed' as primary_label,
  'In Progress' as secondary_label
from
  desk.projects;

revoke all on desk.project_completion_rate
from
  authenticated,
  service_role;

grant
select
  on desk.project_completion_rate to authenticated;

-- Table1: recent projects (simple)
create or replace view desk.project_list_simple
with
  (security_invoker = true) as
select
  title,
  status,
  priority,
  to_char(end_date, 'MM/DD') as deadline
from
  desk.projects
order by
  created_at desc
limit
  10;

revoke all on desk.project_list_simple
from
  authenticated,
  service_role;

grant
select
  on desk.project_list_simple to authenticated;

-- Table2: projects with task breakdown
create or replace view desk.project_task_overview
with
  (security_invoker = true) as
select
  p.title as project,
  p.status,
  p.priority,
  count(t.id) as total_tasks,
  count(t.id) filter (
    where
      t.status = 'completed'
  ) as done,
  round(
    case
      when count(t.id) > 0 then (
        count(t.id) filter (
          where
            t.status = 'completed'
        )::numeric / count(t.id)::numeric
      ) * 100
      else 0
    end,
    1
  ) as pct,
  to_char(p.end_date, 'MM/DD') as deadline
from
  desk.projects p
  left join desk.tasks t on t.project_id = p.id
group by
  p.id,
  p.title,
  p.status,
  p.priority,
  p.end_date
order by
  p.created_at desc
limit
  10;

revoke all on desk.project_task_overview
from
  authenticated,
  service_role;

grant
select
  on desk.project_task_overview to authenticated;

comment on view desk.project_summary is '{"type": "dashboard_widget", "name": "Active Projects", "description": "Count of active projects", "widget_type": "card_1"}';

comment on view desk.project_completion_rate is '{"type": "dashboard_widget", "name": "Project Completion", "description": "Completed vs in-progress projects", "widget_type": "card_2"}';

comment on view desk.project_list_simple is '{"type": "dashboard_widget", "name": "Recent Projects", "description": "Latest projects", "widget_type": "table_1"}';

comment on view desk.project_task_overview is '{"type": "dashboard_widget", "name": "Project Task Breakdown", "description": "Projects with task completion stats", "widget_type": "table_2"}';

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.project_summary:select'),
  ('x-admin', 'desk.project_completion_rate:select'),
  ('x-admin', 'desk.project_list_simple:select'),
  ('x-admin', 'desk.project_task_overview:select');

----------------------------------------------------------------
-- Chart views for tasks
----------------------------------------------------------------
-- Bar chart: tasks by priority
create or replace view desk.task_priority_bar
with
  (security_invoker = true) as
select
  priority as label,
  count(*) as total,
  count(*) filter (
    where
      status = 'completed'
  ) as completed
from
  desk.tasks
group by
  priority
order by
  case priority
    when 'critical' then 1
    when 'high' then 2
    when 'medium' then 3
    when 'low' then 4
  end;

revoke all on desk.task_priority_bar
from
  authenticated,
  service_role;

grant
select
  on desk.task_priority_bar to authenticated;

-- Line chart: daily task completion rate
create or replace view desk.task_completion_line
with
  (security_invoker = true) as
select
  to_char(date_trunc('day', created_at), 'Mon DD') as date,
  count(*) as created,
  count(*) filter (
    where
      status = 'completed'
  ) as completed
from
  desk.tasks
where
  created_at >= current_date - interval '14 days'
group by
  date_trunc('day', created_at)
order by
  date_trunc('day', created_at);

revoke all on desk.task_completion_line
from
  authenticated,
  service_role;

grant
select
  on desk.task_completion_line to authenticated;

-- Pie chart: task status distribution
create or replace view desk.task_status_pie
with
  (security_invoker = true) as
select
  status as label,
  count(*) as value
from
  desk.tasks
group by
  status;

revoke all on desk.task_status_pie
from
  authenticated,
  service_role;

grant
select
  on desk.task_status_pie to authenticated;

-- Radar chart: task metrics by priority
create or replace view desk.task_metrics_radar
with
  (security_invoker = true) as
select
  priority as metric,
  count(*) as total,
  count(*) filter (
    where
      status = 'completed'
  ) as completed,
  count(*) filter (
    where
      due_date < current_timestamp
      and status != 'completed'
  ) as overdue
from
  desk.tasks
group by
  priority;

revoke all on desk.task_metrics_radar
from
  authenticated,
  service_role;

grant
select
  on desk.task_metrics_radar to authenticated;

comment on view desk.task_priority_bar is '{"type": "chart", "name": "Task Priority Bar", "description": "Tasks grouped by priority level", "chart_type": "bar"}';

comment on view desk.task_completion_line is '{"type": "chart", "name": "Task Completion Line", "description": "Daily task completion over 2 weeks", "chart_type": "line"}';

comment on view desk.task_status_pie is '{"type": "chart", "name": "Task Status Pie", "description": "Current task status breakdown", "chart_type": "pie"}';

comment on view desk.task_metrics_radar is '{"type": "chart", "name": "Task Metrics Radar", "description": "Task metrics across priorities", "chart_type": "radar"}';

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_priority_bar:select'),
  ('x-admin', 'desk.task_completion_line:select'),
  ('x-admin', 'desk.task_status_pie:select'),
  ('x-admin', 'desk.task_metrics_radar:select');

----------------------------------------------------------------
-- Chart views for projects
----------------------------------------------------------------
-- Pie chart: project status distribution
create or replace view desk.project_status_pie
with
  (security_invoker = true) as
select
  status as label,
  count(*) as value
from
  desk.projects
group by
  status;

revoke all on desk.project_status_pie
from
  authenticated,
  service_role;

grant
select
  on desk.project_status_pie to authenticated;

-- Bar chart: projects by priority
create or replace view desk.project_priority_bar
with
  (security_invoker = true) as
select
  priority as label,
  count(*) as total,
  count(*) filter (
    where
      status = 'completed'
  ) as completed
from
  desk.projects
group by
  priority
order by
  case priority
    when 'critical' then 1
    when 'high' then 2
    when 'medium' then 3
    when 'low' then 4
  end;

revoke all on desk.project_priority_bar
from
  authenticated,
  service_role;

grant
select
  on desk.project_priority_bar to authenticated;

comment on view desk.project_status_pie is '{"type": "chart", "name": "Project Status Pie", "description": "Projects grouped by current status", "chart_type": "pie"}';

comment on view desk.project_priority_bar is '{"type": "chart", "name": "Project Priority Bar", "description": "Projects grouped by priority level", "chart_type": "bar"}';

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.project_status_pie:select'),
  ('x-admin', 'desk.project_priority_bar:select');

----------------------------------------------------------------
-- Role permissions
----------------------------------------------------------------
insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.tasks:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.tasks:insert');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.tasks:update');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.tasks:delete');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.tasks:audit');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.user_tasks:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_report:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_summary:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.projects:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.projects:insert');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.projects:update');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.projects:delete');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.projects:audit');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.project_report:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_comments:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_comments:insert');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_comments:update');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_comments:delete');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.task_comments:audit');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.users:select');

----------------------------------------------------------------
-- Audit triggers for tasks
----------------------------------------------------------------
create trigger audit_tasks_insert
after insert on desk.tasks for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_tasks_update
after
update on desk.tasks for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_tasks_delete before delete on desk.tasks for each row
execute function supasheet.audit_trigger_function ();

----------------------------------------------------------------
-- Audit triggers for projects
----------------------------------------------------------------
create trigger audit_projects_insert
after insert on desk.projects for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_projects_update
after
update on desk.projects for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_projects_delete before delete on desk.projects for each row
execute function supasheet.audit_trigger_function ();

----------------------------------------------------------------
-- Audit triggers for task comments
----------------------------------------------------------------
create trigger audit_task_comments_insert
after insert on desk.task_comments for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_task_comments_update
after
update on desk.task_comments for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_task_comments_delete before delete on desk.task_comments for each row
execute function supasheet.audit_trigger_function ();

----------------------------------------------------------------
-- Notifications
----------------------------------------------------------------
-- Project trigger: notify owner and project admins on creation / status change
create or replace function desk.trg_projects_notify () returns trigger as $$
declare
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
begin
    v_recipients := array_remove(
        supasheet.get_users_with_permission('desk.projects:select') || array[new.user_id],
        null
    );

    if tg_op = 'INSERT' then
        v_type  := 'project_created';
        v_title := 'Project created';
        v_body  := 'Project "' || new.title || '" was created.';
    elsif new.status is distinct from old.status then
        v_type  := 'project_status_changed';
        v_title := 'Project status updated';
        v_body  := 'Project "' || new.title || '" is now ' || new.status::text || '.';
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object('project_id', new.id, 'status', new.status),
        '/desk/resource/projects/detail/' || new.id::text
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists projects_notify on desk.projects;

create trigger projects_notify
after insert
or
update of status on desk.projects for each row
execute function desk.trg_projects_notify ();

-- Task trigger: notify owner and assignee on creation, status change, or reassignment
create or replace function desk.trg_tasks_notify () returns trigger as $$
declare
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
begin
    v_recipients := array_remove(array[new.user_id, new.assignee_id], null);

    if tg_op = 'INSERT' then
        v_type  := 'task_created';
        v_title := 'Task created';
        v_body  := 'Task "' || new.title || '" was created.';
    elsif new.status is distinct from old.status then
        v_type  := 'task_status_changed';
        v_title := 'Task status updated';
        v_body  := 'Task "' || new.title || '" is now ' || new.status::text || '.';
    elsif new.assignee_id is distinct from old.assignee_id then
        v_type  := 'task_assigned';
        v_title := 'Task assignment changed';
        v_body  := 'Task "' || new.title || '" was reassigned.';
        -- Include the previous assignee so they know they were unassigned
        v_recipients := array_remove(
            array[new.user_id, new.assignee_id, old.assignee_id], null
        );
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object(
            'task_id',     new.id,
            'project_id',  new.project_id,
            'status',      new.status,
            'assignee_id', new.assignee_id
        ),
        '/desk/resource/tasks/detail/' || new.id::text
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists tasks_notify on desk.tasks;

create trigger tasks_notify
after insert
or
update of status,
assignee_id on desk.tasks for each row
execute function desk.trg_tasks_notify ();

-- Task comment trigger: notify task owner + assignee, excluding the commenter
create or replace function desk.trg_task_comments_notify () returns trigger as $$
declare
    v_task       desk.tasks%rowtype;
    v_recipients uuid[];
begin
    select * into v_task from desk.tasks where id = new.task_id;

    v_recipients := array_remove(
        array_remove(array[v_task.user_id, v_task.assignee_id], null),
        new.user_id
    );

    perform supasheet.create_notification(
        'task_comment_added',
        'New comment',
        'A new comment was added to task "' || v_task.title || '".',
        v_recipients,
        jsonb_build_object(
            'task_id',      new.task_id,
            'comment_id',   new.id,
            'commenter_id', new.user_id
        ),
        '/desk/resource/tasks/detail/' || new.task_id::text
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists task_comments_notify on desk.task_comments;

create trigger task_comments_notify
after insert on desk.task_comments for each row
execute function desk.trg_task_comments_notify ();

----------------------------------------------------------------
-- Timesheets
----------------------------------------------------------------
begin;

create type desk.timesheet_status as enum('draft', 'submitted', 'approved', 'rejected');

-- Timesheet CRUD permissions
alter type supasheet.app_permission
add value 'desk.timesheets:select';

alter type supasheet.app_permission
add value 'desk.timesheets:insert';

alter type supasheet.app_permission
add value 'desk.timesheets:update';

alter type supasheet.app_permission
add value 'desk.timesheets:delete';

alter type supasheet.app_permission
add value 'desk.timesheets:audit';

-- Dashboard widget permissions
alter type supasheet.app_permission
add value 'desk.timesheet_hours_this_week:select';

alter type supasheet.app_permission
add value 'desk.timesheet_approval_status:select';

alter type supasheet.app_permission
add value 'desk.timesheet_billable_rate:select';

alter type supasheet.app_permission
add value 'desk.timesheet_status_breakdown:select';

alter type supasheet.app_permission
add value 'desk.timesheet_recent_entries:select';

alter type supasheet.app_permission
add value 'desk.timesheet_top_tasks:select';

-- Chart permissions
alter type supasheet.app_permission
add value 'desk.timesheet_hours_by_project:select';

alter type supasheet.app_permission
add value 'desk.timesheet_daily_hours_line:select';

alter type supasheet.app_permission
add value 'desk.timesheet_status_pie:select';

alter type supasheet.app_permission
add value 'desk.timesheet_weekday_radar:select';

-- Report permission
alter type supasheet.app_permission
add value 'desk.timesheet_report:select';

commit;

create table desk.timesheets (
  id uuid primary key default extensions.uuid_generate_v4 (),
  title varchar(500) not null,
  description supasheet.RICH_TEXT,
  -- Associations
  task_id uuid references desk.tasks (id) on delete set null,
  project_id uuid references desk.projects (id) on delete set null,
  -- Who logged time
  user_id uuid default auth.uid () references supasheet.users (id) on delete cascade,
  -- Time window
  started_at timestamptz not null,
  ended_at timestamptz,
  -- Duration in milliseconds (matches desk.tasks.duration type)
  duration supasheet.DURATION,
  -- Approval workflow
  status desk.timesheet_status default 'draft',
  -- Billing
  billable boolean default false,
  -- Organization
  tags varchar(500) [],
  notes text,
  -- Audit fields
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column desk.timesheets.status is '{
    "progress": true,
    "enums": {
        "draft": {
            "variant": "outline",
            "icon": "FileText"
        },
        "submitted": {
            "variant": "info",
            "icon": "Send"
        },
        "approved": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "rejected": {
            "variant": "destructive",
            "icon": "XCircle"
        }
    }
}';

comment on table desk.timesheets is '{
    "icon": "Clock",
    "display": "block",
    "query": {
        "sort": [{"id":"started_at","desc":true}],
        "join": [
            {"table":"users","on":"user_id","columns":["name","email"]},
            {"table":"tasks","on":"task_id","columns":["title","status"]},
            {"table":"projects","on":"project_id","columns":["title"]}
        ]
    },
    "items": [
        {"id":"calendar","name":"Time Calendar","type":"calendar","title":"title","startDate":"started_at","endDate":"ended_at","badge":"status"}
    ],
    "sections": [
        {"id":"summary","title":"Summary","fields":["title","description","task_id","project_id"]},
        {"id":"time","title":"Time","fields":["status","started_at","ended_at","duration"]},
        {"id":"billing","title":"Billing","fields":["billable"]},
        {"id":"extras","title":"Tags & Notes","collapsible":true,"fields":["tags","notes"]}
    ]
}';

revoke all on table desk.timesheets
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table desk.timesheets to authenticated;

create index idx_timesheets_user_id on desk.timesheets (user_id);

create index idx_timesheets_task_id on desk.timesheets (task_id);

create index idx_timesheets_project_id on desk.timesheets (project_id);

create index idx_timesheets_status on desk.timesheets (status);

create index idx_timesheets_started_at on desk.timesheets (started_at);

create index idx_timesheets_billable on desk.timesheets (billable);

alter table desk.timesheets enable row level security;

create policy timesheets_select on desk.timesheets for
select
  to authenticated using (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.timesheets:select')
  );

create policy timesheets_insert on desk.timesheets for insert to authenticated
with
  check (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.timesheets:insert')
  );

create policy timesheets_update on desk.timesheets
for update
  to authenticated using (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.timesheets:update')
  )
with
  check (
    user_id = (
      select
        auth.uid ()
    )
    and supasheet.has_permission ('desk.timesheets:update')
  );

create policy timesheets_delete on desk.timesheets for delete to authenticated using (
  user_id = (
    select
      auth.uid ()
  )
  and supasheet.has_permission ('desk.timesheets:delete')
);

----------------------------------------------------------------
-- Dashboard widget views for timesheets
----------------------------------------------------------------
-- Card1: total hours logged this week
create or replace view desk.timesheet_hours_this_week
with
  (security_invoker = true) as
select
  round(coalesce(sum(duration), 0)::numeric / 3600000, 1) as value,
  'timer' as icon,
  'hours logged this week' as label
from
  desk.timesheets
where
  started_at >= date_trunc('week', current_timestamp);

revoke all on desk.timesheet_hours_this_week
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_hours_this_week to authenticated;

-- Card2: approved vs pending entries
create or replace view desk.timesheet_approval_status
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'approved'
  ) as primary,
  count(*) filter (
    where
      status = 'submitted'
  ) as secondary,
  'Approved' as primary_label,
  'Pending Review' as secondary_label
from
  desk.timesheets;

revoke all on desk.timesheet_approval_status
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_approval_status to authenticated;

-- Card3: billable hours with percentage of total
create or replace view desk.timesheet_billable_rate
with
  (security_invoker = true) as
select
  round(
    coalesce(
      sum(duration) filter (
        where
          billable = true
      ),
      0
    )::numeric / 3600000,
    1
  ) as value,
  case
    when coalesce(sum(duration), 0) > 0 then round(
      (
        coalesce(
          sum(duration) filter (
            where
              billable = true
          ),
          0
        )::numeric / sum(duration)::numeric
      ) * 100,
      1
    )
    else 0
  end as percent
from
  desk.timesheets;

revoke all on desk.timesheet_billable_rate
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_billable_rate to authenticated;

-- Card4: status breakdown with segments
create or replace view desk.timesheet_status_breakdown
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status in ('submitted', 'approved')
  ) as current,
  count(*) as total,
  json_build_array(
    json_build_object(
      'label',
      'Approved',
      'value',
      count(*) filter (
        where
          status = 'approved'
      )
    ),
    json_build_object(
      'label',
      'Submitted',
      'value',
      count(*) filter (
        where
          status = 'submitted'
      )
    ),
    json_build_object(
      'label',
      'Rejected',
      'value',
      count(*) filter (
        where
          status = 'rejected'
      )
    )
  ) as segments
from
  desk.timesheets;

revoke all on desk.timesheet_status_breakdown
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_status_breakdown to authenticated;

-- Table widget: recent time entries
create or replace view desk.timesheet_recent_entries
with
  (security_invoker = true) as
select
  title,
  status,
  round(duration::numeric / 3600000, 1) as hours,
  to_char(started_at, 'MM/DD') as date
from
  desk.timesheets
order by
  started_at desc
limit
  10;

revoke all on desk.timesheet_recent_entries
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_recent_entries to authenticated;

-- Table widget: top tasks by time logged
create or replace view desk.timesheet_top_tasks
with
  (security_invoker = true) as
select
  coalesce(t.title, '(no task)') as task,
  count(ts.id) as entries,
  round(sum(ts.duration)::numeric / 3600000, 1) as total_hours
from
  desk.timesheets ts
  left join desk.tasks t on ts.task_id = t.id
group by
  t.title
order by
  sum(ts.duration) desc nulls last
limit
  10;

revoke all on desk.timesheet_top_tasks
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_top_tasks to authenticated;

comment on view desk.timesheet_hours_this_week is '{"type": "dashboard_widget", "name": "Hours This Week",       "description": "Total hours logged in the current week",          "widget_type": "card_1"}';

comment on view desk.timesheet_approval_status is '{"type": "dashboard_widget", "name": "Approval Status",       "description": "Approved vs pending timesheet entries",           "widget_type": "card_2"}';

comment on view desk.timesheet_billable_rate is '{"type": "dashboard_widget", "name": "Billable Hours",        "description": "Billable hours and percentage of total",           "widget_type": "card_3"}';

comment on view desk.timesheet_status_breakdown is '{"type": "dashboard_widget", "name": "Status Breakdown",      "description": "Submitted and approved vs total entries",          "widget_type": "card_4"}';

comment on view desk.timesheet_recent_entries is '{"type": "dashboard_widget", "name": "Recent Time Entries",   "description": "Latest timesheet entries",                         "widget_type": "table_1"}';

comment on view desk.timesheet_top_tasks is '{"type": "dashboard_widget", "name": "Top Tasks by Time",     "description": "Tasks with the most logged time",                  "widget_type": "table_2"}';

insert into
  supasheet.role_permissions (role, permission)
values
  (
    'x-admin',
    'desk.timesheet_hours_this_week:select'
  ),
  (
    'x-admin',
    'desk.timesheet_approval_status:select'
  ),
  ('x-admin', 'desk.timesheet_billable_rate:select'),
  (
    'x-admin',
    'desk.timesheet_status_breakdown:select'
  ),
  ('x-admin', 'desk.timesheet_recent_entries:select'),
  ('x-admin', 'desk.timesheet_top_tasks:select');

----------------------------------------------------------------
-- Chart views for timesheets
----------------------------------------------------------------
-- Bar chart: hours by project
create or replace view desk.timesheet_hours_by_project
with
  (security_invoker = true) as
select
  coalesce(p.title, '(no project)') as label,
  round(sum(ts.duration)::numeric / 3600000, 1) as total_hours,
  round(
    coalesce(
      sum(ts.duration) filter (
        where
          ts.billable = true
      ),
      0
    )::numeric / 3600000,
    1
  ) as billable_hours
from
  desk.timesheets ts
  left join desk.projects p on ts.project_id = p.id
group by
  p.title
order by
  sum(ts.duration) desc nulls last;

revoke all on desk.timesheet_hours_by_project
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_hours_by_project to authenticated;

-- Line chart: daily hours over last 14 days
create or replace view desk.timesheet_daily_hours_line
with
  (security_invoker = true) as
select
  to_char(date_trunc('day', started_at), 'Mon DD') as date,
  round(sum(duration)::numeric / 3600000, 1) as total_hours,
  round(
    coalesce(
      sum(duration) filter (
        where
          billable = true
      ),
      0
    )::numeric / 3600000,
    1
  ) as billable_hours
from
  desk.timesheets
where
  started_at >= current_date - interval '14 days'
group by
  date_trunc('day', started_at)
order by
  date_trunc('day', started_at);

revoke all on desk.timesheet_daily_hours_line
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_daily_hours_line to authenticated;

-- Pie chart: entry count by status
create or replace view desk.timesheet_status_pie
with
  (security_invoker = true) as
select
  status as label,
  count(*) as value
from
  desk.timesheets
group by
  status;

revoke all on desk.timesheet_status_pie
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_status_pie to authenticated;

-- Radar chart: hours by day of week
create or replace view desk.timesheet_weekday_radar
with
  (security_invoker = true) as
select
  to_char(started_at, 'Day') as metric,
  round(sum(duration)::numeric / 3600000, 1) as total_hours,
  round(
    coalesce(
      sum(duration) filter (
        where
          billable = true
      ),
      0
    )::numeric / 3600000,
    1
  ) as billable_hours
from
  desk.timesheets
group by
  to_char(started_at, 'Day'),
  extract(
    isodow
    from
      started_at
  )
order by
  extract(
    isodow
    from
      started_at
  );

revoke all on desk.timesheet_weekday_radar
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_weekday_radar to authenticated;

comment on view desk.timesheet_hours_by_project is '{"type": "chart", "name": "Hours by Project",        "description": "Total and billable hours grouped by project",          "chart_type": "bar"}';

comment on view desk.timesheet_daily_hours_line is '{"type": "chart", "name": "Daily Hours",              "description": "Hours logged per day over the last 14 days",           "chart_type": "line"}';

comment on view desk.timesheet_status_pie is '{"type": "chart", "name": "Timesheet Status",         "description": "Entry count grouped by status",                        "chart_type": "pie"}';

comment on view desk.timesheet_weekday_radar is '{"type": "chart", "name": "Hours by Weekday",         "description": "Total and billable hours per day of the week",         "chart_type": "radar"}';

insert into
  supasheet.role_permissions (role, permission)
values
  (
    'x-admin',
    'desk.timesheet_hours_by_project:select'
  ),
  (
    'x-admin',
    'desk.timesheet_daily_hours_line:select'
  ),
  ('x-admin', 'desk.timesheet_status_pie:select'),
  ('x-admin', 'desk.timesheet_weekday_radar:select');

----------------------------------------------------------------
-- Report view for timesheets
----------------------------------------------------------------
create or replace view desk.timesheet_report
with
  (security_invoker = true) as
select
  u.name as user_name,
  u.email as user_email,
  ts.id,
  ts.title,
  ts.description,
  ts.status,
  ts.billable,
  ts.started_at,
  ts.ended_at,
  round(ts.duration::numeric / 3600000, 2) as hours,
  ts.tags,
  ts.notes,
  t.title as task_title,
  t.status as task_status,
  p.title as project_title,
  p.status as project_status,
  ts.created_at,
  ts.updated_at
from
  desk.timesheets ts
  join supasheet.users u on ts.user_id = u.id
  left join desk.tasks t on ts.task_id = t.id
  left join desk.projects p on ts.project_id = p.id;

revoke all on desk.timesheet_report
from
  authenticated,
  service_role;

grant
select
  on desk.timesheet_report to authenticated;

comment on view desk.timesheet_report is '{"type": "report", "name": "Timesheet Report", "description": "Full time entry detail with user, task, and project context"}';

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.timesheet_report:select');

----------------------------------------------------------------
-- Role permissions for timesheets
----------------------------------------------------------------
insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.timesheets:select');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.timesheets:insert');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.timesheets:update');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.timesheets:delete');

insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'desk.timesheets:audit');

----------------------------------------------------------------
-- Audit triggers for timesheets
----------------------------------------------------------------
create trigger audit_timesheets_insert
after insert on desk.timesheets for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_timesheets_update
after
update on desk.timesheets for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_timesheets_delete before delete on desk.timesheets for each row
execute function supasheet.audit_trigger_function ();

----------------------------------------------------------------
-- Notifications for timesheets
----------------------------------------------------------------
create or replace function desk.trg_timesheets_notify () returns trigger as $$
declare
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
begin
    if tg_op = 'INSERT' then
        v_type       := 'timesheet_created';
        v_title      := 'Time entry created';
        v_body       := 'Your time entry "' || new.title || '" has been saved as draft.';
        v_recipients := array[new.user_id];

    elsif new.status is distinct from old.status then

        if new.status = 'submitted' then
            v_type       := 'timesheet_submitted';
            v_title      := 'Timesheet submitted for review';
            v_body       := '"' || new.title || '" was submitted and is awaiting approval.';
            v_recipients := array_remove(
                supasheet.get_users_with_permission('desk.timesheets:select'),
                null
            );

        elsif new.status = 'approved' then
            v_type       := 'timesheet_approved';
            v_title      := 'Timesheet approved';
            v_body       := 'Your time entry "' || new.title || '" has been approved.';
            v_recipients := array[new.user_id];

        elsif new.status = 'rejected' then
            v_type       := 'timesheet_rejected';
            v_title      := 'Timesheet rejected';
            v_body       := 'Your time entry "' || new.title || '" was rejected. Please review and resubmit.';
            v_recipients := array[new.user_id];

        else
            return new;
        end if;

    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object(
            'timesheet_id', new.id,
            'task_id',      new.task_id,
            'project_id',   new.project_id,
            'status',       new.status
        ),
        '/desk/resource/timesheets/detail/' || new.id::text
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists timesheets_notify on desk.timesheets;

create trigger timesheets_notify
after insert
or
update of status on desk.timesheets for each row
execute function desk.trg_timesheets_notify ();
