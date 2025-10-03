-- Create additional dashboard views for task statistics (simple, focused metrics)

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