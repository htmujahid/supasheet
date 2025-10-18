"use client";

import { use, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeftIcon, FolderIcon, FolderLockIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { formatTitle } from "@/lib/format";
import { NavSecondary } from "@/components/layouts/nav-secondary";

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

  const params = useParams<{ bucket: string }>();

  const activeItem = items.find((resource) => resource.id === params?.bucket);

  const [search, setSearch] = useState("");
  const [activeItems, setActiveItems] = useState(items);

  return (
    <Sidebar
      className="border-r"
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
                  isActive={activeItem?.id === item.id}
                >
                  <Link href={"/home/storage/" + item.id}>
                    {item.icon}
                    <span>{formatTitle(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={[{title: "Back to Main", url: "/home", icon: ArrowLeftIcon}]} />
      </SidebarFooter>
    </Sidebar>
  );
}
