import { DatabaseTables } from "@/lib/database-meta.types";

import { loadChart } from "../lib/loaders";
import { ChartsSchema } from "../lib/types";
import { RadarChartWidget } from "./radar-chart";

export async function RadarChartWrapper({ chart }: { chart: ChartsSchema }) {
  const data = (await loadChart(chart.schema, chart.view_name)) as any[] | null;

  return <RadarChartWidget chart={chart} data={data} />;
}
