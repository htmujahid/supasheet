create schema if not exists store;

grant usage on schema store to authenticated;

----------------------------------------------------------------
-- Enums + permissions (must commit before use)
----------------------------------------------------------------
begin;

create type store.product_status as enum('active', 'draft', 'archived', 'out_of_stock');

create type store.order_status as enum(
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

create type store.payment_method as enum(
  'credit_card',
  'paypal',
  'bank_transfer',
  'cash_on_delivery'
);

create type store.review_status as enum('pending', 'approved', 'rejected');

-- Product permissions
alter type supasheet.app_permission
add value 'store.products:select';

alter type supasheet.app_permission
add value 'store.products:insert';

alter type supasheet.app_permission
add value 'store.products:update';

alter type supasheet.app_permission
add value 'store.products:delete';

alter type supasheet.app_permission
add value 'store.products:audit';

alter type supasheet.app_permission
add value 'store.products:comment';

-- Order permissions
alter type supasheet.app_permission
add value 'store.orders:select';

alter type supasheet.app_permission
add value 'store.orders:insert';

alter type supasheet.app_permission
add value 'store.orders:update';

alter type supasheet.app_permission
add value 'store.orders:delete';

alter type supasheet.app_permission
add value 'store.orders:audit';

alter type supasheet.app_permission
add value 'store.orders:comment';

-- Order items permissions
alter type supasheet.app_permission
add value 'store.order_items:select';

alter type supasheet.app_permission
add value 'store.order_items:insert';

alter type supasheet.app_permission
add value 'store.order_items:update';

alter type supasheet.app_permission
add value 'store.order_items:delete';

alter type supasheet.app_permission
add value 'store.order_items:audit';

alter type supasheet.app_permission
add value 'store.order_items:comment';

-- Review permissions
alter type supasheet.app_permission
add value 'store.reviews:select';

alter type supasheet.app_permission
add value 'store.reviews:insert';

alter type supasheet.app_permission
add value 'store.reviews:update';

alter type supasheet.app_permission
add value 'store.reviews:delete';

alter type supasheet.app_permission
add value 'store.reviews:audit';

alter type supasheet.app_permission
add value 'store.reviews:comment';

-- Users mirror view
alter type supasheet.app_permission
add value 'store.users:select';

-- Store settings (singleton)
alter type supasheet.app_permission
add value 'store.store_settings:select';

alter type supasheet.app_permission
add value 'store.store_settings:insert';

alter type supasheet.app_permission
add value 'store.store_settings:update';

alter type supasheet.app_permission
add value 'store.store_settings:audit';

alter type supasheet.app_permission
add value 'store.store_settings:comment';

-- Widget / report / chart permissions
alter type supasheet.app_permission
add value 'store.order_report:select';

alter type supasheet.app_permission
add value 'store.revenue_summary:select';

alter type supasheet.app_permission
add value 'store.order_completion_rate:select';

alter type supasheet.app_permission
add value 'store.orders_by_status:select';

alter type supasheet.app_permission
add value 'store.low_stock_count:select';

alter type supasheet.app_permission
add value 'store.recent_orders:select';

alter type supasheet.app_permission
add value 'store.top_products:select';

alter type supasheet.app_permission
add value 'store.orders_status_pie:select';

alter type supasheet.app_permission
add value 'store.revenue_line:select';

alter type supasheet.app_permission
add value 'store.product_category_bar:select';

alter type supasheet.app_permission
add value 'store.order_metrics_radar:select';

alter type supasheet.app_permission
add value 'store.product_ratings:select';

commit;

----------------------------------------------------------------
-- Store Settings  (single resource — one row only)
----------------------------------------------------------------
create table store.store_settings (
  id uuid primary key default extensions.uuid_generate_v4 (),
  store_name varchar(255) not null default 'My Store',
  store_description text,
  logo supasheet.file,
  contact_email varchar(255),
  contact_phone varchar(50),
  currency varchar(3) not null default 'USD',
  tax_rate numeric(5, 2) not null default 0,
  shipping_rate numeric(10, 2) not null default 0,
  free_shipping_threshold numeric(10, 2),
  return_policy supasheet.rich_text,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on table store.store_settings is '{
    "icon": "Store",
    "name": "Store Settings",
    "display": "block",
    "single": true,
    "sections": [
        {"id": "identity",  "title": "Identity",  "fields": ["store_name", "store_description", "logo"]},
        {"id": "contact",   "title": "Contact",   "fields": ["contact_email", "contact_phone"]},
        {"id": "commerce",  "title": "Commerce",  "description": "Currency, tax, and shipping defaults", "fields": ["currency", "tax_rate", "shipping_rate", "free_shipping_threshold"]},
        {"id": "policy",    "title": "Policy",    "collapsible": true, "fields": ["return_policy"]}
    ]
}';

comment on column store.store_settings.logo is '{"name": "Logo", "accept": "image/*", "maxSize": 2097152}';

revoke all on table store.store_settings
from
  authenticated,
  service_role;

grant
select
,
  insert,
update on table store.store_settings to authenticated;

alter table store.store_settings enable row level security;

create policy store_settings_select on store.store_settings for
select
  to authenticated using (
    supasheet.has_permission ('store.store_settings:select')
  );

create policy store_settings_insert on store.store_settings for insert to authenticated
with
  check (
    supasheet.has_permission ('store.store_settings:insert')
  );

create policy store_settings_update on store.store_settings
for update
  to authenticated using (
    supasheet.has_permission ('store.store_settings:update')
  )
with
  check (
    supasheet.has_permission ('store.store_settings:update')
  );

----------------------------------------------------------------
-- Products table
----------------------------------------------------------------
create table store.products (
  id uuid primary key default extensions.uuid_generate_v4 (),
  sku varchar(100) unique,
  name varchar(500) not null,
  description supasheet.RICH_TEXT,
  price numeric(10, 2) not null default 0,
  stock integer not null default 0,
  status store.product_status default 'draft',
  category varchar(100),
  tags varchar(100) [],
  featured boolean not null default false,
  image supasheet.file,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column store.products.status is '{
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

comment on table store.products is '{
    "icon": "Package",
    "display": "block",
    "query": {
        "sort": [{"id": "name", "desc": false}]
    },
    "primaryItem": "gallery",
    "items": [
        {"id": "gallery", "name": "Product Gallery", "type": "gallery", "cover": "image", "title": "name", "description": "description", "badge": "status"},
        {"id": "status", "name": "Products By Status", "type": "kanban", "group": "status", "title": "name", "description": "description", "badge": "category"}
    ],
    "sections": [
        {"id": "identity", "title": "Identity", "fields": ["name", "sku", "description", "image"]},
        {"id": "pricing", "title": "Pricing & Inventory", "fields": ["price", "stock", "status"]},
        {"id": "merchandising", "title": "Merchandising", "description": "Categorization and storefront placement", "fields": ["category", "tags", "featured"]}
    ]
}';

comment on column store.products.image is '{"accept": "image/*"}';

revoke all on table store.products
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table store.products to authenticated;

create index idx_store_products_status on store.products (status);

create index idx_store_products_category on store.products (category);

create index idx_store_products_featured on store.products (featured)
where
  featured = true;

create index idx_store_products_sku on store.products (sku);

alter table store.products enable row level security;

create policy products_select on store.products for
select
  to authenticated using (
    supasheet.has_permission ('store.products:select')
  );

create policy products_insert on store.products for insert to authenticated
with
  check (
    supasheet.has_permission ('store.products:insert')
  );

create policy products_update on store.products
for update
  to authenticated using (
    supasheet.has_permission ('store.products:update')
  )
with
  check (
    supasheet.has_permission ('store.products:update')
  );

create policy products_delete on store.products for delete to authenticated using (
  supasheet.has_permission ('store.products:delete')
);

----------------------------------------------------------------
-- Orders table
----------------------------------------------------------------
create table store.orders (
  id uuid primary key default extensions.uuid_generate_v4 (),
  order_number varchar(50) unique,
  user_id uuid default auth.uid () references supasheet.users (id) on delete cascade,
  status store.order_status default 'pending',
  payment_method store.payment_method,
  subtotal numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  shipping_address text,
  tracking_number varchar(100),
  notes text,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column store.orders.status is '{
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

comment on column store.orders.payment_method is '{
    "enums": {
        "credit_card": {
            "variant": "info",
            "icon": "CreditCard"
        },
        "paypal": {
            "variant": "info",
            "icon": "Wallet"
        },
        "bank_transfer": {
            "variant": "outline",
            "icon": "Landmark"
        },
        "cash_on_delivery": {
            "variant": "warning",
            "icon": "Banknote"
        }
    }
}';

comment on table store.orders is '{
    "icon": "ShoppingCart",
    "display": "block",
    "query": {
        "sort": [{"id": "created_at", "desc": true}],
        "join": [{"table": "users", "on": "user_id", "columns": ["name", "email"]}]
    },
    "items": [
        {"id": "status", "name": "Orders By Status", "type": "kanban", "group": "status", "title": "order_number", "description": "notes", "date": "created_at", "badge": "status"},
        {"id": "calendar", "name": "Order Calendar", "type": "calendar", "title": "order_number", "startDate": "created_at", "badge": "status"}
    ],
    "sections": [
        {"id": "identity", "title": "Order", "fields": ["order_number", "user_id", "status"]},
        {"id": "amounts", "title": "Amounts", "fields": ["subtotal", "tax", "shipping", "total"]},
        {"id": "fulfillment", "title": "Fulfillment", "description": "Payment, shipping address, tracking", "fields": ["payment_method", "shipping_address", "tracking_number"]},
        {"id": "extras", "title": "Notes", "collapsible": true, "fields": ["notes"]}
    ]
}';

