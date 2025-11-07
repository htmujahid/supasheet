import { Metadata } from "next";

import { LayoutDashboardIcon } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DashboardWidgets } from "@/features/dashboard/components/dashboard-widgets";
import { loadDashboardWidgets } from "@/features/dashboard/lib/loaders";
import { DatabaseSchemas } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type DashboardPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
  }>;
};

export async function generateMetadata({
  params,
}: DashboardPageProps): Promise<Metadata> {
  const { schema } = await params;

  return {
    title: `Dashboard - ${formatTitle(schema)}`,
  };
}

async function DashboardPage({ params }: DashboardPageProps) {
  const { schema } = await params;
  const widgets = await loadDashboardWidgets(schema);

  if (!widgets || widgets.length === 0) {
    return (
      <div className="w-full flex-1">
        <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
        <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <LayoutDashboardIcon />
              </EmptyMedia>
              <EmptyTitle>No Widgets Found</EmptyTitle>
              <EmptyDescription>
                There are no dashboard widgets available for this schema yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget) => (
          <DashboardWidgets key={widget.view_name} widget={widget} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
