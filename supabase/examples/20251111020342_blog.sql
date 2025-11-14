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

alter type supasheet.app_permission add value 'blog.post_categories:select';
alter type supasheet.app_permission add value 'blog.post_categories:insert';
alter type supasheet.app_permission add value 'blog.post_categories:update';
alter type supasheet.app_permission add value 'blog.post_categories:delete';
commit;

create table if not exists blog.authors (
    id uuid default gen_random_uuid() primary key,
    account_id uuid default auth.uid() references supasheet.accounts(id) on delete cascade,
    language varchar(2) default 'en' not null,
    country varchar(2) default 'US' not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    unique (account_id, language, country)
);

comment on table blog.authors is
'{
    "icon": "UserPen"
}';

revoke all on table blog.authors from authenticated, service_role;

grant select, insert, update, delete on table blog.authors to authenticated;

alter table blog.authors enable row level security;

create policy "Authors can select their own author profile" on blog.authors for select using (
    account_id = auth.uid()
);

create policy "Authors can insert their own author profile" on blog.authors for insert with check (
    account_id = auth.uid()
);

create policy "Authors can update their own author profile" on blog.authors for update using (
    account_id = auth.uid()
) with check (
    account_id = auth.uid()
);

create policy "Authors can delete their own author profile" on blog.authors for delete using (
    account_id = auth.uid()
);

create table if not exists blog.social_links (
    author_id uuid references blog.authors(id) on delete cascade,
    github varchar(255),
    twitter varchar(255),
    primary key (author_id)
);

comment on table blog.social_links is
'{
    "display": "none"
}';

revoke all on table blog.social_links from authenticated, service_role;

grant select, insert, update, delete on table blog.social_links to authenticated;

alter table blog.social_links enable row level security;

create policy "Authors can select their own social links" on blog.social_links for select using (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
);

create policy "Authors can insert their own social links" on blog.social_links for insert with check (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
);

create policy "Authors can update their own social links" on blog.social_links for update using (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
) with check (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
);

create policy "Authors can delete their own social links" on blog.social_links for delete using (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
);

create table if not exists blog.categories (
    id uuid default gen_random_uuid() primary key,
    name varchar(100) not null,
    slug varchar(120) not null unique,
    description text,
    account_id uuid references supasheet.accounts(id) on delete cascade
);

comment on table blog.categories is
'{
    "icon": "ListCollapse"
}';

revoke all on table blog.categories from authenticated, service_role;

grant select, insert, update, delete on table blog.categories to authenticated;

alter table blog.categories enable row level security;

create policy "Users can select all blog categories" on blog.categories for select using (
    (account_id is null OR account_id = auth.uid())
);

create policy "Users can insert blog categories" on blog.categories for insert with check (
    account_id = auth.uid()
);

create table if not exists blog.posts (
    id uuid default gen_random_uuid() primary key,
    author_id uuid references blog.authors(id) on delete cascade,
    title varchar(255) not null,
    slug varchar(275) not null unique,
    content RICH_TEXT not null,
    published_at timestamp with time zone default null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

comment on table blog.posts is
'{
    "icon": "NotebookText"
}';

revoke all on table blog.posts from authenticated, service_role;

grant select, insert, update, delete on table blog.posts to authenticated;

alter table blog.posts enable row level security;

create policy "Users can select all blog posts" on blog.posts for select using (
    exists (
        select 1 from blog.authors a where a.id = author_id
    ) OR published_at is not null
);

create policy "Authors can insert their own blog posts" on blog.posts for insert with check (
    exists (
        select 1 from blog.authors a
        where a.account_id = auth.uid() and a.id = author_id
    )
);

create policy "Authors can update their own blog posts" on blog.posts for update using (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
) with check (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
);

create policy "Authors can delete their own blog posts" on blog.posts for delete using (
    exists (
        select 1 from blog.authors a where a.id = author_id
    )
);

create table if not exists blog.post_categories (
    post_id uuid references blog.posts(id) on delete cascade,
    category_id uuid references blog.categories(id) on delete cascade,
    primary key (post_id, category_id)
);

comment on table blog.post_categories is
'{
    "display": "none"
}';

revoke all on table blog.post_categories from authenticated, service_role;

grant select, insert, delete on table blog.post_categories to authenticated;

alter table blog.post_categories enable row level security;

create policy "Users can select all post categories" on blog.post_categories for select using (
    true
);

create policy "Authors can insert post categories for their own posts" on blog.post_categories for insert with check (
    exists (
        select 1 from blog.posts p where p.id = post_id
    )
);

create policy "Authors can delete post categories for their own posts" on blog.post_categories for delete using (
    exists (
        select 1 from blog.posts p where p.id = post_id
    )
);

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
    ('user', 'blog.posts:delete'),
    
    ('user', 'blog.post_categories:select'),
    ('user', 'blog.post_categories:insert'),
    ('user', 'blog.post_categories:delete');