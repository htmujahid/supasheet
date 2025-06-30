import { Database } from "./database.types";

export type TableSchema = Record<string, unknown>;

export type DatabaseTables = keyof Database['public']['Tables']

export type PrimaryKey = {
  name: string;
  schema: string;
  table_id: number;
  table_name: string;
}

export type Relationship = {
  id: number;
  source_schema: string;
  constraint_name: string;
  source_table_name: string;
  target_table_name: string;
  source_column_name: string;
  target_column_name: string;
  target_table_schema: string;
}

export type PaginatedData<T> = {
  results: T[];
  total: number;
  page: number;
  perPage: number;
}