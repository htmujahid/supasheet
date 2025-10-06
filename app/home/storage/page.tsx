import { FoldersIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { withI18n } from "@/lib/i18n/with-i18n";

function UsersPage() {
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

export default withI18n(UsersPage);
