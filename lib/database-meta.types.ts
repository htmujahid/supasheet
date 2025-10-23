import { Database } from "./database.types";

export type ResourceDataSchema = Record<string, unknown>;

export type DatabaseSchemas = keyof Database;

export type DatabaseTables<schema extends DatabaseSchemas> =
  keyof Database[schema]["Tables"];

export type DatabaseViews<schema extends DatabaseSchemas> =
  keyof Database[schema]["Views"];

export type ColumnSchema = Database["supasheet"]["Tables"]["columns"]["Row"];
export type TableSchema = Database["supasheet"]["Tables"]["tables"]["Row"];

export type PrimaryKey = {
  name: string;
  schema: string;
  table_id: number;
  table_name: string;
};

export type Relationship = {
  id: number;
  source_schema: DatabaseSchemas;
  constraint_name: string;
  source_table_name: DatabaseTables<DatabaseSchemas>;
  target_table_name: DatabaseTables<DatabaseSchemas>;
  source_column_name: string;
  target_column_name: string;
  target_table_schema: DatabaseSchemas;
};

export type PaginatedData<T> = {
  results: T[];
  total: number;
  page: number;
  perPage: number;
};

export type SchemaKey = keyof Database;
export type TablesForSchema<TSchema extends SchemaKey> =
  Database[TSchema] extends { Tables: infer TTables }
    ? TTables extends Record<string, unknown>
      ? keyof TTables & string
      : never
    : never;
export type ViewsForSchema<TSchema extends SchemaKey> =
  Database[TSchema] extends { Views: infer TViews }
    ? TViews extends Record<string, unknown>
      ? keyof TViews & string
      : never
    : never;

export type TableMetadata = {
  display?: "block" | "none";
  icon?: string;
  items?: {
    name: string;
    view: string;
    type: "calendar" | "board" | "list" | "gantt";
  }[];
};

export type ViewMetadata = {
  display?: "block" | "none";
  icon?: string;
};
