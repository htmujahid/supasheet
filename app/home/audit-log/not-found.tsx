import Link from "next/link";

import { ScrollTextIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function AuditLogNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ScrollTextIcon />
          </EmptyMedia>
          <EmptyTitle>Audit Log Not Found</EmptyTitle>
          <EmptyDescription>
            The audit log entry you&apos;re looking for doesn&apos;t exist or
            has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/audit-log">Back to Audit Logs</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
