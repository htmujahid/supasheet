import { Skeleton } from "@/components/ui/skeleton";

export default function ResourceCreateLoading() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="bg-card border-border rounded-lg border p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
