import { Suspense } from "react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ChartSidebar } from "@/features/chart/components/chart-sidebar";
import { ChartSidebarSkeleton } from "@/features/chart/components/chart-sidebar-skeleton";
import { loadChartGroups } from "@/features/chart/lib/loaders";

export default function ChartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chartsPromise = loadChartGroups();

  return (
    <>
      <PrimarySidebar>
        <Suspense fallback={<ChartSidebarSkeleton />}>
          <ChartSidebar chartsPromise={chartsPromise} />
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
