create schema if not exists blog;

grant usage on schema blog to authenticated;

begin;
alter type supasheet.app_permission add value 'blog.authors:select';
alter type supasheet.app_permission add value 'blog.authors:insert';
alter type supasheet.app_permission add value 'blog.authors:update';
alter type supasheet.app_permission add value 'blog.authors:delete';

alter type supasheet.app_permission add value 'blog.social_links:select';
alter type supasheet.app_permission add value 'blog.social_links:insert';
alter type supasheet.app_permission add value 'blog.social_links:update';
alter type supasheet.app_permission add value 'blog.social_links:delete';

alter type supasheet.app_permission add value 'blog.categories:select';
alter type supasheet.app_permission add value 'blog.categories:insert';
alter type supasheet.app_permission add value 'blog.categories:update';
alter type supasheet.app_permission add value 'blog.categories:delete';

alter type supasheet.app_permission add value 'blog.posts:select';
alter type supasheet.app_permission add value 'blog.posts:insert';
alter type supasheet.app_permission add value 'blog.posts:update';
alter type supasheet.app_permission add value 'blog.posts:delete';
commit;

create table if not exists blog.authors (
    account_id uuid default auth.uid() references supasheet.accounts(id) on delete cascade,
    language varchar(2) default 'en' not null,
    country varchar(2) default 'US' not null,
    primary key (account_id)
);

comment on table blog.authors is
'{
    "icon": "UserPen"
}';

revoke all on table blog.authors from authenticated, service_role;

grant select, insert, update, delete on table blog.authors to authenticated;

alter table blog.authors enable row level security;

create policy "Authors can select their own author profile or "

create table if not exists blog.social_links (
    author_id uuid references blog.authors(account_id) on delete cascade,
    github varchar(255),
    twitter varchar(255),
    primary key (author_id)
);

comment on table blog.social_links is
'{
    "display": "none"
}';

create table if not exists blog.categories (
    id serial primary key,
    name varchar(100) not null,
    slug varchar(120) not null unique,
    description text
);

comment on table blog.categories is
'{
    "icon": "ListCollapse"
}';


create table if not exists blog.posts (
    id serial primary key,
    author_id uuid references blog.authors(account_id) on delete set null,
    category_id int references blog.categories(id) on delete set null,
    title varchar(255) not null,
    slug varchar(275) not null unique,
    content text not null,
    published_at timestamp with time zone default null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

comment on table blog.posts is
'{
    "icon": "NotebookText"
}';

insert into supasheet.role_permissions (role, permission) values
    ('user', 'blog.authors:select'),
    ('user', 'blog.authors:insert'),
    ('user', 'blog.authors:update'),
    ('user', 'blog.authors:delete'),

    ('user', 'blog.social_links:select'),
    ('user', 'blog.social_links:insert'),
    ('user', 'blog.social_links:update'),
    ('user', 'blog.social_links:delete'),

    ('user', 'blog.categories:select'),
    ('user', 'blog.categories:insert'),
    ('user', 'blog.categories:update'),
    ('user', 'blog.categories:delete'),

    ('user', 'blog.posts:select'),
    ('user', 'blog.posts:insert'),
    ('user', 'blog.posts:update'),
    ('user', 'blog.posts:delete');