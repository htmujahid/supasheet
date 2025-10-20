"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  CalendarDaysIcon,
  ChartGanttIcon,
  ChevronRight,
  EyeIcon,
  ListIcon,
  type LucideIcon,
  PlusIcon,
  SquareKanbanIcon,
} from "lucide-react";
import * as LucideIcons from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useResources } from "@/features/resource/lib/data";
import { formatTitle } from "@/lib/format";

function LucideIconComponent({
  iconName,
}: {
  iconName: keyof typeof LucideIcons;
}) {
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

export function NavResources({ activeSchema }: { activeSchema: string }) {
  const params = useParams<{ resource?: string }>();
  const { data: resources, isLoading } = useResources(activeSchema);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading &&
            new Array(3).fill(null).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton>
                  <Skeleton className="size-5 shrink-0 rounded-md" />

                  <Skeleton className="h-5 w-full" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          {resources?.map((item) => (
            <Collapsible
              key={item.id}
              defaultOpen={params?.resource === item.id}
            >
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={params?.resource === item.id}
                >
                  <Link href={`/home/${item.schema}/resource/${item.id}`}>
                    <LucideIconComponent
                      iconName={
                        (item.meta.icon as keyof typeof LucideIcons) ||
                        (item.type === "table" ? "Table2" : "Eye")
                      }
                    />
                    <span>{formatTitle(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
                {item.type === "table" && item.meta?.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className="bg-sidebar-accent text-sidebar-accent-foreground left-2 data-[state=open]:rotate-90"
                        showOnHover
                      >
                        <ChevronRight />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <SidebarMenuAction showOnHover>
                      <PlusIcon />
                    </SidebarMenuAction>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.meta.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.view}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={`/home/${item.schema}/resource/${item.id}/${subItem.type}/${subItem.view}`}
                                title={subItem.view}
                              >
                                <SubItemsIcon type={subItem.type} />
                                <span>{subItem.name}</span>
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
