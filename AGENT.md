# AGENT.md — Supasheet Implementation Playbook

> Audience: AI coding agents (Claude, GPT, etc.) implementing features in this repo.
> Read this file end-to-end before touching code. It is **self-contained** — you do not need to read CLAUDE.md to work in this codebase.

---

## 1. TL;DR

Supasheet is an opinionated open-source CMS built **on top of Supabase**. Given any Postgres schema with appropriate RLS + permission rows, the UI auto-generates CRUD screens, kanban/calendar/gallery views, dashboards, charts, and reports — driven entirely by **JSON metadata in table/column comments** and a `supasheet` introspection schema.

What makes it unusual:

1. **The database is the source of truth for UI structure.** Tables, columns, views, enums, and their JSON comments determine which forms, fields, filters, charts, and dashboards exist.
2. **Permissions are a first-class enum** (`supasheet.app_permission`) of shape `<schema>.<table>:<action>`. Every RLS policy and edge function calls `supasheet.has_permission(...)`.
3. **Two-layer data fetching:** TanStack Router loaders prefetch into TanStack Query cache; components subscribe via `useSuspenseQuery`. Mutations invalidate by query-key prefix to trigger live refetch.
4. **Storage buckets reuse the same permission enum** — the `uploads` bucket extracts `<schema>/<table>` from object path tokens and checks `has_permission()` at the storage layer.

---

## 2. Tech Stack & Commands

**Runtime:** React 19, Vite 7, TanStack Router (file-based + auto code-split), TanStack Query 5, TanStack Form, TanStack Table, Tailwind v4, shadcn/ui (Base UI variant), Lexical (rich text), Recharts, dnd-kit, Sonner toasts, Zod, `@supabase/supabase-js` v2.

**Backend:** Supabase (Postgres + Auth + Storage + Deno edge functions).

**Scripts** (in `package.json`):

| Script      | Command                              | Purpose                       |
| ----------- | ------------------------------------ | ----------------------------- |
| `dev`       | `vite dev --port 3000`               | Dev server on :3000           |
| `build`     | `vite build`                         | Production build              |
| `preview`   | `vite preview`                       | Preview the prod build        |
| `test`      | `vitest run`                         | Unit tests (jsdom)            |
| `lint`      | `eslint`                             | Lint (TanStack ESLint config) |
| `typecheck` | `tsc --noEmit`                       | Type-check only               |
| `format`    | `prettier --check .`                 | Verify formatting             |
| `check`     | `prettier --write . && eslint --fix` | Format + autofix (mutates)    |

**Path aliases** (`tsconfig.json` + `package.json#imports` + `vite-tsconfig-paths`): `#/*` → `./src/*` (primary), `@/*` → `./src/*` (shadcn convention). Always use `#/...` when adding imports.

**Environment** (`.env.example`):

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

These can be overridden at runtime via `localStorage` keys `supabase-url` and `supabase-pubkey` (multi-tenant support — see `src/lib/supabase/client.ts`).

---

## 3. Repository Map

```
src/
  components/                # UI by feature module
    auth/                    # sign-in, sign-up, MFA, password reset
    account/                 # current-user profile/security/identities
    audit-logs/              # audit log viewer
    chart/                   # chart rendering (recharts)
    dashboard/               # dashboard widget composition
    data-table/              # generic TanStack Table wrapper, toolbar, filters
    editor/                  # Lexical rich-text editor
    layouts/                 # sidebar, header, nav, module switcher
    report/                  # tabular reports
    resource/                # the heart: dynamic CRUD (table/forms/views/cells/fields)
    role-permissions/        # admin: role <-> permission mgmt
    storage/                 # bucket browser, upload UI
    user-roles/              # admin: user <-> role mgmt
    users/                   # admin: user CRUD via edge fns
    ui/                      # shadcn/ui primitives (Base UI variant)
    theme-provider.tsx       # next-themes wrapper
  config/                    # SYSTEM_SCHEMAS, METADATA_COLUMNS, data-table operators
  hooks/                     # use-permissions, use-user, use-data-table, use-file-upload, use-mobile
  integrations/
    tanstack-query/          # singleton QueryClient + provider + devtools plugin
  lib/
    columns.tsx              # Postgres data_type/format -> field type mapping
    data-table.ts            # filter encode/decode, operator sets per variant
    database-meta.types.ts   # branded Schema/Table/View/Column types + metadata
    database.types.ts        # GENERATED — supabase gen types (do not edit)
    files.ts, format.ts, export.ts, utils.ts, composition.tsx
    supabase/
      client.ts              # createClient<Database>(...)
      filter.ts              # ColumnFiltersState -> Postgrest .filter() chain
      data/                  # queryOptions / mutationOptions per domain:
                             # auth.ts, resource.ts, users.ts, storage.ts,
                             # chart.ts, dashboard.ts, report.ts, security.ts,
                             # identities.ts, admin-auth.ts, core.ts
  routes/                    # TanStack Router (file-based)
    __root.tsx               # auth guard, providers, devtools
    index.tsx, init.tsx
    auth/                    # /auth/sign-in, /auth/sign-up, /auth/mfa, ...
    account/                 # /account/profile, /account/security, ...
    core/                    # /core/users, /core/user_roles, /core/role_permissions,
                             #     /core/audit_logs, /core/notifications
    storage/$bucketId/       # bucket browser
    $schema/                 # schema-scoped layout (RBAC gate here)
      route.tsx              # beforeLoad: load permissions for $schema or notFound
      index.tsx, dashboard/, chart/, report/$report/, sql-editor/$snippet/
      resource/$resource/    # dynamic CRUD:
        index.tsx            # list (table view + pagination/sort/filter via search params)
        new.tsx              # create form
        update/$.tsx         # edit form (splat for composite PKs joined with __)
        detail/$.tsx         # detail + related tables (section-aware in read mode)
        grid.tsx             # react-data-grid alt
        calendar/$calendarId, kanban/$kanbanId, gallery/$galleryId
  router.tsx                 # createTanStackRouter({ routeTree, context, ... })
  main.tsx                   # mount #app, wires router
  routeTree.gen.ts           # GENERATED — by @tanstack/router-plugin (do not edit)

supabase/
  migrations/                # ordered SQL — chronological + bookend meta files
  functions/                 # Deno edge functions
    _shared/admin.ts         # createAdminClient, requirePermission, CORS helpers
    admin-{create,list,get,update,delete,invite}-user, admin-generate-link
  examples/                  # seed schemas: desk, blog, store (+ *_seed.sql)
```

