import Link from "next/link";

import { AreaChart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ChartNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AreaChart />
          </EmptyMedia>
          <EmptyTitle>Chart Not Found</EmptyTitle>
          <EmptyDescription>
            The chart you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/chart">Back to Charts</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
