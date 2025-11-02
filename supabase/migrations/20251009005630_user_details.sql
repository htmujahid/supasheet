-- Create user_details table
create table if not exists public.user_details (
  avatar AVATAR,
  id bigint primary key generated always as identity,
  name varchar(64) not null,
  email EMAIL not null unique,
  phone TEL,
  website URL,
  status user_status not null default 'active',
  verified boolean not null default false,
  role user_role not null default 'user',
  department user_department,
  created_by uuid references supasheet.accounts(id) on delete cascade,
  salary money,
  rating RATING,
  projects integer default 0,
  skills user_skill[],
  join_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active time,
  notes text
);

comment on table public.user_details is 
'{
  "icon": "UsersRound",
  "primaryItem": "sheet",
  "items": [
    {"id":"sheet","name":"Sheet View","type":"sheet"}
  ]
}';

-- Create indexes for common queries
create index if not exists user_details_email_idx on public.user_details(email);
create index if not exists user_details_status_idx on public.user_details(status);
create index if not exists user_details_role_idx on public.user_details(role);
create index if not exists user_details_department_idx on public.user_details(department);
create index if not exists user_details_created_at_idx on public.user_details(created_at);

-- Enable Row Level Security
alter table public.user_details enable row level security;

-- RLS Policies
create policy "Allow authenticated users to view all user details"
  on public.user_details
  for select
  to authenticated
  using (true);

create policy "Allow authenticated users to insert user details"
  on public.user_details
  for insert
  to authenticated
  with check (true);

create policy "Allow authenticated users to update user details"
  on public.user_details
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Allow authenticated users to delete user details"
  on public.user_details
  for delete
  to authenticated
  using (true);

insert into supasheet.role_permissions (role, permission) values ('user', 'public.user_details:select');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.user_details:insert');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.user_details:update');
insert into supasheet.role_permissions (role, permission) values ('user', 'public.user_details:delete');