---

## 4. The Mental Model — Invariants You Must Internalize

1. **Every user-facing table has RLS enabled.** Policies almost always read `supasheet.has_permission('<schema>.<table>:<action>')`. Adding a table without policies = invisible to authenticated users.
2. **Permissions are an enum, not strings.** New tables require extending `supasheet.app_permission` (`ALTER TYPE ... ADD VALUE`) inside a `BEGIN/COMMIT` block, then seeding `supasheet.role_permissions` rows for the roles that should access them.
3. **Roles do not auto-attach to new users.** Auto-assignment is intentionally commented out at the bottom of `20250523000822_roles.sql`. The very first `x-admin` must be inserted manually (or via seed). New users have **zero** permissions until you seed `user_roles`.
4. **The `supasheet` schema is introspection-only from the UI's perspective.** `get_tables`, `get_views`, `get_columns`, `get_permissions`, `get_widgets`, `get_charts`, `get_reports` are how the frontend discovers what to render. They all permission-check internally.
5. **JSON in `COMMENT ON TABLE/COLUMN/VIEW` is structured metadata, not free text.** Keys like `display`, `icon`, `label`, `type`, `query`, `items`, `enums`, `progress` drive UI behavior. Plain-text comments still work; absent keys fall back to defaults.
6. **Mutations don't return data — invalidations do.** All resource mutations call `queryClient.invalidateQueries({ queryKey: ["supasheet", "resource-data", schema, resource] })`. The component re-renders because of `useSuspenseQuery`, not because the mutation returned a row.
7. **Edge functions are public URLs gated by `requirePermission()`.** Any admin operation (create user, invite, generate link) is a Deno function that itself checks `has_permission()` via the user's JWT before invoking the service-role admin API.

---

## 5. Database Layer

### 5.1 Schemas

| Schema      | Purpose                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `supasheet` | System schema: meta tables/views, RBAC, audit, custom types, helper RPCs. UI calls these via `supabase.schema("supasheet").rpc(...)`. |
| `public`    | Default Postgres schema. Treat like any other user schema.                                                                            |
| `auth`      | Supabase Auth-managed. Triggered by `on_auth_user_created` to mirror into `supasheet.users`.                                          |
| `storage`   | Supabase Storage-managed. We add policies to `storage.objects` for our buckets.                                                       |
| `<custom>`  | App schemas (see `supabase/examples/desk.sql`, `blog.sql`, `store.sql`). One schema per business domain.                              |

`SYSTEM_SCHEMAS = ["supasheet"]` (`src/config/database.config.ts`). The UI relabels `supasheet` → `core` in some contexts.

### 5.2 Meta schema & introspection (00000000000000_meta.sql, 99999999999999_meta.sql)

The two "bookend" meta migrations sandwich all your work. The first one builds the introspection infrastructure; the last one defines the public-facing RPCs.

**Generator functions** (run on demand, also called by event triggers):

- `supasheet.generate_tables()` — every table with RLS state, primary keys, FK relationships
- `supasheet.generate_columns()` — every column with type, default, nullability, identity, enums, comment
- `supasheet.generate_views()` — views with `is_updatable`
- `supasheet.generate_materialized_views()` — matviews with `is_populated`

**Snapshot tables** (refreshed by event triggers): `supasheet.tables`, `.columns`, `.views`, `.materialized_views`. Don't query these directly from the UI; use the RPCs below.

**Event triggers** keep snapshots in sync: `table_creation_trigger`, `table_deletion_trigger`, `table_alteration_trigger`, `comment_trigger`, `enum_alteration_trigger`. These mean **after every migration the meta snapshots are current** with no manual refresh.

**Public-facing RPCs** (`SECURITY DEFINER`, all permission-filtered):

| RPC                                      | Returns                                    | Used by                            |
| ---------------------------------------- | ------------------------------------------ | ---------------------------------- |
| `get_schemas()`                          | distinct schemas the user has any perm on  | module switcher                    |
| `get_tables(schema_name?, table_name?)`  | tables w/ pks, fks, RLS state              | resource list, table view          |
| `get_views(schema_name?, view_name?)`    | views w/ comment metadata                  | dashboard, chart, report discovery |
| `get_materialized_views(...)`            | matviews                                   | same                               |
| `get_columns(schema_name?, table_name?)` | columns ordered by `ordinal_position`      | form generation, cell rendering    |
| `get_related_tables(schema, table)`      | FK-related tables + their columns          | "related records" panel            |
| `get_permissions(schema?)`               | permissions current user holds             | RBAC UI gating                     |
| `get_widgets(schema?)`                   | views with comment `type=dashboard_widget` | dashboard page                     |
| `get_charts(schema?)`                    | views with comment `type=chart`            | chart page                         |
| `get_reports(schema?)`                   | views with comment `type=report`           | report page                        |

