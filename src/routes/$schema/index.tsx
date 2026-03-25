import { Link, createFileRoute } from "@tanstack/react-router"

import { useQuery } from "@tanstack/react-query"

import {
  ChartBarIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  HomeIcon,
} from "lucide-react"
import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { DefaultHeader } from "#/components/layouts/default-header"
import { Badge } from "#/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card"
import { Skeleton } from "#/components/ui/skeleton"
import { formatTitle } from "#/lib/format"
import { resourcesQueryOptions } from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema/")({
  head: ({ params }) => ({
    meta: [{ title: `${formatTitle(params.schema)} | Supasheet` }],
  }),
  component: RouteComponent,
})

function ResourceIcon({
  item,
}: {
  item: { type: "table" | "view"; meta: { icon: string } }
}) {
  const iconName = (item.meta?.icon ||
    (item.type === "table" ? "Table2" : "Eye")) as keyof typeof LucideIcons
  const Icon = LucideIcons[iconName] as LucideIcon
  return <Icon className="size-4 shrink-0 text-muted-foreground" />
}

const quickLinks = [
  {
    title: "Dashboard",
    description: "Overview widgets and key metrics",
    icon: <HomeIcon className="size-5" />,
    url: "dashboard" as const,
  },
  {
    title: "Charts",
    description: "Visualize your data with charts",
    icon: <ChartBarIcon className="size-5" />,
    url: "chart" as const,
  },
  {
    title: "Reports",
    description: "Tabular reports from database views",
    icon: <FileChartColumnIcon className="size-5" />,
    url: "report" as const,
  },
]

function RouteComponent() {
  const params = Route.useParams()
  const { data: resources = [], isPending } = useQuery(
    resourcesQueryOptions(params.schema)
  )

  const tables = resources.filter((r) => r.type === "table")
  const views = resources.filter((r) => r.type === "view")

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: formatTitle(params.schema) }]} />
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Schema title */}
        <div className="flex items-center gap-3">
          <DatabaseIcon className="size-6 text-muted-foreground" />
          <div>
            <h1 className="text-xl font-semibold capitalize">
              {params.schema}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isPending
                ? "Loading schema..."
                : `${tables.length} table${tables.length !== 1 ? "s" : ""}, ${views.length} view${views.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Quick links */}
        <section>
          <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Sections
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={`/$schema/${link.url}`}
                params={{ schema: params.schema }}
              >
                <Card className="transition-colors hover:bg-accent/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{link.icon}</span>
                      <div>
                        <CardTitle className="text-sm">{link.title}</CardTitle>
                        <CardDescription className="mt-0.5 text-xs">
                          {link.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section>
          <h2 className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Resources
          </h2>
          {isPending ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="space-y-2 rounded-xl border bg-card p-4"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-4 rounded" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="ml-auto h-5 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tables or views found in this schema.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  to="/$schema/resource/$resource"
                  params={{ schema: params.schema, resource: resource.id }}
                >
                  <Card className="transition-colors hover:bg-accent/50">
                    <CardHeader>
                      <div className="flex items-center gap-2.5">
                        <ResourceIcon item={resource} />
                        <CardTitle className="truncate text-sm">
                          {formatTitle(resource.name)}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="ml-auto shrink-0 text-xs capitalize"
                        >
                          {resource.type}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
