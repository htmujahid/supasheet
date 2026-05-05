import { mutationOptions, queryOptions } from "@tanstack/react-query"

import type { ColumnFiltersState } from "@tanstack/react-table"

import { SYSTEM_SCHEMAS } from "#/config/database.config"
import type {
  ColumnSchema,
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  TableMetadata,
  TableSchema,
  ViewMetadata,
  ViewSchema,
} from "#/lib/database-meta.types"
import { supabase } from "#/lib/supabase/client"
import { applyFilters } from "#/lib/supabase/filter"

export const joinAlias = (on: string) =>
  on.endsWith("_id") ? on.slice(0, -3) : on

export const schemasQueryOptions = queryOptions({
  queryKey: ["supasheet", "schema", "schemas"],
  queryFn: async () => {
    const { data, error } = await supabase
      .schema("supasheet")
      .rpc("get_schemas")
    if (error) throw error
    return [
      ...data.filter((s) => !SYSTEM_SCHEMAS.includes(s.schema)),
      { schema: "core" },
    ] as { schema: DatabaseSchemas }[]
  },
  staleTime: 1000 * 60 * 5,
})

export const resourcesQueryOptions = (schema: DatabaseSchemas) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "resources", schema],
    queryFn: async () => {
      const [tableSchema, viewSchema, matViewSchema] = await Promise.all([
        supabase.schema("supasheet").rpc("get_tables", { schema_name: schema }),
        supabase.schema("supasheet").rpc("get_views", { schema_name: schema }),
        supabase
          .schema("supasheet")
          .rpc("get_materialized_views", { schema_name: schema }),
      ])

      const tableResources = (tableSchema.data ?? [])
        .map((resource) => ({
          name: resource.name as DatabaseTables<typeof schema>,
          id: resource.name as DatabaseTables<typeof schema>,
          schema: resource.schema as typeof schema,
          type: "table" as const,
          meta: (resource.comment
            ? JSON.parse(resource.comment)
            : {}) as TableMetadata,
        }))
        .filter((resource) => resource.meta.display !== "none")

      const viewResources = (viewSchema.data ?? [])
        .map((resource) => ({
          name: resource.name as DatabaseViews<typeof schema>,
          id: resource.name as DatabaseViews<typeof schema>,
          schema: resource.schema as typeof schema,
          type: "view" as const,
          meta: (resource.comment
            ? JSON.parse(resource.comment)
            : {}) as ViewMetadata,
        }))
        .filter((resource) => resource.meta.display === "block")

      const matViewResources = (matViewSchema.data ?? [])
        .map((resource) => ({
          name: resource.name as DatabaseViews<typeof schema>,
          id: resource.name as DatabaseViews<typeof schema>,
          schema: resource.schema as typeof schema,
          type: "view" as const,
          meta: (resource.comment
            ? JSON.parse(resource.comment)
            : {}) as ViewMetadata,
        }))
        .filter((resource) => resource.meta.display === "block")

      return [...tableResources, ...viewResources, ...matViewResources]
    },
    staleTime: 1000 * 60 * 5,
  })

export const columnsSchemaQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  id: DatabaseTables<S> | DatabaseViews<S>
) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "columns", schema, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_columns", { schema_name: schema, table_name: id })
      if (error) throw error
      return (data as unknown as ColumnSchema<S>[]) ?? []
    },
    staleTime: 1000 * 60 * 5,
  })

export const tableSchemaQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  id: DatabaseTables<S> | DatabaseViews<S>
) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "table", schema, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_tables", { schema_name: schema, table_name: id })

      if (error) throw error
      return (data[0] ?? null) as unknown as TableSchema<S> | null
    },
    staleTime: 1000 * 60 * 5,
  })

export const viewSchemaQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  id: DatabaseViews<S>
) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "view", schema, id],
    queryFn: async () => {
      const { data: viewData, error: viewError } = await supabase
        .schema("supasheet")
        .rpc("get_views", { schema_name: schema, view_name: id })

      if (viewError) return null

      if (viewData.length === 0) {
        const { data: matViewData, error: matViewError } = await supabase
          .schema("supasheet")
          .rpc("get_materialized_views", {
            schema_name: schema,
            view_name: id,
          })
        if (matViewError) return null
        return (matViewData[0] ?? null) as unknown as ViewSchema<S> | null
      }

      return (viewData[0] ?? null) as unknown as ViewSchema<S> | null
    },
    staleTime: 1000 * 60 * 5,
  })