All RPCs are `REVOKE ALL FROM public, anon, authenticated, service_role` then `GRANT EXECUTE TO authenticated`. The meta snapshot tables themselves are **not** granted to users.

### 5.3 Custom types & domains (20250405004232_data_types.sql)

Use these in your tables instead of raw `text`/`numeric` so the UI picks the right field component:

| Type / domain           | Definition                                         | UI field                 |
| ----------------------- | -------------------------------------------------- | ------------------------ |
| `supasheet.FILE_OBJECT` | `(name, type, size, url, last_modified)` composite | n/a (used inside FILE)   |
| `supasheet.FILE`        | `FILE_OBJECT[]`                                    | multi-file uploader      |
| `supasheet.AVATAR`      | single `FILE_OBJECT`                               | single-image uploader    |
| `supasheet.EMAIL`       | `text` domain                                      | email input              |
| `supasheet.TEL`         | `text` domain                                      | tel input                |
| `supasheet.URL`         | `text` domain                                      | url input                |
| `supasheet.RATING`      | `real` constrained 0–5                             | star rating              |
| `supasheet.PERCENTAGE`  | `real`                                             | percentage input         |
| `supasheet.DURATION`    | `bigint`                                           | duration picker          |
| `supasheet.COLOR`       | `varchar(16)`                                      | color picker             |
| `supasheet.RICH_TEXT`   | `text`                                             | Lexical rich-text editor |

Field-type detection lives in `src/lib/columns.tsx` (`getColumnMetadata`).

### 5.4 Users & auth sync (20250523000814_users.sql)

`supasheet.users` columns: `id` (PK, FK→`auth.users`), `name`, `email`, `picture_url`, `created_at`, `updated_at`, `created_by`, `updated_by`, `public_data jsonb`.

**Triggers:**

- `on_auth_user_created` (AFTER INSERT on `auth.users`) → `supasheet.new_user_created_setup()` mirrors into `supasheet.users` (name from raw user metadata or email; picture_url from `avatar_url`).
- `on_auth_user_updated` (AFTER UPDATE OF email on `auth.users`) → propagates email changes.
- `protect_user_fields` (BEFORE UPDATE on `supasheet.users`) → blocks authenticated/anon clients from changing `id` or `email`.

**Storage:** bucket `account_image` (public). Policy: users can only write under `account_image/<their_uuid>/...`. Helper: `supasheet.get_storage_filename_as_uuid(name)`.

### 5.5 RBAC system (20250523000822_roles.sql)

**Enums:**

- `supasheet.app_role`: `'x-admin'`, `'admin'`, `'user'`
- `supasheet.app_permission`: starts with 13 entries for `supasheet.users`, `supasheet.user_roles`, `supasheet.role_permissions` × CRUD/invite/ban/generate_link. Extended over time (audit_logs adds `supasheet.audit_logs:select`; example schemas add `<schema>.<table|view>:<action>`).

**Tables:**

- `supasheet.user_roles (id, user_id → supasheet.users, role)` — UNIQUE(user_id, role).
- `supasheet.role_permissions (id, role, permission)` — UNIQUE(role, permission).

**Helper functions** (`SECURITY DEFINER STABLE`, granted to authenticated):

```sql
supasheet.has_permission(requested_permission supasheet.app_permission) returns boolean
-- exists(role_permissions JOIN user_roles WHERE ur.user_id = auth.uid()
--                                          AND rp.permission = requested_permission)

supasheet.has_role(requested_role supasheet.app_role) returns boolean
-- exists(user_roles WHERE user_id = auth.uid() AND role = requested_role)
```

Use **`has_permission` in RLS policies**, not `has_role`. Roles are an organizing layer; permissions are what's checked.

**Policy pattern (apply to every new table):**

```sql
ALTER TABLE my_schema.my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select" ON my_schema.my_table FOR SELECT TO authenticated
  USING (supasheet.has_permission('my_schema.my_table:select'));
CREATE POLICY "insert" ON my_schema.my_table FOR INSERT TO authenticated
  WITH CHECK (supasheet.has_permission('my_schema.my_table:insert'));
CREATE POLICY "update" ON my_schema.my_table FOR UPDATE TO authenticated
  USING (supasheet.has_permission('my_schema.my_table:update'));
CREATE POLICY "delete" ON my_schema.my_table FOR DELETE TO authenticated
  USING (supasheet.has_permission('my_schema.my_table:delete'));
```

**Owner-scoped variant** (e.g. `blog.authors`): combine with `auth.uid() = user_id`.

**Seeding x-admin permissions:** the migration ends with 13 `INSERT INTO supasheet.role_permissions` rows for `'x-admin'`. Every new feature migration must append its own seed inserts for whichever roles should get access.

### 5.6 Audit logs (20250928062812_audit_logs.sql)

Table `supasheet.audit_logs` stores per-row change history with: `operation` (`INSERT|UPDATE|DELETE`), `schema_name`, `table_name`, `record_id` (assumes target table has an `id` column), `created_by`, `role`, `user_type` (`system|real_user`), `metadata jsonb`, `old_data jsonb`, `new_data jsonb`, `changed_fields text[]`, `is_error`, `error_message`, `error_code`. Indexed for chronological + per-user + per-record queries.

