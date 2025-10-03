"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ChartsSchema } from "../lib/types";

export function AreaChartWidget({
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

  // First column is x-axis, rest are y-axis numeric values
  const firstItem = data[0];
  const allKeys = Object.keys(firstItem);
  const xAxisKey = allKeys[0]; // First column is always x-axis

  // All remaining columns that have numeric values are y-axis
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

  // Build chart config with proper color format matching shadcn example
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
    const processed: any = { [xAxisKey]: item[xAxisKey] };
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
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            {keys.map((key) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`var(--color-${key})`}
                fillOpacity={0.4}
                stroke={`var(--color-${key})`}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        {chart.caption && (
          <p className="text-muted-foreground mt-2 text-xs">{chart.caption}</p>
        )}
      </CardContent>
    </Card>
  );
}
