create schema if not exists store;

grant usage on schema store to authenticated;

begin;
create type store.product_status as enum ('active', 'draft', 'archived', 'out_of_stock');
create type store.order_status as enum ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- Product permissions
alter type supasheet.app_permission add value 'store.products:select';
alter type supasheet.app_permission add value 'store.products:insert';
alter type supasheet.app_permission add value 'store.products:update';
alter type supasheet.app_permission add value 'store.products:delete';

-- Order permissions
alter type supasheet.app_permission add value 'store.orders:select';
alter type supasheet.app_permission add value 'store.orders:insert';
alter type supasheet.app_permission add value 'store.orders:update';
alter type supasheet.app_permission add value 'store.orders:delete';

-- Order items permissions
alter type supasheet.app_permission add value 'store.order_items:select';
alter type supasheet.app_permission add value 'store.order_items:insert';
alter type supasheet.app_permission add value 'store.order_items:update';
alter type supasheet.app_permission add value 'store.order_items:delete';

-- Widget / report / chart permissions
alter type supasheet.app_permission add value 'store.order_report:select';
alter type supasheet.app_permission add value 'store.revenue_summary:select';
alter type supasheet.app_permission add value 'store.order_completion_rate:select';
alter type supasheet.app_permission add value 'store.orders_by_status:select';
alter type supasheet.app_permission add value 'store.low_stock_count:select';
alter type supasheet.app_permission add value 'store.recent_orders:select';
alter type supasheet.app_permission add value 'store.top_products:select';
alter type supasheet.app_permission add value 'store.orders_status_pie:select';
alter type supasheet.app_permission add value 'store.revenue_line:select';
alter type supasheet.app_permission add value 'store.product_category_bar:select';
alter type supasheet.app_permission add value 'store.order_metrics_radar:select';
commit;


----------------------------------------------------------------
-- Products table
----------------------------------------------------------------

create table store.products (
    id uuid primary key default extensions.uuid_generate_v4(),
    name varchar(500) not null,
    description RICH_TEXT,
    price numeric(10, 2) not null default 0,
    stock integer not null default 0,
    status store.product_status default 'draft',
    category varchar(100),
    image file,

    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

comment on column store.products.status is
'{
    "progress": false,
    "enums": {
        "active": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "draft": {
            "variant": "outline",
            "icon": "FileEdit"
        },
        "archived": {
            "variant": "secondary",
            "icon": "Archive"
        },
        "out_of_stock": {
            "variant": "destructive",
            "icon": "PackageX"
        }
    }
}';

comment on table store.products is
'{
    "icon": "Package",
    "display": "block",
    "query": {
        "sort": [{"id": "name", "desc": false}]
    },
    "items": [
        {"id": "gallery", "name": "Product Gallery", "type": "gallery", "cover": "image", "title": "name", "description": "description", "badge": "status"}
    ]
}';

comment on column store.products.image is '{"accept": "image/*"}';

revoke all on table store.products from authenticated, service_role;
grant select, insert, update, delete on table store.products to authenticated;

create index idx_store_products_status on store.products (status);
create index idx_store_products_category on store.products (category);

alter table store.products enable row level security;

create policy products_select on store.products
    for select to authenticated
    using (supasheet.has_permission('store.products:select'));

create policy products_insert on store.products
    for insert to authenticated
    with check (supasheet.has_permission('store.products:insert'));

create policy products_update on store.products
    for update to authenticated
    using (supasheet.has_permission('store.products:update'))
    with check (supasheet.has_permission('store.products:update'));

create policy products_delete on store.products
    for delete to authenticated
    using (supasheet.has_permission('store.products:delete'));


----------------------------------------------------------------
-- Orders table
----------------------------------------------------------------

create table store.orders (
    id uuid primary key default extensions.uuid_generate_v4(),
    user_id uuid default auth.uid() references supasheet.users(id) on delete cascade,
    status store.order_status default 'pending',
    total numeric(10, 2) not null default 0,
    notes text,

    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
);

