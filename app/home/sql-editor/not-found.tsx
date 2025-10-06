import Link from "next/link";

import { TerminalSquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function SqlEditorNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TerminalSquareIcon />
          </EmptyMedia>
          <EmptyTitle>SQL Snippet Not Found</EmptyTitle>
          <EmptyDescription>
            The SQL snippet you're looking for doesn't exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/sql-editor">Back to SQL Editor</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
