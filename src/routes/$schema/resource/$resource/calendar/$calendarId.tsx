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
import {
  ResourceCalendar,
  colorFromString,
} from "#/components/resource/resource-calendar"
import type {
  IEvent,
  TCalendarView,
} from "#/components/resource/resource-calendar"
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
    const calendarView = meta.items?.find(
      (item) => item.id === calendarId && item.type === "calendar"
    )
    if (!calendarView) throw notFound()

    const metaData = JSON.parse(tableSchema?.comment ?? "{}") as TableMetadata

    const resourceData = await context.queryClient.ensureQueryData(
      resourceDataQueryOptions(schema, resource, metaData.query)
    )

    return { calendarView, tableSchema, columnsSchema, resourceData }
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
        <div className="flex flex-1 flex-col px-4 py-4">
          <DataTableSkeleton columnCount={7} rowCount={6} />
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
  const { calendarView, tableSchema, columnsSchema, resourceData } =
    Route.useLoaderData()

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
      <div className="flex flex-1 flex-col px-4 py-4" style={{ minHeight: 0 }}>
        <ResourceCalendar
          view={view}
          data={data}
          tableSchema={tableSchema}
          columnsSchema={columnsSchema}
          currentView={calendarView}
        />
      </div>
    </>
  )
}