comment on column store.orders.status is
'{
    "progress": true,
    "enums": {
        "pending": {
            "variant": "warning",
            "icon": "Clock"
        },
        "processing": {
            "variant": "info",
            "icon": "Loader"
        },
        "shipped": {
            "variant": "info",
            "icon": "Truck"
        },
        "delivered": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "cancelled": {
            "variant": "destructive",
            "icon": "XCircle"
        },
        "refunded": {
            "variant": "outline",
            "icon": "RotateCcw"
        }
    }
}';

comment on table store.orders is
'{
    "icon": "ShoppingCart",
    "display": "block",
    "query": {
        "sort": [{"id": "created_at", "desc": true}],
        "join": [{"table": "users", "on": "user_id", "columns": ["name", "email"]}]
    },
    "items": [
        {"id": "status", "name": "Orders By Status", "type": "kanban", "group": "status", "title": "id", "description": "notes", "date": "created_at", "badge": "status"}
    ]
}';

revoke all on table store.orders from authenticated, service_role;
grant select, insert, update, delete on table store.orders to authenticated;

create index idx_store_orders_user_id on store.orders (user_id);
create index idx_store_orders_status on store.orders (status);

alter table store.orders enable row level security;

create policy orders_select on store.orders
    for select to authenticated
    using (supasheet.has_permission('store.orders:select'));

create policy orders_insert on store.orders
    for insert to authenticated
    with check (supasheet.has_permission('store.orders:insert'));

create policy orders_update on store.orders
    for update to authenticated
    using (supasheet.has_permission('store.orders:update'))
    with check (supasheet.has_permission('store.orders:update'));

create policy orders_delete on store.orders
    for delete to authenticated
    using (supasheet.has_permission('store.orders:delete'));


----------------------------------------------------------------
-- Order items table
----------------------------------------------------------------

create table store.order_items (
    id uuid primary key default extensions.uuid_generate_v4(),
    order_id uuid not null references store.orders(id) on delete cascade,
    product_id uuid not null references store.products(id) on delete restrict,
    quantity integer not null default 1,
    unit_price numeric(10, 2) not null,

    created_at timestamptz default current_timestamp
);

comment on table store.order_items is
'{
    "icon": "ShoppingBag",
    "display": "block",
    "query": {
        "sort": [{"id": "created_at", "desc": true}],
        "join": [
            {"table": "orders", "on": "order_id", "columns": ["status", "total"]},
            {"table": "products", "on": "product_id", "columns": ["name", "price"]}
        ]
    }
}';

revoke all on table store.order_items from authenticated, service_role;
grant select, insert, update, delete on table store.order_items to authenticated;

create index idx_store_order_items_order_id on store.order_items (order_id);
create index idx_store_order_items_product_id on store.order_items (product_id);

alter table store.order_items enable row level security;

create policy order_items_select on store.order_items
    for select to authenticated
    using (supasheet.has_permission('store.order_items:select'));

create policy order_items_insert on store.order_items
    for insert to authenticated
    with check (supasheet.has_permission('store.order_items:insert'));

create policy order_items_update on store.order_items
    for update to authenticated
    using (supasheet.has_permission('store.order_items:update'))
    with check (supasheet.has_permission('store.order_items:update'));

create policy order_items_delete on store.order_items
    for delete to authenticated
    using (supasheet.has_permission('store.order_items:delete'));


-- Users view
create or replace view store.users
with (security_invoker = true) as
select * from supasheet.users;

revoke all on store.users from authenticated, service_role;
grant select on store.users to authenticated;


----------------------------------------------------------------
-- Reports
----------------------------------------------------------------

create or replace view store.order_report
with (security_invoker = true) as
select
    u.name as customer_name,
    o.id,
    o.status,
    o.total,
    o.notes,
    count(oi.id) as item_count,
    o.created_at,
    o.updated_at
from store.orders o
join supasheet.users u on o.user_id = u.id
left join store.order_items oi on oi.order_id = o.id
group by o.id, u.name;

revoke all on store.order_report from authenticated, service_role;
grant select on store.order_report to authenticated;

comment on view store.order_report is '{"type": "report", "name": "Order Report", "description": "Full order list with customer and item details"}';


