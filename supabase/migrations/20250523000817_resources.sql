-- Resource type enum
create type public.resource_type as enum ('table', 'view');

-- Resources table
create table if not exists
    public.resources
(
    id          text not null,
    name        text not null,
    description text,
    grp         text not null,
    type        public.resource_type not null,
    icon        text,
    primary key (id)
);

-- Enable RLS on the resources table
alter table "public"."resources"
    enable row level security;

-- revoke all privileges on the resources table
revoke all on table "public"."resources" from authenticated, service_role;

-- Open up access to resources
grant select on table public.resources to authenticated, service_role;