revoke all on table store.orders
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table store.orders to authenticated;

create index idx_store_orders_user_id on store.orders (user_id);

create index idx_store_orders_status on store.orders (status);

create index idx_store_orders_order_number on store.orders (order_number);

create index idx_store_orders_created_at on store.orders (created_at desc);

alter table store.orders enable row level security;

create policy orders_select on store.orders for
select
  to authenticated using (supasheet.has_permission ('store.orders:select'));

create policy orders_insert on store.orders for insert to authenticated
with
  check (supasheet.has_permission ('store.orders:insert'));

create policy orders_update on store.orders
for update
  to authenticated using (supasheet.has_permission ('store.orders:update'))
with
  check (supasheet.has_permission ('store.orders:update'));

create policy orders_delete on store.orders for delete to authenticated using (supasheet.has_permission ('store.orders:delete'));

----------------------------------------------------------------
-- Order items table
----------------------------------------------------------------
create table store.order_items (
  id uuid primary key default extensions.uuid_generate_v4 (),
  order_id uuid not null references store.orders (id) on delete cascade,
  product_id uuid not null references store.products (id) on delete restrict,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  created_at timestamptz default current_timestamp
);

comment on table store.order_items is '{
    "icon": "ShoppingBag",
    "inlineForm": true,
    "display": "block",
    "query": {
        "sort": [{"id": "created_at", "desc": true}],
        "join": [
            {"table": "orders", "on": "order_id", "columns": ["status", "total"]},
            {"table": "products", "on": "product_id", "columns": ["name", "price"]}
        ]
    },
    "sections": [
        {"id": "context", "title": "Context", "fields": ["order_id", "product_id"]},
        {"id": "amounts", "title": "Amounts", "fields": ["quantity", "unit_price"]}
    ]
}';

