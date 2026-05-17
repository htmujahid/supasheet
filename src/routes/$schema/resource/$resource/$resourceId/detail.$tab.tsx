import { Suspense } from "react"

import {
  Outlet,
  createFileRoute,
  getRouteApi,
  notFound,
} from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { DataTableSkeleton } from "#/components/data-table/data-table-skeleton"
import { classifyRelationships } from "#/components/resource/detail/classify-relationships"
import { ResourceForeignTable } from "#/components/resource/detail/resource-foreign-table"
import { ResourceFullDetail } from "#/components/resource/detail/resource-full-detail"
import type {
  PrimaryKey,
  ResourceSchema,
} from "#/lib/database-meta.types"
import {
  relatedTablesSchemaQueryOptions,
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
    const classification = classifyRelationships(
      schema,
      resource,
      relatedTablesSchema
    )

    const oneToOne = classification.oneToOneRelationships.find(
      (r) => r.__embedKey === tab
    )
    if (oneToOne) {
      const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]
      const pkName = primaryKeys[0]?.name ?? "id"
      const pk = { [pkName]: resourceId }
      const join = (classification.joins ?? []).find(
        (j) => j.on === oneToOne.__fkColumn
      )
      await context.queryClient.ensureQueryData(
        singleResourceDataQueryOptions(schema, resource, pk, {
          join: join ? [join] : [],
        })
      )
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
    joins,
    pkName,
  } = parentRoute.useLoaderData()

  const pk = { [pkName]: resourceId }

  const oneToOne = oneToOneRelationships.find((r) => r.__embedKey === tab)
  const many =
    oneToManyRelationships.find((r) => r.name === tab) ??
    manyToManyRelationships.find((r) => r.name === tab)

  const join = oneToOne
    ? (joins ?? []).find((j) => j.on === oneToOne.__fkColumn)
    : undefined

  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema, resource, pk, {
      join: oneToOne && join ? [join] : [],
    })
  )

  if (oneToOne) {
    const embedded =
      (record?.[oneToOne.__embedKey] as Record<string, unknown>) ?? {}
    return (
      <>
        <ResourceFullDetail
          resourceSchema={
            {
              ...oneToOne,
              name: oneToOne.__embedKey,
            } as unknown as ResourceSchema
          }
          columnsSchema={oneToOne.columns ?? []}
          record={embedded}
        />
        <Outlet />
      </>
    )
  }

  if (!many) return null

  const parentValue = record?.[many.__targetColumn]

  return (
    <>
      <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
        <ResourceForeignTable
          schema={many.schema ?? schema}
          table={many.name}
          parentColumn={many.__parentColumn}
          parentValue={parentValue}
          resourceSchema={many}
          columnsSchema={many.columns ?? []}
          selectClause={many.__selectClause}
        />
      </Suspense>
      <Outlet />
    </>
  )
}
