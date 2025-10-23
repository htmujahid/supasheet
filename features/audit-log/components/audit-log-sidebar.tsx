"use client";

import { use, useState } from "react";

import Link from "next/link";

import { ArrowLeftIcon, DatabaseIcon, ScrollTextIcon } from "lucide-react";

import { NavSecondary } from "@/components/layouts/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="">
        <SidebarMenuButton className="w-fit px-2">
          <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
            <ScrollTextIcon className="size-4" />
          </div>
          <span className="truncate font-medium">Audit Logs</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Schemas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="overflow-y-auto">
              {schemas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <div className="text-muted-foreground text-sm">
                    No Schema Found
                  </div>
                </div>
              ) : (
                schemas.map((item) => (
                  <SidebarMenuItem key={item.schema}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={`/home/audit-log?filters=[{"id":"schema_name","value":"${item.schema}","variant":"text","operator":"eq","filterId":"Bx4Aglmk"}]`}
                      >
                        <DatabaseIcon />
                        <span>{formatTitle(item.schema)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary
          items={[{ title: "Back to Main", url: "/home", icon: ArrowLeftIcon }]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
