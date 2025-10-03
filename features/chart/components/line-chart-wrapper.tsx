import { DatabaseTables } from "@/lib/database-meta.types";

import { loadChart } from "../lib/loaders";
import { ChartsSchema } from "../lib/types";
import { LineChartWidget } from "./line-chart";

export async function LineChartWrapper({ chart }: { chart: ChartsSchema }) {
  const data = (await loadChart(
    chart.view_name as DatabaseTables<"charts">,
  )) as any[] | null;

  return <LineChartWidget chart={chart} data={data} />;
}
