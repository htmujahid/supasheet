import { ChartsSchema } from "../lib/types";
import { AreaChartWrapper } from "./area-chart-wrapper";
import { BarChartWrapper } from "./bar-chart-wrapper";
import { LineChartWrapper } from "./line-chart-wrapper";
import { PieChartWrapper } from "./pie-chart-wrapper";
import { RadarChartWrapper } from "./radar-chart-wrapper";

export function ChartWidgets({ chart }: { chart: ChartsSchema }) {
  switch (chart.chart_type) {
    case "area":
      return <AreaChartWrapper chart={chart} />;
    case "bar":
      return <BarChartWrapper chart={chart} />;
    case "line":
      return <LineChartWrapper chart={chart} />;
    case "pie":
      return <PieChartWrapper chart={chart} />;
    case "radar":
      return <RadarChartWrapper chart={chart} />;
    default:
      return <div>Unknown chart type: {chart.chart_type}</div>;
  }
}
