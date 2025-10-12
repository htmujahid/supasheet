import { DatabaseTables } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export async function loadDashboards() {
  const client = await getSupabaseServerClient();

  const dashboards = await client.schema("supasheet").rpc("get_dashboards");

  if (dashboards.error) {
    return null;
  }

  return dashboards.data;
}

export async function loadDashboardWidgets(group: string) {
  const client = await getSupabaseServerClient();

  const widgets = await client
    .schema("supasheet")
    .rpc("get_widgets", { p_group: group });

  if (widgets.error) {
    return null;
  }

  return widgets.data;
}

export async function loadWidget(id: DatabaseTables<"dashboards">) {
  const client = await getSupabaseServerClient();

  const widget = await client.schema("dashboards").from(id).select("*");

  if (widget.error) {
    return null;
  }

  return widget.data as Record<string, any>[];
}
