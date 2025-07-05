"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChartIcon,
  FolderOpenIcon,
  Home,
  ListIcon,
  SquareTerminalIcon,
  TableIcon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";

const navMain = [
  {
    title: "Dashboard",
    url: "/home/dashboard",
    icon: Home,
  },
  {
    title: "SQL Editor",
    url: "/home/sql",
    icon: SquareTerminalIcon,
  },
  {
    title: "Resources",
    url: "/home/resources",
    icon: TableIcon,
  },
  {
    title: "Users",
    url: "/home/users",
    icon: UsersIcon,
  },
  {
    title: "Storage",
    url: "/home/storage",
    icon: FolderOpenIcon,
  },
  {
    title: "Reports",
    url: "/home/reports",
    icon: BarChartIcon,
  },
  {
    title: "Audit Logs",
    url: "/home/audit-logs",
    icon: ListIcon,
  },
];

export function PrimarySidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="none"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="">
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url} prefetch={false}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      isActive={pathname.startsWith(item.url)}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="-ml-0" />
    </Sidebar>
  );
}
