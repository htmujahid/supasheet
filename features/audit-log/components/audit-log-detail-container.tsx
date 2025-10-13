"use client";

import { loadSingleAuditLog } from "../lib/loaders";
import { AuditLogDetailView } from "./audit-log-detail-view";

interface AuditLogDetailContainerProps {
  auditLog: Awaited<ReturnType<typeof loadSingleAuditLog>>;
}

export function AuditLogDetailContainer({
  auditLog,
}: AuditLogDetailContainerProps) {
  return <AuditLogDetailView auditLog={auditLog!} />;
}