----------------------------------------------------------------
-- Dashboard widget views
----------------------------------------------------------------

-- Card1: total revenue
create or replace view store.revenue_summary
with (security_invoker = true) as
select
    sum(total) as value,
    'shopping-cart' as icon,
    'total revenue' as label
from store.orders
where status not in ('cancelled', 'refunded');

revoke all on store.revenue_summary from authenticated, service_role;
grant select on store.revenue_summary to authenticated;

-- Card2: delivered vs pending
create or replace view store.order_completion_rate
with (security_invoker = true) as
select
    count(*) filter (where status = 'delivered') as primary,
    count(*) filter (where status not in ('delivered', 'cancelled', 'refunded')) as secondary,
    'Delivered' as primary_label,
    'Pending' as secondary_label
from store.orders;

revoke all on store.order_completion_rate from authenticated, service_role;
grant select on store.order_completion_rate to authenticated;

-- Card3: delivered orders with rate
create or replace view store.orders_by_status
with (security_invoker = true) as
select
    count(*) filter (where status = 'delivered') as value,
    case
        when count(*) > 0
        then round((count(*) filter (where status = 'delivered')::numeric / count(*)::numeric) * 100, 1)
        else 0
    end as percent
from store.orders;

revoke all on store.orders_by_status from authenticated, service_role;
grant select on store.orders_by_status to authenticated;

-- Card4: inventory alert
create or replace view store.low_stock_count
with (security_invoker = true) as
select
    count(*) filter (where stock < 10) as current,
    count(*) as total,
    json_build_array(
        json_build_object('label', 'Out of Stock', 'value', count(*) filter (where stock = 0)),
        json_build_object('label', 'Low Stock', 'value', count(*) filter (where stock > 0 and stock < 10)),
        json_build_object('label', 'Archived', 'value', count(*) filter (where status = 'archived'))
    ) as segments
from store.products;

revoke all on store.low_stock_count from authenticated, service_role;
grant select on store.low_stock_count to authenticated;

-- Table1: recent orders
create or replace view store.recent_orders
with (security_invoker = true) as
select
    u.name as customer,
    o.status,
    o.total,
    to_char(o.created_at, 'MM/DD') as date
from store.orders o
join supasheet.users u on o.user_id = u.id
order by o.created_at desc
limit 10;

revoke all on store.recent_orders from authenticated, service_role;
grant select on store.recent_orders to authenticated;

-- Table2: top products by units sold
create or replace view store.top_products
with (security_invoker = true) as
select
    p.name as product,
    p.category,
    p.status,
    p.stock,
    coalesce(sum(oi.quantity), 0) as units_sold,
    count(oi.id) as orders
from store.products p
left join store.order_items oi on oi.product_id = p.id
group by p.id, p.name, p.category, p.status, p.stock
order by units_sold desc
limit 10;

revoke all on store.top_products from authenticated, service_role;
grant select on store.top_products to authenticated;

comment on view store.revenue_summary is '{"type": "dashboard_widget", "name": "Total Revenue", "description": "Sum of all completed order revenue", "widget_type": "card_1"}';
comment on view store.order_completion_rate is '{"type": "dashboard_widget", "name": "Order Completion", "description": "Delivered vs pending orders", "widget_type": "card_2"}';
comment on view store.orders_by_status is '{"type": "dashboard_widget", "name": "Delivered Orders", "description": "Delivered order count and rate", "widget_type": "card_3"}';
comment on view store.low_stock_count is '{"type": "dashboard_widget", "name": "Inventory Alert", "description": "Products with low or zero stock", "widget_type": "card_4"}';
comment on view store.recent_orders is '{"type": "dashboard_widget", "name": "Recent Orders", "description": "Latest orders placed", "widget_type": "table_1"}';
comment on view store.top_products is '{"type": "dashboard_widget", "name": "Top Products", "description": "Best selling products by units sold", "widget_type": "table_2"}';


----------------------------------------------------------------
-- Chart views
----------------------------------------------------------------

-- Pie: orders by status
create or replace view store.orders_status_pie
with (security_invoker = true) as
select
    status as label,
    count(*) as value
