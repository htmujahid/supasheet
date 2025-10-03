import { TrendingDown, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatabaseTables } from "@/lib/database-meta.types";

import { loadWidget } from "../../loaders";
import { DashboardWidgetsSchema } from "../../types";

export async function Card3({ widget }: { widget: DashboardWidgetsSchema }) {
  const data = (
    await loadWidget(widget.view_name as DatabaseTables<"dashboards">)
  )?.[0];

  if (!data) {
    return null;
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{widget.caption}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data.value}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {data.percent >= 0 ? (
              <TrendingUpIcon className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            {data.percent > 0 ? "+" : ""}
            {data.percent}%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">{widget.name}</div>
        <div className="text-muted-foreground">{widget.description}</div>
      </CardFooter>
    </Card>
  );
}
