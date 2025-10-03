import { DatabaseTables } from "@/lib/database-meta.types";

import { loadChart } from "../lib/loaders";
import { ChartsSchema } from "../lib/types";
import { PieChartWidget } from "./pie-chart";

export async function PieChartWrapper({ chart }: { chart: ChartsSchema }) {
  const data = (await loadChart(
    chart.view_name as DatabaseTables<"charts">,
  )) as any[] | null;

  return <PieChartWidget chart={chart} data={data} />;
}
