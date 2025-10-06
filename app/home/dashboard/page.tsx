import { WarehouseIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { withI18n } from "@/lib/i18n/with-i18n";

async function HomeDashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <WarehouseIcon />
          </EmptyMedia>
          <EmptyTitle>No Dashboard Selected</EmptyTitle>
          <EmptyDescription>
            Please select a dashboard from the sidebar to view its contents.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

export default withI18n(HomeDashboardPage);
