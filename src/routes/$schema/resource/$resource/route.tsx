import { Outlet, createFileRoute } from "@tanstack/react-router"

import z from "zod"

import { ResourceFormSheetProvider } from "#/components/resource/resource-form-sheet-provider"
import type {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
} from "#/lib/database-meta.types"

export const Route = createFileRoute("/$schema/resource/$resource")({
  params: z.object({
    schema: z.string<DatabaseSchemas>(),
    resource: z.string<
      DatabaseTables<DatabaseSchemas> | DatabaseViews<DatabaseSchemas>
    >(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ResourceFormSheetProvider>
      <Outlet />
    </ResourceFormSheetProvider>
  )
}
