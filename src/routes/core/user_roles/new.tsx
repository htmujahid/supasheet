import { createFileRoute, notFound } from "@tanstack/react-router"

import { DefaultHeader } from "#/components/layouts/default-header"
import { Card, CardContent, CardFooter, CardHeader } from "#/components/ui/card"
import { Skeleton } from "#/components/ui/skeleton"
import { UserRolesForm } from "#/components/user-roles/user-roles-form"
import {
  columnsSchemaQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/core/user_roles/new")({
  head: () => ({ meta: [{ title: "New User Role | Supasheet" }] }),
  beforeLoad: ({ context }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === "supasheet.user_roles:insert"
      )
    )
      throw notFound()
  },
  loader: async ({ context }) => {
    const tableSchema = await context.queryClient.ensureQueryData(
      tableSchemaQueryOptions("supasheet", "user_roles")
    )
    if (!tableSchema) throw notFound()
    const columnsSchema = await context.queryClient.ensureQueryData(
      columnsSchemaQueryOptions("supasheet", "user_roles")
    )
    if (!columnsSchema) throw notFound()
    return { columnsSchema, tableSchema }
  },
  pendingComponent: () => (
    <>
      <DefaultHeader
        breadcrumbs={[
          { title: "User Roles", url: "/core/user-roles" },
          { title: "New" },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4">
            <Card>
              <CardHeader className="border-b">
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4 py-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-end gap-2 border-t pt-4">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-16" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { columnsSchema, tableSchema } = Route.useLoaderData()

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          { title: "User Roles", url: "/core/user-roles" },
          { title: "New" },
        ]}
      />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-4">
            <UserRolesForm
              columnsSchema={columnsSchema}
              tableSchema={tableSchema}
            />
          </div>
        </div>
      </div>
    </>
  )
}
