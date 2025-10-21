import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { loadWidget } from "../lib/loaders";
import { DashboardWidgetsSchema } from "../lib/types";

export async function Card4({ widget }: { widget: DashboardWidgetsSchema }) {
  const data = (await loadWidget(widget.schema, widget.view_name))?.[0];

  if (!data) {
    return null;
  }

  const current = data.current ?? data.value ?? 0;
  const total = data.total ?? data.max ?? 100;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardDescription>{widget.name}</CardDescription>
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-3xl font-bold">{current}</CardTitle>
          <span className="text-muted-foreground text-sm">/ {total}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2" />
        <p className="text-muted-foreground mt-2 text-xs">
          {percentage}% {widget.description}
        </p>
      </CardContent>
    </Card>
  );
}
