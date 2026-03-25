import { queryOptions } from "@tanstack/react-query"

import { supabase } from "#/lib/supabase/client"

export type DashboardWidgetType =
  | "card_1"
  | "card_2"
  | "card_3"
  | "card_4"
  | "table_1"
  | "table_2"

export type DashboardWidgetMeta = {
  name: string
  description?: string
  caption?: string
  type: "dashboard_widget"
  widget_type: DashboardWidgetType
}

export type DashboardWidgetSchema = {
  schema: string
  view_name: string
} & DashboardWidgetMeta

export const dashboardWidgetsQueryOptions = (schema: string) =>
  queryOptions({
    queryKey: ["supasheet", "dashboard-widgets", schema],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_widgets", { p_schema: schema })
      if (error) throw error

      return data.map((widget) => {
        const meta = (
          widget.comment ? JSON.parse(widget.comment) : {}
        ) as DashboardWidgetMeta
        return {
          view_name: widget.name,
          schema: widget.schema,
          ...meta,
        } as DashboardWidgetSchema
      })
    },
    staleTime: 1000 * 60 * 5,
  })

export const widgetDataQueryOptions = (schema: string, viewName: string) =>
  queryOptions({
    queryKey: ["supasheet", "widget-data", schema, viewName],
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
