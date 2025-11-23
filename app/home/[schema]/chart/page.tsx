import { Metadata } from "next";

import { BarChartIcon } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChartWidgets } from "@/features/chart/components/chart-widgets";
import { loadCharts } from "@/features/chart/lib/loaders";
import { DatabaseSchemas } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

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
    title: `Charts - ${formatTitle(schema)}`,
  };
}

async function ChartPage({ params }: ChartPageProps) {
  const { schema } = await params;
  const charts = await loadCharts(schema);

  if (!charts || charts.length === 0) {
    return (
      <div className="w-full flex-1">
        <DefaultHeader breadcrumbs={[{ title: "Chart" }]} />
        <div className="flex min-h-[calc(100svh-183px)] items-center justify-center">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BarChartIcon />
              </EmptyMedia>
              <EmptyTitle>No Charts Found</EmptyTitle>
              <EmptyDescription>
                There are no charts available for this schema yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Chart" }]} />
      <div className="mx-auto grid max-w-6xl gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
        {charts.map((chart) => (
          <ChartWidgets key={chart.view_name} chart={chart} />
        ))}
      </div>
    </div>
  );
}

export default ChartPage;
