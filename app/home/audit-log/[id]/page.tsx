import { Metadata } from "next";

import { AuditLogDetailContainer } from "@/features/audit-log/components/audit-log-detail-container";
import { loadSingleAuditLog } from "@/features/audit-log/lib/loaders";

type AuditLogDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: AuditLogDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Audit Log ${id}`,
  };
}

async function AuditLogDetailPage({ params }: AuditLogDetailPageProps) {
  const { id } = await params;
  const auditLog = await loadSingleAuditLog(id);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <AuditLogDetailContainer auditLog={auditLog} />
    </div>
  );
}

export default AuditLogDetailPage;
