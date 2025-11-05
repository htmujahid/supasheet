import { Metadata } from "next";

import { SQL } from "@/features/sql/components/sql";
import { DatabaseSchemas } from "@/lib/database-meta.types";

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
    title: `SQL Editor - ${schema}`,
  };
}

function SqlPage() {
  return <SQL />;
}

export default SqlPage;
