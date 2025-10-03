import { Database } from "@/lib/database.types";

export type ChartsSchema = Database["supasheet"]["Tables"]["charts"]["Row"];

export type ChartType = "area" | "bar" | "line" | "pie" | "radar";

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export interface ChartConfig {
  type: ChartType;
  data: ChartData;
  options?: any;
}
