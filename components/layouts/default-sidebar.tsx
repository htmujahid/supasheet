"use client"

import * as React from "react"
import {
  Calendar,
  ChartBarIcon,
  FileChartColumnIcon,
  HomeIcon,
  Settings2,
} from "lucide-react"
import { useParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSchemas, useResources } from "@/features/resource/lib/data"

import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavResources } from "./nav-resources"
import { DefaultSidebarSwitcher } from "./default-sidebar-switcher"
import { NavResourceEditor } from "./nav-resource-editor"

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
      icon: Settings2,
    },
    {
      title: "Audit Logs",
      url: "/home/audit-log",
      icon: Calendar,
    },
  ],
}

export function DefaultSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams<{ schema: string; resource: string }>();

  const { data: schemas } = useSchemas();
  const activeSchema = params?.schema ?? (schemas?.[0]?.schema as string);

  const { data: resources } = useResources(activeSchema);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <DefaultSidebarSwitcher
          schemas={schemas ?? []}
          activeSchema={activeSchema}
        />
        <NavMain activeSchema={activeSchema} items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavResources resources={resources} />
        <NavResourceEditor activeSchema={activeSchema} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
