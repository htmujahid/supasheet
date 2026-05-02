import { Outlet, createFileRoute } from "@tanstack/react-router"

import { DatabaseIcon, FolderIcon, HomeIcon } from "lucide-react"

import { ModuleSwitcher } from "#/components/layouts/module-switcher"
import { NavMain } from "#/components/layouts/nav-main"
import { NavResources } from "#/components/layouts/nav-resources"
import { NavSecondary } from "#/components/layouts/nav-secondary"
import { NavUser } from "#/components/layouts/nav-user"
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

export const Route = createFileRoute("/core")({
  beforeLoad: async ({ context }) => {
    const permissions = context.authUser
      ? await context.queryClient.ensureQueryData(
          userPermissionsQueryOptions("supasheet")
        )
      : null
    return { permissions }
  },
  loader: async ({ context }) => {
    const schemas =
      await context.queryClient.ensureQueryData(schemasQueryOptions)
    const resources = await context.queryClient.ensureQueryData(
      resourcesQueryOptions("supasheet")
    )
    return { schemas, resources }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { schemas, resources = [] } = Route.useLoaderData()
  const modules = schemas.map((s) => ({
    name: formatTitle(s.schema),
    icon: <DatabaseIcon />,
    url: `/${s.schema}`,
  }))

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-1">
            <div className="min-w-0 flex-1">
              <ModuleSwitcher modules={modules} />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            schema="core"
            items={[{ title: "Home", url: "", icon: <HomeIcon /> }]}
            resourceItems={resources.map((r) => ({
              ...r,
              url: `/core/${r.id}`,
            }))}
          />
          <NavResources schema="core" items={resources} />
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
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
