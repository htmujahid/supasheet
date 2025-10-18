import { DatabaseTables } from "@/lib/database-meta.types";

import { loadChart } from "../lib/loaders";
import { ChartsSchema } from "../lib/types";
import { AreaChartWidget } from "./area-chart";

export async function AreaChartWrapper({ chart }: { chart: ChartsSchema }) {
  const data = (await loadChart(
    chart.schema,
    chart.view_name
  )) as any[] | null;

  return <AreaChartWidget chart={chart} data={data} />;
}
