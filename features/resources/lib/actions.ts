"use server";

import { revalidatePath } from "next/cache";

import { DatabaseTables, TableSchema } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export async function deleteResourceDataAction(input: {
  resourceName: DatabaseTables;
  resourceIds: Record<string, unknown[]>;
}) {
  const client = await getSupabaseServerClient();

  const query = client.from(input.resourceName).delete();

  for (const [key, value] of Object.entries(input.resourceIds)) {
    query.in(key, value);
  }

  const { data, error } = await query.select("*");

  revalidatePath(`/home/resources/${input.resourceName}`);

  return {
    data,
    error,
  };
}

export async function updateResourceDataAction(input: {
  resourceName: DatabaseTables;
  resourceIds: Record<string, unknown>;
  data: TableSchema;
}) {
  const client = await getSupabaseServerClient();

  const query = client.from(input.resourceName).update(input.data);

  for (const [key, value] of Object.entries(input.resourceIds)) {
    query.eq(key, value as string | number);
  }

  const { data, error } = await query.select("*");

  revalidatePath(`/home/resources/${input.resourceName}`);

  return {
    data,
    error,
  };
}

export async function createResourceDataAction(input: {
  resourceName: DatabaseTables;
  data: TableSchema;
}) {
  const client = await getSupabaseServerClient();

  console.log(input.data);

  const { data, error } = await client
    .from(input.resourceName)
    .insert({ ...input.data } as never)
    .select("*");

  revalidatePath(`/home/resources/${input.resourceName}`);

  return {
    data,
    error,
  };
}