revoke all on table store.order_items
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table store.order_items to authenticated;

create index idx_store_order_items_order_id on store.order_items (order_id);

create index idx_store_order_items_product_id on store.order_items (product_id);

alter table store.order_items enable row level security;

create policy order_items_select on store.order_items for
select
  to authenticated using (
    supasheet.has_permission ('store.order_items:select')
  );

create policy order_items_insert on store.order_items for insert to authenticated
with
  check (
    supasheet.has_permission ('store.order_items:insert')
  );

create policy order_items_update on store.order_items
for update
  to authenticated using (
    supasheet.has_permission ('store.order_items:update')
  )
with
  check (
    supasheet.has_permission ('store.order_items:update')
  );

create policy order_items_delete on store.order_items for delete to authenticated using (
  supasheet.has_permission ('store.order_items:delete')
);

----------------------------------------------------------------
-- Reviews
----------------------------------------------------------------
create table store.reviews (
  id uuid primary key default extensions.uuid_generate_v4 (),
  product_id uuid not null references store.products (id) on delete cascade,
  user_id uuid default auth.uid () references supasheet.users (id) on delete cascade,
  rating supasheet.rating not null,
  title varchar(255),
  content text,
  status store.review_status not null default 'pending',
  verified_purchase boolean not null default false,
  helpful_count integer not null default 0,
  created_at timestamptz default current_timestamp,
  updated_at timestamptz default current_timestamp
);

