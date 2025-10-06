import { Grid3X3Icon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeResourcesPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Grid3X3Icon />
          </EmptyMedia>
          <EmptyTitle>No Resource Selected</EmptyTitle>
          <EmptyDescription>
            Please select a table from the sidebar to view its contents or create
            a new record.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

export default withI18n(HomeResourcesPage);
