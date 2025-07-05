import { FileSpreadsheetIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { ReportsSidebar } from "@/features/reports/components/reports-sidebar";

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
    <DefaultLayout>
      <PrimaryLayout>
        <ReportsSidebar items={items} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
