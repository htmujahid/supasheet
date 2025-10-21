import { DefaultHeader } from "@/components/layouts/default-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourceEditLoading() {
  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "..." }, { title: "View" }]} />
      <div className="mx-auto max-w-3xl p-4">
        <div className="bg-card border-border rounded-lg border p-6">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
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
    </div>
  );
}
