import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, FileXIcon, PencilIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import { parsePkSplat } from "#/components/resource/resource-table-columns"
import { ResourceDetailView } from "#/components/resource/view/resource-detail-view"
import { ResourceForeignTable } from "#/components/resource/view/resource-foreign-table"
import { ResourceMetadataView } from "#/components/resource/view/resource-metadata-view"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardHeader } from "#/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { Separator } from "#/components/ui/separator"
import { Skeleton } from "#/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  ColumnSchema,
  DatabaseViews,
  PrimaryKey,
  Relationship,
  ResourceSchema,
  TableMetadata,
  TableSchema,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import type { AppPermission } from "#/lib/supabase/data/core"
import {
  columnsSchemaQueryOptions,
  relatedTablesSchemaQueryOptions,
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
  viewSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource/view/$")({
  beforeLoad: ({ context, params: { schema, resource } }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === `${schema}.${resource}:select`
      )
    )
      throw notFound()
  },
  loader: async ({ context, params }) => {
    const { schema, resource, _splat } = params
    const [tableSchema, columnsSchema, relatedTablesSchema] = await Promise.all(
      [
        context.queryClient.ensureQueryData(
          tableSchemaQueryOptions(schema, resource)
        ),
        context.queryClient.ensureQueryData(
          columnsSchemaQueryOptions(schema, resource)
        ),
        context.queryClient.ensureQueryData(
          relatedTablesSchemaQueryOptions(schema, resource)
        ),
      ]
    )
    if (!columnsSchema?.length) throw notFound()

    let viewSchema = null
    if (!tableSchema) {
      viewSchema = await context.queryClient.ensureQueryData(
        viewSchemaQueryOptions(schema, resource)
      )
    }

    const resourceSchema = tableSchema ?? viewSchema
    if (!resourceSchema) throw notFound()

    const primaryKeys = (
      isTableSchema(resourceSchema) ? (resourceSchema.primary_keys ?? []) : []
    ) as PrimaryKey[]
    const pk = parsePkSplat(_splat ?? "", primaryKeys)

    const joins: Required<TableMetadata>["query"]["join"] = []

    type RelatedTable = Omit<
      TableSchema,
      "columns" | "relationships" | "primary_keys"
    > & {
      columns: ColumnSchema[]
      relationships: Relationship[]
      primary_keys: PrimaryKey[]
    }

    const tables = (relatedTablesSchema ?? []) as RelatedTable[]

    const oneToOneRelationships = tables.filter((table) => {
      return table.relationships?.some((rel) => {
        if (
          rel.source_schema === schema &&
          rel.source_table_name === resource
        ) {
          joins.push({
            table: rel.target_table_name,
            on: rel.target_column_name,
            columns: ["*"],
          })
          return true
        }
        if (
          rel.target_table_schema === schema &&
          rel.target_table_name === resource &&
          (table.columns
            .filter((col) => col.is_unique)
            .some((col) => col.name === rel.source_column_name) ||
            (table.primary_keys.some(
              (key) => key.name === rel.source_column_name
            ) &&
              table.primary_keys.length === 1))
        ) {
          joins.push({
            table: rel.source_table_name,
            on: rel.source_column_name,
            columns: ["*"],
          })
          return true
        }
        return false
      })
    })

    const oneToManyRelationships = tables.filter((table) => {
      return table.relationships.some((rel) => {
        if (
          rel.target_table_schema === schema &&
          rel.target_table_name === resource &&
          !(
            table.columns
              .filter((col) => col.is_unique)
              .some((col) => col.name === rel.source_column_name) ||
            table.primary_keys.some(
              (key) => key.name === rel.source_column_name
            )
          )
        ) {
          joins.push({
            table: rel.source_table_name,
            on: rel.source_column_name,
            columns: ["*"],
          })
          return true
        }
        return false
      })
    })

    const manyToManyRelationships = tables.filter((table) => {
      return table.relationships.some((rel) => {
        if (
          rel.target_table_schema === schema &&
          rel.target_table_name === resource &&
          table.relationships.length >= 2 &&
          table.primary_keys.length >= 2 &&
          table.relationships.filter((r) =>
            table.primary_keys.some((key) => key.name === r.source_column_name)
          )
        ) {
          joins.push({
            table: rel.source_table_name,
            on: rel.source_column_name,
            columns: [`*, ...${rel.target_table_name}(*)`],
          })
          return true
        }
        return false
      })
    })

    const allManyRelationships = [
      ...oneToManyRelationships,
      ...manyToManyRelationships,
    ]

    const record = await context.queryClient.ensureQueryData(
      singleResourceDataQueryOptions(schema, resource, pk, { join: joins })
    )
    if (!record) throw notFound()

    return {
      resourceSchema,
      columnsSchema,
      oneToOneRelationships,
      allManyRelationships,
      joins,
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `View Record | ${formatTitle(params.resource)} | Supasheet` },
    ],
  }),
  pendingComponent: () => {
    const { schema, resource } = Route.useParams()
    return (
      <>
        <DefaultHeader
          breadcrumbs={[
            {
              title: formatTitle(resource),
              url: `/${schema}/resource/${resource}`,
            },
            { title: "View record" },
          ]}
        />
        <div className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 py-4">
            <div className="columns-1 gap-4 lg:columns-2">
              <Card className="mb-4 break-inside-avoid">
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-1.5 h-4 w-52" />
                </CardHeader>
                <CardContent className="space-y-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i}>
                      <div className="flex items-start gap-4">
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      </div>
                      {i < 5 && <Separator className="my-2" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  },
  component: RouteComponent,
  errorComponent: ({ error }: ErrorComponentProps) => {
    const { schema, resource } = Route.useParams()
    const router = useRouter()
    return (
      <>
        <DefaultHeader
          breadcrumbs={[
            {
              title: formatTitle(resource),
              url: `/${schema}/resource/${resource}`,
            },
            { title: "View record" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertCircleIcon />
              </EmptyMedia>
              <EmptyTitle>Something went wrong</EmptyTitle>
              <EmptyDescription>
                {error?.message ?? "An unexpected error occurred."}
              </EmptyDescription>
            </EmptyHeader>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  router.navigate({ to: `/${schema}/resource/${resource}` })
                }
              >
                Go Back
              </Button>
            </div>
          </Empty>
        </div>
      </>
    )
  },
  notFoundComponent: () => {
    const { schema, resource } = Route.useParams()
    return (
      <>
        <DefaultHeader
          breadcrumbs={[
            {
              title: formatTitle(resource),
              url: `/${schema}/resource/${resource}`,
            },
            { title: "View record" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileXIcon />
              </EmptyMedia>
              <EmptyTitle>Record not found</EmptyTitle>
              <EmptyDescription>
                <Link
                  to="/$schema/resource/$resource"
                  params={{ schema, resource }}
                >
                  Back to {formatTitle(resource)}
                </Link>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </>
    )
  },
})

function RouteComponent() {
  const { schema, resource, _splat } = Route.useParams()
  const {
    resourceSchema,
    columnsSchema,
    oneToOneRelationships,
    allManyRelationships,
    joins,
  } = Route.useLoaderData()

  const primaryKeys = (
    isTableSchema(resourceSchema) ? (resourceSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]
  const pk = parsePkSplat(_splat ?? "", primaryKeys)
  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema, resource, pk, { join: joins })
  )

  if (!record) return null

  const canUpdate = useHasPermission(
    `${schema}.${resource}:update` as AppPermission
  )

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: formatTitle(resource),
            url: `/${schema}/resource/${resource}`,
          },
          { title: "View record" },
        ]}
      >
        {isTableSchema(resourceSchema) && canUpdate && (
          <Button
            size="sm"
            variant="outline"
            render={
              <Link
                to="/$schema/resource/$resource/update/$"
                params={{ schema, resource, _splat: _splat ?? "" }}
              />
            }
          >
            <PencilIcon className="mr-1.5 size-3.5" />
            Edit
          </Button>
        )}
      </DefaultHeader>
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4">
          <div className="columns-1 gap-4 lg:columns-2">
            <div className="mb-4 break-inside-avoid">
              <ResourceDetailView
                resourceSchema={resourceSchema}
                columnsSchema={columnsSchema}
                singleResourceData={record}
              />
            </div>
            <div className="mb-4 break-inside-avoid">
              <ResourceMetadataView
                resourceSchema={resourceSchema}
                columnsSchema={columnsSchema}
                singleResourceData={record}
              />
            </div>
            {oneToOneRelationships.map((relationship) => (
              <div key={relationship.id} className="mb-4 break-inside-avoid">
                <ResourceDetailView
                  resourceSchema={relationship as unknown as ResourceSchema}
                  columnsSchema={relationship.columns ?? []}
                  singleResourceData={
                    (record[relationship.name as string] as Record<
                      string,
                      unknown
                    >) ?? {}
                  }
                />
              </div>
            ))}
          </div>

          {allManyRelationships.length > 0 && (
            <Tabs defaultValue={allManyRelationships[0]?.name ?? ""}>
              <TabsList className="w-full">
                {allManyRelationships.map((relationship) => (
                  <TabsTrigger
                    key={relationship.id}
                    value={relationship.name ?? ""}
                  >
                    {formatTitle(relationship.name as string)}
                  </TabsTrigger>
                ))}
              </TabsList>
              {allManyRelationships.map((relationship) => (
                <TabsContent
                  key={relationship.id}
                  value={relationship.name ?? ""}
                >
                  <ResourceForeignTable
                    relationship={
                      relationship as unknown as ResourceSchema & {
                        columns: ColumnSchema[]
                      }
                    }
                    data={
                      (record[relationship.name as string] as Record<
                        string,
                        unknown
                      >[]) || null
                    }
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </>
  )
}
