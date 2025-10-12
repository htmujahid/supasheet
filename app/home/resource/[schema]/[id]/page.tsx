import { Suspense } from "react";

import { ResourceTable } from "@/features/resource/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "@/features/resource/lib/loaders";
import { resourceSearchParamsCache } from "@/features/resource/lib/validations";
import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { withI18n } from "@/lib/i18n/with-i18n";
import { notFound } from "next/navigation";

async function HomeResourcePage(props: {
  params: Promise<{
    schema: string;
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { id, schema } = (await props.params) as {
    schema: DatabaseSchemas;
    id: DatabaseTables<typeof schema>;
  };
  const searchParams = await props.searchParams;
  const search = resourceSearchParamsCache.parse(searchParams);

  const [tableSchema, columnsSchema, data] = await Promise.all([
    loadTableSchema(schema, id),
    loadColumnsSchema(schema, id),
    loadResourceData(schema, id, search),
  ]);

  if (!columnsSchema) {
    notFound();
  }

  return (
    <div className="px-4">
      <ResourceTable
        tableSchema={tableSchema}
        columnsSchema={columnsSchema}
        data={data}
      />
    </div>
  );
}

export default withI18n(HomeResourcePage);
