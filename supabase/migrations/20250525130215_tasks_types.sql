create type public.task_status as enum ('todo', 'in-progress', 'done', 'canceled');
create type public.task_label as enum ('bug', 'feature', 'enhancement', 'documentation');
create type public.task_priority as enum ('low', 'medium', 'high');

alter type public.app_permission add value 'tasks';
alter type public.app_permission add value 'tasks:select';
alter type public.app_permission add value 'tasks:insert';
alter type public.app_permission add value 'tasks:update';
alter type public.app_permission add value 'tasks:delete';
