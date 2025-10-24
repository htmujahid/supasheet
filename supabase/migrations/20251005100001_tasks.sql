create table tasks (
    id uuid primary key default extensions.uuid_generate_v4(),
    title varchar(500) not null,
    description RICH_TEXT,
    status task_status default 'pending',
    priority task_priority default 'medium',
    cover file,

    -- User association
    account_id uuid default auth.uid() references supasheet.accounts(id) on delete cascade,

    -- Dates
    due_date timestamptz,
    completed_at timestamptz,

    -- Organization
    tags text[],
    is_important boolean default false,

    -- Progress tracking
    completion percentage,
    duration duration,

    -- File tracking
    attachments file,

    -- Customization
    color color,
    notes text,

    -- Audit fields
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

comment on table public.tasks is '{"icon": "ListTodo", "display": "block", "items": [{"name": "Calendar View", "view": "task_calendar_view", "type": "calendar"}, {"name": "Board View", "view": "task_board_view", "type": "board"}, {"name": "List View", "view": "task_list_view", "type": "list"}, {"name": "Gantt View", "view": "task_gantt_view", "type": "gantt"}], "proxy": {"schema":"public","view":"user_tasks"}}';

comment on column tasks.cover is '{"accept":"image/*"}';
comment on column tasks.attachments is '{"accept":"*"}';

revoke all on table public.tasks from authenticated, service_role;

grant select, insert, update, delete on table public.tasks to authenticated;

create index idx_tasks_account_id on public.tasks (account_id);
create index idx_tasks_status on public.tasks (status);
create index idx_tasks_priority on public.tasks (priority);

alter table public.tasks enable row level security;

create policy tasks_select on public.tasks
    for select
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('public.tasks:select'));

create policy tasks_insert on public.tasks
    for insert
    to authenticated
    with check (account_id = auth.uid() and supasheet.has_permission('public.tasks:insert'));

create policy tasks_update on public.tasks
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('public.tasks:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('public.tasks:update'));

create policy tasks_delete on public.tasks
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('public.tasks:delete'));


-- create a view of tasks with account name
create or replace view public.user_tasks
with(security_invoker = true) as
select
    a.name as account_name,
    t.*
from tasks t
join supasheet.accounts a on t.account_id = a.id;

comment on view public.user_tasks is '{"icon": "UserCheck"}';

-- grant select on view to authenticated
revoke all on public.user_tasks from authenticated, service_role;
grant select on public.user_tasks to authenticated;


----------------------------------------------------------------
-- Reports for tasks
----------------------------------------------------------------


-- create a view of tasks with account name
create or replace view public.task_report
with(security_invoker = true) as
select
    a.name as account_name,
    t.*
from tasks t
join supasheet.accounts a on t.account_id = a.id;

-- grant select on view to authenticated
revoke all on public.task_report from authenticated, service_role;
grant select on public.task_report to authenticated;

comment on view public.task_report is '{"type": "report", "name": "Task Summary", "description": "Summary of active tasks"}';

create or replace view public.task_summary
with(security_invoker = true) as
select
    count(*) as value,
    'list-todo' as icon,
    'active tasks' as label
from tasks t
where t.status != 'completed';

revoke all on public.task_summary from authenticated, service_role;
grant select on public.task_summary to authenticated;


insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'public.user_tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.task_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.task_summary:select');

----------------------------------------------------------------
-- Dashboard widget views for tasks
----------------------------------------------------------------

-- View for task completion rate (Card2 - split layout)
create or replace view public.task_completion_rate as
select
    count(*) filter (where status = 'completed') as primary,
    count(*) filter (where status != 'completed') as secondary,
    'Completed' as primary_label,
    'Active' as secondary_label
from tasks t;

revoke all on public.task_completion_rate from authenticated, service_role;
grant select on public.task_completion_rate to authenticated;

-- View for completed tasks stats (Card3 - value and percent layout)
create or replace view public.tasks_by_status as
select
    count(*) filter (where status = 'completed') as value,
    case
        when count(*) > 0
        then round((count(*) filter (where status = 'completed')::numeric / count(*)::numeric) * 100, 1)
        else 0
    end as percent
from tasks t;

revoke all on public.tasks_by_status from authenticated, service_role;
grant select on public.tasks_by_status to authenticated;

-- View for task progress with breakdown (Card4 - progress layout)
create or replace view public.task_urgent_count as
select
    count(*) filter (where status != 'completed' and priority in ('high', 'urgent')) as current,
    count(*) filter (where status != 'completed') as total,
    json_build_array(
        json_build_object('label', 'Urgent', 'value', count(*) filter (where priority = 'urgent' and status != 'completed')),
        json_build_object('label', 'High', 'value', count(*) filter (where priority = 'high' and status != 'completed')),
        json_build_object('label', 'Overdue', 'value', count(*) filter (where due_date < current_timestamp and status != 'completed'))
    ) as segments
