create type user_status as enum('active', 'inactive', 'pending');
create type user_role as enum('admin', 'user', 'moderator');
create type user_department as enum('engineering', 'marketing', 'sales', 'design', 'operations', 'hr', 'finance', 'product');
create type user_skill as enum('security', 'swift', 'kotlin', 'devops', 'javascript', 'rust', 'php', 'sql', 'nosql', 'cloud', 'java', 'go');


alter type supasheet.app_permission add value 'public.user_details:select';
alter type supasheet.app_permission add value 'public.user_details:insert';
alter type supasheet.app_permission add value 'public.user_details:update';
alter type supasheet.app_permission add value 'public.user_details:delete';
