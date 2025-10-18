import { DatabaseSchemas, DatabaseViews } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import type { ChartMeta, ChartsSchema } from "./types";

export async function loadChartGroups() {
  const client = await getSupabaseServerClient();

  const chartGroups = await client.schema("supasheet").rpc("get_chart_groups");

  if (chartGroups.error) {
    return null;
  }

  return chartGroups.data;
}

export async function loadCharts(schema?: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.schema("supasheet").rpc("get_charts", {
    p_schema: schema,
  });

  if (error) {
    console.error("Error fetching charts:", error);
    return [];
  }

  return data.map((chart) => {
    const meta = (chart.comment ? JSON.parse(chart.comment) : {}) as ChartMeta;

    return {
      view_name: chart.name,
      schema: chart.schema,
      ...meta,
    } as ChartsSchema;
  });
}

export async function loadChart(schema: DatabaseSchemas, viewName: DatabaseViews<typeof schema>) {
  const supabase = await getSupabaseServerClient();

  // Execute the view to get chart data
  const { data, error } = await supabase
    .schema(schema)
    .from(viewName)
    .select("*");

  if (error) {
    console.error(`Error fetching data from view ${viewName}:`, error);
    return [];
  }

  return data || [];
}
