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

async function ReportsPage({
  params,
}: {
  params: Promise<{ schema: string }>;
}) {
  const { schema } = await params;
  const reports = await loadReports(schema);

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
              No reports found for {schema.replace("-", " ")}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-4 md:grid-cols-2">
      {reports.map((report) => (
        <Link
          key={report.view_name}
          href={`/home/${schema}/report/${report.view_name}`}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileTextIcon className="h-5 w-5" />
                <CardTitle>{report.name}</CardTitle>
                <Badge variant="secondary">Active</Badge>
              </div>
              {report.description && (
                <CardDescription>{report.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {report.view_name && (
                <div className="text-muted-foreground text-sm">
                  View: {report.view_name}
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default withI18n(ReportsPage);
