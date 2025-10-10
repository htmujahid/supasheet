"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AreaChart,
  FileChartColumnIcon,
  FoldersIcon,
  Grid2X2PlusIcon,
  Grid3X3Icon,
  MenuIcon,
  ProportionsIcon,
  ScrollTextIcon,
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

import featuresFlagConfig from "@/config/feature-flags.config";
import pathsConfig from "@/config/paths.config";
import { PersonalAccountDropdown } from "@/features/users/components/personal-account-dropdown";
import { useSignOut } from "@/lib/supabase/hooks/use-sign-out";
import { useUser } from "@/lib/supabase/hooks/use-user";
import { useIsMobile } from "@/hooks/use-mobile";

// This is sample data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/home/dashboard",
      icon: WarehouseIcon,
      isActive: true,
    },
    {
      title: "Chart",
      url: "/home/chart",
      icon: AreaChart,
      isActive: false,
    },
    {
      title: "Resource",
      url: "/home/resource",
      icon: ProportionsIcon,
      isActive: false,
    },
    {
      title: "SQL Editor",
      url: "/home/sql-editor",
      icon: TerminalSquareIcon,
      isActive: false,
    },
    {
      title: "User",
      url: "/home/user",
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
      title: "Report",
      url: "/home/report",
      icon: FileChartColumnIcon,
      isActive: false,
    },
    {
      title: "Audit Logs",
      url: "/home/audit-log",
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

  const isMobile = useIsMobile();

  return (
    <>
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
                <SidebarMenuButton size="lg" asChild className="h-8 p-0">
                  <Link href="/home">
                    <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
              <SidebarGroupContent className="px-0">
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
                          className="px-2"
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
              showProfileName={isMobile}
              paths={paths}
              features={features}
              user={userData!}
              account={{ id: "", name: "", picture_url: "" }}
              signOutRequested={() => signOut.mutateAsync()}
            />
          </SidebarFooter>
        </Sidebar>

        {!isMobile && <>{props.children}</>}
      </Sidebar>
      {isMobile && props.children && (
        <Drawer>
          <DrawerTrigger className="fixed! bottom-4 left-4 z-10 p-1.5 bg-primary text-primary-foreground rounded-md"><MenuIcon className="size-4" /></DrawerTrigger>
          <DrawerContent>
            {props.children}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
