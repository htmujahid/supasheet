# Supasheet

A complete, opinionated open-source CMS platform built on Supabase. Goes beyond basic admin panels — everything included out of the box.

## Features

- **Authentication** — Sign in, sign up, MFA, password reset, OAuth providers
- **User Management** — Create, invite, edit, and delete users via Supabase Admin API
- **Authorization (RBAC)** — Role-based access control with user roles and role permissions
- **Resource (CRUD)** — Auto-generated CRUD views for any Supabase table
- **Data Views** — Sheet (table), Kanban, Calendar, and Gallery views per resource
- **Dashboard** — Configurable dashboard widgets
- **Analytics & Charts** — Area, bar, line, pie, radar chart types
- **Reports** — Tabular reports built from Supabase data
- **File Storage** — Browse, upload, rename, move, and preview files across Supabase Storage buckets
- **Audit Logs** — View and filter audit log entries

## Tech Stack

- **App:** React 19 + Vite
- **Routing:** TanStack Router (file-based, type-safe)
- **Data Fetching:** TanStack Query
- **Forms:** TanStack Form
- **Tables:** TanStack Table
- **UI:** shadcn/ui (Base UI variant) + Tailwind CSS v4
- **Rich Text:** Lexical
- **Charts:** Recharts
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)

## Project Structure

### `src/components/`

UI components organized by feature module — `auth/`, `resource/`, `storage/`, `dashboard/`, `chart/`, `report/`, `audit-logs/`, `users/`, `account/`, `layouts/`, `editor/`, `data-table/`. Base shadcn/ui primitives live in `ui/`.

### `src/config/`

App-level configuration constants (data table defaults, database config).

### `src/hooks/`

Shared React hooks used across modules (permissions, user, file upload, mobile detection, data table).

### `src/integrations/`

Third-party integration setup (e.g. TanStack Query provider and devtools under `tanstack-query/`).

### `src/lib/`

Utility functions, type helpers, and shared logic — formatting, field definitions, column builders, export utilities, etc.

#### `src/lib/supabase/`

All Supabase backend logic: `client.ts` (Supabase client), `filter.ts` (query filter builder), and `data/` containing query/mutation functions per domain (`auth.ts`, `resource.ts`, `users.ts`, `storage.ts`, `chart.ts`, `dashboard.ts`, `report.ts`, `security.ts`, `identities.ts`, `admin-auth.ts`).

### `src/routes/`

TanStack Router file-based pages, organized by module:

- `__root.tsx` — root layout and context
- `index.tsx` — app entry redirect
- `auth/` — authentication pages (sign-in, sign-up, MFA, forgot/update password)
- `account/` — current user settings (profile, security, identities, roles & permissions)
- `core/` — admin/management module: `users/` (list, create, invite, view, edit, danger zone), `user_roles/`, `role_permissions/`, `audit_logs/`, `notifications/`
- `storage/` — file storage browser per bucket (`$bucketId/`)
- `$schema/` — dynamic schema-scoped module (see below)

#### `src/routes/$schema/`

The main data module, scoped to a Supabase schema:

- `resource/$resource/` — CRUD for any table: list (`index`), create (`new`), update (`update/`), detail (`detail/`), plus alternate views: `kanban/`, `calendar/`, `gallery/`, `report`
- `dashboard/` — dashboard page
- `chart/` — charts page
- `report/$report/` — report page
- `sql-editor/$snippet/` — SQL editor page

## Data Fetching Pattern

Routes follow a two-layer pattern for data loading:

**Loader** — prefetches data into the TanStack Query cache via `ensureQueryData`. Does **not** return mutable data. Only returns schema/metadata that never changes (e.g. `tableSchema`, `columnsSchema`, `kanbanView`).

```ts
loader: async ({ context, params, deps }) => {
  // Guard: await and check, but don't return mutable data
  const record = await context.queryClient.ensureQueryData(dataQueryOptions(...))
  if (!record) throw notFound()

  // Prefetch mutable data into cache (fire and forget)
  context.queryClient.ensureQueryData(mutableDataQueryOptions(...))

  // Only return immutable schema/metadata
  return { tableSchema, columnsSchema }
}
```

**Component** — reads schema/metadata from `Route.useLoaderData()` and subscribes to mutable data via `useSuspenseQuery`. This ensures the component re-renders automatically when `invalidateQueries` is called after mutations.

```ts
function RouteComponent() {
  // Schema/metadata — static, from loader snapshot
  const { tableSchema, columnsSchema } = Route.useLoaderData()

  // Mutable data — live, subscribes to TanStack Query cache
  const { data } = useSuspenseQuery(mutableDataQueryOptions(...))
}
```

**Why:** `useLoaderData()` is a static snapshot that only updates when the route loader re-runs. `useSuspenseQuery` subscribes directly to the TanStack Query cache, so calling `queryClient.invalidateQueries(...)` after a mutation immediately refetches and re-renders the component.

**Mutation invalidation** — after any mutation, invalidate by query key prefix:

```ts
queryClient.invalidateQueries({
  queryKey: ["supasheet", "resource-data", schema, resource],
})
```

### `supabase/`

- `migrations/` — ordered SQL migration files (meta, data types, users, roles, dashboards, reports, charts, audit logs, storage, examples)
- `functions/` — Deno edge functions for admin user operations (`admin-create-user`, `admin-invite-user`, `admin-list-users`, `admin-get-user`, `admin-update-user`, `admin-delete-user`, `admin-generate-link`)
- `examples/` — example seed SQL files
