"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ChevronDown, ChevronRight, EyeIcon, ProportionsIcon, Table2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const SYSTEM_SCHEMAS = ["supasheet", "dashboards", "charts", "reports"];

export function ResourceSidebar({
  resources,
}: {
  resources: {
    name: string;
    id: string;
    schema: string;
    type: string;
  }[];
}) {
  const params = useParams();

  const activeResource = resources.find(
    (resource) => resource.id === params?.id,
  );

  const uniqueSchemas = Array.from(
    new Set(resources.map((resource) => resource.schema)),
  ).filter((schema) => !SYSTEM_SCHEMAS.includes(schema));

  const [activeSchema, setActiveSchema] = useState(uniqueSchemas[0] || "");
  const [activeResources, setActiveResources] = useState(
    resources.filter((resource) => resource.schema === activeSchema),
  );

  const submenuItems = [] as { title: string; url: string }[];

  const tables = activeResources?.filter(
    (resource) =>
      resource.type === "table" &&
      !SYSTEM_SCHEMAS.includes(resource.schema),
  );

  const views = activeResources?.filter(
    (resource) =>
      resource.type === "view" &&
      !SYSTEM_SCHEMAS.includes(resource.schema),
  );

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5  p-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-fit px-1.5">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
                    <ProportionsIcon className="size-4" />
                  </div>
                  <span className="truncate font-medium">{activeSchema}</span>
                  <ChevronDown className="opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Module
                </DropdownMenuLabel>
                {uniqueSchemas.map((group, index) => (
                  <DropdownMenuItem
                    key={group}
                    onClick={() => {
                      setActiveSchema(group);
                      setActiveResources(
                        resources.filter(
                          (resource) =>
                            resource.schema === group &&
                            !SYSTEM_SCHEMAS.includes(resource.schema),
                        ),
                      );
                    }}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-xs border">
                      <ProportionsIcon className="size-4 shrink-0" />
                    </div>
                    {group}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Tables</SidebarGroupLabel>
          <SidebarMenu className="overflow-y-auto">
            {
              tables.map((item) => (
                <Collapsible key={item.id} asChild defaultOpen={activeResource?.id === item.id}>
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeResource?.id === item.id}
                    >
                      <Link
                        href={"/home/resource/" + item.schema + "/" + item.id}
                        title={item.name}
                      >
                        <Table2 className="mr-2 size-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {submenuItems?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {submenuItems?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))
            }
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarMenu>
            {views.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link
                    href={"/home/resource/" + item.schema + "/" + item.id}
                    title={item.name}
                  >                    
                    <EyeIcon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
