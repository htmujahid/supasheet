import { FolderSearchIcon, TextSearchIcon, UserSearchIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { AuditLogsSidebar } from "@/features/audit-logs/components/audit-logs-sidebar";

const items = [
  {
    name: "Authentication",
    id: "authentication",
    icon: <UserSearchIcon />,
  },
  {
    name: "Resources",
    id: "resources",
    icon: <TextSearchIcon />,
  },
  {
    name: "Storage",
    id: "storage",
    icon: <FolderSearchIcon />,
  },
];

export default async function HomeAuditLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <PrimaryLayout>
        <AuditLogsSidebar items={items} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