comment on column store.reviews.status is '{
    "progress": false,
    "enums": {
        "pending": {
            "variant": "warning",
            "icon": "Clock"
        },
        "approved": {
            "variant": "success",
            "icon": "CircleCheck"
        },
        "rejected": {
            "variant": "destructive",
            "icon": "XCircle"
        }
    }
}';

comment on table store.reviews is '{
    "icon": "Star",
    "display": "block",
    "query": {
        "sort": [{"id": "created_at", "desc": true}],
        "join": [
            {"table": "products", "on": "product_id", "columns": ["name", "sku"]},
            {"table": "users", "on": "user_id", "columns": ["name", "email"]}
        ]
    },
    "items": [
        {"id": "moderation", "name": "Moderation Queue", "type": "kanban", "group": "status", "title": "title", "description": "content", "date": "created_at", "badge": "rating"}
    ],
    "sections": [
        {"id": "context", "title": "Context", "fields": ["product_id", "user_id"]},
        {"id": "review", "title": "Review", "fields": ["rating", "title", "content"]},
        {"id": "moderation", "title": "Moderation", "fields": ["status", "verified_purchase", "helpful_count"]}
    ]
}';

revoke all on table store.reviews
from
  authenticated,
  service_role;

grant
select
,
  insert,
update,
delete on table store.reviews to authenticated;

create index idx_store_reviews_product_id on store.reviews (product_id);

create index idx_store_reviews_user_id on store.reviews (user_id);

create index idx_store_reviews_status on store.reviews (status);

create index idx_store_reviews_rating on store.reviews (rating);

alter table store.reviews enable row level security;

-- Anyone with the perm sees approved reviews; users always see their own
create policy reviews_select on store.reviews for
select
  to authenticated using (
    supasheet.has_permission ('store.reviews:select')
    and (
      status = 'approved'
      or user_id = (
        select
          auth.uid ()
      )
    )
  );

create policy reviews_insert on store.reviews for insert to authenticated
with
  check (
    supasheet.has_permission ('store.reviews:insert')
    and user_id = (
      select
        auth.uid ()
    )
  );

create policy reviews_update on store.reviews
for update
  to authenticated using (supasheet.has_permission ('store.reviews:update'))
with
  check (supasheet.has_permission ('store.reviews:update'));

create policy reviews_delete on store.reviews for delete to authenticated using (supasheet.has_permission ('store.reviews:delete'));

----------------------------------------------------------------
-- Users mirror (for Postgrest joins)
----------------------------------------------------------------
create or replace view store.users
with
  (security_invoker = true) as
select
  *
from
  supasheet.users;

revoke all on store.users
from
  authenticated,
  service_role;

grant
select
  on store.users to authenticated;

----------------------------------------------------------------
-- Reports
----------------------------------------------------------------
create or replace view store.order_report
with
  (security_invoker = true) as
select
  u.name as customer_name,
  o.id,
  o.order_number,
  o.status,
  o.payment_method,
  o.subtotal,
  o.tax,
  o.shipping,
  o.total,
  o.tracking_number,
  o.notes,
  count(oi.id) as item_count,
  o.created_at,
  o.updated_at
from
  store.orders o
  join supasheet.users u on o.user_id = u.id
  left join store.order_items oi on oi.order_id = o.id
group by
  o.id,
  u.name;

revoke all on store.order_report
from
  authenticated,
  service_role;

grant
select
  on store.order_report to authenticated;

comment on view store.order_report is '{"type": "report", "name": "Order Report", "description": "Full order list with customer and item details"}';

-- Aggregated review metrics per product
create or replace view store.product_ratings
with
  (security_invoker = true) as
select
  p.id as product_id,
  p.sku,
  p.name as product,
  p.category,
  count(r.id) filter (
    where
      r.status = 'approved'
  ) as review_count,
  round(
    avg(r.rating) filter (
      where
        r.status = 'approved'
    )::numeric,
    2
  ) as avg_rating,
  count(r.id) filter (
    where
      r.status = 'pending'
  ) as pending_count,
  count(r.id) filter (
    where
      r.verified_purchase
      and r.status = 'approved'
  ) as verified_count
