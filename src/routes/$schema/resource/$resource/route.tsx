import { Outlet, createFileRoute } from "@tanstack/react-router"

import z from "zod"

import type {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
} from "#/lib/database-meta.types"
import { resourcePrivilegesQueryOptions } from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource")({
  params: z.object({
    schema: z.string<DatabaseSchemas>(),
    resource: z.string<
      DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>
    >(),
  }),
  beforeLoad: async ({ context, params: { schema, resource } }) => {
    const privileges = await context.queryClient.ensureQueryData(
      resourcePrivilegesQueryOptions(schema, resource)
    )
    return { privileges }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
