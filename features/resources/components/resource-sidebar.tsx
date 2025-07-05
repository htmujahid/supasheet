"use client";

import { useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import { EyeIcon, Table2 } from "lucide-react";

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

import { ResourcesGroup } from "./nav-resources";

export function ResourceSidebar({
  resources,
}: {
  resources: {
    name: string;
    id: string;
    group: string;
    type: string;
  }[];
}) {
  const params = useParams();

  const activeResource = resources.find(
    (resource) => resource.id === params?.id,
  );

  const uniqueGroups = Array.from(
    new Set(resources.map((resource) => resource.group)),
  );

  const [activeGroup, setActiveGroup] = useState("All");
  const [search, setSearch] = useState("");
  const [activeResources, setActiveResources] = useState(resources);

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5 border-b p-2.5">
        <div className="text-foreground text-base font-medium">Resources</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <ResourcesGroup
            groups={uniqueGroups}
            activeGroup={activeGroup}
            onValueChange={(group: string) => {
              setActiveGroup(group);
              if (group === "All") {
                setActiveResources(
                  resources.filter((resource) =>
                    resource.name.toLowerCase().includes(search.toLowerCase()),
                  ),
                );
                return;
              }
              setActiveResources(
                resources.filter(
                  (resource) =>
                    resource.group === group &&
                    resource.name.toLowerCase().includes(search.toLowerCase()),
                ),
              );
            }}
          />
          <SidebarInput
            id="search"
            value={search}
            className="mt-2"
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveResources(
                resources.filter((resource) =>
                  resource.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()),
                ),
              );
            }}
            placeholder="Type to search..."
          />
          <SidebarMenu className="mt-2 overflow-y-auto">
            {activeResources.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={activeResource?.id === item.id}
                >
                  <Link href={"/home/resources/" + item.id} title={item.name}>
                    {item.type === "table" ? <Table2 /> : <EyeIcon />}
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
