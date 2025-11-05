import { Skeleton } from "@/components/ui/skeleton";

export default function StorageBucketLoading() {
  return (
    <div className="flex h-[calc(100vh-3rem)] flex-grow p-4">
      <div className="bg-card border-border flex w-full flex-col rounded-lg border">
        {/* Toolbar */}
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="border-border border-b p-4">
          <Skeleton className="h-5 w-64" />
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-5 flex-1" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
