import { Suspense } from "react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ReportSidebar } from "@/features/report/components/report-sidebar";
import { ReportSidebarSkeleton } from "@/features/report/components/report-sidebar-skeleton";
import { loadReportGroups } from "@/features/report/lib/loaders";

export default function HomeReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reportsPromise = loadReportGroups();

  return (
    <>
      <PrimarySidebar>
        <Suspense fallback={<ReportSidebarSkeleton />}>
          <ReportSidebar reportsPromise={reportsPromise} />
        </Suspense>
      </PrimarySidebar>
      <SidebarInset>
        <div className="w-full flex-1">
          <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4">
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
