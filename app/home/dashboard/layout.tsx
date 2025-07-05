import { LayoutDashboardIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import { PrimaryLayout } from "@/components/layouts/primary-layout";
import { SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

const items = [
  {
    name: "Dashboard 1",
    id: "dashboard-1",
    icon: <LayoutDashboardIcon />,
  },
  {
    name: "Dashboard 2",
    id: "dashboard-2",
    icon: <LayoutDashboardIcon />,
  },
  {
    name: "Dashboard 3",
    id: "dashboard-3",
    icon: <LayoutDashboardIcon />,
  },
];

export default async function HomeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DefaultLayout>
      <PrimaryLayout>
        <DashboardSidebar items={items} />
      </PrimaryLayout>
      <SidebarInset>
        <div className="w-full flex-1 p-4">{children}</div>
      </SidebarInset>
    </DefaultLayout>
  );
}