**Trigger function:** `supasheet.audit_trigger_function()` — converts OLD/NEW to JSONB, extracts `record_id` from the `id` field, calls `supasheet.create_audit_log()` (which computes `changed_fields` for UPDATE).

**Attach to any table you want audited:**

```sql
CREATE TRIGGER audit_<table_name>
AFTER INSERT OR UPDATE OR DELETE ON <schema>.<table>
FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();
```

**RLS:** users see their own audit rows OR everyone's if they have `supasheet.audit_logs:select`.

**Caveats:** the trigger assumes the target table has an `id` column. If your PK is composite or named differently, `record_id` will be NULL.

### 5.7 Storage buckets

Three buckets defined across migrations:

| Bucket          | Public? | Read                                           | Write                                                        |
| --------------- | ------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `account_image` | yes     | anyone                                         | only owner under `<bucket>/<user_id>/...`                    |
| `public`        | yes     | anyone                                         | authenticated; update/delete only by `owner_id = auth.uid()` |
| `personal`      | no      | only `owner_id = auth.uid()`                   | only owner                                                   |
| `uploads`       | yes     | `has_permission('<path[1]>.<path[2]>:select')` | same pattern with `:insert`/`:update`/`:delete`              |

The **`uploads` bucket** is the interesting one. Its policies extract the path tokens and dynamically build the permission string:

```sql
CREATE POLICY enable_read_authorized_uploads_objects ON storage.objects
AS PERMISSIVE FOR SELECT TO authenticated
USING (
    bucket_id = 'uploads' AND supasheet.has_permission(
        format('%s.%s:select', path_tokens[1], path_tokens[2])::supasheet.app_permission
    )
);
```

So uploading `desk/tasks/file.pdf` requires `desk.tasks:insert`. **The cast to `supasheet.app_permission` will throw if the permission enum value doesn't exist** — only valid `<schema>.<table>` paths work.

### 5.8 Dashboard / chart / report discovery

Views (or matviews) with a JSON comment opt into the corresponding screen:

```sql
COMMENT ON VIEW desk.task_summary IS '{
  "type": "dashboard_widget",
  "icon": "BarChartIcon",
  "label": "Task Summary"
}';
```

Allowed `type` values: `"dashboard_widget"`, `"chart"`, `"report"`. The corresponding RPCs (`get_widgets`, `get_charts`, `get_reports`) filter by this and check `<schema>.<view_name>:select` permission.

For block-level (full-page) display in resource lists, use `"display": "block"` (default for tables; views must opt in).

### 5.9 Migration conventions

- **Filename:** `<YYYYMMDDhhmmss>_<name>.sql`. The two meta files use bookend timestamps: `00000000000000_meta.sql` (first) and `99999999999999_meta.sql` (last).
- **Order matters.** The trailing meta file must run after every other migration so its event-trigger-driven snapshots see the final state.
- **Enum changes are wrapped:** `BEGIN; ALTER TYPE ... ADD VALUE ...; COMMIT;` — Postgres won't allow new enum values to be used in the same transaction otherwise.
- **Always include comment metadata** for any table/column/view a user will see in the UI; absent metadata yields a generic-looking screen.
- **Always seed `role_permissions`** at the end of any migration that adds new permission enum values.
- Examples to crib from: `supabase/examples/desk.sql` (multi-table app w/ charts + dashboards), `blog.sql` (owner-scoped multi-row), `store.sql` (custom types — FILE, RICH_TEXT — and column-level enum metadata).

---

## 6. Frontend Layer

### 6.1 Routing (`src/routes/`)

File-based via `@tanstack/router-plugin/vite` → emits `routeTree.gen.ts`. **Never edit the generated tree.** Add a route by creating the file; the plugin regenerates.

**Root** (`__root.tsx`): typed context `{ queryClient }`; `beforeLoad` reads `authUserQueryOptions` from cache and redirects unauthenticated users to `/auth/sign-in?redirect=...` unless on an auth path. Then ensures `userQueryOptions(authUser.id)`. Returns `{ authUser, user }` into context.

**`$schema/route.tsx`** (the RBAC gate): `beforeLoad` calls `userPermissionsQueryOptions(params.schema)`. If the user has zero permissions for the schema, throws `notFound()`. Returns `{ permissions }` into context — descendants read it via `useHasPermission` (see 6.4).

**`$schema/resource/$resource/index.tsx`** (the dynamic CRUD list): validates `?sortId=&sortDesc=&page=&pageSize=&filters=...` search params (Zod), declares `loaderDeps` so the query key changes on search-param change, prefetches `resourceDataQueryOptions(...)` plus awaits `tableSchemaQueryOptions` and `columnsSchemaQueryOptions` (immutable). Returns the schema/columns; component subscribes to data via `useSuspenseQuery`.

**Composite primary keys:** `update/$.tsx` and `detail/$.tsx` use **splat params** joined with `__`. Helper `parsePkSplat(splat, primaryKeys)` (in `src/lib/...`) splits and zips into `Record<colName, value>`.

### 6.2 Data fetching — the two-layer pattern

