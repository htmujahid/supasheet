"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  ChartGanttIcon,
  type LucideIcon,
  ProportionsIcon,
  ListIcon,
  CalendarDaysIcon,
  EyeIcon,
  SquareKanbanIcon
} from "lucide-react";
import * as LucideIcons from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
import { SYSTEM_SCHEMAS } from "@/config/database.config";
import { formatTitle } from "@/lib/format";
import { useSchemas, useTableResources, useViewResources } from "../lib/data";

export function ResourceSidebar() {
  const params = useParams<{ schema: string, id: string }>();

  const { data: schemas } = useSchemas();
  const activeSchema = params?.schema ?? schemas?.[0]?.schema as string;
  const { data: tables } = useTableResources(activeSchema);
  const { data: views } = useViewResources(activeSchema);

  const uniqueSchemas = schemas?.filter(
    (schema) => !SYSTEM_SCHEMAS.includes(schema.schema),
  ) ?? [];

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5 p-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-fit px-1.5">
                  <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
                    <ProportionsIcon className="size-4" />
                  </div>
                  <span className="truncate font-medium">{formatTitle(activeSchema)}</span>
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
                    key={group.schema}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-xs border">
                      <ProportionsIcon className="size-4 shrink-0" />
                    </div>
                    {formatTitle(group.schema)}
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
            {tables?.map((item) => (
              <Collapsible
                key={item.id}
                asChild
                defaultOpen={params?.id === item.id}
              >
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={params?.id === item.id}
                  >
                    <Link
                      href={"/home/resource/" + item.schema + "/" + item.id}
                    >
                      <LucideIconComponent iconName={item.meta.icon as keyof typeof LucideIcons || 'Table2'} />
                      <span>{formatTitle(item.name)}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item?.meta?.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item?.meta?.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.view}>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/home/resource/${item.schema}/${item.id}/${subItem.type}/${subItem.view}`} title={subItem.view}>
                                  <SubItemsIcon type={subItem.type} />
                                  <span>{formatTitle(subItem.view)}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarMenu>
            {views?.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link
                    href={"/home/resource/" + item.schema + "/" + item.id}
                  >
                    <LucideIconComponent iconName={item.meta.icon as keyof typeof LucideIcons || 'Eye'} />
                    <span>{formatTitle(item.name)}</span>
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

function LucideIconComponent({ iconName } : { iconName: keyof typeof LucideIcons }) {
  const Icon = LucideIcons[iconName] as LucideIcon;

  return <Icon className="size-4 shrink-0" />;
}

function SubItemsIcon({ type }: { type: string }) {
  switch (type) {
    case "list":
      return <ListIcon className="size-4 shrink-0" />;
    case "kanban":
      return <SquareKanbanIcon className="size-4 shrink-0" />;
    case "calendar":
      return <CalendarDaysIcon className="size-4 shrink-0" />;
    case "gantt":
      return <ChartGanttIcon className="size-4 shrink-0" />;
  }
  return <EyeIcon className="size-4 shrink-0" />;
}