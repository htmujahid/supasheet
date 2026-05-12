import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type {
  ErrorComponentProps,
  SearchSchemaInput,
} from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, EyeIcon, FileXIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import { parsePkSplat } from "#/components/resource/resource-table-columns"
import { ResourceUpdateForm } from "#/components/resource/resource-update-form"
import { Button, buttonVariants } from "#/components/ui/button"
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
  singleResourceDataQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/resource/$resource/update/$")({
  validateSearch: (search: { redirect?: string } & SearchSchemaInput) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: ({ context, params: { schema, resource } }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === `${schema}.${resource}:update`
      )
    )
      throw notFound()
  },
  loader: async ({ context, params }) => {
    const { schema, resource, _splat } = params
    const [tableSchema, columnsSchema] = await Promise.all([
      context.queryClient.ensureQueryData(
        tableSchemaQueryOptions(schema, resource)
      ),
      context.queryClient.ensureQueryData(
        columnsSchemaQueryOptions(schema, resource)
      ),
    ])
    if (!tableSchema || !columnsSchema?.length) throw notFound()
    const primaryKeys = (tableSchema.primary_keys ?? []) as PrimaryKey[]
    if (!primaryKeys.length) throw notFound()
    const pk = parsePkSplat(_splat ?? "", primaryKeys)
    const record = await context.queryClient.ensureQueryData(
      singleResourceDataQueryOptions(schema, resource, pk)
    )
    if (!record) throw notFound()
    return { tableSchema, columnsSchema }
  },
  head: ({ params }) => ({
    meta: [
      { title: `Edit Record | ${formatTitle(params.resource)} | Supasheet` },
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
            { title: "Edit record" },
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
            { title: "Edit record" },
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
            { title: "Edit record" },
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

  const { tableSchema, columnsSchema } = Route.useLoaderData()
  const resourceDisplayName = (
    JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata
  ).name ?? formatTitle(resource)

  const primaryKeys = (tableSchema?.primary_keys ?? []) as PrimaryKey[]
  const pk = parsePkSplat(_splat ?? "", primaryKeys)
  const { data: record } = useSuspenseQuery(
    singleResourceDataQueryOptions(schema, resource, pk)
  )

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: resourceDisplayName,
            url: `/${schema}/resource/${resource}`,
          },
          { title: "Edit record" },
        ]}
      >
        <Link
          className={buttonVariants({ size: "sm", variant: "outline" })}
          to="/$schema/resource/$resource/detail/$"
          params={{ schema, resource, _splat: _splat ?? "" }}
        >
          <EyeIcon className="mr-1.5 size-3.5" />
          View
        </Link>
      </DefaultHeader>
      <div className="flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl px-4 py-4">
          <ResourceUpdateForm
            columnsSchema={columnsSchema}
            primaryKeys={primaryKeys}
            record={record!}
            tableSchema={tableSchema}
          />
        </div>
      </div>
    </>
  )
}