```ts
// LOADER: prefetches, returns only IMMUTABLE schema/metadata
loader: async ({ context, params, deps }) => {
  const [tableSchema, columnsSchema] = await Promise.all([
    context.queryClient.ensureQueryData(
      tableSchemaQueryOptions(schema, resource)
    ),
    context.queryClient.ensureQueryData(
      columnsSchemaQueryOptions(schema, resource)
    ),
  ])
  // fire-and-forget prefetch of mutable data
  context.queryClient.ensureQueryData(
    resourceDataQueryOptions(schema, resource, ...deps)
  )
  return { tableSchema, columnsSchema } // do NOT return mutable data here
}

// COMPONENT: reads schema from useLoaderData; subscribes to mutable data
function RouteComponent() {
  const { tableSchema, columnsSchema } = Route.useLoaderData()
  const search = Route.useSearch()
  const { data } = useSuspenseQuery(
    resourceDataQueryOptions(schema, resource, ...search)
  )
}
```

**Why:** `useLoaderData()` is a static snapshot — invalidations don't refresh it. `useSuspenseQuery` subscribes to the cache, so `invalidateQueries` after a mutation triggers re-render. **Never return mutable data from a loader.**

### 6.3 Mutations & invalidation

All resource mutations live in `src/lib/supabase/data/resource.ts` as `mutationOptions`. After awaiting `mutateAsync`, **always invalidate by query-key prefix:**

```ts
queryClient.invalidateQueries({
  queryKey: ["supasheet", "resource-data", schema, resource],
})
```

The shared prefix `["supasheet", "resource-data", schema, resource]` matches the list query, single query, and all paginated/filtered variants. Drop or extend the array to scope tighter (e.g. `[..., "single", pk]` for one record only).

Surface errors via `toast.error(error?.message)` (Sonner). Success: `toast.success(...)` then `navigate(...)`.

### 6.4 Permission enforcement

**Two layers:**

1. **Route guard** — in `beforeLoad`:
   ```ts
   beforeLoad: ({ context, params }) => {
     if (
       !context.permissions?.some(
         (p) => p.permission === `${params.schema}.${params.resource}:insert`
       )
     )
       throw notFound()
   }
   ```
2. **UI gate** — `useHasPermission(permission: AppPermission)` from `src/hooks/use-permissions.ts`:
   ```ts
   const canDelete = useHasPermission(`${schema}.${resource}:delete`);
   {canDelete && <DeleteButton />}
   ```

`useHasPermission` walks `useRouterState().matches` to find the closest match with a `permissions` field on its context (set by `$schema/route.tsx`). If no schema match is found, returns `false`.

The DB still enforces via RLS — UI gating is for UX only.

### 6.5 Forms (TanStack Form)

`src/components/resource/form-hook.ts` exports `useAppForm` via `createFormHook` with shared field/form contexts. Forms iterate over `columnsSchema`, filter through `isSkippedForCreate`/`isSkippedForUpdate`, and render one `<ResourceFormField>` per column. The field renders the appropriate input by branching on `getColumnMetadata(...).fieldType`.

**Field type map** (from `src/lib/columns.tsx`):

| Postgres `format`           | UI field        |
| --------------------------- | --------------- |
| `boolean`                   | checkbox        |
| `date` / `time`             | date / time     |
| `timestamp` / `timestamptz` | datetime        |
| `uuid`                      | uuid input      |
| `int*`/`float*`/`numeric`   | number          |
| custom domain `RATING`      | star rating     |
| custom domain `RICH_TEXT`   | Lexical editor  |
| custom domain `FILE`        | multi-file      |
| custom domain `AVATAR`      | single image    |
| `ARRAY`                     | tag/array input |
| enum                        | select          |
| (default)                   | text            |

Submit pattern:

```ts
const { mutateAsync } = useMutation(
  insertResourceMutationOptions(schema, table)
)
const form = useAppForm({
  defaultValues,
  onSubmit: async ({ value }) => {
    try {
      await mutateAsync(buildCreatePayload(value, writableCols))
    } catch (e: any) {
      toast.error(e?.message)
      return
    }
    queryClient.invalidateQueries({
      queryKey: ["supasheet", "resource-data", schema, table],
    })
    toast.success("Record created")
    navigate({
      to: "/$schema/resource/$resource",
      params: { schema, resource: table },
    })
  },
})
```

### 6.6 Metadata-driven UI

JSON in table comments is parsed via `JSON.parse(comment ?? "{}")` everywhere. The shape is loosely typed in `src/lib/database-meta.types.ts`:

```ts
type TableMetadata = {
  display?: "block" | "none";
  icon?: string;                                     // Lucide icon name
  label?: string;
  query?: {
    sort?: { id: string; desc: boolean }[];
    filter?: ColumnFiltersState;
    join?: { table: string; on: string; columns: string[] }[];
  };
  primaryItem?: string;
  items?: { id: string; name: string; type: "calendar" | "kanban" | "gallery"; query?: any }[];
  sections?: FieldSection[];                         // form layout — see §6.5.1
};

type ColumnEnumMetadata = {
  progress?: boolean;
  enums?: Record<string, { icon?: string; variant: "default" | "secondary" | "success" | ... }>;
};
```

When you add UI features that need configuration, add them to a comment, not a config table.

### 6.5.1 Form layout (`TableMetadata.sections`)

Without `sections`, new/update forms render every writable column in a single Card stack at `max-w-2xl`, and `detail/$.tsx` renders the legacy `<ResourceDetailView>` + `<ResourceMetadataView>` Card pair. With `sections` defined, all three pages switch to the same multi-Card CSS-columns flow (`columns-1 gap-4 lg:columns-2`, `break-inside-avoid` per Card) at `max-w-7xl` — keeping new/detail/update visually consistent.

