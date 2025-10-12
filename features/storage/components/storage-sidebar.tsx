"use client";

import { use, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { FolderIcon, FolderLockIcon } from "lucide-react";

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

export function StorageSidebar({
  bucketsPromise,
}: {
  bucketsPromise: Promise<
    { id: string; name: string; public: boolean }[] | null
  >;
}) {
  const buckets = use(bucketsPromise);

  const items =
    buckets?.map((bucket) => ({
      id: bucket.id,
      name: bucket.name,
      icon: bucket.public ? <FolderIcon /> : <FolderLockIcon />,
    })) ?? [];

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
          <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
            <FolderIcon className="size-4" />
          </div>
          <span className="truncate font-medium">Storage</span>
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
            {activeItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={acitveItem?.id === item.id}
                >
                  <Link href={"/home/storage/" + item.id} title={item.name}>
                    {item.icon}
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
