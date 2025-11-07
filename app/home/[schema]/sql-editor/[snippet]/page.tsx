import { Metadata } from "next";

import { SQL } from "@/features/sql/components/sql";
import { DatabaseSchemas } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type SqlPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    snippet: string;
  }>;
};

export async function generateMetadata({
  params,
}: SqlPageProps): Promise<Metadata> {
  const { schema } = await params;

  return {
    title: `SQL Editor - ${formatTitle(schema)}`,
  };
}

function SqlPage() {
  return <SQL />;
}

export default SqlPage;
