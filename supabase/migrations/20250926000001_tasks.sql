CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'pending',
    priority task_priority DEFAULT 'medium',

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
