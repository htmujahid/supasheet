import { Progress } from "@/components/ui/progress";

export function PercentageCell({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="w-[calc(100%-50px)]" />
      {value}%
    </div>
  );
}
