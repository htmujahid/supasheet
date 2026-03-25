import { Outlet, createFileRoute } from "@tanstack/react-router"

import { AccountSidebar } from "#/components/account/account-sidebar"
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar"

export const Route = createFileRoute("/account")({
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
      <AccountSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
