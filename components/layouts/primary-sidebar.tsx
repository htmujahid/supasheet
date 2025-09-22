"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChartAreaIcon,
  FoldersIcon,
  Grid2X2PlusIcon,
  ScrollTextIcon,
  Table2Icon,
  TerminalSquareIcon,
  UserIcon,
  WarehouseIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import featuresFlagConfig from "@/config/feature-flags.config";
import pathsConfig from "@/config/paths.config";
import { PersonalAccountDropdown } from "@/features/users/components/personal-account-dropdown";
import { useSignOut } from "@/lib/supabase/hooks/use-sign-out";
import { useUser } from "@/lib/supabase/hooks/use-user";

// This is sample data
const data = {
  navMain: [
    {
      title: "Dashboards",
      url: "/home/dashboards",
      icon: WarehouseIcon,
      isActive: true,
    },
    {
      title: "Resources",
      url: "/home/resources",
      icon: Table2Icon,
      isActive: false,
    },
    {
      title: "SQL Editor",
      url: "/home/sql-editor",
      icon: TerminalSquareIcon,
      isActive: false,
    },
    {
      title: "Users",
      url: "/home/users",
      icon: UserIcon,
      isActive: false,
    },
    {
      title: "Storage",
      url: "/home/storage",
      icon: FoldersIcon,
      isActive: false,
    },
    {
      title: "Reports",
      url: "/home/reports",
      icon: ChartAreaIcon,
      isActive: false,
    },
    {
      title: "Audit Logs",
      url: "/home/audit-logs",
      icon: ScrollTextIcon,
      isActive: false,
    },
  ],
};

const paths = {
  home: pathsConfig.app.home,
  account: pathsConfig.app.account,
};

const features = {
  enableThemeToggle: featuresFlagConfig.enableThemeToggle,
};

export function PrimarySidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: userData } = useUser();
  const signOut = useSignOut();

  if (!userData) {
    return null;
  }

  return (
    <Sidebar
      collapsible={props.children ? "icon" : "none"}
      className={`h-screen overflow-hidden *:data-[sidebar=sidebar]:flex-row ${props.children ? "" : "w-12 border-r"}`}
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link href="/home">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Grid2X2PlusIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Supasheet</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} className="w-full">
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        isActive={pathname === item.url}
                        className="px-2.5 md:px-2"
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
        <SidebarFooter>
          <PersonalAccountDropdown
            showProfileName={false}
            paths={paths}
            features={features}
            user={userData}
            signOutRequested={() => signOut.mutateAsync()}
          />
        </SidebarFooter>
      </Sidebar>

      {props.children}
    </Sidebar>
  );
}
