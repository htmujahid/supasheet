import { Metadata } from "next";

import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
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

  if (widgets && widgets.length === 0) {
    notFound();
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Dashboard" }]} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets?.map((widget) => (
          <DashboardWidgets key={widget.view_name} widget={widget} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
