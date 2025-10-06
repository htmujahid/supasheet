import Link from "next/link";

import { FileChartColumnIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ReportNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileChartColumnIcon />
          </EmptyMedia>
          <EmptyTitle>Report Not Found</EmptyTitle>
          <EmptyDescription>
            The report you're looking for doesn't exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/report">Back to Reports</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
