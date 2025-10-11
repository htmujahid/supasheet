import Link from "next/link";

import {
  AreaChart,
  FileChartColumnIcon,
  FoldersIcon,
  ProportionsIcon,
  ScrollTextIcon,
  TerminalSquareIcon,
  UserIcon,
  WarehouseIcon,
} from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { withI18n } from "@/lib/i18n/with-i18n";

const quickLinks = [
  {
    title: "Dashboard",
    description: "View and manage your dashboards",
    href: "/home/dashboard",
    icon: WarehouseIcon,
  },
  {
    title: "Resource",
    description: "Manage tables, views and data",
    href: "/home/resource",
    icon: ProportionsIcon,
  },
  {
    title: "SQL Editor",
    description: "Execute queries and manage schemas",
    href: "/home/sql-editor",
    icon: TerminalSquareIcon,
  },
  {
    title: "Storage",
    description: "Manage files and uploads",
    href: "/home/storage",
    icon: FoldersIcon,
  },
  {
    title: "Chart",
    description: "Create data visualizations",
    href: "/home/chart",
    icon: AreaChart,
  },
  {
    title: "Report",
    description: "Generate and export reports",
    href: "/home/report",
    icon: FileChartColumnIcon,
  },
  {
    title: "User",
    description: "Manage user accounts and permissions",
    href: "/home/user",
    icon: UserIcon,
  },
  {
    title: "Audit Logs",
    description: "View system logs and track changes",
    href: "/home/audit-log",
    icon: ScrollTextIcon,
  },
];

function Home() {
  return (
    <>
      <PrimarySidebar />
      <SidebarInset>
        <div className="h-screen overflow-auto">
          <div className="flex min-h-screen w-full items-center justify-center p-6">
            <div className="w-full max-w-5xl">
              <div className="mb-12 text-center">
                <h1 className="text-foreground mb-3 text-3xl font-semibold tracking-tight">
                  Welcome to Supasheet
                </h1>
                <p className="text-muted-foreground text-base">
                  Select a tool to get started
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.href}
                      asChild
                      variant="outline"
                      className="h-auto flex-col items-center gap-4 p-6 hover:bg-accent hover:border-primary/50 transition-all"
                    >
                      <Link href={link.href}>
                        <div className="bg-muted flex size-14 items-center justify-center rounded-xl">
                          <Icon className="size-7" />
                        </div>
                        <div className="text-center">
                          <div className="text-foreground mb-1 text-sm font-medium">
                            {link.title}
                          </div>
                          <div className="text-muted-foreground text-xs leading-relaxed">
                            {link.description}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default withI18n(Home);
