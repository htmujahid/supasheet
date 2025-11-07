import { Metadata } from "next";

import { notFound } from "next/navigation";

import { SearchParams } from "nuqs";

import { DefaultHeader } from "@/components/layouts/default-header";
import { ReportTable } from "@/features/report/components/report-table";
import {
  loadColumnsSchema,
  loadReportData,
} from "@/features/report/lib/loaders";
import { reportSearchParamsCache } from "@/features/report/lib/validations";
import { DatabaseSchemas, DatabaseViews } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ReportPageProps = {
  params: Promise<{
    schema: DatabaseSchemas;
    report: DatabaseViews<DatabaseSchemas>;
  }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { schema, report } = await params;

  return {
    title: `${formatTitle(report)} - ${formatTitle(schema)}`,
  };
}

async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { schema, report } = await params;

  const search = await reportSearchParamsCache.parse(searchParams);

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

export default ReportPage;
