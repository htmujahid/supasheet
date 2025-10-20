import { DatabaseSchemas, DatabaseViews } from "@/lib/database-meta.types";

export type ChartsSchema = {
  schema: DatabaseSchemas;
  view_name: DatabaseViews<DatabaseSchemas>;
} & ChartMeta;

export type ChartType = "area" | "pie" | "line" | "radar" | "bar";

export type ChartMeta = {
  name: string;
  description?: string;
  caption?: string;
  type: "chart";
  chart_type: ChartType;
};
