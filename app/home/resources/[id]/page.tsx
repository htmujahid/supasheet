import { Suspense } from "react";

import { DataTableSkeleton } from "@/features/resources/components/data-table/data-table-skeleton";
import { ResourceTable } from "@/features/resources/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "@/features/resources/lib/loaders";
import { searchParamsCache } from "@/features/resources/lib/validations";
import { DatabaseTables } from "@/lib/database-meta.types";

export default async function HomeResourcePage(props: {
  params: Promise<{
    id: DatabaseTables;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const promises = Promise.all([
    loadTableSchema(id),
    loadColumnsSchema(id),
    loadResourceData(id, search),
  ]);

  return (
    <Suspense
      fallback={
        <DataTableSkeleton
          columnCount={7}
          rowCount={100}
          filterCount={2}
          cellWidths={[
            "64px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
            "170px",
          ]}
          shrinkZero
        />
      }
    >
      <ResourceTable promises={promises} />
    </Suspense>
  );
}
