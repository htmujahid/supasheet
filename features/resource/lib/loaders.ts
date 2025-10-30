import type {
  DatabaseSchemas,
  DatabaseTables,
  DatabaseViews,
} from "@/lib/database-meta.types";
import type { Database } from "@/lib/database.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

import {
  BoardViewData,
  BoardViewReducedData,
  CalendarViewData,
  GanttViewData,
  ListViewData,
  ListViewReducedData,
} from "./types";
import type { ResourceSearchParams } from "./validations";

export async function loadColumnsSchema(schema: string, id: string) {
  const client = await getSupabaseServerClient();

  const columnResponse = await client
    .schema("supasheet")
    .rpc("get_columns", { schema_name: schema, table_name: id });

  return columnResponse.data;
}

export async function loadTableSchema(schema: string, id: string) {
  const client = await getSupabaseServerClient();

  const tableResponse = await client
    .schema("supasheet")
    .rpc("get_tables", { schema_name: schema, table_name: id });

  if (tableResponse.error) {
    return null;
  }

  return tableResponse.data?.[0] || null;
}

export async function loadResourceData(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
  input: ResourceSearchParams,
) {
  const client = await getSupabaseServerClient();

  const { page, perPage, sort, filters, joinOperator } = input;

  const query = client
    .schema(schema)
    .from(id)
    .select("*", { count: "exact" })
    .range((page - 1) * perPage, page * perPage - 1);

  sort.forEach((item) => {
    query.order(item.id, { ascending: item.desc });
  });

  if (joinOperator === "or" && filters.length > 0) {
    const orConditions: string[] = [];

    filters.forEach((filter) => {
      if (filter.operator === "empty") {
        orConditions.push(`${filter.id}.is.null`);
      } else if (filter.operator === "not.empty") {
        orConditions.push(`${filter.id}.not.is.null`);
      } else if (filter.variant === "date") {
        if (filter.operator === "between") {
          const startDate = new Date();
          const endDate = new Date();
          startDate.setTime(Number(filter.value[0]));
          endDate.setTime(Number(filter.value[1]));
          orConditions.push(
            `${filter.id}.gte.${startDate.toISOString()},${filter.id}.lte.${endDate.toISOString()}`,
          );
        } else {
          const date = new Date();
          date.setTime(Number(filter.value));
          orConditions.push(
            `${filter.id}.${filter.operator}.${date.toISOString()}`,
          );
        }
      } else if (filter.variant === "text") {
        if (filter.operator === "ilike") {
          orConditions.push(`${filter.id}.ilike.%${filter.value}%`);
        } else if (filter.operator === "not.ilike") {
          orConditions.push(`${filter.id}.not.ilike.%${filter.value}%`);
        } else {
          orConditions.push(`${filter.id}.${filter.operator}.${filter.value}`);
        }
      } else {
        if (filter.operator === "in") {
          const values = (filter.value as string[]).join(",");
          orConditions.push(`${filter.id}.in.(${values})`);
        } else if (filter.operator === "not.in") {
          const values = (filter.value as string[]).join(",");
          orConditions.push(`${filter.id}.not.in.(${values})`);
        } else if (filter.operator === "between") {
          orConditions.push(
            `${filter.id}.gte.${filter.value[0]},${filter.id}.lte.${filter.value[1]}`,
          );
        } else {
          orConditions.push(`${filter.id}.${filter.operator}.${filter.value}`);
        }
      }
    });

    if (orConditions.length > 0) {
      query.or(orConditions.join(","));
    }
  } else {
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

export async function loadResourcePermissions(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
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

export async function loadSelectPermissions(
  schema: DatabaseSchemas,
  id: DatabaseTables<typeof schema>,
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
