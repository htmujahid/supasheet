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
        .select((defaultQuery?.select?.join(",") ?? "*") + joins.join(""), {
          count: "exact",
        })

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
        .eq(parentColumn as never, parentValue as never)

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
    queryKey: [
      "supasheet",
      "resource-data",
      schema,
      resource,
      "single",
      pk,
      defaultQuery?.join ?? null,
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
        .select("*" + joins.join(""))
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col as never, val as never)
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

export const insertBulkResourceMutationOptions = <S extends DatabaseSchemas>(
  schema: S,
  resource: DatabaseTables<S> | DatabaseViews<S>
) =>
  mutationOptions({
    mutationFn: async (rows: Record<string, unknown>[]) => {
      const { error } = await supabase
        .schema(schema)
        .from(resource)
        .insert(rows as never)
      if (error) throw error
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
        query = query.eq(col as never, val as never)
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
      let query = supabase.schema(schema).from(resource).delete()
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col as never, val as never)
      }
      const { error } = await query
      if (error) throw error

      // Verify the delete (hard or soft) actually took effect by checking
      // whether the row is still visible. If it is, RLS denied the operation.
      let checkQuery = supabase
        .schema(schema)
        .from(resource)
        .select("*", { head: true, count: "exact" })
      for (const [col, val] of Object.entries(pk)) {
        checkQuery = checkQuery.eq(col as never, val as never)
      }
      const { count, error: checkError } = await checkQuery
      if (checkError) throw checkError
      if (count && count > 0) {
        throw new Error(
          "Delete failed: you may not have permission to delete this record"
        )
      }
    },
  })

export type ResourceAuditLog = {
  id: string
  created_at: string
  operation: string
  schema_name: string
  table_name: string
  record_id: string | null
  created_by: string | null
  role: string | null
  user_type: string
  metadata: Record<string, unknown> | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  changed_fields: string[] | null
  is_error: boolean
  error_message: string | null
  error_code: string | null
  created_by_name: string | null
  created_by_email: string | null
  created_by_picture_url: string | null
}

export const resourceAuditLogsQueryOptions = (
  schema: string,
  resource: string,
  recordId?: string
) =>
  queryOptions({
    queryKey: ["supasheet", "resource-audit-logs", schema, resource, recordId],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_audit_logs", {
          p_schema: schema,
          p_table: resource,
          p_record_id: recordId ?? undefined,
        })
      if (error) throw error
      return (data ?? []) as ResourceAuditLog[]
    },
  })

export type ResourceComment = {
  id: string
  created_at: string
  updated_at: string
  schema_name: string
  table_name: string
  record_id: string
  content: string
  created_by: string | null
  created_by_name: string | null
  created_by_email: string | null
  created_by_picture_url: string | null
}

export const resourceCommentsQueryOptions = (
  schema: string,
  resource: string,
  recordId: string
) =>
  queryOptions({
    queryKey: ["supasheet", "resource-comments", schema, resource, recordId],
    queryFn: async () => {
      const { data, error } = await supabase.schema("supasheet").rpc(
        "get_comments" as never,
        {
          p_schema: schema,
          p_table: resource,
          p_record_id: recordId,
        } as never
      )
      if (error) throw error
      return data ?? []
    },
  })

export const insertCommentMutationOptions = () =>
  mutationOptions({
    mutationFn: async (payload: {
      schema_name: string
      table_name: string
      record_id: string
      content: string
      created_by: string
    }) => {
      const { error } = await supabase
        .schema("supasheet")
        .from("comments" as never)
        .insert(payload as never)
      if (error) throw error
    },
  })

export const updateCommentMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .schema("supasheet")
        .from("comments" as never)
        .update({ content, updated_at: new Date().toISOString() } as never)
        .eq("id", id)
      if (error) throw error
    },
  })

export const deleteCommentMutationOptions = () =>
  mutationOptions({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .schema("supasheet")
        .from("comments" as never)
        .delete()
        .eq("id", id)
      if (error) throw error
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
