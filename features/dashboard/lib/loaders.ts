import { DatabaseSchemas, DatabaseViews } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { DashboardWidgetMeta, DashboardWidgetsSchema } from "./types";

export async function loadDashboards() {
  const client = await getSupabaseServerClient();

  const dashboards = await client.schema("supasheet").rpc("get_dashboards");

  if (dashboards.error) {
    return null;
  }

  return dashboards.data;
}

export async function loadDashboardWidgets(schema: string) {
  const client = await getSupabaseServerClient();

  const { data, error } = await client
    .schema("supasheet")
    .rpc("get_widgets", { p_schema: schema });

  if (error) {
    return null;
  }

  return data.map((widget) => {
    const meta = (widget.comment ? JSON.parse(widget.comment) : {}) as DashboardWidgetMeta;

    return {
      view_name: widget.name,
      schema: widget.schema,
      ...meta,
    } as DashboardWidgetsSchema;
  });
}

export async function loadWidget(schema: DatabaseSchemas, viewName: DatabaseViews<typeof schema>) {
  const client = await getSupabaseServerClient();

  const widget = await client.schema(schema).from(viewName).select("*");

  if (widget.error) {
    return null;
  }

  return widget.data as Record<string, any>[];
}
