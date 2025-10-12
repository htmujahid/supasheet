import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatabaseTables } from "@/lib/database-meta.types";

import { loadWidget } from "../../lib/loaders";
import { DashboardWidgetsSchema } from "../../lib/types";

export async function Card2({ widget }: { widget: DashboardWidgetsSchema }) {
  const data = (
    await loadWidget(widget.view_name as DatabaseTables<"dashboards">)
  )?.[0];

  if (!data) {
    return null;
  }

  const primaryValue = data.primary ?? data.value ?? data.main ?? 0;
  const secondaryValue = data.secondary ?? data.sub ?? data.additional ?? 0;
  const primaryLabel = data.primary_label ?? "Primary";
  const secondaryLabel = data.secondary_label ?? "Secondary";

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-sm font-medium">{widget.name}</CardTitle>
          <CardDescription>{widget.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">{primaryLabel}</p>
            <p className="text-2xl font-bold">{primaryValue}</p>
          </div>
          <div className="space-y-1 border-l pl-3">
            <p className="text-muted-foreground text-xs">{secondaryLabel}</p>
            <p className="text-2xl font-bold">{secondaryValue}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
