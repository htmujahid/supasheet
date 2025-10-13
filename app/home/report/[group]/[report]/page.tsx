import { Suspense } from "react";

import { notFound } from "next/navigation";

import type { SearchParams } from "nuqs/server";

import { ReportTable } from "@/features/report/components/report-table";
import {
  loadColumnsSchema,
  loadReportData,
} from "@/features/report/lib/loaders";
import { reportSearchParamsCache } from "@/features/report/lib/validations";
import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";
import { DatabaseTables } from "@/lib/database-meta.types";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcePage(props: {
  params: Promise<{
    report: DatabaseTables<"reports">;
  }>;
  searchParams: Promise<SearchParams>;
}) {
  const { report } = await props.params;

  const searchParams = await props.searchParams;
  const search = reportSearchParamsCache.parse(searchParams);

  const [columnsSchema, data] = await Promise.all([
    loadColumnsSchema(report),
    loadReportData(report, search),
  ]);

  if (!columnsSchema || !data) {
    notFound();
  }

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
        <ReportTable columnsSchema={columnsSchema} data={data} />
      </Suspense>
    </div>
  );
}

export default withI18n(HomeResourcePage);
