import { notFound, redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export default async function Page({
  params,
}: {
  params: Promise<{ schema: string }>;
}) {
  const { schema } = await params;

  const client = await getSupabaseServerClient();

  const { data: tables } = await client.schema("supasheet").rpc("get_schemas");

  const schemaExists = tables?.some((t) => t.schema === schema);

  if (schemaExists) {
    return redirect(`/home/${schema}/dashboard`);
  }

  notFound();
}
