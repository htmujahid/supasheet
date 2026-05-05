import { Outlet, createFileRoute } from "@tanstack/react-router"

import { ArrowLeftIcon, HomeIcon, SparklesIcon } from "lucide-react"

import { NavMain } from "#/components/layouts/nav-main"
import { NavSecondary } from "#/components/layouts/nav-secondary"
import { NavUser } from "#/components/layouts/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
} from "#/components/ui/sidebar"

export const Route = createFileRoute("/ai-chat")({
  component: RouteComponent,
})

function RouteComponent() {
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
            <SidebarMenuButton className="min-w-0 flex-1 px-2">
              <div className="flex aspect-square size-5 items-center justify-center rounded bg-primary text-primary-foreground">
                <SparklesIcon className="size-4" />
              </div>
              <span className="truncate font-medium">AI Chat</span>
            </SidebarMenuButton>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <NavMain
            schema="ai-chat"
            items={[{ title: "Chat", url: "/", icon: <HomeIcon /> }]}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavSecondary
            items={[
              { title: "Back to Main", url: "/", icon: <ArrowLeftIcon /> },
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
