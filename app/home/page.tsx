import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Database,
  FileText,
  HardDrive,
  PieChart,
  Shield,
  Users,
} from "lucide-react";

import { PrimarySidebar } from "@/components/layouts/primary-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";

const quickLinks = [
  {
    title: "Dashboards",
    description:
      "View and manage your dashboards with real-time analytics and customizable widgets",
    href: "/home/dashboard",
    icon: BarChart3,
    category: "Analytics",
  },
  {
    title: "SQL Editor",
    description:
      "Execute SQL queries, manage database schemas, and optimize performance",
    href: "/home/sql-editor",
    icon: Database,
    category: "Database",
  },
  {
    title: "Resources",
    description:
      "Manage your data resources, tables, and relationships with visual tools",
    href: "/home/resources",
    icon: FileText,
    category: "Table and Views",
  },
  {
    title: "Users",
    description:
      "Manage user accounts, permissions, roles, and access controls",
    href: "/home/users",
    icon: Users,
    category: "Authentication",
  },
  {
    title: "Storage",
    description:
      "Manage file storage, uploads, and organize your digital assets",
    href: "/home/storage",
    icon: HardDrive,
    category: "Files",
  },
  {
    title: "Reports",
    description:
      "Generate comprehensive reports, export data, and create visualizations",
    href: "/home/reports",
    icon: PieChart,
    category: "Insights",
  },
  {
    title: "Audit Logs",
    description:
      "View system audit logs, track changes, and monitor security events",
    href: "/home/audit-logs",
    icon: Shield,
    category: "Security",
  },
];

export default function Home() {
  return (
    <>
      <PrimarySidebar />
      <SidebarInset>
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-4">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Welcome to SupaSheet
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:max-w-3xl sm:text-base lg:text-lg">
              Quick access to all your tools and resources. Everything you need
              to manage your data, users, and analytics in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Card key={link.href} className="group shadow-none">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                          <div className="rounded-xl border bg-white p-3 transition-colors duration-300 group-hover:bg-gray-50 sm:rounded-2xl sm:p-4">
                            <Icon className="h-6 w-6 text-black sm:h-7 sm:w-7" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg transition-colors group-hover:text-black sm:text-xl">
                            {link.title}
                          </CardTitle>
                          <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wide uppercase">
                            {link.category}
                          </p>
                        </div>
                      </div>
                      <Activity className="text-muted-foreground h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-5 sm:w-5" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0 sm:space-y-5 lg:space-y-6">
                    <CardDescription className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                      {link.description}
                    </CardDescription>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="group/btn w-full"
                    >
                      <Link
                        href={link.href}
                        className="flex items-center justify-center gap-2"
                      >
                        Open
                        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-1 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
