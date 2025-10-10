"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

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
import { WarehouseIcon } from "lucide-react";

export function DashboardSidebar({
  items,
}: {
  items: {
    name: string;
    id: string;
    icon: React.ReactNode;
  }[];
}) {
  const params = useParams();

  const acitveItem = items.find((resource) => resource.id === params?.id);

  const [search, setSearch] = useState("");
  const [activeItems, setActiveItems] = useState(items);

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5 border-b p-2.5">
        <SidebarMenuButton className="w-fit px-1.5">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
            <WarehouseIcon className="size-4" />
          </div>
          <span className="truncate font-medium">Dashboard</span>
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-muted-foreground text-sm">
                  No dashboards found
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
                  <SidebarMenuButton
                    asChild
                    isActive={acitveItem?.id === item.id}
                  >
                    <Link href={"/home/dashboard/" + item.id} title={item.name}>
                      {item.icon}
                      <span>{item.name}</span>
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
