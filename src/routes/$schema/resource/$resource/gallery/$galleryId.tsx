import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, FileXIcon, PlusIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import { NewRecordTrigger } from "#/components/resource/drawer/new-record-trigger"
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
import { Skeleton } from "#/components/ui/skeleton"
import { useHasPermission } from "#/hooks/use-permissions"
import type { GalleryViewItem, TableMetadata } from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import {
  resourceDataQueryOptions,
  tableSchemaQueryOptions,
  viewSchemaQueryOptions,
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

    const tableSchema = await context.queryClient.ensureQueryData(
      tableSchemaQueryOptions(schema, resource)
    )

    let viewSchema = null
    if (!tableSchema) {
      viewSchema = await context.queryClient.ensureQueryData(
        viewSchemaQueryOptions(schema, resource)
      )
    }

    const resourceSchema = tableSchema ?? viewSchema
    if (!resourceSchema) throw notFound()

    const meta = JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
    const galleryView = meta.items?.find(
      (item): item is GalleryViewItem =>
        item.id === galleryId && item.type === "gallery"
    )
    if (!galleryView) throw notFound()

    context.queryClient.ensureQueryData(
      resourceDataQueryOptions(schema, resource, meta.query)
    )

    return { galleryView, resourceSchema }
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
        <div className="flex flex-1 flex-col gap-4 px-4 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card shadow-xs">
                {/* Cover image area */}
                <div className="p-4 pb-0">
                  <Skeleton className="aspect-4/3 w-full rounded-md" />
                </div>
                {/* Card content */}
                <div className="flex flex-col gap-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
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
  const { galleryView, resourceSchema } = Route.useLoaderData()

  const meta = JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
  const { data: resourceData } = useSuspenseQuery(
    resourceDataQueryOptions(schema, resource, meta.query)
  )

  const titleField = galleryView.title
  const coverField = galleryView.cover
  const descriptionField = galleryView.description
  const badgeField = galleryView.badge

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

  const metaItems = meta.items ?? []
  const isTable = isTableSchema(resourceSchema)
  const canInsert = useHasPermission(`${schema}.${resource}:insert`)

  return (
    <>
      <DefaultHeader
        breadcrumbs={[
          {
            title: meta.name ?? formatTitle(resource),
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
          <NewRecordTrigger size="sm">
            <PlusIcon className="mr-1.5 size-3.5" />
            New record
          </NewRecordTrigger>
        )}
      </DefaultHeader>
      <div className="flex flex-1 flex-col px-4 py-4">
        <ResourceGallery data={data} resourceSchema={resourceSchema} />
      </div>
      <Outlet />
    </>
  )
}
