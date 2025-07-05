import { CodeIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { SqlSidebar } from "@/features/sql/components/sql-sidebar";

const items = [
  {
    name: "SQL 1",
    id: "sql-1",
    icon: <CodeIcon />,
  },
  {
    name: "SQL 2",
    id: "sql-2",
    icon: <CodeIcon />,
  },
  {
    name: "SQL 3",
    id: "sql-3",
    icon: <CodeIcon />,
  },
  {
    name: "SQL 4",
    id: "sql-4",
    icon: <CodeIcon />,
  },
  {
    name: "SQL 5",
    id: "sql-5",
    icon: <CodeIcon />,
  },
];

export default async function HomeSqlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <PrimaryLayout>
        <SqlSidebar items={items} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
