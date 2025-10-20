import { DatabaseSchemas, DatabaseViews } from "@/lib/database-meta.types";

export type ReportsSchema = {
  schema: DatabaseSchemas;
  view_name: DatabaseViews<DatabaseSchemas>;
} & ReportMeta;

export type ReportMeta = {
  name: string;
  description?: string;
  caption?: string;
  type: "report";
};
