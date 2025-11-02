"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  CalendarDaysIcon,
  ChevronRight,
  EyeIcon,
  Grid3X3Icon,
  ImageIcon,
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

function getSubItemsIcon({ type }: { type: string }) {
  switch (type) {
    case "kanban":
      return "SquareKanban"
    case "calendar":
      return "CalendarDays"
    case "sheet":
      return "Grid3X3"
    case "gallery":
      return "Image"
  }
  return "Eye"
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
          {resources?.map((item) => {
            const itemType = item.meta?.items?.find((i) => i.id === item.meta.primaryItem);
            const href = itemType
              ? `/home/${item.schema}/resource/${item.id}/${itemType.type}/${itemType.id}`
              : `/home/${item.schema}/resource/${item.id}`;

            const icon = itemType
              ? <LucideIconComponent
                iconName={
                  (item.meta.icon as keyof typeof LucideIcons) ||
                  (getSubItemsIcon({ type: itemType.type }) as keyof typeof LucideIcons)
                }
              />
              : <LucideIconComponent
                iconName={
                  (item.meta.icon as keyof typeof LucideIcons) ||
                  (item.type === "table" ? "Table2" : "Eye")
                }
              />;

            const metaItems = itemType
              ? item.meta?.items?.filter((i) => i.id !== itemType.id)
              : item.meta?.items;

            return (
              <Collapsible
                key={item.id}
                defaultOpen={params?.resource === item.id}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={params?.resource === item.id}
                  >
                    <Link href={href}>
                      {icon}
                      <span>{formatTitle(item.name)}</span>
                    </Link>
                  </SidebarMenuButton>
                  {metaItems?.length ? (
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
                          {metaItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id}>
                              <SidebarMenuSubButton asChild>
                                <Link
                                  href={`/home/${item.schema}/resource/${item.id}/${subItem.type}/${subItem.id}`}
                                  title={subItem.name}
                                >
                                  <LucideIconComponent
                                    iconName={
                                      (getSubItemsIcon({ type: subItem.type }) as keyof typeof LucideIcons)
                                    }
                                  />
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
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
