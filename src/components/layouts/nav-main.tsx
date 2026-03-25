"use client"

import * as React from "react"

import { Link, useLocation, useNavigate } from "@tanstack/react-router"

import * as LucideIcons from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { BellIcon, SearchIcon } from "lucide-react"

import { Button } from "#/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "#/components/ui/command"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar"
import { formatTitle } from "#/lib/format"

type ResourceItem = {
  id: string
  name: string
  url: string
  type: "table" | "view"
  meta?: { label?: string; icon?: string } | null
}

function ResourceIcon({ item }: { item: ResourceItem }) {
  const iconName = (item.meta?.icon ||
    (item.type === "table" ? "Table2" : "Eye")) as keyof typeof LucideIcons
  const Icon = LucideIcons[iconName] as LucideIcon
  return <Icon className="size-4 shrink-0" />
}

export function NavMain({
  items,
  schema,
  resourceItems,
}: {
  schema: string
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
  resourceItems?: ResourceItem[]
}) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation({
    select: (loc) => ({
      ...loc,
      pathname: loc.pathname.replace(/\/$/, ""),
    }),
  })

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = (url: string) => {
    setOpen(false)
    navigate({ to: url as never })
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Search"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              onClick={() => setOpen(true)}
            >
              <SearchIcon />
              <span>Quick Search</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              nativeButton={false}
              render={<Link to="/core/notifications" />}
            >
              <BellIcon />
              <span className="sr-only">Notifications</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu className="flex flex-col gap-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                render={<Link to={`/${schema}/${item.url}` as never} />}
                isActive={location.pathname === `/${schema}${item.url}`}
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Quick Search"
        description="Search sidebar items"
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={item.title}
                  onSelect={() => handleSelect(`/${schema}/${item.url}`)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {resourceItems && resourceItems.length > 0 && (
              <CommandGroup heading="Resources">
                {resourceItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={formatTitle(item.name)}
                    onSelect={() => handleSelect(item.url)}
                  >
                    <ResourceIcon item={item} />
                    <span>{formatTitle(item.name)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </SidebarGroup>
  )
}
