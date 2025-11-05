import { Metadata } from "next";

import { notFound } from "next/navigation";

import { AuditLogTable } from "@/features/audit-log/components/audit-log-table";
import { loadAuditLogs } from "@/features/audit-log/lib/loaders";
import { auditLogSearchParamsCache } from "@/features/audit-log/lib/validations";

export const metadata: Metadata = {
  title: "Audit Logs",
};

type AuditLogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function AuditLogPage({ searchParams }: AuditLogPageProps) {
  const params = auditLogSearchParamsCache.parse(await searchParams);

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

export default AuditLogPage;
