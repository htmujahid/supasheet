"use client";

import { use } from "react";

import { notFound } from "next/navigation";

import { loadSingleAuditLog } from "../lib/loaders";
import { AuditLogDetailView } from "./audit-log-detail-view";

interface AuditLogDetailContainerProps {
  promise: Promise<Awaited<ReturnType<typeof loadSingleAuditLog>>>;
}

export function AuditLogDetailContainer({
  promise,
}: AuditLogDetailContainerProps) {
  const auditLog = use(promise);

  if (!auditLog) {
    notFound();
  }

  return <AuditLogDetailView auditLog={auditLog} />;
}
