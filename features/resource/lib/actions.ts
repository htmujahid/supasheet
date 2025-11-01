"use server";

import { revalidatePath } from "next/cache";

import {
  DatabaseSchemas,
  DatabaseTables,
  ResourceDataSchema,
} from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export async function deleteResourceDataAction(input: {
  schema: DatabaseSchemas;
  resourceName: DatabaseTables<typeof input.schema>;
  resourceIds: Record<string, unknown[]>;
}) {
  const client = await getSupabaseServerClient();

  const query = client.schema(input.schema).from(input.resourceName).delete();

  for (const [key, value] of Object.entries(input.resourceIds)) {
    query.in(key, value);
  }

  const { data, error } = await query.select("*");

  revalidatePath(".");

  return {
    data,
    error,
  };
}

export async function updateResourceDataAction(input: {
  schema: DatabaseSchemas;
  resourceName: DatabaseTables<typeof input.schema>;
  resourceIds: Record<string, unknown>;
  data: ResourceDataSchema;
}) {
  const client = await getSupabaseServerClient();

  const query = client
    .schema(input.schema)
    .from(input.resourceName)
    .update(input.data as never);

  for (const [key, value] of Object.entries(input.resourceIds)) {
    query.eq(key, value as string | number);
  }

  const { data, error } = await query.select("*");

  revalidatePath(".");

  return {
    data,
    error,
  };
}

export async function createResourceDataAction(input: {
  schema: DatabaseSchemas;
  resourceName: DatabaseTables<typeof input.schema>;
  data: ResourceDataSchema;
}) {
  const client = await getSupabaseServerClient();

  const { data, error } = await client
    .schema(input.schema)
    .from(input.resourceName)
    .insert(input.data as never)
    .select("*");

  revalidatePath(".");

  return {
    data,
    error,
  };
}
