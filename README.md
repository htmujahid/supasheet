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

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy `.env.example` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

3. Run the development server:

```bash
npm run dev
```

## Scripts

```bash
npx supabase start # Start local Supabase instance
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run check      # Format + lint fix
npm run test       # Run tests
```
