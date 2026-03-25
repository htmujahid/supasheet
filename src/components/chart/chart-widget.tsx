import { useQuery } from "@tanstack/react-query"

import { Skeleton } from "#/components/ui/skeleton"
import { chartDataQueryOptions } from "#/lib/supabase/data/chart"
import type { ChartSchema } from "#/lib/supabase/data/chart"

import { AreaChartWidget } from "./area-chart"
import { BarChartWidget } from "./bar-chart"
import { LineChartWidget } from "./line-chart"
import { PieChartWidget } from "./pie-chart"
import { RadarChartWidget } from "./radar-chart"

function ChartSkeleton() {
  return (
    <div className="col-span-2 rounded-xl border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="mb-2 h-4 w-40" />
      <div className="mt-4">
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}

export function ChartWidget({ chart }: { chart: ChartSchema }) {
  const { data, isPending } = useQuery(
    chartDataQueryOptions(chart.schema, chart.view_name)
  )

  if (isPending) return <ChartSkeleton />

  switch (chart.chart_type) {
    case "area":
      return <AreaChartWidget chart={chart} data={data ?? null} />
    case "bar":
      return <BarChartWidget chart={chart} data={data ?? null} />
    case "line":
      return <LineChartWidget chart={chart} data={data ?? null} />
    case "pie":
      return <PieChartWidget chart={chart} data={data ?? null} />
    case "radar":
      return <RadarChartWidget chart={chart} data={data ?? null} />
    default:
      return null
  }
}