```ts
type FormMode = "create" | "update" | "read"

type FieldSectionFields =
  | string[] // same fields in all modes
  | Partial<Record<FormMode, string[]>> // per-mode fields

type FieldSection = {
  id: string // stable key
  title: string
  description?: string // optional helper text under title
  icon?: string // Lucide icon name
  fields: FieldSectionFields // column names per mode; unknown -> warn + skip
  collapsible?: boolean // true => Card starts collapsed
}

// On TableMetadata:
//   sections?: FieldSection[]
```

`fields` accepts two shapes:

- **`string[]`** — the same column set is shown in create, update, and read modes.
- **`{ create?: string[]; update?: string[]; read?: string[] }`** — declare each mode independently. Use this when (e.g.) a column should be settable at create time but immutable later, or visible in the read view but not in any form.

**Rendering rules** (in `src/components/resource/resource-form-layout.tsx` for create/update; in `src/routes/$schema/resource/$resource/detail/$.tsx` + `src/components/resource/view/resource-section-detail.tsx` for read):

- 0 sections → preserves the old layout (single-Card form for new/update; legacy `<ResourceDetailView>` for detail). No behavior change for unmigrated tables.
- 1 section (after mode resolution, forms only) → single Card centered at `max-w-3xl`.
- 2+ sections → CSS multi-column flow (`columns-1 gap-4 lg:columns-2`, `break-inside-avoid` per Card). Footer (forms) or relations (detail) rendered below the flow.
- A section with zero fields for the current mode is dropped from the render entirely.
- `collapsible: true` → Card wrapped in `<Collapsible defaultOpen={false}>`; trigger lives in the CardHeader.
- **Strict membership:** columns NOT named in any section's mode list are NOT rendered. Curating `sections` is opt-in; once you define it, you own the full set of fields per mode. Adding a column to the table later requires updating the relevant mode's `fields` to expose it.
- Unknown / duplicate field references log a `console.warn` and are skipped.
- The update form and detail page both render a separate "Identifiers" Card for primary keys when sections are defined (inline / regular detail otherwise). The detail page additionally renders `<ResourceMetadataView>` (timestamps) and one-to-one relationship cards inside the same flow, with many-to-many relationships in a `<Tabs>` block beneath.

**Example — uniform fields** (typical case, `desk.tasks`):

```jsonc
{
  "sections": [
    {
      "id": "summary",
      "title": "Summary",
      "fields": ["title", "description", "cover"],
    },
    {
      "id": "schedule",
      "title": "Schedule",
      "fields": ["status", "priority", "due_date", "completed_at"],
    },
    {
      "id": "organization",
      "title": "Organization",
      "fields": ["project_id", "tags", "is_important"],
    },
    {
      "id": "progress",
      "title": "Progress",
      "fields": ["completion", "duration"],
    },
    {
      "id": "extras",
      "title": "Attachments & notes",
      "description": "Files, color tag, and free-form notes",
      "collapsible": true,
      "fields": ["attachments", "color", "notes"],
    },
  ],
}
```

**Example — per-mode fields** (a slug that's settable at create but locked afterward; a `migrated_from` audit column visible only in read):

```jsonc
{
  "sections": [
    {
      "id": "identity",
      "title": "Identity",
      "fields": {
        "create": ["title", "slug"],
        "update": ["title"],
        "read": ["title", "slug", "migrated_from"],
      },
    },
  ],
}
```

**Logic helper:** `buildLayoutPlan(sections, availableNames, mode)` in `src/components/resource/resource-form-utils.ts` is the pure function that resolves the per-mode fields, deduplicates, and skips unknown references. Returns `null` to signal the fallback (single-Card) path. `getSectionFields(fields, mode)` extracts the list for a given mode regardless of which shape was used.

### 6.7 Filters & URL state

All table state — sort, page, page size, filters — round-trips through search params (`?sortId=...&sortDesc=...&page=...&filters=[...]`). `src/hooks/use-data-table.ts` syncs TanStack Table state ↔ navigation via `startTransition`.

**Filter encoding** (`src/lib/data-table.ts`): each filter value is `<operator>.<value>` (or `not.<operator>.<value>`). `decodeFilterValue` parses; `applyFilters` (`src/lib/supabase/filter.ts`) translates to Postgrest `.filter(col, op, val)` calls. Operators by variant: text (`ilike`, `eq`, `like`, `is`, ...), number (`eq`, `lt`, `gt`, ...), date, select, multiSelect, boolean, uuid.

---

## 7. Edge Functions (`supabase/functions/`)

All admin-\* functions follow the same shape:

```ts
import {
  corsHeaders,
  createAdminClient,
  errorResponse,
  jsonResponse,
  requirePermission,
} from "../_shared/admin.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders })
  const auth = req.headers.get("Authorization")
  const denied = await requirePermission(auth, "supasheet.users:invite")
  if (denied) return denied
  const admin = createAdminClient()
  const body = await req.json()
  const { data, error } = await admin.auth.admin.inviteUserByEmail(body.email, {
    data: body.data,
    redirectTo: body.redirectTo,
  })
  if (error) return errorResponse(error.message, 400)
  return jsonResponse(data, 201)
})
```

`_shared/admin.ts` provides:

- `createAdminClient()` — uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS).
- `createUserClient(authHeader)` — anon key + JWT, respects RLS.
- `getCallerId(authHeader)` → `string | null`.
- `requirePermission(authHeader, permission)` — calls `supasheet.has_permission` RPC; returns `Response` if denied, else `null`.
- `corsHeaders`, `jsonResponse(data, status?)`, `errorResponse(msg, status)`.

