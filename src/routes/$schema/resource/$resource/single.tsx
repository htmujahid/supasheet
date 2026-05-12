import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, FileXIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import { ResourceNewForm } from "#/components/resource/resource-new-form"
import { ResourceUpdateForm } from "#/components/resource/resource-update-form"
import { Button } from "#/components/ui/button"
import { Card, CardContent, CardHeader } from "#/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { Skeleton } from "#/components/ui/skeleton"
import type { PrimaryKey, TableMetadata } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import {
  columnsSchemaQueryOptions,
  resourceDataQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource/single")({
  beforeLoad: ({ context, params: { schema, resource } }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === `${schema}.${resource}:select`
      )
    )
      throw notFound()
  },
  loader: async ({ context, params: { schema, resource } }) => {
    const [tableSchema, columnsSchema] = await Promise.all([
      context.queryClient.ensureQueryData(
        tableSchemaQueryOptions(schema, resource)
      ),
      context.queryClient.ensureQueryData(
        columnsSchemaQueryOptions(schema, resource)
      ),
    ])
    if (!tableSchema || !columnsSchema?.length) throw notFound()
    context.queryClient.ensureQueryData(
      resourceDataQueryOptions(schema, resource, undefined, 1, 1)
    )
    return { tableSchema, columnsSchema }
  },
  head: ({ params, loaderData }) => {
    const meta = loaderData
      ? (JSON.parse(
          (loaderData.tableSchema as { comment?: string }).comment ?? "{}"
        ) as TableMetadata)
      : {}
    const name = meta.name ?? formatTitle(params.resource)
    return { meta: [{ title: `${name} | Supasheet` }] }
  },
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
          ]}
        />
        <div className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 py-4">
            <div className="columns-1 gap-4 lg:columns-2">
              {Array.from({ length: 2 }).map((_outer, i) => (
                <div key={i} className="mb-4 break-inside-avoid">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-5 w-24" />
                    </CardHeader>
                    <CardContent className="space-y-4 py-4">
                      {Array.from({ length: 3 }).map((_inner, j) => (
                        <div key={j} className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-9 w-full" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-28" />
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
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileXIcon />
              </EmptyMedia>
              <EmptyTitle>Resource not found</EmptyTitle>
              <EmptyDescription>
                <Link to="/$schema" params={{ schema }}>
                  Back to {formatTitle(schema)}
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
  const { schema, resource } = Route.useParams()
  const { tableSchema, columnsSchema } = Route.useLoaderData()

  const resourceDisplayName =
    (JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata).name ??
    formatTitle(resource)

  const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]

  const { data } = useSuspenseQuery(
    resourceDataQueryOptions(schema, resource, undefined, 1, 1)
  )
  const record = data?.result[0]

  return (
    <>
      <DefaultHeader breadcrumbs={[{ title: resourceDisplayName }]} />
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 py-4">
          {record ? (
            <ResourceUpdateForm
              columnsSchema={columnsSchema}
              primaryKeys={primaryKeys}
              record={record}
              tableSchema={tableSchema}
              saveOnly
            />
          ) : (
            <ResourceNewForm
              columnsSchema={columnsSchema}
              tableSchema={tableSchema}
              redirect={`/${schema}/resource/${resource}/single`}
              saveOnly
            />
          )}
        </div>
      </div>
    </>
  )
}
