-- Create chart widget views for dashboard

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