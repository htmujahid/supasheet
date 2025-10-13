"use client";

import { use, useState } from "react";

import Link from "next/link";

import { DatabaseIcon, ScrollTextIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { formatTitle } from "@/lib/format";

export function AuditLogsSidebar({
  schemasPromise,
}: {
  schemasPromise: Promise<{ schema: string }[]>;
}) {
  const schemas = use(schemasPromise);

  const items =
    schemas.map((schema) => ({
      name: schema.schema,
      schema: schema.schema,
      icon: <DatabaseIcon />,
    })) ?? [];

  const [search, setSearch] = useState("");
  const [activeItems, setActiveItems] = useState(items);

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5 border-b p-2.5">
        <SidebarMenuButton className="w-fit px-1.5">
          <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
            <ScrollTextIcon className="size-4" />
          </div>
          <span className="truncate font-medium">Audit Logs</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarInput
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveItems(
                items.filter((resource) =>
                  resource.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
                ),
              );
            }}
            placeholder="Type to search..."
          />
          <SidebarMenu className="mt-2 overflow-y-auto">
            {activeItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-2 text-center">
                <div className="text-muted-foreground text-sm">
                  No audit logs found
                </div>
                {search && (
                  <div className="text-muted-foreground mt-1 text-xs">
                    Try adjusting your search
                  </div>
                )}
              </div>
            ) : (
              activeItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/home/audit-log?filters=[{"id":"schema_name","value":"${item.schema}","variant":"text","operator":"eq","filterId":"Bx4Aglmk"}]`}
                    >
                      {item.icon}
                      <span>{formatTitle(item.name)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
