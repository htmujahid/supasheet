import { Link, useLocation } from "@tanstack/react-router"

import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar"
import { Skeleton } from "#/components/ui/skeleton"
import type { TableMetadata, ViewMetadata } from "#/lib/database-meta.types"
import { formatTitle } from "#/lib/format"

function LucideIconComponent({
  iconName,
}: {
  iconName: keyof typeof LucideIcons
}) {
  const Icon = LucideIcons[iconName] as LucideIcon

  return <Icon className="size-4 shrink-0" />
}

export function NavResources({
  items,
  schema,
  isLoading,
}: {
  schema: string
  isLoading?: boolean
  items: (
    | {
        name: string
        id: string
        schema: string
        type: "table"
        meta: TableMetadata
      }
    | {
        name: string
        id: string
        schema: string
        type: "view"
        meta: ViewMetadata
      }
  )[]
}) {
  const location = useLocation()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu className="flex flex-col gap-1">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton disabled>
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-3 w-24" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : items.map((item) => {
              const icon = (
                <LucideIconComponent
                  iconName={
                    (item.meta?.icon ||
                      (item.type === "table"
                        ? "Table2"
                        : "Eye")) as keyof typeof LucideIcons
                  }
                />
              )
              const url = `/${schema}/${item.id}`
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    tooltip={item.meta?.name ?? formatTitle(item.name)}
                    render={<Link to={url as never} />}
                    isActive={location.pathname.startsWith(
                      `/${schema}/${item.id}`
                    )}
                  >
                    {icon}
                    <span>{item.meta?.name ?? formatTitle(item.name)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
