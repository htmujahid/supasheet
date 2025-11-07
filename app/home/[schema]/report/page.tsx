import { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { FileTextIcon } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadReports } from "@/features/report/lib/loaders";
import { DatabaseSchemas } from "@/lib/database-meta.types";
import { formatTitle } from "@/lib/format";

type ReportsPageProps = {
  params: Promise<{ schema: DatabaseSchemas }>;
};

export async function generateMetadata({
  params,
}: ReportsPageProps): Promise<Metadata> {
  const { schema } = await params;

  return {
    title: `Reports - ${formatTitle(schema)}`,
  };
}

async function ReportsPage({ params }: ReportsPageProps) {
  const { schema } = await params;
  const reports = await loadReports(schema);

  if (!reports || reports.length === 0) {
    notFound();
  }

  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "Report" }]} />
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
    </div>
  );
}

export default ReportsPage;
