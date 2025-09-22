import { useQuery } from "@tanstack/react-query";

import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/clients/browser-client";

import { GetResourceSchema } from "./validations";

export function useColumnsSchema(id: string) {
  return useQuery({
    queryKey: ["columns-schema", id],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();

      const columnResponse = await client
        .schema("supasheet")
        .from("columns")
        .select("*")
        .order("ordinal_position", { ascending: true })
        .eq("relation", id);

      return columnResponse.data;
    },
    enabled: !!id,
  });
}

export function useTableSchema(id: string) {
  return useQuery({
    queryKey: ["table-schema", id],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();

      const tableResponse = await client
        .schema("supasheet")
        .from("tables")
        .select("*")
        .eq("name", id)
        .single();

      if (tableResponse.error) {
        return null;
      }

      return tableResponse.data;
    },
    enabled: !!id,
  });
}

export function useResourceData(schema: DatabaseSchemas, id: DatabaseTables<typeof schema>, input: GetResourceSchema) {
  return useQuery({
    queryKey: ["resource-data", id, input],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();
      const { page, perPage, sort, filters } = input;

      const query = client
        .schema(schema)
        .from(id)
        .select("*", { count: "exact" })
        .range((page - 1) * perPage, page * perPage - 1);

      sort.forEach((item) => {
        query.order(item.id, { ascending: item.desc });
      });

      filters.forEach((filter) => {
        if (filter.operator === "empty") {
          query.filter(filter.id, "is", null);
          return;
        } else if (filter.operator === "not.empty") {
          query.filter(filter.id, "not.is", null);
          return;
        }

        if (filter.variant === "date") {
          if (filter.operator === "between") {
            const startDate = new Date();
            const endDate = new Date();

            startDate.setTime(Number(filter.value[0]));
            endDate.setTime(Number(filter.value[1]));

            query
              .gte(filter.id, startDate.toISOString())
              .lte(filter.id, endDate.toISOString());
          } else {
            const date = new Date();
            date.setTime(Number(filter.value));

            query.filter(filter.id, filter.operator, date.toISOString());
          }
        } else if (filter.variant === "text") {
          if (filter.operator === "ilike") {
            query.ilike(filter.id, `%${filter.value}%`);
          } else if (filter.operator === "not.ilike") {
            query.not(filter.id, "ilike", `%${filter.value}%`);
          } else {
            query.filter(filter.id, filter.operator, filter.value);
          }
        } else {
          if (filter.operator === "in") {
            query.in(filter.id, filter.value as string[]);
          } else if (filter.operator === "not.in") {
            query.not("status", "in", filter.value as string[]);
          } else if (filter.operator === "between") {
            query
              .gte(filter.id, filter.value[0] as string)
              .lte(filter.id, filter.value[1] as string);
          } else {
            query.filter(filter.id, filter.operator, filter.value);
          }
        }
      });

      const response = await query;
      const total = response.count;

      return {
        results: response.data ?? [],
        total: total ?? 0,
        page: Number(page),
        perPage: Number(perPage),
      };
    },
    enabled: !!id,
  });
}

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const client = getSupabaseBrowserClient();

        const tableSchema = await client.schema("supasheet").from("tables").select("*");
        const tableResources =
          tableSchema.data?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            group: resource.schema as string,
          })) ?? [];

        const viewSchema = await client.schema("supasheet").from("views").select("*");
        const viewResources =
          viewSchema.data?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            group: resource.schema as string,
          })) ?? [];

        const materializedViewSchema = await client.schema("supasheet").from("materialized_views").select("*");
        const materializedViewResources =
          materializedViewSchema.data?.map((resource) => ({
            name: resource.name as string,
            id: resource.name as string,
            group: resource.schema as string,
          })) ?? [];

        return [...tableResources, ...viewResources, ...materializedViewResources];
    },
  });
}