from
  store.products p
  left join store.reviews r on r.product_id = p.id
group by
  p.id
order by
  avg_rating desc nulls last,
  review_count desc;

revoke all on store.product_ratings
from
  authenticated,
  service_role;

grant
select
  on store.product_ratings to authenticated;

comment on view store.product_ratings is '{"type": "report", "name": "Product Ratings", "description": "Approved review counts and average ratings per product"}';

----------------------------------------------------------------
-- Dashboard widget views
----------------------------------------------------------------
-- Card1: total revenue
create or replace view store.revenue_summary
with
  (security_invoker = true) as
select
  sum(total) as value,
  'shopping-cart' as icon,
  'total revenue' as label
from
  store.orders
where
  status not in ('cancelled', 'refunded');

revoke all on store.revenue_summary
from
  authenticated,
  service_role;

grant
select
  on store.revenue_summary to authenticated;

-- Card2: delivered vs pending
create or replace view store.order_completion_rate
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'delivered'
  ) as primary,
  count(*) filter (
    where
      status not in ('delivered', 'cancelled', 'refunded')
  ) as secondary,
  'Delivered' as primary_label,
  'Pending' as secondary_label
from
  store.orders;

revoke all on store.order_completion_rate
from
  authenticated,
  service_role;

grant
select
  on store.order_completion_rate to authenticated;

-- Card3: delivered orders with rate
create or replace view store.orders_by_status
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      status = 'delivered'
  ) as value,
  case
    when count(*) > 0 then round(
      (
        count(*) filter (
          where
            status = 'delivered'
        )::numeric / count(*)::numeric
      ) * 100,
      1
    )
    else 0
  end as percent
from
  store.orders;

revoke all on store.orders_by_status
from
  authenticated,
  service_role;

grant
select
  on store.orders_by_status to authenticated;

-- Card4: inventory alert
create or replace view store.low_stock_count
with
  (security_invoker = true) as
select
  count(*) filter (
    where
      stock < 10
  ) as current,
  count(*) as total,
  json_build_array(
    json_build_object(
      'label',
      'Out of Stock',
      'value',
      count(*) filter (
        where
          stock = 0
      )
    ),
    json_build_object(
      'label',
      'Low Stock',
      'value',
      count(*) filter (
        where
          stock > 0
          and stock < 10
      )
    ),
    json_build_object(
      'label',
      'Archived',
      'value',
      count(*) filter (
        where
          status = 'archived'
      )
    )
  ) as segments
from
  store.products;

revoke all on store.low_stock_count
from
  authenticated,
  service_role;

grant
select
  on store.low_stock_count to authenticated;

-- Table1: recent orders
create or replace view store.recent_orders
with
  (security_invoker = true) as
select
  o.order_number,
  u.name as customer,
  o.status,
  o.total,
  to_char(o.created_at, 'MM/DD') as date
from
  store.orders o
  join supasheet.users u on o.user_id = u.id
order by
  o.created_at desc
limit
  10;

revoke all on store.recent_orders
from
  authenticated,
  service_role;

grant
select
  on store.recent_orders to authenticated;

-- Table2: top products by units sold
create or replace view store.top_products
with
  (security_invoker = true) as
select
  p.name as product,
  p.sku,
  p.category,
  p.status,
  p.stock,
  coalesce(sum(oi.quantity), 0) as units_sold,
  count(oi.id) as orders
from
  store.products p
  left join store.order_items oi on oi.product_id = p.id
group by
  p.id,
  p.name,
  p.sku,
  p.category,
  p.status,
  p.stock
order by
  units_sold desc
limit
  10;

revoke all on store.top_products
from
  authenticated,
  service_role;

grant
select
  on store.top_products to authenticated;

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
with
  (security_invoker = true) as
select
  status::text as label,
  count(*) as value
from
  store.orders
group by
  status;

revoke all on store.orders_status_pie
from
  authenticated,
  service_role;

grant
select
  on store.orders_status_pie to authenticated;

-- Line: daily revenue over 14 days
create or replace view store.revenue_line
with
  (security_invoker = true) as
select
  to_char(date_trunc('day', created_at), 'Mon DD') as date,
  count(*) as orders,
  sum(total) as revenue
