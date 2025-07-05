import { FolderIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { StorageSidebar } from "@/features/storage/components/storage-sidebar";

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
    <DefaultLayout>
      <PrimaryLayout>
        <StorageSidebar items={items} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
