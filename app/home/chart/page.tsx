import { AreaChart } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { withI18n } from "@/lib/i18n/with-i18n";

async function ChartPage() {
  return (
    <div className="flex min-h-[calc(100vh-183px)] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AreaChart />
          </EmptyMedia>
          <EmptyTitle>No Chart Selected</EmptyTitle>
          <EmptyDescription>
            Please select a chart from the sidebar to view its contents
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

export default withI18n(ChartPage);
