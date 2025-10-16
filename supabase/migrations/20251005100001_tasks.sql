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

comment on table public.tasks is '{"icon": "ListTodo", "display": "block", "items": [{"view": "task_calendar_view", "type": "calendar"}, {"view": "task_kanban_view", "type": "kanban"}, {"view": "task_list_view", "type": "list"}, {"view": "task_gantt_view", "type": "gantt"}]}';

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
create or replace view reports.task_report
with(security_invoker = true) as
select
    a.name as account_name,
    t.*
from tasks t
join supasheet.accounts a on t.account_id = a.id;

-- grant select on view to authenticated
revoke all on reports.task_report from authenticated, service_role;
grant select on reports.task_report to authenticated;


create or replace view dashboards.task_summary
with(security_invoker = true) as
select
    count(*) as value,
    'list-todo' as icon,
    'active tasks' as label
from tasks t
where t.status != 'completed';

revoke all on dashboards.task_summary from authenticated, service_role;
grant select on dashboards.task_summary to authenticated;


insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.tasks:delete');

insert into supasheet.role_permissions (role, permission) values ('user', 'public.user_tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'reports.task_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'dashboards.task_summary:select');

insert into supasheet.reports (name, description, "group", view_name, filter_field, is_active) values
('Task Report', 'Report of all tasks with account names', 'tasks', 'task_report', 'created_at', true);

insert into supasheet.dashboards (name, description, "group", widget_type, view_name, is_active) values
('Task Summary', 'Summary of active tasks', 'tasks', 'card_1', 'task_summary', true);


----------------------------------------------------------------
-- Dashboard widget views for tasks
----------------------------------------------------------------

-- View for task completion rate (Card2 - split layout)
create or replace view dashboards.task_completion_rate as
select
    count(*) filter (where status = 'completed') as primary,
    count(*) filter (where status != 'completed') as secondary,
    'Completed' as primary_label,
    'Active' as secondary_label
from tasks t;

revoke all on dashboards.task_completion_rate from authenticated, service_role;
grant select on dashboards.task_completion_rate to authenticated;

-- View for completed tasks stats (Card3 - value and percent layout)
create or replace view dashboards.tasks_by_status as
select
    count(*) filter (where status = 'completed') as value,
    case
        when count(*) > 0
        then round((count(*) filter (where status = 'completed')::numeric / count(*)::numeric) * 100, 1)
        else 0
    end as percent
from tasks t;

revoke all on dashboards.tasks_by_status from authenticated, service_role;
grant select on dashboards.tasks_by_status to authenticated;

-- View for task progress with breakdown (Card4 - progress layout)
create or replace view dashboards.task_urgent_count as
select
    count(*) filter (where status != 'completed' and priority in ('high', 'urgent')) as current,
    count(*) filter (where status != 'completed') as total,
    json_build_array(
        json_build_object('label', 'Urgent', 'value', count(*) filter (where priority = 'urgent' and status != 'completed')),
        json_build_object('label', 'High', 'value', count(*) filter (where priority = 'high' and status != 'completed')),
        json_build_object('label', 'Overdue', 'value', count(*) filter (where due_date < current_timestamp and status != 'completed'))
    ) as segments
from tasks;


revoke all on dashboards.task_urgent_count from authenticated, service_role;
grant select on dashboards.task_urgent_count to authenticated;

-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values
    ('user', 'dashboards.task_completion_rate:select'),
    ('user', 'dashboards.tasks_by_status:select'),
    ('user', 'dashboards.task_urgent_count:select');

-- Insert dashboard widget entries
insert into supasheet.dashboards (name, description, caption, "group", widget_type, view_name, is_active) values
    ('Task Overview', 'Completed vs Active tasks', '', 'tasks', 'card_2', 'task_completion_rate', true),
    ('Status Breakdown', 'Tasks by current status', 'Completed Tasks', 'tasks', 'card_3', 'tasks_by_status', true),
    ('Priority Alert', 'High priority items', '', 'tasks', 'card_4', 'task_urgent_count', true);



-- Create table_1 view (2-3 columns, simpler data)
create or replace view dashboards.task_list_simple as
select
    title,
    status,
    priority,
    completion
from tasks
order by created_at desc
limit 10;

revoke all on dashboards.task_list_simple from authenticated, service_role;
grant select on dashboards.task_list_simple to authenticated;

-- Create another table_1 view
create or replace view dashboards.active_tasks_simple as
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

revoke all on dashboards.active_tasks_simple from authenticated, service_role;
grant select on dashboards.active_tasks_simple to authenticated;

