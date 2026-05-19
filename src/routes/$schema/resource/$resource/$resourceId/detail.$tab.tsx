import { Suspense } from "react"

import {
  Link,
  Outlet,
  createFileRoute,
  getRouteApi,
  notFound,
} from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { LinkIcon } from "lucide-react"

import { DataTableSkeleton } from "#/components/data-table/data-table-skeleton"
import { classifyRelationships } from "#/components/resource/detail/classify-relationships"
import { ResourceForeignTable } from "#/components/resource/detail/resource-foreign-table"
import { ResourceFullDetail } from "#/components/resource/detail/resource-full-detail"
import { ResourceUpdateForm } from "#/components/resource/resource-update-form"
import { buttonVariants } from "#/components/ui/button"
import { Card, CardContent } from "#/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { useHasPermission } from "#/hooks/use-permissions"
import type {
  PrimaryKey,
  ResourceSchema,
  TableMetadata,
} from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import type { AppPermission } from "#/lib/supabase/data/core"
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

  const canUpdateOneToOne = useHasPermission(
    oneToOne
      ? `${oneToOne.schema}.${oneToOne.name}:update`
      : ("__none__" as AppPermission)
  )
  const canUpdateParent = useHasPermission(`${schema}.${resource}:update`)

  if (oneToOne) {
    const fkValue = record?.[oneToOne.__fkColumn]
    const embedded = record?.[oneToOne.__embedKey] as
      | Record<string, unknown>
      | null
      | undefined
    const primaryKeys = oneToOne.primary_keys ?? []
    const hasPkValues =
      primaryKeys.length > 0 &&
      primaryKeys.every((k) => embedded != null && embedded[k.name] != null)

    const isUnlinked = fkValue == null || embedded == null || !hasPkValues

    if (isUnlinked) {
      const relatedName = formatTitle(oneToOne.name)
      const parentName = formatTitle(resource)
      const parentDetailHref = `/${schema}/resource/${resource}/${resourceId}/detail`
      return (
        <>
          <div className="mx-auto w-full max-w-5xl space-y-4">
            <Card>
              <CardContent className="py-8">
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <LinkIcon />
                    </EmptyMedia>
                    <EmptyTitle>No linked {relatedName}</EmptyTitle>
                    <EmptyDescription>
                      This {parentName} record is not linked to a {relatedName}.
                      {canUpdateParent
                        ? ` Edit this record and set "${oneToOne.__fkColumn}" to link one.`
                        : null}
                    </EmptyDescription>
                  </EmptyHeader>
                  {canUpdateParent ? (
                    <EmptyContent>
                      <Link
                        to={parentDetailHref}
                        className={buttonVariants({
                          size: "sm",
                          variant: "outline",
                        })}
                      >
                        Edit {parentName}
                      </Link>
                    </EmptyContent>
                  ) : null}
                </Empty>
              </CardContent>
            </Card>
          </div>
          <Outlet />
        </>
      )
    }

    if (canUpdateOneToOne) {
      return (
        <>
          <ResourceUpdateForm
            columnsSchema={oneToOne.columns ?? []}
            primaryKeys={primaryKeys}
            record={embedded}
            tableSchema={oneToOne}
            saveOnly
          />
          <Outlet />
        </>
      )
    }

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

  const {
    columns,
    __parentColumn,
    __targetColumn,
    __selectClause,
    ...resourceSchema
  } = many

  const parentValue = record?.[__targetColumn]

  return (
    <>
      <Suspense fallback={<DataTableSkeleton columnCount={10} />}>
        <ResourceForeignTable
          parentResource={resource}
          parentColumn={__parentColumn}
          parentValue={parentValue}
          resourceSchema={resourceSchema}
          columnsSchema={columns ?? []}
          selectClause={__selectClause}
        />
      </Suspense>
      <Outlet />
    </>
  )
}
