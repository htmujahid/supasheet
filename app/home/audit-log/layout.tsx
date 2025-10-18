import { Suspense } from "react";

import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AuditLogsSidebar } from "@/features/audit-log/components/audit-log-sidebar";
import { AuditLogsSidebarSkeleton } from "@/features/audit-log/components/audit-log-sidebar-skeleton";
import { loadSchemas } from "@/features/audit-log/lib/loaders";

export default function HomeAuditLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemasPromise = loadSchemas();

  return (
    <>
        <Suspense fallback={<AuditLogsSidebarSkeleton />}>
          <AuditLogsSidebar schemasPromise={schemasPromise} />
        </Suspense>
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
