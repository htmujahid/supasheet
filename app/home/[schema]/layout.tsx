import { Suspense } from "react";

import { DefaultSidebar } from "@/components/layouts/default-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function SchemaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DefaultSidebar />
      </Suspense>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
