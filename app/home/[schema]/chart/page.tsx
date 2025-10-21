import { notFound } from "next/navigation";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ChartWidgets } from "@/features/chart/components/chart-widgets";
import { loadCharts } from "@/features/chart/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

interface ChartDetailPageProps {
  params: Promise<{
    schema: string;
  }>;
}

async function ChartDetailPage({ params }: ChartDetailPageProps) {
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

export default withI18n(ChartDetailPage);
