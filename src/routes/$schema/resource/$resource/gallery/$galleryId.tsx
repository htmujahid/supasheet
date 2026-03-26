import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { AlertCircleIcon, FileXIcon, PlusIcon } from "lucide-react"

import { DataTableSkeleton } from "#/components/data-table/data-table-skeleton"
import { DefaultHeader } from "#/components/layouts/default-header"
import { ResourceGallery } from "#/components/resource/resource-gallery"
import type { GalleryViewData } from "#/components/resource/resource-gallery"
import { ResourceViewSwitcher } from "#/components/resource/resource-view-switcher"
import { Button } from "#/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { useHasPermission } from "#/hooks/use-permissions"
import type { TableMetadata } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import type { AppPermission } from "#/lib/supabase/data/core"
import {
  columnsSchemaQueryOptions,
  resourceDataQueryOptions,
  tableSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute(
  "/$schema/resource/$resource/gallery/$galleryId"
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
    const { schema, resource, galleryId } = params

    const [tableSchema, columnsSchema] = await Promise.all([
      context.queryClient.ensureQueryData(
        tableSchemaQueryOptions(schema as "supasheet", resource)
      ),
      context.queryClient.ensureQueryData(
        columnsSchemaQueryOptions(schema as "supasheet", resource)
      ),
    ])

    if (!columnsSchema?.length) throw notFound()

    const meta = (
      tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}
    ) as TableMetadata
    const galleryView = meta.items?.find(
      (item) => item.id === galleryId && item.type === "gallery"
    )
    if (!galleryView) throw notFound()

    const metaData = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata
    const resourceData = await context.queryClient.ensureQueryData(
      resourceDataQueryOptions(schema, resource, metaData.query)
    )

    return { galleryView, tableSchema, columnsSchema, resourceData }
  },
  head: ({ params }) => ({
    meta: [{ title: `Gallery | ${formatTitle(params.resource)} | Supasheet` }],
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
            { title: "Gallery" },
          ]}
        />
        <div className="flex flex-1 flex-col px-4 py-4">
          <DataTableSkeleton columnCount={4} rowCount={8} />
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
            { title: "Gallery" },
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
            { title: "Gallery" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileXIcon />
              </EmptyMedia>
              <EmptyTitle>Gallery view not found</EmptyTitle>
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
  const { galleryView, tableSchema, columnsSchema, resourceData } =
    Route.useLoaderData()

  const titleField = galleryView.title as string
  const coverField = galleryView.cover as string
  const descriptionField = galleryView.description as string
  const badgeField = galleryView.badge as string

  const data: GalleryViewData[] = (resourceData?.result ?? []).map((row) => ({
    cover:
      coverField && row[coverField] != null ? String(row[coverField]) : null,
    title:
      titleField && row[titleField] != null ? String(row[titleField]) : null,
    description:
      descriptionField && row[descriptionField] != null
        ? String(row[descriptionField])
        : null,
    badge:
      badgeField && row[badgeField] != null ? String(row[badgeField]) : null,
    data: row,
  }))

  const meta = (
    tableSchema?.comment ? JSON.parse(tableSchema.comment) : {}
  ) as TableMetadata
  const metaItems = meta.items ?? []
  const isTable = !!tableSchema
  const canInsert = useHasPermission(
    `${schema}.${resource}:insert` as AppPermission
  )

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: formatTitle(resource),
            url: `/${schema}/resource/${resource}`,
          },
          { title: formatTitle(galleryView.id) },
        ]}
      >
        <ResourceViewSwitcher
          schema={schema}
          resource={resource}
          metaItems={metaItems}
          currentViewId={galleryView.id}
        />
        {isTable && canInsert && (
          <Button
            size="sm"
            nativeButton={false}
            render={
              <Link
                to="/$schema/resource/$resource/new"
                params={{ schema, resource }}
              />
            }
          >
            <PlusIcon className="mr-1.5 size-3.5" />
            New record
          </Button>
        )}
      </DefaultHeader>
      <div className="flex flex-1 flex-col px-4 py-4">
        <ResourceGallery
          data={data}
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
        />
      </div>
    </>
  )
}
