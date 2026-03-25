---
name: router-core
description: >-
  TanStack Router expertise for file-based routing, route trees, auth guards,
  loaders, search params, navigation, code splitting, type safety, and error
  boundaries. Triggers when working with routes, createFileRoute,
  createRootRouteWithContext, beforeLoad, Link, useNavigate, or any
  @tanstack/react-router API.
user-invocable: false
---

# TanStack Router

> **CRITICAL**: TanStack Router types are FULLY INFERRED. Never cast, never annotate inferred values.
> **CRITICAL**: CLIENT-FIRST. Loaders run on the client by default. Do not confuse with Next.js/Remix.
> **CRITICAL**: `createFileRoute` path string must match the file path exactly — the Vite plugin manages this, do not edit manually.

## Current Project Context

**Stack:** TanStack Router v1 (file-based) + TanStack Query + Supabase auth

**Router setup** (`src/router.tsx`):

```tsx
export function getRouter() {
  return createTanStackRouter({
    routeTree,
    context: getContext(), // injects queryClient
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  })
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
```

**Root route context** (`src/routes/__root.tsx`):

```tsx
interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions)
    if (!user && !location.pathname.startsWith("/auth")) {
      throw redirect({ to: "/auth/sign-in" })
    }
    return { user }
  },
})
```

**Auth pattern:** Global auth guard in root `beforeLoad`. Auth routes live under `/auth/*`. Protected routes anywhere else — the root guard redirects unauthenticated users to `/auth/sign-in`.

**Route tree** (auto-generated at `src/routeTree.gen.ts` — never edit):

- `/` → `src/routes/index.tsx`
- `/auth` → `src/routes/auth/route.tsx` (layout)
- `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`
- `/update-password`
- `/account/profile`

**Imports:** Use `#/` alias for `src/` (e.g. `#/components/ui/button`, `#/lib/supabase/data/auth`)

## Decision Tree

```
Adding/reading URL query params?           → rules/search-params.md
Dynamic URL segments (/posts/$id)?         → rules/path-params.md
Creating links or navigating programmatically? → rules/navigation.md
Fetching data for a route?                 → rules/data-loading.md
Protecting routes / auth redirects?        → rules/auth-and-guards.md
Reducing bundle size per route?            → rules/code-splitting.md
404 pages or error boundaries?             → rules/not-found-and-errors.md
TypeScript issues with router types?       → rules/type-safety.md
SSR / hydration?                           → rules/ssr.md
```

## Critical Rules

### Route files always export `Route`

```tsx
// src/routes/account/profile.tsx
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/account/profile")({
  component: ProfilePage,
})
```

### `beforeLoad` for guards, `loader` for data

- `beforeLoad` — auth checks, redirects, context enrichment. Runs before loader.
- `loader` — fetch data for the route. Use `context.queryClient.ensureQueryData()` to integrate with TanStack Query.

```tsx
export const Route = createFileRoute("/account/profile")({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: "/auth/sign-in" })
  },
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(profileQueryOptions(context.user.id)),
  component: ProfilePage,
})
```

### `redirect()` must be thrown

```tsx
throw redirect({ to: "/auth/sign-in" }) // ✅
redirect({ to: "/auth/sign-in" }) // ❌ does nothing
```

### Redirects inside try/catch need `isRedirect`

```tsx
import { isRedirect } from "@tanstack/react-router"

beforeLoad: async ({ context }) => {
  try {
    await validateSession()
  } catch (e) {
    if (isRedirect(e)) throw e // re-throw or it gets swallowed
    throw redirect({ to: "/auth/sign-in" })
  }
}
```

### Access route data with route-scoped hooks

```tsx
function ProfilePage() {
  const data = Route.useLoaderData() // typed to this route's loader
  const { user } = Route.useRouteContext() // typed to this route's context
  const params = Route.useParams() // typed path params
  const search = Route.useSearch() // typed search params
}
```

### Pathless layout routes use `_` prefix

```
src/routes/_authenticated.tsx       → layout, no URL segment
src/routes/_authenticated/dashboard.tsx → URL: /dashboard
```

## Adding a New Route

1. Create `src/routes/<path>.tsx`
2. Export `Route` via `createFileRoute('<path>')({...})`
3. The Vite plugin auto-updates `src/routeTree.gen.ts`
4. Never edit `routeTree.gen.ts` manually

## Detailed Rules

| Topic              | File                                                             |
| ------------------ | ---------------------------------------------------------------- |
| Search params      | [rules/search-params.md](./rules/search-params.md)               |
| Path params        | [rules/path-params.md](./rules/path-params.md)                   |
| Navigation         | [rules/navigation.md](./rules/navigation.md)                     |
| Data loading       | [rules/data-loading.md](./rules/data-loading.md)                 |
| Auth and guards    | [rules/auth-and-guards.md](./rules/auth-and-guards.md)           |
| Code splitting     | [rules/code-splitting.md](./rules/code-splitting.md)             |
| Not found / errors | [rules/not-found-and-errors.md](./rules/not-found-and-errors.md) |
| Type safety        | [rules/type-safety.md](./rules/type-safety.md)                   |
| SSR                | [rules/ssr.md](./rules/ssr.md)                                   |
| Core concepts      | [rules/router-core.md](./rules/router-core.md)                   |
