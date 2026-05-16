import { Skeleton } from "#/components/ui/skeleton"

export function ResourceFormDrawerSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  )
}
