"use client";

import { use, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { ArrowLeftIcon, FolderIcon, FolderLockIcon } from "lucide-react";

import { NavSecondary } from "@/components/layouts/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { formatTitle } from "@/lib/format";

export function StorageSidebar({
  bucketsPromise,
}: {
  bucketsPromise: Promise<
    { id: string; name: string; public: boolean }[] | null
  >;
}) {
  const buckets = use(bucketsPromise);

  const params = useParams<{ bucket: string }>();

  const activeItem = buckets?.find((bukcet) => bukcet.id === params?.bucket);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="">
        <SidebarMenuButton className="w-fit px-1.5">
          <div className="bg-primary text-primary-foreground flex aspect-square size-5 items-center justify-center rounded">
            <FolderIcon className="size-4" />
          </div>
          <span className="truncate font-medium">Storage</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Buckets</SidebarGroupLabel>
          <SidebarMenu className="overflow-y-auto">
            {buckets?.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={activeItem?.id === item.id}
                >
                  <Link href={"/home/storage/" + item.id}>
                    {item.public ? <FolderIcon /> : <FolderLockIcon />}
                    <span>{formatTitle(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
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
