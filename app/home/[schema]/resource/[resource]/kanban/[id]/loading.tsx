import { DefaultHeader } from "@/components/layouts/default-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanLoading() {
  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "..." }]} />

      <div className="px-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
          </div>

          <div className="flex items-center gap-1 rounded-md border p-1">
            <Skeleton className="h-7 w-8 rounded-sm" />
            <Skeleton className="h-7 w-8 rounded-sm" />
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4].map((column) => (
            <div
              key={column}
              className="bg-muted/50 flex flex-1 flex-col gap-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8" />
              </div>

              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="bg-card rounded-lg border p-3 shadow-sm"
                >
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />

                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
