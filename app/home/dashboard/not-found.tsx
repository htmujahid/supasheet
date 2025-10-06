import Link from "next/link";

import { WarehouseIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <WarehouseIcon />
          </EmptyMedia>
          <EmptyTitle>Dashboard Not Found</EmptyTitle>
          <EmptyDescription>
            The dashboard you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/dashboard">Back to Dashboards</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
