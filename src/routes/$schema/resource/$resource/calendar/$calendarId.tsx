import {
  Link,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useSuspenseQuery } from "@tanstack/react-query"

import { AlertCircleIcon, FileXIcon, PlusIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import {
  ResourceCalendar,
  colorFromString,
} from "#/components/resource/resource-calendar"
import type {
  IEvent,
  TCalendarView,
} from "#/components/resource/resource-calendar"
import { ResourceViewSwitcher } from "#/components/resource/resource-view-switcher"
import { NewRecordTrigger } from "#/components/resource/triggers/new-record-trigger"
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
import type { TableMetadata } from "#/lib/database-meta.types"
import { isTableSchema } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"
import type { AppPermission } from "#/lib/supabase/data/core"
import {
  resourceDataQueryOptions,
  tableSchemaQueryOptions,
  viewSchemaQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute(
  "/$schema/resource/$resource/calendar/$calendarId"
)({
  beforeLoad: ({ context, params: { schema, resource } }) => {
    if (
      !context.permissions?.some(
        (p) => p.permission === `${schema}.${resource}:select`
      )
    )
      throw notFound()
  },
  validateSearch: (search: { view?: string }) => ({
    view: (["month", "week", "day", "year", "agenda"].includes(
      search.view as string
    )
      ? search.view
      : "month") as TCalendarView,
  }),
  loaderDeps: ({ search: { view } }) => ({ view }),
  loader: async ({ context, params }) => {
    const { schema, resource, calendarId } = params

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
    const calendarView = meta.items?.find(
      (item) => item.id === calendarId && item.type === "calendar"
    )
    if (!calendarView) throw notFound()

    context.queryClient.ensureQueryData(
      resourceDataQueryOptions(schema, resource, meta.query)
    )

    return { calendarView, resourceSchema }
  },
  head: ({ params }) => ({
    meta: [{ title: `Calendar | ${formatTitle(params.resource)} | Supasheet` }],
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
            { title: "Calendar" },
          ]}
        />
        <div className="flex flex-1 flex-col gap-2 px-4 py-4">
          {/* Calendar header: prev/next + title + view switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </div>
          {/* Day-of-week header row */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>
          {/* Calendar grid: 6 weeks × 7 days */}
          <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-1">
            {Array.from({ length: 42 }).map((_, i) => (
              <Skeleton key={i} className="min-h-[80px] rounded-md" />
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
            { title: "Calendar" },
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
            { title: "Calendar" },
          ]}
        />
        <div className="flex flex-1 items-center justify-center p-8">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileXIcon />
              </EmptyMedia>
              <EmptyTitle>Calendar view not found</EmptyTitle>
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
  const { view } = Route.useSearch()
  const { calendarView, resourceSchema } = Route.useLoaderData()

  const meta = JSON.parse(resourceSchema.comment ?? "{}") as TableMetadata
  const { data: resourceData } = useSuspenseQuery(
    resourceDataQueryOptions(schema, resource, meta.query)
  )

  const titleField = calendarView.title as string
  const startDateField = calendarView.startDate as string
  const endDateField = calendarView.endDate as string
  const badgeField = calendarView.badge as string

  const data: IEvent[] = (resourceData?.result ?? [])
    .filter((row) => startDateField && row[startDateField])
    .map((row, i) => ({
      id: String(i),
      title: titleField ? String(row[titleField] ?? "") : "",
      color: colorFromString(badgeField ? String(row[badgeField] ?? "") : null),
      startDate: String(row[startDateField]),
      endDate:
        endDateField && row[endDateField]
          ? String(row[endDateField])
          : String(row[startDateField]),
      data: row,
    }))

  const metaItems = meta.items ?? []
  const isTable = isTableSchema(resourceSchema)
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
          { title: formatTitle(calendarView.id) },
        ]}
      >
        <ResourceViewSwitcher
          schema={schema}
          resource={resource}
          metaItems={metaItems}
          currentViewId={calendarView.id}
        />
        {isTable && canInsert && (
          <NewRecordTrigger size="sm">
            <PlusIcon className="mr-1.5 size-3.5" />
            New record
          </NewRecordTrigger>
        )}
      </DefaultHeader>
      <div className="flex flex-1 flex-col px-4 py-4" style={{ minHeight: 0 }}>
        <ResourceCalendar
          view={view}
          data={data}
          resourceSchema={resourceSchema}
          currentView={calendarView}
        />
      </div>
    </>
  )
}
