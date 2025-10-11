import Link from "next/link";

import { FoldersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function StorageNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FoldersIcon />
          </EmptyMedia>
          <EmptyTitle>Bucket Not Found</EmptyTitle>
          <EmptyDescription>
            The storage bucket you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/storage">Back to Storage</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
