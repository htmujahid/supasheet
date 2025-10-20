import { DatabaseTables } from "@/lib/database-meta.types";

import { loadChart } from "../lib/loaders";
import { ChartsSchema } from "../lib/types";
import { BarChartWidget } from "./bar-chart";

export async function BarChartWrapper({ chart }: { chart: ChartsSchema }) {
  const data = (await loadChart(chart.schema, chart.view_name)) as any[] | null;

  return <BarChartWidget chart={chart} data={data} />;
}
