import { Metadata } from "next";

import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ChartWidgets } from "@/features/chart/components/chart-widgets";
import { loadCharts } from "@/features/chart/lib/loaders";
import { DatabaseSchemas } from "@/lib/database-meta.types";

type ChartPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
  }>;
};

export async function generateMetadata({
  params,
}: ChartPageProps): Promise<Metadata> {
  const { schema } = await params;

  return {
    title: `Charts - ${schema}`,
  };
}

async function ChartPage({ params }: ChartPageProps) {
  const { schema } = await params;
  const charts = await loadCharts(schema);

  if (charts && charts.length === 0) {
    notFound();
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Chart" }]} />
      <div className="mx-auto grid max-w-6xl gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
        {charts?.map((chart) => (
          <ChartWidgets key={chart.view_name} chart={chart} />
        ))}
      </div>
    </div>
  );
}

export default ChartPage;
