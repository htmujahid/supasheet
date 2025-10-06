import Link from "next/link";

import { FileTextIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { loadReports } from "@/features/report/lib/loaders";
import { withI18n } from "@/lib/i18n/with-i18n";

async function ReportsPage({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const reports = await loadReports(group);

  if (!reports || reports.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>No Report Available</EmptyTitle>
            <EmptyDescription>
              No reports found for {group.replace("-", " ")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Link
          key={report.id}
          href={`/home/report/${group}/${report.view_name}`}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileTextIcon className="h-5 w-5" />
                <CardTitle>{report.name}</CardTitle>
                {report.is_active && <Badge variant="secondary">Active</Badge>}
              </div>
              {report.description && (
                <CardDescription>{report.description}</CardDescription>
              )}
            </CardHeader>
            {(report.filter_field || report.view_name) && (
              <CardContent>
                {report.filter_field && (
                  <div className="text-muted-foreground text-sm">
                    Filter: {report.filter_field}
                  </div>
                )}
                {report.view_name && (
                  <div className="text-muted-foreground text-sm">
                    View: {report.view_name}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default withI18n(ReportsPage);