from
  store.orders
where
  created_at >= current_date - interval '14 days'
  and status not in ('cancelled', 'refunded')
group by
  date_trunc('day', created_at)
order by
  date_trunc('day', created_at);

revoke all on store.revenue_line
from
  authenticated,
  service_role;

grant
select
  on store.revenue_line to authenticated;

-- Bar: products by category
create or replace view store.product_category_bar
with
  (security_invoker = true) as
select
  coalesce(category, 'Uncategorized') as label,
  count(*) as total,
  count(*) filter (
    where
      status = 'active'
  ) as active
from
  store.products
group by
  category
order by
  total desc;

revoke all on store.product_category_bar
from
  authenticated,
  service_role;

grant
select
  on store.product_category_bar to authenticated;

-- Radar: order metrics by status
create or replace view store.order_metrics_radar
with
  (security_invoker = true) as
select
  status::text as metric,
  count(*) as total,
  round(avg(total)::numeric, 2) as avg_value,
  round(sum(total)::numeric, 2) as revenue
from
  store.orders
group by
  status;

revoke all on store.order_metrics_radar
from
  authenticated,
  service_role;

grant
select
  on store.order_metrics_radar to authenticated;

comment on view store.orders_status_pie is '{"type": "chart", "name": "Orders by Status", "description": "Current order status breakdown", "chart_type": "pie"}';

comment on view store.revenue_line is '{"type": "chart", "name": "Daily Revenue", "description": "Revenue trend over the last 14 days", "chart_type": "line"}';

comment on view store.product_category_bar is '{"type": "chart", "name": "Products by Category", "description": "Product count grouped by category", "chart_type": "bar"}';

comment on view store.order_metrics_radar is '{"type": "chart", "name": "Order Metrics", "description": "Order volume and value by status", "chart_type": "radar"}';

----------------------------------------------------------------
-- Role permissions
----------------------------------------------------------------
insert into
  supasheet.role_permissions (role, permission)
values
  ('x-admin', 'store.products:select'),
  ('x-admin', 'store.products:insert'),
  ('x-admin', 'store.products:update'),
  ('x-admin', 'store.products:delete'),
  ('x-admin', 'store.products:audit'),
  ('x-admin', 'store.products:comment'),
  ('x-admin', 'store.orders:select'),
  ('x-admin', 'store.orders:insert'),
  ('x-admin', 'store.orders:update'),
  ('x-admin', 'store.orders:delete'),
  ('x-admin', 'store.orders:audit'),
  ('x-admin', 'store.orders:comment'),
  ('x-admin', 'store.order_items:select'),
  ('x-admin', 'store.order_items:insert'),
  ('x-admin', 'store.order_items:update'),
  ('x-admin', 'store.order_items:delete'),
  ('x-admin', 'store.order_items:audit'),
  ('x-admin', 'store.order_items:comment'),
  ('x-admin', 'store.reviews:select'),
  ('x-admin', 'store.reviews:insert'),
  ('x-admin', 'store.reviews:update'),
  ('x-admin', 'store.reviews:delete'),
  ('x-admin', 'store.reviews:audit'),
  ('x-admin', 'store.reviews:comment'),
  ('x-admin', 'store.store_settings:select'),
  ('x-admin', 'store.store_settings:insert'),
  ('x-admin', 'store.store_settings:update'),
  ('x-admin', 'store.store_settings:audit'),
  ('x-admin', 'store.store_settings:comment'),
  ('x-admin', 'store.users:select'),
  ('x-admin', 'store.order_report:select'),
  ('x-admin', 'store.product_ratings:select'),
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
-- Audit triggers
----------------------------------------------------------------
create trigger audit_store_store_settings_insert
after insert on store.store_settings for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_store_settings_update
after
update on store.store_settings for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_products_insert
after insert on store.products for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_products_update
after
update on store.products for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_products_delete before delete on store.products for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_orders_insert
after insert on store.orders for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_orders_update
after
update on store.orders for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_orders_delete before delete on store.orders for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_order_items_insert
after insert on store.order_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_order_items_update
after
update on store.order_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_order_items_delete before delete on store.order_items for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_reviews_insert
after insert on store.reviews for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_reviews_update
after
update on store.reviews for each row
execute function supasheet.audit_trigger_function ();