from tasks;


revoke all on public.task_urgent_count from authenticated, service_role;
grant select on public.task_urgent_count to authenticated;

comment on view public.task_summary is '{"type": "dashboard_widget", "name": "Task Summary", "description": "Summary of active tasks", "widget_type": "card_1"}';
comment on view public.task_completion_rate is '{"type": "dashboard_widget", "name": "Task Completion Rate", "description": "Completed vs Active tasks", "widget_type": "card_2"}';
comment on view public.tasks_by_status is '{"type": "dashboard_widget", "name": "Tasks by Status", "description": "Completed tasks stats", "widget_type": "card_3"}';
comment on view public.task_urgent_count is '{"type": "dashboard_widget", "name": "Task Urgent Count", "description": "High priority tasks", "widget_type": "card_4"}';

-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values
    ('user', 'public.task_completion_rate:select'),
    ('user', 'public.tasks_by_status:select'),
    ('user', 'public.task_urgent_count:select');


-- Create table_1 view (2-3 columns, simpler data)
create or replace view public.task_list_simple as
select
    title,
    status,
    priority,
    completion
from tasks
order by created_at desc
limit 10;

revoke all on public.task_list_simple from authenticated, service_role;
grant select on public.task_list_simple to authenticated;

-- Create another table_1 view
create or replace view public.active_tasks_simple as
select
    title,
    priority,
    to_char(due_date, 'MM/DD') as due
from tasks
where status != 'completed'
order by
    case priority
        when 'urgent' then 1
        when 'high' then 2
        when 'medium' then 3
        when 'low' then 4
    end,
    due_date
limit 10;

revoke all on public.active_tasks_simple from authenticated, service_role;
grant select on public.active_tasks_simple to authenticated;

-- Create table_2 view (4-5 columns, detailed data)
create or replace view public.task_list_detailed as
select
    title,
    status,
    priority,
    completion,
    duration,
    to_char(created_at, 'MM/DD HH24:MI') as created,
    case
        when due_date < current_timestamp and status != 'completed' then 'Overdue'
        when due_date is null then '-'
        else to_char(due_date, 'MM/DD')
    end as due
from tasks
order by created_at desc
limit 10;

revoke all on public.task_list_detailed from authenticated, service_role;
grant select on public.task_list_detailed to authenticated;

-- Create another table_2 view
create or replace view public.task_analytics_detailed as
select
    substring(title, 1, 30) || case when length(title) > 30 then '...' else '' end as task,
    status,
    priority,
    completion,
    attachments,
    case
        when tags is not null and array_length(tags, 1) > 0
        then array_to_string(tags[1:2], ', ')
        else '-'
    end as tags,
    to_char(created_at, 'MM/DD') as created
from tasks
order by
    case priority
        when 'urgent' then 1
        when 'high' then 2
        when 'medium' then 3
        when 'low' then 4
    end,
    created_at desc
limit 10;

revoke all on public.task_analytics_detailed from authenticated, service_role;
grant select on public.task_analytics_detailed to authenticated;

comment on view public.task_list_simple is '{"type": "dashboard_widget", "name": "Recent Tasks", "description": "Latest tasks in the system", "widget_type": "table_1"}';
comment on view public.active_tasks_simple is '{"type": "dashboard_widget", "name": "Priority Queue", "description": "Active tasks by priority", "widget_type": "table_1"}';
comment on view public.task_list_detailed is '{"type": "dashboard_widget", "name": "Task Overview", "description": "Detailed task listing", "widget_type": "table_2"}';
comment on view public.task_analytics_detailed is '{"type": "dashboard_widget", "name": "Task Analytics", "description": "Task breakdown with tags", "widget_type": "table_2"}';

-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values
    ('user', 'public.task_list_simple:select'),
    ('user', 'public.active_tasks_simple:select'),
    ('user', 'public.task_list_detailed:select'),
    ('user', 'public.task_analytics_detailed:select');

----------------------------------------------------------------
-- Chart views for tasks
----------------------------------------------------------------

-- Area chart view - Task creation trend over time
create or replace view public.task_trend_area as
select
    to_char(date_trunc('day', created_at), 'Mon DD') as date,
    count(*) filter (where status = 'completed') as completed,
    count(*) filter (where status = 'pending') as pending,
    count(*) filter (where status = 'in_progress') as active
from tasks
where created_at >= current_date - interval '7 days'
group by date_trunc('day', created_at)
order by date_trunc('day', created_at);

revoke all on public.task_trend_area from authenticated, service_role;
grant select on public.task_trend_area to authenticated;

