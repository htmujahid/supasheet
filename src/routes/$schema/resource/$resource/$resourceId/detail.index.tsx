import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { ResourceFullDetail } from "#/components/resource/detail/resource-full-detail"
import { ResourceUpdateForm } from "#/components/resource/resource-update-form"
import { useHasPermission } from "#/hooks/use-permissions"
import { isTableSchema } from "#/lib/database-meta.types"
import {
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

const parentRoute = getRouteApi(
  "/$schema/resource/$resource/$resourceId/detail"
)

export const Route = createFileRoute(
  "/$schema/resource/$resource/$resourceId/detail/"
)({
  loader: async ({ context, params }) => {
    const { schema, resource, resourceId } = params
    const tableSchema = await context.queryClient.ensureQueryData(
      tableSchemaQueryOptions(schema, resource)
    )
    const primaryKeys = tableSchema?.primary_keys ?? []
    const pkName = primaryKeys[0]?.name ?? "id"
    const pk = { [pkName]: resourceId }
    const record = await context.queryClient.ensureQueryData(
      singleResourceDataQueryOptions(schema, resource, pk)
    )
    if (!record) throw notFound()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { schema, resource, resourceId } = Route.useParams()
  const { resourceSchema, columnsSchema, pkName, primaryKeys } =
    parentRoute.useLoaderData()

  const pk = { [pkName]: resourceId }
  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema, resource, pk)
  )

  const canUpdate = useHasPermission(`${schema}.${resource}:update`)

  if (!record) return null

  const tableSchema = isTableSchema(resourceSchema) ? resourceSchema : null
  const canEdit = !!tableSchema && primaryKeys.length > 0 && canUpdate

  if (canEdit) {
    return (
      <ResourceUpdateForm
        columnsSchema={columnsSchema}
        primaryKeys={primaryKeys}
        record={record}
        tableSchema={tableSchema}
        saveOnly
      />
    )
  }

  return (
    <ResourceFullDetail
      resourceSchema={resourceSchema}
      columnsSchema={columnsSchema}
      record={record}
    />
  )
}
