import { Suspense, useMemo } from "react"

import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, FileXIcon, PencilIcon } from "lucide-react"

import { DataTableSkeleton } from "#/components/data-table/data-table-skeleton"
import { DefaultHeader } from "#/components/layouts/default-header"
import { ResourceDetailView } from "#/components/resource/detail/resource-detail-view"
import { ResourceForeignTable } from "#/components/resource/detail/resource-foreign-table"
import { ResourceMetadataView } from "#/components/resource/detail/resource-metadata-view"
import { ResourceProgressField } from "#/components/resource/detail/resource-progress-field"
import { ResourceSectionDetail } from "#/components/resource/detail/resource-section-detail"
import { buildLayoutPlan } from "#/components/resource/resource-form-utils"
import { parsePkSplat } from "#/components/resource/resource-table-columns"
import { Button, buttonVariants } from "#/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { Field, FieldLabel } from "#/components/ui/field"
import { Input } from "#/components/ui/input"
import { Separator } from "#/components/ui/separator"
import { Skeleton } from "#/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  ColumnSchema,
  EnumColumnMetadata,
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
  joinAlias,
  relatedTablesSchemaQueryOptions,
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
  viewSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource/detail/$")({
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

    type ManyRelation = RelatedTable & {
      __parentColumn: string
      __targetColumn: string
      __selectClause: string
    }

    type OneToOneRelation = RelatedTable & {
      __embedKey: string
      __fkColumn: string
    }

    const oneToOneRelationships: OneToOneRelation[] = []
    const oneToManyRelationships: ManyRelation[] = []
    const manyToManyRelationships: ManyRelation[] = []

    for (const table of tables) {
      // One-to-one: current resource references the other table (FK on current side)
      const oneToOneAsSourceList = (table.relationships ?? []).filter(
        (rel) =>
          rel.source_schema === schema && rel.source_table_name === resource
      )
      if (oneToOneAsSourceList.length > 0) {
        for (const rel of oneToOneAsSourceList) {
          joins.push({
            table: rel.target_table_name,
            on: rel.source_column_name,
            columns: ["*"],
          })
          oneToOneRelationships.push({
            ...table,
            __embedKey: joinAlias(rel.source_column_name),
            __fkColumn: rel.source_column_name,
          })
        }
        continue
      }

      // One-to-one: other table references us via a unique column / single-col PK
      const oneToOneAsTarget = table.relationships?.find(
        (rel) =>
          rel.target_table_schema === schema &&
          rel.target_table_name === resource &&
          (table.columns
            .filter((col) => col.is_unique)
            .some((col) => col.name === rel.source_column_name) ||
            (table.primary_keys.some(
              (key) => key.name === rel.source_column_name
            ) &&
              table.primary_keys.length === 1))
      )
      if (oneToOneAsTarget) {
        joins.push({
          table: oneToOneAsTarget.source_table_name,
          on: oneToOneAsTarget.source_column_name,
          columns: ["*"],
        })
        oneToOneRelationships.push({
          ...table,
          __embedKey: joinAlias(oneToOneAsTarget.source_column_name),
          __fkColumn: oneToOneAsTarget.source_column_name,
        })
        continue
      }

      // Many-to-many: link table with composite PK referencing two FKs
      const m2mRel = table.relationships?.find(
        (rel) =>
          rel.target_table_schema === schema &&
          rel.target_table_name === resource &&
          table.relationships.length >= 2 &&
          table.primary_keys.length >= 2 &&
          table.primary_keys.some((key) => key.name === rel.source_column_name)
      )
      if (m2mRel) {
        const otherRel = table.relationships.find(
          (r) =>
            table.primary_keys.some((k) => k.name === r.source_column_name) &&
            !(
              r.target_table_schema === schema &&
              r.target_table_name === resource
            )
        )
        manyToManyRelationships.push({
          ...table,
          __parentColumn: m2mRel.source_column_name,
          __targetColumn: m2mRel.target_column_name,
          __selectClause: otherRel
            ? `*, ...${otherRel.target_table_name}(*)`
            : "*",
        })
        continue
      }

      // One-to-many: other table references us, FK is not unique / not PK
      const oneToManyRel = table.relationships?.find(
        (rel) =>
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
      )
      if (oneToManyRel) {
        oneToManyRelationships.push({
          ...table,
          __parentColumn: oneToManyRel.source_column_name,
          __targetColumn: oneToManyRel.target_column_name,
          __selectClause: "*",
        })
      }
    }

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
    meta: [{ title: `Detail | ${formatTitle(params.resource)} | Supasheet` }],
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
            { title: "Detail" },
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
            { title: "Detail" },
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
            { title: "Detail" },
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

  const tableSchema = isTableSchema(resourceSchema) ? resourceSchema : null
  const primaryKeys = (
    tableSchema ? (tableSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]
  const pk = parsePkSplat(_splat ?? "", primaryKeys)
  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema, resource, pk, { join: joins })
  )

  if (!record) return null

  const canUpdate = useHasPermission(
    `${schema}.${resource}:update` as AppPermission
  )

  const resourceDisplayName = (
    JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
  ).name ?? formatTitle(resource)

  const { colByName, progressFields, filteredPlan } = useMemo(() => {
    const tableMeta = JSON.parse(
      resourceSchema.comment ?? "{}"
    ) as TableMetadata
    const availableNames = new Set(
      columnsSchema.map((c) => (c.name as string) ?? c.id ?? "")
    )
    const plan = buildLayoutPlan(tableMeta.sections, availableNames, "read")
    const byName = new Map(
      columnsSchema.map((c) => [(c.name as string) ?? c.id ?? "", c])
    )
    const progress = columnsSchema
      .map((col) => {
        const meta = JSON.parse(col.comment ?? "{}") as EnumColumnMetadata
        if (!meta?.progress || !meta.enums) return null
        return { col, meta }
      })
      .filter((x): x is { col: ColumnSchema; meta: EnumColumnMetadata } =>
        Boolean(x)
      )
    const progressNames = new Set(progress.map(({ col }) => col.name as string))
    const filtered = plan
      ? {
          ...plan,
          sections: plan.sections
            .map((s) => ({
              ...s,
              fields: s.fields.filter((f) => !progressNames.has(f)),
            }))
            .filter((s) => s.fields.length > 0),
        }
      : plan
    return {
      colByName: byName,
      progressFields: progress,
      filteredPlan: filtered,
    }
  }, [resourceSchema.comment, columnsSchema])

  const primaryKeyDisplay = primaryKeys
    .map((key) => {
      const col = colByName.get(key.name)
      if (!col) return null
      return {
        name: col.name as string,
        value: String(record[col.name as string] ?? ""),
      }
    })
    .filter((p): p is { name: string; value: string } => Boolean(p))

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: resourceDisplayName,
            url: `/${schema}/resource/${resource}`,
          },
          { title: "Detail" },
        ]}
      >
        {tableSchema && canUpdate && (
          <Link
            className={buttonVariants({ size: "sm", variant: "outline" })}
            to="/$schema/resource/$resource/update/$"
            params={{ schema, resource, _splat: _splat ?? "" }}
          >
            <PencilIcon className="mr-1.5 size-3.5" />
            Edit
          </Link>
        )}
      </DefaultHeader>
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-4">
          {progressFields.length > 0 && (
            <div className="space-y-4">
              {progressFields.map(({ col, meta }) => (
                <ResourceProgressField
                  key={col.id}
                  column={col}
                  value={(record[col.name as string] as string | null) ?? null}
                  enumMeta={meta}
                />
              ))}
            </div>
          )}
          <div className="columns-1 gap-4 lg:columns-2">
            {filteredPlan ? (
              <>
                {primaryKeyDisplay.length > 0 && (
                  <div className="mb-4 break-inside-avoid">
                    <Card>
                      <CardHeader>
                        <CardTitle>Identifiers</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 py-2">
                        {primaryKeyDisplay.map((p) => (
                          <Field key={p.name}>
                            <FieldLabel>{p.name}</FieldLabel>
                            <Input
                              value={p.value}
                              disabled
                              className="rounded-none border-0 border-b px-0 font-mono text-xs text-muted-foreground disabled:bg-transparent dark:disabled:bg-transparent"
                            />
                          </Field>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
                {filteredPlan.sections.map((s) => (
                  <div key={s.id} className="mb-4 break-inside-avoid">
                    <ResourceSectionDetail
                      section={s}
                      colByName={colByName}
                      tableSchema={tableSchema}
                      record={record}
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="mb-4 break-inside-avoid">
                <ResourceDetailView
                  resourceSchema={resourceSchema}
                  columnsSchema={columnsSchema}
                  singleResourceData={record}
                />
              </div>
            )}
            <div className="mb-4 break-inside-avoid">
              <ResourceMetadataView
                resourceSchema={resourceSchema}
                columnsSchema={columnsSchema}
                singleResourceData={record}
              />
            </div>
            {oneToOneRelationships.map((relationship) => (
              <div
                key={`${relationship.id}-${relationship.__fkColumn}`}
                className="mb-4 break-inside-avoid"
              >
                <ResourceDetailView
                  resourceSchema={
                    {
                      ...relationship,
                      name: relationship.__embedKey,
                    } as unknown as ResourceSchema
                  }
                  columnsSchema={relationship.columns ?? []}
                  singleResourceData={
                    (record[relationship.__embedKey] as Record<
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
              <TabsList className="mx-auto">
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
                  <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
                    <ResourceForeignTable
                      schema={relationship.schema ?? schema}
                      table={relationship.name}
                      parentColumn={relationship.__parentColumn}
                      parentValue={record[relationship.__targetColumn]}
                      resourceSchema={
                        relationship as ResourceSchema & {
                          columns: ColumnSchema[]
                        }
                      }
                      columnsSchema={relationship.columns ?? []}
                      selectClause={relationship.__selectClause}
                    />
                  </Suspense>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </>
  )
}
