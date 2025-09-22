import { FolderIcon } from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { StorageSidebar } from "@/features/storage/components/storage-sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";

const items = [
  {
    name: "Bucket 1",
    id: "bucket-1",
    icon: <FolderIcon />,
  },
  {
    name: "Bucket 2",
    id: "bucket-2",
    icon: <FolderIcon />,
  },
  {
    name: "Bucket 3",
    id: "bucket-3",
    icon: <FolderIcon />,
  },
];

export default async function HomeStorageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
