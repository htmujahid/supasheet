import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { DefaultLayout } from "@/components/layouts/default-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSupabaseServerClient } from "@/lib/supabase/clients/server-client";

export default async function Home() {
  const client = await getSupabaseServerClient();

  const tableCount = await client
    .from("_pg_meta_tables")
    .select("*", {
      count: "exact",
    })
    .then((res) => res.count);

  const viewCount = await client
    .from("_pg_meta_views")
    .select("*", {
      count: "exact",
    })
    .then((res) => res.count);

  return (
    <DefaultLayout>
      <div className="w-full">
        <div className="flex justify-between gap-4 p-4">
          <Link href="/home/resources" className="w-full max-w-sm">
            <Card className="group shadow-none">
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Resources</CardTitle>
                  <ArrowRightIcon className="text-muted-foreground group-hover:text-foreground size-4 transition-all group-hover:scale-150" />
                </div>
                <CardDescription className="flex gap-2 text-sm font-medium">
                  <span>Tables: {tableCount}</span>
                  <span>Views: {viewCount}</span>
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
}
