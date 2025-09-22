import { LayoutDashboardIcon } from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";

const items = [
  {
    name: "Dashboard 1",
    id: "dashboard-1",
    icon: <LayoutDashboardIcon />,
  },
  {
    name: "Dashboard 2",
    id: "dashboard-2",
    icon: <LayoutDashboardIcon />,
  },
  {
    name: "Dashboard 3",
    id: "dashboard-3",
    icon: <LayoutDashboardIcon />,
  },
];

export default async function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrimarySidebar>
        <DashboardSidebar items={items} />
      </PrimarySidebar>
      <SidebarInset>
        <div className="w-full flex-1">
          <header className="flex h-12 shrink-0 items-center gap-2 px-4">
            <div className="flex flex-1 items-center gap-2">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:!h-4"
              />
              <AppBreadcrumbs />
            </div>
          </header>
          {children}
        </div>
      </SidebarInset>
    </>
  );
}
