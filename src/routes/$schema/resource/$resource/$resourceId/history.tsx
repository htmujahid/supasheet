import { Suspense } from "react"

import { createFileRoute, notFound } from "@tanstack/react-router"

import { HistoryIcon } from "lucide-react"

import { DataTableSkeleton } from "#/components/data-table/data-table-skeleton"
import { DefaultHeader } from "#/components/layouts/default-header"
import { ResourceForeignTable } from "#/components/resource/detail/resource-foreign-table"
import type { Relationship, TableMetadata } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import {
  columnsSchemaQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

function readHistoryMeta(comment: string | null | undefined) {
  if (!comment) return null
  try {
    const meta = JSON.parse(comment) as TableMetadata
    return meta.history ?? null
  } catch {
    return null
  }
}

export const Route = createFileRoute(
  "/$schema/resource/$resource/$resourceId/history"
)({
  beforeLoad: async ({ context, params: { schema, resource } }) => {
    const tableSchema = await context.queryClient.ensureQueryData(
      tableSchemaQueryOptions(schema, resource)
    )
    const history = readHistoryMeta(tableSchema?.comment)
    if (!history) throw notFound()
    const hasPerm = context.permissions?.some(
      (p) => p.permission === `${schema}.${history.table}:select`
    )
    if (!hasPerm) throw notFound()
    return { history }
  },
  loader: async ({ context, params: { schema, resource } }) => {
    const parentTableSchema = await context.queryClient.ensureQueryData(
      tableSchemaQueryOptions(schema, resource)
    )
    const history = readHistoryMeta(parentTableSchema?.comment)
    if (!history) throw notFound()

    const historyTable = history.table
    const [historyTableSchema, historyColumnsSchema] = await Promise.all([
      context.queryClient.ensureQueryData(
        tableSchemaQueryOptions(schema, historyTable)
      ),
      context.queryClient.ensureQueryData(
        columnsSchemaQueryOptions(schema, historyTable)
      ),
    ])
    if (!historyTableSchema) throw notFound()

    return {
      parentTableSchema,
      historyTableSchema,
      historyColumnsSchema,
    }
  },
  head: ({ params }) => ({
    meta: [
      {
        title: `History | ${formatTitle(params.resource)} | Supasheet`,
      },
    ],
  }),
  pendingComponent: PendingComponent,
  component: RouteComponent,
})

function PendingComponent() {
  const { schema, resource, resourceId } = Route.useParams()
  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: formatTitle(resource),
            url: `/${schema}/resource/${resource}/table`,
          },
          {
            title: resourceId.slice(0, 8) + "…",
            url: `/${schema}/resource/${resource}/${resourceId}/detail`,
          },
          { title: "History" },
        ]}
      />
      <div className="flex flex-1 flex-col p-4">
        <DataTableSkeleton columnCount={6} />
      </div>
    </>
  )
}

function RouteComponent() {
  const { schema, resource, resourceId } = Route.useParams()
  const { parentTableSchema, historyTableSchema, historyColumnsSchema } =
    Route.useLoaderData()

  const resourceTitle = parentTableSchema?.comment
    ? (() => {
        try {
          const meta = JSON.parse(parentTableSchema.comment) as TableMetadata
          return meta.name ?? formatTitle(resource)
        } catch {
          return formatTitle(resource)
        }
      })()
    : formatTitle(resource)

  const relationships = (historyTableSchema.relationships ??
    []) as Relationship[]
  const parentColumn = relationships.find(
    (r) => r.target_table_name === resource && r.target_table_schema === schema
  )?.source_column_name

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: resourceTitle,
            url: `/${schema}/resource/${resource}/table`,
          },
          {
            title: resourceId.slice(0, 8) + "…",
            url: `/${schema}/resource/${resource}/${resourceId}/detail`,
          },
          { title: "History" },
        ]}
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-4 flex items-center gap-2">
          <HistoryIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            {`Field history for record ${resourceId.slice(0, 8)}…`}
          </h2>
        </div>
        {parentColumn ? (
          <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
            <ResourceForeignTable
              parentResource={resource}
              parentColumn={parentColumn}
              parentValue={resourceId}
              resourceSchema={historyTableSchema}
              columnsSchema={historyColumnsSchema}
            />
          </Suspense>
        ) : (
          <p className="text-sm text-muted-foreground">
            No foreign-key relationship from{" "}
            {formatTitle(historyTableSchema.name)} back to{" "}
            {formatTitle(resource)}.
          </p>
        )}
      </div>
    </>
  )
}
