import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import { GetResourceSchema } from "./validations";

export async function loadColumnsSchema(id: string) {
  const client = await getSupabaseServerClient();

  const columnResponse = await client
    .schema("supasheet")
    .from("columns")
    .select("*")
    .order("ordinal_position", { ascending: true })
    .eq("table", id);

  return columnResponse.data;
}

export async function loadTableSchema(id: string) {
  const client = await getSupabaseServerClient();

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
}

export async function loadResourceData(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
  input: GetResourceSchema,
) {
  const client = await getSupabaseServerClient();

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
}

export async function loadSingleResourceData(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
  pk: Record<string, unknown>,
) {
  const client = await getSupabaseServerClient();

  const query = client.schema(schema).from(id).select("*");

  for (const [key, value] of Object.entries(pk)) {
    query.eq(key, value as string | number);
  }

  const response = await query.maybeSingle();

  return response.data;
}

export async function loadResources() {
  const client = await getSupabaseServerClient();

    const tableSchema = await client.schema("supasheet").from("tables").select("*");
    const tableResources =
      tableSchema.data?.map((resource) => ({
        name: resource.name as string,
        id: resource.name as string,
        schema: resource.schema as string,
        type: "table",
      })) ?? [];

    const viewSchema = await client.schema("supasheet").from("views").select("*");
    const viewResources =
      viewSchema.data?.map((resource) => ({
        name: resource.name as string,
        id: resource.name as string,
        schema: resource.schema as string,
        type: "view",
      })) ?? [];

    const materializedViewSchema = await client
      .schema("supasheet")
      .from("materialized_views")
      .select("*");
    const materializedViewResources =
      materializedViewSchema.data?.map((resource) => ({
        name: resource.name as string,
        id: resource.name as string,
        schema: resource.schema as string,
        type: "materialized_view",
      })) ?? [];

    return [...tableResources, ...viewResources, ...materializedViewResources];
}

export async function loadForeignKeyData(
  schema: DatabaseSchemas,
  targetTable: DatabaseTables<typeof schema>,
  targetColumn: string,
  value: unknown,
) {
  const client = await getSupabaseServerClient();

  const response = await client
    .from(targetTable)
    .select("*")
    .eq(targetColumn, value as string | number);

  return response.data;
}
