import type { Database } from "./database.types"

export type ResourceDataSchema = Record<string, unknown>

export type DatabaseSchemas = keyof Database

export type DatabaseTables<TSchema extends DatabaseSchemas> =
  Database[TSchema] extends { Tables: infer TTables }
    ? TTables extends Record<string, unknown>
      ? keyof TTables & string
      : never
    : never
export type DatabaseViews<TSchema extends DatabaseSchemas> =
  Database[TSchema] extends { Views: infer TViews }
    ? TViews extends Record<string, unknown>
      ? keyof TViews & string
      : never
    : never

export type ColumnSchema<S extends DatabaseSchemas = DatabaseSchemas> =
  Database["supasheet"]["Tables"]["columns"]["Row"] & {
    schema: S
    table: DatabaseTables<S> | DatabaseViews<S>
  }

export type TableSchema<S extends DatabaseSchemas = DatabaseSchemas> =
  Database["supasheet"]["Tables"]["tables"]["Row"] & {
    schema: S
    name: DatabaseTables<S>
  }

export type ViewSchema<S extends DatabaseSchemas = DatabaseSchemas> =
  Database["supasheet"]["Tables"]["views"]["Row"] & {
    schema: S
    name: DatabaseViews<S>
  }

export type ResourceSchema<S extends DatabaseSchemas = DatabaseSchemas> =
  | TableSchema<S>
  | ViewSchema<S>

export function isTableSchema<S extends DatabaseSchemas>(
  schema: ResourceSchema<S>
): schema is TableSchema<S> {
  return "primary_keys" in schema
}

export type PrimaryKey = {
  name: string
  schema: string
  table_id: number
  table_name: string
}

export type Relationship = {
  id: number
  source_schema: DatabaseSchemas
  constraint_name: string
  source_table_name: DatabaseTables<DatabaseSchemas>
  target_table_name: DatabaseTables<DatabaseSchemas>
  source_column_name: string
  target_column_name: string
  target_table_schema: DatabaseSchemas
}

export type PaginatedData<T> = {
  results: T[]
  total: number
  page: number
  perPage: number
}

export type FormMode = "create" | "update" | "read"

export type FieldSectionFields = string[] | Partial<Record<FormMode, string[]>>

export type FieldSection = {
  id: string
  title: string
  description?: string
  icon?: string
  fields: FieldSectionFields
  collapsible?: boolean
}

export type TableMetadata = {
  display?: "block" | "none"
  icon?: string
  query?: {
    sort?: { id: string; desc: boolean }[]
    filter?: {
      id: string
      value: string | string[]
      variant: string
      operator: string
    }[]
    join?: { table: string; on: string; columns: string[] }[]
  }
  primaryItem?: string
  items?: {
    id: string
    name: string
    query?: { [key: string]: unknown }
    [key: string]: unknown
    type: "calendar" | "kanban" | "gallery"
  }[]
  sections?: FieldSection[]
}

export type ViewMetadata = {
  display?: "block" | "none"
  icon?: string
  primaryItem?: string
  items?: {
    id: string
    name: string
    query?: { [key: string]: unknown }
    [key: string]: unknown
    type: "calendar" | "kanban" | "gallery"
  }[]
}

export type EnumMetadata = {
  progress?: boolean
  enums?: {
    [key: string]: {
      icon?: string
      variant:
        | "default"
        | "secondary"
        | "success"
        | "warning"
        | "destructive"
        | "info"
    }
  }
}
