import { Suspense } from "react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardSidebarSkeleton } from "@/features/dashboard/components/dashboard-sidebar-skeleton";
import { loadDashboards } from "@/features/dashboard/lib/loaders";

export default function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dashboardsPromise = loadDashboards();

  return (
    <>
      <PrimarySidebar>
        <Suspense fallback={<DashboardSidebarSkeleton />}>
          <DashboardSidebar dashboardsPromise={dashboardsPromise} />
        </Suspense>
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
