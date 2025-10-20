import { Skeleton } from "@/components/ui/skeleton";

export default function ResourceDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex flex-col gap-4">
        {/* Resource Details Card */}
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-20" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-card border-border rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>

        {/* Foreign Key Data Card */}
        <div className="bg-card border-border rounded-lg border p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
