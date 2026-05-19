import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, FileXIcon, PlusIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import { ResourceTree } from "#/components/resource/resource-tree"
import { ResourceViewSwitcher } from "#/components/resource/resource-view-switcher"
import { NewRecordTrigger } from "#/components/resource/sheet/new-record-trigger"
import { Button } from "#/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { Skeleton } from "#/components/ui/skeleton"
import { useHasPermission } from "#/hooks/use-permissions"
import { useSheetHref } from "#/hooks/use-sheet-href"
import type {
  PrimaryKey,
  TableMetadata,
  TreeViewItem,
} from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import {
  columnsSchemaQueryOptions,
  resourceDataQueryOptions,
  tableSchemaQueryOptions,
  viewSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute(
  "/$schema/resource/$resource/tree/$treeId"
)({
  beforeLoad: ({ context, params: { schema, resource } }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === `${schema}.${resource}:select`
      )
    )
      throw notFound()
  },
  loader: async ({ context, params }) => {
    const { schema, resource, treeId } = params

    const [tableSchema, columnsSchema] = await Promise.all([
      context.queryClient.ensureQueryData(
        tableSchemaQueryOptions(schema, resource)
      ),
      context.queryClient.ensureQueryData(
        columnsSchemaQueryOptions(schema, resource)
      ),
    ])
    if (!columnsSchema?.length) throw notFound()

    let viewSchema = null
    if (!tableSchema) {
      viewSchema = await context.queryClient.ensureQueryData(
        viewSchemaQueryOptions(schema, resource)
      )
    }

    const resourceSchema = tableSchema ?? viewSchema
    if (!resourceSchema) throw notFound()

    const meta = JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
    const treeView = meta.items?.find(
      (item): item is TreeViewItem => item.id === treeId && item.type === "tree"
    )
    if (!treeView) throw notFound()

    context.queryClient.ensureQueryData(
      resourceDataQueryOptions(schema, resource, meta.query)
    )

    return { columnsSchema, resourceSchema, treeView }
  },
  head: ({ params }) => ({
    meta: [{ title: `Tree | ${formatTitle(params.resource)} | Supasheet` }],
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
            { title: "Tree" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-2 px-4 py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8"
              style={{ width: `${80 - (i % 4) * 10}%` }}
            />
          ))}
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
            { title: "Tree" },
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
            { title: "Tree" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileXIcon />
              </EmptyMedia>
              <EmptyTitle>Tree view not found</EmptyTitle>
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
  const { schema, resource } = Route.useParams()
  const { resourceSchema, treeView } = Route.useLoaderData()

  const meta = JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
  const metaItems = meta.items ?? []
  const isTable = isTableSchema(resourceSchema)
  const canInsert = useHasPermission(`${schema}.${resource}:insert`)

  const primaryKeys = (
    isTableSchema(resourceSchema) ? (resourceSchema.primary_keys ?? []) : []
  ) as PrimaryKey[]

  const { data: resourceData } = useSuspenseQuery(
    resourceDataQueryOptions(schema, resource, meta.query)
  )

  const navigate = useNavigate()
  const sheetLink = useSheetHref({ mode: "detail" })

  const handleSelect = (row: Record<string, unknown>) => {
    const pk = Object.fromEntries(primaryKeys.map((k) => [k.name, row[k.name]]))
    if (sheetLink) {
      navigate({
        to: sheetLink.to as never,
        search: { ...sheetLink.search, pk } as never,
      })
    }
  }

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: meta.name ?? formatTitle(resource),
            url: `/${schema}/resource/${resource}`,
          },
          { title: treeView.name ?? formatTitle(treeView.id) },
        ]}
      >
        <ResourceViewSwitcher
          schema={schema}
          resource={resource}
          metaItems={metaItems}
          currentViewId={treeView.id}
        />
        {isTable && canInsert && (
          <NewRecordTrigger size="sm">
            <PlusIcon className="mr-1.5 size-3.5" />
            New record
          </NewRecordTrigger>
        )}
      </DefaultHeader>
      <div className="flex flex-1 flex-col px-4 py-4">
        <ResourceTree
          rows={resourceData?.result ?? []}
          resourceSchema={resourceSchema}
          treeView={treeView}
          onSelect={handleSelect}
        />
      </div>
      <Outlet />
    </>
  )
}
