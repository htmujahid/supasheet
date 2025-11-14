import type {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
  TableMetadata,
} from "@/lib/database-meta.types";
import type { Database } from "@/lib/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";
import { applyAndFilters, applyOrFilters } from "@/lib/supabase/filters";

import type { ResourceSearchParams } from "./validations";

export async function loadColumnsSchema<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseTables<Schema> | DatabaseViews<Schema>,
) {
  const client = await getSupabaseServerClient();

  const columnResponse = await client
    .schema("supasheet")
    .rpc("get_columns", { schema_name: schema, table_name: id });

  return columnResponse.data;
}

export async function loadTableSchema<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseTables<Schema>,
) {
  const client = await getSupabaseServerClient<Database>();

  const tableResponse = await client.schema("supasheet").rpc("get_tables", {
    schema_name: schema as string,
    table_name: id as string,
  });

  return tableResponse?.data?.[0] ?? null;
}

export async function loadViewSchema<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseViews<Schema>,
) {
  const client = await getSupabaseServerClient<Database>();

  const viewResponse = await client.schema("supasheet").rpc("get_views", {
    schema_name: schema as string,
    view_name: id as string,
  });

  if (viewResponse.error) {
    return null;
  }

  if (!viewResponse.data || viewResponse.data.length === 0) {
    const materializedViewResponse = await client
      .schema("supasheet")
      .rpc("get_materialized_views", {
        schema_name: schema as string,
        view_name: id as string,
      });

    if (materializedViewResponse.error) {
      return null;
    }

    return materializedViewResponse.data?.[0] ?? null;
  }

  return viewResponse.data?.[0] ?? null;
}

export async function loadRelatedTablesSchema<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseViews<Schema>,
) {
  const client = await getSupabaseServerClient<Database>();

  const tableResponse = await client
    .schema("supasheet")
    .rpc("get_related_tables", {
      schema_name: schema,
      table_name: id,
    });

  if (tableResponse.error) {
    return [];
  }

  return tableResponse.data ?? [];
}

export async function loadResourceData<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseTables<Schema> | DatabaseViews<Schema>,
  input: ResourceSearchParams,
  defaultQuery: TableMetadata["query"],
) {
  const client = await getSupabaseServerClient();

  const { page, perPage, sort, filters, joinOperator } = input;

  const joins =
    defaultQuery?.join?.map(
      (j) => `,${j.table}!${j.on}(${j.columns.join(",")})`,
    ) || [];

  const query = client
    .schema(schema)
    .from(id)
    .select("*" + joins.join(""), { count: "exact" })
    .range((page - 1) * perPage, page * perPage - 1);

  // Apply sorting
  const extendedSort = [...(defaultQuery?.sort ?? []), ...sort];
  extendedSort.forEach((item) => {
    query.order(item.id, { ascending: item.desc });
  });

  // Apply default query filters (always AND)
  if (defaultQuery?.filter) {
    applyAndFilters(query, defaultQuery.filter);
  }

  // Apply user filters based on join operator
  if (joinOperator === "or") {
    applyOrFilters(query, filters);
  } else {
    applyAndFilters(query, filters);
  }

  const response = await query;

  const total = response.count;

  return {
    results: response.data ?? [],
    total: total ?? 0,
    page: Number(page),
    perPage: Number(perPage),
  };
}

export async function loadSingleResourceData<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseTables<Schema> | DatabaseViews<Schema>,
  pk: Record<string, unknown>,
  defaultQuery?: TableMetadata["query"],
) {
  const client = await getSupabaseServerClient();

  const joins =
    defaultQuery?.join?.map(
      (j) => `,${j.table}!${j.on}(${j.columns.join(",")})`,
    ) || [];

  const query = client
    .schema(schema)
    .from(id)
    .select("*" + joins.join(""));

  for (const [key, value] of Object.entries(pk)) {
    query.eq(key, value as any);
  }

  const response = await query.maybeSingle();

  return response.data;
}

export async function loadForeignKeyData<Schema extends DatabaseSchemas>(
  schema: Schema,
  targetTable: DatabaseTables<Schema>,
  targetColumn: string,
  value: unknown,
) {
  const client = await getSupabaseServerClient();

  const response = await client
    .schema(schema)
    .from(targetTable)
    .select("*")
    .eq(targetColumn, value as any);

  return response.data;
}

export async function loadResourcePermissions<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseTables<Schema> | DatabaseViews<Schema>,
) {
  const client = await getSupabaseServerClient();

  const response = await client
    .schema("supasheet")
    .from("role_permissions")
    .select()
    .in("permission", [
      `${schema}.${id}:select`,
      `${schema}.${id}:insert`,
      `${schema}.${id}:update`,
      `${schema}.${id}:delete`,
    ] as Database["supasheet"]["Enums"]["app_permission"][]);

  if (response.error) {
    return {
      canSelect: false,
      canInsert: false,
      canUpdate: false,
      canDelete: false,
    };
  }

  const permissions = {
    canSelect: false,
    canInsert: false,
    canUpdate: false,
    canDelete: false,
  };

  response.data?.forEach((perm) => {
    if (perm.permission === `${schema}.${id}:select`) {
      permissions.canSelect = true;
    } else if (perm.permission === `${schema}.${id}:insert`) {
      permissions.canInsert = true;
    } else if (perm.permission === `${schema}.${id}:update`) {
      permissions.canUpdate = true;
    } else if (perm.permission === `${schema}.${id}:delete`) {
      permissions.canDelete = true;
    }
  });

  return permissions;
}

export async function loadSelectPermissions<Schema extends DatabaseSchemas>(
  schema: Schema,
  id: DatabaseTables<Schema> | DatabaseViews<Schema>,
) {
  const client = await getSupabaseServerClient();

  const response = await client
    .schema("supasheet")
    .from("role_permissions")
    .select()
    .eq(
      "permission",
      `${schema}.${id}:select` as Database["supasheet"]["Enums"]["app_permission"],
    );

  if (response.error) {
    return false;
  }

  return response.data?.length > 0;
}
