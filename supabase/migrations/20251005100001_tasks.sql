CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',
    cover FILE,

    -- User association
    account_id UUID REFERENCES supasheet.accounts(id) ON DELETE CASCADE,
    
    -- Dates
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Organization
    tags TEXT[],
    is_important BOOLEAN DEFAULT false,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

comment on column tasks.cover is '{"accept":"image/*"}';

revoke all on table tasks from authenticated, service_role;

grant select, insert, update, delete on table tasks to authenticated;

create index idx_tasks_account_id on tasks (account_id);
create index idx_tasks_status on tasks (status);
create index idx_tasks_priority on tasks (priority);

alter table tasks enable row level security;

create policy tasks_select on tasks
    for all
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('supasheet.accounts:select'));

create policy tasks_insert on tasks
    for insert
    to authenticated
    with check (supasheet.has_permission('supasheet.accounts:insert'));

create policy tasks_update on tasks
    for update
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('supasheet.accounts:update'))
    with check (account_id = auth.uid() and supasheet.has_permission('supasheet.accounts:update'));

create policy tasks_delete on tasks
    for delete
    to authenticated
    using (account_id = auth.uid() and supasheet.has_permission('supasheet.accounts:delete'));


-- create a view of tasks with account name
create or replace view public.vw_tasks 
with(security_invoker = true) as
select
    a.name as account_name,
    t.*
from tasks t
join supasheet.accounts a on t.account_id = a.id;

-- grant select on view to authenticated
revoke all on public.vw_tasks from authenticated, service_role;
grant select on public.vw_tasks to authenticated;


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

insert into supasheet.role_permissions (role, permission) values ('user', 'public.vw_tasks:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'reports.task_report:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'dashboards.task_summary:select');

insert into supasheet.reports (name, description, "group", view_name, filter_field, is_active) values
('Task Report', 'Report of all tasks with account names', 'Tasks', 'task_report', 'created_at', true);

insert into supasheet.dashboards (name, description, "group", widget_type, view_name, is_active) values
('Task Summary', 'Summary of active tasks', 'Tasks', 'card_1', 'task_summary', true);


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
    count(*) filter (where status != 'completed' and priority IN ('high', 'urgent')) as current,
    count(*) filter (where status != 'completed') as total,
    json_build_array(
        json_build_object('label', 'Urgent', 'value', count(*) filter (where priority = 'urgent' and status != 'completed')),
        json_build_object('label', 'High', 'value', count(*) filter (where priority = 'high' and status != 'completed')),
        json_build_object('label', 'Overdue', 'value', count(*) filter (where due_date < CURRENT_TIMESTAMP and status != 'completed'))
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
    ('Task Overview', 'Completed vs Active tasks', '', 'Tasks', 'card_2', 'task_completion_rate', true),
    ('Status Breakdown', 'Tasks by current status', 'Completed Tasks', 'Tasks', 'card_3', 'tasks_by_status', true),
    ('Priority Alert', 'High priority items', '', 'Tasks', 'card_4', 'task_urgent_count', true);



-- Create table_1 view (2-3 columns, simpler data)
create or replace view dashboards.task_list_simple as
select
    title,
    status,
    priority
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
    to_char(created_at, 'MM/DD HH24:MI') as created,
    CASE 
        WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 'Overdue'
        WHEN due_date IS NULL THEN '-'
        ELSE to_char(due_date, 'MM/DD')
    END as due
from tasks
order by created_at desc
limit 10;

revoke all on dashboards.task_list_detailed from authenticated, service_role;
grant select on dashboards.task_list_detailed to authenticated;

-- Create another table_2 view
create or replace view dashboards.task_analytics_detailed as
select
    substring(title, 1, 30) || CASE WHEN length(title) > 30 THEN '...' ELSE '' END as task,
    status,
    priority,
    CASE 
        WHEN tags IS NOT NULL AND array_length(tags, 1) > 0 
        THEN array_to_string(tags[1:2], ', ')
        ELSE '-'
    END as tags,
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
    ('Recent Tasks', 'Latest tasks in the system', 'Last 10 tasks', 'Tasks', 'table_1', 'task_list_simple', true),
    ('Priority Queue', 'Active tasks by priority', 'Next 10 items', 'Tasks', 'table_1', 'active_tasks_simple', true),
    ('Task Overview', 'Detailed task listing', 'Recent activity', 'Tasks', 'table_2', 'task_list_detailed', true),
    ('Task Analytics', 'Task breakdown with tags', 'Priority sorted', 'Tasks', 'table_2', 'task_analytics_detailed', true);


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
where created_at >= CURRENT_DATE - INTERVAL '7 days'
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
where created_at >= CURRENT_DATE - INTERVAL '14 days'
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
    count(*) filter (where due_date < CURRENT_TIMESTAMP and status != 'completed') as overdue
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
    ('Task Trend', 'Task creation trend over last 7 days', '', 'Tasks', 'area', 'task_trend_area', true),
    ('Priority Breakdown', 'Tasks grouped by priority level', '', 'Tasks', 'bar', 'task_priority_bar', true),
    ('Completion Rate', 'Daily task completion over 2 weeks', '', 'Tasks', 'line', 'task_completion_line', true),
    ('Status Distribution', 'Current task status breakdown', '', 'Tasks', 'pie', 'task_status_pie', true),
    ('Priority Metrics', 'Task metrics across priorities', '', 'Tasks', 'radar', 'task_metrics_radar', true);


----------------------------------------------------------------
-- Audit triggers for tasks
----------------------------------------------------------------

CREATE TRIGGER audit_tasks_insert
    AFTER INSERT
    ON public.tasks
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_tasks_update
    AFTER UPDATE
    ON public.tasks
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();

CREATE TRIGGER audit_tasks_delete
    BEFORE DELETE
    ON public.tasks
    FOR EACH ROW
EXECUTE FUNCTION supasheet.audit_trigger_function();
