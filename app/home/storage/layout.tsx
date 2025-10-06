import { FolderIcon, FolderLockIcon } from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StorageSidebar } from "@/features/storage/components/storage-sidebar";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export default async function HomeStorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await getSupabaseServerClient();

  const { data: buckets } = await client.storage.listBuckets();

  const items =
    buckets?.map((bucket) => ({
      id: bucket.id,
      name: bucket.name,
      icon: bucket.public ? <FolderIcon /> : <FolderLockIcon />,
    })) ?? [];

  return (
    <>
      <PrimarySidebar>
        <StorageSidebar items={items} />
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
