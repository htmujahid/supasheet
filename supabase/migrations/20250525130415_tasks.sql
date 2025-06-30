
insert into public.resources (id, name, description, grp, type, icon) values ('tasks', 'Tasks', 'Tasks', 'Public', 'table', 'tasks');

create domain task_code as text;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  code task_code not null unique,
  title varchar(255),
  status task_status not null default 'todo',
  label task_label not null default 'bug',
  priority task_priority not null default 'low',
  estimated_hours real not null default 0,
  archived boolean not null default false,
  account_id uuid  references public.accounts(id) on delete cascade not null,
  start_date timestamp without time zone not null default now(),
  due_date timestamp without time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.tasks enable row level security;

revoke all on table public.tasks from authenticated, service_role;

grant select, insert, update, delete on table public.tasks to authenticated, service_role;

insert into public.role_permissions (role, permission) values ('admin', 'tasks');
insert into public.role_permissions (role, permission) values ('admin', 'tasks:select');
insert into public.role_permissions (role, permission) values ('admin', 'tasks:insert');
insert into public.role_permissions (role, permission) values ('admin', 'tasks:update');
insert into public.role_permissions (role, permission) values ('admin', 'tasks:delete');

insert into public.role_permissions (role, permission) values ('user', 'tasks');
insert into public.role_permissions (role, permission) values ('user', 'tasks:select');
insert into public.role_permissions (role, permission) values ('user', 'tasks:insert');
insert into public.role_permissions (role, permission) values ('user', 'tasks:update');
insert into public.role_permissions (role, permission) values ('user', 'tasks:delete');

create policy "User can view their own tasks" on public.tasks for select using (
  (select (public.has_permission('tasks:select')))
);

create policy "User can insert their own tasks" on public.tasks for insert with check (
  (select (public.has_permission('tasks:insert')))
);

create policy "User can update their own tasks" on public.tasks for update using (
  (select (public.has_permission('tasks:update')))
);

create policy "User can delete their own tasks" on public.tasks for delete using (
  (select (public.has_permission('tasks:delete')))
);
