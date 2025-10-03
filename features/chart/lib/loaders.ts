import { DatabaseTables, ViewsForSchema } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import type { ChartsSchema } from "./types";

export async function loadChartGroups() {
  const client = await getSupabaseServerClient();

  const chartGroups = await client.schema("supasheet").rpc("get_chart_groups");

  if (chartGroups.error) {
    return null;
  }

  return chartGroups.data;
}

export async function loadCharts(group?: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.schema("supasheet").rpc("get_charts", {
    p_group: group,
  });

  if (error) {
    console.error("Error fetching charts:", error);
    return [];
  }

  return (data as ChartsSchema[]) || [];
}

export async function loadChart(viewName: DatabaseTables<"charts">) {
  const supabase = await getSupabaseServerClient();

  // Execute the view to get chart data
  const { data, error } = await supabase
    .schema("charts")
    .from(viewName)
    .select("*");

  if (error) {
    console.error(`Error fetching data from view ${viewName}:`, error);
    return [];
  }

  return data || [];
}
