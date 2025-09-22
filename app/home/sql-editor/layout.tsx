import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SqlSidebar } from "@/features/sql/components/sql-sidebar";

export default async function HomeSqlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PrimarySidebar>
        <SqlSidebar />
      </PrimarySidebar>
      <SidebarInset>
        <div className="w-full flex-1">{children}</div>
      </SidebarInset>
    </>
  );
}
