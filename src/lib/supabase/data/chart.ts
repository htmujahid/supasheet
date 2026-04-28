import { queryOptions } from "@tanstack/react-query"

import type { DatabaseSchemas, DatabaseViews } from "#/lib/database-meta.types"
import { supabase } from "#/lib/supabase/client"

export type ChartType = "area" | "pie" | "line" | "radar" | "bar"

export type ChartMeta = {
  name: string
  description?: string
  caption?: string
  type: "chart"
  chart_type: ChartType
}

export type ChartSchema<S extends DatabaseSchemas> = {
  schema: S
  view_name: DatabaseViews<S>
} & ChartMeta

export const chartsQueryOptions = (schema: DatabaseSchemas) =>
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
        } as ChartSchema<typeof schema>
      })
    },
    staleTime: 1000 * 60 * 5,
  })

export const chartDataQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  viewName: DatabaseViews<S>
) =>
  queryOptions({
    queryKey: ["supasheet", "chart-data", schema, viewName],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema(schema)
        .from(viewName)
        .select("*")
      if (error) throw error

      return (data ?? []) as Record<string, unknown>[]
    },
    staleTime: 1000 * 60 * 5,
  })
