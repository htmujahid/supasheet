import { Database } from "./database.types";

export type ResourceDataSchema = Record<string, unknown>;

export type DatabaseSchemas = keyof Database;

export type DatabaseTables<TSchema extends DatabaseSchemas> =
  Database[TSchema] extends { Tables: infer TTables }
    ? TTables extends Record<string, unknown>
      ? keyof TTables & string
      : never
    : never;
export type DatabaseViews<TSchema extends DatabaseSchemas> =
  Database[TSchema] extends { Views: infer TViews }
    ? TViews extends Record<string, unknown>
      ? keyof TViews & string
      : never
    : never;

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

export type TableMetadata = {
  display?: "block" | "none";
  icon?: string;
  primaryItem?: string;
  query?: {
    sort?: { id: string; desc: boolean }[];
    filter?: {
      id: string;
      value: string | string[];
      variant: string;
      operator: string;
    }[];
    join?: { table: string; on: string; columns: string[] }[];
  };
  items?: {
    id: string;
    name: string;
    query?: { [key: string]: unknown };
    [key: string]: unknown;
    type: "calendar" | "kanban" | "sheet" | "gallery";
  }[];
};

export type ViewMetadata = {
  display?: "block" | "none";
  icon?: string;
  primaryItem?: string;
  items?: {
    id: string;
    name: string;
    query?: { [key: string]: unknown };
    [key: string]: unknown;
    type: "calendar" | "kanban" | "sheet" | "gallery";
  }[];
};

export type EnumMetadata = {
  progress?: boolean;
  enums?: {
    [key: string]: {
      icon?: string;
      variant: "default" | "secondary" | "success" | "warning" | "destructive" | "info";
    };
  }
}