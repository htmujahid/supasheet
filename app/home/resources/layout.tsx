import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { ResourceSidebar } from "@/features/resources/components/resource-sidebar";
import { loadResources } from "@/features/resources/lib/loaders";

export default async function HomeResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const resources = await loadResources();

  return (
    <DefaultLayout>
      <PrimaryLayout>
        <ResourceSidebar resources={resources} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
