import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { XIcon } from "lucide-react"

import { FilePreviewDrawer } from "#/components/storage/file-preview-drawer"
import { Button } from "#/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
} from "#/components/ui/drawer"
import { Separator } from "#/components/ui/separator"
import { Skeleton } from "#/components/ui/skeleton"
import type { FileObject } from "#/lib/supabase/data/storage"
import { storageFilesQueryOptions } from "#/lib/supabase/data/storage"

import { Route as BucketRoute } from "./route"

export const Route = createFileRoute("/storage/$bucketId/$")({
  loader: async ({
    context,
    params: { bucketId, _splat },
  }): Promise<{ data: { file: FileObject | null } }> => {
    const segments = (_splat ?? "").split("/").filter(Boolean)
    const fileName = segments[segments.length - 1]
    const folderPathStr = segments.slice(0, -1).join("/")
    const files = await context.queryClient.ensureQueryData(
      storageFilesQueryOptions(bucketId, folderPathStr)
    )
    const file = files.find((f) => f.name === fileName) ?? null
    return { data: { file } }
  },
  head: ({ params }) => {
    const segments = (params._splat ?? "").split("/").filter(Boolean)
    const name = segments[segments.length - 1] ?? params.bucketId
    return { meta: [{ title: `${name} | Storage | Supasheet` }] }
  },
  pendingComponent: () => (
    <Drawer open direction="right">
      <DrawerContent className="flex flex-col gap-0 p-0 sm:max-w-md">
        <DrawerHeader className="flex flex-row items-center justify-between p-4 pb-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="font-heading text-base leading-snug font-medium">
              <Skeleton className="h-5 w-40" />
            </div>
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Skeleton className="size-8 rounded-md" />
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <Separator />
        <div className="flex max-h-72 min-h-48 items-center justify-center bg-muted/30 p-4">
          <Skeleton className="h-48 w-full max-w-xs rounded-md" />
        </div>
        <Separator />
        <div className="space-y-3 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { bucketId, _splat } = Route.useParams()
  const { data } = Route.useLoaderData()
  const { bucket } = BucketRoute.useLoaderData()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate({ to: "/storage/$bucketId", params: { bucketId }, replace: true })
  }

  return (
    <FilePreviewDrawer
      open
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
      bucketId={bucketId}
      isPublic={bucket.isPublic}
      file={data.file}
      filePath={_splat ?? ""}
      onSuccess={handleClose}
    />
  )
}
