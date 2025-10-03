
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