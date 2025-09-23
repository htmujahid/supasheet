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
  ).filter((schema) => schema !== "supasheet");

  const [activeSchema, setActiveSchema] = useState(uniqueSchemas[4] || "");
  const [search, setSearch] = useState("");
  const [activeResources, setActiveResources] = useState(
    resources.filter((resource) => resource.schema === activeSchema),
  );

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
            groups={uniqueSchemas}
            activeGroup={activeSchema}
            onValueChange={(group: string) => {
              setActiveSchema(group);
              setActiveResources(
                resources.filter(
                  (resource) =>
                    resource.schema === group &&
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
                  <Link href={"/home/resources/" + item.schema + "/" + item.id} title={item.name}>
                    {getResourceIcon(item.type)}
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

function getResourceIcon(type: string) {
  switch (type) {
    case "table":
      return <Table2 />;
    case "view":
      return <EyeIcon />;
    case "materialized_view":
      return <EyeIcon />;
    default:
      return <Table2 />;
  }
}