import { queryOptions } from "@tanstack/react-query"

import { supabase } from "#/lib/supabase/client"

export type ChartType = "area" | "pie" | "line" | "radar" | "bar"

export type ChartMeta = {
  name: string
  description?: string
  caption?: string
  type: "chart"
  chart_type: ChartType
}

export type ChartSchema = {
  schema: string
  view_name: string
} & ChartMeta

export const chartsQueryOptions = (schema: string) =>
  queryOptions({
    queryKey: ["supasheet", "charts", schema],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_charts", { p_schema: schema })
      if (error) throw error

      return data.map((chart) => {
        const meta = (
          chart.comment ? JSON.parse(chart.comment) : {}
        ) as ChartMeta
        return {
          view_name: chart.name,
          schema: chart.schema,
          ...meta,
        } as ChartSchema
      })
    },
    staleTime: 1000 * 60 * 5,
  })

export const chartDataQueryOptions = (schema: string, viewName: string) =>
  queryOptions({
    queryKey: ["supasheet", "chart-data", schema, viewName],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .schema(schema)
        .from(viewName)
        .select("*")
      if (error) throw error

      return (data ?? []) as Record<string, any>[]
    },
    staleTime: 1000 * 60 * 5,
  })
