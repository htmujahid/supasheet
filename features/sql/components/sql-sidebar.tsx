"use client";

import { useState } from "react";
import * as React from "react";

import { useParams } from "next/navigation";

import { ChevronRight, File, Folder } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

const items = {
  app: ["api", "page", "layout"],
  components: ["header", "footer"],
  _: [
    "eslintrc",
    "gitignore",
    "next",
    "tailwind",
    "package",
    "README",
  ],
};

export function SqlSidebar() {
  const [search, setSearch] = useState("");
  const [activeItems, setActiveItems] = useState(items);

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <SidebarHeader className="gap-2.5 border-b p-2.5">
        <div className="text-foreground text-base font-medium">SQL Editor</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarInput
            id="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveItems(Object.entries(items).reduce((acc, [key, value]) => {
                acc[key] = value.filter((item) =>
                  item.toLowerCase().includes(e.target.value.toLowerCase()),
                )
                return acc;
              }, {}));
            }}
            placeholder="Type to search..."
          />
          <SidebarMenu className="mt-2 overflow-y-auto">
            {Object.keys(activeItems).map((item, index) => (
              <Tree
                key={index}
                folder={item}
                files={activeItems[item as keyof typeof items]}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function Tree({ folder, files }: { folder: string; files: string[] }) {
  const params = useParams();

  if (folder === '_') {
    return (
      <SidebarMenuItem>
        {files.map((subItem, index) => (
          <SidebarMenuButton
            key={index}
            isActive={false}
            className="data-[active=true]:bg-transparent"
          >
            <File />
            {subItem}
          </SidebarMenuButton>
        ))}
      </SidebarMenuItem>
    )
  }

  if (!files.length) return;

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        // defaultOpen={name === "components" || name === "ui"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {folder}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {files.map((subItem, index) => (
              <SidebarMenuButton
                key={index}
                isActive={false}
                className="data-[active=true]:bg-transparent"
              >
                <File />
                {subItem}
              </SidebarMenuButton>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
