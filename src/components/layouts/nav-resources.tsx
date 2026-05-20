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

type ResourceItem =
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

function ResourceMenuItem({
  item,
  schema,
}: {
  item: ResourceItem
  schema: string
}) {
  const location = useLocation()
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
        isActive={location.pathname.startsWith(`/${schema}/${item.id}`)}
      >
        {icon}
        <span>{item.meta?.name ?? formatTitle(item.name)}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavResources({
  items,
  schema,
  isLoading,
}: {
  schema: string
  isLoading?: boolean
  items: ResourceItem[]
}) {
  const hasGroups = items.some((item) => item.meta?.group)

  const grouped: Record<string, ResourceItem[]> = {}
  if (hasGroups) {
    for (const item of items) {
      const key = item.meta?.group ?? ""
      grouped[key] = grouped[key] ?? []
      grouped[key].push(item)
    }
  }

  const skeletons = Array.from({ length: 4 }).map((_, i) => (
    <SidebarMenuItem key={i}>
      <SidebarMenuButton disabled>
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-3 w-24" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  ))

  if (isLoading) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Resources</SidebarGroupLabel>
        <SidebarMenu className="flex flex-col gap-1">{skeletons}</SidebarMenu>
      </SidebarGroup>
    )
  }

  if (!hasGroups) {
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Resources</SidebarGroupLabel>
        <SidebarMenu className="flex flex-col gap-1">
          {items.map((item) => (
            <ResourceMenuItem key={item.id} item={item} schema={schema} />
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  const ungrouped = grouped[""] ?? []
  const namedGroups = Object.entries(grouped).filter(([key]) => key !== "")

  return (
    <>
      {ungrouped.length > 0 && (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarMenu className="flex flex-col gap-1">
            {ungrouped.map((item) => (
              <ResourceMenuItem key={item.id} item={item} schema={schema} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      )}
      {namedGroups.map(([group, groupItems]) => (
        <SidebarGroup
          key={group}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarMenu className="flex flex-col gap-1">
            {groupItems.map((item) => (
              <ResourceMenuItem key={item.id} item={item} schema={schema} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
