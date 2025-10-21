import { DefaultSidebar } from "@/components/layouts/default-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function SchemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DefaultSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
