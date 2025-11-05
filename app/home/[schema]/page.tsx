import { Metadata } from "next";

import { notFound, redirect } from "next/navigation";

import { DatabaseSchemas } from "@/lib/database-meta.types";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

type SchemaPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
  }>;
};

export async function generateMetadata({
  params,
}: SchemaPageProps): Promise<Metadata> {
  const { schema } = await params;

  return {
    title: schema,
  };
}

export default async function SchemaPage({ params }: SchemaPageProps) {
  const { schema } = await params;

  const client = await getSupabaseServerClient();

  const { data: tables } = await client.schema("supasheet").rpc("get_schemas");

  const schemaExists = tables?.some((t) => t.schema === schema);

  if (schemaExists) {
    return redirect(`/home/${schema}/dashboard`);
  }

  notFound();
}
