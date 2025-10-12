import { Skeleton } from "@/components/ui/skeleton";

export default function ChartLoading() {
  return (
    <div className="mx-auto grid max-w-6xl gap-2.5 p-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card border-border rounded-lg border p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="mb-2 h-8 w-32" />
          <Skeleton className="h-4 w-20" />
          <div className="mt-4">
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
