"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ChartsSchema } from "../lib/types";

export function PieChartWidget({
  chart,
  data,
}: {
  chart: ChartsSchema;
  data: any[] | null;
}) {
  if (!data || data.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{chart.name}</CardTitle>
          <CardDescription>{chart.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // First column is label, second column is value for pie charts
  const firstItem = data[0];
  const allKeys = Object.keys(firstItem);
  const labelKey = allKeys[0]; // First column is label
  const valueKey = allKeys[1] || allKeys[0]; // Second column is value, fallback to first if only one column

  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  const chartConfig: ChartConfig = {} as ChartConfig;
  const chartData = data.map((item, index) => {
    const label = String(item[labelKey]);
    const value = Number(item[valueKey]) || 0;
    const colorVar = `chart-${(index % 5) + 1}`;

    chartConfig[label] = {
      label: label,
      color: chartColors[index % chartColors.length],
    };

    return {
      name: label,
      value: value,
      fill: `var(--color-${label})`,
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{chart.name}</CardTitle>
        <CardDescription>{chart.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            />
          </PieChart>
        </ChartContainer>
        {chart.caption && (
          <p className="text-muted-foreground mt-2 text-xs">{chart.caption}</p>
        )}
      </CardContent>
    </Card>
  );
}
