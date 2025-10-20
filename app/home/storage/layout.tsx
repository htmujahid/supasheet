import { Suspense } from "react";

import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StorageSidebar } from "@/features/storage/components/storage-sidebar";
import { StorageSidebarSkeleton } from "@/features/storage/components/storage-sidebar-skeleton";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

async function loadBuckets() {
  const client = await getSupabaseServerClient();
  const { data: buckets } = await client.storage.listBuckets();
  return buckets;
}

export default function HomeStorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bucketsPromise = loadBuckets();

  return (
    <>
      <Suspense fallback={<StorageSidebarSkeleton />}>
        <StorageSidebar bucketsPromise={bucketsPromise} />
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