export const resourceDataQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>,
  defaultQuery: TableMetadata["query"],
  page?: number,
  pageSize?: number,
  sortId?: string,
  sortDesc?: boolean,
  filters: ColumnFiltersState = []
) =>
  queryOptions({
    queryKey: [
      "supasheet",
      "resource-data",
      schema,
      resource,
      page,
      pageSize,
      sortId,
      sortDesc,
      filters,
    ],
    queryFn: async () => {
      const joins =
        defaultQuery?.join?.map(
          (j) =>
            `,${joinAlias(j.on)}:${j.table}!${j.on}(${j.columns.join(",")})`
        ) || []

      let query = supabase
        .schema(schema)
        .from(resource)
        .select("*" + joins.join(""), { count: "exact" })

      if (page && pageSize) {
        query = query.range((page - 1) * pageSize, page * pageSize - 1)
      }

      if (sortId) query = query.order(sortId, { ascending: !sortDesc })

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return {
        result: (data ?? []) as unknown as Record<string, unknown>[],
        count: count,
      }
    },
    staleTime: 1000 * 60 * 2,
  })

export const foreignTableDataQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>,
  parentColumn: string,
  parentValue: unknown,
  selectClause: string = "*",
  page?: number,
  pageSize?: number,
  sortId?: string,
  sortDesc?: boolean,
  filters: ColumnFiltersState = []
) =>
  queryOptions({
    queryKey: [
      "supasheet",
      "resource-data",
      schema,
      resource,
      "foreign",
      parentColumn,
      parentValue,
      selectClause,
      page,
      pageSize,
      sortId,
      sortDesc,
      filters,
    ],
    queryFn: async () => {
      let query = supabase
        .schema(schema)
        .from(resource)
        .select(selectClause, { count: "exact" })
        .eq(parentColumn, parentValue as never)

      if (page && pageSize) {
        query = query.range((page - 1) * pageSize, page * pageSize - 1)
      }

      if (sortId) query = query.order(sortId, { ascending: !sortDesc })

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return {
        result: (data ?? []) as unknown as Record<string, unknown>[],
        count: count,
      }
    },
    staleTime: 1000 * 60 * 2,
  })

export const singleResourceDataQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>,
  pk: Record<string, unknown>,
  defaultQuery?: TableMetadata["query"]
) =>
  queryOptions({
    queryKey: ["supasheet", "resource-data", schema, resource, "single", pk],
    queryFn: async () => {
      const joins =
        defaultQuery?.join?.map(
          (j) =>
            `,${joinAlias(j.on)}:${j.table}!${j.on}(${j.columns.join(",")})`
        ) || []

      let query = supabase
        .schema(schema)
        .from(resource)
        .select("*" + joins.join(""))
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col, val as never)
      }
      const { data, error } = await query.maybeSingle()
      if (error) throw error

      return data ?? (null as Record<string, unknown> | null)
    },
    staleTime: 0,
  })

export const insertResourceMutationOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>
) =>
  mutationOptions({
    mutationFn: async (row: Record<string, unknown>) => {
      const { data, error } = await supabase
        .schema(schema)
        .from(resource)
        .insert(row as never)
        .select()
        .single()
      if (error) throw error
      return data as Record<string, unknown> | null
    },
  })

export const updateResourceMutationOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>
) =>
  mutationOptions({
    mutationFn: async ({
      pk,
      data,
    }: {
      pk: Record<string, unknown>
      data: Record<string, unknown>
    }) => {
      let query = supabase
        .schema(schema)
        .from(resource)
        .update(data as never)
        .select()
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col, val as never)
      }
      const { data: updated, error } = await query
      if (error) throw error
      if (!updated || updated.length === 0) {
        throw new Error(
          "Update failed: you may not have permission to modify this record"
        )
      }
    },
  })

export const deleteResourceMutationOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>
) =>
  mutationOptions({
    mutationFn: async (pk: Record<string, unknown>) => {
      let query = supabase.schema(schema).from(resource).delete().select()
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col, val as never)
      }
      const { data: deleted, error } = await query
      if (error) throw error
      if (!deleted || deleted.length === 0) {
        throw new Error(
          "Delete failed: you may not have permission to delete this record"
        )
      }
    },
  })

export const relatedTablesSchemaQueryOptions = <S extends DatabaseSchemas>(
  schema: S,
  id: DatabaseTables<S> | DatabaseViews<S>
) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "related_tables", schema, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_related_tables", {
          schema_name: schema,
          table_name: id,
        })
      if (error) return []
      return data
    },
    staleTime: 1000 * 60 * 5,
  })
