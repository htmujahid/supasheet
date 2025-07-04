insert into public.resources (id, name, description, grp, type, icon) values ('task_view', 'Tasks View', 'Tasks View', 'Public', 'view', 'tasks');
insert into public.resources (id, name, description, grp, type, icon) values ('task_summary_view', 'Task Summary View', 'Task Summary View', 'Public', 'view', 'tasks');

insert into public.role_permissions (role, permission) values ('admin', 'task_view');
insert into public.role_permissions (role, permission) values ('admin', 'task_summary_view');

insert into public.role_permissions (role, permission) values ('user', 'task_view');
insert into public.role_permissions (role, permission) values ('user', 'task_summary_view');

-- Create a comprehensive task view with calculated fields and account information
create or replace view public.task_view as
select 
  t.id,
  t.code,
  t.title,
  t.status,
  t.label,
  t.priority,
  t.estimated_hours,
  t.archived,
  t.account_id,
  a.email as account_email,
  a.name as account_name,
  t.start_date,
  t.due_date,
  t.created_at,
  t.updated_at,
  
  -- Calculated fields
  case 
    when t.status = 'done' then 'completed'
    when t.status = 'canceled' then 'canceled'
    when t.due_date < now() and t.status not in ('done', 'canceled') then 'overdue'
    when t.due_date::date = now()::date and t.status not in ('done', 'canceled') then 'due_today'
    when t.due_date::date = (now() + interval '1 day')::date and t.status not in ('done', 'canceled') then 'due_tomorrow'
    when t.due_date < (now() + interval '7 days') and t.status not in ('done', 'canceled') then 'due_soon'
    else 'on_track'
  end as urgency_status,
  
  case 
    when t.priority = 'high' then 3
    when t.priority = 'medium' then 2
    when t.priority = 'low' then 1
  end as priority_score,
  
  case 
    when t.status = 'todo' then 1
    when t.status = 'in-progress' then 2
    when t.status = 'done' then 3
    when t.status = 'canceled' then 0
  end as status_order,
  
  -- Date calculations
  extract(epoch from (t.due_date - t.start_date)) / 3600 as duration_hours,
  extract(epoch from (t.due_date - now())) / 86400 as days_until_due,
  extract(epoch from (now() - t.created_at)) / 86400 as days_since_created,
  
  -- Overdue calculation
  case 
    when t.due_date < now() and t.status not in ('done', 'canceled') 
    then extract(epoch from (now() - t.due_date)) / 86400
    else 0
  end as days_overdue

from public.tasks t
left join public.accounts a on t.account_id = a.id
where not t.archived;

-- Grant permissions on the view
grant select on public.task_view to authenticated, service_role;

-- Create indexes for better view performance
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_priority on public.tasks(priority);
create index if not exists idx_tasks_due_date on public.tasks(due_date);
create index if not exists idx_tasks_account_id on public.tasks(account_id);
create index if not exists idx_tasks_archived on public.tasks(archived);

-- Create a summary view for dashboard metrics
create or replace view public.task_summary_view as
select 
  count(*) as total_tasks,
  count(*) filter (where status = 'todo') as todo_count,
  count(*) filter (where status = 'in-progress') as in_progress_count,
  count(*) filter (where status = 'done') as done_count,
  count(*) filter (where status = 'canceled') as canceled_count,
  
  count(*) filter (where priority = 'high') as high_priority_count,
  count(*) filter (where priority = 'medium') as medium_priority_count,
  count(*) filter (where priority = 'low') as low_priority_count,
  
  count(*) filter (where label = 'bug') as bug_count,
  count(*) filter (where label = 'feature') as feature_count,
  count(*) filter (where label = 'enhancement') as enhancement_count,
  count(*) filter (where label = 'documentation') as documentation_count,
  
  count(*) filter (where due_date < now() and status not in ('done', 'canceled')) as overdue_count,
  count(*) filter (where due_date::date = now()::date and status not in ('done', 'canceled')) as due_today_count,
  count(*) filter (where due_date::date = (now() + interval '1 day')::date and status not in ('done', 'canceled')) as due_tomorrow_count,
  
  sum(estimated_hours) as total_estimated_hours,
  sum(estimated_hours) filter (where status = 'done') as completed_hours,
  sum(estimated_hours) filter (where status in ('todo', 'in-progress')) as remaining_hours

from public.tasks 
where not archived;

-- Grant permissions on the summary view
grant select on public.task_summary_view to authenticated, service_role;