-- Bar chart view - Tasks by priority
create or replace view public.task_priority_bar as
select
    priority as label,
    count(*) as total,
    count(*) filter (where status = 'completed') as completed
from tasks
group by priority
order by
    case priority
        when 'urgent' then 1
        when 'high' then 2
        when 'medium' then 3
        when 'low' then 4
    end;

revoke all on public.task_priority_bar from authenticated, service_role;
grant select on public.task_priority_bar to authenticated;

-- Line chart view - Daily task completion rate
create or replace view public.task_completion_line as
select
    to_char(date_trunc('day', created_at), 'Mon DD') as date,
    count(*) as created,
    count(*) filter (where status = 'completed') as completed
from tasks
where created_at >= current_date - interval '14 days'
group by date_trunc('day', created_at)
order by date_trunc('day', created_at);

revoke all on public.task_completion_line from authenticated, service_role;
grant select on public.task_completion_line to authenticated;

-- Pie chart view - Task status distribution
create or replace view public.task_status_pie as
select
    status as label,
    count(*) as value
from tasks
group by status;

revoke all on public.task_status_pie from authenticated, service_role;
grant select on public.task_status_pie to authenticated;

-- Radar chart view - Task metrics by priority
create or replace view public.task_metrics_radar as
select
    priority as metric,
    count(*) as total,
    count(*) filter (where status = 'completed') as completed,
    count(*) filter (where due_date < current_timestamp and status != 'completed') as overdue
from tasks
group by priority;

revoke all on public.task_metrics_radar from authenticated, service_role;
grant select on public.task_metrics_radar to authenticated;

comment on view public.task_trend_area is '{"type": "chart", "name": "Task Trend Area", "description": "Task creation trend over last 7 days", "chart_type": "area"}';
comment on view public.task_priority_bar is '{"type": "chart", "name": "Task Priority Bar", "description": "Tasks grouped by priority level", "chart_type": "bar"}';
comment on view public.task_completion_line is '{"type": "chart", "name": "Task Completion Line", "description": "Daily task completion over 2 weeks", "chart_type": "line"}';
comment on view public.task_status_pie is '{"type": "chart", "name": "Task Status Pie", "description": "Current task status breakdown", "chart_type": "pie"}';
comment on view public.task_metrics_radar is '{"type": "chart", "name": "Task Metrics Radar", "description": "Task metrics across priorities", "chart_type": "radar"}';

-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values
    ('user', 'public.task_trend_area:select'),
    ('user', 'public.task_priority_bar:select'),
    ('user', 'public.task_completion_line:select'),
    ('user', 'public.task_status_pie:select'),
    ('user', 'public.task_metrics_radar:select');

----------------------------------------------------------------
-- Audit triggers for tasks
----------------------------------------------------------------

create trigger audit_tasks_insert
    after insert
    on public.tasks
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_tasks_update
    after update
    on public.tasks
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_tasks_delete
    before delete
    on public.tasks
    for each row
execute function supasheet.audit_trigger_function();


----------------------------------------------------------------
-- Task Board View 
----------------------------------------------------------------

create or replace view public.task_board_view
with (security_invoker = true) as
select
    status,
    json_agg(json_build_object(
        'pk', json_build_object('id', id),
        'title', title,
        'badge', priority,
        'description', description,
        'date', to_char(due_date, 'YYYY-MM-DD')
    ) order by created_at) as data
from tasks
group by status;

revoke all on public.task_board_view from authenticated, service_role, anon;
grant select on public.task_board_view to authenticated;

insert into supasheet.role_permissions (role, permission) values ('user', 'public.task_board_view:select');


----------------------------------------------------------------
-- Task List View 
----------------------------------------------------------------

create or replace view public.task_list_view
with (security_invoker = true) as
select
    status,
    json_agg(json_build_object(
        'pk', json_build_object('id', id),
        'title', title,
        'badge', priority
    ) order by created_at) as data
from tasks
group by status;

revoke all on public.task_list_view from authenticated, service_role, anon;
grant select on public.task_list_view to authenticated;

insert into supasheet.role_permissions (role, permission) values ('user', 'public.task_list_view:select');


----------------------------------------------------------------
-- Task Calendar View 
----------------------------------------------------------------

create or replace view public.task_calendar_view
with (security_invoker = true) as
select
    json_build_object(
        'id', id
    ) as pk,
    title,
    created_at as start_date,
    -- if due_date is null, set end_date as start_date
    coalesce(due_date, created_at) as end_date,
    description
from tasks;

revoke all on public.task_calendar_view from authenticated, service_role, anon;
grant select on public.task_calendar_view to authenticated;

insert into supasheet.role_permissions (role, permission) values ('user', 'public.task_calendar_view:select');