import { notFound } from "next/navigation";

import type { SearchParams } from "nuqs/server";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ReportTable } from "@/features/report/components/report-table";
import {
  loadColumnsSchema,
  loadReportData,
} from "@/features/report/lib/loaders";
import { reportSearchParamsCache } from "@/features/report/lib/validations";
import { DatabaseSchemas, DatabaseTables } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcePage(props: {
  params: Promise<{
    schema: DatabaseSchemas;
    report: DatabaseTables<DatabaseSchemas>;
  }>;
  searchParams: Promise<SearchParams>;
}) {
  const { schema, report } = await props.params;

  const searchParams = await props.searchParams;
  const search = reportSearchParamsCache.parse(searchParams);

  const [columnsSchema, data] = await Promise.all([
    loadColumnsSchema(report),
    loadReportData(schema, report, search),
  ]);

  if (!columnsSchema?.length) {
    notFound();
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader
        breadcrumbs={[
          { title: "Report", url: "." },
          { title: formatTitle(report) },
        ]}
      />
      <div className="px-4">
        <ReportTable columnsSchema={columnsSchema} data={data} />
      </div>
    </div>
  );
}

export default withI18n(HomeResourcePage);
