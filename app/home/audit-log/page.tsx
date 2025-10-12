import { AuditLogTable } from "@/features/audit-log/components/audit-log-table";
import { loadAuditLogs } from "@/features/audit-log/lib/loaders";
import { auditLogSearchParamsCache } from "@/features/audit-log/lib/validations";
import { withI18n } from "@/lib/i18n/with-i18n";
import { notFound } from "next/navigation";

interface AuditLogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function AuditLogPage(props: AuditLogPageProps) {
  const searchParams = await props.searchParams;
  const params = auditLogSearchParamsCache.parse(searchParams);

  const data = await loadAuditLogs(params);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <AuditLogTable data={data} />
    </div>
  );
}

export default withI18n(AuditLogPage);
