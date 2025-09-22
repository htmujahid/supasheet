import { FileSpreadsheetIcon } from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ReportsSidebar } from "@/features/reports/components/reports-sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";

const items = [
  {
    name: "Report 1",
    id: "report-1",
    icon: <FileSpreadsheetIcon />,
  },
  {
    name: "Report 2",
    id: "report-2",
    icon: <FileSpreadsheetIcon />,
  },
  {
    name: "Report 3",
    id: "report-3",
    icon: <FileSpreadsheetIcon />,
  },
  {
    name: "Report 4",
    id: "report-4",
    icon: <FileSpreadsheetIcon />,
  },
  {
    name: "Report 5",
    id: "report-5",
    icon: <FileSpreadsheetIcon />,
  },
];

export default async function HomeReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrimarySidebar>
        <ReportsSidebar items={items} />
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
