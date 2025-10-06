import Link from "next/link";

import { Grid3X3Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ResourceNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Grid3X3Icon />
          </EmptyMedia>
          <EmptyTitle>Resource Not Found</EmptyTitle>
          <EmptyDescription>
            The table or resource you&apos;re looking for doesn&apos;t exist or has been removed.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/home/resource">Back to Resources</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
