import {
  Link,
  Outlet,
  createFileRoute,
  notFound,
  useRouter,
} from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"

import { useQuery } from "@tanstack/react-query"

import {
  AlertCircleIcon,
  ChartBarIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileXIcon,
  FolderIcon,
  HomeIcon,
} from "lucide-react"

import { ModuleSwitcher } from "#/components/layouts/module-switcher"
import { NavMain } from "#/components/layouts/nav-main"
import { NavResources } from "#/components/layouts/nav-resources"
import { NavSecondary } from "#/components/layouts/nav-secondary"
import { NavUser } from "#/components/layouts/nav-user"
import { Button } from "#/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "#/components/ui/empty"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "#/components/ui/sidebar"
import { formatTitle } from "#/lib/format"
import { userPermissionsQueryOptions } from "#/lib/supabase/data/core"
import {
  resourcesQueryOptions,
  schemasQueryOptions,
} from "#/lib/supabase/data/resource"

export const Route = createFileRoute("/$schema")({
  beforeLoad: async ({ context, params }) => {
    const permissions = context.authUser
      ? await context.queryClient.ensureQueryData(
          userPermissionsQueryOptions(params.schema)
        )
      : null
    if (!permissions?.length) throw notFound()
    return { permissions }
  },
  loader: async ({ context, params }) => {
    context.queryClient.prefetchQuery(schemasQueryOptions)
    context.queryClient.prefetchQuery(resourcesQueryOptions(params.schema))
  },
  component: RouteComponent,
  errorComponent: ({ error }: ErrorComponentProps) => {
    const router = useRouter()
    return (
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
              onClick={() => router.navigate({ to: "/" })}
            >
              Go Home
            </Button>
          </div>
        </Empty>
      </div>
    )
  },
  notFoundComponent: () => (
    <div className="flex flex-1 items-center justify-center p-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileXIcon />
          </EmptyMedia>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            This page doesn't exist. <Link to="/">Go home</Link>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
})

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Chart",
    url: "/chart",
    icon: <ChartBarIcon />,
  },
  {
    title: "Report",
    url: "/report",
    icon: <FileChartColumnIcon />,
  },
]

function RouteComponent() {
  const params = Route.useParams()
  const { data: schemas = [], isLoading: schemasLoading } =
    useQuery(schemasQueryOptions)
  const modules = schemas.map((s) => ({
    name: formatTitle(s.schema),
    icon: <DatabaseIcon />,
    url: `/${s.schema}`,
  }))
  const { data: resources = [], isLoading: resourcesLoading } = useQuery(
    resourcesQueryOptions(params.schema)
  )
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="h-svh overflow-hidden"
    >
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <ModuleSwitcher modules={modules} isLoading={schemasLoading} />
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            schema={params.schema}
            items={navMain}
            resourceItems={resources.map((r) => ({
              ...r,
              url: `/${params.schema}/resource/${r.id}`,
            }))}
          />
          <NavResources
            schema={params.schema + "/resource"}
            items={resources}
            isLoading={resourcesLoading}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavSecondary
            items={[
              { title: "Storage", url: "/storage", icon: <FolderIcon /> },
            ]}
          />
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="overflow-hidden">
        <div className="flex flex-1 flex-col overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
