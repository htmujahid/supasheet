import { SidebarInset } from "@/components/ui/sidebar";

import { loadResources } from "../lib/loaders";
import { ResourceSidebar } from "./resource-sidebar";

export async function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resources = await loadResources();

  return (
    <>
      <ResourceSidebar resources={resources} />
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </>
  );
}