create trigger audit_store_reviews_delete before delete on store.reviews for each row
execute function supasheet.audit_trigger_function ();

----------------------------------------------------------------
-- Notifications
----------------------------------------------------------------
-- Order trigger:
--   * INSERT  → notify the customer + everyone who can manage orders
--   * status / tracking_number updates → notify the customer
create or replace function store.trg_orders_notify () returns trigger as $$
declare
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
    v_order_ref  text;
begin
    v_order_ref := coalesce(new.order_number, new.id::text);

    if tg_op = 'INSERT' then
        v_type  := 'order_placed';
        v_title := 'New order placed';
        v_body  := 'Order ' || v_order_ref || ' was placed.';
        v_recipients := array_remove(
            supasheet.get_users_with_permission('store.orders:select') || array[new.user_id],
            null
        );
    elsif new.status is distinct from old.status then
        v_type  := 'order_status_changed';
        v_title := 'Order status updated';
        v_body  := 'Order ' || v_order_ref || ' is now ' || new.status::text || '.';
        v_recipients := array_remove(array[new.user_id], null);
    elsif new.tracking_number is distinct from old.tracking_number
          and new.tracking_number is not null then
        v_type  := 'order_tracking_added';
        v_title := 'Tracking number added';
        v_body  := 'Tracking is now available for order ' || v_order_ref || '.';
        v_recipients := array_remove(array[new.user_id], null);
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object(
            'order_id',     new.id,
            'order_number', new.order_number,
            'status',       new.status,
            'total',        new.total
        ),
        '/store/resource/orders/detail/' || new.id::text
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists orders_notify on store.orders;

create trigger orders_notify
after insert
or
update of status,
tracking_number on store.orders for each row
execute function store.trg_orders_notify ();

-- Product trigger: alert product admins when stock crosses below the low-stock threshold
create or replace function store.trg_products_notify () returns trigger as $$
declare
    v_recipients uuid[];
begin
    if new.stock < 10
       and (tg_op = 'INSERT' or old.stock >= 10)
    then
        v_recipients := supasheet.get_users_with_permission('store.products:update');

        perform supasheet.create_notification(
            'product_low_stock',
            case when new.stock = 0 then 'Product out of stock' else 'Low stock' end,
            'Product "' || new.name || '" has ' || new.stock::text || ' unit(s) left.',
            v_recipients,
            jsonb_build_object(
                'product_id', new.id,
                'sku',        new.sku,
                'stock',      new.stock
            ),
            '/store/resource/products/detail/' || new.id::text
        );
    end if;
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists products_notify on store.products;

create trigger products_notify
after insert
or
update of stock on store.products for each row
execute function store.trg_products_notify ();

-- Review trigger:
--   * INSERT  → notify moderators that a review needs review
--   * status update → notify the reviewer of the moderation decision
create or replace function store.trg_reviews_notify () returns trigger as $$
declare
    v_product    store.products%rowtype;
    v_recipients uuid[];
    v_type       text;
    v_title      text;
    v_body       text;
begin
    select * into v_product from store.products where id = new.product_id;

    if tg_op = 'INSERT' then
        v_recipients := supasheet.get_users_with_permission('store.reviews:update');
        v_type       := 'review_submitted';
        v_title      := 'New review submitted';
        v_body       := 'A review for "' || v_product.name || '" is awaiting moderation.';
    elsif new.status is distinct from old.status then
        v_recipients := array_remove(array[new.user_id], null);
        v_type       := 'review_' || new.status::text;
        v_title      := 'Review ' || new.status::text;
        v_body       := 'Your review of "' || v_product.name || '" was ' || new.status::text || '.';
    else
        return new;
    end if;

    perform supasheet.create_notification(
        v_type, v_title, v_body, v_recipients,
        jsonb_build_object(
            'review_id',  new.id,
            'product_id', new.product_id,
            'rating',     new.rating,
            'status',     new.status
        ),
        '/store/resource/reviews/detail/' || new.id::text
    );
    return new;
end;
$$ language plpgsql security definer
set
  search_path = '';

drop trigger if exists reviews_notify on store.reviews;

create trigger reviews_notify
after insert
or
update of status on store.reviews for each row
execute function store.trg_reviews_notify ();
