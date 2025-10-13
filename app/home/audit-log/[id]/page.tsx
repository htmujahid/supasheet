import { AuditLogDetailContainer } from "@/features/audit-log/components/audit-log-detail-container";
import { loadSingleAuditLog } from "@/features/audit-log/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

interface AuditLogDetailPageProps {
  params: Promise<{ id: string }>;
}

async function AuditLogDetailPage(props: AuditLogDetailPageProps) {
  const { id } = await props.params;
  const auditLog = await loadSingleAuditLog(id);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <AuditLogDetailContainer auditLog={auditLog} />
    </div>
  );
}

export default withI18n(AuditLogDetailPage);
