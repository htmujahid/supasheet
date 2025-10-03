import { Suspense } from "react";

import { AuditLogTable } from "@/features/audit-log/components/audit-log-table";
import { loadAuditLogs } from "@/features/audit-log/lib/loaders";
import { auditLogSearchParamsCache } from "@/features/audit-log/lib/validations";
import { DataTableSkeleton } from "@/interfaces/data-table/components/data-table-skeleton";
import { withI18n } from "@/lib/i18n/with-i18n";

interface AuditLogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function AuditLogPage(props: AuditLogPageProps) {
  const searchParams = await props.searchParams;
  const params = auditLogSearchParamsCache.parse(searchParams);

  const auditLogsPromise = loadAuditLogs(params);

  return (
    <div className="flex flex-col gap-4 px-4">
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={10}
            rowCount={50}
            filterCount={3}
            cellWidths={[
              "40px",
              "120px",
              "100px",
              "100px",
              "120px",
              "150px",
              "100px",
              "80px",
              "120px",
              "80px",
              "40px",
            ]}
            shrinkZero
          />
        }
      >
        <AuditLogTable promise={auditLogsPromise} />
      </Suspense>
    </div>
  );
}

export default withI18n(AuditLogPage);
