"use client";

import { useParams } from "next/navigation";

import {
  ChartBarIcon,
  FileChartColumnIcon,
  FolderIcon,
  HomeIcon,
  ScrollTextIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SYSTEM_SCHEMAS } from "@/config/database.config";
import { useSchemas } from "@/features/resource/lib/data";

import { DefaultSidebarSwitcher } from "./default-sidebar-switcher";
import { NavMain } from "./nav-main";
import { NavResourceEditor } from "./nav-resource-editor";
import { NavResources } from "./nav-resources";
import { NavSecondary } from "./nav-secondary";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Chart",
      url: "/chart",
      icon: ChartBarIcon,
    },
    {
      title: "Report",
      url: "/report",
      icon: FileChartColumnIcon,
    },
  ],
  navSecondary: [
    {
      title: "Storage",
      url: "/home/storage",
      icon: FolderIcon,
    },
    {
      title: "Audit Logs",
      url: "/home/audit-log",
      icon: ScrollTextIcon,
    },
  ],
};

export function DefaultSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ schema: string; resource: string }>();

  const { data: schemas } = useSchemas();
  let activeSchema = params?.schema;

  if (!activeSchema || SYSTEM_SCHEMAS.includes(activeSchema)) {
    activeSchema = schemas?.[0]?.schema as string;
  }

  return (
    <Sidebar className="border-r-0" collapsible="icon" {...props}>
      <SidebarHeader>
        <DefaultSidebarSwitcher
          schemas={schemas ?? []}
          activeSchema={activeSchema}
        />
        <NavMain activeSchema={activeSchema} items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavResources activeSchema={activeSchema} />
        <NavResourceEditor activeSchema={activeSchema} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
