"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

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

export function RadarChartWidget({
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

  // First column is axis label, rest are numeric values for radar points
  const firstItem = data[0];
  const allKeys = Object.keys(firstItem);
  const axisKey = allKeys[0]; // First column is always the axis label

  // All remaining columns that have numeric values are radar metrics
  const keys = allKeys.slice(1).filter((k) => {
    const value = firstItem[k];
    // Check if it's a number or can be converted to a number
    return !isNaN(Number(value));
  });

  // If no numeric keys found, return error
  if (keys.length === 0) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>{chart.name}</CardTitle>
          <CardDescription>{chart.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No numeric data found</p>
        </CardContent>
      </Card>
    );
  }

  // Build chart config with proper color format
  const chartConfig: ChartConfig = {} as ChartConfig;
  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  keys.forEach((key, index) => {
    chartConfig[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      color: chartColors[index % chartColors.length],
    };
  });

  // Process data to ensure all numeric values are numbers
  const chartData = data.map((item) => {
    const processed: any = { [axisKey]: item[axisKey] };
    keys.forEach((key) => {
      processed[key] = Number(item[key]) || 0;
    });
    return processed;
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{chart.name}</CardTitle>
        <CardDescription>{chart.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey={axisKey} />
            <PolarGrid />
            {keys.map((key) => (
              <Radar
                key={key}
                dataKey={key}
                fill={`var(--color-${key})`}
                fillOpacity={0.6}
              />
            ))}
          </RadarChart>
        </ChartContainer>
        {chart.caption && (
          <p className="text-muted-foreground mt-2 text-xs">{chart.caption}</p>
        )}
      </CardContent>
    </Card>
  );
}
