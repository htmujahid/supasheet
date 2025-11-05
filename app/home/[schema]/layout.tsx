import { DefaultSidebar } from "@/components/layouts/default-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function SchemaLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <DefaultSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
