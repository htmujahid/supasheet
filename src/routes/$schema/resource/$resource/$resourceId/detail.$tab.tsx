import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { classifyRelationships } from "#/components/resource/detail/classify-relationships"
import { ResourceDetailTab } from "#/components/resource/detail/resource-detail-tab"
import { useHasPermission } from "#/hooks/use-permissions"
import type { PrimaryKey, TableMetadata } from "#/lib/database-meta.types"
import {
  relatedTablesSchemaQueryOptions,
  singleForeignTableDataQueryOptions,
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

const parentRoute = getRouteApi(
  "/$schema/resource/$resource/$resourceId/detail"
)

export const Route = createFileRoute(
  "/$schema/resource/$resource/$resourceId/detail/$tab"
)({
  loader: async ({ context, params }) => {
    const { schema, resource, resourceId, tab } = params
    const [tableSchema, relatedTablesSchema] = await Promise.all([
      context.queryClient.ensureQueryData(
        tableSchemaQueryOptions(schema, resource)
      ),
      context.queryClient.ensureQueryData(
        relatedTablesSchemaQueryOptions(schema, resource)
      ),
    ])
    const metaJoins = (JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata).query?.join
    const classification = classifyRelationships(
      schema,
      resource,
      relatedTablesSchema,
      metaJoins
    )

    const allowedTabs = (
      JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata
    ).tabs
    if (allowedTabs && !allowedTabs.includes(tab)) throw notFound()

    const oneToOne = classification.oneToOneRelationships.find(
      (r) => r.__embedKey === tab
    )
    if (oneToOne) {
      const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]
      const pkName = primaryKeys[0]?.name ?? "id"
      const pk = { [pkName]: resourceId }
      const parent = await context.queryClient.ensureQueryData(
        singleResourceDataQueryOptions(schema, resource, pk)
      )
      const matchValue = parent?.[oneToOne.__parentMatchColumn]
      if (matchValue != null) {
        await context.queryClient.ensureQueryData(
          singleForeignTableDataQueryOptions(oneToOne.schema, oneToOne.name, {
            [oneToOne.__foreignMatchColumn]: matchValue,
          })
        )
      }
      return
    }

    const many =
      classification.oneToManyRelationships.find((r) => r.name === tab) ??
      classification.manyToManyRelationships.find((r) => r.name === tab)
    if (!many) throw notFound()

    const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]
    const pkName = primaryKeys[0]?.name ?? "id"
    const pk = { [pkName]: resourceId }
    await context.queryClient.ensureQueryData(
      singleResourceDataQueryOptions(schema, resource, pk)
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { schema, resource, resourceId, tab } = Route.useParams()
  const {
    oneToOneRelationships,
    oneToManyRelationships,
    manyToManyRelationships,
    pkName,
  } = parentRoute.useLoaderData()

  const pk = { [pkName]: resourceId }

  const oneToOne = oneToOneRelationships.find((r) => r.__embedKey === tab)
  const many =
    oneToManyRelationships.find((r) => r.name === tab) ??
    manyToManyRelationships.find((r) => r.name === tab)

  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema, resource, pk)
  )

  const canUpdateOneToOne = useHasPermission(
    oneToOne ? `${oneToOne.schema}.${oneToOne.name}:update` : undefined
  )
  const canUpdateParent = useHasPermission(`${schema}.${resource}:update`)

  return (
    <ResourceDetailTab
      schema={schema}
      resource={resource}
      resourceId={resourceId}
      parentRecord={record}
      oneToOne={oneToOne}
      many={many}
      canUpdateOneToOne={canUpdateOneToOne}
      canUpdateParent={canUpdateParent}
    />
  )
}
