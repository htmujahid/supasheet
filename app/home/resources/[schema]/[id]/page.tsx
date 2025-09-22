import { Suspense } from "react";

import { ResourceTable } from "@/features/resources/components/resource-table";
import {
  loadColumnsSchema,
  loadResourceData,
  loadTableSchema,
} from "@/features/resources/lib/loaders";
import { searchParamsCache } from "@/features/resources/lib/validations";
import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/makerkit/app-breadcrumbs";

export default async function HomeResourcePage(props: {
  params: Promise<{
    schema: string;
    id: string;
  }>;
  searchParams: Promise<{
    page: string;
    perPage: string;
  }>;
}) {
  const { id, schema } = await props.params as {
    schema: DatabaseSchemas;
    id: DatabaseTables<typeof schema>;
  };
  const searchParams = await props.searchParams;
  const search = searchParamsCache.parse(searchParams);

  const promises = Promise.all([
    loadTableSchema(id),
    loadColumnsSchema(id),
    loadResourceData(schema, id, search),
  ]);

  return (
    <div className="px-4">
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
    </div>
  );
}
