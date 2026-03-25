import { createFileRoute, useRouter } from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { AlertCircleIcon, LayoutDashboardIcon } from "lucide-react"

import { DashboardWidget } from "#/components/dashboard/dashboard-widget"
import { DefaultHeader } from "#/components/layouts/default-header"
import { Button } from "#/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import { Skeleton } from "#/components/ui/skeleton"
import { formatTitle } from "#/lib/format"
import { dashboardWidgetsQueryOptions } from "#/lib/supabase/data/dashboard"

export const Route = createFileRoute("/$schema/dashboard/")({
  loader: async ({ context, params }) => {
    const widgets = await context.queryClient.ensureQueryData(
      dashboardWidgetsQueryOptions(params.schema)
    )
    return { widgets }
  },
  head: ({ params }) => ({
    meta: [{ title: `Dashboard | ${formatTitle(params.schema)} | Supasheet` }],
  }),
  pendingComponent: () => (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  ),
  errorComponent: ({ error }: ErrorComponentProps) => {
    const { schema } = Route.useParams()
    const router = useRouter()
    return (
      <div className="w-full flex-1">
        <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
        <div className="flex min-h-[calc(100svh-183px)] items-center justify-center">
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
                onClick={() => router.navigate({ to: `/${schema}` })}
              >
                Go Back
              </Button>
            </div>
          </Empty>
        </div>
      </div>
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { widgets = [] } = Route.useLoaderData()

  if (widgets.length === 0) {
    return (
      <div className="w-full flex-1">
        <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
        <div className="flex min-h-[calc(100svh-183px)] items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutDashboardIcon />
              </EmptyMedia>
              <EmptyTitle>No Widgets Found</EmptyTitle>
              <EmptyDescription>
                There are no dashboard widgets available for this schema yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget) => (
          <DashboardWidget key={widget.view_name} widget={widget} />
        ))}
      </div>
    </div>
  )
}
