import { DynamicIcon } from "lucide-react/dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatabaseTables } from "@/lib/database-meta.types";

import { loadWidget } from "../../loaders";
import { DashboardWidgetsSchema } from "../../types";

export async function Card1({ widget }: { widget: DashboardWidgetsSchema }) {
  const widgetData = (
    await loadWidget(widget.view_name as DatabaseTables<"dashboards">)
  )?.[0];

  if (!widgetData) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{widget.name}</CardTitle>
          <CardDescription>{widget.description}</CardDescription>
        </div>
        <DynamicIcon
          name={widgetData.icon as never}
          className="text-muted-foreground relative z-10 h-4 w-4"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{widgetData?.value}</div>
        <p className="text-muted-foreground text-xs">{widgetData?.label}</p>
      </CardContent>
    </Card>
  );
}