-- Create table_2 view (4-5 columns, detailed data)
create or replace view dashboards.task_list_detailed as
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

revoke all on dashboards.task_list_detailed from authenticated, service_role;
grant select on dashboards.task_list_detailed to authenticated;

-- Create another table_2 view
create or replace view dashboards.task_analytics_detailed as
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

revoke all on dashboards.task_analytics_detailed from authenticated, service_role;
grant select on dashboards.task_analytics_detailed to authenticated;

-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values
    ('user', 'dashboards.task_list_simple:select'),
    ('user', 'dashboards.active_tasks_simple:select'),
    ('user', 'dashboards.task_list_detailed:select'),
    ('user', 'dashboards.task_analytics_detailed:select');

-- Insert dashboard widget entries for new tables
insert into supasheet.dashboards (name, description, caption, "group", widget_type, view_name, is_active) values
    ('Recent Tasks', 'Latest tasks in the system', 'Last 10 tasks', 'tasks', 'table_1', 'task_list_simple', true),
    ('Priority Queue', 'Active tasks by priority', 'Next 10 items', 'tasks', 'table_1', 'active_tasks_simple', true),
    ('Task Overview', 'Detailed task listing', 'Recent activity', 'tasks', 'table_2', 'task_list_detailed', true),
    ('Task Analytics', 'Task breakdown with tags', 'Priority sorted', 'tasks', 'table_2', 'task_analytics_detailed', true);


----------------------------------------------------------------
-- Chart views for tasks
----------------------------------------------------------------

-- Area chart view - Task creation trend over time
create or replace view charts.task_trend_area as
select
    to_char(date_trunc('day', created_at), 'Mon DD') as date,
    count(*) filter (where status = 'completed') as completed,
    count(*) filter (where status = 'pending') as pending,
    count(*) filter (where status = 'in_progress') as active
from tasks
where created_at >= current_date - interval '7 days'
group by date_trunc('day', created_at)
order by date_trunc('day', created_at);

revoke all on charts.task_trend_area from authenticated, service_role;
grant select on charts.task_trend_area to authenticated;

-- Bar chart view - Tasks by priority
create or replace view charts.task_priority_bar as
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

revoke all on charts.task_priority_bar from authenticated, service_role;
grant select on charts.task_priority_bar to authenticated;

-- Line chart view - Daily task completion rate
create or replace view charts.task_completion_line as
select
    to_char(date_trunc('day', created_at), 'Mon DD') as date,
    count(*) as created,
    count(*) filter (where status = 'completed') as completed
from tasks
where created_at >= current_date - interval '14 days'
group by date_trunc('day', created_at)
order by date_trunc('day', created_at);

revoke all on charts.task_completion_line from authenticated, service_role;
grant select on charts.task_completion_line to authenticated;

-- Pie chart view - Task status distribution
create or replace view charts.task_status_pie as
select
    status as label,
    count(*) as value
from tasks
group by status;

revoke all on charts.task_status_pie from authenticated, service_role;
grant select on charts.task_status_pie to authenticated;

-- Radar chart view - Task metrics by priority
create or replace view charts.task_metrics_radar as
select
    priority as metric,
    count(*) as total,
    count(*) filter (where status = 'completed') as completed,
    count(*) filter (where due_date < current_timestamp and status != 'completed') as overdue
from tasks
group by priority;

revoke all on charts.task_metrics_radar from authenticated, service_role;
grant select on charts.task_metrics_radar to authenticated;

-- Grant permissions to user role
insert into supasheet.role_permissions (role, permission) values
    ('user', 'charts.task_trend_area:select'),
    ('user', 'charts.task_priority_bar:select'),
    ('user', 'charts.task_completion_line:select'),
    ('user', 'charts.task_status_pie:select'),
    ('user', 'charts.task_metrics_radar:select');

-- Insert dashboard widget entries for charts
insert into supasheet.charts (name, description, caption, "group", chart_type, view_name, is_active) values
    ('Task Trend', 'Task creation trend over last 7 days', '', 'tasks', 'area', 'task_trend_area', true),
    ('Priority Breakdown', 'Tasks grouped by priority level', '', 'tasks', 'bar', 'task_priority_bar', true),
    ('Completion Rate', 'Daily task completion over 2 weeks', '', 'tasks', 'line', 'task_completion_line', true),
    ('Status Distribution', 'Current task status breakdown', '', 'tasks', 'pie', 'task_status_pie', true),
    ('Priority Metrics', 'Task metrics across priorities', '', 'tasks', 'radar', 'task_metrics_radar', true);


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