from store.orders
group by status;

revoke all on store.orders_status_pie from authenticated, service_role;
grant select on store.orders_status_pie to authenticated;

-- Line: daily revenue over 14 days
create or replace view store.revenue_line
with (security_invoker = true) as
select
    to_char(date_trunc('day', created_at), 'Mon DD') as date,
    count(*) as orders,
    sum(total) as revenue
from store.orders
where created_at >= current_date - interval '14 days'
  and status not in ('cancelled', 'refunded')
group by date_trunc('day', created_at)
order by date_trunc('day', created_at);

revoke all on store.revenue_line from authenticated, service_role;
grant select on store.revenue_line to authenticated;

-- Bar: products by category
create or replace view store.product_category_bar
with (security_invoker = true) as
select
    coalesce(category, 'Uncategorized') as label,
    count(*) as total,
    count(*) filter (where status = 'active') as active
from store.products
group by category
order by total desc;

revoke all on store.product_category_bar from authenticated, service_role;
grant select on store.product_category_bar to authenticated;

-- Radar: order metrics by status
create or replace view store.order_metrics_radar
with (security_invoker = true) as
select
    status as metric,
    count(*) as total,
    round(avg(total)::numeric, 2) as avg_value,
    round(sum(total)::numeric, 2) as revenue
from store.orders
group by status;

revoke all on store.order_metrics_radar from authenticated, service_role;
grant select on store.order_metrics_radar to authenticated;

comment on view store.orders_status_pie is '{"type": "chart", "name": "Orders by Status", "description": "Current order status breakdown", "chart_type": "pie"}';
comment on view store.revenue_line is '{"type": "chart", "name": "Daily Revenue", "description": "Revenue trend over the last 14 days", "chart_type": "line"}';
comment on view store.product_category_bar is '{"type": "chart", "name": "Products by Category", "description": "Product count grouped by category", "chart_type": "bar"}';
comment on view store.order_metrics_radar is '{"type": "chart", "name": "Order Metrics", "description": "Order volume and value by status", "chart_type": "radar"}';


----------------------------------------------------------------
-- Role permissions
----------------------------------------------------------------

insert into supasheet.role_permissions (role, permission) values
    ('x-admin', 'store.products:select'),
    ('x-admin', 'store.products:insert'),
    ('x-admin', 'store.products:update'),
    ('x-admin', 'store.products:delete'),

    ('x-admin', 'store.orders:select'),
    ('x-admin', 'store.orders:insert'),
    ('x-admin', 'store.orders:update'),
    ('x-admin', 'store.orders:delete'),

    ('x-admin', 'store.order_items:select'),
    ('x-admin', 'store.order_items:insert'),
    ('x-admin', 'store.order_items:update'),
    ('x-admin', 'store.order_items:delete'),

    ('x-admin', 'store.order_report:select'),
    ('x-admin', 'store.revenue_summary:select'),
    ('x-admin', 'store.order_completion_rate:select'),
    ('x-admin', 'store.orders_by_status:select'),
    ('x-admin', 'store.low_stock_count:select'),
    ('x-admin', 'store.recent_orders:select'),
    ('x-admin', 'store.top_products:select'),
    ('x-admin', 'store.orders_status_pie:select'),
    ('x-admin', 'store.revenue_line:select'),
    ('x-admin', 'store.product_category_bar:select'),
    ('x-admin', 'store.order_metrics_radar:select');


----------------------------------------------------------------
-- Audit triggers for products
----------------------------------------------------------------

create trigger audit_store_products_insert
    after insert on store.products
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_store_products_update
    after update on store.products
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_store_products_delete
    before delete on store.products
    for each row
execute function supasheet.audit_trigger_function();


----------------------------------------------------------------
-- Audit triggers for orders
----------------------------------------------------------------

create trigger audit_store_orders_insert
    after insert on store.orders
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_store_orders_update
    after update on store.orders
    for each row
execute function supasheet.audit_trigger_function();

create trigger audit_store_orders_delete
    before delete on store.orders
    for each row
execute function supasheet.audit_trigger_function();
