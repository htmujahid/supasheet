import { ChartWidgets } from "@/features/chart/components/chart-widgets";
import { loadCharts } from "@/features/chart/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

interface ChartDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ChartDetailPage({ params }: ChartDetailPageProps) {
  const { id } = await params;
  const charts = await loadCharts(id);

  return (
    <div className="mx-auto grid max-w-6xl gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
      {charts?.map((chart) => (
        <ChartWidgets key={chart.id} chart={chart} />
      ))}
    </div>
  );
}

export default withI18n(ChartDetailPage);
