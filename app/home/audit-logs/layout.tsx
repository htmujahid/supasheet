import { FolderSearchIcon, TextSearchIcon, UserSearchIcon } from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AuditLogsSidebar } from "@/features/audit-logs/components/audit-logs-sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";

const items = [
  {
    name: "Authentication",
    id: "authentication",
    icon: <UserSearchIcon />,
  },
  {
    name: "Resources",
    id: "resources",
    icon: <TextSearchIcon />,
  },
  {
    name: "Storage",
    id: "storage",
    icon: <FolderSearchIcon />,
  },
];

export default async function HomeAuditLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrimarySidebar>
        <AuditLogsSidebar items={items} />
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