Existing functions: `admin-create-user` (POST), `admin-list-users` (POST, paginated), `admin-get-user` (GET `/:id`), `admin-invite-user` (POST), `admin-update-user` (PATCH `/:id`), `admin-delete-user` (DELETE `/:id`), `admin-generate-link` (POST). Each pinned to the corresponding `supasheet.users:*` permission.

Frontend invokes via `supabase.functions.invoke('admin-...', { body: ... })` — see `src/lib/supabase/data/admin-auth.ts`, `users.ts`.

---

## 8. How to Add New Functionality — Recipes

### Recipe A: Add a new schema with one CRUD-able table

```sql
-- supabase/migrations/<TS>_orders.sql
BEGIN;

CREATE SCHEMA IF NOT EXISTS shop;
GRANT USAGE ON SCHEMA shop TO authenticated;

ALTER TYPE supasheet.app_permission ADD VALUE 'shop.orders:select';
ALTER TYPE supasheet.app_permission ADD VALUE 'shop.orders:insert';
ALTER TYPE supasheet.app_permission ADD VALUE 'shop.orders:update';
ALTER TYPE supasheet.app_permission ADD VALUE 'shop.orders:delete';

COMMIT;  -- enum changes must commit before being usable

CREATE TABLE shop.orders (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  customer_email supasheet.EMAIL NOT NULL,
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes supasheet.RICH_TEXT,
  attachments supasheet.FILE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

COMMENT ON TABLE shop.orders IS '{"label":"Orders","icon":"ShoppingCartIcon","display":"block"}';
COMMENT ON COLUMN shop.orders.status IS '{"enums":{"pending":{"variant":"secondary"},"paid":{"variant":"success"},"cancelled":{"variant":"destructive"}}}';

GRANT SELECT, INSERT, UPDATE, DELETE ON shop.orders TO authenticated;
ALTER TABLE shop.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select" ON shop.orders FOR SELECT TO authenticated USING (supasheet.has_permission('shop.orders:select'));
CREATE POLICY "orders_insert" ON shop.orders FOR INSERT TO authenticated WITH CHECK (supasheet.has_permission('shop.orders:insert'));
CREATE POLICY "orders_update" ON shop.orders FOR UPDATE TO authenticated USING (supasheet.has_permission('shop.orders:update'));
CREATE POLICY "orders_delete" ON shop.orders FOR DELETE TO authenticated USING (supasheet.has_permission('shop.orders:delete'));

INSERT INTO supasheet.role_permissions (role, permission) VALUES
  ('x-admin','shop.orders:select'), ('x-admin','shop.orders:insert'),
  ('x-admin','shop.orders:update'), ('x-admin','shop.orders:delete');

-- (Optional) audit log
CREATE TRIGGER audit_shop_orders AFTER INSERT OR UPDATE OR DELETE ON shop.orders
  FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();
```

After running migrations, regenerate types: `supabase gen types typescript ... > src/lib/database.types.ts`. The UI route `/shop/resource/orders` now exists with no frontend code changes.

### Recipe B: Add a permission to an existing role

```sql
BEGIN; ALTER TYPE supasheet.app_permission ADD VALUE 'shop.orders:invite'; COMMIT;
INSERT INTO supasheet.role_permissions (role, permission) VALUES ('admin','shop.orders:invite');
```

To gate UI: `useHasPermission('shop.orders:invite' as AppPermission)`.

### Recipe C: Audit an existing table

```sql
CREATE TRIGGER audit_<table> AFTER INSERT OR UPDATE OR DELETE ON <schema>.<table>
  FOR EACH ROW EXECUTE FUNCTION supasheet.audit_trigger_function();
```

That's it. Logs appear in `/core/audit_logs` for users with `supasheet.audit_logs:select`.

### Recipe D: Add a chart, dashboard widget, or report

Charts/widgets/reports are just **views** with a JSON comment.

```sql
CREATE OR REPLACE VIEW shop.orders_by_status AS
  SELECT status, count(*) AS total, sum(total) AS revenue
  FROM shop.orders GROUP BY status;

COMMENT ON VIEW shop.orders_by_status IS '{
  "type": "chart",
  "label": "Orders by Status",
  "icon": "PieChartIcon"
}';

BEGIN; ALTER TYPE supasheet.app_permission ADD VALUE 'shop.orders_by_status:select'; COMMIT;
GRANT SELECT ON shop.orders_by_status TO authenticated;
INSERT INTO supasheet.role_permissions (role, permission) VALUES ('x-admin','shop.orders_by_status:select');
```

The view will appear under `/shop/chart/`. Use `"type":"dashboard_widget"` for dashboard tiles, `"type":"report"` for tabular reports.

### Recipe E: Add a new admin edge function

Copy `supabase/functions/admin-invite-user/` as a template. Always:

```ts
const denied = await requirePermission(
  req.headers.get("Authorization"),
  "<your.permission>"
)
if (denied) return denied
```

Then call `createAdminClient()` for service-role ops or `createUserClient(authHeader)` for RLS-respecting ops. Add the matching enum value + role grant in a migration.

---

## 9. Critical Gotchas

