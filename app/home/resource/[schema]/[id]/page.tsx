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

  const promises = Promise.all([
    loadTableSchema(schema, id),
    loadColumnsSchema(schema, id),
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

export default withI18n(HomeResourcePage);
