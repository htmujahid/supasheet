import { Suspense } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLogDetailContainer } from "@/features/audit-log/components/audit-log-detail-container";
import { loadSingleAuditLog } from "@/features/audit-log/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

interface AuditLogDetailPageProps {
  params: Promise<{ id: string }>;
}

function AuditLogDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

async function AuditLogDetailPage(props: AuditLogDetailPageProps) {
  const { id } = await props.params;
  const auditLogPromise = loadSingleAuditLog(id);

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Suspense fallback={<AuditLogDetailSkeleton />}>
        <AuditLogDetailContainer promise={auditLogPromise} />
      </Suspense>
    </div>
  );
}

export default withI18n(AuditLogDetailPage);