1. **Adding an enum value and using it in the same transaction will fail.** Always `BEGIN; ALTER TYPE ...; COMMIT;` before any `INSERT`/policy that references the new value.
2. **Forgetting to `GRANT` table privileges to `authenticated`.** RLS gates _visibility_; `GRANT` gates _access at all_. Without both, the row is invisible.
3. **Tables without an `id` column won't audit cleanly.** `audit_trigger_function` reads `record_id := data->>'id'`. Composite or differently-named PKs will store NULL.
4. **The `uploads` bucket cast is unforgiving.** `path_tokens[1].path_tokens[2]:select` cast to `supasheet.app_permission` throws if the enum value doesn't exist. Always extend the enum _before_ uploading to a new schema/table path.
5. **Loaders must not return mutable data.** Return only schema/metadata; subscribe to mutable via `useSuspenseQuery`. Otherwise invalidations won't re-render.
6. **`useHasPermission` is scope-sensitive.** It only finds permissions if you're under a `$schema/...` route. In `core/...` or `account/...` routes there's no schema context — those screens use direct queries (e.g. `userPermissionsQueryOptions("supasheet")`).
7. **Auto-creating a default role for new users is intentionally disabled.** New auth users have zero permissions. The first admin must be inserted manually (or via a seed) with `('x-admin')`.
8. **Service-role keys bypass RLS — never use them client-side.** Edge functions use `SUPABASE_SERVICE_ROLE_KEY` only after `requirePermission()` succeeds. The browser only ever sees `VITE_SUPABASE_PUBLISHABLE_KEY`.
9. **Generated files are not source.** `src/routeTree.gen.ts` (router plugin) and `src/lib/database.types.ts` (`supabase gen types`) regenerate on every change. Don't edit them by hand.
10. **Path aliases:** prefer `#/...` (declared in `package.json#imports` + `tsconfig.json` paths). `@/...` works too (shadcn convention) but is the secondary alias.
11. **JSON comment metadata is silently lossy.** Bad JSON → the parser falls back to `{}` → the screen renders generically. There's no error. Validate your comments.
12. **Mutations don't auto-invalidate.** Always call `queryClient.invalidateQueries({...})` yourself; the mutation hook does nothing on success by default.

---

## 10. File Reference — "If you're touching X, read Y"

| Touching                      | Read first                                                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| New table / schema            | `supabase/examples/desk.sql`, `supabase/migrations/20250523000822_roles.sql`                                           |
| RBAC / permissions            | `supabase/migrations/20250523000822_roles.sql`, `src/hooks/use-permissions.ts`                                         |
| Audit log                     | `supabase/migrations/20250928062812_audit_logs.sql`, `src/lib/supabase/data/core.ts`                                   |
| Storage / file upload         | `supabase/migrations/20251005041214_general_storage.sql`, `20251005051303_uploads.sql`, `src/hooks/use-file-upload.ts` |
| Resource list / table view    | `src/routes/$schema/resource/$resource/index.tsx`, `src/components/resource/resource-table*.tsx`                       |
| Resource form (create/update) | `src/components/resource/resource-{new,update}-form.tsx`, `form-hook.ts`, `resource-form-field.tsx`                    |
| Field rendering               | `src/lib/columns.tsx` (type → field map), `src/components/resource/fields/*.tsx`                                       |
| Cell rendering (read-only)    | `src/components/resource/cells/*.tsx`                                                                                  |
| Filter operators              | `src/lib/data-table.ts`, `src/lib/supabase/filter.ts`, `src/config/data-table.ts`                                      |
| Query/mutation conventions    | `src/lib/supabase/data/resource.ts`, `core.ts`, `auth.ts`                                                              |
| Routing patterns              | `src/routes/__root.tsx`, `src/routes/$schema/route.tsx`, `src/router.tsx`                                              |
| Auth flow                     | `src/lib/supabase/data/auth.ts`, `src/routes/auth/*`                                                                   |
| Edge function template        | `supabase/functions/_shared/admin.ts`, `supabase/functions/admin-invite-user/index.ts`                                 |
| Custom Postgres types         | `supabase/migrations/20250405004232_data_types.sql`                                                                    |
| Meta introspection            | `supabase/migrations/00000000000000_meta.sql`, `99999999999999_meta.sql`                                               |
| Dashboard / chart / report    | `supabase/migrations/2025070703*_*.sql`, `src/components/{dashboard,chart,report}/*`                                   |
| TypeScript types from DB      | `src/lib/database.types.ts` (generated), `src/lib/database-meta.types.ts` (hand-written branded types)                 |
| Tailwind / shadcn theming     | `src/styles.css`, `components.json`, `src/components/theme-provider.tsx`                                               |

---

## Appendix: Quick Snippets

**Read user permissions in a non-schema route:**

```ts
const { data: permissions } = useSuspenseQuery(
  userPermissionsQueryOptions("public")
)
```

**Invoke an edge function:**

```ts
const { data, error } = await supabase.functions.invoke("admin-invite-user", {
  body: { email, redirectTo: `${window.location.origin}/auth/sign-in` },
})
```

**Query with a join (Postgrest embedding via `query.join` in table comment):**

```sql
COMMENT ON TABLE shop.orders IS '{
  "query": { "join": [ { "table": "users!created_by(id,name)", "on": "created_by=id", "columns": ["name"] } ] }
}';
```

**Force a cache miss after external mutation:**

```ts
queryClient.invalidateQueries({ queryKey: ["supasheet", "resource-data"] }) // all resources
queryClient.invalidateQueries({ queryKey: ["supasheet", "permissions"] }) // all schema perms
```
