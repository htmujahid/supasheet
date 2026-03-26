import { mutationOptions, queryOptions } from "@tanstack/react-query"

import type { ColumnFiltersState } from "@tanstack/react-table"

import { SYSTEM_SCHEMAS } from "#/config/database.config"
import type { TableMetadata } from "#/lib/database-meta.types"
import { supabase } from "#/lib/supabase/client"
import { applyFilters } from "#/lib/supabase/filter"

export const schemasQueryOptions = queryOptions({
  queryKey: ["supasheet", "schema", "schemas"],
  queryFn: async () => {
    const { data, error } = await supabase
      .schema("supasheet")
      .rpc("get_schemas")
    if (error) throw error
    return data.map((s) =>
      s.schema === SYSTEM_SCHEMAS[0] ? { schema: "core" } : s
    )
  },
  staleTime: 1000 * 60 * 5,
})

export const resourcesQueryOptions = (schema: string) =>
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
          name: resource.name as string,
          id: resource.name as string,
          schema: resource.schema as string,
          type: "table" as const,
          meta: resource.comment ? JSON.parse(resource.comment) : {},
        }))
        .filter((resource) => resource.meta.display !== "none")

      const viewResources = (viewSchema.data ?? [])
        .map((resource) => ({
          name: resource.name as string,
          id: resource.name as string,
          schema: resource.schema as string,
          type: "view" as const,
          meta: resource.comment ? JSON.parse(resource.comment) : {},
        }))
        .filter((resource) => resource.meta.display === "block")

      const matViewResources = (matViewSchema.data ?? [])
        .map((resource) => ({
          name: resource.name as string,
          id: resource.name as string,
          schema: resource.schema as string,
          type: "view" as const,
          meta: resource.comment ? JSON.parse(resource.comment) : {},
        }))
        .filter((resource) => resource.meta.display === "block")

      return [...tableResources, ...viewResources, ...matViewResources]
    },
    staleTime: 1000 * 60 * 5,
  })

export const columnsSchemaQueryOptions = (schema: string, id: string) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "columns", schema, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_columns", { schema_name: schema, table_name: id })
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 5,
  })

export const tableSchemaQueryOptions = (schema: string, id: string) =>
  queryOptions({
    queryKey: ["supasheet", "schema", "table", schema, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .schema("supasheet")
        .rpc("get_tables", { schema_name: schema, table_name: id })
      if (error) throw error
      return data[0] ?? null
    },
    staleTime: 1000 * 60 * 5,
  })

export const viewSchemaQueryOptions = (schema: string, id: string) =>
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
        return matViewData[0] ?? null
      }

      return viewData[0] ?? null
    },
    staleTime: 1000 * 60 * 5,
  })

export const resourceDataQueryOptions = (
  schema: string,
  resource: string,
  defaultQuery: TableMetadata["query"],
  page: number,
  pageSize: number,
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
          (j) => `,${j.table}!${j.on}(${j.columns.join(",")})`,
        ) || [];

      let query = (supabase as any)
        .schema(schema)
        .from(resource)
        .select("*" + joins.join(""), { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (sortId) query = query.order(sortId, { ascending: !sortDesc })

      query = applyFilters(query, filters)

      const { data, count, error } = await query
      if (error) throw error

      return {
        result: (data ?? []) as Record<string, any>[],
        count: count as number | null,
      }
    },
    staleTime: 1000 * 60 * 2,
  })

export const singleResourceDataQueryOptions = (
  schema: string,
  resource: string,
  pk: Record<string, unknown>,
  defaultQuery?: TableMetadata["query"]
) =>
  queryOptions({
    queryKey: ["supasheet", "resource-data", schema, resource, "single", pk],
    queryFn: async () => {
      const joins =
        defaultQuery?.join?.map(
          (j) => `,${j.table}!${j.on}(${j.columns.join(",")})`
        ) || []

      let query = (supabase as any)
        .schema(schema)
        .from(resource)
        .select("*" + joins.join(""))
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col, val)
      }
      const { data, error } = await query.maybeSingle()
      if (error) throw error

      return data as Record<string, any> | null
    },
    staleTime: 0,
  })

export const insertResourceMutationOptions = (
  schema: string,
  resource: string
) =>
  mutationOptions({
    mutationFn: async (row: Record<string, any>) => {
      const { error } = await (supabase as any)
        .schema(schema)
        .from(resource)
        .insert(row)
      if (error) throw error
    },
  })

export const updateResourceMutationOptions = (
  schema: string,
  resource: string
) =>
  mutationOptions({
    mutationFn: async ({
      pk,
      data,
    }: {
      pk: Record<string, unknown>
      data: Record<string, any>
    }) => {
      let query = (supabase as any).schema(schema).from(resource).update(data)
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col, val)
      }
      const { error } = await query
      if (error) throw error
    },
  })

export const deleteResourceMutationOptions = (
  schema: string,
  resource: string
) =>
  mutationOptions({
    mutationFn: async (pk: Record<string, unknown>) => {
      let query = (supabase as any).schema(schema).from(resource).delete()
      for (const [col, val] of Object.entries(pk)) {
        query = query.eq(col, val)
      }
      const { error } = await query
      if (error) throw error
    },
  })

export const relatedTablesSchemaQueryOptions = (schema: string, id: string) =>
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
