import { DefaultHeader } from "@/components/layouts/default-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResourceGalleryLoading() {
  return (
    <div className="w-full flex-1">
      <DefaultHeader breadcrumbs={[{ title: "..." }]} />

      <div className="px-4">
        <div className="flex flex-col gap-2">
          {/* Filter button skeleton */}
          <Skeleton className="h-9 w-20" />

          {/* Gallery grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Card key={item}>
                <CardHeader>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
                    <Skeleton className="h-full w-full" />
                    {/* Badge skeleton in top-right */}
                    <Skeleton className="absolute top-2 right-2 h-5 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Title skeleton */}
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  {/* Description skeleton */}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
