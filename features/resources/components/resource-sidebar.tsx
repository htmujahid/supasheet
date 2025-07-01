"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { SearchIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar";

import ResourcesGroup, { NavResources } from "./nav-resources";

export function ResourceSidebar({
  resources,
}: {
  resources: {
    name: string;
    id: string;
    group: string;
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
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
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
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            value={search}
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
            className="h-8 pl-7"
          />
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavResources
          resources={activeResources}
          activeResource={activeResource?.id}
        />
      </SidebarContent>
    </Sidebar>
  );
}
