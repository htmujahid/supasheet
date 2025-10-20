import { DatabaseSchemas, DatabaseViews } from "@/lib/database-meta.types";

export type DashboardWidgetsSchema = {
  schema: DatabaseSchemas;
  view_name: DatabaseViews<DatabaseSchemas>;
} & DashboardWidgetMeta;

export type DashboardWidgetType =
  | "card_1"
  | "card_2"
  | "card_3"
  | "card_4"
  | "table_1"
  | "table_2";

export type DashboardWidgetMeta = {
  name: string;
  description?: string;
  caption?: string;
  type: "dashboard_widget";
  widget_type: DashboardWidgetType;
};
