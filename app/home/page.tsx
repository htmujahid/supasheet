import { DefaultLayout } from "@/components/layouts/default-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  BarChart3, 
  Database, 
  FileText, 
  Users, 
  PieChart, 
  Shield, 
  HardDrive,
  ArrowRight,
  Activity,
} from "lucide-react";

const quickLinks = [
  {
    title: "Dashboards",
    description: "View and manage your dashboards with real-time analytics and customizable widgets",
    href: "/home/dashboard",
    icon: BarChart3,
    category: "Analytics"
  },
  {
    title: "SQL Editor",
    description: "Execute SQL queries, manage database schemas, and optimize performance",
    href: "/home/sql",
    icon: Database,
    category: "Database"
  },
  {
    title: "Resources",
    description: "Manage your data resources, tables, and relationships with visual tools",
    href: "/home/resources",
    icon: FileText,
    category: "Table and Views"
  },
  {
    title: "Users",
    description: "Manage user accounts, permissions, roles, and access controls",
    href: "/home/users",
    icon: Users,
    category: "Authentication"
  },
  {
    title: "Storage",
    description: "Manage file storage, uploads, and organize your digital assets",
    href: "/home/storage",
    icon: HardDrive,
    category: "Files"
  },
  {
    title: "Reports",
    description: "Generate comprehensive reports, export data, and create visualizations",
    href: "/home/reports",
    icon: PieChart,
    category: "Insights"
  },
  {
    title: "Audit Logs",
    description: "View system audit logs, track changes, and monitor security events",
    href: "/home/audit-logs",
    icon: Shield,
    category: "Security"
  }
];

export default function Home() {
  return (
    <DefaultLayout>
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Welcome to SupaSheet</h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl sm:max-w-3xl leading-relaxed">
            Quick access to all your tools and resources. Everything you need to manage your data, users, and analytics in one place.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Card key={link.href} className="shadow-none group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border group-hover:bg-gray-50 transition-colors duration-300">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-black" />
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl group-hover:text-black transition-colors">
                          {link.title}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                          {link.category}
                        </p>
                      </div>
                    </div>
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4 sm:space-y-5 lg:space-y-6">
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {link.description}
                  </CardDescription>
                  <Button asChild size="sm" variant="outline" className="group/btn w-full">
                    <Link href={link.href} className="flex items-center justify-center gap-2">
                      Open
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DefaultLayout>
  );
}
