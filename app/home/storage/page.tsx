import { Metadata } from "next";

import { FoldersIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "Storage",
};

function StoragePage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FoldersIcon />
          </EmptyMedia>
          <EmptyTitle>No Bucket Selected</EmptyTitle>
          <EmptyDescription>
            Please select a bucket from the sidebar to view its contents.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

export default StoragePage;
