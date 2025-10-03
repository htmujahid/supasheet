import { FileSpreadsheetIcon } from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ReportSidebar } from "@/features/report/components/report-sidebar";
import { loadReportGroups } from "@/features/report/lib/loaders";

export default async function HomeReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reports = await loadReportGroups();

  const items =
    reports?.map((report) => ({
      name: report.group_name,
      id: report.group_name,
      icon: <FileSpreadsheetIcon />,
    })) || [];

  return (
    <>
      <PrimarySidebar>
        <ReportSidebar items={items} />
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
